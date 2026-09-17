import os
import httpx
from enum import Enum
from datetime import datetime

class AlertLevel(str, Enum):
    INFO = "INFO"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"

class AlertPayload:
    def __init__(self, title: str, body: str, level: AlertLevel, data: dict = None):
        self.title = title
        self.body = body
        self.level = level
        self.data = data or {}
        self.timestamp = datetime.utcnow().isoformat()

LEVEL_EMOJI = {
    AlertLevel.INFO: "ℹ️",
    AlertLevel.WARNING: "⚠️",
    AlertLevel.CRITICAL: "🚨",
}

class TelegramAlerter:
    """Sends alerts to a Telegram bot channel."""

    def __init__(self):
        self.bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
        self.chat_id = os.environ.get("TELEGRAM_CHAT_ID", "")
        self.enabled = bool(self.bot_token and self.chat_id)

    def send(self, payload: AlertPayload) -> bool:
        if not self.enabled:
            print(f"[ALERT STUB] {payload.level}: {payload.title} — {payload.body}")
            return False

        emoji = LEVEL_EMOJI.get(payload.level, "📢")
        lines = [
            f"{emoji} *LAO_AI_INVESTMENT_OS*",
            f"*{payload.title}*",
            f"",
            payload.body,
        ]
        if payload.data:
            for k, v in payload.data.items():
                lines.append(f"  • {k}: `{v}`")
        lines.append(f"\n_{payload.timestamp} UTC_")

        message = "\n".join(lines)
        url = f"https://api.telegram.org/bot{self.bot_token}/sendMessage"

        try:
            response = httpx.post(url, json={
                "chat_id": self.chat_id,
                "text": message,
                "parse_mode": "Markdown",
            }, timeout=10.0)
            return response.status_code == 200
        except Exception as e:
            print(f"Telegram alert failed: {e}")
            return False


class AlertService:
    """
    Central alert dispatcher. Extend with email/Slack by adding more senders.
    """
    _telegram = TelegramAlerter()

    @classmethod
    def emergency_mode(cls, symbol: str, volatility_pct: float, risk_score: float):
        cls._telegram.send(AlertPayload(
            title="Emergency Mode Activated",
            body=f"All new BUY trades blocked due to extreme market conditions.",
            level=AlertLevel.CRITICAL,
            data={
                "Symbol": symbol,
                "Volatility": f"{volatility_pct:.1f}%",
                "Risk Score": f"{risk_score:.0f}/100",
                "Action": "ALL NEW TRADES BLOCKED",
            }
        ))

    @classmethod
    def data_provider_down(cls, provider: str, fallback: str):
        cls._telegram.send(AlertPayload(
            title="Data Provider Failover",
            body=f"{provider} is unreachable. Switched to {fallback}.",
            level=AlertLevel.WARNING,
            data={"Primary": provider, "Fallback": fallback}
        ))

    @classmethod
    def trade_closed(cls, symbol: str, result: str, pnl_pct: float, order_id: str):
        level = AlertLevel.INFO if result == "WIN" else AlertLevel.WARNING
        cls._telegram.send(AlertPayload(
            title=f"Trade {result}: {symbol}",
            body=f"Paper trade closed with {'+' if pnl_pct >= 0 else ''}{pnl_pct:.2f}%.",
            level=level,
            data={"Order": order_id[:8], "Symbol": symbol, "PnL": f"{pnl_pct:+.2f}%"}
        ))

    @classmethod
    def production_gate_passed(cls):
        cls._telegram.send(AlertPayload(
            title="Production Gates PASSED ✅",
            body="All metrics meet production thresholds. System is eligible for Phase 13 deployment.",
            level=AlertLevel.INFO,
        ))

    @classmethod
    def admin_lock_activated(cls, reason: str = "Manual override"):
        cls._telegram.send(AlertPayload(
            title="ADMIN_LOCK Activated",
            body=f"Learning System halted. Weight updates frozen.",
            level=AlertLevel.CRITICAL,
            data={"Reason": reason}
        ))
