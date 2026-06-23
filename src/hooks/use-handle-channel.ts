import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import { useImperativeGetChannel } from "@/hooks/use-channel";
import type { ChannelEntry, ChannelType } from "@/types";

type Options = {
  logger: (message: string, type: "error" | "warn" | "info" | "debug") => void;
};

const defaultOptions: Options = {
  logger: (message: string, type: "error" | "warn" | "info" | "debug") => {
    console[type](message);
  },
};

export function useHandleChannel(options?: Options) {
  const getChannel = useImperativeGetChannel();

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

  const handleSelection = useCallback((c: ChannelType | { url: string }) => {
    if (!c) return;

    const { url } = c;

    setChannels((prev) => {
      if (prev.get(url)) {
        const channel = prev.get(url);
        if (!channel?.minimized) {
          return prev;
        }
      }

      const channelsOpen = new Map(prev);
      channelsOpen.set(url, {
        url,
        key: `${url}-${Date.now()}`,
        minimized: false,
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
      try {
        const channel = await getChannel(url);
        if (!channel) {
          logger("Channel not found", "error");
          return;
        }
        handleSelection({ url } as { url: string });
      } catch (error) {
        logger(
          `Error opening chat or channel not found: ${JSON.stringify(error)}`,
          "error",
        );
      }
    },
    [handleSelection, getChannel],
  );

  const handleJoinChannel = useCallback(
    async (url: string, technician?: string) => {
      const logger = optionsRef.current?.logger;
      try {
        const channel = await getChannel(url);
        if (channel) {
          await channel.join();
          if (technician) {
            await channel.updateMetaData(
              {
                associatedTechnician: technician,
              },
              true,
            );
          }
          handleOpenChat(url);
        }
      } catch (error) {
        logger(`Error joining channel: ${JSON.stringify(error)}`, "error");
      }
    },
    [getChannel, handleOpenChat],
  );

  const handleFreezeChannel = useCallback(
    async (url: string) => {
      const logger = optionsRef.current?.logger;
      try {
        const channel = await getChannel(url);
        if (channel) {
          await channel.freeze();
          handleCloseChat(url);
        }
      } catch (error) {
        logger(`Error freezing channel: ${JSON.stringify(error)}`, "error");
      }
    },
    [getChannel, handleCloseChat],
  );

  const handleUnfreezeChannel = useCallback(
    async (url: string) => {
      const logger = optionsRef.current?.logger;
      try {
        const channel = await getChannel(url);
        if (channel) {
          await channel.unfreeze();
        }
      } catch (error) {
        logger(`Error unfreezing channel: ${JSON.stringify(error)}`, "error");
      }
    },
    [getChannel],
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
