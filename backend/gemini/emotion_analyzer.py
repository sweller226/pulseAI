"""
Emotion Analysis using FER (Facial Expression Recognition)
Analyzes emotions directly from webcam frames with medical emotion mapping
Also streams frames to WSL for SmartSpectra processing
"""

import cv2
import threading
import time
from fer.fer import FER

# Medical emotion mapping rules
# These map FER's basic emotions to medical states
MEDICAL_EMOTION_RULES = {
    'pain': {
        'primary': ['angry', 'disgust', 'fear'],
        'weights': {'angry': 0.6, 'disgust': 0.3, 'fear': 0.2}
    },
    'nausea': {
        'primary': ['disgust', 'sad'],
        'weights': {'disgust': 0.7, 'sad': 0.4}
    },
    'discomfort': {
        'primary': ['fear', 'sad', 'angry'],
        'weights': {'fear': 0.5, 'sad': 0.3, 'angry': 0.3}
    },
    'distress': {
        'primary': ['fear', 'angry', 'sad'],
        'weights': {'fear': 0.5, 'angry': 0.4, 'sad': 0.3}
    }
}

class EmotionAnalyzer:
    def __init__(self, camera_index=0):
        self.detector = None
        self.latest_emotion = None
        self.running = False
        self.camera_index = camera_index
        self.capture = None
        
        try:
            # Initialize FER detector
            self.detector = FER(mtcnn=False)  # Disable MTCNN for better performance
            print("✓ FER emotion detector initialized")
        except Exception as e:
            print(f"✗ Failed to initialize FER: {e}")
    
    def start_camera_analysis(self):
        """Start analyzing emotions from webcam in background thread"""
        if not self.detector:
            print("⚠ Cannot start camera analysis - FER not available")
            return False
        
        self.running = True
        self.analysis_thread = threading.Thread(target=self._camera_loop, daemon=True)
        self.analysis_thread.start()
        print(f"✓ Started emotion analysis from camera {self.camera_index}")
        return True
    
    def _camera_loop(self):
        """Background thread that continuously analyzes webcam frames"""
        try:
            # Open webcam
            self.capture = cv2.VideoCapture(self.camera_index)
            
            if not self.capture.isOpened():
                print(f"✗ Failed to open camera {self.camera_index}")
                return
            
            # Set camera resolution - lower for better performance
            self.capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            self.capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 320)
            self.capture.set(cv2.CAP_PROP_FPS, 20)
            
            print(f"✓ Camera {self.camera_index} opened successfully")
            
            while self.running:
                ret, frame = self.capture.read()
                
                if not ret:
                    print("⚠ Failed to read frame from camera")
                    time.sleep(0.1)
                    continue
                
                # Detect emotions in frame
                try:
                    # Resize frame for faster processing
                    small_frame = cv2.resize(frame, (320, 240))
                    result = self.detector.detect_emotions(small_frame)
                    
                    if result and len(result) > 0:
                        # Get the first (most prominent) face
                        face = result[0]
                        base_emotions = face['emotions']
                        
                        # Calculate medical emotions from base emotions
                        medical_emotions = self._calculate_medical_emotions(base_emotions)
                        
                        # Combine all emotions
                        all_emotions = {**base_emotions, **medical_emotions}
                        
                        # Store latest emotion data
                        self.latest_emotion = {
                            'expressions': all_emotions,
                            'base_emotions': base_emotions,
                            'medical_emotions': medical_emotions,
                            'dominant': max(all_emotions.items(), key=lambda x: x[1])[0],
                            'confidence': max(all_emotions.values()),
                            'timestamp': time.time()
                        }
                    else:
                        # No face detected
                        self.latest_emotion = None
                        
                except Exception as e:
                    print(f"⚠ Emotion detection error: {e}")
                
                # Analyze at ~10 FPS to reduce CPU usage
                time.sleep(0.1)
                
        except Exception as e:
            print(f"✗ Camera loop error: {e}")
        finally:
            if self.capture:
                self.capture.release()
            print("Camera released")
    
    def _calculate_medical_emotions(self, base_emotions):
        """
        Calculate medical emotions (pain, nausea, etc.) from base emotions
        
        Args:
            base_emotions: Dict of FER's 7 basic emotions
            
        Returns:
            Dict of medical emotion scores
        """
        medical_emotions = {}
        
        for medical_emotion, rule in MEDICAL_EMOTION_RULES.items():
            score = 0.0
            for emotion, weight in rule['weights'].items():
                score += base_emotions.get(emotion, 0.0) * weight
            # Clamp to [0, 1] range
            medical_emotions[medical_emotion] = min(1.0, max(0.0, score))
            score = score ** 2
        
        return medical_emotions
    
    def get_latest_emotion(self):
        """Get the most recent emotion analysis"""
        return self.latest_emotion
    
    def analyze_landmarks(self, landmarks):
        """
        Compatibility method - not used with FER (it analyzes images directly)
        Returns cached emotion from camera analysis instead
        """
        return self.get_latest_emotion()
    
    def get_dominant_emotion(self, emotion_data):
        """Get the most prominent emotion from analysis results"""
        if not emotion_data:
            return "unknown"
        
        return emotion_data.get('dominant', 'unknown')
    
    def stop(self):
        """Stop camera analysis"""
        self.running = False
        if self.capture:
            self.capture.release()
    
    def is_available(self):
        """Check if FER is properly initialized"""
        return self.detector is not None

# Singleton instance
emotion_analyzer = EmotionAnalyzer()

def start_emotion_analysis(camera_index=0):
    """Start the emotion analyzer with webcam"""
    emotion_analyzer.camera_index = camera_index
    return emotion_analyzer.start_camera_analysis()


def get_current_emotion():
    """
    Get current emotion from webcam analysis
    
    Returns:
        dict with emotion analysis or None
    """
    return emotion_analyzer.get_latest_emotion()


def get_emotion_summary():
    """
    Get a simple emotion summary string
    
    Returns:
        str: Simple emotion label like "happy", "sad", "neutral"
    """
    emotion_data = get_current_emotion()
    if emotion_data:
        return emotion_data.get('dominant', 'unknown')
    return "unavailable"
