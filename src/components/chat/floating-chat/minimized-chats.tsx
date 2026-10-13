import { GroupChannelProvider } from "@sendbird/uikit-react/GroupChannel/context";
import { X } from "lucide-react";
import React, { memo } from "react";
import { Tooltip } from "react-tooltip";

import { useChatWidget } from "@/hooks/use-chat-widget";
import { useTranslations } from "@/hooks/use-translations";
import FloatingChat from '@/components/chat/floating-chat/floating-chat';

export const MinimizedChats: React.FC = memo(() => {
  const { minimizedChannels, handleCloseAllChats } = useChatWidget();
  const { t } = useTranslations();

  return (
    <div className="fixed bottom-10 right-6 flex flex-col gap-4 items-center">
      {minimizedChannels.length > 1 ? (
        <>
          <div
            data-tooltip-id="close-chats"
            className="bg-gray-200 shadow-chw h-8 w-8 relative cursor-pointer rounded-full justify-center items-center flex p-1 transition delay-50 duration-200 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-gray-300 "
            onClick={handleCloseAllChats}
          >
            <X className="h-6 w-6" color="black" />
          </div>
          <Tooltip
            id="close-chats"
            place="left"
            className="bg-white/90 shadow-chw rounded-2xl"
            variant="light"
            content={t("close_all_chats")}
          />
        </>
      ) : null}
      {minimizedChannels.map((entry) => (
        <GroupChannelProvider
          key={entry.key}
          channelUrl={entry.url}
          disableMarkAsRead
        >
          <FloatingChat key={entry.key} channelUrl={entry.url} />
        </GroupChannelProvider>
      ))}
    </div>
  );
});
