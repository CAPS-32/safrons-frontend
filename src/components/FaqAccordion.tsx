import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

function FaqItem({ question, answer, isOpen, onClick }: FaqItemProps) {
  return (
    <div className="border-b border-outline/30 last:border-0">
      <button
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className="font-display font-bold text-lg text-on-surface group-hover:text-primary-container transition-colors pr-8">{question}</span>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary-container' : 'bg-surface group-hover:bg-outline/50'}`}>
          <ChevronDownIcon
            className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180 text-on-primary-container' : 'text-on-surface'}`}
          />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="font-sans text-on-surface-variant leading-relaxed pr-8">
          {answer}
        </p>
      </div>
    </div>
  );
}

const faqData = [
  {
    question: "Apa itu SAFRONS?",
    answer: "SAFRONS hadir sebagai solusi bagi petani untuk membantu menyelesaikan permasalahan kesesuaian lahan dengan menyajikan data unsur hara lahan dan rekomendasi pemupukan yang tepat sesuai dengan kandungan unsur hara lahan. Pada pengembangangan tahap pertama, aplikasi berfokus pada fitur penyediaan informasi kandungan unsur hara lahan, yaitu Natrium, Kalium, Fosfor, dan kadar pH lahan di lokasi tertentu di Jawa Barat."
  },
  {
    question: "Apa tujuan SAFRONS?",
    answer: "SAFRONS diharapkan dapat membantu petani dalam menentukan kesesuaian lahan untuk tanaman agar menghasilkan komoditas pertanian yang optimal."
  },
  {
    question: "Siapa saja yang terlibat dalam pengembangan aplikasi SAFRONS?",
    answer: "SAFRONS tersedia dalam bentuk website dan aplikasi mobile. SAFRONS dikembangkan oleh mahasiswa Ilmu Komputer IPB University, yang datanya dikumpulkan dan diolah oleh Departemen Manajemen Sumber Daya Lahan IPB University."
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {faqData.map((faq, index) => (
        <FaqItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}
