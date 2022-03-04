import { TimerType } from "./TimerContainer";

export interface ActionRowProps {
  handleAddTimer: (timerType: TimerType) => void;
}

export default function ActionRow({ handleAddTimer }: ActionRowProps) {
  const handleDropdownToggle = () => {
    document
      .getElementById("new-timer-dropdown")
      ?.classList.toggle("is-active");
  };

  return (
    <div className="action-row">
      <div id="new-timer-dropdown" className="dropdown">
        <div className="dropdown-trigger">
          <button
            onClick={handleDropdownToggle}
            className="button is-small is-success"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <span>New Timer</span>
            <span className="icon is-small">
              <i className="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div className="dropdown-menu" role="menu">
          <div onClick={handleDropdownToggle} className="dropdown-content">
            <a
              onClick={() => handleAddTimer(TimerType.Countup)}
              className="dropdown-item"
            >
              Counting Up
            </a>
            <a
              onClick={() => handleAddTimer(TimerType.Countdown)}
              className="dropdown-item"
            >
              Counting Down
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
