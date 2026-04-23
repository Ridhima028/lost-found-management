import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ itemName: '', description: '', type: 'Lost', location: '', date: '', contactInfo: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('lost_found_token');
    navigate('/login');
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/items');
      setItems(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        setError('Unable to load items.');
      }
    } finally {
      setLoading(false);
    }
  };

  const searchItems = async (query) => {
    if (!query.trim()) {
      fetchItems();
      return;
    }
    try {
      const response = await api.get(`/items/search?name=${encodeURIComponent(query)}`);
      setItems(response.data);
    } catch (err) {
      setError('Search failed.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('lost_found_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.post('/items', form);
      setForm({ itemName: '', description: '', type: 'Lost', location: '', date: '', contactInfo: '' });
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add item.');
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/items/${editingItem._id}`, form);
      setEditingItem(null);
      setForm({ itemName: '', description: '', type: 'Lost', location: '', date: '', contactInfo: '' });
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update item.');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm({
      itemName: item.itemName,
      description: item.description,
      type: item.type,
      location: item.location,
      date: new Date(item.date).toISOString().split('T')[0],
      contactInfo: item.contactInfo
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/items/${id}`);
        fetchItems();
      } catch (err) {
        setError('Could not delete item.');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchItems(searchQuery);
  };

  return (
    <div className="dashboard-page">
      <header>
        <h1>Lost & Found Dashboard</h1>
        <button className="logout-button" onClick={logout}>Logout</button>
      </header>

      <section className="item-form-card">
        <h2>{editingItem ? 'Update Item' : 'Add Item'}</h2>
        <form onSubmit={editingItem ? handleUpdateItem : handleAddItem}>
          <label>Item Name</label>
          <input name="itemName" value={form.itemName} onChange={handleChange} required />
          <label>Description</label>
          <input name="description" value={form.description} onChange={handleChange} required />
          <label>Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
          <label>Location</label>
          <input name="location" value={form.location} onChange={handleChange} required />
          <label>Date</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
          <label>Contact Info</label>
          <input name="contactInfo" value={form.contactInfo} onChange={handleChange} required />
          <button type="submit">{editingItem ? 'Update Item' : 'Add Item'}</button>
          {editingItem && <button type="button" onClick={() => { setEditingItem(null); setForm({ itemName: '', description: '', type: 'Lost', location: '', date: '', contactInfo: '' }); }}>Cancel</button>}
        </form>
      </section>

      <section className="search-card">
        <h2>Search Items</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by name, description, type, or location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
          <button type="button" onClick={() => { setSearchQuery(''); fetchItems(); }}>Clear</button>
        </form>
      </section>

      <section className="item-list-card">
        <h2>All Items</h2>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div>Loading items...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Description</th>
                <th>Type</th>
                <th>Location</th>
                <th>Date</th>
                <th>Contact Info</th>
                <th>Reported By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.itemName}</td>
                  <td>{item.description}</td>
                  <td>{item.type}</td>
                  <td>{item.location}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.contactInfo}</td>
                  <td>{item.user.name} ({item.user.email})</td>
                  <td>
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => handleDelete(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
