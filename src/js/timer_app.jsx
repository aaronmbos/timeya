const App = () => {
  [timersState, setTimers] = React.useState([]);

  const handleAddTimer = () => {
    const id = timersState.length + 1;
    setTimers(timersState.concat([{
      id: id,
      name: "",
      status: ""
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
      {props.timers.map((prop) => <TimerCard key={prop.id} id={prop.id} name={prop.name} handleSubmitName={props.handleSubmitName} /> )}
    </div>
  );
};

const TimerCard = (props) => {
  React.useEffect(() => {
    const nameInput = document.getElementById(props.id);
    if (nameInput !== null) {
      nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') props.handleSubmitName(nameInput.value, props.id);
      });
    }
  });

  return (
    <div className="timer-card">
      <div className="border">
        {/* <i title="Delete Timer" className='fas fa-times close-icon'></i> */}
        {props.name === '' ? 
          <input id={props.id} placeholder="What's this timer's name?" className="name-input" type='text' /> :
          <div className="timer-name">{props.name}</div>
        }
        <div className='timer'>
          0:00:00
        </div>
        <div className='timer-controls'>

        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
