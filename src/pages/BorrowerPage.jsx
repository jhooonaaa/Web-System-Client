import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaSearch,
  FaSignOutAlt,
  FaBookOpen,
  FaHistory,
  FaExclamationTriangle,
  FaUser,
  FaTag,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaBoxOpen,
  FaPlay,
  FaUndo, FaBoxes
} from 'react-icons/fa'; // All required icons

function BorrowerPage() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('title');
  const [activeTab, setActiveTab] = useState('home');
  const [borrowModal, setBorrowModal] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [borrowQuantity, setBorrowQuantity] = useState(1);
 const apiUrl = import.meta.env.VITE_ENDPOINT_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();

    const interval = setInterval(() => {
      fetchBooks();
    }, 3000);

    const username = localStorage.getItem('username');
    if (username) {
      fetchBorrowedBooks(username);
    }

    return () => clearInterval(interval);
  }, []);

  const fetchBooks = async () => {
    const res = await fetch(`${apiUrl}/books`);
    const data = await res.json();
    setBooks(data);
  };

  const fetchBorrowedBooks = async (username) => {
    try {
      const res = await axios.get(`${apiUrl}/borrowed-books/${username}`);
      if (res.data.success) setBorrowedBooks(res.data.borrowedBooks);
      else setBorrowedBooks([]);
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
      setBorrowedBooks([]);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleBorrow = async () => {
    const username = localStorage.getItem('username');
    if (!username || !borrowModal || !borrowModal.returnDate) return;

    const unreturnedCount = borrowedBooks.filter(b => !b.is_returned).length;

    if (unreturnedCount >= 2) {
      setSuccessMessage("Your account is locked due to many unreturned books. Please return books to unlock.");
      setBorrowModal(null);
      setTimeout(() => setSuccessMessage(''), 4000);
      return;
    }


    try {
      const res = await axios.post(`${apiUrl}/borrow-book`, {
        username,
        book_id: borrowModal.book_id,
        return_date: borrowModal.returnDate,
        quantity: borrowQuantity
      });

      await fetchBorrowedBooks(username);
      await fetchBooks();

      setBorrowModal(null);

      if (res.data.accountLocked) {
        setWarningMessage("You already have one unreturned book. Borrowing another may lock your account.");
      } else {
        setSuccessMessage("Book borrowed successfully!");
      }

      setTimeout(() => {
        setSuccessMessage('');
        setWarningMessage('');
      }, 4000);

    } catch (error) {
      console.error('Error borrowing book:', error);
      setSuccessMessage("Failed to borrow book.");
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleReturn = async (borrowId) => {
    try {
      await axios.post(`${apiUrl}/return-book`, {
        borrow_id: borrowId,
      });

      setSuccessMessage('Book returned successfully!');

      const username = localStorage.getItem('username');
      fetchBorrowedBooks(username);
      fetchBooks();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error returning book:', error);
      setSuccessMessage('Failed to return book');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const sortedBooks = books
    .filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a[sortField] > b[sortField] ? 1 : -1));

  const selectedBook = borrowModal
    ? books.find(book => book.book_id === borrowModal.book_id)
    : null;

  const filteredBooks = showHistory
    ? borrowedBooks
    : borrowedBooks.filter(borrow => !borrow.is_returned);

  return (
    <div className="min-h-screen bg-[#F2F4EE] font-serif text-[#5E503F]">
      <nav className="bg-[#A68A64] text-white px-6 py-4 flex justify-between items-center shadow-md rounded-b-xl">
        <h1 className="text-2xl font-bold">📚 Library Borrower Panel</h1>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end items-center mt-2 sm:mt-0">
          <button
            onClick={() => setActiveTab('home')}
            className={`hover:underline ${activeTab === 'home' ? 'underline font-bold' : ''}`}
          >
            <FaBookOpen className="inline mr-1" /> Home
          </button>
          <button
            onClick={() => setActiveTab('borrowed')}
            className={`hover:underline ${activeTab === 'borrowed' ? 'underline font-bold' : ''}`}
          >
            <FaHistory className="inline mr-1" /> My Borrowed Books
          </button>
          <button
            onClick={handleLogout}
            className="bg-[#7F674C] text-white px-4 py-2 rounded-full hover:bg-red-400"
          >
            <FaSignOutAlt className="inline mr-1" /> Logout
          </button>
        </div>
      </nav>

      <div className="p-6">
        {(successMessage || warningMessage) && (
          <div className={`mb-4 px-4 py-2 rounded shadow text-center text-white transition-all duration-300 ${successMessage ? 'bg-green-600' : ''} ${warningMessage ? 'bg-red-500' : ''}`}>
            {successMessage || warningMessage}
          </div>
        )}

        {activeTab === 'home' && (
          <>
           <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
              <div className="flex items-center">
                <FaSearch className="mr-2" />
                <input
                  type="text"
                  placeholder="Search books..."
                  className="p-2 border rounded w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="p-2 border rounded"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="genre">Genre</option>
                <option value="published_year">Year</option>
              </select>
            </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm bg-white shadow-md rounded-xl">
              <thead className="bg-[#EADBC8] text-[#5E503F]">
                <tr>
                  <th className="p-3"><FaBookOpen className="inline mr-1" /> Title</th>
                  <th className="p-3"><FaUser className="inline mr-1" /> Author</th>
                  <th className="p-3"><FaTag className="inline mr-1" /> Genre</th>
                  <th className="p-3"><FaCalendarAlt className="inline mr-1" /> Year</th>
                  <th className="p-3"><FaInfoCircle className="inline mr-1" /> Status</th>
                  <th className="p-3"><FaBoxOpen className="inline mr-1" /> Quantity</th>
                  <th className="p-3"><FaPlay className="inline mr-1" /> Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedBooks.map((book) => (
                  <tr key={book.book_id} className="hover:bg-[#f9f4ef] transition-all text-center">
                    <td className="p-3 border-t">{book.title}</td>
                    <td className="p-3 border-t">{book.author}</td>
                    <td className="p-3 border-t">{book.genre}</td>
                    <td className="p-3 border-t">{book.published_year}</td>
                    <td className="p-3 border-t">
                      {book.quantity > 0 ? 'Available' : 'Borrowed'}
                    </td>
                    <td className="p-3 border-t">{book.quantity}</td>
                    <td className="p-3 border-t">
                      <button
                        onClick={() => {
                          setBorrowModal({ book_id: book.book_id });
                          setBorrowQuantity(1);
                        }}
                        className={`px-3 py-1 rounded-full text-white ${book.quantity > 0 ? 'bg-[#6B705C] hover:bg-[#588157]' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={book.quantity <= 0}
                      >
                        <FaBookOpen className="inline mr-1" /> Borrow
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                </div>
          </>
        )}

        {activeTab === 'borrowed' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">My Borrowed Books</h2>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400"
              >
                {showHistory ? 'Show Unreturned' : 'Show History'}
                <FaHistory className="inline ml-2" />
              </button>
            </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm bg-white shadow-md rounded-xl">
              <thead className="bg-[#EADBC8] text-[#5E503F]">
                <tr>
                  <th className="p-3"><FaBookOpen className="inline mr-1" /> Title</th>
                  <th className="p-3"><FaCalendarAlt className="inline mr-1" /> Borrow Date</th>
                  <th className="p-3"><FaCalendarAlt className="inline mr-1" /> Return Date</th>
                  <th className="p-3"><FaCheck className="inline mr-1" /> Returned</th>
                  <th className="p-3"><FaExclamationTriangle className="inline mr-1" /> Overdue</th>
                  <th className="p-3"><FaBoxOpen className="inline mr-1" /> Quantity</th>
                  <th className="p-3"><FaUndo className="inline mr-1" /> Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((borrow) => (
                  <tr key={borrow.borrow_id} className="text-center hover:bg-[#f9f4ef]">
                    <td className="p-3 border-t">{borrow.title}</td>
                    <td className="p-3 border-t">{new Date(borrow.borrow_date).toLocaleDateString()}</td>
                    <td className="p-3 border-t">{new Date(borrow.return_date).toLocaleDateString()}</td>
                    <td className="p-3 border-t"><div className="flex justify-center items-center">
                      {borrow.is_returned ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                    </div> </td>
                    <td className="p-3 border-t">{new Date(borrow.return_date) < new Date() && !borrow.is_returned ? 'Yes' : 'No'}</td>
                    <td className="p-3 border-t">{borrow.quantity}</td>
                    <td className="p-3 border-t">
                      {!borrow.is_returned && (
                        <button
                          onClick={() => handleReturn(borrow.borrow_id)}
                          className="px-3 py-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                        >
                          <FaUndo className="inline mr-1" /> Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
      </div>

     {borrowModal && selectedBook && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-beige bg-opacity-60 backdrop-blur-md">
    <div className="bg-white/80 backdrop-blur-xl border border-[#c0a16b] rounded-2xl p-6 w-[90%] max-w-md shadow-2xl relative transition-all font-serif text-[#5E503F]">
      
      {/* Close Button */}
      <button
        onClick={() => setBorrowModal(null)}
        className="absolute top-4 right-5 text-[#7c5e3b] text-2xl hover:scale-110 transition-transform"
      >
        ✖
      </button>

      {/* Modal Title */}
      <h2 className="text-3xl text-center mb-6">📖 Borrow Book</h2>

      <div className="flex flex-col gap-6">
        {/* Book Title Info */}
        <div className="flex items-center gap-4">
          <FaBookOpen className="text-[#7c5e3b] text-xl" />
          <p className="p-2 w-full bg-white/70 border border-[#DDBEA9] rounded-md shadow-inner">
            {selectedBook?.title}
          </p>
        </div>

        {/* Quantity Input */}
        <div className="flex items-center gap-4">
          <FaBoxes className="text-[#7c5e3b] text-xl" />
          <input
            type="number"
            min="1"
            max={selectedBook.quantity}
            value={borrowQuantity}
            onChange={(e) => {
  const value = e.target.value;
  if (value === '') {
    setBorrowQuantity('');
  } else if (/^\d+$/.test(value)) {
    setBorrowQuantity(parseInt(value, 10));
  }
}}
            placeholder="Quantity"
            className="px-4 py-2 w-full rounded-md border border-gray-300 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#a67c52] transition"
          />
        </div>

        {/* Return Date Input */}
        <div className="flex items-center gap-4">
          <FaCalendarAlt className="text-[#7c5e3b] text-xl" />
          <input
            type="date"
            value={borrowModal.returnDate || ''}
            onChange={(e) =>
              setBorrowModal({ ...borrowModal, returnDate: e.target.value })
            }
            className="px-4 py-2 w-full rounded-md border border-gray-300 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#a67c52] transition"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-4 pt-6">
          <button
            onClick={handleBorrow}
            className="bg-[#4a3f2f] text-white font-semibold px-6 py-2 rounded-md hover:bg-green-700 transition duration-200 shadow-md"
          >
            <FaBookOpen className="inline mr-1" /> Borrow
          </button>
          <button
            onClick={() => setBorrowModal(null)}
            className="bg-[#4a3f2f] text-white px-6 py-2 rounded-md hover:bg-gray-600 transition duration-200"
          >
            <FaTimes className="inline mr-1" /> Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

export default BorrowerPage;
