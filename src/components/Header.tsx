import logo from '../assets/images/logo.svg'
const Header = () => {
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
            </div>
        </header>
    );
};

export default Header;