import React, { useState } from 'react';
import './App.css';
import Chatbot from './Chatbot';
function App() {
  const [data, setData] = useState(
    Array.from({ length: 86 }, (_, i) => ({
      id: i + 1,
      tarih: '',
      nosu: '',
      kimden: '',
      tutar: '',
    }))
  );

  const [errors, setErrors] = useState({});

  const handleInputChange = (e, id, field) => {
    let { value } = e.target;

    if (field === 'tarih') {
      // Sadece rakamları al, sonra otomatik / ekle
      value = value.replace(/[^0-9]/g, '');

      if (value.length > 2 && value[2] !== '/') {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
      if (value.length > 5 && value[5] !== '/') {
        value = value.slice(0, 5) + '/' + value.slice(5);
      }
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
    }

    setData(prevData =>
      prevData.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );

    // Hata varsa ve kullanıcı değişiklik yaptıysa hata kaldır
    setErrors(prevErrors => {
      if (prevErrors[id]?.[field]) {
        const newErrors = { ...prevErrors };
        delete newErrors[id][field];
        if (Object.keys(newErrors[id]).length === 0) {
          delete newErrors[id];
        }
        return newErrors;
      }
      return prevErrors;
    });
  };

  const calculateTotal = (field) => {
    return data.reduce((total, row) => {
      const value = parseFloat(row[field]);
      return total + (isNaN(value) ? 0 : value);
    }, 0).toFixed(2);
  };

  const totalTutariTL = calculateTotal('tutar');

  const rowsLeft = Array.from({ length: 43 }, (_, i) => i + 1);
  const rowsRight = Array.from({ length: 43 }, (_, i) => i + 44);

 

const validateData = () => {
  const newErrors = {};
  data.forEach(row => {
    // Satır tamamen boşsa hata yok, atla
    const isEmptyRow = 
      !row.tarih.trim() && !row.nosu.trim() && !row.kimden.trim() && !row.tutar.toString().trim();
    if (isEmptyRow) return;

    const rowErrors = {};

    if (!row.tarih || !/^\d{2}\/\d{2}\/\d{4}$/.test(row.tarih)) {
      rowErrors.tarih = true;
    }

    if (!row.nosu || row.nosu.trim() === '') {
      rowErrors.nosu = true;
    }

    if (!row.kimden || row.kimden.trim() === '') {
      rowErrors.kimden = true;
    }

    const tutarFloat = parseFloat(row.tutar);
    if (isNaN(tutarFloat) || tutarFloat <= 0) {
      rowErrors.tutar = true;
    }

    if (Object.keys(rowErrors).length > 0) {
      newErrors[row.id] = rowErrors;
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const saveData = async () => {
  if (!validateData()) {
    alert('Lütfen tüm alanları doğru şekilde doldurun.\n(Tarih: gg/aa/yyyy, tutar pozitif sayı, boş alan yok)');
    return;
  }

  // Geçerli veriler: sadece dolu satırları backend'e gönderelim
  const filteredData = data.filter(row => {
    const isEmptyRow = 
      !row.tarih.trim() && !row.nosu.trim() && !row.kimden.trim() && !row.tutar.toString().trim();
    return !isEmptyRow;
  });

  try {
    const response = await fetch('http://localhost:3000/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filteredData),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Veriler başarıyla kaydedildi!');
      console.log('Sunucu yanıtı:', result);
    } else {
      alert('Kaydetme işlemi başarısız oldu. Sunucu hatası.');
      console.error('Sunucu hatası:', result);
    }
  } catch (error) {
    alert('Kaydetme işlemi başarısız oldu. Bağlantı hatası. Backend sunucusu çalışıyor mu?');
    console.error('Bağlantı hatası:', error);
  }
};




  return (
    <div className="form-container">
      <div className="header">
        KEMAL KIRTASİYE ZARF SAN. A.Ş. TEL : (0212) 614 33 95 (Pbx)
      </div>

      <div className="table-header-group">
        <div className="table-header vergi-sol">
          VERGİ İADESİNE ESAS BELGENİN
        </div>
        <div className="table-header vergi-sag">
          VERGİ İADESİNE ESAS BELGENİN
        </div>
      </div>

      <div className="table-row table-labels">
        <div className="table-cell s-no">S.</div>
        <div className="table-cell tarih">Tarih</div>
        <div className="table-cell nosu">No'su</div>
        <div className="table-cell kimden">Kimden Alındığı</div>
        <div className="table-cell tutar">Tutarı TL</div>
        <div className="table-cell s-no">S.</div>
        <div className="table-cell tarih">Tarih</div>
        <div className="table-cell nosu">No'su</div>
        <div className="table-cell kimden">Kimden Alındığı</div>
        <div className="table-cell tutar">Tutarı TL</div>
      </div>

      <div className="table-body">
        {rowsLeft.map((num, index) => (
          <div className="table-row" key={num}>
            <div className="table-cell s-no">{num}</div>
            <div className="table-cell tarih">
              <input 
                type="text" 
                value={data[index].tarih}
                onChange={(e) => handleInputChange(e, data[index].id, 'tarih')}
                style={errors[data[index].id]?.tarih ? { border: '2px solid red' } : {}}
                placeholder="gg/aa/yyyy"
                maxLength={10}
              />
            </div>
            <div className="table-cell nosu">
              <input 
                type="text" 
                value={data[index].nosu} 
                onChange={(e) => handleInputChange(e, data[index].id, 'nosu')}
                style={errors[data[index].id]?.nosu ? { border: '2px solid red' } : {}}
              />
            </div>
            <div className="table-cell kimden">
              <input 
                type="text" 
                value={data[index].kimden} 
                onChange={(e) => handleInputChange(e, data[index].id, 'kimden')}
                style={errors[data[index].id]?.kimden ? { border: '2px solid red' } : {}}
              />
            </div>
            <div className="table-cell tutar">
              <input 
                type="number" 
                step="0.01" 
                value={data[index].tutar} 
                onChange={(e) => handleInputChange(e, data[index].id, 'tutar')}
                style={errors[data[index].id]?.tutar ? { border: '2px solid red' } : {}}
                min="0"
              />
            </div>

            <div className="table-cell s-no">{rowsRight[index]}</div>
            <div className="table-cell tarih">
              <input 
                type="text" 
                value={data[index + 43].tarih}
                onChange={(e) => handleInputChange(e, data[index + 43].id, 'tarih')}
                style={errors[data[index + 43].id]?.tarih ? { border: '2px solid red' } : {}}
                placeholder="gg/aa/yyyy"
                maxLength={10}
              />
            </div>
            <div className="table-cell nosu">
              <input 
                type="text" 
                value={data[index + 43].nosu} 
                onChange={(e) => handleInputChange(e, data[index + 43].id, 'nosu')}
                style={errors[data[index + 43].id]?.nosu ? { border: '2px solid red' } : {}}
              />
            </div>
            <div className="table-cell kimden">
              <input 
                type="text" 
                value={data[index + 43].kimden} 
                onChange={(e) => handleInputChange(e, data[index + 43].id, 'kimden')}
                style={errors[data[index + 43].id]?.kimden ? { border: '2px solid red' } : {}}
              />
            </div>
            <div className="table-cell tutar">
              <input 
                type="number" 
                step="0.01" 
                value={data[index + 43].tutar} 
                onChange={(e) => handleInputChange(e, data[index + 43].id, 'tutar')}
                style={errors[data[index + 43].id]?.tutar ? { border: '2px solid red' } : {}}
                min="0"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="table-footer">
        <div className="table-cell toplam">TOPLAM</div>
        <div className="table-cell">{totalTutariTL}</div> 
        <div className="table-cell toplam">TOPLAM</div>
        <div className="table-cell">{totalTutariTL}</div>
      </div>

      <div className="button-container">
        <button onClick={saveData} className="save-button">Kaydet</button>
      </div>
       {/* ✅ Chatbot burada, sağ alt köşede sabit */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
