import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import Intro from './components/Intro/Intro';
import Navbar from './components/Navbar/Navbar';
import Story from './components/Story/Story';
import Experience from './components/Experience/Experience';
import Stack from './components/Stack/Stack';
import Projects from './components/Projects/Projects';
import Terminal from './components/Terminal/Terminal';

import { useGlobalState } from './hooks/useGlobalState.jsx';

import './App.css';


const App = () => {

    // Local state — only App needs this
    const [activeSection, setActiveSection] = useState(0);

    // Global state — any component can access this
    const {
        isTerminalOpen
    } = useGlobalState();

    const containerRef = useRef(null);
    const savedScroll = useRef(0);

    // Keep track of where the user is while the website is on screen
    const handleScroll = (e) => {
        savedScroll.current = e.currentTarget.scrollTop;
    };

    // When the website comes back, jump to the saved position before the browser paints
    useLayoutEffect(() => {
        if (isTerminalOpen) return;

        containerRef.current?.scrollTo({
            top: savedScroll.current,
            behavior: 'instant'   // your CSS has scroll-behavior: smooth, so without this it would animate down from the top
        });
    }, [isTerminalOpen]);


    useEffect(() => {

        // No sections exist while the terminal is open, so there is nothing to observe
        if (isTerminalOpen) return;

        const sections = document.querySelectorAll('.page-section');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(Number(entry.target.dataset.index));
                    }
                });
            },
            { threshold: 0.6 }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();

    }, [isTerminalOpen]);

console.log('isTerminalOpen:', isTerminalOpen);
    return (

        isTerminalOpen ? (

            <div className="terminal">
                <Terminal />
            </div>

        ) : (

            <div className="app">

                <Navbar />

                <main
                    className="page-container"
                    ref={containerRef}
                    onScroll={handleScroll}
                >

                    <section
                        className={`page-section ${activeSection === 0 ? 'active' : ''
                            }`}
                        data-index="0"
                        id="home"
                    >
                        <Intro />
                    </section>


                    <section
                        className={`page-section ${activeSection === 1 ? 'active' : ''
                            }`}
                        data-index="1"
                        id="story"
                    >
                        <Story
                            isActive={activeSection === 1}
                        />
                    </section>


                    <section
                        className={`page-section ${activeSection === 2 ? 'active' : ''
                            }`}
                        data-index="2"
                        id="experience"
                    >
                        <Experience
                            isActive={activeSection === 2}
                        />
                    </section>


                    <section
                        className={`page-section ${activeSection === 3 ? 'active' : ''
                            }`}
                        data-index="3"
                        id="stack"
                    >
                        <Stack
                            isActive={activeSection === 3}
                        />
                    </section>


                    <section
                        className={`page-section ${activeSection === 4 ? 'active' : ''
                            }`}
                        data-index="4"
                        id="projects"
                    >
                        <Projects
                            isActive={activeSection === 4}
                        />
                    </section>

                </main>

            </div>

        )

    );
};


export default App;