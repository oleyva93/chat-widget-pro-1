import { useGetChannel } from "@/hooks/use-channel";
import { cn, getChannelStatus } from "@/lib/utils";
import { ChannelStatus } from "@/types";

export const ChatLeftHeader = ({
  className,
  channelUrl,
}: {
  className?: string;
  channelUrl: string;
}) => {
  const { channel, name, data } = useGetChannel(channelUrl);

  const channelStatus = getChannelStatus(channel ?? null);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn("w-3 h-3 rounded-full", {
          "bg-yellow-500": channelStatus === ChannelStatus.PENDING,
          "bg-blue-800": channelStatus === ChannelStatus.COMPLETED,
          "bg-green-500": channelStatus === ChannelStatus.ACTIVE,
        })}
      />
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 cancel-drag cursor-text truncate w-[180px]">
          RO# {data?.ro}
        </span>
        <span className="text-sm font-medium text-black cancel-drag cursor-text">
          {name}
        </span>
      </div>
    </div>
  );
};
