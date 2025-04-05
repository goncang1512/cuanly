import {
  Shirt,
  Wallet,
  ChartLine,
  PiggyBank,
  Ambulance,
  GraduationCap,
  MonitorSmartphone,
  HeartHandshake,
  TicketsPlane,
  House,
  Car,
  Gem,
  Clapperboard,
  CircleDollarSign,
  BanknoteArrowUp,
  Gift,
  History,
} from "lucide-react";
import React from "react";

// Array of icons with key
export const icons = [
  { key: "wallet", icon: Wallet, color: "#F5F5DC" },
  { key: "fashion", icon: Shirt, color: "#FFE4E1" },
  { key: "savings", icon: PiggyBank, color: "#E6F0D8" },
  { key: "emergency", icon: Ambulance, color: "#FDE2E4" },
  { key: "education", icon: GraduationCap, color: "#E3F2FD" },
  { key: "vacation", icon: TicketsPlane, color: "#FFF3CD" },
  { key: "home", icon: House, color: "#F0EAD6" },
  { key: "vehicle", icon: Car, color: "#E0F7FA" },
  { key: "wedding", icon: Gem, color: "#FCE4EC" },
  { key: "gadget", icon: MonitorSmartphone, color: "#ECEFF1" },
  { key: "entertaiment", icon: Clapperboard, color: "#F3E5F5" },
  { key: "charity", icon: HeartHandshake, color: "#E8F5E9" },
  { key: "in-wages", icon: BanknoteArrowUp, color: "#DFF5E1" },
  { key: "in-invest", icon: ChartLine, color: "#DFF5E1" },
  { key: "in-part time", icon: History, color: "#DFF5E1" },
  { key: "in-award", icon: Gift, color: "#DFF5E1" },
  { key: "in-other", icon: CircleDollarSign, color: "#DFF5E1" },
] as const;

type IconEntry = (typeof icons)[number];
type IconKey = IconEntry["key"];

// Convert array to Record with reduce (typed properly)
const iconsMap: Record<IconKey, IconEntry["icon"]> = icons.reduce(
  (acc, { key, icon }) => {
    acc[key] = icon;
    return acc;
  },
  {} as Record<IconKey, IconEntry["icon"]>
);

// Type guard
const isValidIcon = (icon: string): icon is IconKey => {
  return icon in iconsMap;
};

// Fallback component
const FallbackIcon: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> &
    React.RefAttributes<SVGSVGElement>
> = React.forwardRef((props, ref) => <svg ref={ref} {...props} />);

FallbackIcon.displayName = "FallbackIcon";

// Main function
export const iconFn = (icon: string) => {
  const iconData = icons.find((entry) => entry.key === icon);
  const IconComponent = isValidIcon(icon) ? iconsMap[icon] : FallbackIcon;

  const DynamicIcon: React.FC<React.ComponentProps<typeof IconComponent>> = (
    props
  ) => {
    return <IconComponent {...props} />;
  };

  return { Icon: DynamicIcon, iconData: iconData };
};
