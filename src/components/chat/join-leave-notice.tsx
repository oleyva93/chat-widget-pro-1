import {
  joinLeaveUserName,
  type JoinLeaveEvent,
} from "@/lib/admin-message";
import { useTranslations } from "@/hooks/use-translations";

/** Centered divider used by the old widget for USER_JOIN / USER_LEAVE. */
export function JoinLeaveNotice({ event }: { event: JoinLeaveEvent }) {
  const { t } = useTranslations();

  if (!event.users.length) return null;

  return (
    <>
      {event.users.map((user, index) => {
        const name = joinLeaveUserName(user);
        return (
          <div
            key={user.user_id || `${name}-${index}`}
            className="my-4 flex items-center justify-between gap-[5px]"
          >
            <span className="h-px flex-1 bg-[rgba(190,194,204,0.8)]" />
            <p className="max-w-[70%] text-center text-xs leading-normal text-[#6d7881]">
              {name} {t(event.type)}
            </p>
            <span className="h-px flex-1 bg-[rgba(190,194,204,0.8)]" />
          </div>
        );
      })}
    </>
  );
}
