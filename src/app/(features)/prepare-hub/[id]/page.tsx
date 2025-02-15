"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import axios from "axios";
import { use } from "react";
import { toast } from "@/hooks/use-toast";
import { LoaderCircle, MessageCircle, Plus } from "lucide-react";
import { createEmbeddingsForInterviewSet, regenerateAnswer } from "./action";
import Loading from "@/components/ui/loading";

const Page = (props: { params: Promise<{ id: string }> }) => {
  const params = use(props.params);
  const { id } = params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingCopilot, setLoadingCopilot] = useState(false);
  const [updatingQaId, setUpdatingQaId] = useState<number | null>(null);
  const [editingAnswers, setEditingAnswers] = useState({});
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  useEffect(() => {
    const fetchInterviewSet = async () => {
      try {
        const response = await axios.get(`/api/interview-set?id=${id}`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          description: "Error fetching interview set",
        });
      }
    };

    fetchInterviewSet();
  }, [id]);

  const handleAnswerChange = (qaId: number, newAnswer: string) => {
    setEditingAnswers((prev) => ({
      ...prev,
      [qaId]: newAnswer,
    }));
  };

  const handleSave = async (qaId: number) => {
    try {
      setLoadingUpdate(true);
      setUpdatingQaId(qaId);
      const formData = new FormData();
      formData.append("qaId", qaId.toString());
      formData.append("answer", editingAnswers[qaId]);
      await axios.put("/api/interview-set", formData);
      setData(
        data.map((qa) =>
          qa.id === qaId ? { ...qa, answer: editingAnswers[qaId] } : qa
        )
      );
      toast({
        description: "Answer saved successfully",
      });
      setLoadingUpdate(false);
      setUpdatingQaId(null);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Error saving answer",
      });
      setLoadingUpdate(false);
      setUpdatingQaId(null);
    }
  };

  const handleAddQuestion = async () => {
    try {
      const formData = new FormData();
      formData.append("question", newQuestion);
      formData.append("answer", newAnswer);
      formData.append("interviewSetId", id);

      const response = await axios.post("/api/interview-set", formData);
      setData([response.data[0], ...data]);
      setNewQuestion("");
      setNewAnswer("");
      setShowAddQuestion(false);
      toast({
        description: "Question added successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Error adding question",
      });
    }
  };

  const handleApplyCopilot = async (interviewId: number) => {
    try {
      setLoadingCopilot(true);
      await createEmbeddingsForInterviewSet(interviewId);
      toast({
        description: "Applied Copilot successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Error Applied Copilot",
      });
    } finally {
      setLoadingCopilot(false);
    }
  };

  const handleRegenerate = async (
    qaId: number,
    question: string,
    answer: string
  ) => {
    try {
      setLoadingUpdate(true);
      setUpdatingQaId(qaId);
      const response = await regenerateAnswer(
        qaId,
        question,
        answer,
        parseInt(id)
      );
      setData(
        data.map((qa) => (qa.id === qaId ? { ...qa, answer: response } : qa))
      );
      toast({
        description: "Answer regenerated successfully",
      });
      setLoadingUpdate(false);
      setUpdatingQaId(null);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Error regenerating answer",
      });
      setLoadingUpdate(false);
      setUpdatingQaId(null);
    }
  };

  const deleteAddQuestion = () => {
    setNewQuestion("");
    setNewAnswer("");
    setShowAddQuestion(false);
  };

  const handleDelete = async (qaId: number) => {
    try {
      const response = await axios.delete(`/api/interview-set?qaId=${qaId}`);
      setData(data.filter((qa) => qa.id !== qaId));
      toast({
        description: response.data,
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Error deleting question",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1>Interview Prepare Hub</h1>
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-4">
          <Button onClick={() => setShowAddQuestion(true)}>
            <Plus /> Add Question
          </Button>
          <p>Total Question: {data.length}</p>
        </div>
        <div className="flex justify-center items-center gap-4">
          <Button onClick={() => handleApplyCopilot(data[0].interviewSetId)}>
            {loadingCopilot ? <Loading /> : "Apply to Copilot"}
          </Button>
        </div>
      </div>
      <div className="mb-14 flex flex-col gap-6">
        {showAddQuestion && (
          <div className="relative flex resize-y gap-3 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div className="flex h-full w-1/3 flex-col self-end">
              <div className="mb-[6px] flex items-center font-[500]">
                <span>Question</span>
              </div>
              <Textarea
                className="mt-3 h-[300px]"
                placeholder="Enter your question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
            </div>
            <div className="flex h-full w-2/3 flex-col">
              <div className="mb-[6px] flex flex-wrap-reverse items-center font-[500] gap-4 justify-between">
                <div className="flex items-center gap-2">
                  <span>Answer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => handleAddQuestion()}>Save</Button>
                  <Button variant="outline" onClick={() => deleteAddQuestion()}>
                    Delete
                  </Button>
                </div>
              </div>
              <Textarea
                className="h-[300px]"
                placeholder="Enter your answer"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />
            </div>
          </div>
        )}
        {loading ? (
          <Loading />
        ) : (
          data.map((qa) => (
            <div
              key={qa.id}
              className="relative flex resize-y gap-3 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4"
            >
              <div className="flex h-full w-1/3 flex-col">
                <div className="mb-[6px] flex items-center font-[500] gap-2">
                  <span> Question</span>
                </div>
                <Textarea
                  className="mt-3 h-[300px]"
                  value={qa.question}
                  readOnly
                />
              </div>
              <div className="flex h-full w-2/3 flex-col">
                <div className="mb-[6px] flex flex-wrap-reverse items-center font-[500] gap-4 justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle />
                    <span>Answer</span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleRegenerate(qa.id, qa.question, qa.answer)
                      }
                    >
                      {loadingUpdate && updatingQaId === qa.id ? (
                        <div className="flex justify-center items-center gap-2">
                          <LoaderCircle className="animate-spin" />
                          <span>Regenerating</span>
                        </div>
                      ) : (
                        "Regenerate"
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleSave(qa.id)}
                      disabled={
                        editingAnswers[qa.id] === qa.answer ||
                        !editingAnswers[qa.id]
                      }
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(qa.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={editingAnswers[qa.id] ?? qa.answer}
                  onChange={(e) => handleAnswerChange(qa.id, e.target.value)}
                  className="h-[300px]"
                  disabled={loadingUpdate && updatingQaId === qa.id}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
