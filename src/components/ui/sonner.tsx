"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
                "group toast w-[590px] min-h-20 px-6 py-5 rounded-xl border border-primary/30 bg-primary text-primary-foreground shadow-xl shadow-black/25 backdrop-blur-sm",
                title: "text-base font-semibold",
              description: "group-[.toast]:text-primary-foreground/85 text-xl",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
