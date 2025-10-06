import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Questions from "./Questions";
import { STATUSES } from "../helper";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";
import { useQuiz } from "../context/QuizProvider";

const App = () => {
  const { status, answer } = useQuiz();

  return (
    <div className="app">
      <Header />
      <Main>
        {status === STATUSES.LOADING && <Loader />}
        {status === STATUSES.ERROR && <Error />}
        {status === STATUSES.READY && <StartScreen />}
        {status === STATUSES.ACTIVE && (
          <>
            <Progress />
            <Questions />
            <Timer />
            {answer !== null ? <NextButton /> : null}
          </>
        )}
        {status === STATUSES.FINISHED && <FinishScreen />}
      </Main>
    </div>
  );
};

export default App;
