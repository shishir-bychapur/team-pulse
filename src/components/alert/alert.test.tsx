import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Alert from "./alert";

const mockData = {
  title: "Test Alert",
  message: "This is a test alert",
};

describe("Alert", () => {
  it("renders with the correct title and message", () => {
    render(<Alert title={mockData.title} message={mockData.message} />);

    const title = screen.getByText(mockData.title);
    const message = screen.getByText(mockData.message);

    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  });
});
