const App = () => {
    const [showModal, setShowModal] = React.useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    }  

    return (
        <div>
            <AddModal showModal={showModal} />
            <AddTimer handleShowModal={handleShowModal} />
            <TimerContainer timers={timers} />
        </div>
    );
}

const AddTimer = (props) => {
    return <button onClick={() => props.handleShowModal()}>Add Timer</button>
}

const AddModal = (props) => {
    const isModalActive = props.showModal ? ' is-active' : '';
    return (
        <div className={`modal${isModalActive}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Modal title</p>
                    <button className="delete" aria-label="close"></button>
                </header>
                <section className="modal-card-body">
                    {/*content*/}
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success">Save changes</button>
                    <button className="button">Cancel</button>
                </footer>
            </div>
        </div>
    )
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