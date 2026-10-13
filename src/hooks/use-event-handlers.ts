import { GroupChannelHandler } from "@sendbird/chat/groupChannel";
import { useSendbird } from "@sendbird/uikit-react";
import ConnectionHandler from "@sendbird/uikit-react/handlers/ConnectionHandler";
import { useEffect, useId, useLayoutEffect, useRef } from "react";

import type { BaseChannel } from "@sendbird/chat";
import type { GroupChannel } from "@sendbird/chat/groupChannel";
import type { BaseMessage } from "@sendbird/chat/message";

type JoinedUser = {
  userId?: string;
  role?: string;
};

type EventHandlers = {
  onMessageReceived?: (channel: BaseChannel, message: BaseMessage) => void;
  onConnected?: () => void;
  onChannelChanged?: (channel: BaseChannel) => void;
  onUserJoined?: (channel: GroupChannel, user: JoinedUser) => void;
  onError?: (error: Error) => void;
};

export function useEventHandlers(handlers: EventHandlers): void {
  const {
    state: { stores },
  } = useSendbird();
  const sdk = stores?.sdkStore.sdk;

  const id = useId();

  const handlersRef = useRef<EventHandlers>(handlers);

  useLayoutEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    if (!sdk.addConnectionHandler) return;

    try {
      const groupChannelHandler = new GroupChannelHandler({
        onMessageReceived: (channel, message) => {
          handlersRef.current.onMessageReceived?.(channel, message);
        },
        onChannelChanged: (channel) => {
          handlersRef.current.onChannelChanged?.(channel);
        },
        onUserJoined: (channel, user) => {
          handlersRef.current.onUserJoined?.(channel, user);
        },
      });

      const connectionHandler = new ConnectionHandler({
        onConnected: () => {
          handlersRef.current.onConnected?.();
        },
      });

      if (typeof sdk?.addConnectionHandler === "function") {
        sdk.addConnectionHandler(`connection-handler-${id}`, connectionHandler);
      }

      sdk?.groupChannel?.addGroupChannelHandler(
        `group-channel-handler-${id}`,
        groupChannelHandler
      );
    } catch {
      handlersRef.current.onError?.(
        new Error("Something went wrong with the Sendbird connection handler")
      );
    }

    return () => {
      try {
        sdk?.removeConnectionHandler?.(`connection-handler-${id}`);
        sdk?.groupChannel?.removeGroupChannelHandler?.(
          `group-channel-handler-${id}`,
        );
      } catch {
        handlersRef.current.onError?.(
          new Error("Failed to remove the connectionHandler")
        );
      }
    };
  }, [sdk, id]);
}
