"use client";

import { authAPI } from "@/src/utils/apis/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();

  const logout = async () => {
    try {
      await authAPI.logout();
      router.refresh();
      router.push("/login");
    } catch (err) {
      toast.error("Error logging out!");
    }
  };

  return (
    <nav
      className="relative flex w-full items-center justify-between bg-slate-900 px-4 py-3 text-slate-50 shadow-md md:px-8"
      aria-label="Main navigation"
    >
      <Link
        className="text-2xl font-bold tracking-tight text-white no-underline"
        href="/"
      >
        TeamPulse
      </Link>

      <details className="relative md:hidden">
        <summary
          className="flex h-11 w-11 cursor-pointer list-none flex-col items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-transparent p-2 [&::-webkit-details-marker]:hidden"
          aria-label="Toggle navigation menu"
        >
          <span className="block h-0.5 w-full rounded-full bg-white" />
          <span className="block h-0.5 w-full rounded-full bg-white" />
          <span className="block h-0.5 w-full rounded-full bg-white" />
        </summary>

        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 flex w-56 flex-col gap-3 rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-lg">
          <Link
            href="/members"
            className="text-base font-semibold text-slate-200 no-underline transition-colors hover:text-white"
          >
            Members
          </Link>

          {isLoggedIn && (
            <>
              <Link
                href="/actions"
                className="text-base font-semibold text-slate-200 no-underline transition-colors hover:text-white"
              >
                Actions
              </Link>

              <Link
                href="/updates"
                className="text-base font-semibold text-slate-200 no-underline transition-colors hover:text-white"
              >
                Updates
              </Link>

              <button
                onClick={logout}
                type="button"
                className="text-left text-base font-semibold text-slate-200 transition-colors hover:text-white"
              >
                Logout
              </button>
            </>
          )}

          {!isLoggedIn && (
            <Link
              href="/login"
              className="text-base font-semibold text-slate-200 no-underline transition-colors hover:text-white"
            >
              Login
            </Link>
          )}
        </div>
      </details>

      <div className="hidden items-center gap-6 md:flex">
        <Link
          href="/members"
          className="text-base font-semibold text-slate-200 no-underline transition-colors hover:text-white"
        >
          Members
        </Link>

        {isLoggedIn && (
          <>
            <Link
              href="/actions"
              className="text-base font-semibold text-slate-200 no-underline transition-colors hover:text-white"
            >
              Actions
            </Link>

            <Link
              href="/updates"
              className="text-base font-semibold text-slate-200 no-underline transition-colors hover:text-white"
            >
              Updates
            </Link>

            <button
              onClick={logout}
              type="submit"
              className="text-base font-semibold text-slate-200 transition-colors hover:text-white"
            >
              Logout
            </button>
          </>
        )}

        {!isLoggedIn && (
          <Link
            href="/login"
            className="text-base font-semibold text-slate-200 no-underline transition-colors hover:text-white"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
