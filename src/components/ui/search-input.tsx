import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/hooks/use-translations";

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function SearchInput({ className, ...props }: SearchInputProps) {
  const { t } = useTranslations();

  return (
    <search className="bg-gray-200 px-3 border-b border-gray-200 flex justify-center items-center rounded-2xl">
      <SearchIcon className="w-4 h-4" color="black" />
      <Input
        placeholder={t("search_placeholder")}
        className={cn(
          "bg-transparent color-black border-none focus:outline-none! focus:ring-0! placeholder:text-[14px]",
          className
        )}
        {...props}
      />
    </search>
  );
}
