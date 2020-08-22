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
    <div className="action-row">
      <div id='new-timer-dropdown' className='dropdown'>
        <div className='dropdown-trigger'>
          <button
            onClick={() => document.getElementById('new-timer-dropdown').classList.toggle('is-active')}
            className="button is-small is-success" aria-haspopup="true" aria-controls="dropdown-menu"
          >
            <span>New Timer</span>
            <span class="icon is-small">
              <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div className='dropdown-menu' role='menu'>
          <div onClick={() => document.getElementById(`new-timer-dropdown`).classList.toggle('is-active')} className='dropdown-content'>
            <a onClick={props.handleAddTimer} class="dropdown-item">
              Count Up
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
  const [timerState, setTimer] = useLocalStorage(props.id.toString(), {"lastTicked": 0, "seconds": 0, "isStarted": false, "wasPaused": false, "isEditable": false, "editSeconds": 0});    

  let interval;
  const tick = () => setTimer(() => {
    return {
      ...timerState,
      "lastTicked": Math.floor(Date.now() / 1000), 
      "seconds": timerState.lastTicked === 0 ? parseInt(timerState.seconds) + 1 : 
          timerState.wasPaused ? parseInt(timerState.seconds) : 
              parseInt(timerState.seconds) + (Math.floor(Date.now() / 1000) - timerState.lastTicked), 
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
    setTimer({"lastTicked": 0, "seconds": 0, "isStarted": false, "wasPaused": false, "isEditable": false, "editSeconds": 0});
    clearInterval(interval);
  }

  const handleTimerPlayPause = () => {        
    const wasPaused = timerState.wasPaused && !timerState.isStarted;
    const newTimer = {...timerState, "lastTicked": Math.floor(Date.now() / 1000), "wasPaused": wasPaused, "isStarted": !timerState.isStarted}
    setTimer(newTimer);
  }

  const getTimeFromSeconds = () => {
    const hours = getHours(timerState.seconds);
    const minutes = getMinutes(timerState.seconds);
    const seconds = getSeconds(timerState.seconds);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  const getSeconds = (totalSeconds) => totalSeconds % 3600 % 60;
  const getMinutes = (totalSeconds) => Math.floor(totalSeconds % 3600 / 60);
  const getHours = (totalSeconds) => Math.floor(totalSeconds / 3600);

  const handleTimerClick = () => {
    setTimer({...timerState, "isEditable": true, "editSeconds": timerState.seconds})
  }

  const handleEditCancel = () => {
    setTimer({...timerState, "isEditable": false, "editSeconds": 0})
  }

  const handleEditSave = () => {
    const hours = parseInt(document.getElementById(`hours${props.id}`).value);
    const min = parseInt(document.getElementById(`min${props.id}`).value);
    const sec = parseInt(document.getElementById(`sec${props.id}`).value);

    if ((hours < 0) ||
    (min < 0 || min > 59) ||
    (sec < 0 || sec > 59)) { return; }

    const totalSeconds = sec + (min * 60) + (hours * 3600);
    setTimer({...timerState, "seconds": totalSeconds, "editSeconds": 0, "isEditable": false});
  }

  return (
    <div className="timer-card">
      <div className="card">
        <TimerCardHeader 
          name={props.name} 
          isEdit={props.isEdit} 
          id={props.id} 
          handleEditTimer={props.handleEditTimer} handleSubmitName={props.handleSubmitName} handleDeleteTimer={props.handleDeleteTimer} />
        <div className='card-content'>
          {timerState.isEditable ? 
            <div className='timer-edit-container content'>
              <input id={`hours${props.id}`} min='0' className='timer-edit'type='number' defaultValue={getHours(timerState.editSeconds)} /> : 
              <input id={`min${props.id}`} min='0' max='59' className='timer-edit' type='number' defaultValue={getMinutes(timerState.editSeconds)} /> : 
              <input id={`sec${props.id}`} min='0' max='59' className='timer-edit' type='number' defaultValue={getSeconds(timerState.editSeconds)}/>
            </div> :
            <span onClick={handleTimerClick} className='timer-click content is-centered'>
              {getTimeFromSeconds()}
            </span>
          }
        </div> 
        {
          timerState.isEditable ?
          <div className='edit-controls card-footer'>
            <div className='card-footer-item'>
            <button onClick={handleEditSave} className="button is-success is-small">Save</button>
            </div>
            <div className='card-footer-item'>
            <button onClick={handleEditCancel} className="button is-danger is-small">Cancel</button>
            </div>
          </div> :
          <div className={`card-footer ${props.name ? '' : 'hide'}`}>
            <div className='card-footer-item'>
            <i id={`play-${props.id}`} onClick={handleTimerPlayPause} className={`fas ${timerState.isStarted ? 'fa-pause-circle play-button' : 'fa-play-circle play-button'}`}></i>
            <i id={`reset-${props.id}`} onClick={handleTimerReset} className={`fas fa-redo reset-button ${timerState.seconds > 0  ? '' : 'hide'}`}></i>
            </div>
        </div>
        }
      </div>
    </div>
  );
};

const TimerCardHeader = (props) => {
  const handleEditInputBlur = (e) => {
    if (e.target.value.length > 0) {
      props.handleSubmitName(e.target.value, props.id);
    }
  }

  const handleNameClick = () => {
    props.handleEditTimer(props.id);
  }

  const handleNameKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (e.target.value.length > 0) {
        props.handleSubmitName(e.target.value, props.id);
      }
    } 
  }

  const handleDeleteTimer = () => {
    window.localStorage.removeItem(props.id);  
    props.handleDeleteTimer(props.id);
  }

  return (
    <header className='card-header'>
      {
        props.isEdit ? 
        <div className='edit-input-control'>
          <input onBlur={handleEditInputBlur} onKeyPress={handleNameKeyPress} id={props.id} defaultValue={props.name} placeholder="What are you timing?" className="input edit-input card-header-title" type='text' /> 
        </div> :
        <div className="card-header-title"><span title={`Click to edit - ${props.name}`} onClick={handleNameClick} className="name-content">{props.name}</span></div>
      }
      <span class="icon">
        <i aria-hidden='true' onClick={handleDeleteTimer} id={`delete-${props.id}`} className="fas fa-times delete-button"></i>
      </span>
    </header>
  )
}

ReactDOM.render(<App />, document.getElementById("app"));
