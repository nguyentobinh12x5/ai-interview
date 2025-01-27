import React from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";

type QuestionProps = {
  id: number;
  index: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  selectedAnswer?: number;
  isSubmitted: boolean;
  onAnswerSelect: (questionId: number, answerIndex: number) => void;
};

const Question = ({
  id,
  index,
  text,
  options,
  correctAnswer,
  explanation,
  selectedAnswer,
  isSubmitted,
  onAnswerSelect,
}: QuestionProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start gap-4">
          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-semibold">
            {index + 1}
          </span>
          <div className="flex-grow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{text}</h3>
            {isSubmitted && selectedAnswer !== undefined && (
              <div
                className={`text-sm font-medium ${
                  selectedAnswer === correctAnswer
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {selectedAnswer === correctAnswer ? "Correct!" : "Incorrect"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-3">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = isSubmitted && index === correctAnswer;
            const isWrong =
              isSubmitted && isSelected && index !== correctAnswer;

            return (
              <label
                key={index}
                className={`
                  group flex items-center p-4 rounded-lg border-2 cursor-pointer
                  transition-all duration-200 relative
                  ${isSelected ? "border-indigo-600" : "border-gray-200"}
                  ${isCorrect ? "border-green-500 bg-green-50" : ""}
                  ${isWrong ? "border-red-500 bg-red-50" : ""}
                  ${
                    !isSelected && !isCorrect && !isSubmitted
                      ? "hover:border-indigo-200 hover:bg-indigo-50"
                      : ""
                  }
                  ${isSubmitted ? "cursor-default" : ""}
                `}
              >
                <div className="relative">
                  <input
                    type="radio"
                    name={`question-${id}`}
                    checked={isSelected}
                    onChange={() => onAnswerSelect(id, index)}
                    disabled={isSubmitted}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  {!isSubmitted && (
                    <div
                      className={`absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-200 ${
                        isSelected ? "scale-100" : ""
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-indigo-100 animate-ping" />
                    </div>
                  )}
                </div>
                <span
                  className={`ml-3 flex-grow ${
                    isCorrect
                      ? "text-green-700"
                      : isWrong
                      ? "text-red-700"
                      : "text-gray-700"
                  }`}
                >
                  {option}
                </span>
                {isSubmitted && (
                  <>
                    {isCorrect && (
                      <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
                    )}
                    {isWrong && (
                      <XCircle className="ml-2 h-5 w-5 text-red-500" />
                    )}
                  </>
                )}
              </label>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <span className="font-semibold">Explanation: </span>
                {explanation}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Question;
