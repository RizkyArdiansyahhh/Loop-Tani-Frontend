import ChatBubble from "./chat-bubble";
import TypingIndicator from "./typing-indicator";

const dummyMessages = [
  {
    role: "user" as const,
    content: "Harga sekam padi berapa?",
    timestamp: "10:30",
  },
  {
    role: "bot" as const,
    content:
      "Harga sekam padi bergantung pada lokasi dan penjual. Saat ini kisaran harga sekam padi berkisar antara Rp1.500 - Rp3.000 per kilogram. Saya dapat membantu menemukan produk yang sesuai dengan kebutuhan Anda.",
    timestamp: "10:30",
  },
  {
    role: "user" as const,
    content: "Apa manfaat biochar?",
    timestamp: "10:32",
  },
  {
    role: "bot" as const,
    content:
      "Biochar memiliki banyak manfaat untuk pertanian:\n\n• Meningkatkan kualitas tanah dan struktur tanah\n• Menjaga kelembapan tanah lebih lama\n• Meningkatkan produktivitas tanaman\n• Menyerap karbon dan mengurangi emisi gas rumah kaca\n• Menjadi media tanam yang baik untuk tanaman hortikultura",
    timestamp: "10:32",
  },
  {
    role: "user" as const,
    content: "Di mana saya bisa beli traktor second?",
    timestamp: "10:35",
  },
  {
    role: "bot" as const,
    content:
      "Anda bisa menemukan traktor second di marketplace LoopTani. Ada beberapa penjual terpercaya dari Riau dan Jawa Tengah dengan harga mulai dari Rp15.000.000. Mau saya carikan rekomendasi?",
    timestamp: "10:35",
  },
];

const LoopiMessageArea = () => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {dummyMessages.map((msg, i) => (
          <ChatBubble
            key={i}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}
        <TypingIndicator />
      </div>
    </div>
  );
};

export default LoopiMessageArea;
