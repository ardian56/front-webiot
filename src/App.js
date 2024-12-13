import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');
  const [logHistory, setLogHistory] = useState([]);
  const [showLog, setShowLog] = useState(false);

  const fetchLogHistory = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/log-history`);
      if (response.ok) {
        const data = await response.json();
        setLogHistory(data);
      } else {
        console.error('Failed to fetch log history');
      }
    } catch (error) {
      console.error('Error fetching log history:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tanggal, jam }),
      });

      if (response.ok) {
        alert('Data berhasil disimpan!');
        fetchLogHistory();
      } else {
        alert('Gagal menyimpan data.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menyimpan data.');
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

      <h2>Masukkan Tanggal dan Jam</h2>
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="tanggal">Tanggal:</label>
        <input
          type="date"
          id="tanggal"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          required
        />
        
        <label htmlFor="jam">Jam:</label>
        <input
          type="time"
          id="jam"
          value={jam}
          onChange={(e) => setJam(e.target.value)}
          required
        />
        
        <input type="submit" value="Submit" />
      </form>

      <div className="log-button-container">
        <button className="log-button" onClick={toggleLogView}>
          {showLog ? 'Sembunyikan Log' : 'Tampilkan Log'}
        </button>
      </div>

      {showLog && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tanggal</th>
                <th>Jam</th>
              </tr>
            </thead>
            <tbody>
              {logHistory.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.tanggal}</td>
                  <td>{log.jam}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
