from sqlalchemy import func
from typing import Dict
from app.database.session import SessionLocal
from app.models.base import AgentPerformance, AgentWeightHistory
from app.learning.weight_guard import WeightGuard

class WeightOptimizer:
    """
    Reads accumulated Agent Performance scores and calculates adjusted weights.
    Applies adjustments only after passing WeightGuard safety checks.
    """
    
    @staticmethod
    def calculate_agent_score(accuracy: float, avg_reward: float, consistency: float) -> float:
        """
        Composite Agent Score Formula:
          Score = (Accuracy × 50%) + (Reward Score × 30%) + (Consistency × 20%)
        """
        return (accuracy * 0.50) + (avg_reward * 0.30) + (consistency * 0.20)
    
    @staticmethod
    def get_agent_stats(db, agent_name: str) -> dict:
        """
        Queries DB for the agent's recent performance over all resolved predictions.
        """
        records = db.query(AgentPerformance).filter(
            AgentPerformance.agent_name == agent_name,
            AgentPerformance.actual_result != "PENDING"
        ).all()
        
        count = len(records)
        if count == 0:
            return {"count": 0, "accuracy": 0.0, "avg_reward": 0.0, "consistency": 0.0}
        
        wins = sum(1 for r in records if r.accuracy_score and r.accuracy_score > 0)
        accuracy = wins / count
        
        avg_reward = sum(r.accuracy_score for r in records if r.accuracy_score) / count
        
        # Consistency: How close are the individual rewards to the average? (inverse of std dev)
        # Simple version: ratio of non-zero predictions (non-neutral outcomes)
        non_neutral = sum(1 for r in records if r.actual_result != "NEUTRAL")
        consistency = non_neutral / count if count > 0 else 0.0
        
        return {
            "count": count,
            "accuracy": accuracy,
            "avg_reward": avg_reward,
            "consistency": consistency
        }
    
    @staticmethod
    def optimize(current_weights: Dict[str, float]) -> Dict[str, float]:
        """
        Main optimization loop. Returns a new weights dictionary.
        If any check fails, returns the original weights unchanged (safe fallback).
        """
        db = SessionLocal()
        try:
            agent_names = list(current_weights.keys())
            proposed_weights = dict(current_weights) # Start from current
            weight_changes = []
            
            # 1. Calculate new weight for each agent
            for name in agent_names:
                stats = WeightOptimizer.get_agent_stats(db, name)
                
                # Safety: skip if not enough data
                if stats["count"] < WeightGuard.MIN_PREDICTIONS_REQUIRED:
                    continue
                
                composite_score = WeightOptimizer.calculate_agent_score(
                    stats["accuracy"],
                    stats["avg_reward"],
                    stats["consistency"]
                )
                
                current_w = current_weights[name]
                
                # Agents with higher composite score gain weight, lower ones lose weight
                # Score > 0.6 = good performer, < 0.4 = poor performer
                if composite_score > 0.60:
                    adjustment = min(0.025, WeightGuard.MAX_ADJUSTMENT_PER_CYCLE / 2)
                elif composite_score < 0.40:
                    adjustment = -min(0.025, WeightGuard.MAX_ADJUSTMENT_PER_CYCLE / 2)
                else:
                    adjustment = 0.0  # Neutral performance = no change
                    
                proposed_weights[name] = round(current_w + adjustment, 4)
                weight_changes.append((name, current_w, proposed_weights[name], composite_score, stats))
            
            # 2. Normalize so total = exactly 100%
            total = sum(proposed_weights.values())
            if abs(total - 1.0) > WeightGuard.WEIGHT_SUM_TOLERANCE:
                # Distribute remainder proportionally
                diff = 1.0 - total
                largest_agent = max(proposed_weights, key=proposed_weights.get)
                proposed_weights[largest_agent] = round(proposed_weights[largest_agent] + diff, 4)
            
            # 3. Validate each change individually through WeightGuard
            final_weights = dict(current_weights)  # Default: no change
            for name, old_w, new_w, score, stats in weight_changes:
                check = WeightGuard.validate(
                    agent_name=name,
                    current_weight=old_w,
                    proposed_weight=new_w,
                    prediction_count=stats["count"],
                    all_proposed_weights=proposed_weights
                )
                
                if check["valid"]:
                    final_weights[name] = new_w
                    # 4. Write to history DB
                    WeightOptimizer._record_weight_change(db, name, old_w, new_w, check["reason"], score)
                    
            db.commit()
            return final_weights
            
        except Exception as e:
            db.rollback()
            print(f"WeightOptimizer error: {e}")
            return current_weights  # SAFE FALLBACK: return original weights
        finally:
            db.close()
    
    @staticmethod
    def rollback(agent_name: str) -> float:
        """
        Reverts an agent's weight to its previous value from history.
        """
        db = SessionLocal()
        try:
            history = db.query(AgentWeightHistory).filter(
                AgentWeightHistory.agent_name == agent_name
            ).order_by(AgentWeightHistory.created_at.desc()).offset(1).first()  # Second to last = previous
            
            if history:
                return history.new_weight
            return None
        finally:
            db.close()
    
    @staticmethod
    def _record_weight_change(db, agent_name: str, old_weight: float, new_weight: float, reason: str, score: float):
        entry = AgentWeightHistory(
            agent_name=agent_name,
            old_weight=old_weight,
            new_weight=new_weight,
            reason=reason,
            performance_score=score
        )
        db.add(entry)
