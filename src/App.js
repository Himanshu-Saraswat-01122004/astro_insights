import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Form from "./components/Form";
import ResultPage from "./components/ResultPage";

const App = () => {
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <Navbar />
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-24 relative"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCAyOCAwIDEgMCA1NiAwYTI4IDI4IDAgMSAwLTU2IDB6IiBzdHJva2U9IiNmZmI3ODgxMCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48cGF0aCBkPSJNMzAgMzBtLTE4IDBhMTggMTggMCAxIDAgMzYgMGExOCAxOCAwIDEgMC0zNiAweiIgc3Ryb2tlPSIjZmZiNzg4MTAiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9nPjwvc3ZnPg==')] opacity-5 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto relative">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={
                  <motion.div 
                    {...pageTransition}
                    className="flex items-center justify-center min-h-[calc(100vh-16rem)]"
                  >
                    <div className="w-full max-w-2xl mx-auto">
                      <Form />
                    </div>
                  </motion.div>
                } />
                <Route path="/result" element={
                  <motion.div 
                    {...pageTransition}
                    className="min-h-[calc(100vh-16rem)]"
                  >
                    <ResultPage />
                  </motion.div>
                } />
                <Route path="/horoscope" element={
                  <motion.div 
                    {...pageTransition}
                    className="min-h-[calc(100vh-16rem)]"
                  >
                    <div className="text-center py-12">
                      <h1 className="text-3xl font-bold text-orange-800 mb-4">Daily Horoscope</h1>
                      <p className="text-orange-600">Coming Soon</p>
                    </div>
                  </motion.div>
                } />
                <Route path="/zodiac" element={
                  <motion.div 
                    {...pageTransition}
                    className="min-h-[calc(100vh-16rem)]"
                  >
                    <div className="text-center py-12">
                      <h1 className="text-3xl font-bold text-orange-800 mb-4">Zodiac Signs</h1>
                      <p className="text-orange-600">Coming Soon</p>
                    </div>
                  </motion.div>
                } />
                <Route path="/contact" element={
                  <motion.div 
                    {...pageTransition}
                    className="min-h-[calc(100vh-16rem)]"
                  >
                    <div className="text-center py-12">
                      <h1 className="text-3xl font-bold text-orange-800 mb-4">Contact Us</h1>
                      <p className="text-orange-600">Coming Soon</p>
                    </div>
                  </motion.div>
                } />
              </Routes>
            </AnimatePresence>
          </div>
        </motion.main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
