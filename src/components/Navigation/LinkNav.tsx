import Link from "next/link";

const LinkNav = ({
  children,
  href,
  icon,
  inHref,
}: {
  children: React.ReactNode;
  href: string;
  icon: React.ReactNode;
  inHref: boolean;
}) => {
  return (
    <Link
      href={href}
      className="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 group"
    >
      <span
        className={`${
          inHref ? "text-emerald" : "text-gray-500 dark:text-gray-400"
        } w-5 h-5 mb-2  group-hover:text-emerald text-center `}
      >
        {icon}
      </span>
      <span
        className={`${
          inHref ? "text-emerald" : "text-gray-500 dark:text-gray-400"
        } text-sm  group-hover:text-emerald text-center `}
      >
        {children}
      </span>
    </Link>
  );
};

export default LinkNav;
