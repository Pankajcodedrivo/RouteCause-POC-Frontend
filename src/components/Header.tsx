import { useState } from 'react';
import logo from '../assets/images/logo.svg'
import FeedbackPopup from './FeedbackPopup';
const Header = () => {
    const [showPopup, setShowPopup] = useState(false);
    return (
        <header className="header text-center">
            <div className="container">
                <div className="logo">
                    <img src={logo} alt="" />
                </div>
                <h1>
                    Root Cause Analysis <span>(Powered by AI)</span>
                </h1>
                <p>
                    Identify and resolve issues faster with intelligent AI-driven insights.
                </p>
                <div className="feedback-btn">
                    <button className="btn btn-primary" onClick={() => setShowPopup(true)}>Feedback</button>
                </div>
            </div>
            {/* Popup */}
            {showPopup && (
                <FeedbackPopup
                    onClose={() => setShowPopup(false)}
                />
            )}
        </header>
        
    );
};

export default Header;