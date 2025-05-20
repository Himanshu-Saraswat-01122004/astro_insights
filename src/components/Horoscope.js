import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addDays, subDays, isSameDay, isAfter, isBefore } from 'date-fns';
import { FiSun, FiCalendar, FiChevronDown, FiStar, FiDroplet, FiWind, FiHeart, FiShield, FiZap, FiCircle, FiChevronLeft, FiChevronRight, FiActivity, FiBriefcase, FiUser } from 'react-icons/fi';

// Function to get the appropriate zodiac icon based on sign name
const getZodiacIcon = (sign) => {
  const signLower = sign.toLowerCase();
  const className = "w-6 h-6 text-white";
  
  // Since we don't have specific zodiac icons, using related thematic icons as alternatives
  switch (signLower) {
    case 'aries': // Fire sign
      return <FiZap className={className} />;
    case 'taurus': // Earth sign
      return <FiShield className={className} />;
    case 'gemini': // Air sign
      return <FiWind className={className} />;
    case 'cancer': // Water sign
      return <FiDroplet className={className} />;
    case 'leo': // Fire sign
      return <FiSun className={className} />;
    case 'virgo': // Earth sign
      return <FiCircle className={className} />;
    case 'libra': // Air sign
      return <FiWind className={className} />;
    case 'scorpio': // Water sign
      return <FiDroplet className={className} />;
    case 'sagittarius': // Fire sign
      return <FiZap className={className} />;
    case 'capricorn': // Earth sign
      return <FiShield className={className} />;
    case 'aquarius': // Air sign
      return <FiWind className={className} />;
    case 'pisces': // Water sign
      return <FiDroplet className={className} />;
    default:
      return <FiStar className={className} />;
  }
};

// Function to get icon for horoscope type
const getHoroscopeTypeIcon = (type) => {
  const className = "w-6 h-6";
  
  switch (type.toLowerCase()) {
    case 'general':
      return <FiStar className={className} />;
    case 'health':
      return <FiActivity className={className} />;
    case 'career':
      return <FiBriefcase className={className} />;
    case 'love':
      return <FiHeart className={className} />;
    default:
      return <FiStar className={className} />;
  }
};

// Function to get description for each horoscope type
const getHoroscopeTypeDescription = (type) => {
  switch (type.toLowerCase()) {
    case 'general':
      return 'Overall daily influences';
    case 'health':
      return 'Wellness & vitality forecast';
    case 'career':
      return 'Work & financial outlook';
    case 'love':
      return 'Romantic & relationship trends';
    default:
      return '';
  }
};

// Function to get date ranges for each zodiac sign
const getZodiacDateRange = (sign) => {
  const signLower = sign.toLowerCase();
  
  switch (signLower) {
    case 'aries':
      return 'Mar 21 - Apr 19';
    case 'taurus':
      return 'Apr 20 - May 20';
    case 'gemini':
      return 'May 21 - Jun 20';
    case 'cancer':
      return 'Jun 21 - Jul 22';
    case 'leo':
      return 'Jul 23 - Aug 22';
    case 'virgo':
      return 'Aug 23 - Sep 22';
    case 'libra':
      return 'Sep 23 - Oct 22';
    case 'scorpio':
      return 'Oct 23 - Nov 21';
    case 'sagittarius':
      return 'Nov 22 - Dec 21';
    case 'capricorn':
      return 'Dec 22 - Jan 19';
    case 'aquarius':
      return 'Jan 20 - Feb 18';
    case 'pisces':
      return 'Feb 19 - Mar 20';
    default:
      return '';
  }
};

const Horoscope = () => {
  // Current date for reference
  const [currentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(0); // 0 = today, -1 = yesterday, 1 = tomorrow
  
  // Calculate yesterday, today, and tomorrow dates
  const yesterday = subDays(currentDate, 1);
  const today = currentDate;
  const tomorrow = addDays(currentDate, 1);
  
  const [formData, setFormData] = useState({
    datetime: format(today, "yyyy-MM-dd'T'HH:mm:ssxxx"),
    sign: 'aries',
    type: 'general'
  });
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSignDropdown, setShowSignDropdown] = useState(false);

  const zodiacSigns = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];
  
  const horoscopeTypes = ['general', 'health', 'career', 'love'];

  // Function to navigate between allowed dates (yesterday, today, tomorrow)
  const navigateDate = (direction) => {
    // Prevent navigating beyond the allowed range
    if (selectedDay + direction < -1 || selectedDay + direction > 1) {
      return;
    }
    
    const newSelectedDay = selectedDay + direction;
    setSelectedDay(newSelectedDay);
    
    let newDate;
    if (newSelectedDay === -1) {
      newDate = yesterday;
    } else if (newSelectedDay === 0) {
      newDate = today;
    } else {
      newDate = tomorrow;
    }
    
    setFormData({
      ...formData,
      datetime: format(newDate, "yyyy-MM-dd'T'HH:mm:ssxxx")
    });
  };
  
  // Handle input change (mainly for the sign selection)
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow datetime changes within the allowed range
    if (name === 'datetime') {
      const selectedDate = new Date(value);
      
      // Check if the date is within allowed range (yesterday, today, tomorrow)
      if (isSameDay(selectedDate, yesterday) || 
          isSameDay(selectedDate, today) || 
          isSameDay(selectedDate, tomorrow)) {
        
        // Update the selected day state based on the date
        if (isSameDay(selectedDate, yesterday)) {
          setSelectedDay(-1);
        } else if (isSameDay(selectedDate, today)) {
          setSelectedDay(0);
        } else {
          setSelectedDay(1);
        }
        
        setFormData({
          ...formData,
          datetime: format(selectedDate, "yyyy-MM-dd'T'HH:mm:ssxxx")
        });
      } else {
        // Show error message if date is outside allowed range
        setError('Only yesterday, today, and tomorrow dates are available for horoscope predictions.');
        setTimeout(() => setError(null), 5000);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const selectedDate = new Date(formData.datetime);
      
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const hours = String(selectedDate.getHours()).padStart(2, '0');
      const minutes = String(selectedDate.getMinutes()).padStart(2, '0');
      const seconds = String(selectedDate.getSeconds()).padStart(2, '0');
      
      const formattedDatetime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+05:30`;
      
      const encodedDatetime = formattedDatetime.replace('+', '%2B');
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/horoscope`,
        {
          params: {
            datetime: encodedDatetime,
            sign: formData.sign,
            type: formData.type
          }
        }
      );
      
      setHoroscopeData(response.data);
      console.log(response.data);
    } catch (err) {
      console.error('Error fetching horoscope data:', err);
      setError('Failed to fetch horoscope data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-5">
      <h2 className="text-3xl font-bold text-center text-orange-800 mb-6 flex items-center justify-center">
        <FiSun className="text-orange-500 mr-2" /> Daily Horoscope
      </h2>

      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-orange-200 hover:shadow-xl transition-all duration-300">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <label htmlFor="datetime" className="block mb-2 text-sm font-medium text-gray-900 flex items-center gap-2">
                <FiCalendar className="text-orange-500" />
                Select Date
              </label>
              
              {/* Date navigation with day selection buttons */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-orange-200 p-2 hover:shadow-sm transition-all duration-300">
                {/* Date selection tabs */}
                <div className="flex justify-between items-center mb-3 border-b border-orange-100 pb-2">
                  <button 
                    type="button"
                    onClick={() => navigateDate(-1)}
                    disabled={selectedDay === -1}
                    className="w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-30 disabled:cursor-not-allowed text-orange-500 hover:bg-orange-50"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDay(-1)}
                      className={`px-3 py-1 rounded-md text-sm transition-all duration-300 ${selectedDay === -1 ? 'bg-orange-500 text-white font-medium' : 'text-gray-700 hover:bg-orange-50'}`}
                    >
                      Yesterday
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setSelectedDay(0)}
                      className={`px-3 py-1 rounded-md text-sm transition-all duration-300 ${selectedDay === 0 ? 'bg-orange-500 text-white font-medium' : 'text-gray-700 hover:bg-orange-50'}`}
                    >
                      Today
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setSelectedDay(1)}
                      className={`px-3 py-1 rounded-md text-sm transition-all duration-300 ${selectedDay === 1 ? 'bg-orange-500 text-white font-medium' : 'text-gray-700 hover:bg-orange-50'}`}
                    >
                      Tomorrow
                    </button>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => navigateDate(1)}
                    disabled={selectedDay === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-30 disabled:cursor-not-allowed text-orange-500 hover:bg-orange-50"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Selected date display */}
                <div className="flex items-center justify-center py-2 text-center">
                  <div className="px-4 py-2 bg-orange-50 rounded-lg">
                    <div className="text-sm font-medium text-orange-800">
                      {selectedDay === -1 && format(yesterday, 'MMMM d, yyyy')}
                      {selectedDay === 0 && format(today, 'MMMM d, yyyy')}
                      {selectedDay === 1 && format(tomorrow, 'MMMM d, yyyy')}
                    </div>
                    <div className="text-xs text-orange-600 mt-1">
                      {selectedDay === -1 && 'Yesterday\'s Horoscope'}
                      {selectedDay === 0 && 'Today\'s Horoscope'}
                      {selectedDay === 1 && 'Tomorrow\'s Horoscope'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <label className="block mb-2 text-sm font-medium text-gray-900 flex items-center gap-2">
                <FiSun className="text-orange-500" />
                Zodiac Sign
              </label>
              
              {/* Visual Zodiac Sign Selector */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 bg-white/90 p-4 rounded-lg border border-orange-200 shadow-sm hover:shadow transition-all duration-300">
                {zodiacSigns.map((sign) => (
                  <div
                    key={sign}
                    onClick={() => setFormData({ ...formData, sign })}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${formData.sign === sign 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-md transform scale-105' 
                      : 'hover:bg-orange-50 text-gray-700 hover:shadow-sm'}`}
                  >
                    <div className={`p-2 rounded-full mb-1 ${formData.sign === sign ? 'bg-white/20' : 'bg-orange-100'}`}>
                      <span className={formData.sign === sign ? 'text-white' : 'text-orange-500'}>
                        {getZodiacIcon(sign)}
                      </span>
                    </div>
                    <span className="text-xs font-medium">
                      {sign.charAt(0).toUpperCase() + sign.slice(1)}
                    </span>
                    
                    {/* Zodiac date ranges - optional but informative */}
                    <span className="text-[10px] mt-1 opacity-80">
                      {getZodiacDateRange(sign)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Horoscope Type Selector */}
            <div className="relative group">
              <label className="block mb-2 text-sm font-medium text-gray-900 flex items-center gap-2">
                <FiStar className="text-orange-500" />
                Horoscope Type
              </label>
              
              {/* Visual Horoscope Type Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white/90 p-4 rounded-lg border border-orange-200 shadow-sm hover:shadow transition-all duration-300">
                {horoscopeTypes.map((type) => (
                  <div
                    key={type}
                    onClick={() => setFormData({ ...formData, type })}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${formData.type === type 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-md transform scale-105' 
                      : 'hover:bg-orange-50 text-gray-700 hover:shadow-sm'}`}
                  >
                    <div className={`p-2 rounded-full mb-1 ${formData.type === type ? 'bg-white/20' : 'bg-orange-100'}`}>
                      <span className={formData.type === type ? 'text-white' : 'text-orange-500'}>
                        {getHoroscopeTypeIcon(type)}
                      </span>
                    </div>
                    <span className="text-sm font-medium capitalize">
                      {type}
                    </span>
                    <span className="text-[10px] mt-1 opacity-80 text-center">
                      {getHoroscopeTypeDescription(type)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 px-6 rounded-xl hover:from-orange-500 hover:to-orange-600 focus:ring-4 focus:ring-orange-200 transition-all duration-300 flex items-center justify-center overflow-hidden shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative flex items-center text-lg font-medium">
                {loading ? (
                  <>
                    <div className="mr-2 animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  'Get Your Horoscope'
                )}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-600/20 to-transparent transform -skew-x-12 transition-transform group-hover:translate-x-full"></div>
              </span>
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {horoscopeData && !loading && horoscopeData.data?.daily_predictions?.length > 0 && (
        <div className="mt-8 relative bg-gradient-to-b from-white to-orange-50 rounded-xl shadow-2xl overflow-hidden border-2 border-orange-200 hover:shadow-orange-200/40 hover:scale-[1.01] transition-all duration-500 transform p-1">
          {/* Decorative stars */}
          <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-200 rounded-full animate-pulse"></div>
          <div className="absolute top-16 right-8 w-2 h-2 bg-yellow-100 rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-4 w-2 h-2 bg-orange-100 rounded-full animate-pulse opacity-70"></div>
          
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 relative overflow-hidden">
            {/* Background celestial pattern */}
            <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCAyOCAwIDEgMCA1NiAwYTI4IDI4IDAgMSAwLTU2IDB6IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PHBhdGggZD0iTTMwIDMwbS0xOCAwYTE4IDE4IDAgMSAwIDM2IDBhMTggMTggMCAxIDAtMzYgMHoiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L2c+PC9zdmc+')]"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center">
                {/* If there's a Unicode symbol, display it, otherwise use icon */}
                <div className="mr-4 p-2 bg-white/10 rounded-full h-14 w-14 flex items-center justify-center text-2xl">
                  {horoscopeData.data.daily_predictions[0].sign_info.unicode_symbol || 
                    getZodiacIcon(horoscopeData.data.daily_predictions[0].sign.name)}
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold tracking-wide flex items-center">
                    {horoscopeData.data.daily_predictions[0].sign.name}
                    <span className="ml-2 text-sm bg-white/20 rounded-full px-2 py-0.5">
                      Ruled by {horoscopeData.data.daily_predictions[0].sign.lord.name}
                    </span>
                  </h3>
                  <p className="text-orange-200 mt-1 font-light flex items-center gap-2">
                    <span>{horoscopeData.data.daily_predictions[0].sign_info.triplicity}</span>
                    <span className="w-1 h-1 bg-orange-200 rounded-full"></span>
                    <span>{horoscopeData.data.daily_predictions[0].sign_info.modality}</span>
                    <span className="w-1 h-1 bg-orange-200 rounded-full"></span>
                    <span>{horoscopeData.data.daily_predictions[0].sign_info.quadruplicity}</span>
                  </p>
                </div>
              </div>
              
              <div className="bg-white/10 py-1 px-3 rounded-lg text-sm">
                <div className="text-orange-100 font-light">Date</div>
                <div className="text-white font-medium">
                  {new Date(horoscopeData.data.datetime).toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'})}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 relative">
            {/* Find the prediction that matches the selected type */}
            {horoscopeData.data.daily_predictions[0].predictions
              .filter(prediction => prediction.type.toLowerCase() === formData.type.toLowerCase())
              .map((prediction, index) => (
                <div key={index} className="mb-6 pb-6 border-b border-orange-100">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-full bg-orange-100 mr-3">
                      <span className="text-orange-500">
                        {getHoroscopeTypeIcon(prediction.type)}
                      </span>
                    </div>
                    <h4 className="text-xl font-semibold text-orange-800">
                      {prediction.type} Horoscope
                    </h4>
                  </div>
                  
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed first-letter:text-3xl first-letter:font-bold first-letter:text-orange-600 first-letter:mr-1 first-letter:float-left">
                    {prediction.prediction}
                  </p>
                  
                  {/* Seek, Challenge, Insight section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {prediction.seek && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-800 mb-2">Seek</h5>
                        <p className="text-green-700 text-sm">{prediction.seek.replace('Seek: ', '')}</p>
                      </div>
                    )}
                    
                    {prediction.challenge && (
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h5 className="font-medium text-orange-800 mb-2">Challenge</h5>
                        <p className="text-orange-700 text-sm">{prediction.challenge.replace('Challenge: ', '')}</p>
                      </div>
                    )}
                    
                    {prediction.insight && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-800 mb-2">Insight</h5>
                        <p className="text-blue-700 text-sm">{prediction.insight.replace('Insight: ', '')}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
            {/* Display message if no prediction matches the selected type */}
            {horoscopeData.data.daily_predictions[0].predictions.filter(p => p.type.toLowerCase() === formData.type.toLowerCase()).length === 0 && (
              <div className="text-center py-8">
                <div className="text-orange-500 mb-2">
                  <FiStar className="w-8 h-8 mx-auto" />
                </div>
                <h4 className="text-xl font-medium text-gray-700 mb-2">
                  No {formData.type} prediction available
                </h4>
                <p className="text-gray-500">
                  Try selecting a different horoscope type
                </p>
              </div>
            )}
            
            <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
              <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Date: {new Date(formData.datetime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-md font-medium">
                  Sign ID: {horoscopeData.data.daily_predictions[0].sign.id || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Horoscope;