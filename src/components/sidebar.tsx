"use client";

import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";

import { cn } from "@/lib/utils";
import {
  Biohazard,
  BookUser,
  Calculator,
  CopyCheck,
  LayoutDashboard,
  Paperclip,
  Settings,
  ShoppingBag,
} from "lucide-react";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Doses",
    icon: Biohazard,
    href: "/doses",
    color: "text-violet-500",
  },
  {
    label: "Calculadoras",
    icon: Calculator,
    href: "/calculadoras",
    color: "text-yellow-500",
  },
  {
    label: "Resumos",
    icon: Paperclip,
    href: "/materiais",
    color: "text-emerald-500",
  },
  {
    label: "Indicações de produtos",
    icon: ShoppingBag,
    href: "/shopping",
    color: "text-pink-700",
  },
  {
    label: "Faça flashcards",
    icon: CopyCheck,
    href: "/flashcards",
    color: "text-orange-300",
  },
  {
    label: "Passômetro virtual",
    icon: BookUser,
    href: "/passometro",
    color: "text-white-300",
  },
  {
    label: "Suporte",
    icon: Settings,
    href: "/suporte",
    color: "text-gray-500",
  },
];

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-10 h-10 mr-4">
            <Image fill alt="Logo" src="/logo-white.png" />
          </div>
          <h1 className={(cn("text-2xl font-bold"), montserrat.className)}>
            EliHelp
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
