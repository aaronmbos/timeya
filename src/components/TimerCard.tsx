import { useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import TimerCardContent from "./TimerCardContent";
import TimerCardHeader from "./TimerCardHeader";
import { TimerType } from "./TimerContainer";

export interface TimerCardProps {
  id: number;
  name: string;
  type: TimerType;
  isEdit: boolean;
  isTimeSet: boolean;
  handleSaveTimer: (id: number) => void;
  handleEditTimer: (id: number) => void;
  handleSubmitName: (name: string, id: number) => void;
  handleDeleteTimer: (id: number) => void;
}

export default function TimerCard(props: TimerCardProps) {
  const [timerState, setTimer] = useLocalStorage(props.id.toString(), {
    lastTicked: 0,
    seconds: 0,
    isStarted: false,
    wasPaused: false,
    isEditable: props.type === TimerType.Countdown,
    editSeconds: 0,
  });

  let interval: NodeJS.Timer;
  const tick = () =>
    setTimer(() => {
      return {
        ...timerState,
        lastTicked: Math.floor(Date.now() / 1000),
        seconds:
          timerState.lastTicked === 0
            ? parseInt(timerState.seconds) + 1
            : timerState.wasPaused
            ? parseInt(timerState.seconds)
            : parseInt(timerState.seconds) +
              (Math.floor(Date.now() / 1000) - timerState.lastTicked),
      };
    });

  const countdownTick = () =>
    setTimer(() => {
      return {
        ...timerState,
        lastTicked: Math.floor(Date.now() / 1000),
        seconds:
          timerState.lastTicked === 0
            ? parseInt(timerState.seconds) + 1
            : timerState.wasPaused
            ? parseInt(timerState.seconds)
            : parseInt(timerState.seconds) +
              (timerState.lastTicked - Math.floor(Date.now() / 1000)),
      };
    });

  useEffect(() => {
    if (timerState.isStarted) {
      if (props.type === TimerType.Countdown) {
        if (timerState.seconds <= 0 && timerState.isStarted) {
          setTimer({
            lastTicked: 0,
            seconds: 0,
            isStarted: false,
            wasPaused: false,
            isEditable: false,
            editSeconds: timerState.initialTime,
            isComplete: true,
            initialTime: timerState.initialTime,
          });
        }
        interval = setInterval(() => countdownTick(), 1000);
      } else {
        interval = setInterval(() => tick(), 1000);
      }
    }

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    const nameInput = document.getElementById(props.id.toString());
    if (nameInput !== null) {
      nameInput.focus();
    }
  });

  const handleTimerReset = () => {
    setTimer({
      lastTicked: 0,
      seconds: 0,
      isStarted: false,
      wasPaused: false,
      isEditable: props.type === TimerType.Countdown,
      editSeconds: timerState.initialTime,
      initialTime: timerState.initialTime,
    });
    clearInterval(interval);
  };

  const handleTimerPlayPause = () => {
    const wasPaused = timerState.wasPaused && !timerState.isStarted;
    const newTimer = {
      ...timerState,
      lastTicked: Math.floor(Date.now() / 1000),
      wasPaused: wasPaused,
      isStarted: !timerState.isStarted,
    };
    setTimer(newTimer);
  };

  const handleTimerClick = () => {
    setTimer({
      ...timerState,
      isEditable: true,
      editSeconds: timerState.seconds,
    });
  };

  const handleEditCancel = () => {
    setTimer({ ...timerState, isEditable: false, editSeconds: 0 });
  };

  const handleEditSave = () => {
    const hours = parseInt(
      (document.getElementById(`hours${props.id}`) as HTMLInputElement)
        ?.value ?? ""
    );
    const min = parseInt(
      (document.getElementById(`min${props.id}`) as HTMLInputElement)?.value ??
        ""
    );
    const sec = parseInt(
      (document.getElementById(`sec${props.id}`) as HTMLInputElement)?.value ??
        ""
    );

    if (
      isNaN(hours) ||
      hours < 0 ||
      isNaN(min) ||
      min < 0 ||
      min > 59 ||
      isNaN(sec) ||
      sec < 0 ||
      sec > 59
    ) {
      return;
    }

    const totalSeconds = sec + min * 60 + hours * 3600;
    let initTime = timerState.initialTime;
    if (!props.isTimeSet) {
      initTime = totalSeconds;
      props.handleSaveTimer(props.id);
    }

    setTimer({
      ...timerState,
      initialTime: initTime,
      seconds: totalSeconds,
      editSeconds: 0,
      isEditable: false,
    });
  };

  return (
    <div className="timer-card">
      <div
        id={`card${props.id}`}
        className={`card ${timerState.isComplete ? "is-complete" : ""}`}
      >
        <TimerCardHeader
          name={props.name}
          isEdit={props.isEdit}
          id={props.id}
          handleEditTimer={props.handleEditTimer}
          handleSubmitName={props.handleSubmitName}
          handleDeleteTimer={props.handleDeleteTimer}
        />
        <TimerCardContent
          isEditable={timerState.isEditable}
          id={props.id}
          editSeconds={timerState.editSeconds}
          handleTimerClick={handleTimerClick}
          seconds={timerState.seconds}
        />
        {timerState.isEditable ? (
          <div className="edit-controls card-footer">
            <div className="card-footer-item">
              <button
                onClick={handleEditSave}
                className="button is-success is-small"
              >
                Save
              </button>
            </div>
            <div className="card-footer-item">
              <button
                onClick={handleEditCancel}
                className="button is-danger is-small"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className={`card-footer ${props.name ? "" : "hide"}`}>
            <div className="card-footer-item">
              {!timerState.isComplete ? (
                <div>
                  <i
                    id={`play-${props.id}`}
                    onClick={handleTimerPlayPause}
                    className={`fas ${
                      timerState.isStarted
                        ? "fa-pause-circle play-button"
                        : "fa-play-circle play-button"
                    }`}
                  ></i>
                  <i
                    id={`reset-${props.id}`}
                    onClick={handleTimerReset}
                    className={`fas fa-redo reset-button ${
                      timerState.seconds > 0 ? "" : "hide"
                    }`}
                  ></i>
                </div>
              ) : (
                <i
                  id={`reset-${props.id}`}
                  onClick={handleTimerReset}
                  className={`fas fa-redo reset-button ${
                    timerState.seconds > 0 || timerState.isComplete
                      ? ""
                      : "hide"
                  }`}
                ></i>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
