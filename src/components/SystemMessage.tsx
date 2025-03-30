
import React, { useEffect, useState } from 'react';
import { AlertCircle, Info, CheckCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

type MessageType = 'info' | 'warning' | 'success';

interface SystemMessageProps {
  type?: MessageType;
  message: string;
  className?: string;
  autoClose?: boolean;
  duration?: number;
}

const SystemMessage: React.FC<SystemMessageProps> = ({
  type = 'info',
  message,
  className,
  autoClose = false,
  duration = 5000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-hunter-danger" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-hunter-success" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-hunter-blue" />;
    }
  };

  const getBackground = () => {
    switch (type) {
      case 'warning':
        return 'bg-hunter-danger/10 border-hunter-danger/30';
      case 'success':
        return 'bg-hunter-success/10 border-hunter-success/30';
      case 'info':
      default:
        return 'bg-hunter-blue/10 border-hunter-blue/30';
    }
  };

  return (
    <div
      className={cn(
        "animate-fade-in rounded-lg border px-4 py-3",
        getBackground(),
        className
      )}
    >
      <div className="flex items-center space-x-3">
        {getIcon()}
        <p className="text-sm font-medium">
          <span className="font-bold">[System]:</span> {message}
        </p>
      </div>
    </div>
  );
};

export default SystemMessage;
