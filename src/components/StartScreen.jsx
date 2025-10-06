import { useQuiz } from "../context/QuizProvider";

const StartScreen = () => {
  const { numQuestions, dispatch } = useQuiz();

  return (
    <div className="start">
      <h2>Welcome to The Quiz!</h2>
      <h3>{numQuestions} questions to test your mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's start
      </button>
    </div>
  );
};

export default StartScreen;
