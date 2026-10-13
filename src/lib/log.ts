export type LogType = "error" | "warn" | "info" | "debug";

export type ChatLogger = (message: string, type: LogType) => void;

/**
 * Hosts (Connect and Internal) forward this callback to CloudWatch.
 * Only `type === "error"` lands on the error stream. Any other type,
 * including "info", goes to the default stream — same split as the old widget.
 */
export function emitLog(
  logger: ChatLogger | undefined,
  message: string,
  type: LogType = "info",
) {
  try {
    if (logger) {
      logger(message, type);
      return;
    }

    if (type === "error") console.error(message);
    else if (type === "warn") console.warn(message);
    else console.info(message);
  } catch (error) {
    console.error("Chat logger failed", error);
  }
}

/** Error.message is not enumerable, so JSON.stringify(error) is "{}". */
export function errorText(error: unknown) {
  if (error instanceof Error) return error.message || String(error);
  if (typeof error === "string") return error || "-";
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message) return message;
  }
  try {
    const serialized = JSON.stringify(error);
    return serialized && serialized !== "{}" ? serialized : "-";
  } catch {
    return "-";
  }
}
