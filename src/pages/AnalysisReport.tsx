import Result from '../components/Result'
import AnalysisForm from '../components/AnalysisForm'
const AnalysisReport = () => {
    return (
        <div className="analysis-report">
            <div className="container">
                <AnalysisForm />
                <Result />
            </div>
        </div>
    );
};

export default AnalysisReport;