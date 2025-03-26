import React, { useState } from "react";

const QueryGenerator = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fonction pour récupérer les données depuis le backend
  const fetchQueries = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/generate-queries");
      const data = await response.json();
      setQueries(data.queries);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Census Block Queries
      </h1>
      <button
        onClick={fetchQueries}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
      >
        {loading ? "Chargement..." : "Générer les requêtes"}
      </button>

      {/* Affichage des résultats */}
      <div className="mt-6">
        {queries.length > 0 && (
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">#</th>
                <th className="border p-2">Google Maps Query</th>
              </tr>
            </thead>
            <tbody>
              {queries.slice(0, 20).map((query, index) => (
                <tr key={index} className="border-t">
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2 text-blue-500 underline">
                    <a href={query} target="_blank" rel="noopener noreferrer">
                      {query}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default QueryGenerator;
