"""
Real-time GUI Visualizer for Emotion Analysis
Shows live emotion data from PyFaceAU using Tkinter
"""

import tkinter as tk
from tkinter import ttk
import threading
import time
from socket_server import get_latest_vitals
from emotion_analyzer import emotion_analyzer, get_current_emotion


class EmotionVisualizerGUI:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Emotion Analyzer - Real-time")
        self.root.geometry("800x600")
        self.root.configure(bg='#1e1e1e')
        
        # Status indicator
        self.status_label = tk.Label(
            self.root, 
            text="● Waiting for data...", 
            font=('Arial', 12, 'bold'),
            fg='yellow',
            bg='#1e1e1e'
        )
        self.status_label.pack(pady=10)
        
        # Main frame
        main_frame = tk.Frame(self.root, bg='#1e1e1e')
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)
        
        # Vitals section
        vitals_frame = tk.LabelFrame(
            main_frame, 
            text="Vital Signs", 
            font=('Arial', 11, 'bold'),
            fg='white',
            bg='#2d2d2d'
        )
        vitals_frame.pack(fill=tk.X, pady=5)
        
        self.pulse_label = tk.Label(
            vitals_frame, 
            text="Pulse: -- BPM", 
            font=('Arial', 14),
            fg='#4CAF50',
            bg='#2d2d2d'
        )
        self.pulse_label.pack(pady=5)
        
        self.breathing_label = tk.Label(
            vitals_frame, 
            text="Breathing: -- BPM", 
            font=('Arial', 14),
            fg='#2196F3',
            bg='#2d2d2d'
        )
        self.breathing_label.pack(pady=5)
        
        self.talking_label = tk.Label(
            vitals_frame, 
            text="Talking: --", 
            font=('Arial', 12),
            fg='#FFC107',
            bg='#2d2d2d'
        )
        self.talking_label.pack(pady=5)
        
        # Emotion section
        emotion_frame = tk.LabelFrame(
            main_frame, 
            text="Emotion Analysis (FER + Medical)", 
            font=('Arial', 11, 'bold'),
            fg='white',
            bg='#2d2d2d'
        )
        emotion_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        self.dominant_emotion_label = tk.Label(
            emotion_frame, 
            text="Emotion: --", 
            font=('Arial', 20, 'bold'),
            fg='#FF5722',
            bg='#2d2d2d'
        )
        self.dominant_emotion_label.pack(pady=10)
        
        # Expression bars container
        self.expression_frame = tk.Frame(emotion_frame, bg='#2d2d2d')
        self.expression_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Create two columns: base emotions and medical emotions
        base_frame = tk.Frame(self.expression_frame, bg='#2d2d2d')
        base_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5)
        
        base_title = tk.Label(
            base_frame,
            text="Base Emotions",
            font=('Arial', 10, 'bold'),
            fg='#4CAF50',
            bg='#2d2d2d'
        )
        base_title.pack(pady=5)
        
        self.base_expression_frame = tk.Frame(base_frame, bg='#2d2d2d')
        self.base_expression_frame.pack(fill=tk.BOTH, expand=True)
        
        medical_frame = tk.Frame(self.expression_frame, bg='#2d2d2d')
        medical_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5)
        
        medical_title = tk.Label(
            medical_frame,
            text="Medical Indicators",
            font=('Arial', 10, 'bold'),
            fg='#FF5722',
            bg='#2d2d2d'
        )
        medical_title.pack(pady=5)
        
        self.medical_expression_frame = tk.Frame(medical_frame, bg='#2d2d2d')
        self.medical_expression_frame.pack(fill=tk.BOTH, expand=True)
        
        self.base_expression_bars = {}
        self.medical_expression_bars = {}
        
        # Landmark count
        self.landmark_label = tk.Label(
            main_frame, 
            text="Landmarks: 0", 
            font=('Arial', 10),
            fg='#607D8B',
            bg='#1e1e1e'
        )
        self.landmark_label.pack(pady=5)
        
        # Update loop
        self.running = True
        self.update_thread = threading.Thread(target=self.update_loop, daemon=True)
        self.update_thread.start()
        
    def create_expression_bar(self, expression_name, value, is_medical=False):
        """Create or update a progress bar for an expression"""
        bars_dict = self.medical_expression_bars if is_medical else self.base_expression_bars
        parent_frame = self.medical_expression_frame if is_medical else self.base_expression_frame
        
        if expression_name not in bars_dict:
            # Create new bar
            frame = tk.Frame(parent_frame, bg='#2d2d2d')
            frame.pack(fill=tk.X, pady=2)
            
            label = tk.Label(
                frame, 
                text=f"{expression_name.capitalize()}: ", 
                font=('Arial', 9),
                fg='white',
                bg='#2d2d2d',
                width=10,
                anchor='w'
            )
            label.pack(side=tk.LEFT)
            
            progress = ttk.Progressbar(
                frame, 
                length=150, 
                mode='determinate',
                maximum=100
            )
            progress.pack(side=tk.LEFT, padx=5)
            
            value_label = tk.Label(
                frame, 
                text="0%", 
                font=('Arial', 9),
                fg='white',
                bg='#2d2d2d',
                width=5
            )
            value_label.pack(side=tk.LEFT)
            
            bars_dict[expression_name] = {
                'progress': progress,
                'value_label': value_label
            }
        
        # Update bar
        bar_data = bars_dict[expression_name]
        bar_data['progress']['value'] = value * 100
        bar_data['value_label']['text'] = f"{value*100:.0f}%"
    
    def update_loop(self):
        """Background thread to update GUI"""
        while self.running:
            try:
                vitals = get_latest_vitals()
                
                # Update on main thread
                self.root.after(0, self.update_display, vitals)
                
            except Exception as e:
                print(f"GUI update error: {e}")
            
            time.sleep(0.1)  # Update 10 times per second
    
    def update_display(self, vitals):
        """Update GUI with latest data (runs on main thread)"""
        try:
            # Update status
            if vitals.get('status') == 'active':
                self.status_label.config(text="● Live Data", fg='#4CAF50')
            else:
                self.status_label.config(text="● Waiting for data...", fg='yellow')
            
            # Update vitals
            pulse = vitals.get('pulse_rate', 0)
            breathing = vitals.get('breathing_rate', 0)
            talking = vitals.get('talking', False)
            
            self.pulse_label.config(text=f"Pulse: {pulse} BPM")
            self.breathing_label.config(text=f"Breathing: {breathing} BPM")
            self.talking_label.config(
                text=f"Talking: {'YES' if talking else 'NO'}",
                fg='#FF5722' if talking else '#4CAF50'
            )
            
            # Emotion comes from webcam now, not landmarks
            self.landmark_label.config(text="Emotion: From Webcam (FER)")
            
            # Analyze emotion if available
            emotion_data = get_current_emotion()
            
            if emotion_data and emotion_analyzer.is_available():
                # Update dominant emotion
                dominant = emotion_data.get('dominant', 'unknown')
                confidence = emotion_data.get('confidence', 0)
                self.dominant_emotion_label.config(text=f"Emotion: {dominant.upper()} ({confidence*100:.0f}%)")
                
                # Update base emotion bars
                base_emotions = emotion_data.get('base_emotions', {})
                for expr_name, expr_value in base_emotions.items():
                    self.create_expression_bar(expr_name, expr_value, is_medical=False)
                
                # Update medical emotion bars
                medical_emotions = emotion_data.get('medical_emotions', {})
                for expr_name, expr_value in medical_emotions.items():
                    self.create_expression_bar(expr_name, expr_value, is_medical=True)
            else:
                # No emotion data
                if not emotion_analyzer.is_available():
                    self.dominant_emotion_label.config(text="FER not installed")
                else:
                    self.dominant_emotion_label.config(text="Waiting for webcam...")
                
        except Exception as e:
            print(f"Display update error: {e}")
    
    def run(self):
        """Start the GUI"""
        try:
            self.root.mainloop()
        finally:
            self.running = False
    
    def stop(self):
        """Stop the GUI"""
        self.running = False
        self.root.quit()


def start_gui():
    """Start the emotion visualizer GUI in a separate thread"""
    def run_gui():
        gui = EmotionVisualizerGUI()
        gui.run()
    
    gui_thread = threading.Thread(target=run_gui, daemon=False)
    gui_thread.start()
    return gui_thread


if __name__ == "__main__":
    # Standalone mode
    print("Starting Emotion Visualizer GUI...")
    from socket_server import start_socket_server
    
    # Start socket server
    start_socket_server()
    
    # Start GUI (blocks)
    gui = EmotionVisualizerGUI()
    gui.run()
