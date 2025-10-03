import { useEffect } from "react";

const Timer = ({ time, dispatch }) => {
  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const hours = Math.floor(time / 3600);

  let hoursStrWithSemicolon;

  if (hours <= 0) hoursStrWithSemicolon = null;
  else hoursStrWithSemicolon = hours < 10 ? `0${hours}:` : `${hours}:`;

  const mins = Math.floor(time / 60) - hours * 60;
  const minsStr = mins < 10 ? `0${mins}` : mins;

  const sec = Math.floor(time % 60);
  const secStr = sec < 10 ? `0${sec}` : sec;

  return (
    <div className="timer">{`${
      hoursStrWithSemicolon ?? ""
    }${minsStr}:${secStr}`}</div>
  );
};

export default Timer;
