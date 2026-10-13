import React, { memo } from "react";

import { useChatWidget } from '@/hooks/use-chat-widget';
import type { ChatWidgetProps } from '@/types';
import { Chat } from '@/components/chat/chat';
import { MinimizedChats } from '@/components/chat/floating-chat/minimized-chats';

export const ChatWidget: React.FC<ChatWidgetProps> = memo(() => {
  const { maximizedChannels, handleCloseChat, handleMinimizeChat } =
    useChatWidget();

  return (
    <div className="relative">
      {maximizedChannels.map((entry, index) => (
        <Chat
          key={entry.key}
          index={index + 0.3}
          channelUrl={entry.url}
          readOnly={entry.readOnly}
          onCloseChat={() => handleCloseChat(entry.url)}
          onMinimizeChat={() => handleMinimizeChat(entry.url)}
        />
      ))}

      <MinimizedChats />
    </div>
  );
});
