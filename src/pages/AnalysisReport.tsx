import React, { useState, useRef, useEffect } from "react";
import AnalysisForm from "../components/AnalysisForm";
import Result from "../components/Result";
import { analyzeForm } from "../service/api.service";

interface Section {
  title: string;
  content: string;
}

interface ReportJson {
  header?: {
    part_process: string;
    defect_symptom: string;
    date_range: string;
    analysis_confidence: string;
  };
  sections: Section[];
  timestamp?: string;
}

interface ApiResponse {
  report_id: string;
  confidence: string;
  report_json: ReportJson;
 
}

const AnalysisReport: React.FC = () => {
  const [resultData, setResultData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formResetKey, setFormResetKey] = useState<number>(0);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const handleFormSubmit = async (data: {
    docs: File[];
    images: File[];
    description: string;
  }) => {
    setLoading(true);

    try {
      const formData = new FormData();

      // Append multiple document files
      if (data.docs && data.docs.length > 0) {
        data.docs.forEach((file) => {
          formData.append("files", file);
        });
      }

      // Append multiple image files
      if (data.images && data.images.length > 0) {
        data.images.forEach((file) => {
          formData.append("files", file);
        });
      }

      formData.append("problem_statement", data.description);

      const response = await analyzeForm(formData);
      
      if (response) {
        setResultData(response);
        setFormResetKey((prev) => prev + 1);
      } else {
        console.error("Analysis failed:", response.error);
        // You can add toast notification here
      }
      
    } catch (error) {
      console.error("Error analyzing form:", error);
      // You can add toast notification here
    } finally {
      setLoading(false);
    }
  };

  // Smooth scroll to Result when data updates
  useEffect(() => {
    if (resultData && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [resultData]);

  return (
    <div className="analysis-report">
      <div className="container">
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