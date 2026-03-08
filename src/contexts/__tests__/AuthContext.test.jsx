import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../AuthContext.jsx";

function Demo() {
  const { register, login, logout, isAuthenticated, user, csrfToken } = useAuth();
  return (
    <div>
      <div data-testid="auth">{isAuthenticated ? "yes" : "no"}</div>
      <div data-testid="user">{user?.username || ""}</div>
      <button onClick={() => register({ username: "bob", password: "secret12", role: "admin", csrf: csrfToken })}>
        register
      </button>
      <button onClick={() => login({ username: "bob", password: "secret12", csrf: csrfToken })}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

test("register/login/logout flow", async () => {
  const user = userEvent.setup();
  localStorage.clear();
  sessionStorage.clear();

  render(
    <AuthProvider>
      <Demo />
    </AuthProvider>
  );

  expect(screen.getByTestId("auth")).toHaveTextContent("no");
  await user.click(screen.getByText("register"));
  await user.click(screen.getByText("login"));
  expect(screen.getByTestId("auth")).toHaveTextContent("yes");
  expect(screen.getByTestId("user")).toHaveTextContent("bob");
  await user.click(screen.getByText("logout"));
  expect(screen.getByTestId("auth")).toHaveTextContent("no");
});
