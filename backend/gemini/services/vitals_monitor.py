"""
Vitals Monitor Service
Continuously monitors incoming vitals and detects abnormal patterns
"""
import time
import threading
from typing import Optional, Dict
from utils.logger import setup_logger
import config

logger = setup_logger(__name__)


class VitalsMonitor:
    """
    Monitors vital signs and triggers alerts when abnormalities are detected
    """
    
    def __init__(self, alert_callback=None):
        """
        Args:
            alert_callback: Function to call when alert should be triggered
                           Signature: callback(vitals_data: dict) -> None
        """
        self.alert_callback = alert_callback
        self.abnormal_start_time: Optional[float] = None
        self.is_currently_abnormal = False
        self.last_vitals: Optional[Dict] = None
        self.lock = threading.Lock()
        
        logger.info("VitalsMonitor initialized")
        logger.info(f"Thresholds - Pulse: {config.PULSE_MIN}-{config.PULSE_MAX}, "
                   f"Breathing: {config.BREATHING_MIN}-{config.BREATHING_MAX}, "
                   f"Confidence: >{config.CONFIDENCE_THRESHOLD}")
    
    def check_vitals(self, vitals: Dict) -> bool:
        """
        Check if vitals are abnormal and trigger alert if sustained
        
        Args:
            vitals: Dictionary with keys: pulse_rate, breathing_rate, 
                   pulse_confidence, breathing_confidence
        
        Returns:
            True if vitals are currently abnormal, False otherwise
        """
        with self.lock:
            pulse = vitals.get('pulse_rate', 0)
            breathing = vitals.get('breathing_rate', 0)
            pulse_conf = vitals.get('pulse_confidence', 0.0)
            breathing_conf = vitals.get('breathing_confidence', 0.0)
            
            # Store for alert triggering
            self.last_vitals = vitals.copy()
            
            # Ignore low confidence readings
            if pulse_conf < config.CONFIDENCE_THRESHOLD or breathing_conf < config.CONFIDENCE_THRESHOLD:
                logger.debug(f"Low confidence reading - Pulse: {pulse_conf:.2f}, Breathing: {breathing_conf:.2f}")
                self._reset_abnormal_state()
                return False
            
            # Check if vitals are abnormal
            is_abnormal = self._is_abnormal(pulse, breathing)
            
            if is_abnormal:
                if not self.is_currently_abnormal:
                    # Just became abnormal
                    self.is_currently_abnormal = True
                    self.abnormal_start_time = time.time()
                    logger.warning(f"⚠️  Abnormal vitals detected - Pulse: {pulse} BPM, Breathing: {breathing} BPM")
                else:
                    # Still abnormal - check duration
                    duration = time.time() - self.abnormal_start_time
                    logger.debug(f"Abnormal for {duration:.1f}s - Pulse: {pulse}, Breathing: {breathing}")
                    
                    if duration >= config.ABNORMAL_DURATION_THRESHOLD:
                        # Sustained abnormality - trigger alert
                        logger.error(f"🚨 ALERT TRIGGERED - Abnormal vitals sustained for {duration:.1f}s")
                        if self.alert_callback:
                            # Trigger in separate thread to not block
                            threading.Thread(
                                target=self.alert_callback,
                                args=(self.last_vitals.copy(),),
                                daemon=True
                            ).start()
                        # Reset to prevent immediate re-trigger
                        self._reset_abnormal_state()
                        return True
            else:
                # Vitals normalized
                if self.is_currently_abnormal:
                    logger.info("✓ Vitals returned to normal")
                self._reset_abnormal_state()
            
            return is_abnormal
    
    def _is_abnormal(self, pulse: int, breathing: int) -> bool:
        """Check if vitals are outside normal ranges"""
        pulse_abnormal = pulse < config.PULSE_MIN or pulse > config.PULSE_MAX
        breathing_abnormal = breathing < config.BREATHING_MIN or breathing > config.BREATHING_MAX
        
        return pulse_abnormal or breathing_abnormal
    
    def _reset_abnormal_state(self):
        """Reset abnormal tracking"""
        self.is_currently_abnormal = False
        self.abnormal_start_time = None
    
    def get_status(self) -> Dict:
        """Get current monitoring status"""
        with self.lock:
            return {
                'is_abnormal': self.is_currently_abnormal,
                'abnormal_duration': time.time() - self.abnormal_start_time if self.abnormal_start_time else 0,
                'last_vitals': self.last_vitals
            }
