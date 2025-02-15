import React from "react";

const stepsData = [
  {
    id: 1,
    title: "Before Interview",
    items: ["Quiz", "Mock Interview", "Prepare Hub"],
  },
  {
    id: 2,
    title: "During Interview",
    items: ["🚀 AI Interview", "Real-Time Transcription", "Knowledge Support"],
  },
  {
    id: 3,
    title: "After Interview",
    items: ["Interview Summary", "Interview Analytics"],
  },
];

const Step = () => {
  return (
    <div className="mt-8 pt-8 max-w-screen-xl mx-auto">
      {/* Step Navigation */}
      <div className="mx-auto max-w-screen-xl text-center">
        <h2 className="sr-only">Steps</h2>
        <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100">
          <ol className="relative z-10 flex justify-between text-sm font-medium text-gray-500">
            {stepsData.map((step) => (
              <li key={step.id} className="flex flex-col">
                <div className="flex items-center gap-2 bg-white p-2">
                  <span
                    className={`size-6 rounded-full text-center text-[10px]/6 font-bold ${
                      step.id === 2 ? "bg-indigo-600 text-white" : "bg-gray-100"
                    }`}
                  >
                    {step.id}
                  </span>
                  <h1 className="hidden sm:block">{step.title}</h1>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Steps Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stepsData.map((step) => (
          <div key={step.id} className="p-6 rounded-lg">
            <div className="space-y-3">
              {step.items.map((item, index) => (
                <button
                  key={index}
                  className="w-full py-2 px-4 bg-white rounded-lg shadow text-gray-700 font-medium hover:text-indigo-600"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step;
