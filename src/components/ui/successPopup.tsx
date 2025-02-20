import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessPopup = ({ isOpen, onClose }: SuccessPopupProps) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-green-50 p-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Registration Successful!
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Thank you for joining our waitlist. We'll be in touch soon!
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SuccessPopup; 