"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InterviewCard from "./components/InterviewCard";
import { Resume } from "@/models/resume";
import { InterviewSet } from "@/models/interviewSet";

const Page = () => {
  const { toast } = useToast();
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [interviewSet, setInterviewSet] = useState<InterviewSet[]>(null);
  const [uploading, setUploading] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getInterviewSet = async () => {
    try {
      const response = await axios.get("/api/prepare-hub");
      setInterviewSet(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getInterviewSet();
  }, []);

  const getUserResume = async () => {
    try {
      const response = await axios.get("/api/resume");
      setResumes(response.data);
      setResumeLoading(false);
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        description: "Erro get user resume. Please try again",
      });
    }
  };

  const handleJobDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJobDescription(event.target.value);
  };

  const handleResumeChange = (value: string) => {
    setSelectedResume(value);
  };

  const handleSubmit = async () => {
    if (!selectedResume) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("resumeId", selectedResume);
    formData.append("jobDescription", jobDescription);
    formData.append("companyName", companyName);
    formData.append("position", position);
    try {
      await axios.post("/api/prepare-hub", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        description: "Questions generated successfully",
      });
      setIsDialogOpen(false);
      getInterviewSet();
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        description: "Error generating questions. Please try again",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (interviewSetId: number) => {
    try {
      await axios.delete(`/api/prepare-hub?Id=${interviewSetId}`);
      setInterviewSet(
        interviewSet.filter((data) => data.id !== interviewSetId)
      );
      toast({
        description: "Interview deleted successfully",
      });
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        description: "Error deleting interview",
      });
    }
  };
  return (
    <>
      <div>
        <h1>Interview Preparation Hub</h1>
        <div className="mt-1 max-w-[640px] text-sm font-medium text-slate-700">
          Generate interview questions and answers based on your resume and job
          descriptions
        </div>
      </div>
      <div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => getUserResume()}>
              <Plus /> Prepare
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tell us more about your job interview</DialogTitle>
              <DialogDescription>
                Add Detail about your job interview. Click save when you are
                done.
              </DialogDescription>
            </DialogHeader>
            {resumeLoading ? (
              <Loading />
            ) : (
              <>
                <div className="flex flex-col space-y-2">
                  <div className="flex-1 gap-2">
                    <Label>
                      Resume <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={handleResumeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your Resumes" />
                      </SelectTrigger>
                      <SelectContent>
                        {resumes.map((resume: Resume) => (
                          <SelectItem
                            key={resume.id}
                            value={resume.id.toString()}
                          >
                            {resume.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-1 gap-2">
                    <div>
                      <Label htmlFor="name">
                        Company Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        className="col-span-3"
                        type="text"
                        placeholder="ABC Technology"
                        value={companyName}
                        onChange={(event) =>
                          setCompanyName(
                            (event.target as HTMLInputElement).value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">
                        Position <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        className="col-span-3"
                        type="text"
                        placeholder="Software engineer"
                        value={position}
                        onChange={(event) =>
                          setPosition((event.target as HTMLInputElement).value)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex-1 gap-2">
                    <Label htmlFor="name">Job Description</Label>
                    <Textarea
                      id="jobDescriptionUrl"
                      className="col-span-3"
                      placeholder="Job description"
                      value={jobDescription}
                      onChange={handleJobDescriptionChange}
                      rows={5}
                    />
                  </div>
                </div>
              </>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={!selectedResume || uploading}
              >
                {uploading ? <Loading /> : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        {loading ? (
          <Loading />
        ) : interviewSet.length === 0 ? (
          <p>
            Not found any questions. Please upload your resume and
            jobdescription.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {interviewSet.map((interview: InterviewSet) => (
              <InterviewCard
                key={interview.id}
                id={interview.id}
                companyName={interview.companyName}
                position={interview.position}
                resumeName={interview.resumeName}
                createdAt={interview.createdAt}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
