import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, resetForm } from "../redux/formSlice";
import axios from "axios";
// include the dotenv package

const Form = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = useSelector((state) => state.form);

  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");

  const handleChange = async (e) => {
    const { name, value } = e.target;
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

    try {
      const response = await axios.get(
        `https://api.locationiq.com/v1/autocomplete.php`,
        {
          params: {
            key: API_KEY,
            q: query,
            countrycodes: "IN", // Restrict results to India
            limit: 5, // Limit the number of suggestions
          },
        }
      );
      setSuggestions(response.data || []);
    } catch (error) {
      console.error("Error fetching place suggestions:", error);
    }
  };

  const handleSuggestionClick = (place) => {
    setSelectedPlace(place.display_name);
  
    dispatch(updateForm({ field: "pob", value: place.display_name }));
    dispatch(updateForm({ field: "coordinates", value: `${place.lat},${place.lon}` }));
  
    setSuggestions([]); // Clear suggestions after selection
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Details submitted succesfully", formData);
    navigate("/result", {
      state: {
        name: formData.name,
        dob: formData.dob,
        tob: formData.tob,
        pob: formData.pob,
        coordinates: formData.coordinates,
      },
    });
    dispatch(resetForm());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-orange-light p-6 rounded-lg shadow-lg w-full max-w-md mx-auto mt-8"
    >
      <h2 className="text-2xl font-bold mb-4">Astrology Form</h2>
      <div className="mb-4">
        <label className="block mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter your name"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Time of Birth</label>
        <input
          type="time"
          name="tob"
          value={formData.tob}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4 relative">
        <label className="block mb-2">Place of Birth</label>
        <input
          type="text"
          name="pob"
          value={selectedPlace}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter your birthplace"
          required
        />
        {suggestions.length > 0 && (
          <ul className="absolute bg-white border border-gray-300 rounded shadow-lg mt-1 max-h-40 overflow-y-auto w-full z-10">
            {suggestions.map((place) => (
              <li
                key={place.place_id}
                className="p-2 cursor-pointer hover:bg-orange-light"
                onClick={() => handleSuggestionClick(place)}
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        type="submit"
        className="bg-orange-dark text-white p-2 rounded w-full hover:bg-orange"
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
