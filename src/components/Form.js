import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, resetForm } from "../redux/formSlice";
import axios from "axios";
import { FiCalendar, FiClock, FiMapPin, FiUser } from 'react-icons/fi';

const Form = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = useSelector((state) => state.form);

  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setError("");
    if (name === "pob") {
      setSelectedPlace(value);
      await fetchPlaceSuggestions(value);
    } else {
      dispatch(updateForm({ field: name, value }));
    }
  };

  const fetchPlaceSuggestions = async (query) => {
    const API_KEY = process.env.REACT_APP_API_KEY_PLACE;
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.locationiq.com/v1/autocomplete.php`,
        {
          params: {
            key: API_KEY,
            q: query,
            countrycodes: "IN",
            limit: 5,
          },
        }
      );
      setSuggestions(response.data || []);
    } catch (error) {
      setError("Error fetching locations. Please try again.");
      console.error("Error fetching place suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (place) => {
    setSelectedPlace(place.display_name);
    dispatch(updateForm({ field: "pob", value: place.display_name }));
    dispatch(updateForm({ field: "coordinates", value: `${place.lat},${place.lon}` }));
    setSuggestions([]);
  };

  const chartTypes = [
    { value: 'lagna', label: 'Lagna Chart' },
    { value: 'navamsa', label: 'Navamsa Chart' },
    { value: 'rasi', label: 'Rasi Chart' }
  ];

  const chartStyles = [
    { value: 'north-indian', label: 'North Indian' },
    { value: 'south-indian', label: 'South Indian' },
    { value: 'east-indian', label: 'East Indian' }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
    { value: 'ml', label: 'Malayalam' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      console.log("Details submitted successfully", formData);
      navigate("/result", {
        state: {
          name: formData.name,
          dob: formData.dob,
          tob: formData.tob,
          pob: formData.pob,
          coordinates: formData.coordinates,
          chartType: formData.chartType || 'lagna',
          chartStyle: formData.chartStyle || 'north-indian',
          language: formData.language || 'en',
        },
      });
      dispatch(resetForm());
    } catch (error) {
      setError("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <form
          onSubmit={handleSubmit}
          className="relative bg-white/90 backdrop-blur-lg p-8 md:p-10 rounded-2xl shadow-2xl w-full mx-auto space-y-6 border border-gray-100"
        >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center transform transition-transform hover:scale-110">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"></path>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-3">Birth Details</h2>
          <p className="text-gray-600 text-lg">Enter your birth information for astrological insights</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 bg-orange-50/50 p-6 rounded-xl border border-orange-100/50 shadow-inner">
            <h3 className="md:col-span-3 text-lg font-semibold text-orange-800 mb-2">Chart Preferences</h3>
            <div>
              <label htmlFor="chartType" className="block mb-2 text-sm font-medium text-gray-900">
                Chart Type
              </label>
              <select
                id="chartType"
                name="chartType"
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
                value={formData.chartType || 'lagna'}
                onChange={handleChange}
              >
                {chartTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="chartStyle" className="block mb-2 text-sm font-medium text-gray-900">
                Chart Style
              </label>
              <select
                id="chartStyle"
                name="chartStyle"
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
                value={formData.chartStyle || 'north-indian'}
                onChange={handleChange}
              >
                {chartStyles.map(style => (
                  <option key={style.value} value={style.value}>{style.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="language" className="block mb-2 text-sm font-medium text-gray-900">
                Language
              </label>
              <select
                id="language"
                name="language"
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
                value={formData.language || 'en'}
                onChange={handleChange}
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiClock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="time"
              name="tob"
              value={formData.tob}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="pob"
              value={selectedPlace}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150"
              placeholder="Enter your birthplace"
              required
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
              </div>
            )}
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white mt-1 border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {suggestions.map((place) => (
                  <li
                    key={place.place_id}
                    className="px-4 py-3 hover:bg-orange-50 cursor-pointer transition duration-150 border-b border-gray-100 last:border-0"
                    onClick={() => handleSuggestionClick(place)}
                  >
                    <div className="flex items-center">
                      <FiMapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{place.display_name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="group relative w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 px-6 rounded-xl hover:from-orange-500 hover:to-orange-600 focus:ring-4 focus:ring-orange-200 transition-all duration-300 mt-8 flex items-center justify-center overflow-hidden shadow-xl hover:shadow-orange-500/20"
        >
          <span className="relative flex items-center">
            <svg className="w-6 h-6 mr-2 transform transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Generate Your Cosmic Chart
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-600/20 to-transparent transform -skew-x-12 transition-transform group-hover:translate-x-full"></div>
          </span>
        </button>
      </form>
      </div>
    </div>
  );
};

export default Form;
