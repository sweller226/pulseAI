"""
Structured logging system for PulseAI
Replaces print statements with proper logging
"""
import logging
import sys
from datetime import datetime

def setup_logger(name: str, log_file: str = None, level=logging.DEBUG):
    """
    Create a logger with console and optional file output
    
    Args:
        name: Logger name (usually __name__)
        log_file: Optional file path for logging
        level: Logging level (DEBUG, INFO, WARNING, ERROR)
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # Prevent duplicate handlers
    if logger.handlers:
        return logger
    
    # Console handler with colors
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    
    # Format: [2024-01-20 15:30:45] INFO [module_name] Message
    formatter = logging.Formatter(
        '[%(asctime)s] %(levelname)s [%(name)s] %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File handler (optional)
    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(level)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    return logger
