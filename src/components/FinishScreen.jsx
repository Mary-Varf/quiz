import { useQuiz } from "../context/QuizProvider";

const FinishScreen = () => {
  const { points, highscore, dispatch, questions } = useQuiz();
  const max = questions?.reduce((sum, question) => {
    return sum + question.points ?? 0;
  }, 0);
  const percentage = Math.round((points / max) * 100);

  let emoji;
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🥳";
  if (percentage >= 50 && percentage < 80) emoji = "😃";
  if (percentage >= 0 && percentage < 50) emoji = "😒";
  if (percentage === 0) emoji = "🤦";

  return (
    <>
      <p className="result">
        {emoji} You scored <strong>{points}</strong> out of {max} ({percentage}
        %)
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
      <button
        className="btn btn-restart"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart
      </button>
    </>
  );
};

export default FinishScreen;
