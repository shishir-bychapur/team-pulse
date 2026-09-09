import { actionService } from "./action";
import { actionRepository } from "../repositories/action";
import { memberRepository } from "../repositories/member";
import { ActionStatus } from "@/generated/prisma/enums";
import { ActionItemWithOwner } from "../types/action";

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

  const mockAction: ActionItemWithOwner = {
    id: "action-1",
    title: "Fix login bug",
    ownerId: "member-1",
    status: ActionStatus.OPEN,
    dueDate: "2026-09-10",
    owner: {
      name: "Jake",
      roleId: "role-1",
      timezone: "utc",
      id: "member-1",
    },
  };

  describe("Get Actions", () => {
    it("should return all actions", () => {
      const mockActions: ActionItemWithOwner[] = [
        mockAction,
        {
          id: "action-2",
          title: "Update documentation",
          ownerId: "member-2",
          status: ActionStatus.CLOSED,
          dueDate: "2026-09-15",
          owner: {
            name: "Jose",
            roleId: "role-2",
            timezone: "utc",
            id: "member-2",
          },
        },
      ];

      mockedActionRepository.getActions.mockReturnValue(
        Promise.resolve(mockActions),
      );

      const result = actionService.getActions();

      expect(result).toEqual(mockActions);

      expect(mockedActionRepository.getActions).toHaveBeenCalledTimes(1);
    });
  });

  describe("Get Action", () => {
    it("should return an action when it exists", () => {
      mockedActionRepository.getAction.mockReturnValue(
        Promise.resolve(mockAction),
      );

      const result = actionService.getAction("action-1");

      expect(result).toEqual(mockAction);

      expect(mockedActionRepository.getAction).toHaveBeenCalledWith("action-1");
    });

    it("should return undefined when the action does not exist", () => {
      mockedActionRepository.getAction.mockReturnValue(Promise.resolve(null));

      const result = actionService.getAction("invalid-id");

      expect(result).toBeUndefined();

      expect(mockedActionRepository.getAction).toHaveBeenCalledWith(
        "invalid-id",
      );
    });
  });

  describe("Get Actions By Status", () => {
    it("should return open actions", () => {
      mockedActionRepository.countActionsByStatus.mockReturnValue(
        Promise.resolve(2),
      );

      const result = actionService.getActionsByStatus(ActionStatus.OPEN);

      expect(result).toBe(2);
      expect(mockedActionRepository.countActionsByStatus).toHaveBeenCalledTimes(
        1,
      );
    });

    it("should return closed actions", () => {
      mockedActionRepository.countActionsByStatus.mockReturnValue(
        Promise.resolve(1),
      );

      const result = actionService.getActionsByStatus(ActionStatus.CLOSED);

      expect(result).toBe(1);
      expect(mockedActionRepository.countActionsByStatus).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe("Create Action", () => {
    it("should create an action successfully when the owner exists", () => {
      mockedMemberRepository.getMember.mockReturnValue(
        Promise.resolve({
          id: "member-1",
          name: "John",
          timezone: "Asia/Singapore",
          role: {
            id: "role-1",
            name: "Developer",
          },
          roleId: "role-1",
        }),
      );

      const mockUUID = "generated-action-id";

      jest.spyOn(crypto, "randomUUID").mockReturnValue(mockUUID);

      const result = actionService.createAction(mockAction);

      expect(mockedMemberRepository.getMember).toHaveBeenCalledWith("member-1");

      expect(mockedActionRepository.createAction).toHaveBeenCalledWith({
        ...mockAction,
        id: mockUUID,
      });

      expect(result).toBe(mockUUID);
    });

    it("should throw an error when the owner does not exist", () => {
      mockedMemberRepository.getMember.mockReturnValue(Promise.resolve(null));

      expect(() => {
        actionService.createAction(mockAction);
      }).toThrow("There is no member with the given ownerId!");

      expect(mockedActionRepository.createAction).not.toHaveBeenCalled();
    });
  });

  describe("Edit Action", () => {
    it("should edit an action successfully when the owner exists", () => {
      const updatedAction: ActionItemWithOwner = {
        id: "action-1",
        title: "Fix login bug - updated",
        ownerId: "member-1",
        status: ActionStatus.CLOSED,
        dueDate: "2026-09-30",
        owner: {
          name: "Jake",
          id: "member-1",
          roleId: "role-1",
          timezone: "utc",
        },
      };

      actionService.editAction("action-1", updatedAction);

      expect(mockedActionRepository.editAction).toHaveBeenCalledWith(
        "action-1",
        updatedAction,
      );
    });

    it("should throw an error when the new owner does not exist", () => {
      const updatedAction: ActionItemWithOwner = {
        ...mockAction,
        ownerId: "invalid-member",
      };

      mockedActionRepository.editAction.mockRejectedValue(
        "There is no member with the given ownerId!",
      );

      expect(() => {
        actionService.editAction("action-1", updatedAction);
      }).toThrow("There is no member with the given ownerId!");

      expect(mockedActionRepository.editAction).not.toHaveBeenCalled();
    });
  });
});
