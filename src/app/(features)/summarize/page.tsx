"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Loader2,
  AlertCircle,
  Upload,
  List,
  Clock,
} from "lucide-react";
import { SummaryResponse } from "./models/Summary";
import { generateSummary } from "./services/summaryService";
import FileUpload from "./components/fileUpload";
import { Button } from "@/components/ui/button";

const SummarizePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatReadingTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} seconds read`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes} min ${remainingSeconds} sec read`
      : `${minutes} min read`;
  };

  const handleSummarize = async () => {
    if (!uploadedFile) {
      setError(
        "Please upload a document or audio file before generating a summary"
      );
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await generateSummary(uploadedFile);
      setSummary(response);
    } catch (err) {
      setError("Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Summarize Knowledge
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transform your documents or audio files into concise, actionable
          summaries
        </p>
      </div>

      <FileUpload
        onFileChange={setUploadedFile}
        maxSizeInMB={50}
        validTypes={[
          "application/pdf",
          "application/msword",
          "text/plain",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "audio/mpeg",
          "audio/wav",
          "audio/ogg",
        ]}
        title="Upload your document or audio file"
        description="Supported formats: PDF, DOCX, TXT, MP3, WAV, OGG"
        icon={<Upload className="h-12 w-12 text-indigo-500 animate-bounce" />}
      />

      {error && (
        <div className="mt-4 flex items-center justify-center text-red-600">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-8 text-center">
        <Button
          onClick={handleSummarize}
          disabled={isLoading}
          variant={"default"}
          size={"lg"}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Processing file...
            </>
          ) : (
            "Generate Summary"
          )}
        </Button>
      </div>

      {summary && (
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Summary</h2>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1.5" />
                      <span>{summary.wordCount} words</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5" />
                      <span>{formatReadingTime(summary.readingTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="space-y-8">
                {/* Summary Section */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                  <p className="text-gray-700 leading-relaxed">
                    {summary.summary}
                  </p>
                </div>

                {/* Key Points Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <List className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Key Points
                    </h3>
                  </div>
                  <div className="grid gap-3">
                    {summary.keyPoints.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 rounded-lg bg-white border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors"
                      >
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-medium text-indigo-600">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default SummarizePage;
