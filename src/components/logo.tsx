'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

export const Logo = () => {
  const [iconPath, setIconPath] = useState('/icon-192.png');

  useEffect(() => {
    // Determine basePath from current URL for GitHub Pages support
    const path = window.location.pathname;
    // If we're on GitHub Pages (path starts with /focus), use that as basePath
    if (path.startsWith('/focus')) {
      setIconPath('/focus/icon-192.png');
    }
  }, []);

  return (
    <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
      <div className="w-8 h-8 flex items-center justify-center rounded-md overflow-hidden bg-card border border-primary/20 group-hover:border-primary/40 transition-colors">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconPath}
          alt="FocusFlow Logo"
          width={32}
          height={32}
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-xl font-bold tracking-tight">
        FocusFlow
      </h1>
    </Link>
  );
};
