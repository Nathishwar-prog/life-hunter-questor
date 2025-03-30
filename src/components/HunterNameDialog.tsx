
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHunter } from '@/context/HunterContext';
import { toast } from 'sonner';
import { User, Settings, Mic } from 'lucide-react';
import { speak } from '@/utils/voiceAssistant';
import VoiceAssistantSettings from './VoiceAssistantSettings';

interface HunterNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HunterNameDialog: React.FC<HunterNameDialogProps> = ({ open, onOpenChange }) => {
  const { hunterName, setHunterName } = useHunter();
  const [name, setName] = useState(hunterName || '');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  const handleSave = () => {
    if (name.trim()) {
      setHunterName(name.trim());
      toast('Hunter name saved!', {
        description: 'Your progress will be saved under this name.',
      });
      onOpenChange(false);
    }
  };

  const handleVoiceSettingsClick = () => {
    setShowVoiceSettings(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-hunter-primary border-hunter-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <User className="h-5 w-5" />
              What's your hunter name?
            </DialogTitle>
            <DialogDescription>
              Enter your hunter name to save your progress and continue your journey.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="hunterName" className="text-white/80">Hunter Name</Label>
            <Input
              id="hunterName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your hunter name"
              className="mt-2 bg-hunter-secondary/30 border-hunter-accent/20"
              autoFocus
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              onClick={handleVoiceSettingsClick}
              variant="outline"
              className="border-hunter-accent/20 hover:bg-hunter-accent/10"
            >
              <Mic className="mr-2 h-4 w-4" />
              Voice Settings
            </Button>
            
            <Button
              onClick={handleSave}
              className="w-full sm:w-auto bg-hunter-accent hover:bg-hunter-accent/80"
              disabled={!name.trim()}
            >
              Save & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <VoiceAssistantSettings 
        open={showVoiceSettings} 
        onOpenChange={setShowVoiceSettings} 
      />
    </>
  );
};

export default HunterNameDialog;
