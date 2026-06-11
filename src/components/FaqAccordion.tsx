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
  // Helper to parse answer text into structured blocks (paragraphs, ordered lists, unordered lists)
  const parseAnswer = (text: string) => {
    const lines = text.split('\n');
    const blocks: Array<{
      type: 'p' | 'ul' | 'ol';
      items: string[];
    }> = [];

    let currentBlock: { type: 'p' | 'ul' | 'ol'; items: string[] } | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed === '') {
        if (currentBlock) {
          blocks.push(currentBlock);
          currentBlock = null;
        }
        continue;
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const content = trimmed.substring(2);
        if (currentBlock && currentBlock.type === 'ul') {
          currentBlock.items.push(content);
        } else {
          if (currentBlock) blocks.push(currentBlock);
          currentBlock = { type: 'ul', items: [content] };
        }
      } else {
        const matchNumber = trimmed.match(/^(\d+)\.\s(.*)/);
        if (matchNumber) {
          const content = matchNumber[2];
          if (currentBlock && currentBlock.type === 'ol') {
            currentBlock.items.push(content);
          } else {
            if (currentBlock) blocks.push(currentBlock);
            currentBlock = { type: 'ol', items: [content] };
          }
        } else {
          if (currentBlock && currentBlock.type === 'p') {
            currentBlock.items[0] += '\n' + line;
          } else {
            if (currentBlock) blocks.push(currentBlock);
            currentBlock = { type: 'p', items: [line] };
          }
        }
      }
    }

    if (currentBlock) {
      blocks.push(currentBlock);
    }

    return blocks;
  };

  // Helper to render text with bold markup (**text**) and clickable email addresses
  const renderFormattedText = (text: string) => {
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const parts = text.split(emailRegex);

    return parts.map((part, index) => {
      if (part.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        return (
          <a
            key={index}
            href={`mailto:${part}`}
            className="text-primary hover:underline font-semibold transition-all"
          >
            {part}
          </a>
        );
      }

      const boldRegex = /\*\*(.*?)\*\*/g;
      const subParts = part.split(boldRegex);
      if (subParts.length > 1) {
        return (
          <span key={index}>
            {subParts.map((subPart, subIndex) => {
              if (subIndex % 2 === 1) {
                return (
                  <strong key={subIndex} className="font-semibold text-on-surface">
                    {subPart}
                  </strong>
                );
              }
              return subPart;
            })}
          </span>
        );
      }

      return part;
    });
  };

  const blocks = parseAnswer(answer);

  return (
    <div className="border-b border-outline/30 last:border-0">
      <button
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className="font-display font-bold text-lg text-on-surface group-hover:text-primary-container transition-colors pr-8">
          {question}
        </span>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary-container' : 'bg-surface group-hover:bg-outline/50'}`}>
          <ChevronDownIcon
            className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180 text-on-primary-container' : 'text-on-surface'}`}
          />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[40rem] pb-8 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="font-sans text-on-surface-variant leading-relaxed pr-8 space-y-3 text-sm">
          {blocks.map((block, i) => {
            if (block.type === 'ul') {
              return (
                <ul key={i} className="list-disc ml-5 space-y-1">
                  {block.items.map((item, idx) => (
                    <li key={idx} className="pl-1">
                      {renderFormattedText(item)}
                    </li>
                  ))}
                </ul>
              );
            }
            if (block.type === 'ol') {
              return (
                <ol key={i} className="list-decimal ml-5 space-y-1">
                  {block.items.map((item, idx) => (
                    <li key={idx} className="pl-1">
                      {renderFormattedText(item)}
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={i} className="whitespace-pre-line">
                {renderFormattedText(block.items[0])}
              </p>
            );
          })}
        </div>
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
