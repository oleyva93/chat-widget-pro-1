import { useSendbird } from "@sendbird/uikit-react";
import GroupChannel from "@sendbird/uikit-react/GroupChannel";
import MessageInputWrapper from "@sendbird/uikit-react/GroupChannel/components/MessageInputWrapper";
import { GroupChannelProvider, useGroupChannel } from "@sendbird/uikit-react/GroupChannel/context";
import React, { memo, useEffect, useRef, useState } from "react";

import { useChannelData } from "@/hooks/use-channel";
import { useTranslations } from "@/hooks/use-translations";
import useTabVisibility from "@/hooks/use-tab-visibility";
import {
  ALLOWED_MIME_TYPES,
  getChannelStatus,
  isAllowedFileSize,
  isAllowedImage,
} from "@/lib/utils";
import type { WithRefDialogHandle } from "@/lib/with-ref";
import { ChannelStatus, type ChatWindowProps } from "@/types";
import { DragResize } from "@/components/ui/drag-resize";
import { InnerDrawerRef } from "@/components/ui/inner-drawer-ref";
import { ChatSettingsSection } from "@/components/chat/chat-settings-section";
import { GroupMessageList } from "@/components/chat/group-message-list";
import ChatHeader from "@/components/chat/header/chat-header";
import { useChatWidget } from "@/hooks/use-chat-widget";
import { errorText } from "@/lib/log";

export const Chat: React.FC<ChatWindowProps> = memo(
  ({ channelUrl, index, onCloseChat, onMinimizeChat, readOnly }) => {
    if (!channelUrl) {
      return null;
    }

    return (
      <DragResize index={index}>
        <GroupChannelProvider channelUrl={channelUrl}>
          <ChanelSection
            channelUrl={channelUrl}
            onCloseChat={onCloseChat}
            onMinimizeChat={onMinimizeChat}
            readOnly={readOnly}
          />
        </GroupChannelProvider>
      </DragResize>
    );
  },
);

function ChanelSection({
  channelUrl,
  onCloseChat,
  onMinimizeChat,
  readOnly,
}: {
  channelUrl: string;
  onCloseChat?: () => void;
  onMinimizeChat?: () => void;
  readOnly?: boolean;
}) {
  const drawerRef = useRef<WithRefDialogHandle>(null);
  const { channel } = useChannelData();
  const {
    state: { messages, fetchChannelError },
  } = useGroupChannel();
  const { t } = useTranslations();
  const [fileError, setFileError] = useState<string | null>(null);

  const { logger } = useChatWidget();
  const {
    state: { config },
  } = useSendbird();
  const userId = config?.userId;

  const existsChannel = !!channel;

  const channelStatus = getChannelStatus(channel ?? null, messages?.length ?? 0);

  const isPending = channelStatus === ChannelStatus.PENDING;
  const isCompleted = channelStatus === ChannelStatus.COMPLETED;

  useEffect(() => {
    if (!fileError) return;
    const timeoutId = setTimeout(() => setFileError(null), 4000);
    return () => clearTimeout(timeoutId);
  }, [fileError]);

  const reportedLoadError = useRef("");

  useEffect(() => {
    if (!fetchChannelError) return;
    const exception = errorText(fetchChannelError);
    const key = `${channelUrl}:${exception}`;
    if (reportedLoadError.current === key) return;
    reportedLoadError.current = key;
    logger(
      `ERROR getting messages for user ${userId || "-"} on chatName=${channel?.name || "-"} and chatUrl=${channelUrl}. Exception=${exception}`,
      "error",
    );
  }, [fetchChannelError, logger, userId, channel?.name, channelUrl]);

  useTabVisibility((visible) => {
    if (visible) {
      channel?.markAsRead().catch((error: unknown) => {
        logger(`markAsReaded ~ \n${errorText(error)}`, "error");
      });
    }
  });

  function logSendFailure(reason: string) {
    const logInfo = {
      user_email: userId,
      channel_url: channelUrl,
      error: null,
    };
    logger(
      `Error sending chat message for user ${userId || "-"}. ERROR: ${reason}. INFO: ${JSON.stringify(logInfo)}`,
      "error",
    );
  }

  function handleShowSettings() {
    drawerRef.current?.toggle();
  }

  return (
    <div className="relative w-full h-full rounded-xl bg-white p-1 border border-gray-200 animate-fade-in shadow-chw drag-handle">
      <GroupChannel
        channelUrl={channelUrl}
        key={channelUrl}
        disableMarkAsRead
        renderMessageList={(props) => (
          <GroupMessageList
            existsChannel={existsChannel}
            isPending={isPending}
            readOnly={readOnly}
            channelUrl={channelUrl}
            {...props}
          />
        )}
        onBeforeSendFileMessage={({ file }) => {
          if (!isAllowedImage(file as File | null)) {
            setFileError(t("file_type_not_allowed"));
            logSendFailure("File is not allowed");
            throw new Error("File is not allowed");
          }
          if (!isAllowedFileSize(file as File | null)) {
            setFileError(t("file_size_too_large"));
            logSendFailure("File is too large");
            throw new Error("File is too large");
          }
          setFileError(null);
        }}
        renderMessageInput={() => {
          if (readOnly) return <></>;
          if (isCompleted) {
            return (
              <div className="flex flex-col items-center gap-2 px-4 py-4 text-center">
                <p className="text-sm text-gray-500">{t("request_completed")}</p>
                <button
                  type="button"
                  className="rounded-md bg-chw-primary px-4 py-2 text-sm text-white"
                  onClick={onCloseChat}
                >
                  {t("btn_close_chat")}
                </button>
              </div>
            );
          }
          return (
            <MessageInputWrapper
              acceptableMimeTypes={ALLOWED_MIME_TYPES}
              disabled={!existsChannel || isPending}
            />
          );
        }}
        renderChannelHeader={() => (
          <ChatHeader
            onInfoClick={handleShowSettings}
            onMinusClick={onMinimizeChat}
            onXClick={onCloseChat}
            channelUrl={channelUrl}
          />
        )}
      />

      {fileError ? (
        <div className="absolute bottom-16 left-3 right-3 z-10 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {fileError}
        </div>
      ) : null}

      <InnerDrawerRef ref={drawerRef} onClose={handleShowSettings}>
        <ChatSettingsSection
          channelUrl={channelUrl}
          existsChannel={existsChannel}
          onClose={handleShowSettings}
        />
      </InnerDrawerRef>
    </div>
  );
}
