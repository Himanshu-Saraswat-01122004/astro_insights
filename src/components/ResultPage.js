import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiMapPin, FiUser, FiDownload, FiHome, FiInfo } from 'react-icons/fi';
import axios from "axios";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state;

  const [svgResult, setSvgResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingChart, setDownloadingChart] = useState(false);
  const chartRef = useRef(null);

  const generateDatetime = (dob, tob) => {
    const [year, month, day] = dob.split("-");
    const [hours, minutes] = tob.split(":");
    return `${year}-${month}-${day}T${hours}:${minutes}:00+05:30`;
  }

  // Function to download chart as PNG
  const handleDownloadChart = async () => {
    if (!chartRef.current || !svgResult) return;
    
    try {
      setDownloadingChart(true);
      
      // Get the SVG element
      const svgElement = chartRef.current.querySelector('svg');
      if (!svgElement) {
        console.error('No SVG element found');
        setDownloadingChart(false);
        return;
      }
      
      // Clone the SVG to manipulate it
      const clonedSvg = svgElement.cloneNode(true);
      
      // Set dimensions for the output image
      const svgWidth = svgElement.width.baseVal.value || 800;
      const svgHeight = svgElement.height.baseVal.value || 800;
      
      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = svgWidth;
      canvas.height = svgHeight;
      const ctx = canvas.getContext('2d');
      
      // Fill background (optional)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Convert SVG to a data URL
      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
      const url = URL.createObjectURL(svgBlob);
      
      // Create image from SVG
      const img = new Image();
      img.onload = () => {
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL and trigger download
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `astrology-chart-${formData.chartType || 'lagna'}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Clean up
        URL.revokeObjectURL(url);
        setDownloadingChart(false);
      };
      
      img.onerror = (error) => {
        console.error('Error loading SVG image', error);
        setDownloadingChart(false);
      };
      
      img.src = url;
      
    } catch (error) {
      console.error('Error downloading chart:', error);
      setDownloadingChart(false);
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
        // First, store user data in the database via separate API call
        const userData = {
          name: formData.name || '',
          dob: formData.dob || '',
          tob: formData.tob || '',
          pob: formData.pob || ''
        };

        // Send user data to be stored in database
        await axios.post(
          process.env.REACT_APP_API_URL+"/store-user-data",
          userData
        );

        // Original GET request for chart data remains unchanged
        const response = await axios.get(process.env.REACT_APP_API_URL+"/astrology-chart", 
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
          }
        );

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
                    className="relative bg-gradient-to-br from-white/80 via-white/90 to-orange-50/80 rounded-xl p-6 shadow-inner backdrop-blur-sm overflow-hidden"
                  >
                    {/* Lord Ganesh background - using inline SVG */}
                    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
                      <svg 
                        width="60%" 
                        height="60%" 
                        viewBox="0 0 100 100" 
                        className="fill-orange-100/60"
                        style={{
                          filter: 'drop-shadow(0 0 5px rgba(249, 115, 22, 0.2))',
                        }}
                      >
                        <path d="M50,10 C40,10 32,15 28,25 C25,18 20,17 15,20 C10,23 9,30 12,35 C15,40 20,42 25,38 C23,45 25,52 30,55 C25,57 22,62 25,67 C28,72 35,73 40,70 C42,75 47,80 50,80 C53,80 58,75 60,70 C65,73 72,72 75,67 C78,62 75,57 70,55 C75,52 77,45 75,38 C80,42 85,40 88,35 C91,30 90,23 85,20 C80,17 75,18 72,25 C68,15 60,10 50,10 Z M42,30 C45,30 47,33 47,36 C47,39 45,42 42,42 C39,42 37,39 37,36 C37,33 39,30 42,30 Z M58,30 C61,30 63,33 63,36 C63,39 61,42 58,42 C55,42 53,39 53,36 C53,33 55,30 58,30 Z M35,50 C35,45 42,45 42,50 L42,65 C42,70 35,70 35,65 L35,50 Z M65,50 C65,45 58,45 58,50 L58,65 C58,70 65,70 65,65 L65,50 Z" />
                      </svg>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/3 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/3 -translate-x-1/3"></div>
                    
                    {/* SVG content */}
                    <div 
                      ref={chartRef}
                      dangerouslySetInnerHTML={{ __html: svgResult }}
                      className="transform scale-125 origin-center relative z-10"
                      style={{
                        minHeight: '500px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    />
                    
                    {/* Download button */}
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(249, 115, 22, 0.9)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownloadChart}
                      className="absolute top-3 right-3 z-20 bg-orange-500/80 hover:bg-orange-500 text-white px-3 py-2 rounded-lg shadow-md flex items-center space-x-2 transition-all duration-300"
                      disabled={downloadingChart}
                    >
                      <FiDownload className="h-4 w-4" />
                      <span className="text-sm font-medium">{downloadingChart ? 'Processing...' : 'Download'}</span>
                    </motion.button>
                    
                    {/* Beautiful frame */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-orange-300/50 to-transparent"></div>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-orange-300/50 to-transparent"></div>
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-orange-300/50 to-transparent"></div>
                    <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-orange-300/50 to-transparent"></div>
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
                    onClick={handleDownloadChart}
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
