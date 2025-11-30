// chatbot.js
import React, { useState } from "react";
import "./Chatbot.css";

function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Merhaba! Vergi iade formunu doldurmanda yardımcı olabilirim." }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const predefinedAnswers = {
    tarih: "Tarih alanını gg/aa/yyyy formatında doldurmalısın. Örn: 05/08/2025. Gün/ay/yıl şeklindedir.",
    nosu: "No'su alanına fişin veya faturanın numarasını yazmalısın. Boş bırakmamalısın.",
    kimden: "Kimden alındığı alanına alışveriş yaptığın kişi veya işletmenin adını yaz.",
    tutar: "Tutar alanına sadece pozitif sayılar ve ondalık kısımlar girebilirsin. Örn: 123.45",
    kaydet: "Kaydet butonuna bastığında, tüm girdilerin doğru ve eksiksiz olduğundan emin olmalısın. Hatalı alanlar kırmızıyla işaretlenir.",
    toplam: "Tablonun alt kısmında tüm tutarların toplamını görebilirsin. Otomatik hesaplanır.",
    merhaba: "Merhaba! Nasıl yardımcı olabilirim? Tarih, nosu, kimden ya da tutar ile ilgili sorular sorabilirsin.",
    selam: "Selam! Vergi iade formu hakkında soruların varsa buradayım.",
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { from: "user", text: userMessage }]);

    const lowerInput = userMessage.toLowerCase();

    // Default cevap
    let reply = "Üzgünüm, bunu anlayamadım. Lütfen tarih, nosu, kimden, tutar, kaydetme veya toplam ile ilgili sor.";

    for (const key in predefinedAnswers) {
      if (lowerInput.includes(key)) {
        reply = predefinedAnswers[key];
        break;
      }
    }

    // Bot cevabını 500ms gecikmeyle ekle
    setTimeout(() => {
      setMessages(prev => [...prev, { from: "bot", text: reply }]);
    }, 500);

    setInput("");
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.from}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Mesajınızı yazın..."
              onKeyDown={e => e.key === "Enter" && handleSend()}
              autoFocus
            />
            <button onClick={handleSend}>Gönder</button>
          </div>
        </div>
      )}

      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)} title="Sohbeti aç/kapat">
        💬
      </button>
    </div>
  );
}

export default Chatbot;
