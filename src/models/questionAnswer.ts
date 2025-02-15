export interface QuestionAnswer {
  id: number;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
  interviewSetId: number;
}
