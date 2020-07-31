const App = () => {
  [timersState, setTimers] = React.useState([]);

  const handleAddTimer = () => {
    const id = timersState.length + 1;
    setTimers(timersState.concat([{
      id: id,
      name: "",
      status: "",
      seconds: 59
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

  return (
    <div>
      <ActionRow handleAddTimer={handleAddTimer} />
      <TimerContainer timers={timersState} handleSubmitName={handleSubmitName} /> 
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
      {props.timers.map((prop) => <TimerCard key={prop.id} {...prop} handleSubmitName={props.handleSubmitName} /> )}
    </div>
  );
};

const TimerCard = (props) => {
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
          {getTimeFromSeconds(props.seconds)}
        </div>
        <div className='timer-controls'>
          <i id={`play-${props.id}`} className="fas fa-play-circle play-button"></i>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
