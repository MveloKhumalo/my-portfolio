import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Experience.css';

const Experience = ({ isActive }) => {
    const containerRef = useRef(null);
    const stageRef = useRef(null);
    const cardRef = useRef(null);
    const connectorRef = useRef(null);
    const trackRef = useRef(null);
    const nodeRefs = useRef([]);
    const dotRefs = useRef([]);

    const [activeIndex, setActiveIndex] = useState(0);
    const activeIndexRef = useRef(0);
    const isAnimatingRef = useRef(false);
    const touchStartYRef = useRef(0);

    const experiences = [
        {
            role: 'COMP100 Class Representative',
            organization: 'University of KwaZulu-Natal',
            period: 'Feb 2024 — Jun 2026',
            summary:
                'Served as the academic liaison for 300+ first-year Introduction to Computer Science students at UKZN, bridging communication between students and lecturing staff while resolving academic and administrative bottlenecks.',
            skills: [
                'Communicated complex administrative and academic processes clearly to 300+ first-year students.',
                'Collaborated with faculty to identify process gaps, gather requirements, and implement practical solutions.',
                'Demonstrated analytical thinking, leadership, and proactive problem-solving across multiple semesters.'
            ]
        },
        {
            role: 'Founder & Software Developer',
            organization: 'QUIZZEZ (Interactive Quiz Platform)',
            period: '2026',
            summary:
                'Designed, built, and deployed QUIZZEZ (quizzez.co.za), a multi-subject interactive web quiz platform featuring real-time scoring, performance analytics, and responsive study workflows.',
            skills: [
                'Engineered modular Object-Oriented JavaScript (ES6+), HTML5, and CSS3 with structured client-side state management.',
                'Implemented real-time scoring, instant feedback loops, and performance analytics across multiple subjects.',
                'Managed end-to-end deployment, routing, and version control best practices throughout the full SDLC.'
            ]
        },
        {
            role: 'Full Stack Software Engineer (Part-Time)',
            organization: 'Pro-Academy / Pracillance',
            period: 'Jun 2025 — Present',
            summary:
                'Co-developed an educational technology web platform serving over 300 UKZN students, leading full-stack feature development, testing, and production deployments.',
            skills: [
                'Built scalable backend controllers, services, and integrations using Java (Spring Boot, Spring MVC) and Thymeleaf.',
                'Delivered full-stack updates from responsive UI design to database integration based on real student feedback.',
                'Practised Agile workflows, Git version control, defect documentation, and continuous product iteration.'
            ]
        },
        {
            role: 'COMP200 Lab Demonstrator',
            organization: 'University of KwaZulu-Natal',
            period: 'Feb 2026 — Jun 2026',
            summary:
                'Supported second-year Object-Oriented Programming and Data Structures practical laboratories for 300+ students at UKZN, translating theoretical concepts into working code.',
            skills: [
                'Guided 300+ students through programming concepts, code debugging, and structured lab exercises.',
                'Collaborated with lecturing staff to facilitate lab sessions, answer technical queries, and provide timely feedback.',
                'Strengthened technical communication and problem-solving in a fast-paced academic lab environment.'
            ]
        },
        {
            role: 'COMP107 Lab Demonstrator',
            organization: 'University of KwaZulu-Natal',
            period: '2026',
            summary:
                'Mentored first-year undergraduate students during scheduled COMP107 computer science laboratory tutorials, helping learners build strong foundational programming habits.',
            skills: [
                'Walked students step-by-step through foundational programming exercises and systematic debugging workflows.',
                'Reinforced clean code structure, logical problem decomposition, and independent troubleshooting.',
                'Assisted academic staff with lab facilitation and student tutorial support at UKZN.'
            ]
        },
        {
            role: 'COMP315 Project — Multithreading & Concurrency',
            organization: 'University of KwaZulu-Natal (Advanced Programming)',
            period: '2026',
            summary:
                'Engineered a high-performance C++ concurrent system for the COMP315 Advanced Programming module (94% module grade), focusing on thread synchronization, parallel execution, and safe resource sharing.',
            skills: [
                'Implemented multi-threaded execution pipelines in C++ using threads, mutexes, locks, and condition variables.',
                'Prevented race conditions and deadlocks while optimizing throughput across concurrent workloads.',
                'Applied low-level memory management, modular C++ architecture, and rigorous stress testing.'
            ]
        },
        {
            role: 'ISTN3AS Project — ForeverFresh POS',
            organization: 'University of KwaZulu-Natal (System Implementation I)',
            period: '2026',
            summary:
                'Developed ForeverFresh POS, a full-stack point-of-sale desktop/web management system built for retail inventory tracking, order processing, and automated customer receipts.',
            skills: [
                'Engineered transactional POS workflows, stock management, and relational persistence in C# ASP.NET & MS SQL Server.',
                'Integrated automated order confirmation and receipt workflows alongside role-based operational controls.',
                'Translated system analysis models and business rules into a reliable, production-style retail application.'
            ]
        },
        {
            role: 'ISTN3SI Project — ForeverFresh Website',
            organization: 'University of KwaZulu-Natal (System Implementation II)',
            period: '2026',
            link: 'https://ist-wst-group-11.azurewebsites.net/',
            summary:
                'Co-developed and deployed the ForeverFresh e-commerce web application on Microsoft Azure (ist-wst-group-11.azurewebsites.net), enabling customers to browse dynamic product catalogs and place online orders.',
            skills: [
                'Built dynamic catalog browsing, category filtering, shopping cart state, and checkout workflows in ASP.NET Web Forms & C#.',
                'Connected frontend catalog controls to a live MS SQL Server database and deployed to Azure App Service.',
                'Collaborated in a software implementation team to deliver a live, cloud-hosted e-commerce storefront.'
            ]
        }
    ];

    const goToExperience = (nextIndex) => {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        isAnimatingRef.current = true;
        setTimeout(() => {
            isAnimatingRef.current = false;
        }, 580);
    };

    // Translate the scrollbar track upward so the active node stays centered
    // while passed nodes slide up/fade out and upcoming nodes enter from below
    const syncTimelinePosition = () => {
        const stageEl = stageRef.current;
        const cardEl = cardRef.current;
        const connectorEl = connectorRef.current;
        const trackEl = trackRef.current;
        const idx = activeIndexRef.current;
        const activeNode = nodeRefs.current[idx];
        const activeDot = dotRefs.current[idx];

        if (!stageEl || !cardEl || !trackEl || !activeNode || !activeDot) return;

        // Center the active node inside the 75vh timeline viewport
        const viewportHeight = cardEl.offsetHeight;
        const nodeCenter = activeNode.offsetTop + activeNode.offsetHeight / 2;
        const targetOffset = viewportHeight / 2 - nodeCenter;

        trackEl.style.transform = `translateY(${targetOffset}px)`;

        // Connect card right edge directly to the centered active dot
        if (!connectorEl) return;
        if (window.innerWidth <= 920) {
            connectorEl.style.display = 'none';
            return;
        }

        const stageRect = stageEl.getBoundingClientRect();
        const cardRect = cardEl.getBoundingClientRect();
        const dotRect = activeDot.getBoundingClientRect();

        const startX = cardRect.right - stageRect.left;
        const endX = dotRect.left + dotRect.width / 2 - stageRect.left;
        const centerY = stageRect.height / 2;

        connectorEl.style.display = 'block';
        connectorEl.style.left = `${startX}px`;
        connectorEl.style.top = `${centerY}px`;
        connectorEl.style.width = `${Math.max(0, endX - startX)}px`;
    };

    useLayoutEffect(() => {
        syncTimelinePosition();
    }, [activeIndex]);

    useEffect(() => {
        window.addEventListener('resize', syncTimelinePosition);
        const timer = setTimeout(syncTimelinePosition, 80);
        return () => {
            window.removeEventListener('resize', syncTimelinePosition);
            clearTimeout(timer);
        };
    }, []);

    // Lock section scroll until all 8 experiences have been scrolled through
    useEffect(() => {
        const el = containerRef.current;
        if (!el || !isActive) return;

        const handleWheel = (e) => {
            if (Math.abs(e.deltaY) < 10) return;

            const current = activeIndexRef.current;
            const scrollingDown = e.deltaY > 0;
            const scrollingUp = e.deltaY < 0;

            if (scrollingDown && current < experiences.length - 1) {
                e.preventDefault();
                e.stopPropagation();
                if (!isAnimatingRef.current) {
                    goToExperience(current + 1);
                }
            } else if (scrollingUp && current > 0) {
                e.preventDefault();
                e.stopPropagation();
                if (!isAnimatingRef.current) {
                    goToExperience(current - 1);
                }
            }
        };

        const handleTouchStart = (e) => {
            touchStartYRef.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            const deltaY = touchStartYRef.current - e.touches[0].clientY;
            if (Math.abs(deltaY) < 25) return;

            const current = activeIndexRef.current;
            const swipingDown = deltaY > 0;
            const swipingUp = deltaY < 0;

            if (swipingDown && current < experiences.length - 1) {
                e.preventDefault();
                e.stopPropagation();
                if (!isAnimatingRef.current) {
                    goToExperience(current + 1);
                    touchStartYRef.current = e.touches[0].clientY;
                }
            } else if (swipingUp && current > 0) {
                e.preventDefault();
                e.stopPropagation();
                if (!isAnimatingRef.current) {
                    goToExperience(current - 1);
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
    }, [isActive, experiences.length]);

    const currentExp = experiences[activeIndex];

    return (
        <div ref={containerRef} className="Experience">
            <div ref={stageRef} className="exp-stage">
                {/* Connector Line from 75vh Card to Active Scrollbar Node */}
                <div ref={connectorRef} className="exp-connector" aria-hidden="true" />

                {/* Left Glossy 75% Height Experience Detail Card */}
                <article ref={cardRef} className="exp-card">
                    <div key={activeIndex} className="exp-card-body">
                        <div className="exp-card-header">
                            <div>
                                <span className="exp-counter">
                                    0{activeIndex + 1} / 0{experiences.length}
                                </span>
                                <h3 className="exp-role">{currentExp.role}</h3>
                                <div className="exp-org">
                                    {currentExp.organization}
                                    {currentExp.link && (
                                        <>
                                            {' • '}
                                            <a
                                                href={currentExp.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="exp-link"
                                            >
                                                Live Site ↗
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                            <span className="exp-date">{currentExp.period}</span>
                        </div>

                        <div className="exp-block">
                            <span className="exp-label">Overview</span>
                            <p className="exp-summary">{currentExp.summary}</p>
                        </div>

                        <div className="exp-block">
                            <span className="exp-label">Key Contributions &amp; Skills</span>
                            <ul className="exp-skills">
                                {currentExp.skills.map((skill) => (
                                    <li key={skill}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </article>

                {/* Right Scrollbar-Style Vertical Timeline with Fading Top & Bottom */}
                <aside className="exp-timeline-viewport" aria-label="Experience Timeline">
                    {/* Vertical Scrollbar Track Line */}
                    <div className="exp-scrollbar-rail" aria-hidden="true">
                        <div
                            className="exp-scrollbar-thumb"
                            style={{
                                height: `${100 / experiences.length}%`,
                                top: `${(activeIndex / experiences.length) * 100}%`
                            }}
                        />
                    </div>

                    {/* Sliding Track of Nodes */}
                    <div ref={trackRef} className="exp-timeline-track">
                        {experiences.map((item, idx) => {
                            const isSelected = idx === activeIndex;
                            const isPassed = idx < activeIndex;
                            const distance = Math.abs(idx - activeIndex);

                            let stateClass = 'upcoming';
                            if (isSelected) stateClass = 'active';
                            else if (isPassed) stateClass = 'passed';

                            return (
                                <div
                                    key={`${item.role}-${item.period}`}
                                    ref={(el) => (nodeRefs.current[idx] = el)}
                                    className={`exp-node ${stateClass} dist-${Math.min(distance, 3)}`}
                                >
                                    <button
                                        ref={(el) => (dotRefs.current[idx] = el)}
                                        type="button"
                                        className="exp-dot"
                                        aria-label={`Select ${item.role}`}
                                        aria-pressed={isSelected}
                                        onClick={() => goToExperience(idx)}
                                    />

                                    <button
                                        type="button"
                                        className="exp-callout"
                                        onClick={() => goToExperience(idx)}
                                        tabIndex={isSelected ? -1 : 0}
                                    >
                                        <div className="callout-title">{item.role}</div>
                                        <div className="callout-meta">
                                            {item.organization} • {item.period}
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Experience;