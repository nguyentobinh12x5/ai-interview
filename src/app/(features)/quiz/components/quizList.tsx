import React, { useState } from "react";
import { HelpCircle, Award, RotateCcw } from "lucide-react";
import Question from "./question";
import ResetQuizModal from "./resetQuizModal";

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

type QuestionListProps = {
  questions: Question[];
};

type ShuffledQuestion = Question & {
  originalOptions: string[];
  originalCorrectAnswer: number;
};

const QuestionList = ({ questions: initialQuestions }: QuestionListProps) => {
  const [questions, setQuestions] = useState<ShuffledQuestion[]>(
    initialQuestions.map((q) => ({
      ...q,
      originalOptions: [...q.options],
      originalCorrectAnswer: q.correctAnswer,
    }))
  );
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const shuffleQuestions = () => {
    // First shuffle each question's options
    const shuffledQuestions = questions.map((q) => {
      const newOptions = [...q.originalOptions];
      const shuffledIndices = shuffleArray([...newOptions.keys()]);
      const shuffledOptions = shuffledIndices.map((i) => q.originalOptions[i]);

      // Find where the original correct answer moved to
      const newCorrectIndex = shuffledIndices.findIndex(
        (i) => i === q.originalCorrectAnswer
      );

      return {
        ...q,
        options: shuffledOptions,
        correctAnswer: newCorrectIndex,
        originalOptions: q.originalOptions,
        originalCorrectAnswer: q.originalCorrectAnswer,
      };
    });

    // Then shuffle the questions themselves
    setQuestions(shuffleArray(shuffledQuestions));
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleReset = (shuffle: boolean) => {
    setSelectedAnswers({});
    setIsSubmitted(false);

    if (shuffle) {
      shuffleQuestions();
    } else {
      // Reset to original state
      setQuestions(
        initialQuestions.map((q) => ({
          ...q,
          originalOptions: [...q.options],
          originalCorrectAnswer: q.correctAnswer,
        }))
      );
    }
  };

  const getScore = () => {
    if (!isSubmitted) return null;
    const correctAnswers = questions.filter(
      (q) => selectedAnswers[q.id] === q.correctAnswer
    ).length;
    return {
      score: correctAnswers,
      total: questions.length,
      percentage: Math.round((correctAnswers / questions.length) * 100),
    };
  };

  const score = getScore();
  const allQuestionsAnswered = questions.every(
    (q) => selectedAnswers[q.id] !== undefined
  );

  return (
    <div className="space-y-8 relative">
      <ResetQuizModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onReset={handleReset}
      />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-5 w-5 text-indigo-600" />
          <span className="text-sm font-medium text-gray-600">
            {questions.length} Questions
          </span>
          {score && (
            <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-indigo-50 rounded-full">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">
                Score: {score.score}/{score.total} ({score.percentage}%)
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowResetModal(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset All Answers
        </button>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <Question
            key={question.id}
            id={question.id}
            index={index}
            text={question.text}
            options={question.options}
            correctAnswer={question.correctAnswer}
            explanation={question.explanation}
            selectedAnswer={selectedAnswers[question.id]}
            isSubmitted={isSubmitted}
            onAnswerSelect={handleAnswerSelect}
          />
        ))}
      </div>

      {!isSubmitted && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
            className={`
              px-6 py-3 text-base font-medium text-white rounded-lg
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              ${
                allQuestionsAnswered
                  ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }
            `}
          >
            Submit Answers
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionList;
