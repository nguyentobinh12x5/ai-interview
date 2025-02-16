import React, { useState, useEffect } from "react";
import { X, Check, Building2, Briefcase, Clock, ChevronLeft, FileText } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";
import WarningPopup from "./warningPopup";
import Image from "next/image";

interface Voice {
  id: string;
  name: string;
  gender: string;
  avatarUrl: string;
  title?: string;
}

interface InterviewCard {
  id: string;
  companyName: string;
  resumeName: string;
  createdAt: string;
}

interface MockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (voice: Voice, interviewId: string) => void;
}

const MockInterviewModal: React.FC<MockInterviewModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [activeTab, setActiveTab] = useState<'interview' | 'voice'>('interview');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [interviews, setInterviews] = useState<InterviewCard[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interviewsResponse, voicesResponse] = await Promise.all([
          axios.get("/api/prepare-hub"),
          axios.get("https://service-api.beatinterview.com/api/voices")
        ]);
        setInterviews(interviewsResponse.data);
        setVoices(voicesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (!selectedVoice || !selectedInterview) {
      setShowWarning(true);
      return;
    }
    onSelect(selectedVoice, selectedInterview);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <WarningPopup
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        title="Missing Information"
        message="Please select both an interview set and a voice before proceeding."
      />
      
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl" role="dialog" aria-modal="true">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Interview Setup
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex -mb-px" aria-label="Tabs">
            {['interview', 'voice'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'interview' | 'voice')}
                className={cn(
                  "w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
                aria-selected={activeTab === tab}
                role="tab"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Selection
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            activeTab === 'interview' ? (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Select Interview Set</h3>
                <div className="space-y-3">
                {interviews.map((interview) => (
                    <div
                      key={interview.id}
                      onClick={() => setSelectedInterview(interview.id)}
                      className={cn(
                        "rounded-xl cursor-pointer transition-all hover:shadow-md",
                        selectedInterview === interview.id
                          ? "ring-2 ring-indigo-600 bg-indigo-50/50"
                          : "hover:bg-gray-50 border border-gray-200"
                      )}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4">
                            <div className="rounded-xl bg-indigo-100 p-3">
                              <Briefcase className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">Software Engineer</h4>
                              <div className="flex gap-2 items-center text-gray-600">
                                <Building2 className="h-4 w-4" />
                                <p className="text-sm">{interview.companyName}</p>
                              </div>
                            </div>
                          </div>
                          {selectedInterview === interview.id && (
                            <Check className="h-5 w-5 text-indigo-600" />
                          )}
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex gap-2 items-center text-gray-600">
                            <FileText className="h-4 w-4" />
                            <p className="text-sm">Resume: {interview.resumeName}</p>
                          </div>
                          <div className="flex gap-2 items-center text-gray-600">
                            <Clock className="h-4 w-4" />
                            <p className="text-sm">
                              Added: {new Date(interview.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Select Voice</h3>
                <div className="grid grid-cols-2 gap-4">
                  {voices.map((voice) => (
                    <div
                      key={voice.name}
                      onClick={() => setSelectedVoice(voice)}
                      className={cn(
                        "rounded-xl cursor-pointer transition-all p-6 flex flex-col items-center relative",
                        "hover:scale-105 transform duration-200 ease-in-out",
                        "shadow-sm hover:shadow-md",
                        selectedVoice?.name === voice.name
                          ? "ring-2 ring-indigo-600 bg-indigo-50/50"
                          : "hover:bg-gray-50 border border-gray-200"
                      )}
                    >
                      <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-white shadow-lg">
                        <Image
                          src={voice.avatarUrl}
                          alt={voice.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{voice.name}</h4>
                      <div className="flex flex-col items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">
                          {voice.title || 'Leader'}
                        </span>
                      </div>
                      {selectedVoice?.name === voice.name && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-indigo-600 rounded-full p-1.5">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex gap-2">
            {activeTab === 'voice' && (
              <button
                onClick={() => setActiveTab('interview')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </button>
            )}
          </div>
          <button
            onClick={activeTab === 'interview' ? () => setActiveTab('voice') : handleConfirm}
            disabled={activeTab === 'interview' ? !selectedInterview : !selectedVoice}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {activeTab === 'interview' ? 'Next' : 'Start Interview'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockInterviewModal; 