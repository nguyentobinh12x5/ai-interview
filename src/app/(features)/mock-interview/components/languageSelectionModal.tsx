import React, { useState, useEffect } from "react";
import { X, Volume2, Check, Globe } from "lucide-react";

interface Voice {
  name: string;
  lang: string;
  voiceURI: string;
}

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (language: string, voice: SpeechSynthesisVoice) => void;
}

const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<"en-US" | "vi-VN">(
    "en-US"
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const filteredVoices = voices.filter((voice) =>
    voice.lang.startsWith(selectedLanguage.split("-")[0])
  );

  const previewVoice = (voice: SpeechSynthesisVoice) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      selectedLanguage === "en-US"
        ? "Hello, this is a preview of my voice."
        : "Xin chào, đây là giọng nói mẫu."
    );
    utterance.voice = voice;
    setPreviewingVoice(voice.voiceURI);

    utterance.onend = () => setPreviewingVoice(null);
    utterance.onerror = () => setPreviewingVoice(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleConfirm = () => {
    if (selectedVoice) {
      onSelect(selectedLanguage, selectedVoice);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Select Language & Voice
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { code: "en-US", label: "English" },
                  { code: "vi-VN", label: "Tiếng Việt" },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() =>
                      setSelectedLanguage(lang.code as "en-US" | "vi-VN")
                    }
                    className={`
                      flex items-center justify-center px-4 py-2 rounded-lg
                      ${
                        selectedLanguage === lang.code
                          ? "bg-indigo-50 text-indigo-600 ring-2 ring-indigo-600"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredVoices.map((voice) => (
                  <div
                    key={voice.voiceURI}
                    className={`
                      flex items-center justify-between p-3 rounded-lg cursor-pointer
                      ${
                        selectedVoice?.voiceURI === voice.voiceURI
                          ? "bg-indigo-50 text-indigo-600"
                          : "hover:bg-gray-50"
                      }
                    `}
                    onClick={() => setSelectedVoice(voice)}
                  >
                    <div className="flex items-center">
                      {selectedVoice?.voiceURI === voice.voiceURI && (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      <span className="text-sm">{voice.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        previewVoice(voice);
                      }}
                      className={`
                        p-2 rounded-full
                        ${
                          previewingVoice === voice.voiceURI
                            ? "bg-indigo-100 text-indigo-600 animate-pulse"
                            : "hover:bg-gray-100 text-gray-600"
                        }
                      `}
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleConfirm}
            disabled={!selectedVoice}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionModal;
