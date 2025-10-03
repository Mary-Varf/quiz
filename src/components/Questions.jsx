const Questions = ({ question, answer, dispatch }) => {
  const hasAnswered = answer !== null;
  return (
    <div>
      <h4>{question.question}</h4>
      <div className="options">
        {question.options.map((option, index) => (
          <button
            key={option}
            className={`btn btn-option ${
              hasAnswered && index === answer ? "answer" : ""
            } ${
              hasAnswered && index === question.correctOption
                ? "correct"
                : "wrong"
            }`}
            disabled={hasAnswered}
            onClick={() => dispatch({ type: "updateAnswer", payload: index })}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Questions;
