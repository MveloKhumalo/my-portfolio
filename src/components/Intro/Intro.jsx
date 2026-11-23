import './Intro.css';

const Intro = () => {
    return (
        <div className="intro-container">
            <div className="intro-content">
                <img
                    src="public/image.png"
                    alt="Mvelo Khumalo"
                    className="intro-avatar"
                />
                <div className="intro-text">
                    <h1 className="intro-title">
                        There exists a software engineer named{' '}
                        <span className="intro-name">Mvelo Khumalo</span>
                    </h1>
                    <p className="intro-description">
                        Whose journey began helping classmates master tough subjects in Dannhauser.
                        Today, as a UKZN Computer Science student and full-stack developer, he
                        turns that same passion into clean, impactful web applications.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Intro;