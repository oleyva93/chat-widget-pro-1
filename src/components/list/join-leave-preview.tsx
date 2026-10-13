import type { GroupChannel } from "@sendbird/chat/groupChannel";
import { User } from "lucide-react";

import { useTranslations } from "@/hooks/use-translations";
import { joinLeaveLabel, type JoinLeaveEvent } from "@/lib/admin-message";
import { messageDistance, truncateText } from "@/lib/utils";

export function JoinLeavePreview({
  channel,
  event,
}: {
  channel: GroupChannel;
  event: JoinLeaveEvent;
}) {
  const { t } = useTranslations();
  const label = joinLeaveLabel(event, t);
  const text =
    label ||
    (channel.lastMessage?.isAdminMessage() ? channel.lastMessage.message : "");

  return (
    <div className="flex items-end justify-between">
      <h5 className="truncate text-xs text-gray-500">
        {truncateText(text, 42)}
        <span className="ml-2 text-xs text-gray-400">
          {messageDistance(channel?.lastMessage?.createdAt || 0)}
        </span>
      </h5>
      <div className="flex items-center gap-1">
        <User size={12} className="text-gray-500" />
        <span className="text-xs text-gray-500">{channel?.memberCount}</span>
      </div>
    </div>
  );
}
