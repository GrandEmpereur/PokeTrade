'use client';

import { BarChart2 } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full flex justify-center p-4">
      <div
        className={`w-1/2 rounded-full bg-black/50 backdrop-blur-md border-b border-neutral-800 transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-3'
        }`}
      >
        <div className="flex h-10 items-center justify-between px-6 mx-auto">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-emerald-500" />
            <span className="text-lg font-bold text-white">PokéTrade</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#documentation"
              className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Documentation
            </Link>
            <Link
              href="#resources"
              className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Resources
            </Link>
            <Link
              href="#preview"
              className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Request Preview
            </Link>
            <Link
              href="#careers"
              className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Careers
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-white transition-colors hover:text-gray-300"
            >
              Login
            </Link>
            <Link href="/register">
              <Button className="bg-white text-black hover:bg-gray-200 h-8 px-3 py-1 text-xs rounded-full">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
