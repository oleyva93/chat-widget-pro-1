import Tooltip from "@sendbird/uikit-react/ui/Tooltip";
import TooltipWrapper from "@sendbird/uikit-react/ui/TooltipWrapper";
import { Info, Minus, X } from "lucide-react";
import { memo } from "react";

import { ChatLeftHeader } from "@/components/chat/header/chat-left-header";
import { useTranslations } from "@/hooks/use-translations";

function ChatHeader({
  onInfoClick,
  onMinusClick,
  onXClick,
  channelUrl,
}: {
  onInfoClick?: () => void;
  onMinusClick?: () => void;
  onXClick?: () => void;
  channelUrl: string;
}) {
  const { t } = useTranslations();

  return (
    <section className="flex items-center justify-between p-2 border-b border-gray-200 w-full allow-drag cursor-grab">
      <ChatLeftHeader channelUrl={channelUrl} />
      <div className="flex justify-end relative cancel-drag">
        <TooltipWrapper hoverTooltip={<Tooltip>{t("info")}</Tooltip>}>
          <div
            className="rounded-full p-1 hover:bg-gray-100 cursor-pointer"
            onClick={onInfoClick}
            onTouchStart={onInfoClick}
          >
            <Info className="w-5.5 h-5.5 text-chw-primary" strokeWidth={2.8} />
          </div>
        </TooltipWrapper>
        <TooltipWrapper
          hoverTooltip={
            <Tooltip className="bg-zinc-500">{t("minimize_chat")}</Tooltip>
          }
        >
          <div
            className="rounded-full p-1 hover:bg-gray-100 cursor-pointer"
            onClick={onMinusClick}
            onTouchStart={onMinusClick}
          >
            <Minus className="w-5.5 h-5.5 text-chw-primary" strokeWidth={2.8} />
          </div>
        </TooltipWrapper>
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

export default memo(ChatHeader);
