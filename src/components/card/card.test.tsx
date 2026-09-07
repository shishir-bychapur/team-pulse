import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Card from "./card";

describe("Card", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with the correct title and description", () => {
    render(
      <Card
        title="Test Card"
        description="This is a test card"
        onClick={mockOnClick}
      />,
    );

    expect(screen.getByText("Test Card")).toBeInTheDocument();

    expect(screen.getAllByText("This is a test card")).toHaveLength(2);
  });

  it("renders the member initial", () => {
    render(
      <Card
        title="Test Card"
        description="This is a test card"
        onClick={mockOnClick}
      />,
    );

    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("calls onClick when the card is clicked", () => {
    render(
      <Card
        title="Test Card"
        description="This is a test card"
        onClick={mockOnClick}
      />,
    );

    const card = screen.getByRole("button");

    fireEvent.click(card);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
