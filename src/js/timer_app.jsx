const App = () => {
  [timersState, setTimers] = React.useState([]);

  const handleAddTimer = () => {
    const id = timersState.length + 1;
    setTimers(timersState.concat([{
      id: id,
      name: "",
      status: "",
      isStarted: false
    }]));
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

  const handleStartTimer = (id) => {
    const timers = timersState.slice();
    timers.forEach(element => {
      if (element.id === id) {
        element['isStarted'] = !element['isStarted'];
      }
    });
    
    setTimers(timers);
  }

  return (
    <div>
      <ActionRow handleAddTimer={handleAddTimer} />
      <TimerContainer timers={timersState} handleSubmitName={handleSubmitName} handleStartTimer={handleStartTimer}/> 
    </div>
  );
};

const ActionRow = (props) => {
  return (
    <div className="action-row buttons are-small">
      <button
        className="button is-success"
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
          handleStartTimer={props.handleStartTimer} 
          /> })}
    </div>
  );
};

const TimerCard = (props) => {
  const [secondsState, setSeconds] = React.useState(0);
  let interval;
  const tick = () => setSeconds(secondsState + 1);
  
  React.useEffect(() => {
    document.getElementById(`play-${props.id}`).onclick = () => props.handleStartTimer(props.id);

    if (props.isStarted) {
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
      });
    }
  });

  const getTimeFromSeconds = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    const seconds = totalSeconds % 3600 % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return (
    <div className="timer-card">
      <div className="border">
        {props.name === '' ? 
          <input id={props.id} placeholder="What are you timing?" className="name-input" type='text' /> :
          <div className="timer-name">{props.name}</div>
        }
        <div className='timer'>
          {getTimeFromSeconds(secondsState)}
        </div>
        <div className='timer-controls'>
          <i id={`play-${props.id}`} className={`fas ${props.isStarted ? 'fa-pause-circle play-button' : 'fa-play-circle play-button'}`}></i>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
