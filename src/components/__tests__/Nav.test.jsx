import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Nav from "../Nav.jsx";
import { AuthProvider, useAuth } from "../../contexts/AuthContext.jsx";
import { FavoritesProvider } from "../../contexts/FavoritesContext.jsx";

function LoginHelper() {
  const { register, login, csrfToken } = useAuth();
  return (
    <div>
      <button onClick={() => register({ username: "a", password: "secret12", role: "regular", csrf: csrfToken })}>r</button>
      <button onClick={() => login({ username: "a", password: "secret12", csrf: csrfToken })}>l</button>
    </div>
  );
}

test("nav shows login/register when logged out and favorites when logged in", async () => {
  const user = userEvent.setup();
  localStorage.clear();
  sessionStorage.clear();

  render(
    <AuthProvider>
      <FavoritesProvider>
        <MemoryRouter>
          <Nav />
          <LoginHelper />
        </MemoryRouter>
      </FavoritesProvider>
    </AuthProvider>
  );

  expect(screen.getByText("Login")).toBeInTheDocument();
  expect(screen.getByText("Register")).toBeInTheDocument();
  expect(screen.queryByText(/Favorites/)).toBeNull();

  await user.click(screen.getByText("r"));
  await user.click(screen.getByText("l"));

  expect(screen.getByText(/Favorites/)).toBeInTheDocument();
});
