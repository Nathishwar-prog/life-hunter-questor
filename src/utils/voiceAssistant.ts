
/**
 * Voice Assistant utility for the Hunter Gamification app
 * Uses Web Speech API for text-to-speech functionality
 */

// Flag to check if speech synthesis is available
const isSpeechSynthesisAvailable = 'speechSynthesis' in window;

// Voice assistant settings
let voiceEnabled = true;
let volume = 1.0;
let rate = 1.0;
let pitch = 1.0;

// Initialize voice assistant
const initVoiceAssistant = () => {
  // Load settings from localStorage
  try {
    const savedSettings = localStorage.getItem('hunter_voice_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      voiceEnabled = settings.enabled ?? true;
      volume = settings.volume ?? 1.0;
      rate = settings.rate ?? 1.0;
      pitch = settings.pitch ?? 1.0;
    }
  } catch (error) {
    console.error('Error loading voice settings:', error);
  }
};

// Save voice settings to localStorage
const saveVoiceSettings = () => {
  try {
    localStorage.setItem('hunter_voice_settings', JSON.stringify({
      enabled: voiceEnabled,
      volume,
      rate,
      pitch
    }));
  } catch (error) {
    console.error('Error saving voice settings:', error);
  }
};

// Speak a message using the Web Speech API
const speak = (message: string, priority: boolean = false) => {
  if (!isSpeechSynthesisAvailable || !voiceEnabled) return;
  
  // Cancel any existing speech if this is a priority message
  if (priority && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  
  // If speech synthesis is already speaking and this is not a priority message, don't interrupt
  if (window.speechSynthesis.speaking && !priority) return;
  
  const utterance = new SpeechSynthesisUtterance(message);
  
  // Set voice properties
  utterance.volume = volume;
  utterance.rate = rate;
  utterance.pitch = pitch;
  
  // Get available voices
  const voices = window.speechSynthesis.getVoices();
  
  // Try to find a good English voice
  // First look for a female voice as it tends to sound better for assistant-style voices
  let selectedVoice = voices.find(voice => 
    voice.lang.includes('en-') && voice.name.includes('Female'));
  
  // If no female voice found, try any English voice
  if (!selectedVoice) {
    selectedVoice = voices.find(voice => voice.lang.includes('en-'));
  }
  
  // Fallback to any available voice if no English voice is found
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  
  window.speechSynthesis.speak(utterance);
};

// Enable/disable voice
const toggleVoice = (enabled: boolean) => {
  voiceEnabled = enabled;
  saveVoiceSettings();
  
  // Speak confirmation if enabling
  if (enabled) {
    speak("Voice assistant enabled.", true);
  }
};

// Set volume (0.0 to 1.0)
const setVoiceVolume = (newVolume: number) => {
  volume = Math.max(0, Math.min(1, newVolume));
  saveVoiceSettings();
  
  if (voiceEnabled) {
    speak(`Volume set to ${Math.round(volume * 100)}%`, true);
  }
};

// Set speech rate (0.1 to 2.0)
const setVoiceRate = (newRate: number) => {
  rate = Math.max(0.1, Math.min(2.0, newRate));
  saveVoiceSettings();
  
  if (voiceEnabled) {
    speak("Speech rate updated", true);
  }
};

// Initialize the voice selection
if (isSpeechSynthesisAvailable) {
  // This helps ensure voices are loaded
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = initVoiceAssistant;
  }
  
  // Initialize anyway in case the event has already fired
  initVoiceAssistant();
}

export {
  speak,
  toggleVoice,
  setVoiceVolume,
  setVoiceRate,
  isSpeechSynthesisAvailable
};
