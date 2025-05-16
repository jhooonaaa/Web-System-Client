import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const apiUrl = import.meta.env.VITE_ENDPOINT_URL;

  useEffect(() => {
    const fetchTransactions = () => {
      axios.get(`${apiUrl}/transactions`)
        .then(response => {
          setTransactions(response.data);
          setFilteredTransactions(response.data);
        })
        .catch(error => console.error('Error fetching transactions:', error));
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 3000);
    return () => clearInterval(interval);
  }, []);

  const groupedByUser = transactions.reduce((acc, tx) => {
    if (!acc[tx.username]) acc[tx.username] = [];
    acc[tx.username].push(tx);
    return acc;
  }, {});

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return isNaN(date) ? '—' : date.toLocaleDateString();
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return isNaN(date) ? '—' : date.toLocaleString();
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = transactions.filter(tx =>
      tx.username.toLowerCase().includes(query) ||
      tx.book_title.toLowerCase().includes(query) ||
      tx.action.toLowerCase().includes(query)
    );
    setFilteredTransactions(filtered);
  };

  const filteredUserTransactions = selectedUser
    ? selectedUser.txs.filter(tx =>
        tx.book_title.toLowerCase().includes(bookSearchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="p-6 font-serif bg-[#F9F4F0] min-h-screen text-[#4a3f2f]">
      <h2 className="text-3xl font-bold mb-6 text-center">📚 User Transaction Records</h2>

      {/* Main Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by username, title, or action..."
          value={searchQuery}
          onChange={handleSearch}
          className="px-4 py-2 w-[400px] rounded-md border border-[#B28B74] bg-white/80 shadow-sm focus:ring-2 focus:ring-[#a67c52] transition"
        />
      </div>

      {/* User Table */}
      <div className="flex justify-center">
        <table className="w-[600px] bg-[#E6D3C1] shadow-lg rounded-xl border border-[#B28B74] overflow-hidden">
          <thead className="bg-[#DDBEA9] text-[#4a3f2f]">
            <tr>
              <th className="p-4 border border-[#B28B74]">👤 Username</th>
              <th className="p-4 border border-[#B28B74]">🧾 Transactions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedByUser).map(([username, txs]) => (
              <tr
                key={username}
                className="text-center hover:bg-[#f2e8df] transition cursor-pointer"
                onClick={() => {
                  setSelectedUser({ username, txs });
                  setBookSearchQuery('');
                  setShowModal(true);
                }}
              >
                <td className="p-4 border border-[#B28B74]">
                  <span className="px-3 py-1 bg-white rounded shadow-sm border border-[#C89F8F]">
                    {username}
                  </span>
                </td>
                <td className="p-4 border border-[#B28B74] font-semibold">{txs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-beige bg-opacity-60 backdrop-blur-md">
          <div className="bg-[#FDF7F2] w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto p-8 rounded-xl shadow-2xl relative border border-[#C9AD91] font-serif text-[#4a3f2f]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">
                🧾 Transactions for <span className="text-[#6f4e37]">{selectedUser.username}</span>
              </h3>
              <input
                type="text"
                placeholder="Search book title..."
                value={bookSearchQuery}
                onChange={(e) => setBookSearchQuery(e.target.value)}
                className="px-3 py-2 border border-[#B28B74] rounded-md shadow-sm focus:ring-2 focus:ring-[#a67c52] bg-white"
              />
            </div>

            <table className="w-full text-sm border border-[#C9AD91] bg-white rounded shadow">
              <thead className="bg-[#EBD8C3] text-[#4a3f2f]">
                <tr>
                  <th className="p-3 border border-[#C9AD91]">User ID</th>
                  <th className="p-3 border border-[#C9AD91]">Book Title</th>
                  <th className="p-3 border border-[#C9AD91]">Qty</th>
                  <th className="p-3 border border-[#C9AD91]">Action</th>
                  <th className="p-3 border border-[#C9AD91]">Borrow Date</th>
                  <th className="p-3 border border-[#C9AD91]">Return Date</th>
                  <th className="p-3 border border-[#C9AD91]">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredUserTransactions.map(tx => (
                  <tr key={tx.transaction_id} className="text-center hover:bg-[#f9f1ea] transition">
                    <td className="p-3 border border-[#C9AD91]">{tx.user_id}</td>
                    <td className="p-3 border border-[#C9AD91]">{tx.book_title}</td>
                    <td className="p-3 border border-[#C9AD91]">{tx.quantity}</td>
                    <td className="p-3 border border-[#C9AD91] capitalize">{tx.action}</td>
                    <td className="p-3 border border-[#C9AD91]">{formatDate(tx.borrow_date)}</td>
                    <td className="p-3 border border-[#C9AD91]">{formatDate(tx.return_date)}</td>
                    <td className="p-3 border border-[#C9AD91]">{formatTimestamp(tx.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-[#4a3f2f] text-white rounded-md hover:bg-red-700 shadow-md transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionList;
