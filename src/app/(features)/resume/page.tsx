"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const page = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      toast({
        variant: "destructive",
        description: "EPlease upload a valid PDF file.",
      });
    }
  };
  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("/api/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast({ description: "File uploaded successfully" });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Error uploading file. Please try again",
      });
    } finally {
      setUploading(false);
    }
  };
  return (
    <>
      <h1>User Resume</h1>
      <h3 className="font-normal">
        Upload your resume or CV to get started with your interview preparation
      </h3>
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload your Resume or CV</DialogTitle>
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
