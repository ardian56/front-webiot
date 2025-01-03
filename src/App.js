import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');
  const [logHistory, setLogHistory] = useState([]);
  const [showLog, setShowLog] = useState(false);

  const fetchLogHistory = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/log-history`);
      setLogHistory(response.data);
    } catch (error) {
      console.error('Error fetching log history:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/save`, {
        tanggal,
        jam,
      });

      if (response.status === 200) {
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
                <th>Tanggal</th>
                <th>Jam</th>
              </tr>
            </thead>
            <tbody>
              {logHistory.map((log) => (
                <tr key={log.id}>
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
