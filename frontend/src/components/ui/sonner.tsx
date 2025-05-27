import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          // Use a solid background color (no transparency)
          "--normal-bg": "white",
          "--normal-text": "#b91c1c", // red-700 (tailwind red)
          "--normal-border": "#b91c1c", // match border color to red
          "--font-size": "1.125rem", // 18px font size for main text
          "--font-weight": "600", // semibold
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
