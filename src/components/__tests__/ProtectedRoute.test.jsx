import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute.jsx";
import { AuthProvider } from "../../contexts/AuthContext.jsx";

function Private() {
  return <div>private</div>;
}
function Login() {
  return <div>login</div>;
}

test("redirects to /login when not authenticated", () => {
  sessionStorage.clear();
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/favorites"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Private />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );

  expect(screen.getByText("login")).toBeInTheDocument();
});
