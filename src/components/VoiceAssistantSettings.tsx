
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Volume2, Volume1, VolumeX, Mic, MicOff } from 'lucide-react';
import { toggleVoice, setVoiceVolume, setVoiceRate, isSpeechSynthesisAvailable, speak } from '@/utils/voiceAssistant';

interface VoiceAssistantSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VoiceAssistantSettings: React.FC<VoiceAssistantSettingsProps> = ({ 
  open, 
  onOpenChange 
}) => {
  // Voice settings states
  const [enabled, setEnabled] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(1.0);
  const [rate, setRate] = useState<number>(1.0);
  
  // Load saved settings on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('hunter_voice_settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setEnabled(settings.enabled ?? true);
        setVolume(settings.volume ?? 1.0);
        setRate(settings.rate ?? 1.0);
      }
    } catch (error) {
      console.error('Error loading voice settings:', error);
    }
  }, [open]);
  
  // Toggle voice assistant
  const handleToggleVoice = (checked: boolean) => {
    setEnabled(checked);
    toggleVoice(checked);
  };
  
  // Update volume
  const handleVolumeChange = (newValue: number[]) => {
    const value = newValue[0];
    setVolume(value);
    setVoiceVolume(value);
  };
  
  // Update speech rate
  const handleRateChange = (newValue: number[]) => {
    const value = newValue[0];
    setRate(value);
    setVoiceRate(value);
  };
  
  // Test voice with current settings
  const handleTestVoice = () => {
    speak("Hello hunter! This is a test of your voice assistant settings.", true);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-hunter-primary border-hunter-accent/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {enabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            Voice Assistant Settings
          </DialogTitle>
        </DialogHeader>
        
        {!isSpeechSynthesisAvailable ? (
          <div className="py-4 text-center">
            <p className="text-hunter-danger">
              Voice synthesis is not available in your browser. 
              Please try a different browser like Chrome, Edge, or Safari.
            </p>
          </div>
        ) : (
          <div className="py-4 space-y-6">
            {/* Enable/Disable Voice */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="voice-toggle" className="text-white/80 mb-1 block">
                  Voice Assistant
                </Label>
                <p className="text-white/60 text-sm">
                  Enable or disable voice feedback
                </p>
              </div>
              <Switch 
                id="voice-toggle" 
                checked={enabled}
                onCheckedChange={handleToggleVoice}
                className="data-[state=checked]:bg-hunter-accent"
              />
            </div>
            
            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex justify-between mb-1">
                <Label htmlFor="voice-volume" className="text-white/80">
                  Volume
                </Label>
                <div className="flex items-center gap-2">
                  {volume === 0 ? (
                    <VolumeX className="h-4 w-4 text-white/60" />
                  ) : volume < 0.5 ? (
                    <Volume1 className="h-4 w-4 text-white/60" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-white/60" />
                  )}
                  <span className="text-sm text-white/60">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>
              <Slider
                id="voice-volume"
                disabled={!enabled}
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={1}
                step={0.01}
                className="[&>span:first-child]:bg-hunter-secondary/80 [&>span:nth-child(2)]:bg-hunter-accent"
              />
            </div>
            
            {/* Speech Rate Control */}
            <div className="space-y-2">
              <div className="flex justify-between mb-1">
                <Label htmlFor="voice-rate" className="text-white/80">
                  Speech Rate
                </Label>
                <span className="text-sm text-white/60">
                  {rate.toFixed(1)}x
                </span>
              </div>
              <Slider
                id="voice-rate"
                disabled={!enabled}
                value={[rate]}
                onValueChange={handleRateChange}
                min={0.5}
                max={1.5}
                step={0.1}
                className="[&>span:first-child]:bg-hunter-secondary/80 [&>span:nth-child(2)]:bg-hunter-accent"
              />
            </div>
            
            {/* Test Voice Button */}
            <Button
              onClick={handleTestVoice}
              disabled={!enabled}
              className="w-full mt-4 bg-hunter-accent hover:bg-hunter-accent/80 disabled:opacity-50"
            >
              <Mic className="mr-2 h-4 w-4" />
              Test Voice
            </Button>
          </div>
        )}
        
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="mt-2 border-hunter-accent/30"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceAssistantSettings;
