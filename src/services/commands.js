// Terminal command engine.
//
// The engine is plain JavaScript with no React in it:
//
//   executeCommand(input, { session, history }) -> { lines, session, action? }
//   complete(input, session)                    -> { value, lines }
//   getPrompt(session)                          -> { user, path }
//
// `session` holds the terminal's state (currently the selected project/experience).
// Every command is an entry in the `commands` array below, and `help` is generated
// from that same array, so adding a command there documents it automatically.
//
// A command's run() returns:
//   lines    array of output rows
//   session  (optional) the new session
//   action   (optional) { type: 'clear' | 'exit' | 'open', url? } handled by the component

import { profile, projects, experiences, skillGroups, story } from './terminalData';
import { useGlobalState } from '../hooks/useGlobalState';

/* ------------------------------------------------------------------ */
/*  Output helpers                                                     */
/* ------------------------------------------------------------------ */

// A row is a list of parts. Each part has text, a kind (colour) and optionally an href.
// Kinds: text | muted | heading | accent | success | error | path | link
const t = (value, kind = 'text', href) => ({ text: value, kind, href });
const row = (...parts) => ({ parts });
const plain = (value = '', kind = 'text') => row(t(value, kind));
const blank = () => plain('');
const fail = (value) => plain(value, 'error');
const kv = (label, value, kind = 'text', href) =>
    row(t(`  ${String(label).padEnd(9)}`, 'muted'), t(value, kind, href));

const pad = (value, width) => String(value).padEnd(width);
const num = (index) => String(index + 1).padStart(2, '0');
const [] = useGlobalState();

/* ------------------------------------------------------------------ */
/*  Session and collections                                            */
/* ------------------------------------------------------------------ */

export const initialSession = { selected: null };

const COLLECTIONS = {
    project: { type: 'project', label: 'project', plural: 'projects', folder: 'projects', list: projects },
    experience: {
        type: 'experience',
        label: 'experience',
        plural: 'experience',
        folder: 'experience',
        list: experiences
    }
};

const COLLECTION_ALIASES = {
    project: 'project',
    projects: 'project',
    p: 'project',
    experience: 'experience',
    experiences: 'experience',
    exp: 'experience'
};

const resolveCollection = (word = '') => COLLECTIONS[COLLECTION_ALIASES[word.toLowerCase()]];

const normalize = (value) => String(value).toLowerCase().replace(/[^a-z0-9]/g, '');

// Accepts "3", "03", "quizzez", or part of a name ("forever fresh")
const findIndexByQuery = (list, query) => {
    const q = query.trim().toLowerCase();
    if (!q) return -1;

    if (/^\d+$/.test(q)) {
        const n = parseInt(q, 10);
        return n >= 1 && n <= list.length ? n - 1 : -1;
    }

    const nq = normalize(q);
    if (!nq) return -1;

    const exact = list.findIndex((item) => normalize(item.slug) === nq);
    if (exact !== -1) return exact;

    return list.findIndex(
        (item) => normalize(item.slug).includes(nq) || normalize(item.title).includes(nq)
    );
};

const getSelected = (session) => {
    if (!session.selected) return null;
    const collection = COLLECTIONS[session.selected.type];
    const item = collection.list[session.selected.index];
    return item ? { collection, item, index: session.selected.index } : null;
};

export const getPrompt = (session) => {
    const selected = getSelected(session);
    return {
        user: `${profile.handle}@${profile.host}`,
        path: selected ? `~/${selected.collection.folder}/${selected.item.slug}` : '~'
    };
};

/* ------------------------------------------------------------------ */
/*  Reusable output builders                                           */
/* ------------------------------------------------------------------ */

const listProjects = () => {
    const lines = [plain('Projects', 'heading')];

    projects.forEach((project, i) => {
        lines.push(row(t(`  ${num(i)}  `, 'muted'), t(pad(project.slug, 14), 'accent'), t(project.title)));
        lines.push(plain(`      ${project.category}`, 'muted'));
    });

    lines.push(
        blank(),
        row(
            t('Run '),
            t('select project <number|name>', 'accent'),
            t(' to open one, then try '),
            t('info', 'accent'),
            t(' or '),
            t('skills', 'accent'),
            t('.')
        )
    );
    return lines;
};

const listExperience = () => {
    const lines = [plain('Experience', 'heading')];

    experiences.forEach((exp, i) => {
        lines.push(row(t(`  ${num(i)}  `, 'muted'), t(pad(exp.slug, 14), 'accent'), t(exp.title)));
        lines.push(plain(`      ${exp.organization} · ${exp.period}`, 'muted'));
    });

    lines.push(
        blank(),
        row(
            t('Run '),
            t('select experience <number|name>', 'accent'),
            t(' to see what that role involved.')
        )
    );
    return lines;
};

const listSkills = (filter) => {
    const q = (filter || '').toLowerCase();
    const groups = q
        ? skillGroups.filter((g) => g.id.includes(q) || g.name.toLowerCase().includes(q))
        : skillGroups;

    if (!groups.length) {
        return [
            fail(`list: no skill group matching '${filter}'`),
            plain(`Groups: ${skillGroups.map((g) => g.id).join(', ')}`, 'muted')
        ];
    }

    const lines = [];
    groups.forEach((group, i) => {
        if (i > 0) lines.push(blank());
        lines.push(row(t(group.name, 'heading'), t(`  (${group.id})`, 'muted')));
        lines.push(plain(group.description, 'muted'));
        lines.push(plain(`  ${group.tools.join(', ')}`));
    });

    if (!q) {
        lines.push(
            blank(),
            row(t('Filter with '), t('list skills <group>', 'accent'), t('.'))
        );
    }
    return lines;
};

const contactLines = () => [
    plain('Contact & links', 'heading'),
    ...profile.links.map((link) =>
        row(t(`  ${pad(link.label, 14)}`, 'muted'), t(link.url, 'link', link.url))
    )
];

const noSelection = () => [
    fail('No project or experience selected.'),
    row(t('Run '), t('select project <name>', 'accent'), t(' first, or '), t('list projects', 'accent'), t('.'))
];

/* ------------------------------------------------------------------ */
/*  Command registry                                                   */
/* ------------------------------------------------------------------ */

const commands = [
    /* ---------------- General ---------------- */
    {
        name: 'help',
        aliases: ['?', 'man'],
        group: 'General',
        usage: 'help [command]',
        description: 'Show this list, or details for one command',
        examples: ['help', 'help select'],
        complete: (args) => (args.length === 0 ? commands.filter((c) => !c.hidden).map((c) => c.name) : []),
        run: ([target]) => {
            if (target) {
                const cmd = findCommand(target.toLowerCase());
                if (!cmd || cmd.hidden) {
                    return {
                        lines: [
                            fail(`help: no help entry for '${target}'`),
                            plain("Type 'help' to see every command.", 'muted')
                        ]
                    };
                }

                const lines = [row(t(cmd.usage, 'accent')), plain(cmd.description)];
                if (cmd.aliases?.length) lines.push(plain(`Aliases: ${cmd.aliases.join(', ')}`, 'muted'));
                if (cmd.examples?.length) {
                    lines.push(blank(), plain('Examples', 'heading'));
                    cmd.examples.forEach((example) => lines.push(row(t('  $ ', 'muted'), t(example))));
                }
                return { lines };
            }

            const visible = commands.filter((c) => !c.hidden);
            const groups = [...new Set(visible.map((c) => c.group))];

            const lines = [
                plain("Mvelo's portfolio terminal", 'heading'),
                row(t('Type '), t('exit', 'accent'), t(' to leave the terminal and go back to the website.')),
                row(t('Type '), t('help <command>', 'accent'), t(' for details on a single command.')),
                row(t('Press '), t('Tab', 'accent'), t(' to autocomplete and '), t('↑ ↓', 'accent'), t(' to browse history.'))
            ];

            groups.forEach((group) => {
                lines.push(blank(), plain(group, 'heading'));
                visible
                    .filter((c) => c.group === group)
                    .forEach((c) => {
                        lines.push(row(t(`  ${pad(c.name, 11)}`, 'accent'), t(c.description, 'muted')));
                    });
            });

            return { lines };
        }
    },
    {
        name: 'exit',
        aliases: ['quit', 'logout'],
        group: 'General',
        usage: 'exit',
        description: 'Close the terminal and return to the website',
        examples: ['exit'],
        run: () => ({

            lines: [plain('logout', 'muted'), plain('Returning to the website…', 'muted')],
            action: { type: 'exit' }
        })
    },
    {
        name: 'clear',
        aliases: ['cls'],
        group: 'General',
        usage: 'clear',
        description: 'Clear the screen (Ctrl+L also works)',
        examples: ['clear'],
        run: () => ({ lines: [], action: { type: 'clear' } })
    },
    {
        name: 'history',
        group: 'General',
        usage: 'history',
        description: 'Show the commands you have run',
        examples: ['history'],
        run: (_args, { history }) => ({
            lines: history.map((entry, i) =>
                row(t(`  ${String(i + 1).padStart(3)}  `, 'muted'), t(entry))
            )
        })
    },
    {
        name: 'echo',
        group: 'General',
        usage: 'echo <text>',
        description: 'Print text back to the screen',
        examples: ['echo hello world'],
        run: (_args, { raw }) => ({ lines: [plain(raw.replace(/^echo\s*/i, ''))] })
    },
    {
        name: 'date',
        group: 'General',
        usage: 'date',
        description: 'Show the current date and time',
        examples: ['date'],
        run: () => ({ lines: [plain(new Date().toString())] })
    },

    /* ---------------- About me ---------------- */
    {
        name: 'about',
        group: 'About me',
        usage: 'about',
        description: 'A short introduction',
        examples: ['about'],
        run: () => ({
            lines: [
                plain(profile.name, 'heading'),
                plain(profile.role, 'accent'),
                blank(),
                plain(profile.summary),
                blank(),
                kv('Studying', profile.education),
                blank(),
                row(t('Run '), t('story', 'accent'), t(' for the longer version.'))
            ]
        })
    },
    {
        name: 'whoami',
        group: 'About me',
        usage: 'whoami',
        description: 'One line about who is behind this portfolio',
        examples: ['whoami'],
        run: () => ({ lines: [plain(`${profile.handle} — ${profile.role}`)] })
    },
    {
        name: 'story',
        group: 'About me',
        usage: 'story',
        description: 'Read the full story, chapter by chapter',
        examples: ['story'],
        run: () => {
            const lines = [];
            story.forEach((chapter, i) => {
                if (i > 0) lines.push(blank());
                lines.push(row(t(`${i + 1}. `, 'muted'), t(chapter.title, 'heading')));
                lines.push(plain(chapter.text));
            });
            return { lines };
        }
    },
    {
        name: 'neofetch',
        aliases: ['fetch'],
        group: 'About me',
        usage: 'neofetch',
        description: 'A system-info style summary of this portfolio',
        examples: ['neofetch'],
        run: () => {
            const uniqueTools = new Set(skillGroups.flatMap((g) => g.tools)).size;
            const title = `${profile.handle}@${profile.host}`;
            return {
                lines: [
                    plain(title, 'success'),
                    plain('─'.repeat(title.length), 'muted'),
                    kv('Name', profile.name),
                    kv('Role', profile.role),
                    kv('Studying', profile.education),
                    kv('Projects', String(projects.length)),
                    kv('Roles', `${experiences.length} entries`),
                    kv('Skills', `${uniqueTools} technologies in ${skillGroups.length} groups`),
                    kv('Shell', "portfolio-sh (type 'help')")
                ]
            };
        }
    },
    {
        name: 'contact',
        aliases: ['links'],
        group: 'About me',
        usage: 'contact',
        description: 'Where to find me online',
        examples: ['contact'],
        run: () => ({ lines: contactLines() })
    },

    /* ---------------- Portfolio ---------------- */
    {
        name: 'list',
        aliases: ['ls'],
        group: 'Portfolio',
        usage: 'list <projects|skills|experience|contact>',
        description: 'List projects, skills, experience or contact links',
        examples: ['list projects', 'list skills', 'list skills backend', 'list experience'],
        complete: (args) => {
            if (args.length === 0) return ['projects', 'skills', 'experience', 'contact'];
            if (args.length === 1 && args[0].toLowerCase() === 'skills') return skillGroups.map((g) => g.id);
            return [];
        },
        run: ([what, filter]) => {
            const key = (what || '').toLowerCase();
            const collection = resolveCollection(key);

            if (collection?.type === 'project') return { lines: listProjects() };
            if (collection?.type === 'experience') return { lines: listExperience() };
            if (key === 'skills' || key === 'skill') return { lines: listSkills(filter) };
            if (key === 'contact' || key === 'links') return { lines: contactLines() };

            return {
                lines: [
                    fail(what ? `list: unknown target '${what}'` : 'list: missing target'),
                    row(t('usage: ', 'muted'), t('list <projects|skills|experience|contact>', 'accent'))
                ]
            };
        }
    },
    {
        name: 'select',
        aliases: ['cd'],
        group: 'Portfolio',
        usage: 'select <project|experience> <number|name>',
        description: 'Select a project or role, then use info, skills and open',
        examples: ['select project quizzez', 'select project 1', 'select experience comp200'],
        complete: (args) => {
            if (args.length === 0) return ['project', 'experience'];
            if (args.length === 1) return resolveCollection(args[0])?.list.map((i) => i.slug) ?? [];
            return [];
        },
        run: ([type, ...rest], { session }) => {
            const query = rest.join(' ');

            // `cd ..` behaves like `back`
            if (type === '..' || type === '~') return runBack(session);

            const collection = resolveCollection(type);
            if (!collection || !query) {
                return {
                    lines: [
                        fail('select: missing or unknown arguments'),
                        row(t('usage: ', 'muted'), t('select <project|experience> <number|name>', 'accent')),
                        row(t('Run '), t('list projects', 'accent'), t(' or '), t('list experience', 'accent'), t(' to see the options.'))
                    ]
                };
            }

            const index = findIndexByQuery(collection.list, query);
            if (index === -1) {
                return {
                    lines: [
                        fail(`select: no ${collection.label} matching '${query}'`),
                        plain(`Run 'list ${collection.plural}' to see the options.`, 'muted')
                    ]
                };
            }

            const item = collection.list[index];
            return {
                session: { ...session, selected: { type: collection.type, index } },
                lines: [
                    row(t('✔ ', 'success'), t(`Selected ${collection.label}: `), t(item.title, 'accent')),
                    row(
                        t('Try '),
                        t('info', 'accent'),
                        t(', '),
                        t('skills', 'accent'),
                        t(', '),
                        t('open', 'accent'),
                        t(' or '),
                        t('back', 'accent'),
                        t('.')
                    )
                ]
            };
        }
    },
    {
        name: 'info',
        group: 'Portfolio',
        usage: 'info',
        description: 'Details about the selected project or role',
        examples: ['select project quizzez', 'info'],
        run: (_args, { session }) => {
            const selected = getSelected(session);
            if (!selected) return { lines: noSelection() };
            const { item, collection } = selected;

            if (collection.type === 'project') {
                const lines = [
                    plain(item.title, 'heading'),
                    plain(item.category, 'accent'),
                    blank(),
                    plain(item.description),
                    blank(),
                    kv('Tech', item.tech.join(', '))
                ];
                if (item.liveUrl) lines.push(kv('Live', item.liveUrl, 'link', item.liveUrl));
                if (item.repoUrl) lines.push(kv('Repo', item.repoUrl, 'link', item.repoUrl));
                lines.push(
                    blank(),
                    row(t('Run '), t('skills', 'accent'), t(' for the tech stack or '), t('open', 'accent'), t(' to visit it.'))
                );
                return { lines };
            }

            const lines = [
                plain(item.title, 'heading'),
                plain(`${item.organization} · ${item.period}`, 'accent'),
                blank(),
                plain(item.summary)
            ];
            if (item.link) lines.push(blank(), kv('Link', item.link, 'link', item.link));
            lines.push(
                blank(),
                row(t('Run '), t('skills', 'accent'), t(' to see what this role involved.'))
            );
            return { lines };
        }
    },
    {
        name: 'skills',
        group: 'Portfolio',
        usage: 'skills',
        description: 'Skills for the selected item, or every skill if nothing is selected',
        examples: ['skills', 'select project cryptofarm', 'skills'],
        run: (_args, { session }) => {
            const selected = getSelected(session);
            if (!selected) return { lines: listSkills() };
            const { item, collection } = selected;

            const bullets =
                collection.type === 'project' ? item.tech : item.skills;
            const heading =
                collection.type === 'project'
                    ? `Tech stack: ${item.title}`
                    : `Skills & contributions: ${item.title}`;

            return {
                lines: [
                    plain(heading, 'heading'),
                    ...bullets.map((entry) => row(t('  • ', 'muted'), t(entry))),
                    blank(),
                    row(t('Run '), t('back', 'accent'), t(' to deselect, or '), t('list skills', 'accent'), t(' for everything.'))
                ]
            };
        }
    },
    {
        name: 'open',
        group: 'Portfolio',
        usage: 'open [live|repo|github]',
        description: 'Open the selected project in a new tab (or my GitHub)',
        examples: ['open github', 'select project quizzez', 'open live', 'open repo'],
        complete: () => ['live', 'repo', 'github'],
        run: ([target], { session }) => {
            const which = (target || '').toLowerCase();
            const selected = getSelected(session);
            const githubUrl = profile.links.find((l) => l.label === 'GitHub')?.url;

            const opening = (url) => ({
                lines: [row(t('Opening ', 'muted'), t(url, 'link', url))],
                action: { type: 'open', url }
            });

            if (which === 'github' || (!selected && !which)) {
                return githubUrl ? opening(githubUrl) : { lines: [fail('open: no GitHub link configured')] };
            }
            if (!selected) return { lines: noSelection() };

            const { item, collection } = selected;

            if (collection.type === 'experience') {
                return item.link
                    ? opening(item.link)
                    : { lines: [fail(`open: '${item.slug}' has no link`)] };
            }

            if (which === 'repo') {
                return item.repoUrl ? opening(item.repoUrl) : { lines: [fail('open: no repository link')] };
            }

            if (!which || which === 'live') {
                if (item.liveUrl) return opening(item.liveUrl);
                return {
                    lines: [
                        fail(`open: ${item.slug} has no live deployment`),
                        row(t('Try '), t('open repo', 'accent'), t('.'))
                    ]
                };
            }

            return { lines: [fail(`open: unknown target '${target}'`), plain('usage: open [live|repo|github]', 'muted')] };
        }
    },
    {
        name: 'back',
        aliases: ['deselect', '..'],
        group: 'Portfolio',
        usage: 'back',
        description: 'Deselect the current project or role',
        examples: ['back'],
        run: (_args, { session }) => runBack(session)
    },
    {
        name: 'search',
        aliases: ['find', 'grep'],
        group: 'Portfolio',
        usage: 'search <keyword>',
        description: 'Search projects, experience and skills',
        examples: ['search react', 'search spring', 'search azure'],
        run: (args) => {
            const q = args.join(' ').toLowerCase();
            if (!q) {
                return {
                    lines: [fail('search: missing keyword'), row(t('usage: ', 'muted'), t('search <keyword>', 'accent'))]
                };
            }

            const projectHits = projects
                .map((project, i) => ({ project, i }))
                .filter(({ project }) =>
                    [project.title, project.category, project.description, ...project.tech]
                        .join(' ')
                        .toLowerCase()
                        .includes(q)
                );

            const experienceHits = experiences
                .map((exp, i) => ({ exp, i }))
                .filter(({ exp }) =>
                    [exp.title, exp.organization, exp.summary, ...exp.skills].join(' ').toLowerCase().includes(q)
                );

            const skillHits = skillGroups.flatMap((group) =>
                group.tools.filter((tool) => tool.toLowerCase().includes(q)).map((tool) => ({ tool, group }))
            );

            if (!projectHits.length && !experienceHits.length && !skillHits.length) {
                return { lines: [fail(`search: no results for '${args.join(' ')}'`)] };
            }

            const lines = [plain(`Results for '${args.join(' ')}'`, 'heading')];

            if (projectHits.length) {
                lines.push(blank(), plain('Projects', 'heading'));
                projectHits.forEach(({ project, i }) =>
                    lines.push(row(t(`  ${num(i)}  `, 'muted'), t(pad(project.slug, 14), 'accent'), t(project.title)))
                );
            }
            if (experienceHits.length) {
                lines.push(blank(), plain('Experience', 'heading'));
                experienceHits.forEach(({ exp, i }) =>
                    lines.push(row(t(`  ${num(i)}  `, 'muted'), t(pad(exp.slug, 14), 'accent'), t(exp.title)))
                );
            }
            if (skillHits.length) {
                lines.push(blank(), plain('Skills', 'heading'));
                skillHits.forEach(({ tool, group }) =>
                    lines.push(row(t(`  ${tool}`), t(`  (${group.name})`, 'muted')))
                );
            }

            lines.push(
                blank(),
                row(t('Use '), t('select project <name>', 'accent'), t(' or '), t('select experience <name>', 'accent'), t(' to dig in.'))
            );
            return { lines };
        }
    },

    /* ---------------- Easter egg (hidden from help) ---------------- */
    {
        name: 'sudo',
        hidden: true,
        group: 'Fun',
        usage: 'sudo',
        description: '',
        run: () => ({
            lines: [fail(`${profile.handle} is not in the sudoers file. This incident will be reported.`)]
        })
    }
];

/* ------------------------------------------------------------------ */
/*  Shared helpers that need the registry                              */
/* ------------------------------------------------------------------ */

function runBack(session) {
    const selected = getSelected(session);
    if (!selected) return { lines: [plain('Nothing is selected.', 'muted')] };

    return {
        session: { ...session, selected: null },
        lines: [row(t('✔ ', 'success'), t(`Deselected ${selected.collection.label}: ${selected.item.title}`))]
    };
}

function findCommand(name) {
    return commands.find((c) => c.name === name || c.aliases?.includes(name));
}

const distance = (a, b) => {
    const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 1; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
        }
    }
    return dp[a.length][b.length];
};

const notFound = (name) => {
    const lower = name.toLowerCase();
    const suggestions = commands
        .filter((c) => !c.hidden)
        .map((c) => c.name)
        .filter((n) => n.startsWith(lower) || distance(n, lower) <= 2);

    return [
        fail(`command not found: ${name}`),
        suggestions.length
            ? plain(`Did you mean: ${suggestions.join(', ')}?`, 'muted')
            : plain("Type 'help' to see the available commands.", 'muted')
    ];
};

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export const welcomeLines = [
    plain("Welcome to Mvelo's portfolio terminal.", 'heading'),
    row(
        t('Type '),
        t('help', 'accent'),
        t(' to see what you can do, or '),
        t('exit', 'accent'),
        t(' to go back to the website.')
    ),
    blank()
];

export function executeCommand(input, { session, history = [] }) {
    const trimmed = input.trim();
    if (!trimmed) return { lines: [], session };

    const [name, ...args] = trimmed.split(/\s+/);
    const command = findCommand(name.toLowerCase());

    if (!command) return { lines: notFound(name), session };

    const result = command.run(args, { session, history, raw: trimmed });
    return { ...result, lines: result.lines ?? [], session: result.session ?? session };
}

const commonPrefix = (words) =>
    words.reduce((prefix, word) => {
        let i = 0;
        while (i < prefix.length && i < word.length && prefix[i] === word[i]) i++;
        return prefix.slice(0, i);
    });

// Tab completion. Returns the new input value, plus output lines when there are
// several matches and nothing more can be filled in (like bash).
export function complete(input, session) {
    const endsWithSpace = /\s$/.test(input);
    const tokens = input.trimStart().split(/\s+/).filter(Boolean);

    const index = tokens.length === 0 ? 0 : endsWithSpace ? tokens.length : tokens.length - 1;
    const current = index < tokens.length ? tokens[index].toLowerCase() : '';

    let candidates = [];
    if (index === 0) {
        candidates = commands.filter((c) => !c.hidden).map((c) => c.name);
    } else {
        const command = findCommand(tokens[0].toLowerCase());
        if (command?.complete) candidates = command.complete(tokens.slice(1, index), session);
    }

    const matches = candidates.filter((c) => c.toLowerCase().startsWith(current));
    if (!matches.length) return { value: input, lines: [] };

    const before = tokens.slice(0, index);
    const build = (word, trailingSpace) => [...before, word].join(' ') + (trailingSpace ? ' ' : '');

    if (matches.length === 1) return { value: build(matches[0], true), lines: [] };

    const prefix = commonPrefix(matches);
    if (prefix.length > current.length) return { value: build(prefix, false), lines: [] };

    return { value: input, lines: [plain(matches.join('  '), 'muted')] };
}