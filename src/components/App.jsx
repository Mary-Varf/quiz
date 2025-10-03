import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import { STATUSES } from "../helper";

const initialState = {
  questios: [],
  index: 0,
  answer: null,
  status: STATUSES.LOADING,
  points: 0,
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
    case "updateAnswer":
      const currentQuestion = state.questions[state.index];

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === currentQuestion.correctQuestion
            ? state.points + currentQuestion.points
            : state.points,
      };
    default:
      throw new Error("Action unknown");
  }
}

const App = () => {
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const numQuestion = questions?.length ?? 0;

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
          <StartScreen numQuestion={numQuestion} dispatch={dispatch} />
        )}
        {status === STATUSES.ACTIVE && (
          <Question
            question={questions[index]}
            answer={answer}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
};

export default App;
