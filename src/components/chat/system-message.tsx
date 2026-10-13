import { formatDate } from "@/lib/date";
import { useTranslations } from "@/hooks/use-translations";
import ProfileImage from "@/components/ui/profile-image";

export function SystemMessageRow({
  text,
  createdAt,
}: {
  text: string;
  createdAt?: string | number;
}) {
  const { t } = useTranslations();
  const label = t("system_message_sender");
  const time =
    createdAt !== undefined && createdAt !== ""
      ? formatDate(new Date(createdAt), "time")
      : "";

  return (
    <div className="flex items-end gap-2 px-3 py-2">
      <ProfileImage
        profileUrl=""
        nickname={label}
        initials="SM"
        width={35}
        height={35}
        fontSize={12}
      />
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-xs font-bold text-gray-500" title={label}>
          {label}
        </span>
        <div className="max-w-[285px] rounded-2xl bg-chw-secondary p-3">
          <span className="text-sm text-black whitespace-pre-wrap">{text}</span>
        </div>
      </div>
      {time ? (
        <span className="mb-1 text-xs text-gray-500">{time}</span>
      ) : null}
    </div>
  );
}
