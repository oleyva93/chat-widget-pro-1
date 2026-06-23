import type { GroupChannel } from "@sendbird/chat/groupChannel";
import { User } from "lucide-react";

import { useGetChannelMetadata } from "@/hooks/use-channel";
import { getChannelStatus } from "@/lib/utils";
import { ChannelStatus } from "@/types";
import { PendingSpinner } from "@/components/ui/pending-spinner";

export function NoSenderInfoItem({ channel }: { channel: GroupChannel }) {
  const channelStatus = getChannelStatus(channel ?? null);
  const { data: channelMetadata } = useGetChannelMetadata(() =>
    channel?.getMetaData([]),
  );
  const isPending = channelStatus === ChannelStatus.PENDING;

  const hasTechnician = Boolean(channelMetadata?.associatedTechnician);

  return (
    <div className="relative">
      {isPending || !hasTechnician ? (
        <label className="w-full h-full flex flex-col  text-xs text-gray-500 px-1">
          <PendingSpinner className="justify-start" />
          Waiting for the asTech technician to joinssss.
        </label>
      ) : (
        <label className="w-full h-full flex flex-col  text-xs text-gray-500">
          No messages yet.
        </label>
      )}
      <div className="flex gap-1 items-center absolute right-0 bottom-0">
        <User size={12} className="text-gray-500" />
        <span className="text-xs text-gray-500">{channel?.memberCount}</span>
      </div>
    </div>
  );
}
