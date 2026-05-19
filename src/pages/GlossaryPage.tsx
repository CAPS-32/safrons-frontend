import GlossaryCard from '../components/GlossaryCard';

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
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface mb-6 tracking-tight">
            Glosarium Pertanian
          </h1>
          <p className="font-sans text-lg text-on-surface-variant max-w-2xl mx-auto">
            Kamus istilah pertanian untuk membantu Anda memahami unsur hara dan konsep penting dalam budidaya tanaman.
          </p>
        </div>
        
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
  );
}
