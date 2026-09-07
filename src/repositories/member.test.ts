import { memberRepository } from "./member";

jest.mock("@/src/data/member", () => ({
  members: [
    {
      id: "1",
      name: "Tom",
      timezone: "America/New_York",
      role: { id: "r1", name: "Developer" },
    },
    {
      id: "2",
      name: "Harry",
      timezone: "Europe/London",
      role: { id: "r2", name: "Designer" },
    },
  ],
}));

describe("Member Repository", () => {
  describe("Get All Members", () => {
    it("should return the members correctly", () => {
      const data = memberRepository.getMembers();
      expect(data.length).toBe(2);
    });
  });

  describe("Get Member", () => {
    it("should return successfully if member exists", () => {
      const data = memberRepository.getMember("1");
      expect(data).toBeDefined();
      expect(data?.id).toBe("1");
      expect(data?.name).toBe("Tom");
    });

    it("should return undefined if member doesn't exist", () => {
      const data = memberRepository.getMember("3");
      expect(data).toBeUndefined();
    });
  });
});
