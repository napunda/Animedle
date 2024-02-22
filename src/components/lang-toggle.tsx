import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function LangToggle() {
  const { i18n } = useTranslation();
  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    const resourceLanguages = Object.keys(i18n.options.resources ?? {});
    setLanguages(resourceLanguages);
    document.documentElement.lang = i18n.language;
  }, [i18n.language, i18n.options.resources]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem scale-100]" />
          <span className="sr-only">Toggle lang</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => i18n.changeLanguage(lang)}
          >
            {lang}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
