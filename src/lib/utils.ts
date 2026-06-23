import type { GroupChannel } from "@sendbird/chat/groupChannel";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistance, subDays } from "date-fns";

import { ChannelStatus, type ChannelData, type ChannelType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getChannelStatus(channel: GroupChannel | null) {
  if (!channel) return ChannelStatus.PENDING;

  if (channel.isFrozen) {
    return ChannelStatus.COMPLETED;
  }

  if (channel.memberCount < 2) {
    return ChannelStatus.PENDING;
  }

  return ChannelStatus.ACTIVE;
}

export function extractChannelName(name = "") {
  return name.split("_ro_")[0];
}

export function getFormattedChannel(channel: ChannelType) {
  if (!channel) return {};

  let data: ChannelData = {};

  if (typeof channel?.data === "string") {
    try {
      data = JSON.parse(channel?.data || "{}");
    } catch {
      data = {};
    }
  }

  return {
    channel,
    name: extractChannelName(channel.name),
    data,
  };
}

export function getInitialFromFullName(fullname = "") {
  return fullname.split(" ").reduce((a, b) => `${a || ""}${b[0] || ""}`, "");
}

export function messageDistance(datetime: number) {
  return formatDistance(subDays(datetime, 0), new Date(), {
    addSuffix: false,
  });
}

export function truncateText(text: string, maxLength: number) {
  if (typeof text !== "string") return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getMessageNickname(
  channel: GroupChannel | undefined,
  currentUser: string,
) {
  if (!channel) return "";

  if (
    channel.lastMessage?.isUserMessage() &&
    channel.lastMessage?.sender?.userId === currentUser
  ) {
    return "You: ";
  }

  return channel.lastMessage?.isUserMessage()
    ? channel.lastMessage?.sender?.nickname + ": "
    : "No Message";
}

export function getMessageSender(channel: GroupChannel | undefined) {
  if (!channel) return "";

  return channel?.lastMessage?.isUserMessage()
    ? channel?.lastMessage?.sender
    : undefined;
}

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const MAX_SIZE_MB = 24;
export const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export const ALLOWED_EXTENSIONS = ["jpeg", "jpg", "gif", "png", "bmp", "webp"];
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/gif",
  "image/png",
  "image/bmp",
  "image/webp",
];

export function isAllowedImage(file: File | null) {
  if (!file) return false;

  const extension = file?.name?.split(".")?.pop()?.toLowerCase();
  return (
    ALLOWED_EXTENSIONS.includes(extension ?? "") &&
    ALLOWED_MIME_TYPES.includes(file?.type ?? "")
  );
}

export function isAllowedFileSize(file: File | null) {
  if (!file) return false;

  return file?.size <= MAX_SIZE_BYTES;
}
