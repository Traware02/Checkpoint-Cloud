import { useEffect, useState } from "react";
import axios from "axios";

const VEHICULES = ["Véhicule 1", "Véhicule 2", "Véhicule 3"];

export default function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    vehicule: VEHICULES[0],
    depense: "",
    gain: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntries = async () => {
    try {
      const res = await axios.get("/api/entries");
      setEntries(res.data);
    } catch (err) {
      setError("Impossible de charger les entrées.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/entries", {
        ...form,
        depense: Number(form.depense),
        gain: Number(form.gain),
      });
      setForm({ ...form, depense: "", gain: "" });
      fetchEntries();
    } catch (err) {
      setError("Impossible d'ajouter l'entrée.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/entries/${id}`);
      fetchEntries();
    } catch (err) {
      setError("Impossible de supprimer l'entrée.");
    }
  };

  const totalDepenses = entries.reduce((sum, e) => sum + e.depense, 0);
  const totalGains = entries.reduce((sum, e) => sum + e.gain, 0);

  return (
    <div className="page">
      <header className="header">
        <h1>Suivi rentabilité VTC</h1>
        <p>Ajoute chaque jour les dépenses et gains de tes véhicules.</p>
      </header>

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="vehicule">Véhicule</label>
          <select
            id="vehicule"
            name="vehicule"
            value={form.vehicule}
            onChange={handleChange}
          >
            {VEHICULES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="depense">Dépenses (€)</label>
          <input
            id="depense"
            type="number"
            name="depense"
            min="0"
            step="0.01"
            value={form.depense}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="gain">Gains (€)</label>
          <input
            id="gain"
            type="number"
            name="gain"
            min="0"
            step="0.01"
            value={form.gain}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Ajouter</button>
      </form>

      {error && <p className="error">{error}</p>}

      <section className="summary">
        <div>
          <span className="summary-label">Total dépenses</span>
          <span className="summary-value">{totalDepenses.toFixed(2)} €</span>
        </div>
        <div>
          <span className="summary-label">Total gains</span>
          <span className="summary-value">{totalGains.toFixed(2)} €</span>
        </div>
        <div>
          <span className="summary-label">Solde</span>
          <span className="summary-value">
            {(totalGains - totalDepenses).toFixed(2)} €
          </span>
        </div>
      </section>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="entries-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Véhicule</th>
              <th>Dépenses</th>
              <th>Gains</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id}>
                <td>{new Date(entry.date).toLocaleDateString("fr-FR")}</td>
                <td>{entry.vehicule}</td>
                <td>{entry.depense.toFixed(2)} €</td>
                <td>{entry.gain.toFixed(2)} €</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(entry._id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan="5">Aucune entrée pour le moment.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
