import React, { useState } from "react";
import EmailPopup from "./EmailPopup";
import logo from '../assets/images/logo.svg'
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
  input_hash?:string;
}

interface ApiResponse {
  report_id: string;
  confidence: string;
  report_json: ReportJson;
 
}

interface ResultProps {
  data: ApiResponse;
}

const Result: React.FC<ResultProps> = ({ data }) => {
  const [showEmailPopup, setShowEmailPopup] = useState(false);

  const { report_json, report_id, confidence } = data;
  const { sections, header, timestamp } = report_json;

  // Parse root causes from content
  const parseRootCauses = (content: string) => {
    const rootCauses = [];
    const lines = content.split("\n");
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Match pattern: "Design / Geometry Sensitivity (Primary Driver): Product geometry..."
      const match = line.match(/^(.+?)\s+\((Primary Driver|Secondary Contributor|Conditional Amplifier)\):\s*(.+)$/);
      
      if (match) {
        const causeName = match[1];
        const causeType = match[2];
        const explanation = match[3];
        
        let probability = "";
        if (causeType === "Primary Driver") probability = "High";
        else if (causeType === "Secondary Contributor") probability = "Medium";
        else if (causeType === "Conditional Amplifier") probability = "Variable";
        
        rootCauses.push({
          cause: causeName,
          probability,
          causeType,
          explanation,
        });
      }
    }
    
    return rootCauses;
  };

  // Find specific sections
  const rootCausesSection = sections.find(s => s.title === "Most Likely Root Cause Hypotheses");
  const diagnosticEvidenceSection = sections.find(s => s.title === "Diagnostic Evidence");
  const recommendationsSection = sections.find(s => s.title === "Recommended Testing / Validation");
  const confidenceStatementSection = sections.find(s => s.title === "Analysis Confidence Statement");

  const rootCauses = rootCausesSection ? parseRootCauses(rootCausesSection.content) : [];

  return (
    <>
      <div className="card-custom mb-0 pe-0 ps-0">
        {/* Header */}
        {header && (
          <div className="report-header mb-30">
            <h5>Root Cause Analysis Report</h5>
            <div className="row">
              <div className="col-md-6">
                <div className="logo">
                    <img src={logo} alt="" />
                </div>
              </div>
              <div className="col-md-6">
                <p><strong>Part/Process:</strong> {header.part_process}</p>
                 <p><strong>Analysis Confidence:</strong> <span className="badge bg-info">{confidence || header.analysis_confidence}</span> {header.defect_symptom}</p>
                <p><strong>Problem Statement:</strong> {header.defect_symptom}</p>
               
              </div>
            </div>
          </div>
        )}

        {/* Executive Diagnostic Summary */}
        {sections.map((section, index) => {
          if (section.title === "Executive Diagnostic Summary") {
            return (
              <div key={index} className="mb-30">
                <h5>{section.title}</h5>
                <div className="term-innr">
                  <p style={{ whiteSpace: "pre-line" }}>{section.content}</p>
                </div>
              </div>
            );
          }
          return null;
        })}

        {/* Most Likely Root Cause Hypotheses (Ranked) */}
        {rootCausesSection && (
          <div className="mb-30">
            <h5>{rootCausesSection.title}</h5>
            <div className="root-causes-list">
              {rootCauses.map((item, index) => (
                <div key={index} className="root-cause-item mb-4">
                  <h6>
                    {item.cause} ({item.causeType})
                  </h6>
                  <p>{item.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diagnostic Evidence */}
        {diagnosticEvidenceSection && (
          <div className="mb-30">
            <h5>{diagnosticEvidenceSection.title}</h5>
            <div className="term-innr">
              <p style={{ whiteSpace: "pre-line" }}>{diagnosticEvidenceSection.content}</p>
            </div>
          </div>
        )}

        {/* Recommended Testing / Validation */}
        {recommendationsSection && (
          <div className="mb-30">
            <h5>{recommendationsSection.title}</h5>
            <div className="term-innr">
              <ol>
                {recommendationsSection.content.split("\n").map((line, idx) => {
                  const match = line.match(/^\d+\.\s+(.+)$/);
                  if (match) {
                    return <li key={idx}>{match[1]}</li>;
                  }
                  return null;
                }).filter(Boolean)}
              </ol>
            </div>
          </div>
        )}

        {/* Analysis Confidence Statement */}
        {confidenceStatementSection && (
          <div className="mb-30">
            <h5>{confidenceStatementSection.title}</h5>
            <div className="term-innr">
              <p>{confidenceStatementSection.content}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="report-footer text-muted mt-30 pt-3 border-top">
          <small>
            Generated on: {timestamp ? new Date(timestamp).toLocaleString() : new Date().toLocaleString()}<br />
            Report ID: {report_id} | Input Hash: {report_json.input_hash}
          </small>
        </div>

        <div className="text-center button-group mt-30">
          <button className="btn btn-primary">
            Download Report
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowEmailPopup(true)}
          >
            Send Email
          </button>
        </div>
      </div>

      {/* Popup */}
      {showEmailPopup && (
        <EmailPopup 
          report_id={report_id} 
          onClose={() => setShowEmailPopup(false)} 
        />
      )}
    </>
  );
};

export default Result;