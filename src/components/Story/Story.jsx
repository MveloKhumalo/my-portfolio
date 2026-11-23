import { useEffect, useRef, useState } from 'react';
import './Story.css';

const Story = ({ isActive }) => {
    const containerRef = useRef(null);
    const [activeChapter, setActiveChapter] = useState(0);
    const activeChapterRef = useRef(0);
    const isAnimatingRef = useRef(false);
    const touchStartYRef = useRef(0);

    const chapters = [
        {
            tag: '01 // MY STORY',
            headingBefore: 'From Classrooms in Dannhauser to ',
            headingAccent: 'Full-Stack Code',
            text: (
                <>
                    There exists a software engineer named <strong>Mvelo Khumalo</strong>—born in
                    Newcastle, raised on Annandale Farm in Dannhauser, and driven by a simple habit:
                    turning complex problems into clear, useful technology. At Mziwethu High School,
                    that curiosity for mathematics and physical sciences grew into finishing among
                    the top two learners in Grade 12 while tutoring classmates.
                </>
            )
        },
        {
            tag: '02 // THE SPARK',
            headingBefore: 'Discovering ',
            headingAccent: 'Software Engineering',
            text: (
                <>
                    That love for breaking down complex problems led me to the{' '}
                    <strong>University of KwaZulu-Natal</strong> to study Computer Science and
                    Information Technology. Writing my first programs showed me that code was the
                    fastest way to turn logic into real-world tools—moving quickly from classroom
                    exercises to building interactive web apps and student platforms.
                </>
            )
        },
        {
            tag: '03 // TODAY',
            headingBefore: 'Building, Mentoring & ',
            headingAccent: 'Shipping Software',
            text: (
                <>
                    Today, as a third-year BSc CS & IT student, I work as a UKZN demonstrator and
                    tutor for <strong>COMP100, COMP107, and COMP200</strong> while building
                    full-stack applications across React, Java, Spring Boot, Python, and C#—from
                    co-developing <strong>Pracillance</strong> and running <strong>QUIZZEZ</strong>{' '}
                    to engineering <strong>JobHawk</strong> and <strong>Forever Fresh POS</strong>.
                </>
            )
        },
        {
            tag: '04 // THE FUTURE',
            headingBefore: 'Scaling Toward ',
            headingAccent: 'Systems & Security',
            text: (
                <>
                    Next, I am pursuing my Computer Science Honours and growing into a{' '}
                    <strong>Full-Stack Software Engineer</strong> and cybersecurity-minded
                    architect—focused on building secure, scalable software that empowers learners,
                    businesses, and everyday communities across South Africa and beyond.
                </>
            )
        }
    ];

    const goToChapter = (nextIndex) => {
        activeChapterRef.current = nextIndex;
        setActiveChapter(nextIndex);
        isAnimatingRef.current = true;
        setTimeout(() => {
            isAnimatingRef.current = false;
        }, 650); // Matches CSS fade transition + trackpad inertia cooldown
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el || !isActive) return;

        const handleWheel = (e) => {
            if (Math.abs(e.deltaY) < 10) return;

            const current = activeChapterRef.current;
            const scrollingDown = e.deltaY > 0;
            const scrollingUp = e.deltaY < 0;

            // Block .page-container from snapping if there are still chapters in that direction
            if (scrollingDown && current < chapters.length - 1) {
                e.preventDefault();
                e.stopPropagation();
                if (!isAnimatingRef.current) {
                    goToChapter(current + 1);
                }
            } else if (scrollingUp && current > 0) {
                e.preventDefault();
                e.stopPropagation();
                if (!isAnimatingRef.current) {
                    goToChapter(current - 1);
                }
            }
            // If scrollingDown at last chapter OR scrollingUp at first chapter:
            // Do NOT preventDefault — let .page-container snap naturally to Experience or Intro!
        };

        const handleTouchStart = (e) => {
            touchStartYRef.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            const deltaY = touchStartYRef.current - e.touches[0].clientY;
            if (Math.abs(deltaY) < 25) return;

            const current = activeChapterRef.current;
            const swipingDown = deltaY > 0; // finger moves up -> scroll down
            const swipingUp = deltaY < 0;   // finger moves down -> scroll up

            if (swipingDown && current < chapters.length - 1) {
                e.preventDefault();
                e.stopPropagation();
                if (!isAnimatingRef.current) {
                    goToChapter(current + 1);
                    touchStartYRef.current = e.touches[0].clientY;
                }
            } else if (swipingUp && current > 0) {
                e.preventDefault();
                e.stopPropagation();
                if (!isAnimatingRef.current) {
                    goToChapter(current - 1);
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
    }, [isActive, chapters.length]);

    return (
        <div ref={containerRef} className="story">
            <div className="story-stage">
                {chapters.map((chapter, index) => (
                    <div
                        key={chapter.tag}
                        className={`story-container ${
                            activeChapter === index ? 'is-visible' : 'is-hidden'
                        }`}
                        aria-hidden={activeChapter !== index}
                    >
                        <span className="story-eyebrow">{chapter.tag}</span>
                        <h2 className="story-heading">
                            {chapter.headingBefore}
                            <span>{chapter.headingAccent}</span>
                        </h2>
                        <p className="story-lead">{chapter.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Story;