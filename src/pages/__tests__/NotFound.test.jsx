import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import NotFound from "../NotFound.jsx";

test("renders 404 page", () => {
  render(
    <MemoryRouter initialEntries={["/does-not-exist"]}>
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/404/i)).toBeInTheDocument();
});
