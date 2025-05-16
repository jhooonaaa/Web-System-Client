import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHome, FaSignOutAlt, FaTrash, FaEdit, FaPlus,
  FaBook, FaUser, FaTag, FaCalendarAlt, FaBoxes
} from 'react-icons/fa';
import AddBookModal from '../components/AddBookModal';
import TransactionList from '../components/TransactionList';
import axios from 'axios';

function AdminPage() {
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_ENDPOINT_URL;

  useEffect(() => {
    fetchBooks();
    const interval = setInterval(fetchBooks, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchBooks = async () => {
    const res = await fetch(`${apiUrl}/books`);
    const data = await res.json();
    setBooks(data);
  };

  const handleDelete = async (bookId) => {
    try {
      await axios.post(`${apiUrl}/delete-book`, { book_id: bookId });
      setSuccessMessage("Deleted successfully!");
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      setSuccessMessage("Failed to delete book");
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleBookAdded = () => {
    setSuccessMessage('Book added successfully!');
    fetchBooks();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const updateBook = async () => {
    if (!editingBook.title.trim()) return;

    try {
      await axios.post(`${apiUrl}/update-book`, {
        book_id: editingBook.book_id,
        title: editingBook.title,
        author: editingBook.author,
        genre: editingBook.genre,
        published_year: editingBook.published_year,
        status: editingBook.status,
        quantity: editingBook.quantity
      });
      setEditingBook(null);
      setSuccessMessage("Book updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchBooks();
    } catch (error) {
      console.error("Error updating book:", error);
      setSuccessMessage("Failed to update book");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F4EE]">
      <nav className="bg-[#c0a16b] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-serif tracking-wide">📚 Library Admin Panel</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition duration-200 hover:underline ${activeTab === 'home' ? 'font-semibold underline' : ''}`}
          >
            <FaHome className="inline mr-2" /> Home
          </button>
          <button
            onClick={() => setActiveTab('transaction')}
            className={`transition duration-200 hover:underline ${activeTab === 'transaction' ? 'font-semibold underline' : ''}`}
          >
            <FaEdit className="inline mr-2" /> Transactions
          </button>
          <button
            onClick={handleLogout}
            className="bg-[#7F674C] px-4 py-2 rounded-md text-white hover:bg-red-500 transition"
          >
            <FaSignOutAlt className="inline mr-2" /> Logout
          </button>
        </div>
      </nav>

      <div className="p-6">
        {activeTab === 'home' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-serif text-[#4a3f2f]">📖 Book List</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#4a3f2f] text-white font-medium px-4 py-2 rounded-md hover:bg-red-500 transition"
              >
                <FaPlus className="inline mr-2" /> Add Book
              </button>
            </div>

            {successMessage && (
              <div className="mb-4 px-4 py-2 bg-green-500 text-white text-center rounded shadow">
                {successMessage}
              </div>
            )}

            <table className="w-full border bg-white/80 shadow-lg backdrop-blur-md rounded-xl overflow-hidden">
              <thead className="bg-[#f7f3ee] text-[#4a3f2f] font-semibold text-sm">
                <tr>
                  <th className="py-2 px-3 border"><FaBook className="inline mr-1" /> Title</th>
                  <th className="py-2 px-3 border"><FaUser className="inline mr-1" /> Author</th>
                  <th className="py-2 px-3 border"><FaTag className="inline mr-1" /> Genre</th>
                  <th className="py-2 px-3 border"><FaCalendarAlt className="inline mr-1" /> Year</th>
                  <th className="py-2 px-3 border"><FaBoxes className="inline mr-1" /> Status</th>
                  <th className="py-2 px-3 border"><FaBoxes className="inline mr-1" /> Quantity</th>
                  <th className="py-2 px-3 border"><FaEdit className="inline mr-1" /> Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.book_id} className="text-center border-t text-sm text-[#4a3f2f]">
                    <td className="py-2 px-3">{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.published_year}</td>
                    <td>{book.quantity > 0 ? 'Available' : 'Borrowed'}</td>
                    <td>{book.quantity}</td>
                    <td className="flex justify-center gap-2 py-2">
                      <button
                        onClick={() => setEditingBook(book)}
                        className="bg-yellow-400 px-3 py-1 rounded hover:brightness-110 transition"
                      >
                        <FaEdit className="inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(book.book_id)}
                        className="bg-[#7F674C] text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        <FaTrash className="inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showAddModal && (
              <AddBookModal
                onClose={() => setShowAddModal(false)}
                onAdded={handleBookAdded}
              />
            )}

           {editingBook && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-beige bg-opacity-60 backdrop-blur-md">
    <div className="bg-white/80 backdrop-blur-xl border border-[#c0a16b] rounded-2xl p-8 w-[95%] max-w-lg shadow-2xl relative transition-all">
      <button
        onClick={() => setEditingBook(null)}
        className="absolute top-4 right-5 text-[#7c5e3b] text-2xl hover:scale-110 transition-transform"
      >
        ✖
      </button>
      <h2 className="text-3xl font-serif text-center text-[#4a3f2f] mb-6">
        ✏️ Edit Book
      </h2>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <FaBook className="text-[#7c5e3b] text-xl" />
          <input
            type="text"
            value={editingBook.title}
            onChange={(e) =>
              setEditingBook({ ...editingBook, title: e.target.value })
            }
            placeholder="Title"
            className="px-4 py-2 w-full rounded-md border border-gray-300 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#a67c52] transition"
          />
        </div>

        <div className="flex items-center gap-4">
          <FaUser className="text-[#7c5e3b] text-xl" />
          <input
            type="text"
            value={editingBook.author}
            onChange={(e) =>
              setEditingBook({ ...editingBook, author: e.target.value })
            }
            placeholder="Author"
            className="px-4 py-2 w-full rounded-md border border-gray-300 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#a67c52] transition"
          />
        </div>

        <div className="flex items-center gap-4">
          <FaTag className="text-[#7c5e3b] text-xl" />
          <input
            type="text"
            value={editingBook.genre}
            onChange={(e) =>
              setEditingBook({ ...editingBook, genre: e.target.value })
            }
            placeholder="Genre"
            className="px-4 py-2 w-full rounded-md border border-gray-300 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#a67c52] transition"
          />
        </div>

        <div className="flex items-center gap-4">
          <FaCalendarAlt className="text-[#7c5e3b] text-xl" />
          <input
            type="number"
            value={editingBook.published_year}
            onChange={(e) =>
              setEditingBook({ ...editingBook, published_year: e.target.value })
            }
            placeholder="Published Year"
            className="px-4 py-2 w-full rounded-md border border-gray-300 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#a67c52] transition"
          />
        </div>

        <div className="flex items-center gap-4">
          <FaBoxes className="text-[#7c5e3b] text-xl" />
          <input
            type="number"
            value={editingBook.quantity}
            onChange={(e) =>
              setEditingBook({ ...editingBook, quantity: e.target.value })
            }
            placeholder="Quantity"
            className="px-4 py-2 w-full rounded-md border border-gray-300 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#a67c52] transition"
          />
        </div>

        <select
          value={editingBook.status}
          onChange={(e) =>
            setEditingBook({ ...editingBook, status: e.target.value })
          }
          className="px-4 py-2 w-full rounded-md border border-gray-300 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#a67c52] transition"
        >
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
        </select>

        <div className="flex justify-between gap-4 pt-6">
          <button
            onClick={updateBook}
            className="bg-[#4a3f2f] text-white font-semibold px-6 py-2 rounded-md hover:bg-red-600 transition duration-200 shadow-md"
          >
            💾 Save
          </button>
          <button
            onClick={() => setEditingBook(null)}
            className="bg-[#4a3f2f] text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}
          </div>
        )}

        {activeTab === 'transaction' && <TransactionList />}
      </div>
    </div>
  );
}

export default AdminPage;
