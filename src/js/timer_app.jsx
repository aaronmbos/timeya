function App(props) {
    return <TimerCard name={props.name} />
}

ReactDOM.render(<App name="Aaron" />, document.getElementById('app'));