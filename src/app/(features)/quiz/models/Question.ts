export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuestionResponse {
  questions: Question[];
}
