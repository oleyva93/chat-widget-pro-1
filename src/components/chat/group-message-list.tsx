import Message from "@sendbird/uikit-react/GroupChannel/components/Message";
import MessageList from "@sendbird/uikit-react/GroupChannel/components/MessageList";
import Button from "@sendbird/uikit-react/ui/Button";
import MessageContent from "@sendbird/uikit-react/ui/MessageContent";
import { MessageMenu } from "@sendbird/uikit-react/ui/MessageMenu";
import { useCallback } from "react";

import { JoinLeaveNotice } from "@/components/chat/join-leave-notice";
import { SystemMessageRow } from "@/components/chat/system-message";
import { getJoinLeaveEvent } from "@/lib/admin-message";
import { PendingSpinner } from "@/components/ui/pending-spinner";
import {
  useChannelMetadata,
  useImperativeGetChannel,
} from "@/hooks/use-channel";
import { useTranslations } from "@/hooks/use-translations";

export function GroupMessageList({
  existsChannel,
  isPending,
  readOnly,
  channelUrl,
  ...props
}: {
  existsChannel: boolean;
  isPending: boolean;
  readOnly?: boolean;
  channelUrl: string;
}) {
  const { t } = useTranslations();
  const { data: channelMetadata } = useChannelMetadata();

  const hasTechnician = Boolean(channelMetadata?.associatedTechnician);

  if (!existsChannel) {
    if (readOnly) {
      return (
        <label className="w-full h-full flex flex-col justify-center items-center px-4 text-center text-sm text-gray-500">
          {t("read_only_unavailable")}
        </label>
      );
    }
    return <JoinChannelButton channelUrl={channelUrl} />;
  }

  if (isPending) {
    return (
      <label className="w-full h-full flex flex-col justify-center items-center px-4 text-center text-sm text-gray-500 whitespace-pre-line">
        <PendingSpinner />
        {t("pending_content")}
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
        renderMessage={(messageProps) => {
          const joinLeave = getJoinLeaveEvent(messageProps.message);
          if (joinLeave) {
            return <JoinLeaveNotice event={joinLeave} />;
          }

          if (messageProps.message.isAdminMessage()) {
            return (
              <SystemMessageRow
                text={messageProps.message.message}
                createdAt={messageProps.message.createdAt}
              />
            );
          }

          return (
            <Message
              {...messageProps}
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
          );
        }}
      />
      {!hasTechnician ? (
        <div className="absolute top-14 left-0 w-full h-6 bg-zinc-300 text-zinc-600 text-sm flex justify-center items-center">
          {t("waiting_assigned_technician")}
        </div>
      ) : null}
    </>
  );
}

function JoinChannelButton({ channelUrl }: { channelUrl: string }) {
  const getChannel = useImperativeGetChannel();
  const { t } = useTranslations();

  const handleJoinChannel = useCallback(async () => {
    const channel = await getChannel(channelUrl);

    if (channel) {
      channel.join();
    }
  }, [getChannel, channelUrl]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-4 text-center text-sm text-gray-500">
      <Button onClick={handleJoinChannel} className="bg-chw-primary text-white">
        {t("join_channel")}
      </Button>
    </div>
  );
}
