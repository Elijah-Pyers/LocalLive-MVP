import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EventCard from "../EventCard.jsx";

test("renders event name and date", () => {
  const event = {
    id: "123",
    name: "Test Event",
    dates: { start: { localDate: "2026-03-01" } },
    _embedded: { venues: [{ name: "Test Venue" }] },
  };

  render(
    <BrowserRouter>
      <EventCard event={event} />
    </BrowserRouter>
  );

  expect(screen.getByText("Test Event")).toBeInTheDocument();
  expect(screen.getByText(/2026-03-01/)).toBeInTheDocument();
});
