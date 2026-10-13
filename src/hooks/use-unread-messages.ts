import { useSendbird } from "@sendbird/uikit-react";
import { useState, useEffect, useCallback } from "react";

import { useChatWidget } from "@/hooks/use-chat-widget";
import { useEventHandlers } from '@/hooks/use-event-handlers';
import { errorText } from "@/lib/log";

export const useUnreadMessages = () => {
  const {
    state: { stores },
  } = useSendbird();
  const sdk = stores?.sdkStore.sdk;

  const [unreadCount, setUnreadCount] = useState(0);
  const { logger } = useChatWidget();

  const getUnreadMessageCount = useCallback(() => {
    if (!sdk?.groupChannel?.getTotalUnreadMessageCount) return;

    sdk?.groupChannel
      ?.getTotalUnreadMessageCount?.()
      .then((count: number) => {
        setUnreadCount(count);
      })
      .catch((error: unknown) => {
        logger(`getTotalUnreadMessages: ${errorText(error)}`, "error");
      });
  }, [sdk, logger]);

  useEventHandlers({
    onMessageReceived: () => {
      getUnreadMessageCount();
    },
    onChannelChanged: () => {
      getUnreadMessageCount();
    },
  });

  useEffect(() => {
    getUnreadMessageCount();
  }, [getUnreadMessageCount]);

  return unreadCount;
};
