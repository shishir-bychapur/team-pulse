import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Button from "./button";

const mockData = {
  buttonName: "Test Button",
  onClick: jest.fn(),
};

describe("Button", () => {
  it("renders with the correct text", () => {
    render(
      <Button id="test-button" onClick={mockData.onClick}>
        {mockData.buttonName}
      </Button>,
    );
    const button = screen.getByText(mockData.buttonName);
    expect(button).toBeInTheDocument();
  });

  it("calls onClick when the button is clicked", () => {
    render(
      <Button id="test-button" onClick={mockData.onClick}>
        {mockData.buttonName}
      </Button>,
    );
    screen.getByTestId("test-button").click();
    expect(mockData.onClick).toHaveBeenCalledTimes(1);
  });
});
