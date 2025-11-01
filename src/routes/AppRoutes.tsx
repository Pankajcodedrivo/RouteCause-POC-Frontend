import { Routes, Route } from "react-router-dom";
import AnalysisReport from "../pages/AnalysisReport";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AnalysisReport />} />
    </Routes>
  );
}