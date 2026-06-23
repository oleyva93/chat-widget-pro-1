import type { GroupChannel } from "@sendbird/chat/groupChannel";
import { User } from "lucide-react";

import { messageDistance, truncateText } from "@/lib/utils";
import ProfileImage from "@/components/ui/profile-image";

export function SenderInfoItem({ channel }: { channel: GroupChannel }) {
  const sender =
    channel?.lastMessage?.isUserMessage() ||
    channel?.lastMessage?.isFileMessage()
      ? channel?.lastMessage?.sender
      : undefined;

  return (
    <div className="flex justify-between items-end">
      <div className="flex gap-2">
        <ProfileImage
          profileUrl={sender?.profileUrl || ""}
          nickname={sender?.nickname || ""}
          height={32}
          width={32}
          fontSize={12}
        />
        <div className="flex flex-col">
          <h4 className="text-sm font-medium text-black">
            {sender?.nickname || "Admin"}&nbsp;&nbsp;
            <span className="text-xs text-gray-500">
              {messageDistance(channel?.lastMessage?.createdAt || 0)}
            </span>
          </h4>
          <h5 className="text-xs text-gray-500 truncate">
            {truncateText(channel?.lastMessage?.message || "", 25)}
          </h5>
        </div>
      </div>
      <div className="flex gap-1 items-center">
        <User size={12} className="text-gray-500" />
        <span className="text-xs text-gray-500">{channel?.memberCount}</span>
      </div>
    </div>
  );
}
