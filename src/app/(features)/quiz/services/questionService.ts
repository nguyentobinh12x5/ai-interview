import { QuestionResponse } from "../models/Question";

export const generateQuestions = async (
  file: File,
  questionCount: number = 10
): Promise<QuestionResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("QuestionCount", questionCount.toString());

    const response = await fetch(
      "https://ai-api.sobu.io/api/Document/generate-multichoice-questions",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate questions");
    }
    console.log("response", response);
    return await response.json();
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate questions");
  }
};
