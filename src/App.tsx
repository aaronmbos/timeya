import React from "react";
import logo from "./logo.svg";
import "./App.css";
import AppHeader from "./components/AppHeader";
import TimerContainer from "./components/TimerContainer";

function App() {
  return (
    <div className="App">
      <AppHeader />
      <TimerContainer />
    </div>
  );
}

export default App;
