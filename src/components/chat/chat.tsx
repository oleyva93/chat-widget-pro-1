import GroupChannel from "@sendbird/uikit-react/GroupChannel";
import MessageInputWrapper from "@sendbird/uikit-react/GroupChannel/components/MessageInputWrapper";
import { GroupChannelProvider } from "@sendbird/uikit-react/GroupChannel/context";
import React, { memo, useRef } from "react";

import { useChannelData } from "@/hooks/use-channel";
import useTabVisibility from "@/hooks/use-tab-visibility";
import {
  ALLOWED_MIME_TYPES,
  getChannelStatus,
  isAllowedFileSize,
  isAllowedImage,
  MAX_SIZE_MB,
} from "@/lib/utils";
import type { WithRefDialogHandle } from "@/lib/with-ref";
import { ChannelStatus, type ChatWindowProps } from "@/types";
import { DragResize } from "@/components/ui/drag-resize";
import { InnerDrawerRef } from "@/components/ui/inner-drawer-ref";
import { ChatSettingsSection } from "@/components/chat/chat-settings-section";
import { GroupMessageList } from "@/components/chat/group-message-list";
import ChatHeader from "@/components/chat/header/chat-header";
import { useChatWidget } from "@/hooks/use-chat-widget";

export const Chat: React.FC<ChatWindowProps> = memo(
  ({ channelUrl, index, onCloseChat, onMinimizeChat }) => {
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
}: {
  channelUrl: string;
  onCloseChat?: () => void;
  onMinimizeChat?: () => void;
}) {
  const drawerRef = useRef<WithRefDialogHandle>(null);
  const { channel } = useChannelData();

  const { logger } = useChatWidget();

  const existsChannel = !!channel;

  const channelStatus = getChannelStatus(channel ?? null);

  const isPending = channelStatus === ChannelStatus.PENDING;

  useTabVisibility((visible) => {
    if (visible) {
      channel?.markAsRead();
    }
  });

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
            channelUrl={channelUrl}
            {...props}
          />
        )}
        onBeforeSendFileMessage={({ file }) => {
          if (!isAllowedImage(file as File | null)) {
            alert("File is not allowed");
            logger("File is not allowed", "error");
            throw new Error("File is not allowed");
          }
          if (!isAllowedFileSize(file as File | null)) {
            alert(`File is too large, max size is ${MAX_SIZE_MB + 1}MB`);
            logger("File is too large", "error");
            throw new Error("File is too large");
          }
        }}
        renderMessageInput={() => (
          <MessageInputWrapper
            acceptableMimeTypes={ALLOWED_MIME_TYPES}
            disabled={!existsChannel || isPending}
          />
        )}
        renderChannelHeader={() => (
          <ChatHeader
            onInfoClick={handleShowSettings}
            onMinusClick={onMinimizeChat}
            onXClick={onCloseChat}
            channelUrl={channelUrl}
          />
        )}
      />

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
