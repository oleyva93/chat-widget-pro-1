import React, { useCallback, useMemo, useReducer } from "react";

import { Handlers } from "@/components/utils/handlers";
import { ChatWidgetContext } from "@/context/chat-widget-context";
import { useConnection } from "@/hooks/use-connection";
import { useHandleChannel } from "@/hooks/use-handle-channel";
import type { ChatWidgetConfig, ChatWidgetProviderProps } from "@/types";
import { RQProvider } from "@/providers/rq-provider";
import { SBProvider } from "@/providers/sb-provider";

export const ChatWidgetProvider: React.FC<ChatWidgetProviderProps> = ({
  children,
  config,
}) => {
  return (
    <SBProvider config={config}>
      <RQProvider>
        <MainActions config={config}>{children}</MainActions>
      </RQProvider>
    </SBProvider>
  );
};

const notificationReducer = (
  state: { withSound: boolean; withNotification: boolean },
  action: "toggleSound" | "toggleNotification",
) => {
  switch (action) {
    case "toggleSound":
      return { ...state, withSound: !state.withSound };
    case "toggleNotification":
      return { ...state, withNotification: !state.withNotification };
  }

  return state;
};

function MainActions({
  children,
  config,
}: {
  children: React.ReactNode;
  config: ChatWidgetConfig;
}) {
  const [state, dispatch] = useReducer(notificationReducer, {
    withSound: config.withSound ?? true,
    withNotification: config.withNotification ?? true,
  });

  const { handleDisconnect, handleConnect } = useConnection(config);

  const logger = useCallback(
    (message: string, type: "error" | "warn" | "info" | "debug") => {
      if (config?.logger) {
        config.logger(message, type);
        return;
      }

      console.log(message, type);
    },
    [config],
  );

  const {
    channels,
    maximizedChannels,
    minimizedChannels,
    handleSelection,
    handleCloseChat,
    handleCloseAllChats,
    handleOpenChat,
    handleJoinChannel,
    handleMinimizeChat,
    handleFreezeChannel,
    handleUnfreezeChannel,
  } = useHandleChannel({ logger });

  const channelsArray = useMemo(
    () => Array.from(channels.values()),
    [channels],
  );

  const handleToggleSound = useCallback(() => {
    dispatch("toggleSound");
  }, []);

  const handleToggleNotification = useCallback(() => {
    dispatch("toggleNotification");
  }, []);

  return (
    <ChatWidgetContext.Provider
      value={{
        channels: channelsArray,
        maximizedChannels,
        minimizedChannels,
        handleSelection,
        handleCloseChat,
        handleMinimizeChat,
        handleCloseAllChats,
        handleOpenChat,
        state,
        handleToggleSound,
        handleToggleNotification,
        logger,
        handleJoinChannel,
        handleDisconnect,
        handleConnect,
        handleFreezeChannel,
        handleUnfreezeChannel,
      }}
    >
      <Handlers />
      {children}
    </ChatWidgetContext.Provider>
  );
}
