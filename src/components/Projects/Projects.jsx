import { useEffect, useRef, useState } from 'react';
import './Projects.css';

const Projects = ({ isActive }) => {
    const containerRef = useRef(null);
    const [activeProject, setActiveProject] = useState(0);
    const activeProjectRef = useRef(0);
    const isAnimatingRef = useRef(false);
    const touchStartYRef = useRef(0);

    const projects = [
        {
            number: '01',
            titleBefore: 'ForeverFresh ',
            titleAccent: 'Web & POS',
            category: 'Full-Stack E-Commerce & Retail System',
            image: '/projects/foreverfresh.png', // Replace with your screenshot in /public/projects/
            description:
                'Full-stack retail point-of-sale and cloud e-commerce storefront featuring dynamic catalog filtering, shopping cart state, relational stock tracking, and automated order receipts.',
            tech: ['C#', 'ASP.NET Web Forms', 'MS SQL Server', 'Microsoft Azure'],
            liveUrl: 'https://ist-wst-group-11.azurewebsites.net/',
            repoUrl: 'https://github.com/MveloKhumalo'
        },
        {
            number: '02',
            titleBefore: 'Pracillance ',
            titleAccent: 'Edu-Tech',
            category: 'Production Learning Platform (300+ Students)',
            image: '/projects/pracillance.png',
            description:
                'Co-developed an educational technology web platform serving over 300 UKZN students with structured tutoring workflows, server-rendered views, and continuous Agile releases.',
            tech: ['Java', 'Spring Boot', 'Spring MVC', 'Thymeleaf', 'SQL'],
            liveUrl: 'https://pracillence.com',
            repoUrl: 'https://github.com/MveloKhumalo'
        },
        {
            number: '03',
            titleBefore: 'QUIZZEZ ',
            titleAccent: 'Platform',
            category: 'Interactive Assessment Web App',
            image: '/projects/quizzez.png',
            description:
                'Multi-subject interactive quiz application delivering real-time scoring, instant feedback, and performance analytics powered by modular OOP JavaScript and clean state management.',
            tech: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'Vercel', 'Cloudflare'],
            liveUrl: 'https://quizzez.co.za',
            repoUrl: 'https://github.com/MveloKhumalo'
        },
        {
            number: '04',
            titleBefore: 'COMP315 ',
            titleAccent: 'Concurrency',
            category: 'Multithreaded Systems Engineering',
            image: '/projects/concurrency.png',
            description:
                'High-throughput C++ concurrent processing engine engineered with threads, mutexes, locks, and condition variables to prevent race conditions and deadlocks.',
            tech: ['C++', 'Multithreading', 'Synchronization', 'Systems Design'],
            liveUrl: null,
            repoUrl: 'https://github.com/MveloKhumalo'
        },
        {
            number: '05',
            titleBefore: 'CryptoFarm ',
            titleAccent: 'Simulator',
            category: 'Real-Time API & Cloud Web App',
            image: '/projects/cryptofarm.png',
            description:
                'Interactive cryptocurrency simulation consuming live CoinGecko market feeds with Firebase authentication, Firestore cloud persistence, and gamified leaderboards.',
            tech: ['React.js', 'TypeScript', 'Tailwind CSS', 'Firebase', 'REST API'],
            liveUrl: null,
            repoUrl: 'https://github.com/MveloKhumalo'
        }
    ];

    const goToProject = (nextIndex) => {
        activeProjectRef.current = nextIndex;
        setActiveProject(nextIndex);
        isAnimatingRef.current = true;
        setTimeout(() => {
            isAnimatingRef.current = false;
        }, 580);
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el || !isActive) return;

        const handleWheel = (e) => {
            if (Math.abs(e.deltaY) < 10) return;

            const current = activeProjectRef.current;
            const scrollingDown = e.deltaY > 0;
            const scrollingUp = e.deltaY < 0;

            if (scrollingDown && current < projects.length - 1) {
                e.preventDefault();
                e.stopPropagation();
                if (!isAnimatingRef.current) {
                    goToProject(current + 1);
                }
            } else if (scrollingUp && current > 0) {
                e.preventDefault();
                e.stopPropagation();
                if (!isAnimatingRef.current) {
                    goToProject(current - 1);
                }
            }
        };

        const handleTouchStart = (e) => {
            touchStartYRef.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            const deltaY = touchStartYRef.current - e.touches[0].clientY;
            if (Math.abs(deltaY) < 25) return;

            const current = activeProjectRef.current;
            const swipingDown = deltaY > 0;
            const swipingUp = deltaY < 0;

            if (swipingDown && current < projects.length - 1) {
                e.preventDefault();
                e.stopPropagation();
                if (!isAnimatingRef.current) {
                    goToProject(current + 1);
                    touchStartYRef.current = e.touches[0].clientY;
                }
            } else if (swipingUp && current > 0) {
                e.preventDefault();
                e.stopPropagation();
                if (!isAnimatingRef.current) {
                    goToProject(current - 1);
                    touchStartYRef.current = e.touches[0].clientY;
                }
            }
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        el.addEventListener('touchstart', handleTouchStart, { passive: true });
        el.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            el.removeEventListener('wheel', handleWheel);
            el.removeEventListener('touchstart', handleTouchStart);
            el.removeEventListener('touchmove', handleTouchMove);
        };
    }, [isActive, projects.length]);

    const current = projects[activeProject];

    return (
        <div ref={containerRef} className="Projects">
            <div className="projects-stage">
                {/* Left Visual Preview Frame */}
                <div className="project-preview-card">
                    <div className="project-browser-bar">
                        <span className="browser-dot" />
                        <span className="browser-dot" />
                        <span className="browser-dot" />
                        <span className="browser-url">
                            {current.liveUrl
                                ? current.liveUrl.replace(/^https?:\/\//, '')
                                : `github.com/MveloKhumalo`}
                        </span>
                    </div>

                    <div key={activeProject} className="project-media-wrapper">
                        <img
                            src={current.image}
                            alt={`${current.titleBefore}${current.titleAccent} preview`}
                            className="project-screenshot"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="project-fallback-banner">
                            <span className="fallback-num">{current.number}</span>
                            <span className="fallback-name">
                                {current.titleBefore}
                                {current.titleAccent}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Project Narrative & Switcher */}
                <div className="project-info">
                    {/* Top Project Step Pills */}
                    <div className="project-switcher" aria-label="Select Project">
                        {projects.map((proj, idx) => (
                            <button
                                key={proj.number}
                                type="button"
                                className={`project-tab ${activeProject === idx ? 'active' : ''}`}
                                onClick={() => goToProject(idx)}
                            >
                                {proj.number}
                            </button>
                        ))}
                    </div>

                    <div key={`info-${activeProject}`} className="project-details">
                        <p className="project-eyebrow">04 // {current.category.toUpperCase()}</p>
                        <h2 className="project-heading">
                            {current.titleBefore}
                            <span className="project-heading-accent">{current.titleAccent}</span>
                        </h2>
                        <p className="project-description">{current.description}</p>

                        <div className="project-tags">
                            {current.tech.map((item) => (
                                <span key={item} className="project-tag">
                                    {item}
                                </span>
                            ))}
                        </div>

                        <div className="project-actions">
                            {current.liveUrl && (
                                <a
                                    href={current.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-btn project-btn--primary"
                                >
                                    Live Demo ↗
                                </a>
                            )}
                            <a
                                href={current.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-btn project-btn--ghost"
                            >
                                Source Code
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Projects;