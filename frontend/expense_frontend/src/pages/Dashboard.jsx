import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Flame, 
  ArrowUpRight, 
  ArrowDownLeft,
  Banknote 
} from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [month, year]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/dashboard?year=${year}&month=${month}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header & Date Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Overview</h1>
          <p className="text-sm text-slate-500">Monitor your cash flow and top spending areas</p>
        </div>

        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="text-sm bg-transparent font-medium text-slate-700 outline-none cursor-pointer"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-16 text-sm bg-transparent font-medium text-slate-700 outline-none border-l pl-2"
          />
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-400">Total Income</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              LKR {data?.totalIncome?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-400">Total Expenses</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              LKR {data?.totalExpenses?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-400">Current Balance</p>
            <h3 className="text-2xl font-bold text-indigo-600 mt-1">
              LKR {data?.currentBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Banknote className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-100 p-4 rounded-2xl">
        <div className="bg-white p-4 rounded-xl shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Selected Month Income</p>
          <p className="text-lg font-bold text-emerald-600 mt-1">
            LKR {data?.monthlyIncome?.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Selected Month Expense</p>
          <p className="text-lg font-bold text-rose-600 mt-1">
            LKR {data?.monthlyExpenses?.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Highest Category</p>
            <p className="text-lg font-bold text-slate-800 mt-1 capitalize">
              {data?.highestExpenseCategory || 'None'}
            </p>
          </div>
          <Flame className="w-5 h-5 text-amber-500" />
        </div>
      </div>

      {/* Recent 5 Transactions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Latest 5 Transactions</h2>
        {data?.recentTransactions?.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">No transactions recorded yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {data?.recentTransactions?.map((t, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {t.type === 'INCOME' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{t.titleOrSource}</p>
                    <p className="text-xs text-slate-400">{t.date} • {t.categoryOrNote}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-bold ${
                    t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-800'
                  }`}
                >
                  {t.type === 'INCOME' ? '+' : '-'} LKR {t.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}