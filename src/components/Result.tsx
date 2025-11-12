import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import EmailPopup from "./EmailPopup";

interface RootCause {
  cause: string;
  probability: string;
  factors: string;
  explanation: string;
  keyInsightForRCA: string; // ✅ new field
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

interface ResultProps {
  data: ResultData;
}

const Result: React.FC<ResultProps> = ({ data }) => {
  const { rootCauses, recommendations, references } = data;
  const reportRef = useRef<HTMLDivElement>(null);
  const [showEmailPopup, setShowEmailPopup] = useState(false);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    // Clone for clean export
    const element = reportRef.current.cloneNode(true) as HTMLElement;
    const buttons = element.querySelector(".button-group");
    if (buttons) buttons.remove();

    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.top = "0";
    element.style.width = `${reportRef.current.offsetWidth}px`;
    document.body.appendChild(element);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    document.body.removeChild(element);

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("root-cause-analysis.pdf");
  };

  return (
    <>
      <div className="card-custom mb-0 pe-0 ps-0" ref={reportRef}>
        <h5>Root Cause Analysis</h5>

        <div className="table-responsive mb-30">
          <table className="table">
            <thead>
              <tr>
                <th className="name">Root Cause</th>
                <th className="w-sm">Probability</th>
                <th className="w-md">Contributing Factors</th>
                <th className="w-md">Root Cause Explanation</th>
                <th className="w-lg">Key Insights for RCA</th> {/* ✅ new column */}
              </tr>
            </thead>
            <tbody>
              {rootCauses.map((item, index) => (
                <tr key={index}>
                  <td>{item.cause}</td>
                  <td>{item.probability}</td>
                  <td>{item.factors}</td>
                  <td>{item.explanation}</td>
                  <td>{item.keyInsightForRCA}</td> {/* ✅ display new field */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h5>Recommendations</h5>
        <div className="term-innr mb-30">
          <p>
            <strong>Short Term:</strong> {recommendations.shortTerm}
          </p>
          <p>
            <strong>Long Term:</strong> {recommendations.longTerm}
          </p>
        </div>

        <h5>Standards / References</h5>
        <div className="term-innr mb-30">
          <ul>
            {references.map((ref, index) => (
              <li key={index}>
                <strong>{ref.title}</strong> {ref.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center button-group">
          <button className="btn btn-primary" onClick={handleDownloadPDF}>
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
        <EmailPopup data={data} onClose={() => setShowEmailPopup(false)} />
      )}
    </>
  );
};

export default Result;