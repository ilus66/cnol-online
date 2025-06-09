import { useState } from 'react';
import Layout from '../components/Layout';

export default function Inscription() {
  const [type, setType] = useState('visiteur');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    entreprise: '',
    poste: '',
    adresse: '',
    codePostal: '',
    ville: '',
    pays: 'Maroc'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, type }),
      });
      
      if (!response.ok) throw new Error('Erreur lors de l\'inscription');
      
      const data = await response.json();
      alert('Inscription réussie ! Un email de confirmation vous a été envoyé.');
      window.location.href = '/';
    } catch (error) {
      alert('Erreur lors de l\'inscription. Veuillez réessayer.');
      console.error('Erreur:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout title="Inscription - CNOL 2025">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Inscription CNOL 2025</h1>
        
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center mb-6">
            <button
              className={`px-6 py-2 rounded-l-lg ${type === 'visiteur' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setType('visiteur')}
            >
              Visiteur
            </button>
            <button
              className={`px-6 py-2 rounded-r-lg ${type === 'exposant' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setType('exposant')}
            >
              Exposant
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  name="nom"
                  required
                  value={formData.nom}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
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
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {type === 'exposant' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Entreprise</label>
                  <input
                    type="text"
                    name="entreprise"
                    required
                    value={formData.entreprise}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Poste</label>
                  <input
                    type="text"
                    name="poste"
                    required
                    value={formData.poste}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse</label>
              <input
                type="text"
                name="adresse"
                required
                value={formData.adresse}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Code Postal</label>
                <input
                  type="text"
                  name="codePostal"
                  required
                  value={formData.codePostal}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ville</label>
                <input
                  type="text"
                  name="ville"
                  required
                  value={formData.ville}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Pays</label>
              <select
                name="pays"
                value={formData.pays}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Maroc">Maroc</option>
                <option value="Algérie">Algérie</option>
                <option value="Tunisie">Tunisie</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                S'inscrire
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 