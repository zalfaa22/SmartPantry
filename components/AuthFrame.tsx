
"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type AuthFrameProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AuthFrame({
  title,
  subtitle,
  children,
}: AuthFrameProps) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <Link href="/" className="text-2xl font-bold text-green-700">
          SmartPantry
        </Link>

        <h1 className="mt-8 text-2xl font-bold text-gray-900">
          {title}
        </h1>

        <p className="mt-2 text-sm text-gray-500">{subtitle}</p>

        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}
