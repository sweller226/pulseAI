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

            # Store latest
            self.last_vitals = vitals.copy()

            # Ignore low confidence readings
            if pulse_conf < config.CONFIDENCE_THRESHOLD or breathing_conf < config.CONFIDENCE_THRESHOLD:
                logger.debug(
                    f"Low confidence - pulse_conf={pulse_conf:.2f}, "
                    f"breathing_conf={breathing_conf:.2f} (needed >= {config.CONFIDENCE_THRESHOLD})"
                )
                self._reset_abnormal_state()
                return False

            # Check abnormality
            is_abnormal = self._is_abnormal(pulse, breathing)

            # Log exactly how close it is to abnormal thresholds
            logger.debug(
                f"Vital check → pulse={pulse}, breathing={breathing}, "
                f"pulse_conf={pulse_conf:.2f}, breathing_conf={breathing_conf:.2f}"
            )

            if is_abnormal:
                # If newly abnormal
                if not self.is_currently_abnormal:
                    self.is_currently_abnormal = True
                    self.abnormal_start_time = time.time()
                    logger.warning(
                        f"⚠️ Abnormal vitals detected — pulse={pulse}, breathing={breathing}. "
                        f"Starting abnormal timer."
                    )
                else:
                    # Still abnormal — compute duration + progress toward alert
                    duration = time.time() - self.abnormal_start_time
                    remaining = max(0, config.ABNORMAL_DURATION_THRESHOLD - duration)
                    progress = min(1.0, duration / config.ABNORMAL_DURATION_THRESHOLD) * 100

                    logger.debug(
                        f"Abnormal for {duration:.1f}s "
                        f"({progress:.0f}% toward alert, {remaining:.1f}s remaining)"
                    )

                    if duration >= config.ABNORMAL_DURATION_THRESHOLD:
                        logger.error(
                            f"🚨 ALERT TRIGGERED — Abnormal sustained for {duration:.1f}s "
                            f"(threshold = {config.ABNORMAL_DURATION_THRESHOLD}s)"
                        )

                        if self.alert_callback:
                            threading.Thread(
                                target=self.alert_callback,
                                args=(self.last_vitals.copy(),),
                                daemon=True
                            ).start()

                        self._reset_abnormal_state()
                        return True
            else:
                # Vitals returned to normal
                if self.is_currently_abnormal:
                    logger.info("✓ Vitals returned to normal before alert threshold was reached.")
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
