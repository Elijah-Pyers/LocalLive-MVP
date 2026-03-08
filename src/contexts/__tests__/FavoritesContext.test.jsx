import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoritesProvider, useFavorites } from "../FavoritesContext.jsx";
import { AuthProvider, useAuth } from "../AuthContext.jsx";

function Demo() {
  const { getUserFavorites, addFavorite, removeFavorite } = useFavorites();
  const { register, login, csrfToken } = useAuth();

  const count = getUserFavorites().length;

  return (
    <div>
      <div data-testid="count">{count}</div>
      <button
        onClick={() =>
          register({ username: "alice", password: "secret12", role: "regular", csrf: csrfToken })
        }
      >
        register
      </button>
      <button onClick={() => login({ username: "alice", password: "secret12", csrf: csrfToken })}>
        login
      </button>
      <button onClick={() => addFavorite({ id: "1", name: "A" })}>add</button>
      <button onClick={() => removeFavorite("1")}>remove</button>
    </div>
  );
}

test("favorites are user-scoped and can add/remove", async () => {
  const user = userEvent.setup();

  // clear storage
  localStorage.clear();
  sessionStorage.clear();

  render(
    <AuthProvider>
      <FavoritesProvider>
        <Demo />
      </FavoritesProvider>
    </AuthProvider>
  );

  expect(screen.getByTestId("count")).toHaveTextContent("0");

  await user.click(screen.getByText("register"));
  await user.click(screen.getByText("login"));

  await user.click(screen.getByText("add"));
  expect(screen.getByTestId("count")).toHaveTextContent("1");

  await user.click(screen.getByText("remove"));
  expect(screen.getByTestId("count")).toHaveTextContent("0");
});
