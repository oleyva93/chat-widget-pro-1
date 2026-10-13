import { PublicChannelFilter } from "@sendbird/chat/groupChannel";
import { GroupChannelList } from "@sendbird/uikit-react/GroupChannelList";
import React, { memo, useState } from "react";
import { useDebounce } from "use-debounce";

import { useChatWidget } from "@/hooks/use-chat-widget";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";
import type { ChannelListProps, ChannelType } from "@/types";
import { ChatListHeader } from "@/components/list/chat-list-header";
import { ChatListItem } from "@/components/list/chat-list-item";

export const ChatList: React.FC<ChannelListProps> = memo(
  ({ onChannelSelect, onClose, className }) => {
    const [search, setSearch] = useState("");
    const [value] = useDebounce(search, 500);

    const { handleSelection } = useChatWidget();
    const { t } = useTranslations();

    function handleChannelSelect(channel: ChannelType) {
      if (channel) {
        handleSelection(channel);
        onChannelSelect?.(channel);
      }
    }

    return (
      <GroupChannelList
        disableAutoSelect
        className={cn("shadow-chw", className)}
        onChannelCreated={() => {}}
        renderChannelPreview={({ channel }) => {
          return <ChatListItem channel={channel} />;
        }}
        renderHeader={() => (
          <ChatListHeader
            onSearch={(e) => setSearch(e.target.value)}
            onClose={onClose}
            className={className}
            searchValue={search}
          />
        )}
        renderPlaceHolderLoading={() => (
          <div className="px-4 text-gray-400">{t("loading_chats")}</div>
        )}
        channelListQueryParams={{
          channelNameContainsFilter: value,
          includeEmpty: true,
          limit: 100,
          publicChannelFilter: PublicChannelFilter.PUBLIC,
        }}
        onChannelSelect={handleChannelSelect}
      />
    );
  },
);
