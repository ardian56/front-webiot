import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');
  const [logHistory, setLogHistory] = useState([]);
  const [showLog, setShowLog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const fetchLogHistory = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/log-history`);
      setLogHistory(response.data);
    } catch (error) {
      console.error('Error fetching log history:', error);
      setMessage({ text: 'Gagal memuat riwayat log.', type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/save`, {
        tanggal,
        jam,
      });

      if (response.status === 200) {
        setMessage({ text: 'Data berhasil disimpan!', type: 'success' });
        setTanggal('');
        setJam('');
        fetchLogHistory();
      } else {
        setMessage({ text: 'Gagal menyimpan data.', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Gagal menyimpan data. Pastikan API berjalan.', type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const toggleLogView = () => {
    setShowLog(!showLog);
    if (!showLog) {
      fetchLogHistory();
    }
  };

  useEffect(() => {
    fetchLogHistory();
  }, []);

  return (
    <div className={`App`}>
      <header className="App-header">
        <h1>Input Jam & Tanggal</h1>
        <p>Input jam dan tanggal untuk mengendalikan IOT!</p>
        <div className="realtime-clock">
          <p>Waktu Saat Ini: {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="time">{currentTime.toLocaleTimeString('id-ID')}</p>
        </div>
      </header>

      {message.text && (
        <div className={`message-display ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="main-content-wrapper"> {/* Ini akan menjadi container untuk form dan log */}
        <div className="form-section">
          <h2>Input Data</h2> {/* Ubah judul di sini */}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="tanggal">Tanggal:</label>
              <input
                type="date"
                id="tanggal"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="jam">Jam:</label>
              <input
                type="time"
                id="jam"
                value={jam}
                onChange={(e) => setJam(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Submit Data'}
            </button>
          </form>
        </div>

        <div className="log-history-card"> {/* Ini adalah card terpisah untuk log */}
          <h2>Riwayat Log</h2> {/* Judul untuk card log */}
          <div className="log-button-container">
            <button className="log-button" onClick={toggleLogView}>
              {showLog ? 'Sembunyikan Log' : 'Tampilkan Log'}
            </button>
          </div>

          {showLog && (
            <div className="table-container">
              {logHistory.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Jam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logHistory.map((log, index) => (
                      <tr key={index}>
                        <td>{log.tanggal}</td>
                        <td>{log.jam}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="empty-log-message">Belum ada log yang tersimpan.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
