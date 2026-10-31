import { Link } from "react-router-dom";
import { ArrowRight, FolderGit2, MessageSquareCode, Sparkles } from "lucide-react";

import { DevPilotIcon } from "@/components/icons/devpilot-icon";
import { BrandMark } from "@/components/layout/app-shell";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { getGithubLoginUrl } from "@/lib/api";

export default function HomePage() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(from_var(--primary)_l_c_h/0.12),transparent_55%)]" />
      <header className="relative z-10 mx-auto flex h-14 w-full max-w-5xl shrink-0 items-center justify-between gap-3 px-4">
        <BrandMark />
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link
            to="/login"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-12 sm:gap-16 md:py-20">
        <section className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl shadow-sm">
            <DevPilotIcon className="size-14 rounded-2xl" />
          </div>
          <div className="space-y-3">
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              DevPilot
            </h1>
            <p className="text-base text-muted-foreground text-balance sm:text-lg">
              Connect GitHub, index any repository, and chat with your codebase
              using retrieval-augmented answers and citations.
            </p>
          </div>
          <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
            <a
              href={getGithubLoginUrl()}
              className={cn(
                buttonVariants({ size: "lg" }),
                "inline-flex items-center justify-center gap-1.5"
              )}
            >
              <FolderGit2 className="size-4" />
              Continue with GitHub
              <ArrowRight className="size-4" />
            </a>
            <Link
              to="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "justify-center"
              )}
            >
              See how it works
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              title: "Connect GitHub",
              body: "OAuth with repo scope for public and private repositories.",
              icon: FolderGit2,
            },
            {
              title: "Index with RAG",
              body: "Chunk and embed your code into Postgres + pgvector.",
              icon: Sparkles,
            },
            {
              title: "Ask anything",
              body: "Get grounded answers with clickable source citations.",
              icon: MessageSquareCode,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col rounded-2xl border bg-card/80 p-5 shadow-xs backdrop-blur"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-muted">
                <item.icon className="size-5 text-foreground" />
              </div>
              <h2 className="font-heading text-base font-medium">
                {item.title}
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
