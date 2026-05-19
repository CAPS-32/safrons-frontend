import FaqAccordion from '../components/FaqAccordion';

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-24 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface mb-8 tracking-tight">
            Apa itu SAFRONS?
          </h1>
          <p className="font-sans text-lg sm:text-xl text-on-surface-variant leading-relaxed max-w-3xl mx-auto bg-surface/50 p-8 rounded-3xl border border-outline/30">
            Smart Agriculture and Fertilizer Recommendation System (SAFRONS) adalah platform khusus yang dikembangkan oleh mahasiswa IPB University untuk mempermudah petani dalam mengetahui informasi kandungan unsur hara lahan dan rekomendasi pemupukan yang tepat agar dapat menghasilkan komoditas tanaman pertanian yang optimal.
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
  );
}
