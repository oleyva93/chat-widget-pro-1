import { useChatWidget } from "@/hooks/use-chat-widget";
import { translate, type TranslationKey } from "@/lib/translations";

export function useTranslations() {
  const { language } = useChatWidget();

  return {
    language,
    t: (key: TranslationKey) => translate(language, key),
  };
}
