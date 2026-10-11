import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, it, expect } from "vitest";
import App from "./App";

beforeEach(() => localStorage.clear());

it("shows sample-data banner", () => {
  render(<App />);
  expect(screen.getByRole("status")).toHaveTextContent(/SAMPLE DATA/);
});

it("watchlist persists", () => {
  render(<App />);
  fireEvent.click(screen.getAllByRole("button", { name: /Watch/ })[0]);
  expect(JSON.parse(localStorage.getItem("navi.watchlist.v1")!)).toHaveLength(1);
  fireEvent.click(screen.getByRole("button", { name: "watchlist" }));
  expect(screen.getAllByRole("article")).toHaveLength(1);
});

it("saves a thesis", () => {
  render(<App />);
  fireEvent.click(screen.getAllByRole("button", { name: /Open research/ })[0]);
  fireEvent.change(screen.getByLabelText("Thesis"), { target: { value: "x" } });
  fireEvent.click(screen.getByRole("button", { name: "Save thesis" }));
  expect(Object.values(JSON.parse(localStorage.getItem("navi.theses.v1")!))).toHaveLength(1);
});
