from typing import Dict, Any, List

class ExplainabilityLayer:
    """
    Generates human-readable, structured explanations for every AI decision.
    Critical for User Trust — investors must understand WHY, not just WHAT.
    """
    
    @staticmethod
    def build_explanation(
        action: str,
        confidence: float,
        risk: str,
        agent_votes: Dict[str, Dict],
        evidence: List[str],
        weakness: List[str]
    ) -> Dict[str, Any]:
        """
        Transforms raw agent votes and scores into a structured explanation.
        """
        supporting = []
        opposing = []
        
        for name, vote_data in agent_votes.items():
            label = f"{name.title()} Agent"
            reason = vote_data.get("reason", "")
            agent_vote = vote_data.get("vote", "WAIT")
            
            if agent_vote == action:
                supporting.append({"agent": label, "reason": reason, "confidence": vote_data.get("confidence", 0)})
            else:
                opposing.append({"agent": label, "reason": reason, "confidence": vote_data.get("confidence", 0)})
        
        # Determine recommendation text
        if action == "BUY":
            recommendation = "Consider entering a position with strict position sizing and a pre-defined stop loss."
        elif action == "SELL":
            recommendation = "Consider reducing or closing the position. Confirm with your risk profile."
        else:
            recommendation = "Stay on the sidelines. Preserve capital and wait for a cleaner setup."
        
        return {
            "action": action,
            "confidence": confidence,
            "risk_level": risk,
            "explanation": {
                "summary": f"AI recommends {action} with {confidence:.0f}% confidence based on {len(supporting)} supporting agents.",
                "supporting_agents": supporting,
                "opposing_agents": opposing,
                "key_evidence": evidence,
                "key_weaknesses": weakness,
                "recommendation": recommendation
            },
            "disclaimer": "ນີ້ບໍ່ແມ່ນຄຳແນະນຳການລົງທຶນ. AI ສະໜອງຂໍ້ມູນຊ່ວຍຕັດສິນໃຈເທົ່ານັ້ນ. ທ່ານຕ້ອງຮັບຜິດຊອບການຕັດສິນໃຈດ້ວຍຕົວເອງ."
        }
