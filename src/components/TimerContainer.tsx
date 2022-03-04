import useLocalStorage from "../hooks/useLocalStorage";
import ActionRow from "./ActionRow";
import TimerCard from "./TimerCard";

export enum TimerType {
  Countup,
  Countdown,
}

export interface Timer {
  id: number;
  name: string;
  isTimeSet: boolean;
  isEdit: boolean;
  type: TimerType;
}

export default function TimerContainer() {
  const [timersState, setTimers] = useLocalStorage("timers", []);
  const [sequenceState, setSequence] = useLocalStorage("timerSequence", 1);

  const handleAddTimer = (timerType: TimerType) => {
    setTimers(
      [
        {
          id: sequenceState,
          name: "",
          isTimeSet: false,
          isEdit: true,
          timerType: timerType,
        },
      ].concat(timersState)
    );

    setSequence(sequenceState + 1);
  };

  const handleEditTimer = (id: number) => {
    const timers = timersState.slice();
    const idx = timers.findIndex((t: Timer) => t.id === id);
    timers[idx].isEdit = true;

    setTimers(timers);
  };

  const handleSaveTimer = (id: number) => {
    const timers = timersState.slice();
    const idx = timers.findIndex((t: Timer) => t.id === id);
    timers[idx].isTimeSet = true;

    setTimers(timers);
  };

  const handleSubmitName = (timerName: string, id: number) => {
    console.log("test");
    const timers = timersState.slice();
    const idx = timers.findIndex((t: Timer) => t.id === id);
    timers[idx].name = timerName;
    timers[idx].isEdit = false;

    setTimers(timers);
  };

  const handleDeleteTimer = (id: number) => {
    const timers = timersState.slice();
    const idx = timers.findIndex((t: Timer) => t.id === id);
    timers.splice(idx, 1);

    setTimers(timers);
  };

  return (
    <div style={{ minWidth: "100%" }}>
      <ActionRow handleAddTimer={handleAddTimer} />

      <div id="timer-container">
        {timersState.map((timer: Timer) => {
          return (
            <TimerCard
              key={timer.id}
              {...timer}
              handleSubmitName={handleSubmitName}
              handleDeleteTimer={handleDeleteTimer}
              handleEditTimer={handleEditTimer}
              handleSaveTimer={handleSaveTimer}
            />
          );
        })}
      </div>
      {/*
      <TimerContainer
        timers={timersState}
        handleSubmitName={handleSubmitName}
        handleDeleteTimer={handleDeleteTimer}
        handleEditTimer={handleEditTimer}
        handleSaveTimer={handleSaveTimer}
      /> */}
    </div>
  );
}
