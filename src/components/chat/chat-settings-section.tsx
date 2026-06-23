import { Role } from "@sendbird/chat";
import { ChannelSettings, useSendbird } from "@sendbird/uikit-react";
import ChannelSettingMenuList from "@sendbird/uikit-react/ChannelSettings/components/ChannelSettingMenuList";
import Header from "@sendbird/uikit-react/ui/Header";
import UserListItem from "@sendbird/uikit-react/ui/UserListItem";
import UserProfile from "@sendbird/uikit-react/ui/UserProfile";
import { ArrowLeft } from "lucide-react";

import { useChannelMetadata, useGetChannel } from "@/hooks/use-channel";
import { useChatWidget } from "@/hooks/use-chat-widget";
import { ChatLeftHeader } from "@/components/chat/header/chat-left-header";

export const ChatSettingsSection = ({
  channelUrl,
  onClose,
  existsChannel,
}: {
  channelUrl: string;
  onClose: () => void;
  existsChannel: boolean;
}) => {
  const { state } = useSendbird();
  const { handleCloseChat } = useChatWidget();

  const { channel } = useGetChannel(channelUrl);
  const { data: channelMetadata } = useChannelMetadata();

  const currentUser = state.config.userId;
  const imOperator = channel?.members?.some(
    (member) => member.role === Role.OPERATOR && member.userId === currentUser,
  );
  const imTechnicians = channelMetadata?.associatedTechnician === currentUser;

  const showLeaveButton = !imOperator && !imTechnicians;

  return (
    <div className="allow-drag cursor-grab">
      <ChannelSettings
        channelUrl={channelUrl}
        className="rounded-xl"
        onLeaveChannel={() => {
          handleCloseChat(channelUrl);
        }}
        renderChannelProfile={() => (
          <ChatLeftHeader channelUrl={channelUrl} className="p-4" />
        )}
        renderLeaveChannel={
          showLeaveButton && existsChannel ? undefined : () => <></>
        }
        renderUserListItem={(props) => (
          <UserListItem {...props} renderListItemMenu={() => <></>} />
        )}
        renderUserProfile={(props) => (
          <UserProfile {...props} disableMessaging />
        )}
        renderModerationPanel={(props) => (
          <ChannelSettingMenuList
            {...props}
            menuItems={{
              ...props.menuItems,
              nonOperator: {
                ...props.menuItems.nonOperator,
                allUsers: {
                  ...props.menuItems.nonOperator.allUsers,
                  hideMenu: !existsChannel,
                },
              },
              operator: {
                ...props.menuItems.operator,
                bannedUsers: {
                  ...props.menuItems.operator.bannedUsers,
                  hideMenu: true,
                },
                mutedUsers: {
                  ...props.menuItems.operator.mutedUsers,
                  hideMenu: true,
                },
                freezeChannel: {
                  ...props.menuItems.operator.freezeChannel,
                  hideMenu: true,
                },
              },
            }}
          />
        )}
        renderHeader={() => (
          <Header
            renderMiddle={() => (
              <div className="flex items-center justify-between gap-2">
                <div
                  className="rounded-full p-1 hover:bg-gray-100 cursor-pointer"
                  onTouchStart={onClose}
                  onClick={onClose}
                >
                  <ArrowLeft
                    className="w-5.5 h-5.5 text-chw-primary"
                    strokeWidth={2.8}
                  />
                </div>
                <Header.Title title="Chat Information" />
              </div>
            )}
            className="rounded-t-xl"
          />
        )}
      />
    </div>
  );
};
