import { Shirt, Wallet } from "lucide-react";
import React from "react";

// Mapping ikon
const icons = {
  wallet: Wallet,
  fashion: Shirt,
};

type IconKey = keyof typeof icons;

// Type guard
const isValidIcon = (icon: string): icon is IconKey => {
  return icon in icons;
};

// Fallback component: harus punya tipe sama
const FallbackIcon: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> &
    React.RefAttributes<SVGSVGElement>
> = React.forwardRef((props, ref) => <svg ref={ref} {...props} />);

FallbackIcon.displayName = "FallbackIcon";

export const iconFn = (icon: string) => {
  const IconComponent = isValidIcon(icon) ? icons[icon] : FallbackIcon;

  const DynamicIcon: React.FC<React.ComponentProps<typeof IconComponent>> = (
    props
  ) => {
    return <IconComponent {...props} />;
  };

  return DynamicIcon;
};
