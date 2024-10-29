import React, { useReducer } from "react";

// Quiz data with detailed explanations
const quizData = [
  {
    question: "What hook is used to handle complex state logic in React?",
    options: ["useState", "useReducer", "useEffect", "useContext"],
    correct: 1,
    explanation:
      "useReducer is specifically designed for complex state management scenarios.",
  },
  {
    question: "Which function updates the state in useReducer?",
    options: ["setState", "dispatch", "update", "setReducer"],
    correct: 1,
    explanation:
      "dispatch is the function provided by useReducer to trigger state updates.",
  },
  {
    question: "What pattern is useReducer based on?",
    options: [
      "Observer Pattern",
      "Redux Pattern",
      "Factory Pattern",
      "Module Pattern",
    ],
    correct: 1,
    explanation: "useReducer is inspired by Redux's state management pattern.",
  },
];

// Initial state with feedback state added
const initialState = {
  currentQuestion: 0,
  score: 0,
  showScore: false,
  selectedOption: null,
  showFeedback: false, // New state for showing answer feedback
};

// Enhanced reducer with feedback handling
const reducer = (state, action) => {
  switch (action.type) {
    case "SELECT_OPTION":
      return {
        ...state,
        selectedOption: action.payload,
        showFeedback: true, // Show feedback when option is selected
      };
    case "NEXT_QUESTION":
      const isCorrect =
        action.payload === quizData[state.currentQuestion].correct;
      const nextQuestion = state.currentQuestion + 1;
      return {
        ...state,
        score: isCorrect ? state.score + 1 : state.score,
        currentQuestion: nextQuestion,
        showScore: nextQuestion === quizData.length,
        selectedOption: null,
        showFeedback: false, // Reset feedback for next question
      };
    case "RESTART":
      return initialState;
    default:
      return state;
  }
};

const Quiz = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentQuestion, score, showScore, selectedOption, showFeedback } =
    state;

  const handleOptionClick = (optionIndex) => {
    dispatch({ type: "SELECT_OPTION", payload: optionIndex });
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      dispatch({ type: "NEXT_QUESTION", payload: selectedOption });
    }
  };

  const handleRestart = () => {
    dispatch({ type: "RESTART" });
  };

  if (showScore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-4">
            Quiz Complete!
          </h2>
          <p className="text-xl text-center mb-6">
            Your score: {score} out of {quizData.length}
          </p>
          <button
            onClick={handleRestart}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuizData = quizData[currentQuestion];
  const isCorrectAnswer = (optionIndex) =>
    optionIndex === currentQuizData.correct;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Question {currentQuestion + 1}/{quizData.length}
          </p>
          <h2 className="text-xl font-semibold mb-4">
            {currentQuizData.question}
          </h2>
        </div>

        <div className="space-y-3 mb-6">
          {currentQuizData.options.map((option, index) => {
            let buttonStyle = "bg-gray-50 hover:bg-gray-100";

            if (showFeedback && selectedOption === index) {
              buttonStyle = isCorrectAnswer(index)
                ? "bg-green-100 border-2 border-green-500 text-green-700"
                : "bg-red-100 border-2 border-red-500 text-red-700";
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={showFeedback}
                className={`w-full p-3 text-left rounded-lg transition-colors ${buttonStyle}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div
            className={`p-4 rounded-lg mb-4 ${
              isCorrectAnswer(selectedOption)
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {isCorrectAnswer(selectedOption)
              ? "Correct! "
              : `Incorrect. The correct answer was: ${
                  currentQuizData.options[currentQuizData.correct]
                }. `}
            {currentQuizData.explanation}
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={!showFeedback}
          className={`w-full py-2 px-4 rounded transition-colors ${
            !showFeedback
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default Quiz;
