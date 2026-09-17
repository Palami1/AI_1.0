import threading
import time
from datetime import datetime
from app.learning.evaluator import OutcomeEvaluator

class LearningScheduler:
    """
    Runs background jobs for the AI Learning System.
    """
    
    @staticmethod
    def _evaluation_job():
        while True:
            # Run at midnight or periodically
            now = datetime.utcnow()
            if now.hour == 0 and now.minute == 0:
                print(f"[{now.isoformat()}] Running AI Prediction Outcome Evaluator...")
                OutcomeEvaluator.evaluate_pending_predictions()
                # Sleep for a while to avoid triggering multiple times in the same minute
                time.sleep(3600) 
            else:
                # Check every minute
                time.sleep(60)
                
    @staticmethod
    def start():
        """
        Starts the background scheduler thread.
        In production, Celery or APScheduler is recommended over raw threading.
        """
        thread = threading.Thread(target=LearningScheduler._evaluation_job, daemon=True)
        thread.start()
        print("Learning Scheduler started in background.")
