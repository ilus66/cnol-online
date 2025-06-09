import { useState } from 'react';

export default function ScanQRAdmin() {
  const [qrData, setQrData] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUser(null);
    try {
      const res = await fetch('/api/admin/scan-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    window.open('/api/admin/export-scan-csv', '_blank');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Scan QR Code – Admin</h1>
      <form onSubmit={handleScan} className="mb-4">
        <label className="block mb-2">Coller le contenu du QR code :</label>
        <input
          type="text"
          className="border p-2 w-full mb-2"
          value={qrData}
          onChange={e => setQrData(e.target.value)}
          placeholder="ID ou contenu QR code..."
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Recherche...' : 'Scanner'}
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {user && (
        <div className="border p-4 rounded bg-gray-50 mb-4">
          <div><b>Type :</b> {user.type}</div>
          <div><b>Nom :</b> {user.nom || user.name || '-'}</div>
          <div><b>Prénom :</b> {user.prenom || '-'}</div>
          <div><b>Email :</b> {user.email || '-'}</div>
        </div>
      )}
      <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded">
        Exporter les logs en CSV
      </button>
    </div>
  );
} 