import { GroupChannelModule } from "@sendbird/chat/groupChannel";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import React from "react";

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
      config={{
        logLevel: ["warning", "error"],
      }}
      eventHandlers={{
        message: {
          onFileUploadFailed(error) {
            config?.logger?.(
              `File upload failed: ${JSON.stringify(error)}`,
              "error",
            );
          },
          onSendMessageFailed(error) {
            config?.logger?.(
              `Message send failed: ${JSON.stringify(error)}`,
              "error",
            );
          },
        },
        connection: {
          onFailed(error) {
            config?.logger?.(
              `Connection failed: ${JSON.stringify(error)}`,
              "error",
            );
          },
          onConnected: (user) => {
            user.updateMetaData(
              {
                email: config.userId,
                name: config.nickname ?? "",
              },
              true,
            );

            const userInfo = {
              email: config.userId,
              name: config.nickname ?? "",
            };
            config?.logger?.(
              `UserConnected: ${JSON.stringify(userInfo)}`,
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
