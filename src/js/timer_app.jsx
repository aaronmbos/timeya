const App = () => {
    const [timers, setCount] = React.useState([])

    const handleAdd = (val) => {
        const count = timers.length === 0 ? 0 : timers[timers.length - 1].id;
        setCount([timers].concat([{"val": val, "id": count + 1}]));
    }  

    return (
        <div>
            <AddTimer handleAdd={handleAdd} />
            <TimerContainer timers={timers} />
        </div>
    );
}

const AddTimer = (props) => {
    return <button onClick={() => props.handleAdd("blah")}>Add Timer</button>
}

const TimerContainer = (props) => {
    return (
        <div>
            {props.timers.map((prop) => <TimerCard key={prop.id} name={prop.val} />)}
        </div>
    );
}

const TimerCard = (props) => {
    return (
        <div className="timer-card">
            This is a card from {props.name}.
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));