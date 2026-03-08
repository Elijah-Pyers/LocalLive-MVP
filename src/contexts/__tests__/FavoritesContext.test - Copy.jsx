import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoritesProvider, useFavorites } from "../FavoritesContext.jsx";

function Demo() {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  return (
    <div>
      <div data-testid="count">{favorites.length}</div>
      <button onClick={() => addFavorite({ id: "1", name: "A" })}>add</button>
      <button onClick={() => removeFavorite("1")}>remove</button>
    </div>
  );
}

test("adds and removes favorites", async () => {
  const user = userEvent.setup();
  render(
    <FavoritesProvider>
      <Demo />
    </FavoritesProvider>
  );

  expect(screen.getByTestId("count")).toHaveTextContent("0");
  await user.click(screen.getByText("add"));
  expect(screen.getByTestId("count")).toHaveTextContent("1");
  await user.click(screen.getByText("remove"));
  expect(screen.getByTestId("count")).toHaveTextContent("0");
});
