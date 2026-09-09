import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Export from "./export";
import { dateFormat } from "@/src/utils/date";
import { Mood } from "@/generated/prisma/enums";
import { UpdateWithMember } from "@/src/types/update";

jest.mock("@/src/utils/date", () => ({
  dateFormat: jest.fn(),
}));

const mockedDateFormat = dateFormat as jest.MockedFunction<typeof dateFormat>;

describe("Export", () => {
  const mockUpdates: UpdateWithMember[] = [
    {
      id: "update-1",
      memberId: "member-1",
      mood: Mood.GREEN,
      date: "2026-09-09",
      text: "Finished the dashboard",
      member: {
        id: "member-1",
        name: "Tom",
        timezone: "Asia/Singapore",
        roleId: "role-1",
        email: "tom@email.com",
      },
    },
    {
      id: "update-2",
      memberId: "member-2",
      mood: Mood.RED,
      date: "2026-09-09",
      text: 'Fixed the "login" bug',
      member: {
        id: "member-2",
        name: "Harry",
        timezone: "Europe/London",
        roleId: "role-2",
        email: "harry@email.com",
      },
    },
  ];

  const createObjectURLMock = jest.fn();
  const revokeObjectURLMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedDateFormat.mockReturnValue("2026-09-09");

    Object.defineProperty(URL, "createObjectURL", {
      writable: true,
      value: createObjectURLMock,
    });

    Object.defineProperty(URL, "revokeObjectURL", {
      writable: true,
      value: revokeObjectURLMock,
    });

    createObjectURLMock.mockReturnValue("blob:test-url");
  });

  it("renders the title and description", () => {
    render(<Export updates={mockUpdates} />);

    expect(screen.getByText("Export updates")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Download all updates for a specific date as a CSV file.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the date input with the default date", () => {
    render(<Export updates={mockUpdates} />);

    const dateInput = screen.getByLabelText("Select date");

    expect(dateInput).toHaveValue("2026-09-09");
  });

  it("allows the user to change the selected date", () => {
    render(<Export updates={mockUpdates} />);

    const dateInput = screen.getByLabelText("Select date");

    fireEvent.change(dateInput, {
      target: {
        value: "2026-09-10",
      },
    });

    expect(dateInput).toHaveValue("2026-09-10");
  });

  it("renders the export button", () => {
    render(<Export updates={mockUpdates} />);

    expect(
      screen.getByRole("button", { name: "Export CSV" }),
    ).toBeInTheDocument();
  });

  it("creates and downloads a CSV file when Export CSV is clicked", () => {
    const clickMock = jest.fn();

    jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(clickMock);

    render(<Export updates={mockUpdates} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Export CSV",
      }),
    );

    expect(createObjectURLMock).toHaveBeenCalledTimes(1);

    expect(clickMock).toHaveBeenCalledTimes(1);

    expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:test-url");
  });

  it("uses the selected date in the CSV filename", () => {
    let downloadedFilename = "";

    const originalClick = HTMLAnchorElement.prototype.click;

    jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function (this: HTMLAnchorElement) {
        downloadedFilename = this.download;
      });

    render(<Export updates={mockUpdates} />);

    fireEvent.change(screen.getByLabelText("Select date"), {
      target: {
        value: "2026-09-15",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Export CSV" }));

    expect(downloadedFilename).toBe("updates-2026-09-15.csv");

    HTMLAnchorElement.prototype.click = originalClick;
  });

  it("renders the export information text", () => {
    render(<Export updates={mockUpdates} />);

    expect(
      screen.getByText(
        "Only updates matching the selected date will be exported.",
      ),
    ).toBeInTheDocument();
  });
});
