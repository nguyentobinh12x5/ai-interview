"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/ui/loading";
import {
  deleteResume,
  fetchResumes,
  uploadResume,
} from "./services/resumeServices";
import ResumeDialog from "./components/ResumeDialog";
import ResumeTable from "./components/ResumeTable";

const Page = () => {
  const { toast } = useToast();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try {
      const data = await fetchResumes();
      setResumes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (file: File, closeDialog: () => void) => {
    setUploading(true);
    try {
      const response = await uploadResume(file);
      toast({ description: response });
      closeDialog();
      fetchData();
    } catch (err) {
      toast({
        variant: "destructive",
        description: err.response.data,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteResume(id);
      toast({ description: response });
      fetchData();
    } catch (err) {
      toast({
        variant: "destructive",
        description: err.response.data,
      });
    }
  };

  return (
    <>
      <div>
        <h1>User Resume</h1>
        <div className="mt-1 max-w-[640px] text-sm font-medium text-slate-700">
          Upload your resume, cover letter, notes or any other application
          materials to prepare for interview. AI will extract content and
          response during interview.
        </div>
      </div>
      <div>
        <ResumeDialog onUpload={handleUpload} uploading={uploading} />
      </div>
      <div>
        {loading ? (
          <Loading />
        ) : (
          <ResumeTable resumes={resumes} onDelete={handleDelete} />
        )}
      </div>
    </>
  );
};

export default Page;
