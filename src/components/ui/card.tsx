import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
  {
    variants: {
      type: {
        grass: "bg-green-100 text-green-800",
        poison: "bg-purple-100 text-purple-800",
        fire: "bg-red-100 text-red-800",
        water: "bg-blue-100 text-blue-800",
        bug: "bg-lime-100 text-lime-800",
        normal: "bg-gray-200 text-gray-800",
        electric: "bg-yellow-100 text-yellow-800",
        fairy: "bg-pink-100 text-pink-800",
        ground: "bg-amber-100 text-amber-800",
        rock: "bg-stone-100 text-stone-800",
        ghost: "bg-indigo-100 text-indigo-800",
        psychic: "bg-pink-200 text-pink-900",
        fighting: "bg-orange-100 text-orange-800",
        dragon: "bg-teal-100 text-teal-800",
        dark: "bg-zinc-100 text-zinc-800",
        steel: "bg-slate-100 text-slate-800",
        ice: "bg-cyan-100 text-cyan-800",
        flying: "bg-sky-100 text-sky-800",

        default: "bg-card text-card-foreground",
      },
    },
    defaultVariants: {
      type: "default",
    },
  }
);

export interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

function Card({ className, type, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ type }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
