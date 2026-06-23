import type { GroupChannel } from "@sendbird/chat/groupChannel";
import type React from "react";

// Base configuration for SendBird
export interface SendBirdConfig {
  appId: string;
  userId: string;
}

// Widget configuration
export interface ChatWidgetProps {
  key?: string;
}
export interface ChatWidgetConfig extends SendBirdConfig {
  withSound?: boolean;
  withNotification?: boolean;
  nickname?: string;
  profileUrl?: string;
  logger?: (message: string, type: "error" | "warn" | "info" | "debug") => void;
}

// Individual component props
export interface ChatIconProps {
  unreadCount?: number;
  onClick?: () => void;
  showBadge?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export type ChannelType = GroupChannel | null;

export interface ChatListProps {
  config: SendBirdConfig;
  onChannelSelect?: (channel: ChannelType) => void;
  className?: string;
}

export interface ChannelListProps {
  onChannelSelect?: (channel: ChannelType) => void;
  className?: string;
  onClose?: () => void;
}

export interface ChatListItemProps {
  channel: GroupChannel;
  className?: string;
}

export interface ChatListHeaderProps {
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose?: () => void;
  className?: string;
  searchValue?: string;
}

export interface ChatWindowProps {
  channelUrl?: string;
  index: number;
  onCloseChat?: () => void;
  onMinimizeChat?: () => void;
  minimized?: boolean;
}

export interface ChannelEntry {
  url: string;
  minimized?: boolean;
  key: string;
}

export interface ChatWidgetContextType {
  channels: ChannelEntry[];
  maximizedChannels: ChannelEntry[];
  minimizedChannels: ChannelEntry[];
  handleSelection: (channel: ChannelType) => void;
  handleCloseChat: (url: string) => void;
  handleMinimizeChat: (url: string) => void;
  handleCloseAllChats: () => void;
  handleOpenChat: (url: string) => void;
  state: {
    withSound: boolean;
    withNotification: boolean;
  };
  handleToggleSound: () => void;
  handleToggleNotification: () => void;
  logger: (message: string, type: "error" | "warn" | "info" | "debug") => void;
  handleJoinChannel: (url: string, technician?: string) => void;
  handleFreezeChannel: (url: string) => void;
  handleUnfreezeChannel: (url: string) => void;
  handleDisconnect: () => void;
  handleConnect: () => void;
}

// Provider props
export interface ChatWidgetProviderProps {
  children: React.ReactNode;
  config: ChatWidgetConfig;
}

export interface ChatSize {
  width: number;
  height: number;
}

export const ChannelStatus = {
  COMPLETED: "completed",
  PENDING: "pending",
  ACTIVE: "active",
} as const;

export const DEFAULT_CHAT_SIZE = {
  width: 400,
  height: 550,
  gap: 20,
  minWidth: 350,
  maxWidth: 850,
  minHeight: 300,
  maxHeight: 800,
} as const;

export interface ProfileImageProps {
  profileUrl: string;
  nickname: string;
  height?: number;
  width?: number;
  fontSize?: number;
}

export type ChannelData = {
  wo?: string;
  vin?: string;
  ro?: string;
  creatorId?: string;
};

export interface FaviconUpdaterProps {
  faviconAppUrl: string;
  faviconUnreadAppUrl: string;
  faviconId?: string;
}

export interface ChatHistoryProps {
  externalHistoryUrl: string;
  externalToken: string | (() => string);
}

export type ChatHistoryParams = {
  woID: string;
  vin: string;
  name: string;
};

export type ChatHistoryHandle = {
  open: (params?: ChatHistoryParams) => void;
  close: () => void;
};

export type ChatHistoryMessage = {
  message_id: number;
  type: "MESG" | "ADMM";
  custom_type: string;
  channel_url: string;
  user: {
    user_id: string;
    nickname: string;
    profile_url: string;
  };
  mention_type: string;
  mentioned_users: string[];
  message: string;
  created_at: string;
  createdAt: string;
  updated_at: string;
  root_message_id: string | null;
  parent_message_id: string | null;
  parent_message_text: string;
  translations: Record<string, string>;
  data: string;
  metadata: Record<string, unknown>;
  full_json: Record<string, unknown>;
  is_op_msg: boolean;
  is_removed: boolean;
  message_events: Record<string, unknown>;
  message_retention_hour: number;
  message_survival_seconds: number;
  channel_type: "group" | "open";
};
