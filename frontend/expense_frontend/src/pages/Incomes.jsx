import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { 
  Plus, 
  Wallet, 
  Pencil, 
  Trash2, 
  X, 
  Calendar, 
  DollarSign, 
  FileText, 
  Tag, 
  AlertCircle 
} from 'lucide-react';

export default function Incomes() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields matching IncomeRequest DTO
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    receivedDate: new Date().toISOString().split('T')[0],
    note: '',
  });

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axiosClient.get('/incomes');
      setIncomes(res.data);
    } catch (err) {
      console.error('Error fetching incomes:', err);
      setError('Failed to load income records.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (income = null) => {
    if (income) {
      setEditingId(income.id);
      setFormData({
        source: income.source,
        amount: income.amount,
        receivedDate: income.receivedDate,
        note: income.note || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        source: '',
        amount: '',
        receivedDate: new Date().toISOString().split('T')[0],
        note: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      source: formData.source.trim(),
      amount: parseFloat(formData.amount),
      receivedDate: formData.receivedDate,
      note: formData.note ? formData.note.trim() : null,
    };

    try {
      if (editingId) {
        // PUT /api/incomes/{id}
        const res = await axiosClient.put(`/incomes/${editingId}`, payload);
        setIncomes((prev) => prev.map((item) => (item.id === editingId ? res.data : item)));
      } else {
        // POST /api/incomes
        const res = await axiosClient.post('/incomes', payload);
        setIncomes((prev) => [res.data, ...prev]);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error saving income:', err);
      setError(err.response?.data?.message || 'Failed to save income record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income entry?')) return;

    try {
      // DELETE /api/incomes/{id}
      await axiosClient.delete(`/incomes/${id}`);
      setIncomes((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting income:', err);
      alert('Failed to delete income.');
    }
  };

  const totalIncome = incomes.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Income Management</h1>
          <p className="text-sm text-slate-500">Track and record your earnings and revenue streams</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Income</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs uppercase font-semibold text-slate-400">Total Recorded Income</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">
            LKR {totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <Wallet className="w-8 h-8" />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Incomes Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">All Income Records</h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {incomes.length} records
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-slate-500 animate-pulse">
            Loading income records...
          </div>
        ) : incomes.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            No income entries found. Click <span className="font-semibold text-emerald-600">Add Income</span> to create your first entry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-3.5">Source</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Note</th>
                  <th className="px-6 py-3.5 text-right">Amount</th>
                  <th className="px-6 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {incomes.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800 flex items-center space-x-3">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                        <Tag className="w-4 h-4" />
                      </div>
                      <span>{item.source}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.receivedDate}
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                      {item.note || '—'}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      + LKR {(Number(item.amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Income Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingId ? 'Edit Income Entry' : 'Add New Income'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Source / Category *</label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Salary, Freelance, Investment"
                    className="w-full pl-9 pr-3.5 py-2 border rounded-xl text-sm outline-emerald-600 border-slate-200"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Amount (LKR) *</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    className="w-full pl-9 pr-3.5 py-2 border rounded-xl text-sm outline-emerald-600 border-slate-200"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Received Date *</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    className="w-full pl-9 pr-3.5 py-2 border rounded-xl text-sm outline-emerald-600 border-slate-200"
                    value={formData.receivedDate}
                    onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Note (Optional)</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Project milestone 1 payment"
                    className="w-full pl-9 pr-3.5 py-2 border rounded-xl text-sm outline-emerald-600 border-slate-200"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-600 font-medium text-sm rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium text-sm rounded-xl transition-colors shadow-xs"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}