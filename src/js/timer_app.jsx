const App = () => {
  [timers, setTimers] = React.useState([]);

  const handleAddTimer = () => {
    const id = timers.length + 1;
    setTimers(timers.concat([{
      id: id,
      name: "",
      status: ""
    }]));
  };

  return (
    <div>
      <ActionRow handleAddTimer={handleAddTimer} />
      <TimerContainer timers={timers} /> 
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
      {props.timers.map((prop) => <TimerCard key={prop.id} name={prop.name} />)}
    </div>
  );
};

const TimerCard = (props) => {
  return (
    <div className="timer-card">
      <div className="border">
        <i title="Delete Timer" className='fas fa-times close-icon'></i>
        {props.name === '' ? 
          <input placeholder="What's this timer's name?" className="name-input" type='text' /> :
          props.name
        }
        <div className='timer-container'>
          0:00:00
        </div>
        <div className='timer-controls'>

        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
