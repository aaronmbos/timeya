export interface TimerCardContentProps {
  id: number;
  seconds: number;
  editSeconds: number;
  isEditable: boolean;
  handleTimerClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export default function TimerCardContent(props: TimerCardContentProps) {
  const getTimeFromSeconds = () =>
    `${getHours(props.seconds).toString().padStart(2, "0")}:${getMinutes(
      props.seconds
    )
      .toString()
      .padStart(2, "0")}:${getSeconds(props.seconds)
      .toString()
      .padStart(2, "0")}`;

  const getSeconds = (totalSeconds: number) => (totalSeconds % 3600) % 60;
  const getMinutes = (totalSeconds: number) =>
    Math.floor((totalSeconds % 3600) / 60);
  const getHours = (totalSeconds: number) => Math.floor(totalSeconds / 3600);

  return (
    <div className="card-content">
      {props.isEditable ? (
        <div className="timer-edit-container content">
          <input
            id={`hours${props.id}`}
            min="0"
            className="timer-edit"
            type="number"
            defaultValue={getHours(props.editSeconds)}
          />{" "}
          :
          <input
            id={`min${props.id}`}
            min="0"
            max="59"
            className="timer-edit"
            type="number"
            defaultValue={getMinutes(props.editSeconds)}
          />{" "}
          :
          <input
            id={`sec${props.id}`}
            min="0"
            max="59"
            className="timer-edit"
            type="number"
            defaultValue={getSeconds(props.editSeconds)}
          />
        </div>
      ) : (
        <span
          onClick={props.handleTimerClick}
          className="timer-click content is-centered"
        >
          {getTimeFromSeconds()}
        </span>
      )}
    </div>
  );
}
