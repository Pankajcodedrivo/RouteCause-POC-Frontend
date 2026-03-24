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
      <div className="card-custom card-result mb-0">
        {/* Header */}
        {header && (
          <div className="report-header">
            <div className="d-flex report-content">
              <div className="logo">
                <img src={logo} alt="" />
              </div>
              <div>
                <h5>Root Cause Analysis Report</h5>
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
              <div key={index} className="mb-3 cmn-card">
                <h5 className="result-hdr">{section.title}</h5>
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
          <div className="mb-3 cmn-card">
            <h5 className="result-hdr grey">{rootCausesSection.title}</h5>
            <ul className="root-causes-list">
              {rootCauses.map((item, index) => (
                <li key={index} className="root-cause-item">
                  <h6>
                    {item.cause} ({item.causeType})
                  </h6>
                  <p>{item.explanation}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="row m-0 mb-3">
          <div className="col-lg-6 p-0">
            {/* Diagnostic Evidence */}
            {diagnosticEvidenceSection && (
              <div className="cmn-card h-100">
                <h5 className="result-hdr">{diagnosticEvidenceSection.title}</h5>
                <ul className="root-causes-list no-decimle">
                  {diagnosticEvidenceSection.content.split("\n").map((line, idx) => {
                  
                      return <li key={idx}>{line}</li>;
                    
                    
                  }).filter(Boolean)}
                </ul>
              </div>
            )}
          </div>
          <div className="col-lg-6 p-0">
            {/* Recommended Testing / Validation */}
            {recommendationsSection && (
              <div className="cmn-card h-100">
                <h5 className="result-hdr">{recommendationsSection.title}</h5>
                  <ul className="root-causes-list">
                    {recommendationsSection.content.split("\n").map((line, idx) => {
                      const match = line.match(/^\d+\.\s+(.+)$/);
                      if (match) {
                        return <li key={idx}>{match[1]}</li>;
                      }
                      return null;
                    }).filter(Boolean)}
                  </ul>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Confidence Statement */}
        {confidenceStatementSection && (
          <div className="cmn-card">
            <h5 className="result-hdr grey">{confidenceStatementSection.title}</h5>
            <div className="term-innr">
              <p>{confidenceStatementSection.content}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="report-footer text-muted mt-30 pt-2 mt-3 mb-3 border-top">
          <small>
            Generated on: {timestamp ? new Date(timestamp).toLocaleString() : new Date().toLocaleString()} |
            Report ID: {report_id} | Input Hash: {report_json.input_hash}
          </small>
        </div>

        <div className="text-center button-group mt-30">
          <button className="btn btn-primary">
            Download Report
          </button>
          <button
            className="btn btn-primary"
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