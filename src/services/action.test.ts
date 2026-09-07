import { actionService } from "./action";
import { actionRepository } from "../repositories/action";
import { memberRepository } from "../repositories/member";
import { ActionItem, ActionStatus } from "../types/action";

jest.mock("../repositories/action", () => ({
  actionRepository: {
    getActions: jest.fn(),
    getAction: jest.fn(),
    createAction: jest.fn(),
    editAction: jest.fn(),
  },
}));

jest.mock("../repositories/member", () => ({
  memberRepository: {
    getMember: jest.fn(),
  },
}));

const mockedActionRepository = actionRepository as jest.Mocked<
  typeof actionRepository
>;

const mockedMemberRepository = memberRepository as jest.Mocked<
  typeof memberRepository
>;

describe("Action Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAction: ActionItem = {
    id: "action-1",
    title: "Fix login bug",
    ownerId: "member-1",
    status: ActionStatus.OPEN,
    dueDate: "2026-09-10",
  };

  describe("Get Actions", () => {
    it("should return all actions", () => {
      const mockActions: ActionItem[] = [
        mockAction,
        {
          id: "action-2",
          title: "Update documentation",
          ownerId: "member-2",
          status: ActionStatus.CLOSED,
          dueDate: "2026-09-15",
        },
      ];

      mockedActionRepository.getActions.mockReturnValue(mockActions);

      const result = actionService.getActions();

      expect(result).toEqual(mockActions);

      expect(mockedActionRepository.getActions).toHaveBeenCalledTimes(1);
    });
  });

  describe("Get Action", () => {
    it("should return an action when it exists", () => {
      mockedActionRepository.getAction.mockReturnValue(mockAction);

      const result = actionService.getAction("action-1");

      expect(result).toEqual(mockAction);

      expect(mockedActionRepository.getAction).toHaveBeenCalledWith(
        "action-1",
      );
    });

    it("should return undefined when the action does not exist", () => {
      mockedActionRepository.getAction.mockReturnValue(undefined);

      const result = actionService.getAction("invalid-id");

      expect(result).toBeUndefined();

      expect(mockedActionRepository.getAction).toHaveBeenCalledWith(
        "invalid-id",
      );
    });
  });

  describe("Create Action", () => {
    it("should create an action successfully when the owner exists", () => {
      mockedMemberRepository.getMember.mockReturnValue({
        id: "member-1",
        name: "John",
        timezone: "Asia/Singapore",
        role: {
          id: "role-1",
          name: "Developer",
        },
      });

      const mockUUID = "generated-action-id";

      jest
        .spyOn(crypto, "randomUUID")
        .mockReturnValue(mockUUID);

      const result = actionService.createAction(mockAction);

      expect(mockedMemberRepository.getMember).toHaveBeenCalledWith(
        "member-1",
      );

      expect(mockedActionRepository.createAction).toHaveBeenCalledWith({
        ...mockAction,
        id: mockUUID,
      });

      expect(result).toBe(mockUUID);
    });

    it("should throw an error when the owner does not exist", () => {
      mockedMemberRepository.getMember.mockReturnValue(undefined);

      expect(() => {
        actionService.createAction(mockAction);
      }).toThrow("There is no member with the given ownerId!");

      expect(mockedActionRepository.createAction).not.toHaveBeenCalled();
    });
  });

  describe("Edit Action", () => {
    it("should edit an action successfully when the owner exists", () => {
      const updatedAction: ActionItem = {
        id: "action-1",
        title: "Fix login bug - updated",
        ownerId: "member-1",
        status: ActionStatus.CLOSED,
        dueDate: "2026-09-30",
      };

      mockedMemberRepository.getMember.mockReturnValue({
        id: "member-1",
        name: "John",
        timezone: "Asia/Singapore",
        role: {
          id: "role-1",
          name: "Developer",
        },
      });

      mockedActionRepository.editAction.mockReturnValue(0);

      const result = actionService.editAction(
        "action-1",
        updatedAction,
      );

      expect(mockedMemberRepository.getMember).toHaveBeenCalledWith(
        "member-1",
      );

      expect(mockedActionRepository.editAction).toHaveBeenCalledWith(
        "action-1",
        updatedAction,
      );

      expect(result).toBe(0);
    });

    it("should throw an error when the new owner does not exist", () => {
      const updatedAction: ActionItem = {
        ...mockAction,
        ownerId: "invalid-member",
      };

      mockedMemberRepository.getMember.mockReturnValue(undefined);

      expect(() => {
        actionService.editAction("action-1", updatedAction);
      }).toThrow("There is no member with the given ownerId!");

      expect(mockedActionRepository.editAction).not.toHaveBeenCalled();
    });
  });
});
