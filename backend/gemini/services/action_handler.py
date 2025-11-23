"""
Action Handler Service
Handles post-conversation actions (911, family, breathing exercise)
"""
import time
from typing import Dict
from utils.logger import setup_logger

logger = setup_logger(__name__)


def handle_action(action: str, vitals: Dict):
    """
    Handle the action chosen by patient after ElevenLabs conversation
    
    Args:
        action: One of "CALL_911", "CALL_FAMILY", "NEITHER", "TIMEOUT"
        vitals: Vital signs data at time of alert
    """
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
    
    if action == "CALL_911":
        logger.critical("=" * 60)
        logger.critical("🚨 EMERGENCY: CALLING 911")
        logger.critical(f"Time: {timestamp}")
        logger.critical(f"Pulse: {vitals.get('pulse_rate')} BPM")
        logger.critical(f"Breathing: {vitals.get('breathing_rate')} BPM")
        logger.critical("=" * 60)
        
        # TODO: Integrate with Twilio or emergency calling API
        # For now, just log
        _log_action_to_file("911_CALLS", action, vitals, timestamp)
    
    elif action == "CALL_FAMILY":
        logger.warning("=" * 60)
        logger.warning("📞 CALLING EMERGENCY CONTACT")
        logger.warning(f"Time: {timestamp}")
        logger.warning(f"Pulse: {vitals.get('pulse_rate')} BPM")
        logger.warning(f"Breathing: {vitals.get('breathing_rate')} BPM")
        logger.warning("=" * 60)
        
        # TODO: Call emergency contact from patient profile
        # For now, just log
        _log_action_to_file("FAMILY_CALLS", action, vitals, timestamp)
    
    elif action == "NEITHER":
        logger.info("=" * 60)
        logger.info("🧘 PATIENT CHOSE BREATHING EXERCISE")
        logger.info(f"Time: {timestamp}")
        logger.info(f"Pulse: {vitals.get('pulse_rate')} BPM")
        logger.info(f"Breathing: {vitals.get('breathing_rate')} BPM")
        logger.info("Continuing to monitor vitals...")
        logger.info("=" * 60)
        
        _log_action_to_file("BREATHING_EXERCISES", action, vitals, timestamp)
    
    elif action == "TIMEOUT":
        logger.error("=" * 60)
        logger.error("⏱️  PATIENT DID NOT RESPOND")
        logger.error(f"Time: {timestamp}")
        logger.error(f"Pulse: {vitals.get('pulse_rate')} BPM")
        logger.error(f"Breathing: {vitals.get('breathing_rate')} BPM")
        logger.error("Consider automatic emergency call")
        logger.error("=" * 60)
        
        _log_action_to_file("TIMEOUTS", action, vitals, timestamp)
    
    else:
        logger.error(f"Unknown action: {action}")


def _log_action_to_file(log_type: str, action: str, vitals: Dict, timestamp: str):
    """
    Log action to a file for record keeping
    
    Args:
        log_type: Type of log file (911_CALLS, FAMILY_CALLS, etc.)
        action: Action taken
        vitals: Vital signs data
        timestamp: Timestamp string
    """
    try:
        import os
        log_dir = os.path.join(os.path.dirname(__file__), '..', 'logs')
        os.makedirs(log_dir, exist_ok=True)
        
        log_file = os.path.join(log_dir, f'{log_type}.log')
        
        with open(log_file, 'a') as f:
            f.write(f"\n{'='*60}\n")
            f.write(f"Timestamp: {timestamp}\n")
            f.write(f"Action: {action}\n")
            f.write(f"Pulse: {vitals.get('pulse_rate')} BPM (confidence: {vitals.get('pulse_confidence', 0):.2f})\n")
            f.write(f"Breathing: {vitals.get('breathing_rate')} BPM (confidence: {vitals.get('breathing_confidence', 0):.2f})\n")
            f.write(f"Talking: {vitals.get('talking', False)}\n")
            f.write(f"{'='*60}\n")
        
        logger.debug(f"Logged to {log_file}")
    
    except Exception as e:
        logger.error(f"Failed to log action to file: {e}")
