'use client';

import Link from "next/link";
import Image from "next/image";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const Logo = () => (
  <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
    <div className="w-8 h-8 flex items-center justify-center rounded-md overflow-hidden bg-card border border-primary/20 group-hover:border-primary/40 transition-colors">
      <Image
        src={`${basePath}/icon-192.png`}
        alt="FocusFlow Logo"
        width={32}
        height={32}
        className="w-full h-full object-cover"
        priority
      />
    </div>
    <h1 className="text-xl font-bold tracking-tight">
      FocusFlow
    </h1>
  </Link>
);
