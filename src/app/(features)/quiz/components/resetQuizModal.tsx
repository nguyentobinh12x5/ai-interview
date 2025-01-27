import React from "react";
import { Shuffle } from "lucide-react";

type ResetQuizModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onReset: (shuffle: boolean) => void;
};

const ResetQuizModal = ({ isOpen, onClose, onReset }: ResetQuizModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl transform transition-all">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reset Quiz</h3>
        <p className="text-gray-600 mb-6">
          Would you like to shuffle the questions and answers?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              onReset(false);
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            No, Keep Order
          </button>
          <button
            onClick={() => {
              onReset(true);
              onClose();
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Yes, Shuffle
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetQuizModal;
