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

const initialState = {
  questios: [],
  index: 14,
  answer: null,
  status: STATUSES.LOADING,
  points: 0,
  highscore: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return {
        ...state,
        questions: action.payload,
        status: STATUSES.READY,
      };
    case "dataFailed":
      return { ...state, status: STATUSES.ERROR };
    case "start":
      return { ...state, status: STATUSES.ACTIVE };
    case "restart":
      return { ...state, status: STATUSES.READY };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: STATUSES.FINISHED,
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "updateAnswer":
      console.log(action.payload);
      const currentQuestion = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === currentQuestion.correctOption
            ? state.points + currentQuestion.points
            : state.points,
      };
    default:
      throw new Error("Action unknown");
  }
}

const App = () => {
  const [{ questions, status, index, answer, points, highscore }, dispatch] =
    useReducer(reducer, initialState);
  const numQuestions = questions?.length ?? 0;
  const maxPossiblePoints = questions?.reduce((sum, question) => {
    return sum + question.points ?? 0;
  }, 0);

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecieved", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === STATUSES.LOADING && <Loader />}
        {status === STATUSES.ERROR && <Error />}
        {status === STATUSES.READY && (
          <StartScreen numQuestion={numQuestions} dispatch={dispatch} />
        )}
        {status === STATUSES.ACTIVE && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Questions
              question={questions[index]}
              answer={answer}
              dispatch={dispatch}
            />
            {answer !== null ? (
              <NextButton
                dispatch={dispatch}
                index={index}
                numQuestions={numQuestions}
              />
            ) : null}
          </>
        )}
        {status === STATUSES.FINISHED && (
          <FinishScreen
            dispatch={dispatch}
            points={points}
            max={maxPossiblePoints}
            highscore={highscore}
          />
        )}
      </Main>
    </div>
  );
};

export default App;
