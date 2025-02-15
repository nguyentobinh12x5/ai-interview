import { SummaryResponse } from '../models/Summary';

export const generateSummary = async (file: File, keypoint: number = 5): Promise<SummaryResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('QuestionCount', keypoint.toString());

    const response = await fetch('https://ai-api.sobu.io/api/Document/summarize', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to generate summary');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
};