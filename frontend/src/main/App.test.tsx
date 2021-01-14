import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("Check basic main links", () => {
  const { getAllByText } = render(<App />);
  const timelineLink = getAllByText(/Timeline/i);

  expect(timelineLink[0]).toBeInTheDocument();
  const settingsLink = getAllByText(/Settings/i);
  expect(settingsLink[0]).toBeInTheDocument();
  const albumsLink = getAllByText(/Albums/i);
  expect(albumsLink[0]).toBeInTheDocument();
});
