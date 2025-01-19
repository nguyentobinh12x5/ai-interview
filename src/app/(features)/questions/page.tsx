"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  const handleSubmit = async () => {
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
      const questionsArray = response.data.text
        .replace("```json", "")
        .replace("```", "");
      setQuestions(questionsArray);
    } catch (err) {
      setError("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  return (
    <>
      <h1>Interview Preparation Hub</h1>
      <h3 className="font-normal">
        Link your resume and create a role, generate interview questions, and
        prepare in advance.
      </h3>
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Prepare</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tell us more about your job interview</DialogTitle>
              <DialogDescription>
                Add Detail about your job interview. Click save when you're
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-start space-y-4 flex-col">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="resume" className="text-right">
                  Resume
                </Label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid flex-1 gap-2">
                <Label htmlFor="name" className="text-right">
                  Job Description
                </Label>
                <Input
                  id="name"
                  value="Job description"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={!file || uploading}
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-start">
                  Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-start">
                  Date of Birth
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-start">
                  Job Description
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-start">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  John Doe
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  24/05/1995
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  Web Developer
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <Button variant="outline">Edit</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default page;
