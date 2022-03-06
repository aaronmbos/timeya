import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the application container div", () => {
  render(<App />);
  const app = screen.getByTestId('app-div');
  expect(app).toBeInTheDocument();
});
