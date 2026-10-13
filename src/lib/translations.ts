import type { ChatLanguage } from "@/types";

const translations = {
  en: {
    pending_content:
      "Waiting for the asTech technician to join.\nWe will be with you momentarily.",
    waiting_assigned_technician: "Waiting for the assigned technician to join.",
    join_channel: "Join Channel",
    loading_chats: "Loading chats...",
    chats: "Chats",
    search_placeholder: "Search by RO#, YMM or VIN",
    system_message_sender: "System Message",
    USER_JOIN: "has joined the chat",
    USER_LEAVE: "has left the chat",
    automatic_event_message: "Automatic event message",
    file_size_too_large: "The file size is too large and cannot be uploaded",
    file_type_not_allowed: "Only image files are allowed",
    copy_messages_tooltip: "Copy all messages to clipboard",
    all_messages_copied: "All messages copied",
    close_chat: "Close chat",
    minimize_chat: "Minimize chat",
    info: "Info",
    close_all_chats: "Close all chats",
    no_messages_yet: "No messages yet.",
    input_placeholder: "Type here",
    input_placeholder_disabled: "Chat is unavailable",
    input_placeholder_frozen: "This chat is closed",
    request_completed: "The request has been completed",
    btn_close_chat: "Close Chat",
    leave_channel_title: "Leave channel?",
    leave_channel_confirm: "Are you sure you want to leave the channel?",
    cancel: "Cancel",
    copy: "Copy",
    reply: "Reply",
    reconnecting: "Reconnecting",
    channel_frozen: "Chat closed",
    read_only_unavailable: "This chat could not be opened.",
  },
  es: {
    pending_content:
      "Esperando a que el técnico de asTech se una.\nEstaremos contigo en un momento.",
    waiting_assigned_technician:
      "Esperando a que el técnico asignado se una.",
    join_channel: "Unirse al canal",
    loading_chats: "Cargando chats...",
    chats: "Chats",
    search_placeholder: "Buscar por RO#, YMM o VIN",
    system_message_sender: "System Message",
    USER_JOIN: "has joined the chat",
    USER_LEAVE: "has left the chat",
    automatic_event_message: "Mensaje de evento automático",
    file_size_too_large: "El archivo es demasiado grande y no se puede subir",
    file_type_not_allowed: "Solo se permiten archivos de imagen",
    copy_messages_tooltip: "Copiar todos los mensajes",
    all_messages_copied: "Mensajes copiados",
    close_chat: "Cerrar chat",
    minimize_chat: "Minimizar chat",
    info: "Info",
    close_all_chats: "Cerrar todos los chats",
    no_messages_yet: "Aún no hay mensajes.",
    input_placeholder: "Escribe aquí",
    input_placeholder_disabled: "El chat no está disponible",
    input_placeholder_frozen: "Este chat está cerrado",
    request_completed: "La solicitud se ha completado",
    btn_close_chat: "Cerrar chat",
    leave_channel_title: "¿Salir del canal?",
    leave_channel_confirm: "¿Seguro que quieres salir del canal?",
    cancel: "Cancelar",
    copy: "Copiar",
    reply: "Responder",
    reconnecting: "Reconectando",
    channel_frozen: "Chat cerrado",
    read_only_unavailable: "No se pudo abrir este chat.",
  },
  fr: {
    pending_content:
      "En attente de l'arrivée du technicien asTech.\nNous serons avec vous dans un instant.",
    waiting_assigned_technician:
      "En attente de l'arrivée du technicien assigné.",
    join_channel: "Rejoindre le canal",
    loading_chats: "Chargement des discussions...",
    chats: "Discussions",
    search_placeholder: "Rechercher par RO#, YMM ou VIN",
    system_message_sender: "System Message",
    USER_JOIN: "has joined the chat",
    USER_LEAVE: "has left the chat",
    automatic_event_message: "Message d'événement automatique",
    file_size_too_large:
      "Le fichier est trop volumineux et ne peut pas être envoyé",
    file_type_not_allowed: "Seules les images sont autorisées",
    copy_messages_tooltip: "Copier tous les messages",
    all_messages_copied: "Messages copiés",
    close_chat: "Fermer la discussion",
    minimize_chat: "Réduire la discussion",
    info: "Info",
    close_all_chats: "Fermer toutes les discussions",
    no_messages_yet: "Pas encore de messages.",
    input_placeholder: "Écrivez ici",
    input_placeholder_disabled: "La discussion n'est pas disponible",
    input_placeholder_frozen: "Cette discussion est fermée",
    request_completed: "La demande est terminée",
    btn_close_chat: "Fermer",
    leave_channel_title: "Quitter le canal ?",
    leave_channel_confirm: "Voulez-vous vraiment quitter le canal ?",
    cancel: "Annuler",
    copy: "Copier",
    reply: "Répondre",
    reconnecting: "Reconnexion",
    channel_frozen: "Discussion fermée",
    read_only_unavailable: "Impossible d'ouvrir cette discussion.",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

export function normalizeLanguage(language?: string): ChatLanguage {
  const raw = (
    language ||
    (typeof navigator !== "undefined" ? navigator.language : "en") ||
    "en"
  )
    .split("-")[0]
    .toLowerCase();

  if (raw === "es" || raw === "fr") return raw;
  return "en";
}

export function translate(language: ChatLanguage, key: TranslationKey) {
  return translations[language][key] ?? translations.en[key];
}

export function getUikitStringSet(language: ChatLanguage) {
  const t = (key: TranslationKey) => translate(language, key);

  return {
    MESSAGE_INPUT__PLACE_HOLDER: t("input_placeholder"),
    MESSAGE_INPUT__PLACE_HOLDER__DISABLED: t("input_placeholder_disabled"),
    MESSAGE_INPUT__PLACE_HOLDER__FROZEN: t("input_placeholder_frozen"),
    MESSAGE_MENU__COPY: t("copy"),
    MESSAGE_MENU__REPLY: t("reply"),
    CONTEXT_MENU_DROPDOWN__COPY: t("copy"),
    CHANNEL_SETTING__LEAVE_CHANNEL__TITLE: t("leave_channel_title"),
    MODAL__LEAVE_CHANNEL__TITLE: t("leave_channel_confirm"),
    MODAL__LEAVE_CHANNEL__FOOTER: t("leave_channel_title"),
    BUTTON__CANCEL: t("cancel"),
    TRYING_TO_CONNECT: t("reconnecting"),
    CHANNEL_FROZEN: t("channel_frozen"),
  };
}

export function isAdminMessage(message?: {
  messageType?: string;
  type?: string;
} | null) {
  if (!message) return false;
  return message.messageType === "admin" || message.type === "ADMM";
}
