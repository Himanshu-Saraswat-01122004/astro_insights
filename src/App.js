import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Form from "./components/Form";
import ResultPage from "./components/ResultPage";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-orange-light text-gray-800">
        <Navbar />
        <main className="p-4">
          <Routes>
            {/* Route for the Form page */}
            <Route path="/" element={<Form />} />
            {/* Route for the Result page */}
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
