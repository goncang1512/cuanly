"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Plus, Minus, Edit, Trash, Settings } from "lucide-react"; // tambahkan icon sesuai kebutuhan

const iconMap = {
  Plus,
  Minus,
  Edit,
  Trash,
  Settings,
};

interface TopBarProps {
  title: string;
  iconName: keyof typeof iconMap;
  value?: boolean;
  setOnClick?: Dispatch<SetStateAction<boolean | undefined>>;
}

export default function TopBar({
  title,
  iconName,
  setOnClick,
  value,
}: TopBarProps) {
  const Icon = iconMap[iconName];
  const [barScroll, setBarScroll] = useState(false);
  const [sizeIcon, setSizeIcon] = useState({
    icon: 28,
    font: 20,
    opacity: 100,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 56) {
        setBarScroll(true);
      } else {
        const reduction = Math.floor(scrollY / 7);
        const fontReduction = Math.floor(scrollY / 7);
        const maxScroll = 50;

        const newIconSize = Math.max(23, 28 - reduction);
        const newFontSize = Math.max(16, 20 - fontReduction);
        const calculatedOpacity = Math.min(1, scrollY / maxScroll);

        setSizeIcon({
          icon: newIconSize,
          font: newFontSize,
          opacity: calculatedOpacity,
        });
        setBarScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [barScroll]);

  return (
    <div
      style={{
        backgroundColor: `rgba(255, 255, 255, ${sizeIcon.opacity})`,
      }}
      className={`${
        barScroll ? "border-b shadow-xs" : ""
      }  h-14 fixed top-0 w-full z-50 left-0 flex justify-center duration-200`}
    >
      <div className="md:w-3xl w-full flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <h1
            className="font-semibold duration-200"
            style={{ fontSize: !barScroll ? `${sizeIcon.font}px` : "16px" }}
          >
            {title}
          </h1>
        </div>

        <div className="flex gap-2">
          {Icon && (
            <Icon
              onClick={() => {
                if (setOnClick) {
                  setOnClick(value);
                }
              }}
              size={!barScroll ? sizeIcon.icon : 23}
              className="duration-200"
            />
          )}
        </div>
      </div>
    </div>
  );
}
