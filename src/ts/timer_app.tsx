// Found this to be super useful https://usehooks.com/useLocalStorage/
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
};

const App = () => {
  const [timersState, setTimers] = useLocalStorage("timers", []);
  const [sequenceState, setSequence] = useLocalStorage("timerSequence", 1);

  const handleAddTimer = (type) => {
    setTimers(
      [
        {
          id: sequenceState,
          name: "",
          isTimeSet: false,
          isEdit: true,
          type: type,
        },
      ].concat(timersState)
    );

    setSequence(sequenceState + 1);
  };

  const handleEditTimer = (id) => {
    const timers = timersState.slice();
    const idx = timers.findIndex((t) => t.id === id);
    timers[idx].isEdit = true;

    setTimers(timers);
  };

  const handleSaveTimer = (id) => {
    const timers = timersState.slice();
    const idx = timers.findIndex((t) => t.id === id);
    timers[idx].isTimeSet = true;

    setTimers(timers);
  };

  const handleSubmitName = (timerName, id) => {
    const timers = timersState.slice();
    const idx = timers.findIndex((t) => t.id === id);
    timers[idx].name = timerName;
    timers[idx].isEdit = false;

    setTimers(timers);
  };

  const handleDeleteTimer = (id) => {
    const timers = timersState.slice();
    const idx = timers.findIndex((t) => t.id === id);
    timers.splice(idx, 1);

    setTimers(timers);
  };

  return (
    <div style={{ minWidth: "100%" }}>
      <ActionRow handleAddTimer={handleAddTimer} />
      <TimerContainer
        timers={timersState}
        handleSubmitName={handleSubmitName}
        handleDeleteTimer={handleDeleteTimer}
        handleEditTimer={handleEditTimer}
        handleSaveTimer={handleSaveTimer}
      />
    </div>
  );
};

const ActionRow = (props) => {
  const handleDropdownToggle = () => {
    document.getElementById("new-timer-dropdown").classList.toggle("is-active");
  };

  return (
    <div className="action-row">
      <div id="new-timer-dropdown" className="dropdown">
        <div className="dropdown-trigger">
          <button
            onClick={handleDropdownToggle}
            className="button is-small is-success"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <span>New Timer</span>
            <span className="icon is-small">
              <i className="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div className="dropdown-menu" role="menu">
          <div onClick={handleDropdownToggle} className="dropdown-content">
            <a
              onClick={() => props.handleAddTimer("countup")}
              className="dropdown-item"
            >
              Counting Up
            </a>
            <a
              onClick={() => props.handleAddTimer("countdown")}
              className="dropdown-item"
            >
              Counting Down
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimerContainer = (props) => {
  return (
    <div id="timer-container">
      {props.timers.map((prop) => {
        return (
          <TimerCard
            key={prop.id}
            {...prop}
            handleSubmitName={props.handleSubmitName}
            handleDeleteTimer={props.handleDeleteTimer}
            handleEditTimer={props.handleEditTimer}
            handleSaveTimer={props.handleSaveTimer}
          />
        );
      })}
    </div>
  );
};

const TimerCard = (props) => {
  const [timerState, setTimer] = useLocalStorage(props.id.toString(), {
    lastTicked: 0,
    seconds: 0,
    isStarted: false,
    wasPaused: false,
    isEditable: props.type === "countdown",
    editSeconds: 0,
  });

  let interval;
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

  React.useEffect(() => {
    if (timerState.isStarted) {
      if (props.type === "countdown") {
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

  React.useEffect(() => {
    const nameInput = document.getElementById(props.id);
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
      isEditable: props.type === "countdown",
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
    const hours = parseInt(document.getElementById(`hours${props.id}`).value);
    const min = parseInt(document.getElementById(`min${props.id}`).value);
    const sec = parseInt(document.getElementById(`sec${props.id}`).value);

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
};

const TimerCardContent = (props) => {
  const getTimeFromSeconds = () =>
    `${getHours(props.seconds).toString().padStart(2, "0")}:${getMinutes(
      props.seconds
    )
      .toString()
      .padStart(2, "0")}:${getSeconds(props.seconds)
      .toString()
      .padStart(2, "0")}`;

  const getSeconds = (totalSeconds) => (totalSeconds % 3600) % 60;
  const getMinutes = (totalSeconds) => Math.floor((totalSeconds % 3600) / 60);
  const getHours = (totalSeconds) => Math.floor(totalSeconds / 3600);

  return (
    <div className="card-content">
      {props.isEditable ? (
        <div className="timer-edit-container content">
          <input
            id={`hours${props.id}`}
            min="0"
            className="timer-edit"
            type="number"
            defaultValue={getHours(props.editSeconds)}
          />{" "}
          :
          <input
            id={`min${props.id}`}
            min="0"
            max="59"
            className="timer-edit"
            type="number"
            defaultValue={getMinutes(props.editSeconds)}
          />{" "}
          :
          <input
            id={`sec${props.id}`}
            min="0"
            max="59"
            className="timer-edit"
            type="number"
            defaultValue={getSeconds(props.editSeconds)}
          />
        </div>
      ) : (
        <span
          onClick={props.handleTimerClick}
          className="timer-click content is-centered"
        >
          {getTimeFromSeconds()}
        </span>
      )}
    </div>
  );
};

const TimerCardHeader = (props) => {
  const handleEditInputBlur = (e) => {
    if (e.target.value.length > 0) {
      props.handleSubmitName(e.target.value, props.id);
    }
  };

  const handleNameClick = () => {
    props.handleEditTimer(props.id);
  };

  const handleNameKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target.value.length > 0) {
        props.handleSubmitName(e.target.value, props.id);
      }
    }
  };

  const handleDeleteTimer = () => {
    window.localStorage.removeItem(props.id);
    props.handleDeleteTimer(props.id);
  };

  return (
    <header className="card-header">
      {props.isEdit ? (
        <div className="edit-input-control">
          <input
            onBlur={handleEditInputBlur}
            onKeyPress={handleNameKeyPress}
            id={props.id}
            defaultValue={props.name}
            placeholder="What are you timing?"
            className="input edit-input card-header-title"
            type="text"
          />
        </div>
      ) : (
        <div className="card-header-title">
          <span
            title={`Click to edit - ${props.name}`}
            onClick={handleNameClick}
            className="name-content"
          >
            {props.name}
          </span>
        </div>
      )}
      <span className="icon">
        <i
          aria-hidden="true"
          onClick={handleDeleteTimer}
          id={`delete-${props.id}`}
          className="fas fa-times delete-button"
        ></i>
      </span>
    </header>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
