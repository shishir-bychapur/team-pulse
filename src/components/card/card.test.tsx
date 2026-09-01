import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Card from "./card";

const mockData = {
  title: "Test Card",
  description: "This is a test card",
  onClick: jest.fn(),
};

describe("Card", () => {
  it("renders with the correct title and description", () => {
    render(
      <Card
        title="Test Card"
        description="This is a test card"
        onClick={mockData.onClick}
      />,
    );

    const title = screen.getByText(mockData.title);
    const description = screen.getByText(mockData.description);

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it("calls onClick when the card is clicked", () => {
    render(
      <Card
        title="Test Card"
        description="This is a test card"
        onClick={mockData.onClick}
      />,
    );

    screen.getByText(mockData.title).click();
    expect(mockData.onClick).toHaveBeenCalledTimes(1);
  });
});
