import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function HeroBanner() {
    return (
        <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-900 group">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: 'url(https://placehold.co/1920x1080/1a1a1a/FFF?text=Premium+Collection)' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center">
                <div className="max-w-2xl space-y-6 animate-fade-in-up">
                    <span className="inline-block px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                        New Season Arrivals
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                        Redefining <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                            Modern Fashion
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-lg">
                        Discover our curated collection of premium essentials, designed for the contemporary lifestyle. Elevate your wardrobe today.
                    </p>

                    <div className="flex flex-wrap gap-3 md:gap-4 pt-4">
                        <Link
                            href="/categories"
                            className="px-6 py-3 md:px-8 md:py-4 bg-primary text-white text-sm md:text-base font-bold rounded-xl shadow-lg hover:bg-primary-dark hover:shadow-primary/50 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
                        >
                            Shop Collection <FiArrowRight />
                        </Link>
                        <Link
                            href="/about"
                            className="px-6 py-3 md:px-8 md:py-4 bg-white/10 text-white text-sm md:text-base font-bold rounded-xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent"></div>
        </div>
    );
}
