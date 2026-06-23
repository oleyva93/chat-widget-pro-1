import React from "react";

import Badge from "@sendbird/uikit-react/ui/Badge";
import { cn, getFormattedChannel } from "@/lib/utils";
import { type ChatListItemProps } from "@/types";
import { NoSenderInfoItem } from "@/components/list/no-sender-info-item";
import { SenderInfoItem } from "@/components/list/sender-info-item";

export const ChatListItem: React.FC<ChatListItemProps> = ({
  channel,
  className,
}) => {
  const { name, data } = getFormattedChannel(channel);

  const sender =
    channel?.lastMessage?.isUserMessage() ||
    channel?.lastMessage?.isFileMessage()
      ? channel?.lastMessage?.sender
      : undefined;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200",
        className,
      )}
    >
      <div className="relative flex gap-2 justify-between w-full">
        <h4 className="text-sm font-medium w-[60%] truncate text-black">
          {name}
        </h4>
        <span className="text-xs text-gray-500 truncate">RO# {data?.ro}</span>
        {channel?.unreadMessageCount ? (
          <Badge
            count={channel?.unreadMessageCount}
            className="absolute top-7 right-5"
          />
        ) : null}
      </div>
      {sender ? (
        <SenderInfoItem channel={channel} />
      ) : (
        <NoSenderInfoItem channel={channel} />
      )}
    </div>
  );
};
