import FaqAccordion from '../components/FaqAccordion';
import aboutImg from '../assets/images/tentang.webp';
import { ABOUT_DATA } from '../constants/about';

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Header Image */}
      <div className="relative w-full h-64 sm:h-72">
        <img 
          src={aboutImg} 
          alt="Tentang SAFRONS" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90"></div>
      </div>

      <div className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-24 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface mb-8 tracking-tight">
              {ABOUT_DATA.title}
            </h1>
            <p className="font-sans text-lg sm:text-xl text-on-surface-variant leading-relaxed max-w-3xl mx-auto bg-surface-container-lowest p-8 rounded-3xl border border-outline/30 shadow-sm shadow-primary/5">
              {ABOUT_DATA.description}
            </p>
          </section>
          
          <section className="bg-surface-container-lowest rounded-3xl p-8 sm:p-14 shadow-xl shadow-primary/5 border border-outline/20">
            <h2 className="font-display text-3xl font-bold text-on-surface mb-10 text-center">
              Pertanyaan yang Sering Diajukan
            </h2>
            <FaqAccordion />
          </section>
        </div>
      </div>
    </div>
  );
}
