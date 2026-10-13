import React, { useCallback, useMemo, useReducer } from "react";

import { Handlers } from "@/components/utils/handlers";
import { ChatWidgetContext } from "@/context/chat-widget-context";
import { useConnection } from "@/hooks/use-connection";
import { useHandleChannel } from "@/hooks/use-handle-channel";
import { emitLog, type LogType } from "@/lib/log";
import { normalizeLanguage } from "@/lib/translations";
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

type NotificationAction =
  | { type: "toggleSound" }
  | { type: "toggleNotification" }
  | { type: "setSound"; value: boolean }
  | { type: "setNotification"; value: boolean };

const notificationReducer = (
  state: { withSound: boolean; withNotification: boolean },
  action: NotificationAction,
) => {
  switch (action.type) {
    case "toggleSound":
      return { ...state, withSound: !state.withSound };
    case "toggleNotification":
      return { ...state, withNotification: !state.withNotification };
    case "setSound":
      return { ...state, withSound: action.value };
    case "setNotification":
      return { ...state, withNotification: action.value };
  }
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
    (message: string, type: LogType) => {
      emitLog(config?.logger, message, type);
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

  const language = normalizeLanguage(config.language);

  const handleToggleSound = useCallback((value?: boolean) => {
    if (typeof value === "boolean") {
      dispatch({ type: "setSound", value });
      return;
    }
    dispatch({ type: "toggleSound" });
  }, []);

  const handleToggleNotification = useCallback((value?: boolean) => {
    if (typeof value === "boolean") {
      dispatch({ type: "setNotification", value });
      return;
    }
    dispatch({ type: "toggleNotification" });
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
        language,
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
