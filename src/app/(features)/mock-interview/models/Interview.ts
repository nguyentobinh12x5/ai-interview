export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export interface InterviewResponse {
  id: number;
  text: string;
  audio: string;
}
