// Plain-text data used by the terminal commands.
//
// This mirrors the data in your website components, minus the JSX and icon URLs.
// If you would rather keep a single source of truth, move your arrays into a shared
// file, export them, and import them here and in your components.
//
// `slug` is the short name used by `select` and Tab completion.

export const profile = {
    name: 'Mvelo Khumalo',
    handle: 'mvelo',
    host: 'portfolio',
    role: 'Full-Stack Software Engineer',
    education:
        'BSc Computer Science & Information Technology (3rd year), University of KwaZulu-Natal',
    summary:
        'Software engineer from Dannhauser who turns complex problems into clear, useful technology. ' +
        'A UKZN demonstrator and tutor, building full-stack applications with React, Java, Spring Boot, Python and C#.',
    // Shown by the `contact` command. Add your email, LinkedIn, etc. here.
    links: [
        { label: 'GitHub', url: 'https://github.com/MveloKhumalo' },
        { label: 'QUIZZEZ', url: 'https://quizzez.co.za' },
        { label: 'ForeverFresh', url: 'https://ist-wst-group-11.azurewebsites.net/' }
    ]
};

export const projects = [
    {
        slug: 'foreverfresh',
        title: 'ForeverFresh Web & POS',
        category: 'Full-Stack E-Commerce & Retail System',
        description:
            'Full-stack retail point-of-sale and cloud e-commerce storefront featuring dynamic catalog filtering, shopping cart state, relational stock tracking, and automated order receipts.',
        tech: ['C#', 'ASP.NET Web Forms', 'MS SQL Server', 'Microsoft Azure'],
        liveUrl: 'https://ist-wst-group-11.azurewebsites.net/',
        repoUrl: 'https://github.com/MveloKhumalo'
    },
    {
        slug: 'pracillance',
        title: 'Pracillance Edu-Tech',
        category: 'Production Learning Platform (300+ Students)',
        description:
            'Co-developed an educational technology web platform serving over 300 UKZN students with structured tutoring workflows, server-rendered views, and continuous Agile releases.',
        tech: ['Java', 'Spring Boot', 'Spring MVC', 'Thymeleaf', 'SQL'],
        liveUrl: 'https://pracillence.com',
        repoUrl: 'https://github.com/MveloKhumalo'
    },
    {
        slug: 'quizzez',
        title: 'QUIZZEZ Platform',
        category: 'Interactive Assessment Web App',
        description:
            'Multi-subject interactive quiz application delivering real-time scoring, instant feedback, and performance analytics powered by modular OOP JavaScript and clean state management.',
        tech: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'Vercel', 'Cloudflare'],
        liveUrl: 'https://quizzez.co.za',
        repoUrl: 'https://github.com/MveloKhumalo'
    },
    {
        slug: 'comp315',
        title: 'COMP315 Concurrency',
        category: 'Multithreaded Systems Engineering',
        description:
            'High-throughput C++ concurrent processing engine engineered with threads, mutexes, locks, and condition variables to prevent race conditions and deadlocks.',
        tech: ['C++', 'Multithreading', 'Synchronization', 'Systems Design'],
        liveUrl: null,
        repoUrl: 'https://github.com/MveloKhumalo'
    },
    {
        slug: 'cryptofarm',
        title: 'CryptoFarm Simulator',
        category: 'Real-Time API & Cloud Web App',
        description:
            'Interactive cryptocurrency simulation consuming live CoinGecko market feeds with Firebase authentication, Firestore cloud persistence, and gamified leaderboards.',
        tech: ['React.js', 'TypeScript', 'Tailwind CSS', 'Firebase', 'REST API'],
        liveUrl: null,
        repoUrl: 'https://github.com/MveloKhumalo'
    }
];

export const experiences = [
    {
        slug: 'class-rep',
        title: 'COMP100 Class Representative',
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
        slug: 'quizzez',
        title: 'Founder & Software Developer',
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
        slug: 'pro-academy',
        title: 'Full Stack Software Engineer (Part-Time)',
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
        slug: 'comp200',
        title: 'COMP200 Lab Demonstrator',
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
        slug: 'comp107',
        title: 'COMP107 Lab Demonstrator',
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
        slug: 'comp315',
        title: 'COMP315 Project — Multithreading & Concurrency',
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
        slug: 'istn3as',
        title: 'ISTN3AS Project — ForeverFresh POS',
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
        slug: 'istn3si',
        title: 'ISTN3SI Project — ForeverFresh Website',
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

export const skillGroups = [
    {
        id: 'languages',
        name: 'Core Languages',
        description:
            'Typed, object-oriented, and systems languages used across coursework, algorithms, and production web apps.',
        tools: ['Java', 'Python', 'JavaScript (ES6+)', 'TypeScript', 'C++', 'C#', 'SQL']
    },
    {
        id: 'frontend',
        name: 'Client & Interfaces',
        description:
            'Component-driven and server-rendered UI tools focused on clean structure, responsiveness, and fast load times.',
        tools: ['React.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Thymeleaf', 'Bootstrap', 'Vite']
    },
    {
        id: 'backend',
        name: 'Server & Architecture',
        description:
            'Backend frameworks and concurrent patterns powering REST services, edu-tech platforms, and retail systems.',
        tools: [
            'Spring Boot',
            'Spring MVC',
            'ASP.NET Web Forms',
            'REST APIs',
            'Multithreading & Concurrency'
        ]
    },
    {
        id: 'infrastructure',
        name: 'Infrastructure & Security',
        description:
            'Relational and cloud databases paired with version control, live hosting, and cybersecurity fundamentals.',
        tools: [
            'MS SQL Server',
            'Firebase & Firestore',
            'Git',
            'GitHub',
            'Microsoft Azure',
            'Vercel',
            'Cloudflare',
            'Network & App Security'
        ]
    }
];

export const story = [
    {
        title: 'From Classrooms in Dannhauser to Full-Stack Code',
        text:
            'There exists a software engineer named Mvelo Khumalo—born in Newcastle, raised on Annandale Farm in Dannhauser, and driven by a simple habit: turning complex problems into clear, useful technology. At Mziwethu High School, that curiosity for mathematics and physical sciences grew into finishing among the top two learners in Grade 12 while tutoring classmates.'
    },
    {
        title: 'Discovering Software Engineering',
        text:
            'That love for breaking down complex problems led me to the University of KwaZulu-Natal to study Computer Science and Information Technology. Writing my first programs showed me that code was the fastest way to turn logic into real-world tools—moving quickly from classroom exercises to building interactive web apps and student platforms.'
    },
    {
        title: 'Building, Mentoring & Shipping Software',
        text:
            'Today, as a third-year BSc CS & IT student, I work as a UKZN demonstrator and tutor for COMP100, COMP107, and COMP200 while building full-stack applications across React, Java, Spring Boot, Python, and C#—from co-developing Pracillance and running QUIZZEZ to engineering JobHawk and Forever Fresh POS.'
    },
    {
        title: 'Scaling Toward Systems & Security',
        text:
            'Next, I am pursuing my Computer Science Honours and growing into a Full-Stack Software Engineer and cybersecurity-minded architect—focused on building secure, scalable software that empowers learners, businesses, and everyday communities across South Africa and beyond.'
    }
];