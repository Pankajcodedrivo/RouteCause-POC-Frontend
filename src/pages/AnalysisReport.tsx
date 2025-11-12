import React, { useState, useRef, useEffect } from "react";
import AnalysisForm from "../components/AnalysisForm";
import Result from "../components/Result";
import { analyzeForm } from "../service/api.service";

// Define a proper type for the Result data
interface RootCause {
  cause: string;
  probability: string;
  factors: string;
  explanation: string;
  keyInsightForRCA: string;
}

interface Recommendation {
  shortTerm: string;
  longTerm: string;
}

interface Reference {
  title: string;
  description: string;
}

interface ResultData {
  rootCauses: RootCause[];
  recommendations: Recommendation;
  references: Reference[];
}

const AnalysisReport: React.FC = () => {
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formResetKey, setFormResetKey] = useState<number>(0); // 👈 force form re-render to reset
  const resultRef = useRef<HTMLDivElement | null>(null);

  const handleFormSubmit = async (data: {
    docs: File[];
    images: File[];
    description: string;
  }) => {
    setLoading(true); // show spinner

    try {
      const formData = new FormData();

      // Append multiple document files
      if (data.docs && data.docs.length > 0) {
        data.docs.forEach((file) => {
          formData.append("documents", file);
        });
      }

      // Append multiple image files
      if (data.images && data.images.length > 0) {
        data.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      formData.append("description", data.description);

      const response = await analyzeForm(formData);
      if(response.success){
        setResultData(response.data);
        setFormResetKey((prev) => prev + 1);
      }else{
        
      }
      
    } catch (error) {
      console.error("Error analyzing form:", error);
    } finally {
      setLoading(false); // hide spinner
    }
  };

  // 👇 Smooth scroll to Result when data updates
  useEffect(() => {
    if (resultData && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [resultData]);

  return (
    <div className="analysis-report">
      <div className="container">
        {/* 👇 key forces React to recreate AnalysisForm, clearing its state */}
        <AnalysisForm key={formResetKey} onSubmit={handleFormSubmit} />

        {loading && (
          <div className="loader-overlay">
            <div className="spinner"></div>
            <p>Analyzing your files, please wait...</p>
          </div>
        )}

        {resultData && !loading && (
          <div ref={resultRef}>
            <Result data={resultData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisReport;