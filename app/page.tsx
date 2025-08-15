import { Button } from "@/components/ui/button";
import x from "@/public/kanban-method-animate.svg";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative mt-10 flex w-full flex-col-reverse items-center justify-start md:mt-0 md:flex-row md:justify-center">
      <div className="flex w-full flex-col gap-4 text-center font-medium md:w-1/3 md:text-left">
        <h1 className="text-primary text-5xl font-bold lg:text-7xl">
          {/* Kanban title project */}
          Welcome to Kanban Board
        </h1>

        <p className="text-muted-foreground mt-1 text-sm leading-relaxed text-balance">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minima
          repellendus veniam perferendis nihil, fugit esse et ipsum repellat ut
          autem aliquam natus deleniti aliquid fuga, nobis provident, alias
          nulla assumenda?
        </p>
        <div className="flex w-full items-center justify-center gap-4 md:justify-start">
          <Button className="cursor-pointer" size="lg" asChild>
            <Link href="/sign-in">
              <span>Sign In</span>
            </Link>
          </Button>
          <Button
            variant="secondary"
            className="cursor-pointer"
            size="lg"
            asChild
          >
            <Link href="/sign-up">
              <span>Sign Up</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Image */}
      <div className="relative flex h-80 w-4/5 md:h-screen md:w-1/2">
        <Image
          src={x}
          alt="Scrum Board"
          fill
          className="mask-radial-[100%_80%] mask-radial-from-75% mask-radial-at-top md:mask-radial-[100%_70%] md:mask-radial-at-right"
        />
      </div>
    </div>
  );
}
