import { Role } from "@sendbird/chat";
import type { GroupChannel } from "@sendbird/chat/groupChannel";
import { useSendbird } from "@sendbird/uikit-react";

import { useChatWidget } from "@/hooks/use-chat-widget";
import { useEventHandlers } from "@/hooks/use-event-handlers";
import { playAlarmSound, triggerNotification } from "@/lib/notifications";

export function Handlers() {
  const { state, language, logger, handleOpenChat } = useChatWidget();
  const {
    state: { config },
  } = useSendbird();

  useEventHandlers({
    onMessageReceived: (channel, message) => {
      if (state.withNotification) {
        triggerNotification(
          message,
          channel as GroupChannel,
          language,
          config.userId,
        );
      }
      if (state.withSound) {
        playAlarmSound(logger);
      }
    },
    onUserJoined: (channel, user) => {
      if (channel.myRole === Role.OPERATOR && user.role === Role.OPERATOR) {
        handleOpenChat(channel.url);
      }
    },
    onConnected: () => {
      if (
        state.withNotification &&
        "Notification" in window &&
        Notification.permission === "default"
      ) {
        Notification.requestPermission();
      }
    },
    onError: (error) => {
      logger(error.message, "error");
    },
  });

  return null;
}
