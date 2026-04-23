import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

/**
 * DynamicIcon component resolves a Lucide icon component from its string name.
 *
 * @param name The name of the icon (PascalCase, e.g., "Package", "Truck", "Activity")
 * @param props LucideProps like size, color, strokeWidth
 */
export const DynamicIcon = ({
    className,
  name,
  fallback = "Package",
  ...props
}: { name: string; fallback?: string } & LucideProps) => {
  // Get the icon component from the LucideIcons object
  const IconComponent =
    (LucideIcons as any)[name] ||
    (LucideIcons as any)[fallback] ||
    LucideIcons.Package;

  return <IconComponent className={className} {...props} />;
};
