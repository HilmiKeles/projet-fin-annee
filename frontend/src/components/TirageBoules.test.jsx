import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import TirageBoules from "./TirageBoules.jsx";
import { renderPage } from "../test/renderPage.jsx";

vi.mock("../utils/tirage.js", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    dureeAnimationTirage: () => 40,
  };
});

function renderTirage() {
  return renderPage(<TirageBoules />, {
    route: "/",
    path: "/",
    routes: [{ path: "/resultat", element: <p>Page résultat</p> }],
  });
}

describe("TirageBoules", () => {
  it("refuse de tirer au sort sans connexion", async () => {
    const user = userEvent.setup();
    renderTirage();

    await user.type(screen.getByLabelText(/code de votre ticket/i), "ABC123XYZ9");
    await user.click(screen.getByRole("button", { name: "Lancer le tirage" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      /connectez-vous pour enregistrer votre gain/i,
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("enregistre le gain via l’API puis redirige vers le résultat", async () => {
    const user = userEvent.setup();
    sessionStorage.setItem("token", "jwt-test");
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ gain: "infuseur" }),
    });

    renderTirage();
    await user.type(screen.getByLabelText(/code de votre ticket/i), "ABC123XYZ9");
    await user.click(screen.getByRole("button", { name: "Lancer le tirage" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      /mélange des boules/i,
    );
    await waitFor(() => {
      expect(screen.getByText("Page résultat")).toBeInTheDocument();
    });
    expect(fetch).toHaveBeenCalledWith(
      "/api/tickets/validate",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ code: "ABC123XYZ9" }),
      }),
    );
  });

  it("affiche l’erreur de l’API sans quitter le formulaire", async () => {
    const user = userEvent.setup();
    sessionStorage.setItem("token", "jwt-test");
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Ticket déjà utilisé" }),
    });

    renderTirage();
    await user.type(screen.getByLabelText(/code de votre ticket/i), "ABC123XYZ9");
    await user.click(screen.getByRole("button", { name: "Lancer le tirage" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Ticket déjà utilisé",
    );
    expect(screen.getByRole("button", { name: "Lancer le tirage" })).toBeInTheDocument();
  });
});
