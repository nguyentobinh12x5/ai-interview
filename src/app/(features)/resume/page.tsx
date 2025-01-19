"use client";
import { useState, useEffect } from "react";
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
import { Plus, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Page = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/resume");
      setResumes(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      toast({
        variant: "destructive",
        description: "Please upload a valid PDF file.",
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
      setIsDialogOpen(false);
      fetchData();
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Error uploading file. Please try again",
      });
    } finally {
      setUploading(false);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/resume?id=${id}`);
      toast({ description: "Resume deleted successfully" });
      fetchData(); // Reload the data
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Error deleting resume. Please try again",
      });
    }
  };

  return (
    <>
      <h1>User Resume</h1>
      <h3 className="font-normal">
        Upload your resume or CV to get started with your interview preparation
      </h3>
      <div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
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
        {loading ? (
          <div className="flex justify-center items-center">
            <LoaderCircle className="animate-spin" />
          </div>
        ) : resumes.length === 0 ? (
          <p>No resumes found. Please upload your resume.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-start">
                    File Name
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-start">
                    Update Date
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-start">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {resumes.map((resume: any) => (
                  <tr key={resume.id}>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      {resume.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {resume.updatedAt}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700 flex gap-2">
                      <Button variant="outline">Edit</Button>
                      <Button onClick={() => handleDelete(resume.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
