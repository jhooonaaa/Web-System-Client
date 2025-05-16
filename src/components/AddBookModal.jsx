import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes, FaBook, FaUser, FaTag, FaCalendarAlt, FaBoxes } from 'react-icons/fa'; // Import relevant icons

const AddBookModal = ({ onClose, onAdded }) => {
  const apiUrl = import.meta.env.VITE_ENDPOINT_URL;
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    genre: '',
    published_year: '',
    status: 'available',
    quantity: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!bookData.title.trim()) return;
    try {
      await axios.post(`${apiUrl}/add-book`, bookData);
      onAdded();
      onClose();
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-beige bg-opacity-60 backdrop-blur-md">
      <div className="bg-white/80 backdrop-blur-xl border border-[#c0a16b] rounded-2xl p-8 w-[95%] max-w-lg shadow-2xl relative transition-all">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-[#7c5e3b] text-2xl hover:scale-110 transition-transform"
        >
          <FaTimes />
        </button>
        <h2 className="text-3xl font-serif text-center text-[#4a3f2f] mb-6">
          📖 Add New Book
        </h2>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <FaBook className="text-[#7c5e3b] text-xl" />
            <input
              name="title"
              type="text"
              value={bookData.title}
              onChange={handleChange}
              placeholder="Title"
              className="px-4 py-2 rounded-md border border-gray-300 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#a67c52] transition w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <FaUser className="text-[#7c5e3b] text-xl" />
            <input
              name="author"
              type="text"
              value={bookData.author}
              onChange={handleChange}
              placeholder="Author"
              className="px-4 py-2 rounded-md border border-gray-300 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#a67c52] transition w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <FaTag className="text-[#7c5e3b] text-xl" />
            <input
              name="genre"
              type="text"
              value={bookData.genre}
              onChange={handleChange}
              placeholder="Genre"
              className="px-4 py-2 rounded-md border border-gray-300 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#a67c52] transition w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <FaCalendarAlt className="text-[#7c5e3b] text-xl" />
            <input
              name="published_year"
              type="number"
              value={bookData.published_year}
              onChange={handleChange}
              placeholder="Published Year"
              className="px-4 py-2 rounded-md border border-gray-300 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#a67c52] transition w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <FaBoxes className="text-[#7c5e3b] text-xl" />
            <input
              name="quantity"
              type="number"
              value={bookData.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              className="px-4 py-2 rounded-md border border-gray-300 bg-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#a67c52] transition w-full"
            />
          </div>

          <div className="flex justify-between gap-4 pt-6">
            <button
              onClick={handleSubmit}
              className="bg-[#4a3f2f] text-white font-semibold px-6 py-2 rounded-md hover:bg-red-600 transition duration-200 shadow-md"
            >
              📚 Add Book
            </button>
            <button
              onClick={onClose}
              className="bg-[#4a3f2f] text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBookModal;
