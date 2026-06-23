import { useMemo } from "react";

import { useChatScroll } from "@/hooks/use-chat-scroll";
import { useHistoryMessages } from "@/hooks/use-history-message";
import { formatDate } from "@/lib/date";
import { wait } from "@/lib/utils";
import type { ChatHistoryMessage, ChatHistoryParams } from "@/types";
import { PendingSpinner } from "@/components/ui/pending-spinner";
import { ChatHistoryGroupMessage } from "@/components/history/content/chat-history-group-message";
import ChatHistoryHeader from "@/components/history/content/chat-history-header";

function groupMessagesByDay(messages: ChatHistoryMessage[]) {
  return messages.reduce<Record<string, ChatHistoryMessage[]>>(
    (acc, message) => {
      const day = formatDate(new Date(message.created_at), "short_date");
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(message);
      return acc;
    },
    {},
  );
}

export function ChatHistoryContainer({
  params: { name, ...params },
  handleClose,
}: {
  params: ChatHistoryParams;
  handleClose: () => void;
}) {
  const { data, isLoading, hasNext, setSize, size, isValidating } =
    useHistoryMessages(params, {
      onSuccess: async () => {
        if (chatRef.current && size > 1 && !isLoading) {
          await wait(1);
          chatRef.current.scrollTop =
            chatRef.current.scrollHeight - (previousHeight?.current ?? 0);
        }
      },
    });

  const { ref: chatRef, previousHeight } = useChatScroll(
    Boolean(data.length),
    () => {
      if (hasNext) {
        setSize((size) => size + 1);
      }
    },
  );

  const groupedMessages = useMemo(
    () => Object.entries(groupMessagesByDay(data)),
    [data],
  );

  return (
    <div className="relative w-full h-full rounded-xl bg-white p-1 border border-gray-200 animate-fade-in shadow-chw drag-handles">
      <ChatHistoryHeader
        wo={params.woID}
        vin={params.vin}
        name={name || "Chat History"}
        onXClick={handleClose}
      />
      <div ref={chatRef} className="h-[90%] p-4 overflow-y-auto">
        {isValidating && hasNext ? <PendingSpinner /> : null}
        <div className="flex flex-col-reverse">
          {groupedMessages.map((group) => (
            <ChatHistoryGroupMessage key={group[0]} group={group} />
          ))}
        </div>
      </div>
    </div>
  );
}
