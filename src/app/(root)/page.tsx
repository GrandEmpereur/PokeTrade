'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
} from 'framer-motion';
import {
  ChevronRight,
  BarChart2,
  Check,
  Star,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Gift,
  ArrowRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('trading');
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  const features = [
    {
      id: 'trading',
      title: 'Smart Trading',
      description:
        'AI-powered trading recommendations based on card rarity, condition, and market trends.',
      icon: <TrendingUp className="h-6 w-6" />,
      image: '/assets/images/landing/trading-feature.png',
    },
    {
      id: 'collection',
      title: 'Collection Management',
      description:
        'Organize, track, and showcase your Pokémon collection with detailed statistics and insights.',
      icon: <Shield className="h-6 w-6" />,
      image: '/assets/images/landing/collection-feature.png',
    },
    {
      id: 'marketplace',
      title: 'Global Marketplace',
      description:
        'Connect with collectors worldwide. Buy, sell, and trade with confidence using our secure platform.',
      icon: <Users className="h-6 w-6" />,
      image: '/assets/images/landing/marketplace-feature.png',
    },
  ];

  const testimonials = [
    {
      name: 'Ash K.',
      role: 'Pokémon Master',
      text: "PokéTrade revolutionized how I manage my collection. The AI recommendations helped me acquire rare cards I've been seeking for years!",
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      rating: 5,
    },
    {
      name: 'Misty W.',
      role: 'Water Type Specialist',
      text: "The security and ease of trading on this platform are unmatched. I've completed over 50 trades without a single issue.",
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      rating: 5,
    },
    {
      name: 'Brock S.',
      role: 'Collector & Gym Leader',
      text: "As someone who values collection organization, PokéTrade's management tools are exactly what I needed. The analytics are a game-changer.",
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4,
    },
  ];

  const pokemonFloating = [
    {
      id: 1,
      name: 'Pikachu',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      delay: 0,
    },
    {
      id: 2,
      name: 'Charizard',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
      delay: 1,
    },
    {
      id: 3,
      name: 'Bulbasaur',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      delay: 0.5,
    },
    {
      id: 4,
      name: 'Squirtle',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
      delay: 1.5,
    },
    {
      id: 5,
      name: 'Mewtwo',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
      delay: 2,
    },
    {
      id: 6,
      name: 'Jigglypuff',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png',
      delay: 0.7,
    },
    {
      id: 7,
      name: 'Gengar',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
      delay: 1.2,
    },
    {
      id: 8,
      name: 'Eevee',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
      delay: 1.8,
    },
    {
      id: 9,
      name: 'Snorlax',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png',
      delay: 2.2,
    },
    {
      id: 10,
      name: 'Dragonite',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png',
      delay: 2.5,
    },
    {
      id: 11,
      name: 'pied',
      image: '/assets/images/pokemon/pied.png',
      delay: 2.8,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-black to-indigo-950"
        >
          {/* Animated Pokemon background */}
          <div className="absolute inset-0 z-0">
            {pokemonFloating.map((pokemon) => (
              <motion.div
                key={pokemon.id}
                className="absolute"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.5, 0],
                  x: `calc(${Math.random() * 100}vw)`,
                  y: `calc(${Math.random() * 100}vh)`,
                }}
                transition={{
                  duration: 15,
                  delay: pokemon.delay,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <Image
                  src={pokemon.image}
                  alt={pokemon.name}
                  width={80}
                  height={80}
                  className="opacity-40"
                />
              </motion.div>
            ))}
          </div>

          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-indigo-900/20 to-black"></div>

          <motion.div
            style={{ opacity, y }}
            className="absolute top-5 right-5 z-10 flex items-center space-x-2 text-white/80"
          >
            <Badge variant="outline" className="text-xs border-white/20 px-2">
              BETA
            </Badge>
            <span className="text-sm">New features released</span>
          </motion.div>

          <div className="container mx-auto relative z-10 px-4 md:px-6 flex flex-col items-center justify-center min-h-screen pt-20 pb-32">
            <motion.div
              initial="hidden"
              animate={isHeroInView ? 'visible' : 'hidden'}
              variants={staggerContainer}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-4xl font-bold tracking-tight text-white sm:text-6xl xl:text-7xl/none mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-300"
              >
                The Ultimate Pokémon Trading Experience
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl/relaxed mb-8 text-indigo-100 max-w-2xl mx-auto"
              >
                Connect with traders worldwide, manage your collection with
                AI-powered insights, and discover rare Pokémon cards like never
                before.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="mb-6 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300"
              >
                <Badge variant="default" className="mr-2 bg-indigo-600">
                  New
                </Badge>
                <span>NFT Integration Released</span>
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white border-0 font-medium group"
                >
                  Start Trading Now
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </motion.span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-indigo-400/30 text-indigo-100 hover:bg-indigo-500/20"
                >
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Floating Platform Display */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-full max-w-6xl mx-auto relative"
            >
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
                className="relative w-full rounded-xl overflow-hidden shadow-[0_0_60px_-15px_rgba(139,92,246,0.5)] border border-indigo-500/30"
              >
                <Image
                  src="/assets/images/landing/dashboard.png"
                  alt="PokéTrade Dashboard Interface"
                  width={1440}
                  height={810}
                  className="object-cover w-full h-auto"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center">
                  <div className="text-white">
                    <p className="text-sm font-medium text-indigo-300">
                      TRADING PLATFORM
                    </p>
                    <h3 className="text-xl font-bold">
                      Real-time market insights at your fingertips
                    </h3>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                    Live Trading
                  </Badge>
                </div>
              </motion.div>

              {/* Animated Stats Overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-5 right-10 bg-black/80 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <BarChart2 className="h-5 w-5 text-indigo-400" />
                  <div>
                    <p className="text-xs text-indigo-300">Trading Volume</p>
                    <p className="text-white font-bold">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.5 }}
                      >
                        $1,234,567
                      </motion.span>
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -bottom-5 left-10 bg-black/80 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-indigo-400" />
                  <div>
                    <p className="text-xs text-indigo-300">Active Traders</p>
                    <p className="text-white font-bold">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.7 }}
                      >
                        45,892
                      </motion.span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10"></div>
        </section>

        {/* Features Section */}
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-background to-indigo-950/10">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true, margin: '-100px' }}
              className="text-center mb-16"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500"
              >
                Powerful Features for Collectors
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-muted-foreground max-w-2xl mx-auto text-lg"
              >
                Discover the tools that make PokéTrade the ultimate platform for
                Pokémon collectors and traders worldwide.
              </motion.p>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-8 items-center mb-16">
              <div className="lg:col-span-5">
                <div className="flex flex-col space-y-4">
                  {features.map((feature) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <button
                        onClick={() => setActiveTab(feature.id)}
                        className={`flex items-start p-4 rounded-lg text-left transition-all ${
                          activeTab === feature.id
                            ? 'bg-indigo-500/10 border border-indigo-500/20'
                            : 'hover:bg-indigo-500/5'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg mr-4 ${
                            activeTab === feature.id
                              ? 'bg-indigo-500 text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {feature.icon}
                        </div>
                        <div>
                          <h3
                            className={`text-xl font-semibold mb-1 ${
                              activeTab === feature.id ? 'text-indigo-500' : ''
                            }`}
                          >
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                className="lg:col-span-7 rounded-xl overflow-hidden shadow-[0_0_50px_-12px_rgba(107,70,193,0.2)]"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <div className="relative bg-gradient-to-br from-indigo-950 to-gray-900 rounded-xl aspect-[16/10] p-1">
                  <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] rounded-xl"></div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="relative rounded-lg overflow-hidden w-full h-full"
                    >
                      <Image
                        src={
                          features.find((f) => f.id === activeTab)?.image ||
                          features[0].image
                        }
                        alt={
                          features.find((f) => f.id === activeTab)?.title ||
                          'Feature'
                        }
                        fill
                        className="object-cover object-center rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge className="mb-2 bg-indigo-500/80 hover:bg-indigo-500/90 text-white border-0">
                          {features.find((f) => f.id === activeTab)?.title}
                        </Badge>
                        <p className="text-white text-sm">
                          Experience the future of Pokémon trading with our
                          advanced platform.
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-indigo-500/10 py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.5))]"></div>
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  value: '2.5M+',
                  label: 'Cards Traded',
                  icon: <ArrowRight className="h-5 w-5 text-indigo-400" />,
                },
                {
                  value: '150K+',
                  label: 'Active Users',
                  icon: <Users className="h-5 w-5 text-violet-400" />,
                },
                {
                  value: '99.9%',
                  label: 'Secure Trades',
                  icon: <Shield className="h-5 w-5 text-pink-400" />,
                },
                {
                  value: '24/7',
                  label: 'Support',
                  icon: <Zap className="h-5 w-5 text-orange-400" />,
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center space-y-2"
                >
                  <div className="bg-black/20 p-3 rounded-full">
                    {stat.icon}
                  </div>
                  <motion.h3
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold"
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gradient-to-b from-indigo-950/10 via-background to-background">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true, margin: '-100px' }}
              className="text-center mb-16"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-5xl font-bold mb-4"
              >
                Trusted by Collectors{' '}
                <span className="text-indigo-500">Worldwide</span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-muted-foreground max-w-2xl mx-auto text-lg"
              >
                Join thousands of satisfied users who have transformed their
                Pokémon collecting experience with our platform.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border border-indigo-500/10 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden relative">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex text-yellow-500 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/assets/images/pokemon/pattern.png')] bg-repeat opacity-10"></div>

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center text-white"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="mb-6 mx-auto w-24 h-24 rounded-full bg-white/10 flex items-center justify-center"
              >
                <Gift className="h-10 w-10 text-white" />
              </motion.div>

              <h2 className="text-4xl font-bold mb-4">
                Ready to Transform Your Collection?
              </h2>
              <p className="text-white/80 mb-8 text-lg">
                Join PokéTrade today and experience the future of Pokémon
                trading. Get started with our special launch offer.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-indigo-700 hover:bg-gray-100"
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/20"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Technologies Section - with improved design */}
        <section className="w-full py-24 bg-gradient-to-b from-background to-background">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl font-bold mb-4"
              >
                Built with Modern Technology
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-muted-foreground max-w-2xl mx-auto"
              >
                Our platform leverages cutting-edge technologies to deliver a
                seamless, secure, and feature-rich experience.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-8 items-center justify-items-center"
            >
              {[
                {
                  name: 'Next.js',
                  logo: '/assets/images/tech/nextjs.svg',
                },
                {
                  name: 'React',
                  logo: '/assets/images/tech/react.svg',
                },
                {
                  name: 'Tailwind CSS',
                  logo: '/assets/images/tech/tailwind.svg',
                },
                {
                  name: 'Prisma',
                  logo: '/assets/images/tech/prisma.svg',
                },
                {
                  name: 'Supabase',
                  logo: '/assets/images/tech/supabase.svg',
                },
                {
                  name: 'Framer Motion',
                  logo: '/assets/images/tech/framermotion.svg',
                },
                {
                  name: 'Shadcn UI',
                  logo: '/assets/images/tech/shadcnui.svg',
                },
                {
                  name: 'Cursor',
                  logo: '/assets/images/tech/cursor.svg',
                },
              ].map((tech, index) => (
                <motion.div
                  key={tech.name}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.5,
                        delay: index * 0.05,
                      },
                    },
                  }}
                  className="flex flex-col items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="h-16 w-16 md:h-20 md:w-20 relative mb-3">
                    <Image
                      src={tech.logo}
                      alt={`${tech.name} logo`}
                      className="object-contain invert brightness-0 filter"
                      fill
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{tech.name}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full p-4 h-14 w-14 flex items-center justify-center shadow-lg hover:shadow-xl">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="Pokeball"
              width={30}
              height={30}
            />
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
}
