import React, { useState } from "react";

export interface TimerCardHeaderProps {
  id: number;
  isEdit: boolean;
  name: string;
  handleSubmitName: (name: string, id: number) => void;
  handleEditTimer: (id: number) => void;
  handleDeleteTimer: (id: number) => void;
}

export default function TimerCardHeader(props: TimerCardHeaderProps) {
  const [inputName, setInputName] = useState("");

  const handleEditInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value) {
      props.handleSubmitName(e.target.value, props.id);
    }
  };

  const handleNameClick = () => {
    props.handleEditTimer(props.id);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(e.target.value);
  };

  const handleNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputName) {
        props.handleSubmitName(inputName, props.id);
      }
    }
  };

  const handleDeleteTimer = () => {
    window.localStorage.removeItem(props.id.toString());
    props.handleDeleteTimer(props.id);
  };

  return (
    <header className="card-header">
      {props.isEdit ? (
        <div className="edit-input-control">
          <input
            onChange={handleNameChange}
            onBlur={handleEditInputBlur}
            onKeyPress={handleNameKeyPress}
            id={props.id.toString()}
            defaultValue={props.name}
            placeholder="What are you timing?"
            className="input edit-input card-header-title"
            type="text"
          />
        </div>
      ) : (
        <div className="card-header-title">
          <span
            title={`Click to edit - ${props.name}`}
            onClick={handleNameClick}
            className="name-content"
          >
            {props.name}
          </span>
        </div>
      )}
      <span className="icon">
        <i
          aria-hidden="true"
          onClick={handleDeleteTimer}
          id={`delete-${props.id}`}
          className="fas fa-times delete-button"
        ></i>
      </span>
    </header>
  );
}
