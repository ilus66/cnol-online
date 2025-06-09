import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function AtelierDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [atelier, setAtelier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  });

  useEffect(() => {
    if (id) {
      fetchAtelier();
    }
  }, [id]);

  const fetchAtelier = async () => {
    try {
      const response = await fetch(`/api/ateliers/${id}`);
      if (!response.ok) throw new Error('Atelier non trouvé');
      const data = await response.json();
      setAtelier(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/atelier/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          atelierId: id,
          title: atelier.titre,
          date: atelier.date,
          heure: atelier.heure,
          lieu: atelier.salle
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la réservation');
      
      const data = await response.json();
      alert('Réservation confirmée ! Un email avec votre ticket vous a été envoyé.');
      router.push('/programme');
    } catch (error) {
      alert('Erreur lors de la réservation. Veuillez réessayer.');
      console.error('Erreur:', error);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!atelier) return <div>Atelier non trouvé</div>;

  return (
    <Layout title={`${atelier.titre} - CNOL 2025`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-bold">{atelier.titre}</h1>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  atelier.type === 'atelier' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {atelier.type === 'atelier' ? 'Atelier' : 'Masterclass'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Détails</h2>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Intervenant:</strong> {atelier.intervenant}</p>
                    <p><strong>Date:</strong> {new Date(atelier.date).toLocaleDateString()}</p>
                    <p><strong>Horaire:</strong> {atelier.heure}</p>
                    <p><strong>Salle:</strong> {atelier.salle}</p>
                    <p><strong>Places disponibles:</strong> {atelier.places - atelier.inscrits}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700">{atelier.description}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Réserver</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom</label>
                      <input
                        type="text"
                        name="nom"
                        required
                        value={formData.nom}
                        onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prénom</label>
                      <input
                        type="text"
                        name="prenom"
                        required
                        value={formData.prenom}
                        onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                      <input
                        type="tel"
                        name="telephone"
                        required
                        value={formData.telephone}
                        onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Réserver
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 