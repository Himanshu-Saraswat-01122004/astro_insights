import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiCalendar, FiClock, FiMapPin, FiUser, FiDownload, FiHome, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state;

  const [svgResult, setSvgResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const generateDatetime = (dob, tob) => {
    const [year, month, day] = dob.split("-");
    const [hours, minutes] = tob.split(":");
    return `${year}-${month}-${day}T${hours}:${minutes}:00+05:30`;
  }

  const handleDownload = () => {
    if (svgResult) {
      const blob = new Blob([svgResult], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `astrology-chart-${formData.name.toLowerCase().replace(/\s+/g, '-')}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    if (!formData) {
      navigate("/");
      return;
    }

    const fetchSvgResult = async () => {
      setLoading(true);
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL+"/astrology-chart", 
        // const response = await axios.get("http://localhost:4000/astrology-chart", 
          {
          params: {
            ayanamsa: 1,
            coordinates: formData.coordinates,
            datetime: generateDatetime(formData.dob, formData.tob),
            chart_type: formData.chartType || 'lagna',
            chart_style: formData.chartStyle || 'north-indian',
            format: "svg",
            la: formData.language || 'en',
          },
        });

        setSvgResult(response.data);
      } catch (err) {
        console.error("Error fetching SVG result:", err);
        setError("Failed to fetch the chart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSvgResult();
  }, [formData, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg"
        >
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 bg-orange-200 rounded-full animate-ping opacity-75"></div>
            <div className="relative animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-orange-600"></div>
          </div>
          <p className="text-xl font-medium text-gray-700">Generating your astrological chart...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-md w-full text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
            <FiInfo className="text-red-600 w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Occurred</h3>
          <p className="text-gray-700 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-300 shadow-md hover:shadow-lg"
          >
            <FiHome className="mr-2" />
            Return Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-orange-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-8">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold flex items-center"
            >
              <div className="bg-white/20 p-2 rounded-lg mr-4">
                <FiUser className="w-6 h-6" />
              </div>
              {formData.name || "Unknown"}'s Birth Chart
            </motion.h2>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Birth Details */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 text-gray-700 bg-orange-50/50 p-4 rounded-lg border border-orange-100"
              >
                <FiCalendar className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{formData.dob || "Not Provided"}</p>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 text-gray-700 bg-orange-50/50 p-4 rounded-lg border border-orange-100"
              >
                <FiClock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-500">Time of Birth</p>
                  <p className="font-medium">{formData.tob || "Not Provided"}</p>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 text-gray-700 bg-orange-50/50 p-4 rounded-lg border border-orange-100"
              >
                <FiMapPin className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-500">Place of Birth</p>
                  <p className="font-medium">{formData.pob || "Not Provided"}</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Chart Display */}
            {svgResult ? (
              <div className="relative">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="chart-container max-w-4xl mx-auto bg-gradient-to-b from-white/95 to-white/80 backdrop-blur-sm p-8 rounded-2xl border border-orange-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Chart Info Bar */}
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-white/60 shadow-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <span className="text-sm font-medium text-gray-700">Chart Type: {formData.chartType || 'Lagna'}</span>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-white/60 shadow-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <span className="text-sm font-medium text-gray-700">Style: {formData.chartStyle || 'North Indian'}</span>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-white/60 shadow-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Language: {formData.language === 'hi' ? 'हिंदी' :
                                  formData.language === 'ta' ? 'தமிழ்' :
                                  formData.language === 'te' ? 'తెలుగు' :
                                  formData.language === 'ml' ? 'മലയാളം' : 'English'}
                      </span>
                    </motion.div>
                  </div>
                  
                  {/* Chart SVG */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative bg-white/40 rounded-xl p-6 shadow-inner"
                  >
                    <div 
                      dangerouslySetInnerHTML={{ __html: svgResult }}
                      className="transform scale-125 origin-center"
                      style={{
                        minHeight: '500px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    />
                    <div className="absolute inset-0 rounded-xl ring-1 ring-orange-100 pointer-events-none"></div>
                  </motion.div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl hover:from-orange-700 hover:to-orange-600 transition duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                  >
                    <FiDownload className="mr-3 h-5 w-5" />
                    Download Chart
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/")}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded-xl hover:from-gray-700 hover:to-gray-600 transition duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                  >
                    <FiHome className="mr-3 h-5 w-5" />
                    New Chart
                  </motion.button>
                </motion.div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="bg-orange-50/50 backdrop-blur-sm p-8 rounded-2xl border border-orange-100 shadow-lg max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <FiInfo className="text-orange-600 w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Chart Available</h3>
                  <p className="text-gray-600">The chart data is not available at the moment. Please try generating it again.</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};


export default ResultPage;
