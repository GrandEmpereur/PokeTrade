import { BarChart2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:flex-row lg:gap-12">
        <div className="flex flex-col gap-4 lg:w-1/3">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">PokéTrade</span>
          </div>
          <p className="text-sm">
            The most advanced trading platform for Pokémon collectors and
            traders. Track, analyze, and trade with confidence.
          </p>
          <div className="flex gap-4">
            {['Twitter', 'GitHub', 'Discord', 'LinkedIn'].map((social) => (
              <Link key={social} href="#" className="transition-colors">
                {social}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            {
              title: 'Product',
              links: ['Features', 'Pricing', 'API', 'Integrations'],
            },
            {
              title: 'Resources',
              links: ['Documentation', 'Guides', 'Support', 'Community'],
            },
            {
              title: 'Company',
              links: ['About', 'Careers', 'Contact', 'Partners'],
            },
            {
              title: 'Legal',
              links: ['Privacy', 'Terms', 'Cookies', 'Licenses'],
            },
          ].map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">{section.title}</h3>
              <ul className="flex flex-col gap-2 text-sm">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:px-6 lg:flex-row">
          <p className="text-center text-sm lg:text-left">
            © 2025 PokéTrade. All rights reserved.
          </p>
          <p className="text-center text-sm lg:text-left">
            Pokémon and Pokémon character names are trademarks of Nintendo. This
            site is not affiliated with Nintendo.
          </p>
        </div>
      </div>
    </footer>
  );
}
