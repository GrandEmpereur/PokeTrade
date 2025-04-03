'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, BarChart2, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex flex-col items-center justify-center">
        <section className="relative flex items-center justify-center w-full h-screen bg-black overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-40">
            <Image
              src="/assets/images/landing/hero-banner.png"
              alt="PokéTrade Dashboard"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center">
            <div className="max-w-3xl mx-auto text-center mt-16">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-4xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none mb-4"
              >
                The trading platform for Pokémon collectors
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-xl/relaxed mb-8 text-gray-300"
              >
                Meet the next generation of Pokémon trading. AI-native,
                beautiful out-of-the-box, and built for collectors.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 group"
                >
                  Get started
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-black"
                >
                  Get a demo
                </Button>
              </motion.div>
            </div>

            {/* Dashboard Image */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bottom-0 w-full max-w-5xl mx-auto"
            >
              <div className="relative w-full shadow-2xl rounded-t-lg overflow-hidden border border-neutral-800">
                <Image
                  src="/assets/images/landing/dashboard.png"
                  alt="PokéTrade Dashboard Interface"
                  width={1440}
                  height={810}
                  className="object-contain w-full h-auto"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="w-full py-20 ">
          <div className="container px-4 md:px-6 mx-auto flex flex-col items-center gap-y-5">
            <div className="text-center mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-lg mb-4"
              >
                Powered by Modern Technologies
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-sm text-muted max-w-2xl mx-auto"
              >
                Built with the latest tools and frameworks to deliver a
                seamless, performant, and secure trading experience for Pokémon
                collectors.
              </motion.p>
            </div>

            <div className=" flex flex-wrap gap-4 items-center justify-center">
              {[
                {
                  name: 'Next.js',
                  logo: '/assets/images/tech/nextjs.svg',
                  description: 'React framework for production',
                },
                {
                  name: 'Cursor',
                  logo: '/assets/images/tech/cursor.svg',
                  description: 'AI-powered coding assistant',
                },
                {
                  name: 'Supabase',
                  logo: '/assets/images/tech/supabase.svg',
                  description: 'Open source Firebase alternative',
                },
                {
                  name: 'Prisma',
                  logo: '/assets/images/tech/prisma.svg',
                  description: 'Next-generation ORM',
                },
                {
                  name: 'Tailwind CSS',
                  logo: '/assets/images/tech/tailwind.svg',
                  description: 'Utility-first CSS framework',
                },
                {
                  name: 'React',
                  logo: '/assets/images/tech/react.svg',
                  description: 'JavaScript library for user interfaces',
                },
                {
                  name: 'Framer Motion',
                  logo: '/assets/images/tech/framer-motion.svg',
                  description: 'Production-ready motion library',
                },
                {
                  name: 'Shadcn UI',
                  logo: '/assets/images/tech/shadcn.svg',
                  description: 'Beautifully designed components',
                },
              ].map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center"
                >
                  <div className="h-20 w-20 relative mb-4 text-white">
                    <Image
                      src={tech.logo}
                      alt={`${tech.name} logo`}
                      fill
                      className="object-contain text-white"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="#">
              <Button>Our Customers</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
