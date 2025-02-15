import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WarningPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  className?: string;
}

const WarningPopup: React.FC<WarningPopupProps> = ({
  isOpen,
  onClose,
  title = "Warning",
  message = "Please check the required information.",
  buttonText = "Got it",
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      />
      <div 
        className={cn(
          "relative animate-in zoom-in-95 duration-200",
          className
        )}
      >
        <div 
          className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="warning-title"
          aria-describedby="warning-message"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-amber-50 p-3">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 
                id="warning-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h3>
              <p 
                id="warning-message"
                className="mt-1 text-sm text-gray-500"
              >
                {message}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningPopup; 