import { createContext, useContext, useReducer, useEffect } from "react";

import { initialTimeForQuestion } from "../helper";
import { STATUSES } from "../helper";

const QuizContext = createContext();

const initialState = {
  questions: [],
  index: 0,
  answer: null,
  status: STATUSES.LOADING,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
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
      return {
        ...state,
        status: STATUSES.ACTIVE,
        secondsRemaining: initialTimeForQuestion * state.questions.length,
      };
    case "restart":
      return {
        ...state,
        status: STATUSES.ACTIVE,
        points: 0,
        secondsRemaining: initialTimeForQuestion * state.questions.length,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining <= 0 ? STATUSES.FINISHED : state.status,
      };
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
      throw new Error("Unknown action");
  }
}
const QuizProvider = ({ children }) => {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecieved", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions,
        index,
        answer,
        status,
        points,
        secondsRemaining,
        highscore,
        numQuestions,
        maxPossiblePoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

const useQuiz = () => {
  const context = useContext(QuizContext);

  if (context === undefined)
    throw new Error("QuizContext was used outside QuizProvider");

  return context;
};
export { QuizProvider, useQuiz };
