import { useEffect, useRef, useState } from 'react';
import './Stack.css';

const ConceptIcon = ({ type }) => {
    switch (type) {
        case 'sql':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <ellipse cx="12" cy="5" rx="8" ry="3" />
                    <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
                    <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
                </svg>
            );
        case 'api':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M8 7l-5 5 5 5" />
                    <path d="M16 7l5 5-5 5" />
                    <path d="M14 4l-4 16" />
                </svg>
            );
        case 'concurrency':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="4" y="4" width="6" height="6" rx="1.5" />
                    <rect x="14" y="4" width="6" height="6" rx="1.5" />
                    <rect x="4" y="14" width="6" height="6" rx="1.5" />
                    <rect x="14" y="14" width="6" height="6" rx="1.5" />
                    <path d="M10 7h4M7 10v4M17 10v4M10 17h4" />
                </svg>
            );
        case 'security':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z" />
                    <path d="M9.5 12l1.8 1.8 3.5-3.6" />
                </svg>
            );
        default:
            return null;
    }
};

const Stack = ({ isActive }) => {
    const containerRef = useRef(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const activeSlideRef = useRef(0);
    const isAnimatingRef = useRef(false);
    const touchStartYRef = useRef(0);

    const stackGroups = [
        {
            tag: '03 // LANGUAGES',
            headingBefore: 'Core ',
            headingAccent: 'Languages',
            description:
                'Typed, object-oriented, and systems languages used across coursework, algorithms, and production web apps.',
            tools: [
                {
                    name: 'Java',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg'
                },
                {
                    name: 'Python',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg'
                },
                {
                    name: 'JavaScript (ES6+)',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg'
                },
                {
                    name: 'TypeScript',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg'
                },
                {
                    name: 'C++',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg'
                },
                {
                    name: 'C#',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg'
                },
                {
                    name: 'SQL',
                    concept: 'sql'
                }
            ]
        },
        {
            tag: '03 // FRONTEND',
            headingBefore: 'Client & ',
            headingAccent: 'Interfaces',
            description:
                'Component-driven and server-rendered UI tools focused on clean structure, responsiveness, and fast load times.',
            tools: [
                {
                    name: 'React.js',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg'
                },
                {
                    name: 'HTML5',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg'
                },
                {
                    name: 'CSS3',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg'
                },
                {
                    name: 'Tailwind CSS',
                    icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4'
                },
                {
                    name: 'Thymeleaf',
                    icon: 'https://cdn.simpleicons.org/thymeleaf/005F0F'
                },
                {
                    name: 'Bootstrap',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg'
                },
                {
                    name: 'Vite',
                    icon: 'https://cdn.simpleicons.org/vite/646CFF'
                }
            ]
        },
        {
            tag: '03 // BACKEND & APIS',
            headingBefore: 'Server & ',
            headingAccent: 'Architecture',
            description:
                'Backend frameworks and concurrent patterns powering REST services, edu-tech platforms, and retail systems.',
            tools: [
                {
                    name: 'Spring Boot',
                    icon: 'https://cdn.simpleicons.org/springboot/6DB33F'
                },
                {
                    name: 'Spring MVC',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg'
                },
                {
                    name: 'ASP.NET Web Forms',
                    icon: 'https://cdn.simpleicons.org/dotnet/512BD4'
                },
                {
                    name: 'REST APIs',
                    concept: 'api'
                },
                {
                    name: 'Multithreading & Concurrency',
                    concept: 'concurrency'
                }
            ]
        },
        {
            tag: '03 // DATA, CLOUD & SECURITY',
            headingBefore: 'Infrastructure & ',
            headingAccent: 'Security',
            description:
                'Relational and cloud databases paired with version control, live hosting, and cybersecurity fundamentals.',
            tools: [
                {
                    name: 'MS SQL Server',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-plain.svg'
                },
                {
                    name: 'Firebase & Firestore',
                    icon: 'https://cdn.simpleicons.org/firebase/DD2C00'
                },
                {
                    name: 'Git',
                    icon: 'https://cdn.simpleicons.org/git/F05032'
                },
                {
                    name: 'GitHub',
                    icon: 'https://cdn.simpleicons.org/github/FFFFFF'
                },
                {
                    name: 'Microsoft Azure',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg'
                },
                {
                    name: 'Vercel',
                    icon: 'https://cdn.simpleicons.org/vercel/FFFFFF'
                },
                {
                    name: 'Cloudflare',
                    icon: 'https://cdn.simpleicons.org/cloudflare/F38020'
                },
                {
                    name: 'Network & App Security',
                    concept: 'security'
                }
            ]
        }
    ];

    const goToSlide = (nextIndex) => {
        activeSlideRef.current = nextIndex;
        setActiveSlide(nextIndex);
        isAnimatingRef.current = true;
        setTimeout(() => {
            isAnimatingRef.current = false;
        }, 600);
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el || !isActive) return;

        const handleWheel = (e) => {
            if (Math.abs(e.deltaY) < 10) return;

            const current = activeSlideRef.current;
            const scrollingDown = e.deltaY > 0;
            const scrollingUp = e.deltaY < 0;

            if (scrollingDown && current < stackGroups.length - 1) {
                e.preventDefault();
                e.stopPropagation();
                if (!isAnimatingRef.current) {
                    goToSlide(current + 1);
                }
            } else if (scrollingUp && current > 0) {
                e.preventDefault();
                e.stopPropagation();
                if (!isAnimatingRef.current) {
                    goToSlide(current - 1);
                }
            }
        };

        const handleTouchStart = (e) => {
            touchStartYRef.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            const deltaY = touchStartYRef.current - e.touches[0].clientY;
            if (Math.abs(deltaY) < 25) return;

            const current = activeSlideRef.current;
            const swipingDown = deltaY > 0;
            const swipingUp = deltaY < 0;

            if (swipingDown && current < stackGroups.length - 1) {
                e.preventDefault();
                e.stopPropagation();
                if (!isAnimatingRef.current) {
                    goToSlide(current + 1);
                    touchStartYRef.current = e.touches[0].clientY;
                }
            } else if (swipingUp && current > 0) {
                e.preventDefault();
                e.stopPropagation();
                if (!isAnimatingRef.current) {
                    goToSlide(current - 1);
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
    }, [isActive, stackGroups.length]);

    return (
        <div ref={containerRef} className="Stack">
            <div className="stack-wrapper">
                {/* Minimal Top Step Bars */}
                <div className="stack-dots" aria-label="Tech Stack Categories">
                    {stackGroups.map((group, idx) => (
                        <button
                            key={group.tag}
                            type="button"
                            className={`stack-dot ${activeSlide === idx ? 'active' : ''}`}
                            onClick={() => goToSlide(idx)}
                            aria-label={group.headingAccent}
                        />
                    ))}
                </div>

                {/* Stacked Category Stage */}
                <div className="stack-stage">
                    {stackGroups.map((group, index) => {
                        let positionClass = 'is-next';
                        if (index === activeSlide) positionClass = 'is-visible';
                        else if (index < activeSlide) positionClass = 'is-prev';

                        return (
                            <div
                                key={group.tag}
                                className={`stack-slide ${positionClass}`}
                                aria-hidden={activeSlide !== index}
                            >
                                <p className="stack-eyebrow">{group.tag}</p>
                                <h2 className="stack-heading">
                                    {group.headingBefore}
                                    <span className="stack-heading-accent">{group.headingAccent}</span>
                                </h2>
                                <p className="stack-lead">{group.description}</p>

                                <div className="stack-pills">
                                    {group.tools.map((tool) => (
                                        <div key={tool.name} className="stack-pill">
                                            {tool.icon ? (
                                                <img
                                                    src={tool.icon}
                                                    alt=""
                                                    aria-hidden="true"
                                                    className="stack-pill-icon"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="stack-pill-concept" aria-hidden="true">
                                                    <ConceptIcon type={tool.concept} />
                                                </div>
                                            )}
                                            <span className="stack-pill-label">{tool.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Stack;