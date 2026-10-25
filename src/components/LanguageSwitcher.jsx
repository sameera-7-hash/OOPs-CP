import React from "react";
import { Check, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LANGUAGES, setLanguage } from "@/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Language menu for the top bar and the public nav. Each language is
// listed in its own script so a reader can find theirs without knowing
// the current UI language. The choice is saved like the theme is.
function LanguageSwitcher({ className }) {
  const { t, i18n } = useTranslation();
  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("gap-1.5 px-2", className)}
          aria-label={t("Language: {{language}}", { language: current.label })}
        >
          <Languages aria-hidden="true" className="size-5!" />
          <span className="text-sm font-semibold">{current.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-44">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            lang={lang.code}
            onSelect={() => setLanguage(lang.code)}
            className="flex items-center justify-between"
          >
            {lang.label}
            {lang.code === current.code && <Check aria-hidden="true" className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
