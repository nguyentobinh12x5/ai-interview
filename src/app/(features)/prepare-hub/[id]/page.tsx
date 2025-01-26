"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import axios from "axios";
import { use } from "react";

const Page = (props: { params: Promise<{ id: string }> }) => {
  const params = use(props.params);
  const { id } = params;
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchInterviewSet = async () => {
      try {
        const response = await axios.get(`/api/interview-set?id=${id}`);
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching interview set:", error);
      }
    };

    fetchInterviewSet();
  }, [id]);

  return (
    <div className="flex flex-col gap-6">
      <h1>Interview Prepare Hub</h1>
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-4">
          <Button>Add Question</Button>
          <p>Total Question: {data.length}</p>
        </div>
        <div className="flex justify-center items-center gap-4">
          <Button variant="outline">Download all Q&A</Button>
          <Button>Apply to Copilot</Button>
        </div>
      </div>
      <div className="mb-14 flex flex-col gap-6">
        {data.map((qa) => (
          <div
            key={qa.id}
            className="relative flex resize-y gap-3 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4"
          >
            <div className="flex h-full min-w-[33%] flex-grow-[1] flex-col self-end">
              <div className="mb-[6px] flex items-center font-[500] text-slate-900">
                <span>Question</span>
              </div>
              <Textarea className="mt-3 h-[300px]" value={qa.question} />
            </div>
            <div className="flex h-full flex-grow-[2] flex-col">
              <div className="mb-[6px] flex flex-wrap-reverse items-center font-[500] text-slate-900 gap-4 justify-between">
                <div className="flex items-center gap-2">
                  <span>Answer</span>
                  <Button>Regenerate</Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button>Save</Button>
                  <Button variant="outline">Delete</Button>
                </div>
              </div>
              <Textarea value={qa.answer} className="h-[300px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
