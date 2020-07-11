function App(props) {
    const names = ['Aaron', 'Lauren', 'Blayke', 'Brooks', 'Andi'];
    const cards = names.map((name) => <TimerCard name={name} />);
    return cards;
}

ReactDOM.render(<App />, document.getElementById('app'));