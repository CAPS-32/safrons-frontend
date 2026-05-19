interface GlossaryCardProps {
  letter: string;
  title: string;
  description: string;
}

export default function GlossaryCard({ letter, title, description }: GlossaryCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline/40 rounded-3xl p-8 shadow-lg shadow-primary/5 hover:shadow-primary/15 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-surface rounded-bl-full -z-10 opacity-50"></div>
      
      <div className="flex items-center gap-5 mb-6">
        <div className="flex-shrink-0 w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center text-on-primary-container font-display font-bold text-2xl shadow-md shadow-primary-container/30">
          {letter}
        </div>
        <h3 className="font-display text-2xl font-bold text-on-surface">
          {title}
        </h3>
      </div>
      <p className="font-sans text-on-surface-variant leading-relaxed text-[15px]">
        {description}
      </p>
    </div>
  );
}
