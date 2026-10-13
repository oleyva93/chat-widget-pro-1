import { memo } from "react";

import { JoinLeaveNotice } from "@/components/chat/join-leave-notice";
import { SystemMessageRow } from "@/components/chat/system-message";
import { getJoinLeaveEvent } from "@/lib/admin-message";
import type { ChatHistoryMessage } from "@/types";

export const AdminMessage = memo(
  ({ message }: { message: ChatHistoryMessage }) => {
    const joinLeave = getJoinLeaveEvent(message);
    if (joinLeave) {
      return <JoinLeaveNotice event={joinLeave} />;
    }

    return (
      <SystemMessageRow
        text={message.message}
        createdAt={message.created_at || message.createdAt}
      />
    );
  },
);
