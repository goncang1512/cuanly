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
  ChartNoAxesCombined,
  ArrowRightLeft,
  Bolt,
  UtensilsCrossed,
} from "lucide-react";
import React from "react";

// Array of icons with key
export const icons = [
  { key: "wallet", icon: Wallet, color: "#F5F5DC" },
  { key: "savings", icon: PiggyBank, color: "#E6F0D8" },
  { key: "out-fashion", icon: Shirt, color: "#FECACA" },
  { key: "out-emergency", icon: Ambulance, color: "#FECACA" },
  { key: "out-education", icon: GraduationCap, color: "#FECACA" },
  { key: "out-vacation", icon: TicketsPlane, color: "#FECACA" },
  { key: "out-home", icon: House, color: "#FECACA" },
  { key: "out-vehicle", icon: Car, color: "#FECACA" },
  { key: "out-wedding", icon: Gem, color: "#FECACA" },
  { key: "out-gadget", icon: MonitorSmartphone, color: "#FECACA" },
  { key: "out-entertaiment", icon: Clapperboard, color: "#FECACA" },
  { key: "out-charity", icon: HeartHandshake, color: "#FECACA" },
  { key: "out-investasi", icon: ChartNoAxesCombined, color: "#FECACA" },
  { key: "out-food", icon: UtensilsCrossed, color: "#FECACA" },
  { key: "in-wages", icon: BanknoteArrowUp, color: "#DFF5E1" },
  { key: "in-investasi", icon: ChartLine, color: "#DFF5E1" },
  { key: "in-part time", icon: History, color: "#DFF5E1" },
  { key: "in-award", icon: Gift, color: "#DFF5E1" },
  { key: "in-other", icon: CircleDollarSign, color: "#DFF5E1" },
  { key: "switch-money", icon: ArrowRightLeft, color: "#E6F0D8" },
  { key: "adjest-balance", icon: Bolt, color: "#F5F5DC" },
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
