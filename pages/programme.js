import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Programme() {
  const [ateliers, setAteliers] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'atelier', 'masterclass'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAteliers();
  }, []);

  const fetchAteliers = async () => {
    try {
      const response = await fetch('/api/ateliers');
      if (!response.ok) throw new Error('Erreur lors du chargement des ateliers');
      const data = await response.json();
      setAteliers(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAteliers = ateliers.filter(atelier => {
    if (filter === 'all') return true;
    return atelier.type === filter;
  });

  return (
    <Layout title="Programme - CNOL 2025">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Programme CNOL 2025</h1>

        {/* Filtres */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Tout
          </button>
          <button
            onClick={() => setFilter('atelier')}
            className={`px-6 py-2 rounded-lg ${
              filter === 'atelier' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Ateliers
          </button>
          <button
            onClick={() => setFilter('masterclass')}
            className={`px-6 py-2 rounded-lg ${
              filter === 'masterclass' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Masterclasses
          </button>
        </div>

        {loading ? (
          <div className="text-center">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAteliers.map((atelier) => (
              <div
                key={atelier.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">{atelier.titre}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      atelier.type === 'atelier' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {atelier.type === 'atelier' ? 'Atelier' : 'Masterclass'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Intervenant:</strong> {atelier.intervenant}</p>
                    <p><strong>Date:</strong> {new Date(atelier.date).toLocaleDateString()}</p>
                    <p><strong>Horaire:</strong> {atelier.heure}</p>
                    <p><strong>Salle:</strong> {atelier.salle}</p>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-700">{atelier.description}</p>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => window.location.href = `/atelier/${atelier.id}`}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredAteliers.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            Aucun événement trouvé pour ce filtre.
          </div>
        )}
      </div>
    </Layout>
  );
} 