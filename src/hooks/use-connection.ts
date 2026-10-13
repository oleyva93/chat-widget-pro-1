import { useSendbird } from "@sendbird/uikit-react";
import { useCallback, useEffect, useRef } from "react";

import { emitLog, errorText } from "@/lib/log";
import { normalizeLanguage } from "@/lib/translations";
import type { ChatWidgetConfig } from "@/types";
import type SendbirdChat from "@sendbird/chat";

export function useConnection(config: ChatWidgetConfig) {
  const {
    state: { stores },
  } = useSendbird();
  const sdk = stores?.sdkStore.sdk as SendbirdChat;
  const appliedProfile = useRef("");

  const handleDisconnect = useCallback(() => {
    sdk?.disconnect().catch((error: unknown) => {
      emitLog(
        config.logger,
        `disconnectWidgetchat ~ \n${errorText(error)}`,
        "error",
      );
    });
  }, [sdk, config.logger]);

  const handleConnect = useCallback(() => {
    sdk?.connect(config.userId);
  }, [sdk, config.userId]);

  useEffect(() => {
    if (!sdk?.currentUser || Object.keys(sdk).length === 0) return;

    const language = normalizeLanguage(config.language);
    const signature = [
      config.userId,
      config.nickname,
      config.profileUrl,
      language,
    ].join("|");

    if (appliedProfile.current === signature) return;
    appliedProfile.current = signature;

    sdk
      .updateCurrentUserInfo({
        nickname: config.nickname || config.userId,
        profileUrl: config.profileUrl || undefined,
      })
      .catch((error: unknown) => {
        emitLog(
          config.logger,
          `_updateCurrentUserInfo ~ \n${errorText(error)}`,
          "error",
        );
      });

    const preferred = sdk.currentUser.preferredLanguages ?? [];
    if (preferred.includes(language)) return;

    sdk
      .updateCurrentUserInfoWithPreferredLanguages(
        Array.from(new Set(["en", language])),
      )
      .catch((error: unknown) => {
        emitLog(
          config.logger,
          `_updateCurrentUserPreferredLanguage ~ \n${errorText(error)}`,
          "error",
        );
      });
  }, [
    sdk,
    sdk?.currentUser,
    config.userId,
    config.nickname,
    config.profileUrl,
    config.language,
    config.logger,
  ]);

  return {
    handleDisconnect,
    handleConnect,
  };
}
