import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Input from "./input";
import { useState } from "react";

const MockComponent = () => {
  const [value, setValue] = useState("");
  return (
    <Input
      id="test"
      label="Test Input"
      value={value}
      type="text"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setValue(e.target.value)
      }
    />
  );
};

describe("Input", () => {
  it("renders correctly with label and value", () => {
    render(<MockComponent />);

    const label = screen.getByText("Test Input");
    const input = screen.getByLabelText("Test Input") as HTMLInputElement;
    input.value = "Test Value";

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("Test Value");
  });
});
