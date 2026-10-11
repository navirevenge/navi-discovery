import { render, screen, fireEvent } from "@testing-library/react";
import { App } from "./App";

beforeEach(() => localStorage.clear());

it("shows sample-data banner", () => {
  render(<App />);
  expect(screen.getByRole("status")).toHaveTextContent(/SAMPLE DATA/);
});

it("saves to watchlist and persists thesis", () => {
  render(<App />);
  fireEvent.click(screen.getAllByRole("button", { name: /Save/ })[0]);
  expect(screen.getByRole("button", { name: /Watchlist \(1\)/ })).toBeInTheDocument();
  fireEvent.click(screen.getAllByRole("button", { name: "Research" })[0]);
  const box = screen.getByLabelText("Thesis");
  fireEvent.change(box, { target: { value: "my thesis" } });
  fireEvent.blur(box);
  expect(localStorage.getItem("navi.v1")).toContain("my thesis");
});
