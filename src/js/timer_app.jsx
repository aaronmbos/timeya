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
  const setValue = value => {
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
}

const App = () => {
  const [timersState, setTimers] = useLocalStorage('timers', []);

  const [sequenceState, setSequence] = useLocalStorage('timerSequence', 1);

  const handleAddTimer = () => {
    setTimers([{
      id: sequenceState,
      name: "",
      status: ""
    }].concat(timersState));
    
    setSequence(sequenceState + 1);
  };

  const handleSubmitName = (timerName, id) => {
    const timers = timersState.slice();
    timers.forEach(element => {
      if (element.id === id) {
        element.name = timerName;
      }
    });
    
    setTimers(timers);
  };

  const handleDeleteTimer = (id) => {
    const timers = timersState.slice();
    timers.forEach((element, idx) => {
      if (element.id === id) {
        let del = timers.splice(idx, 1);
      }
    });

    setTimers(timers);
  }

  return (
    <div>
      <ActionRow handleAddTimer={handleAddTimer} />
      <TimerContainer 
        timers={timersState} 
        handleSubmitName={handleSubmitName} 
        handleDeleteTimer={handleDeleteTimer}
      /> 
    </div>
  );
};

const ActionRow = (props) => {
  return (
    <div className="action-row buttons are-small">
      <button
        className="button is-success is-outlined"
        onClick={() => props.handleAddTimer()}
      >
        <span className="icon is-small">
          <i className="fas fa-plus"></i>
        </span>
        <span>New Timer</span>
      </button>
    </div>
  );
};

const TimerContainer = (props) => {
  return (
    <div id="timer-container">
      {props.timers.map((prop) => { 
        return <TimerCard 
          key={prop.id} 
          {...prop} 
          handleSubmitName={props.handleSubmitName} 
          handleDeleteTimer={props.handleDeleteTimer}
          /> })}
    </div>
  );
};

const TimerCard = (props) => {
  const [secondsState, setSeconds] = useLocalStorage(props.id.toString(), {"seconds": 0, "isStarted": false});

  let interval;
  const tick = () => setSeconds({"seconds": parseInt(secondsState.seconds) + 1, "isStarted": secondsState.isStarted});
  
  React.useEffect(() => {
    if (secondsState.isStarted) {
      interval = setInterval(() => tick(), 1000);
    }

    return () => {
      clearInterval(interval);
    }
  });

  React.useEffect(() => {
    const nameInput = document.getElementById(props.id);
    if (nameInput !== null) {
      nameInput.focus();
      nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') props.handleSubmitName(nameInput.value, props.id);
        document.getElementById(`play-${props.id}`).focus();
      });
    }
  });

  const handleTimerReset = (id) => {
    setSeconds({"seconds": 0, "isStarted": false});
    clearInterval(interval);
  }

  handleTimerPlayPause = (id) => {
    setSeconds({"seconds": parseInt(secondsState.seconds), "isStarted": !secondsState.isStarted});
  }

  const getTimeFromSeconds = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    const seconds = totalSeconds % 3600 % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  const handleCardOut = () => {
    document.getElementById(`deleteBack-${props.id}`).classList.add('hide');
    document.getElementById(`delete-${props.id}`).classList.add('hide');
  }

  const handleCardOver = () => {
    document.getElementById(`deleteBack-${props.id}`).classList.remove('hide');
    document.getElementById(`delete-${props.id}`).classList.remove('hide');
  }

  const handleDeleteTimer = (id) => {
    window.localStorage.removeItem(id.toString());
    props.handleDeleteTimer(id);
  }

  return (
    <div className="timer-card">
      <div onMouseOver={handleCardOver} onMouseOut={handleCardOut} className="border-overlay">
        <div className="border">
          <i id={`deleteBack-${props.id}`} className="fas fa-circle delete-background hide"></i>
          <i onClick={() => handleDeleteTimer(props.id)} id={`delete-${props.id}`} className="fas fa-times-circle delete-button hide"></i>
          {props.name === '' ? 
            <input id={props.id} placeholder="What are you timing?" className="name-input" type='text' /> :
            <div className="timer-name">{props.name}</div>
          }
          <div className='timer'>
            {getTimeFromSeconds(parseInt(secondsState.seconds))}
          </div>
          <div className={`timer-controls ${props.name ? '' : 'hide'}`}>
            <i id={`play-${props.id}`} onClick={() => handleTimerPlayPause(props.id)} className={`fas ${secondsState.isStarted ? 'fa-pause-circle play-button' : 'fa-play-circle play-button'}`}></i>
            <i id={`reset-${props.id}`} onClick={() => handleTimerReset(props.id)} className={`fas fa-redo reset-button ${secondsState.isStarted && secondsState.seconds > 0 ? '' : 'hide'}`}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
