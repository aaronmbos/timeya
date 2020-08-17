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
      status: "",
      isEdit: true
    }].concat(timersState));
    
    setSequence(sequenceState + 1);
  };

  const handleEditTimer = (id) => {
    const timers = timersState.slice();
    const idx = timers.findIndex((t) => t.id === id);
    timers[idx].isEdit = true;
    
    setTimers(timers);
  }

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
  }

  return (
    <div>
      <ActionRow handleAddTimer={handleAddTimer} />
      <TimerContainer 
        timers={timersState} 
        handleSubmitName={handleSubmitName} 
        handleDeleteTimer={handleDeleteTimer}
        handleEditTimer={handleEditTimer}
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
          handleEditTimer={props.handleEditTimer}
          /> })}
    </div>
  );
};

const TimerCard = (props) => {
  const [timerState, setTimer] = useLocalStorage(props.id.toString(), {"lastTicked": 0, "seconds": 0, "isStarted": false, "wasPaused": false});    

  let interval;
  const tick = () => setTimer(() => {
    return {
      "lastTicked": Math.floor(Date.now() / 1000), 
      "seconds": timerState.lastTicked === 0 ? parseInt(timerState.seconds) + 1 : 
          timerState.wasPaused ? parseInt(timerState.seconds) : 
              parseInt(timerState.seconds) + (Math.floor(Date.now() / 1000) - timerState.lastTicked), 
      "wasPaused": timerState.wasPaused, 
      "isStarted": timerState.isStarted
    };
  });
  
  React.useEffect(() => {
    if (timerState.isStarted) {
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
    }
  });

  const handleTimerReset = () => {
    setTimer({"lastTicked": 0, "seconds": 0, "isStarted": false, "wasPaused": false});
    clearInterval(interval);
  }

  const handleTimerPlayPause = () => {        
    const wasPaused = timerState.wasPaused && !timerState.isStarted;
    const updatedTimer = {"lastTicked": Math.floor(Date.now() / 1000) , "seconds": parseInt(timerState.seconds), "wasPaused": wasPaused, "isStarted": !timerState.isStarted}
    setTimer(updatedTimer);
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

  const handleDeleteTimer = () => {
    window.localStorage.removeItem(props.id);  
    props.handleDeleteTimer(props.id);
  }

  const handleNameClick = () => {
    props.handleEditTimer(props.id);
  }

  const handleNameKeyPress = (e) => {
    if (e.key === 'Enter') {
      props.handleSubmitName(e.target.value, props.id);
    } 
  }

  return (
    <div className="timer-card">
      <div onMouseOver={handleCardOver} onMouseOut={handleCardOut} className="border-overlay">
        <div className="border">
          <i id={`deleteBack-${props.id}`} className="fas fa-circle delete-background hide"></i>
          <i onClick={handleDeleteTimer} id={`delete-${props.id}`} className="fas fa-times-circle delete-button hide"></i>
          {props.isEdit ? 
            <input onKeyPress={handleNameKeyPress} id={props.id} defaultValue={props.name} placeholder="What are you timing?" className="name-input" type='text' /> :
            <div title="Click to edit" className="timer-name"><span onClick={handleNameClick} className="name-content">{props.name}</span></div>
          }
          <div className='timer'>
            {getTimeFromSeconds(parseInt(timerState.seconds))}
          </div>
          <div className={`timer-controls ${props.name ? '' : 'hide'}`}>
            <i id={`play-${props.id}`} onClick={handleTimerPlayPause} className={`fas ${timerState.isStarted ? 'fa-pause-circle play-button' : 'fa-play-circle play-button'}`}></i>
            <i id={`reset-${props.id}`} onClick={handleTimerReset} className={`fas fa-redo reset-button ${timerState.seconds > 0  ? '' : 'hide'}`}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
