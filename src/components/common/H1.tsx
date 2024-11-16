import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type H1Props = ComponentProps<"h1">;

export default function H1({ className, ...props }: H1Props) {
  const h1Style = "text-2xl font-bold text-neutral-900";
  return <h1 {...props} className={twMerge(h1Style, className)}></h1>;
}
