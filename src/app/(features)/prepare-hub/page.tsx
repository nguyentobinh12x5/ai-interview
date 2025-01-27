"use client";
import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const page = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [interviewSet, setInterviewSet] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [resumes, setResumes] = useState<string[]>([]);
  const [jobDescriptionUrl, setJobDescriptionUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const getInterviewSet = async () => {
    try {
      const response = await axios.get("/api/prepare-hub");
      console.log(response.data);
      setInterviewSet(response.data);
      setLoading(false);
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Error getting interview set. Please try again",
      });
    }
  };

  useEffect(() => {
    getInterviewSet();
  }, []);

  const getUserResume = async () => {
    try {
      const response = await axios.get("/api/resume");
      setResumes(response.data);
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Erro get user resume. Please try again",
      });
    }
  };

  const handleJobDescriptionUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setJobDescriptionUrl(event.target.value);
  };

  const handleResumeChange = (value: string) => {
    setSelectedResume(value);
  };

  const handleSubmit = async () => {
    if (!selectedResume) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("resumeId", selectedResume);
    formData.append("jobDescriptionUrl", jobDescriptionUrl);
    console.log("formData", formData.get("resume"));
    try {
      await axios.post("/api/prepare-hub", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        description: "Questions generated successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Error generating questions. Please try again",
      });
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
            <Button onClick={() => getUserResume()}>Prepare</Button>
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
                <SelectGroup>
                  <SelectLabel>Resume</SelectLabel>
                  <Select onValueChange={handleResumeChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select your Resumes" />
                    </SelectTrigger>
                    <SelectContent>
                      {resumes.map((resume: any) => (
                        <SelectItem key={resume.id} value={resume.id}>
                          {resume.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </SelectGroup>
              </div>
              <div className="grid flex-1 gap-2">
                <Label htmlFor="name" className="text-right">
                  Job Description
                </Label>
                <Input
                  id="jobDescriptionUrl"
                  className="col-span-3"
                  type="text"
                  placeholder="https://job-description.com"
                  value={jobDescriptionUrl}
                  onChange={handleJobDescriptionUrlChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={!selectedResume || uploading}
              >
                {uploading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Save changes"
                )}
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
        ) : interviewSet.length === 0 ? (
          <p>
            Not found any questions. Please upload your resume and
            jobdescription.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-start">
                    CV
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-start">
                    CreatedDate
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-start">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {interviewSet.map((interview: any) => (
                  <tr key={interview.id}>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      {interview.resumeName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {interview.createdAt}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700 flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          router.push(`/prepare-hub/${interview.id}`)
                        }
                      >
                        Edit
                      </Button>
                      <Button>Delete</Button>
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

export default page;
