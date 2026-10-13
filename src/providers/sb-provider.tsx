import { GroupChannelModule } from "@sendbird/chat/groupChannel";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import React from "react";

import { emitLog, errorText } from "@/lib/log";
import { getUikitStringSet, normalizeLanguage } from "@/lib/translations";
import type { ChatWidgetConfig } from "@/types";

export function SBProvider({
  children,
  config,
}: {
  children: React.ReactNode;
  config: ChatWidgetConfig;
}) {
  return (
    <SendbirdProvider
      appId={config.appId}
      userId={config.userId}
      profileUrl={config.profileUrl}
      nickname={config.nickname}
      stringSet={getUikitStringSet(normalizeLanguage(config.language))}
      config={{
        logLevel: ["warning", "error"],
      }}
      eventHandlers={{
        message: {
          onFileUploadFailed(error) {
            const logInfo = {
              user_email: config.userId,
              channel_url: null,
              error: null,
            };
            emitLog(
              config.logger,
              `Error sending chat message for user ${config.userId}. ERROR: ${errorText(error)}. INFO: ${JSON.stringify(logInfo)}`,
              "error",
            );
          },
          onSendMessageFailed(message, error) {
            const channelUrl =
              message && typeof message === "object" && "channelUrl" in message
                ? String(message.channelUrl ?? "")
                : "";
            const logInfo = {
              user_email: config.userId,
              channel_url: channelUrl,
              error: null,
            };
            emitLog(
              config.logger,
              `Error sending chat message for user ${config.userId}. ERROR: ${errorText(error)}. INFO: ${JSON.stringify(logInfo)}`,
              "error",
            );
          },
        },
        connection: {
          onFailed(error) {
            emitLog(
              config.logger,
              `ERROR connecting user ${config.userId}. Error: ${errorText(error)}`,
              "error",
            );
          },
          onConnected: (user) => {
            user
              .updateMetaData(
                {
                  email: config.userId,
                  name: config.nickname ?? "",
                },
                true,
              )
              .catch((error: unknown) => {
                emitLog(
                  config.logger,
                  `_updateCurrentUserMetadata ~ updateMetaData ~ \n${errorText(error)}`,
                  "error",
                );
              });

            emitLog(
              config.logger,
              `User ${config.userId} connected to Sendbird server`,
              "info",
            );
          },
        },
      }}
      sdkInitParams={{
        appStateToggleEnabled: false,
        modules: [new GroupChannelModule()],
      }}
      uikitOptions={{
        groupChannel: {
          enableVoiceMessage: false,
        },
      }}
    >
      {children}
    </SendbirdProvider>
  );
}
