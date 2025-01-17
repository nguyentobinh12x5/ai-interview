"use client";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/questions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("File uploaded successfully!");
      const questionsArray = parseQuestions(response.data.text);
      setQuestions(questionsArray);
    } catch (err) {
      setError("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const parseQuestions = (text: string): string[] => {
    const questionRegex = /\d+\.\s+([\s\S]*?)(?=\d+\.|$)/g;
    const matches = text.match(questionRegex);
    return matches ? matches.map((q) => q.trim()) : [];
  };

  return (
    <div>
      <h1>Upload PDF</h1>
      <Input type="file" accept=".pdf" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file || uploading}>
        Add Questions
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {questions.length > 0 && (
        <table>
          <thead>
            <tr>
              <th style={{ width: "40%" }}>Question</th>
              <th style={{ width: "60%" }}>Answer</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr key={index}>
                <td>{question}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default page;
