"use client";

import Link from "next/link";

export default function LinkWithLoader({ href, children, className, ...props }) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('startLoading'));
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
