import { useState } from 'react';
import Layout from '../components/Layout';

export default function Badge() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/badge/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Code invalide');
      }

      const data = await response.json();
      window.location.href = data.badgeUrl;
    } catch (error) {
      setError('Code invalide ou badge non trouvé');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Télécharger votre badge - CNOL 2025">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-center mb-6">
              Télécharger votre badge
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entrez votre code badge
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex: CNOL-123456"
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Vérification...' : 'Télécharger'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Vous avez reçu un code par email ?</p>
              <p>Entrez-le ci-dessus pour télécharger votre badge.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 