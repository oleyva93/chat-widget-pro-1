import Message from "@sendbird/uikit-react/GroupChannel/components/Message";
import MessageList from "@sendbird/uikit-react/GroupChannel/components/MessageList";
import Button from "@sendbird/uikit-react/ui/Button";
import MessageContent from "@sendbird/uikit-react/ui/MessageContent";
import { MessageMenu } from "@sendbird/uikit-react/ui/MessageMenu";
import { useCallback } from "react";

import { PendingSpinner } from "@/components/ui/pending-spinner";
import {
  useChannelMetadata,
  useImperativeGetChannel,
} from "@/hooks/use-channel";

export function GroupMessageList({
  existsChannel,
  isPending,
  channelUrl,
  ...props
}: {
  existsChannel: boolean;
  isPending: boolean;
  channelUrl: string;
}) {
  const { data: channelMetadata } = useChannelMetadata();

  const hasTechnician = Boolean(channelMetadata?.associatedTechnician);

  if (!existsChannel) {
    return <JoinChannelButton channelUrl={channelUrl} />;
  }

  if (isPending) {
    return (
      <label className="w-full h-full flex flex-col justify-center items-center px-4 text-center text-sm text-gray-500">
        <PendingSpinner />
        Waiting for the asTech technician to join. <br /> We will be with you
        momentarily.
      </label>
    );
  }

  if (!channelMetadata) {
    return <div className="w-full h-full" />;
  }

  return (
    <>
      <MessageList
        {...props}
        renderMessage={(props) => (
          <Message
            {...props}
            renderMessageContent={(props) => (
              <MessageContent
                {...props}
                renderMessageMenu={(props) => (
                  <MessageMenu
                    {...props}
                    renderMenuItems={({ items }) => {
                      const { CopyMenuItem, ReplyMenuItem } = items;

                      return (
                        <>
                          <CopyMenuItem />
                          <ReplyMenuItem />
                        </>
                      );
                    }}
                  />
                )}
              />
            )}
          />
        )}
      />
      {!hasTechnician ? (
        <div className="absolute top-14 left-0 w-full h-6 bg-zinc-300 text-zinc-600 text-sm flex justify-center items-center">
          Waiting for the assigned technician to join.
        </div>
      ) : null}
    </>
  );
}

function JoinChannelButton({ channelUrl }: { channelUrl: string }) {
  const getChannel = useImperativeGetChannel();

  const handleJoinChannel = useCallback(async () => {
    const channel = await getChannel(channelUrl);

    if (channel) {
      channel.join();
    }
  }, [getChannel, channelUrl]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-4 text-center text-sm text-gray-500">
      <Button onClick={handleJoinChannel} className="bg-chw-primary text-white">
        Join Channel
      </Button>
    </div>
  );
}
