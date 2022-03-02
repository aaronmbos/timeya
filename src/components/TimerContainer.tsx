import useLocalStorage from "../hooks/useLocalStorage";

enum TimerType {
  Countup,
  Countdown
}

interface Timer {
  id: number,
  name: string,
  isTimeSet: boolean,
  isEdit: boolean,
  timerType: TimerType
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
      { /*<ActionRow handleAddTimer={handleAddTimer} />
      <TimerContainer
        timers={timersState}
        handleSubmitName={handleSubmitName}
        handleDeleteTimer={handleDeleteTimer}
        handleEditTimer={handleEditTimer}
        handleSaveTimer={handleSaveTimer}
      /> */}
    </div>
  );
};

