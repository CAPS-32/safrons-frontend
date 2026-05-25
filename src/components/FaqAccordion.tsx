import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { FAQ_DATA } from '../constants/faq';

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



export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {FAQ_DATA.map((faq, index) => (
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
