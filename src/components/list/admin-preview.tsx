import type { GroupChannel } from "@sendbird/chat/groupChannel";
import { User } from "lucide-react";

import { useTranslations } from "@/hooks/use-translations";
import { messageDistance, truncateText } from "@/lib/utils";
import ProfileImage from "@/components/ui/profile-image";

export function AdminPreview({ channel }: { channel: GroupChannel }) {
  const { t } = useTranslations();
  const label = t("system_message_sender");
  const text = channel.lastMessage?.isAdminMessage()
    ? channel.lastMessage.message
    : "";

  return (
    <div className="flex items-end justify-between">
      <div className="flex gap-2">
        <ProfileImage
          profileUrl=""
          nickname={label}
          initials="SM"
          height={32}
          width={32}
          fontSize={12}
        />
        <div className="flex flex-col">
          <h4 className="text-sm font-medium text-black">
            {label}&nbsp;&nbsp;
            <span className="text-xs text-gray-500">
              {messageDistance(channel?.lastMessage?.createdAt || 0)}
            </span>
          </h4>
          <h5 className="truncate text-xs text-gray-500">
            {truncateText(text, 25)}
          </h5>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <User size={12} className="text-gray-500" />
        <span className="text-xs text-gray-500">{channel?.memberCount}</span>
      </div>
    </div>
  );
}
