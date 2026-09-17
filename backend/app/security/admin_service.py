import os
from sqlalchemy.orm import Session
from app.models.base import AuditLog, User
from app.monitoring.alerts import AlertService

class AdminService:
    """
    Handles administrative actions with built-in audit trails.
    """

    @staticmethod
    def log_audit(db: Session, admin_id: str, action: str, details: str, before: str = None, after: str = None):
        """Creates an immutable audit log entry."""
        log = AuditLog(
            admin_id=admin_id,
            action=action,
            details=details,
            before_state=before,
            after_state=after
        )
        db.add(log)
        db.commit()

    @staticmethod
    def emergency_kill_switch(db: Session, admin_id: str) -> dict:
        """
        Immediately halts all new trades across the system.
        """
        # 1. Update environment flag for global block
        os.environ["KILL_SWITCH_ACTIVE"] = "true"
        
        # 2. Log Audit securely
        AdminService.log_audit(
            db=db,
            admin_id=admin_id,
            action="EMERGENCY_STOP",
            details="Activated Global Trading Kill Switch",
            before="ACTIVE",
            after="HALTED"
        )
        
        # 3. Fire Critical Alert
        AlertService.admin_lock_activated(reason="Emergency Kill Switch activated by Admin. All AI signals overridden to WAIT.")
        
        return {"status": "HALTED", "message": "Kill switch engaged. System is now safe."}
