"""
Alert Manager Service
Manages alert lifecycle, prevents duplicates, and triggers ElevenLabs conversation
"""
import time
import threading
from typing import Optional, Dict
from utils.logger import setup_logger
import config
import requests

logger = setup_logger(__name__)


class AlertManager:
    """
    Manages emergency alerts and prevents duplicate triggers
    """
    
    def __init__(self):
        self.active_alert: Optional[Dict] = None
        self.last_alert_time: Optional[float] = None
        self.alert_history = []
        self.lock = threading.Lock()
        
        logger.info("AlertManager initialized")
        logger.info(f"Cooldown period: {config.ALERT_COOLDOWN_PERIOD}s")
    
    def trigger_alert(self, vitals_data: Dict) -> bool:
        """
        Trigger an emergency alert
        
        Args:
            vitals_data: Vital signs data that triggered the alert
        
        Returns:
            True if alert was triggered, False if blocked (cooldown/duplicate)
        """
        with self.lock:
            # Check if alert already active
            if self.active_alert:
                logger.warning("Alert already active - ignoring trigger")
                return False
            
            # Check cooldown period
            if self.last_alert_time:
                time_since_last = time.time() - self.last_alert_time
                if time_since_last < config.ALERT_COOLDOWN_PERIOD:
                    remaining = config.ALERT_COOLDOWN_PERIOD - time_since_last
                    logger.warning(f"Alert in cooldown - {remaining:.0f}s remaining")
                    return False
            
            # Create alert
            alert = {
                'id': int(time.time()),
                'vitals': vitals_data.copy(),
                'triggered_at': time.time(),
                'status': 'active',
                'patient_response': None
            }
            
            self.active_alert = alert
            self.last_alert_time = time.time()
            
            logger.error(f"🚨 ALERT #{alert['id']} TRIGGERED")
            logger.error(f"   Pulse: {vitals_data.get('pulse_rate')} BPM")
            logger.error(f"   Breathing: {vitals_data.get('breathing_rate')} BPM")
            
            # Start ElevenLabs conversation in background
            threading.Thread(
                target=self._start_conversation,
                args=(alert,),
                daemon=True
            ).start()
            
            return True
        
    def trigger_external_conversation(self, vitals):
        url = "http://localhost:7000/api/trigger-alert"
        
        payload = {
            "patient_id": "12345",    # adjust if dynamic
            "vitals": {
                "heart_rate": vitals.get("pulse_rate"),
                "breathing_rate": vitals.get("breathing_rate"),
                "pulse_confidence": vitals.get("pulse_confidence"),
                "breathing_confidence": vitals.get("breathing_confidence")
            }
        }

        try:
            response = requests.post(url, json=payload, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error contacting emergency conversation server: {e}")
            return {"error": str(e)}
    
    def _start_conversation(self, alert: Dict):
        """
        Start ElevenLabs conversation (runs in separate thread)
        """
        try:
            logger.info(f"Starting ElevenLabs conversation for alert #{alert['id']}")
            
            # Start conversation and get patient response
            response = self.trigger_external_conversation(alert['vitals'])
            
            logger.info(f"Patient response: {response}")
            
            # Update alert with response
            with self.lock:
                if self.active_alert and self.active_alert['id'] == alert['id']:
                    self.active_alert['patient_response'] = response
                    self.active_alert['status'] = 'resolved'
                    
                    # Move to history
                    self.alert_history.append(self.active_alert.copy())
                    self.active_alert = None
            
            # Handle the action
            from services.action_handler import handle_action
            handle_action(response, alert['vitals'])
            
        except Exception as e:
            logger.error(f"Error in conversation: {e}", exc_info=True)
            with self.lock:
                if self.active_alert:
                    self.active_alert['status'] = 'error'
                    self.active_alert['error'] = str(e)
                    self.alert_history.append(self.active_alert.copy())
                    self.active_alert = None
    
    def get_active_alert(self) -> Optional[Dict]:
        """Get currently active alert"""
        with self.lock:
            return self.active_alert.copy() if self.active_alert else None
    
    def get_alert_history(self, limit: int = 10) -> list:
        """Get recent alert history"""
        with self.lock:
            return self.alert_history[-limit:]
    
    def clear_active_alert(self):
        """Manually clear active alert (for testing)"""
        with self.lock:
            if self.active_alert:
                logger.info(f"Manually clearing alert #{self.active_alert['id']}")
                self.alert_history.append(self.active_alert.copy())
                self.active_alert = None
