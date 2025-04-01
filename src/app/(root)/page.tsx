import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/images/landing/hero-banner.png"
          alt="Pokemon background"
          fill
          className="object-cover opacity-80"
          priority
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Bienvenue sur PokeTrade
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
          La plateforme ultime pour échanger vos Pokémon et enrichir votre collection
        </p>
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors">
            Commencer
          </button>
          <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
            En savoir plus
          </button>
        </div>
      </div>
    </div>
  );
}