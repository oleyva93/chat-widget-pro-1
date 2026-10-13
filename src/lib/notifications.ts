import type { GroupChannel } from "@sendbird/chat/groupChannel";
import type { BaseMessage } from "@sendbird/chat/message";

import { getJoinLeaveEvent } from "@/lib/admin-message";
import { errorText, type ChatLogger } from "@/lib/log";
import { getFormattedChannel } from "@/lib/utils";
import type { ChatLanguage } from "@/types";

const alarmAudio = "https://astech-chat-library.s3.amazonaws.com/chat-ting.wav";

function messageText(message: BaseMessage, language: ChatLanguage) {
  if (!("message" in message) || typeof message.message !== "string") {
    return "";
  }

  const translations =
    "translations" in message && message.translations
      ? (message.translations as Record<string, string>)
      : undefined;

  return translations?.[language] || message.message;
}

export function triggerNotification(
  message: BaseMessage,
  channel: GroupChannel,
  language: ChatLanguage = "en",
  currentUserId?: string,
) {
  if (document.hasFocus() || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const senderId = message.isUserMessage() || message.isFileMessage()
    ? message.sender?.userId
    : undefined;

  if (senderId && currentUserId && senderId === currentUserId) return;

  const currentChannel = getFormattedChannel(channel);
  let body = "";

  if (message.isUserMessage()) {
    body = `${message.sender.nickname}:  ${messageText(message, language)}`;
  } else if (message.isAdminMessage()) {
    if (getJoinLeaveEvent(message)) return;
    body = messageText(message, language);
  } else if (message.isFileMessage()) {
    const nickname = message.sender?.nickname;
    body = nickname ? `${nickname}:  ${message.name || "File"}` : message.name || "File";
  } else {
    return;
  }

  const notification = new Notification(currentChannel.name || "Chat", {
    body,
    tag: String(message.messageId || ""),
  });

  notification.onclick = function () {
    window.focus();
  };
}

export function playAlarmSound(logger?: ChatLogger) {
  if (!document.hasFocus()) {
    const audio = new Audio(alarmAudio);
    audio.volume = 0.05;
    audio
      .play()
      .then(function () {
        logger?.("Audio Play: success", "info");
      })
      .catch(function (error) {
        logger?.(
          "Audio Play Error: " + errorText(error),
          "error",
        );
      });
    setTimeout(() => {
      audio.muted = true;
    }, 1000);
  }
}
