'use client';

import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, Wallet, Home, Bot, CheckCheckIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo } from "../logo";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white border p-3 sm:w-full font-semibold">
      <div className="flex items-center gap-4 font-semibold">
        {/* Logo */}
        <Logo size={150} />

        {/* Navigation Links */}
        <ul className="hidden sm:flex items-center gap-2 font-semibold">
          <li>
            <Link href="/funil">
              <Button variant="ghost" size="default" className="font-semibold hover:text-white transition">
                <Home className="w-4 h-4 font-semibold" />
                Dashboard
              </Button>
            </Link>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="default" className="font-semibold hover:text-white transition">
                  <Bot className="w-4 h-4 font-semibold" />
                  Bots <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-black shadow-md rounded-md">
                <Link href="/bots/configuracoes">
                  <DropdownMenuItem className="hover:bg-gray-100 transition cursor-pointer font-semibold">
                    Configurações de Bots
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <li>
            <Link href="/financeiro-geral">
              <Button variant="ghost" size="default" className="font-semibold hover:text-white transition">
                <Wallet className="w-4 h-4 font-semibold" />
                Financeiro Geral
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/auto-check">
              <Button variant="ghost" size="default" className="font-semibold hover:text-white transition">
                <CheckCheckIcon className="w-4 h-4 font-semibold" />
                Auto Checagem
              </Button>
            </Link>
          </li>
        </ul>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger>
            <Menu className="sm:hidden w-6 h-6 cursor-pointer" />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
