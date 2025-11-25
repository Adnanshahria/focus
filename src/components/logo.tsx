'use client';

import Link from "next/link";
import { Timer } from "lucide-react";

export const Logo = () => (
  <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
    <div className="w-8 h-8 flex items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
        <Timer className="w-5 h-5 text-primary" />
    </div>
    <h1 className="text-xl font-bold tracking-tight">
        FocusFlow
    </h1>
  </Link>
);
