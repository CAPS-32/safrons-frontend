import FaqAccordion from '../components/FaqAccordion';
import aboutImg from '../assets/images/tentang.webp';
import { ABOUT_DATA } from '../constants/about';

interface TeamMember {
  name: string;
  nim: string;
  github: string;
  githubUrl: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Husni Abdillah",
    nim: "G6401231097",
    github: "@HusniAbdillah",
    githubUrl: "https://github.com/HusniAbdillah"
  },
  {
    name: "Insan Anshary Rasul",
    nim: "G6401231132",
    github: "@insanansharyrasul",
    githubUrl: "https://github.com/insanansharyrasul"
  },
  {
    name: "Muhammad Allif Qalbiy",
    nim: "G6401231084",
    github: "@ji4xuu",
    githubUrl: "https://github.com/ji4xuu"
  },
  {
    name: "Rafif Muhammad Farras",
    nim: "G6401231102",
    github: "@Raphcel",
    githubUrl: "https://github.com/Raphcel"
  }
];

export default function AboutPage() {
  return (
    <div className="w-full bg-surface-bright min-h-screen">
      {/* Header Image banner */}
      <div className="relative w-full h-56 sm:h-64 overflow-hidden">
        <img 
          src={aboutImg} 
          alt="Tentang SAFRONS" 
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-bright via-surface-bright/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-end pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            {ABOUT_DATA.title}
          </h1>
        </div>
      </div>

      <div className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Deskripsi Sistem */}
          <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/60 shadow-sm">
            <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed">
              {ABOUT_DATA.description}
            </p>
          </section>

          {/* Tim CAPS-32 */}
          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-on-surface">
              Tim Pengembang (CAPS-32)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEAM_MEMBERS.map((member) => (
                <div 
                  key={member.nim} 
                  className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/40 flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-display text-sm font-bold text-on-surface">
                      {member.name}
                    </span>
                    <span className="text-[11px] text-on-surface-variant/80 font-mono">
                      NIM. {member.nim}
                    </span>
                  </div>
                  <a 
                    href={member.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-semibold font-sans"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                    {member.github}
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Accordion */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-outline-variant/50">
            <h2 className="font-display text-xl font-bold text-on-surface mb-6">
              Pertanyaan yang Sering Diajukan
            </h2>
            <FaqAccordion />
          </section>

        </div>
      </div>
    </div>
  );
}
