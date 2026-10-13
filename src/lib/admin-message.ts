import { isAdminMessage } from "@/lib/translations";

const USER_JOIN = "USER_JOIN";
const USER_LEAVE = "USER_LEAVE";

export type JoinLeaveType = typeof USER_JOIN | typeof USER_LEAVE;

export type JoinLeaveUser = {
  user_id?: string;
  nickname?: string;
  metadata?: { email?: string };
};

export type JoinLeaveEvent = {
  type: JoinLeaveType;
  users: JoinLeaveUser[];
};

type MessageLike = {
  data?: unknown;
  messageType?: string;
  type?: string;
  full_json?: { data?: unknown };
} | null;

/**
 * Join and leave events are Sendbird admin messages, but their `data`
 * payload is `{ type: "USER_JOIN" | "USER_LEAVE", users: [...] }`.
 * Those are not messages sent by the admin.
 */
export function getJoinLeaveEvent(message?: MessageLike): JoinLeaveEvent | null {
  const parsed =
    parseMessageData(message?.data) ??
    parseMessageData(message?.full_json?.data);
  if (parsed?.type !== USER_JOIN && parsed?.type !== USER_LEAVE) return null;

  return {
    type: parsed.type,
    users: Array.isArray(parsed.users) ? parsed.users : [],
  };
}

/** Admin messages the admin actually sent. Join and leave are excluded. */
export function isSystemAdminMessage(message?: MessageLike) {
  return isAdminMessage(message) && !getJoinLeaveEvent(message);
}

export function joinLeaveUserName(user: JoinLeaveUser) {
  return user.nickname || user.metadata?.email || user.user_id || "";
}

export function joinLeaveLabel(
  event: JoinLeaveEvent,
  translateType: (type: JoinLeaveType) => string,
) {
  return event.users
    .map((user) => `${joinLeaveUserName(user)} ${translateType(event.type)}`.trim())
    .filter(Boolean)
    .join(", ");
}

function parseMessageData(data: unknown): {
  type?: string;
  users?: JoinLeaveUser[];
} | null {
  try {
    if (typeof data === "string") {
      const fixed = data.replace(/u'/g, '"').replace(/'/g, '"');
      return JSON.parse(fixed);
    }
    if (data && typeof data === "object") {
      return data as { type?: string; users?: JoinLeaveUser[] };
    }
    return null;
  } catch {
    return null;
  }
}
