'use client';

import Link from "next/link";
import Image from "next/image";

export const Logo = () => (
  <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
    <div className="w-8 h-8 flex items-center justify-center rounded-md overflow-hidden">
      <Image src="/logo.png" alt="FocusFlow" width={32} height={32} className="w-full h-full object-cover" />
    </div>
    <h1 className="text-xl font-bold tracking-tight">
      FocusFlow
    </h1>
  </Link>
);
