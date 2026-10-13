import { ReportCategory } from "@sendbird/chat";
import { MemberState } from "@sendbird/chat/groupChannel";
import type { GroupChannel } from "@sendbird/chat/groupChannel";
import { useSendbird } from "@sendbird/uikit-react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import { useImperativeGetChannel } from "@/hooks/use-channel";
import { errorText } from "@/lib/log";
import type { ChannelEntry, ChannelSelection } from "@/types";

type Options = {
  logger: (message: string, type: "error" | "warn" | "info" | "debug") => void;
};

const defaultOptions: Options = {
  logger: (message: string, type: "error" | "warn" | "info" | "debug") => {
    console[type](message);
  },
};

function isChannelMember(channel: GroupChannel, userId?: string) {
  if (channel.myMemberState === MemberState.JOINED) return true;
  if (!userId) return false;
  return channel.members?.some((member) => member.userId === userId) ?? false;
}

export function useHandleChannel(options?: Options) {
  const getChannel = useImperativeGetChannel();
  const {
    state: { stores, config },
  } = useSendbird();
  const sdk = stores?.sdkStore?.sdk;
  const userId = config?.userId;

  const optionsRef = useRef<Options>(options || defaultOptions);

  const [channels, setChannels] = useState<Map<string, ChannelEntry>>(
    new Map(),
  );

  const channelsArray = useMemo(
    () => Array.from(channels.values()),
    [channels],
  );

  const maximizedChannels = useMemo(() => {
    return channelsArray.filter((channel) => !channel.minimized);
  }, [channelsArray]);

  const minimizedChannels = useMemo(() => {
    return channelsArray.filter((channel) => channel.minimized);
  }, [channelsArray]);

  const handleSelection = useCallback((c: ChannelSelection) => {
    if (!c?.url) return;

    const { url } = c;
    const readOnly = "readOnly" in c ? Boolean(c.readOnly) : false;

    setChannels((prev) => {
      const existing = prev.get(url);
      if (
        existing &&
        !existing.minimized &&
        Boolean(existing.readOnly) === readOnly
      ) {
        return prev;
      }

      const channelsOpen = new Map(prev);
      channelsOpen.set(url, {
        url,
        key: existing?.key ?? `${url}-${Date.now()}`,
        minimized: false,
        readOnly,
      });

      return channelsOpen;
    });
  }, []);

  const handleCloseChat = useCallback((url: string) => {
    setChannels((prev) => {
      const newChannels = new Map(prev);
      newChannels.delete(url);
      return newChannels;
    });
  }, []);

  const handleMinimizeChat = useCallback((url: string) => {
    setChannels((prev) => {
      const newChannels = new Map(prev);
      const channel = newChannels.get(url);

      if (!channel) return prev;

      newChannels.set(url, { ...channel, minimized: !channel.minimized });
      return newChannels;
    });
  }, []);

  const handleCloseAllChats = useCallback(() => {
    setChannels(new Map());
  }, []);

  const handleOpenChat = useCallback(
    async (url: string) => {
      const logger = optionsRef.current?.logger;
      if (!sdk?.currentUser) {
        logger("User is not logged in to SendBird.", "error");
        return;
      }
      try {
        const channel = await getChannel(url);
        if (!channel) {
          logger(`Channel ${url} not found.`, "error");
          return;
        }
        handleSelection({
          url,
          readOnly: !isChannelMember(channel, userId),
        });
      } catch (error) {
        logger(
          `ERROR loading chats for user ${userId || "-"}. Exception=${errorText(error)}`,
          "error",
        );
      }
    },
    [handleSelection, getChannel, sdk, userId],
  );

  const handleJoinChannel = useCallback(
    async (url: string, technician?: string) => {
      const logger = optionsRef.current?.logger;
      const logInfo = {
        user_email: userId,
        channel_url: url,
        error: null as string | null,
      };
      if (!sdk?.currentUser) {
        logger("User is not logged in to SendBird.", "error");
        return;
      }
      try {
        const channel = await getChannel(url);
        if (!channel) {
          logger(`Channel ${url} not found.`, "error");
          return;
        }
        if (!isChannelMember(channel, userId)) {
          await channel.join();
          logger(`_joinTheChannel ~ \n${JSON.stringify(logInfo)}`, "info");
        }
        if (technician) {
          try {
            await channel.updateMetaData(
              { associatedTechnician: technician },
              true,
            );
          } catch (error) {
            logger(
              `Add metadata to channel ${url} failed. ERROR: ${errorText(error)}`,
              "error",
            );
          }
        }
        handleOpenChat(url);
      } catch (error) {
        logger(
          `_joinTheChannel ~ \n${JSON.stringify({ ...logInfo, error: errorText(error) })}`,
          "error",
        );
      }
    },
    [getChannel, handleOpenChat, sdk, userId],
  );

  const handleFreezeChannel = useCallback(
    async (url: string) => {
      const logger = optionsRef.current?.logger;
      if (!sdk?.currentUser) {
        logger("User is not logged in to SendBird.", "error");
        return;
      }
      try {
        const channel = await getChannel(url);
        if (!channel) {
          logger(`Channel ${url} not found.`, "error");
          return;
        }
        await channel.freeze();
        try {
          await channel.report(ReportCategory.SPAM, "closed request");
        } catch (error) {
          logger(`freezeChannel ~ report ~ \n${errorText(error)}`, "error");
        }
        handleCloseChat(url);
      } catch (error) {
        logger(`freezeChannel ~ \n${errorText(error)}`, "error");
      }
    },
    [getChannel, handleCloseChat, sdk],
  );

  const handleUnfreezeChannel = useCallback(
    async (url: string) => {
      const logger = optionsRef.current?.logger;
      if (!sdk?.currentUser) {
        logger("User is not logged in to SendBird.", "error");
        return;
      }
      try {
        const channel = await getChannel(url);
        if (!channel) {
          logger(`Channel ${url} not found.`, "error");
          return;
        }
        await channel.unfreeze();
      } catch (error) {
        logger(`freezeChannel ~ \n${errorText(error)}`, "error");
      }
    },
    [getChannel, sdk],
  );

  useLayoutEffect(() => {
    optionsRef.current = options || defaultOptions;
  });

  return {
    channels,
    maximizedChannels,
    minimizedChannels,
    handleSelection,
    handleCloseChat,
    handleMinimizeChat,
    handleCloseAllChats,
    handleOpenChat,
    handleJoinChannel,
    handleFreezeChannel,
    handleUnfreezeChannel,
  };
}
