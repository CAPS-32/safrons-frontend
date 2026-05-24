import GlossaryCard from '../components/GlossaryCard';
import glossaryImg from '../assets/images/glosarium.webp';

const glossaryData = [
  {
    letter: "F",
    title: "Fosfor",
    description: "Fosfor berperan penting dalam pertumbuhan tanaman, seperti pembentukan sel pada pertumbuhan jaringan akar dan tunas, memperkuat batang, mempercepat pembentukan bunga, serta memperkuat ketahanan tanaman terhadap serangan hama dan penyakit. Tanaman harus memiliki unsur P yang cukup agar pertumbuhannya optimal. Tanaman yang kekurangan unsur P (fosfor) akan mengalami pertumbuhan yang lambat, lemah dan kerdil, berwarna hijau gelap, proses pematangan buah dan biji lambat, serta jumlah buah yang dihasilkan sedikit."
  },
  {
    letter: "H",
    title: "Hara",
    description: "Hara merupakan zat yang dibutuhkan oleh organisme untuk dapat hidup, tumbuh, dan berkembang. Pada tanaman, ketersediaan unsur hara mempengaruhi pertumbuhan dan perkembangan tanaman. Kekurangan unsur hara dan ketidakseimbangan kandungan unsur hara dalam tanaman dapat menyebabkan pertumbuhan tanaman tidak optimal."
  },
  {
    letter: "K",
    title: "Kalium",
    description: "Unsur kalium diperlukan tanaman untuk mengatur keseimbangan garam, air, dan tekanan osmotik sel tanaman, meningkatkan ketahanan tanaman terhadap penyakit, merangsang perkembangan akar, serta memperkuat tanaman. Kekurangan unsur K akan menyebabkan terhambatnya proses fotosintesis dan meningkatkan respirasi, daun tua mengerut tidak merata, timbul bercak berwarna coklat, mengering lalu mati."
  },
  {
    letter: "N",
    title: "Nitrogen",
    description: "Nitrogen dibutuhkan tanaman untuk merangsang pertumbuhan, terutama pada batang dan daun. Nitrogen berperan dalam pertumbuhan hijau daun (klorofil), protein, lemak, dan senyawa organik lainnya. Tanaman yang kekurangan unsur N dapat terhambat pertumbuhannya, daunnya menjadi kuning, pertumbuhan lambat."
  },
  {
    letter: "P",
    title: "pH",
    description: "pH merupakan tingkat keasaman suatu zat. Pada tanaman, pH tanah mempengaruhi ketersediaan fosfor dalam tanah. pH tanah yang terlalu tinggi (basa) atau terlalu rendah (asam) menyebabkan unsur fosfor tidak dapat bekerja dengan baik dalam menutrisi tanah."
  }
];

export default function GlossaryPage() {
  return (
    <div className="w-full">
      {/* Header with Background Image */}
      <div className="relative w-full py-20 sm:py-28 overflow-hidden">
        <img 
          src={glossaryImg} 
          alt="Glosarium Latar Belakang" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1A2F16]/60"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-tertiary mb-6 tracking-tight">
            Glosarium Pertanian
          </h1>
          <p className="font-sans text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Kamus istilah pertanian untuk membantu Anda memahami unsur hara dan konsep penting dalam budidaya tanaman.
          </p>
          
          {/* Mock Search Bar */}
          <div className="max-w-xl mx-auto">
            <input 
              type="text" 
              placeholder="Cari istilah..." 
              className="w-full px-6 py-4 rounded-full bg-surface-container-lowest/95 backdrop-blur-sm border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary shadow-lg font-sans text-on-surface"
            />
          </div>
        </div>
      </div>
      
      {/* Glossary Content */}
      <div className="py-12 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {glossaryData.map((item, index) => (
              <GlossaryCard
                key={index}
                letter={item.letter}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
