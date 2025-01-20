import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ResultPage = () => {
  const location = useLocation(); // Access form data passed via navigation
  const navigate = useNavigate();
  const formData = location.state; // Contains the form data (name, dob, tob, pob)

  const [svgResult, setSvgResult] = useState(null); // To store the SVG content
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateDatetime = (dob, tob) => {
    const [year, month, day] = dob.split("-");
    const [hours, minutes] = tob.split(":");
    return `${year}-${month}-${day}T${hours}:${minutes}:00+05:30`;
  }

  useEffect(() => {
    if (!formData) {
      navigate("/");
      return;
    }
    console.log("Coordinates:", formData);  
    const fetchSvgResult = async () => {
      setLoading(true);
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL+"/astrology-chart", {
            params: {
              ayanamsa: 1,
              coordinates: formData.coordinates,
              datetime: generateDatetime(formData.dob, formData.tob),
              chart_type: "lagna",
              chart_style: "north-indian",
              format: "svg",
              in: "hi",
            },
          });

        // Set the SVG result
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
    return <div className="p-6 text-center">Loading your chart...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-orange-dark text-white p-2 rounded mt-4"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto mt-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Astrological Chart of {formData.name || "Unknown"}</h2>
      <div className="mb-4">
        <p><strong>Date of Birth:</strong> {formData.dob || "Not Provided"}</p>
        <p><strong>Time of Birth:</strong> {formData.tob || "Not Provided"}</p>
        <p><strong>Place of Birth:</strong> {formData.pob || "Not Provided"}</p>
      </div>
      {svgResult ? (
        <div
          className="chart-container"
          dangerouslySetInnerHTML={{ __html: svgResult }}
        />
      ) : (
        <p>No chart data available. Please try again.</p>
      )}
      <button
        onClick={() => navigate("/")}
        className="bg-orange-dark text-white p-2 rounded mt-4"
        >Jay Siya Ram</button>
    </div>
  );
};

export default ResultPage;
