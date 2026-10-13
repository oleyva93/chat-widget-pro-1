import Tooltip from "@sendbird/uikit-react/ui/Tooltip";
import TooltipWrapper from "@sendbird/uikit-react/ui/TooltipWrapper";
import { Copy, X } from "lucide-react";
import { memo, useMemo, useState } from "react";

import { useImperativeChatHistory } from "@/hooks/use-history-message";
import { useTranslations } from "@/hooks/use-translations";
import { formatToFullDate } from "@/lib/date";
import {
  getJoinLeaveEvent,
  isSystemAdminMessage,
  joinLeaveUserName,
} from "@/lib/admin-message";
import type { ChatHistoryParams } from "@/types";
import { Loader } from "@/components/ui/loader";

type ChatHistoryHeaderProps = {
  wo: string;
  name: string;
  vin: string;
  onXClick?: () => void;
};

function ChatHistoryHeader({
  wo,
  name,
  vin,
  onXClick,
}: ChatHistoryHeaderProps) {
  const { t } = useTranslations();
  const params = useMemo(() => ({ woID: wo, vin, name }), [wo, vin, name]);

  return (
    <section className="flex items-center justify-between p-2 border-b border-gray-200 w-full allow-drag cursor-grab">
      <div className={"flex items-center gap-3"}>
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-black cancel-drag cursor-text">
            {name}
          </span>
        </div>
      </div>
      <div className="flex justify-end relative cancel-drag">
        <ChatHistoryHeaderCopy params={params} />
        <TooltipWrapper hoverTooltip={<Tooltip>{t("close_chat")}</Tooltip>}>
          <div
            className="rounded-full p-1 hover:bg-gray-100 cursor-pointer"
            onClick={onXClick}
            onTouchStart={onXClick}
          >
            <X className="w-5.5 h-5.5 text-chw-primary" strokeWidth={2.8} />
          </div>
        </TooltipWrapper>
      </div>
    </section>
  );
}

function ChatHistoryHeaderCopy({ params }: { params: ChatHistoryParams }) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslations();

  const { trigger, isMutating } = useImperativeChatHistory(params);

  async function handleCopy() {
    const messagesList = await trigger();

    const messageTexts = messagesList
      .map((message) => {
        const { message: msg, user } = message;

        const createdAt = formatToFullDate(
          message?.createdAt || message?.created_at,
        );

        const joinLeave = getJoinLeaveEvent(message);
        if (joinLeave?.users.length) {
          return joinLeave.users
            .map((member) => {
              const line = `${joinLeaveUserName(member)} ${t(joinLeave.type)}`;
              return `${line}\n${createdAt}\n\n-------------------------------- \n`;
            })
            .join("\n");
        }

        const userName = isSystemAdminMessage(message)
          ? t("system_message_sender")
          : user?.nickname || user?.user_id || t("automatic_event_message");

        return `${userName}\n${msg}\n${createdAt}\n\n-------------------------------- \n`;
      })
      .join("\n");

    navigator.clipboard.writeText(messageTexts).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <TooltipWrapper
      hoverTooltip={
        <Tooltip className="bg-zinc-500">
          {copied ? t("all_messages_copied") : t("copy_messages_tooltip")}
        </Tooltip>
      }
    >
      <div
        className="rounded-full p-1.5 hover:bg-gray-100 cursor-pointer flex items-center justify-center"
        onClick={handleCopy}
        onTouchStart={handleCopy}
      >
        {isMutating ? (
          <Loader className="w-7.5 h-7.5 text-chw-primary" />
        ) : (
          <Copy className="text-chw-primary" strokeWidth={2.8} size={20} />
        )}
      </div>
    </TooltipWrapper>
  );
}

export default memo(ChatHistoryHeader);
