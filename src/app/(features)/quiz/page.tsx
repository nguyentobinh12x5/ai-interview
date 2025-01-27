"use client";
import { useState } from "react";
import { Question } from "./models/Question";
import { generateQuestions } from "./services/questionService";
import FileUpload from "./components/fileUpload";
import { AlertCircle, LoaderCircle, Upload } from "lucide-react";
import QuestionList from "./components/quizList";
import { Button } from "@/components/ui/button";

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  const handleGenerate = async () => {
    if (!uploadedFile) {
      setError("Please upload a document before generating questions");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await generateQuestions(uploadedFile);
      setQuestions(response.questions);
      setKey((prev) => prev + 1);
    } catch (err) {
      setError("Failed to generate questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div className="text-center mb-12">
        <h1>Generate Questions from Documents</h1>
        <p className=" text-gray-600">
          Upload your document and let AI create multiple-choice questions
          instantly
        </p>
      </div>

      <FileUpload
        onFileChange={setUploadedFile}
        maxSizeInMB={10}
        validTypes={[
          "application/pdf",
          "application/msword",
          "text/plain",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]}
        title="Upload your document"
        description="Supported formats: PDF, DOCX, or TXT"
        icon={<Upload className="h-12 w-12 animate-bounce" />}
      />

      {error && (
        <div className="mt-4 flex items-center justify-center text-red-600">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-8 text-center">
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? (
            <>
              <LoaderCircle className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Processing document...
            </>
          ) : (
            "Generate Questions"
          )}
        </Button>
      </div>

      {questions.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Generated Questions
          </h2>
          <QuestionList key={key} questions={questions} />
        </div>
      )}
    </div>
  );
};

export default page;
