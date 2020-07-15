const App = () => {
    const [timers, setCount] = React.useState(0)

    const handleAdd = () => {
        setCount(timers + 1);
    }  

    return (
        <div>
            <AddTimer handleAdd={handleAdd} />
        </div>
    );
}

const AddTimer = (props) => {
    return <button onClick={props.handleAdd}>Add Timer</button>
}

const TimerContainer = (props) => {
    
}

const TimerCard = (props) => {
    return (
        <div className="timer-card">
            This is a card from {props.name}.
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));