/**
 * Dashboard Guide Content — Arabic (Saudi) and English
 *
 * Simple, non-technical explanations for Mission Control concepts,
 * pages, step-by-step flows, and tooltips.
 */

export type GuideLocale = "ar-SA" | "en";

export interface EmptyStateContent {
  title: string;
  description: string;
  tips?: string[];
}

export interface GuideContent {
  concepts: Record<string, { title: string; description: string }>;
  pages: Record<string, { title: string; description: string }>;
  steps: Record<string, { title: string; steps: string[] }>;
  tooltips: Record<string, string>;
  labels: Record<string, string>;
  emptyStates?: Record<string, EmptyStateContent>;
}

const AR_SA: GuideContent = {
  concepts: {
    agent: {
      title: "الوكيل (Agent)",
      description:
        "الوكيل هو مساعد ذكي يعمل تلقائياً. يمكنك إنشاؤه وإعطاءه مهام ليُنفذها بنفسه. يفهم التعليمات ويكتب الكود ويُنجز العمل دون تدخلك المستمر.",
    },
    specialist: {
      title: "المتخصص (Specialist)",
      description:
        "المتخصص هو نوع من المساعدين المتخصصين في مجال معين. مثلاً: مطور واجهات، أو خبير اختبارات. عند إنشاء مهمة، تختار المتخصص الأنسب لطبيعة العمل.",
    },
    task: {
      title: "المهمة (Task)",
      description:
        "المهمة هي عمل تريد إنجازه. لها عنوان ووصف. تنتقل من صندوق الوارد إلى التنفيذ ثم المراجعة ثم الإنجاز. يمكنك تعيين مهمة لوكيل أو متخصص.",
    },
    mission: {
      title: "المهمة الكبرى (Mission)",
      description:
        "المهمة الكبرى مجموعة من المهام المرتبطة ببعضها. تستخدمها لتنظيم مشروع كبير إلى خطوات أصغر.",
    },
    workspace: {
      title: "مساحة العمل (Workspace)",
      description:
        "مساحة العمل هي بيئة منفصلة لمشروعك. كل مساحة لها مهامها ووكلاؤها. تسمح بالتبديل بين مشاريع مختلفة.",
    },
    gateway: {
      title: "البوابة (Gateway)",
      description:
        "البوابة تربط لوحة التحكم بنظام الذكاء الاصطناعي. يجب أن تكون متصلة ليعمل الوكلاء والمتخصصون.",
    },
  },
  pages: {
    board: {
      title: "لوحة التحكم",
      description:
        "هنا ترى جميع مهامك في أعمدة. المهام الجديدة تظهر في صندوق الوارد. يمكنك سحب المهام ونقلها بين الأعمدة وتعيينها للوكلاء.",
    },
    chat: {
      title: "المحادثة",
      description:
        "تحدث مع المساعد الذكي مباشرة. اسأل أسئلة، اطلب مساعدة، أو أنشئ مهام من المحادثة. المحادثات تُحفظ تلقائياً.",
    },
    orchestrate: {
      title: "التنسيق",
      description:
        "أنشئ عدة مهام ووزعها على وكلاء مختلفين. شغّلهم معاً واتبع التقدم لحظياً.",
    },
    agents: {
      title: "الوكلاء",
      description:
        "عرض جميع الوكلاء النشطين. أنشئ وكلاء جدد، عدّل إعداداتهم، أو راجع حالتهم.",
    },
    employees: {
      title: "الموظفون",
      description:
        "عرض المهام حسب الوكلاء. ترى من يعمل على ماذا وتُوزع العمل بشكل أفضل.",
    },
    specialists: {
      title: "المتخصصون",
      description:
        "المتخصصون هم مساعدون بخبرات محددة. اختر المتخصص المناسب لمهمتك أو ابدأ محادثة معه.",
    },
    learn: {
      title: "مركز التعلم",
      description:
        "دروس ونصائح لاستخدام Mission Control والوكلاء بشكل أفضل. دروس من مجتمع المطورين.",
    },
    "all-tools": {
      title: "جميع الأدوات",
      description:
        "دليل لكل الصفحات والأدوات. ابحث وانتقل لأي قسم بسرعة.",
    },
    missions: {
      title: "المهام الكبرى",
      description:
        "نظّم المهام في مشاريع. أنشئ مهمة كبرى واربط بها مهام فرعية.",
    },
    integrations: {
      title: "التكاملات",
      description:
        "ربط Mission Control بخدمات خارجية مثل Slack أو Discord.",
    },
    channels: {
      title: "القنوات",
      description:
        "قنوات التواصل مع الوكلاء. مثلاً: Slack، Discord، أو البريد.",
    },
    tools: {
      title: "ساحة الأدوات",
      description:
        "تجربة أدوات الوكلاء يدوياً. للمطورين والاختبار.",
    },
    skills: {
      title: "المهارات",
      description:
        "المهارات تضيف قدرات للوكلاء. مثلاً: البحث على الويب، إدارة الملفات.",
    },
    plugins: {
      title: "الإضافات",
      description:
        "إضافات توسّع وظائف Mission Control. ثبّت أو أزل إضافات.",
    },
    "mcp-servers": {
      title: "خوادم MCP",
      description:
        "خوادم تربط أدوات خارجية بالوكلاء. للمستخدمين المتقدمين.",
    },
    usage: {
      title: "الاستخدام والتكلفة",
      description:
        "عرض استهلاك الذكاء الاصطناعي والتكلفة. تتبع النفقات.",
    },
    approvals: {
      title: "الموافقات",
      description:
        "عند انتهاء وكيل من مهمة، قد تحتاج للموافقة. هنا تراجع وتوافق أو ترفض.",
    },
    cron: {
      title: "الجداول",
      description:
        "جدولة مهام لتُنفذ تلقائياً في أوقات محددة. مثلاً: تقرير يومي.",
    },
    logs: {
      title: "السجلات",
      description:
        "سجلات تفصيلية لنشاط النظام والوكلاء. للمراجعة والتصحيح.",
    },
    settings: {
      title: "الإعدادات",
      description:
        "إعداد البوابة، نماذج الذكاء الاصطناعي، مفاتيح API، والمظهر.",
    },
    guide: {
      title: "دليل الاستخدام",
      description:
        "شرح مفصل لكل شيء في Mission Control. للمستخدمين الجدد وغير التقنيين.",
    },
    activity: {
      title: "النشاط",
      description:
        "سجل بجميع أحداث المهام والوكلاء. تصفية حسب النوع أو مساحة العمل.",
    },
    templates: {
      title: "القوالب",
      description:
        "قوالب مهام من المجتمع. اختر قالباً لإنشاء مهمة جاهزة بسرعة.",
    },
    workspaces: {
      title: "مساحات العمل",
      description:
        "عرض وإدارة مساحات العمل. أنشئ مساحات جديدة أو غيّر الاسم أو احذف (للمالكين).",
    },
    devices: {
      title: "الأجهزة",
      description:
        "إدارة أجهزة الاقتران. وافق أو ارفض طلبات الاقتران، أو ألغِ رموز الأجهزة.",
    },
  },
  steps: {
    createTask: {
      title: "إنشاء مهمة جديدة",
      steps: [
        "اضغط على «مهمة جديدة» أو استخدم الاختصار ⌘N.",
        "اكتب عنواناً واضحاً للمهمة.",
        "اكتب وصفاً تفصيلياً: ماذا تريد بالضبط؟",
        "اختر الأولوية (عالي، متوسط، منخفض).",
        "اختياري: عيّن وكيلاً أو متخصصاً مباشرة.",
        "اضغط «إنشاء».",
      ],
    },
    assignSpecialist: {
      title: "تعيين متخصص لمهمة",
      steps: [
        "اذهب إلى صفحة المتخصصين.",
        "اختر المتخصص المناسب لنوع المهمة.",
        "اضغط «تعيين مهمة» أو «ابدأ محادثة».",
        "إذا اخترت تعيين مهمة: اختر المهمة من القائمة أو أنشئ مهمة جديدة.",
      ],
    },
    useChat: {
      title: "استخدام المحادثة",
      steps: [
        "اذهب إلى صفحة المحادثة من القائمة الجانبية.",
        "اكتب رسالتك في الأسفل واضغط إرسال.",
        "يمكنك إرفاق ملفات أو الإشارة إلى كود بـ @file.",
        "لإنشاء مهمة من المحادثة: اطلب ذلك صراحة وسيُقترح عليك.",
      ],
    },
    dispatchTask: {
      title: "إرسال مهمة لوكيل",
      steps: [
        "في لوحة التحكم، ابحث عن المهمة في صندوق الوارد.",
        "اضغط على زر «إرسال» أو اسحب المهمة لعمود «معيّن».",
        "اختر الوكيل أو المتخصص المناسب.",
        "اضغط «إرسال». سيبدأ الوكيل العمل تلقائياً.",
      ],
    },
    createAgent: {
      title: "إنشاء وكيل جديد",
      steps: [
        "اذهب إلى صفحة الوكلاء.",
        "تأكد من اتصال البوابة.",
        "اضغط «إنشاء وكيل».",
        "أدخل اسماً للوكيل (مثل: researcher أو writer).",
        "اختياري: أضف وصفاً للهوية.",
        "اضغط «إنشاء».",
      ],
    },
    reviewApproval: {
      title: "مراجعة عمل وكيل والموافقة",
      steps: [
        "اذهب إلى صفحة الموافقات أو لوحة التحكم.",
        "ابحث عن المهام في عمود «المراجعة».",
        "افتح المهمة واطلع على ما أنجزه الوكيل.",
        "إذا كان جيداً: اضغط «موافقة». إذا لا: اضغط «إعادة العمل» وأضف ملاحظات.",
      ],
    },
  },
  tooltips: {
    board: "لوحة التحكم: عرض وإدارة جميع المهام",
    chat: "المحادثة: تحدث مع المساعد الذكي",
    orchestrate: "التنسيق: تشغيل مهام متعددة معاً",
    agents: "الوكلاء: إدارة المساعدين الذكيين",
    employees: "الموظفون: عرض المهام حسب الوكيل",
    specialists: "المتخصصون: مساعدون بخبرات محددة",
    learn: "مركز التعلم: دروس ونصائح",
    "all-tools": "جميع الأدوات: دليل لكل الصفحات",
    missions: "المهام الكبرى: تنظيم المشاريع",
    integrations: "التكاملات: ربط خدمات خارجية",
    channels: "القنوات: قنوات التواصل",
    tools: "ساحة الأدوات: تجربة الأدوات",
    skills: "المهارات: قدرات الوكلاء",
    plugins: "الإضافات: توسيع الوظائف",
    "mcp-servers": "خوادم MCP: أدوات متقدمة",
    usage: "الاستخدام: تتبع التكلفة",
    approvals: "الموافقات: مراجعة عمل الوكلاء",
    cron: "الجداول: مهام مجدولة",
    logs: "السجلات: سجلات النظام",
    settings: "الإعدادات: إعداد النظام",
    guide: "دليل الاستخدام: شرح مفصل",
    activity: "النشاط: سجل الأحداث",
    templates: "القوالب: قوالب مهام جاهزة",
    workspaces: "مساحات العمل: إدارة المساحات",
    devices: "الأجهزة: إدارة الاقتران",
    statActiveAgents: "عدد الوكلاء النشطين المتصلين بالبوابة",
    statTasksActive: "المهام قيد التنفيذ أو المعيّنة",
    statModelsLoaded: "عدد نماذج الذكاء الاصطناعي المتاحة",
    statSystemHealth: "حالة البوابة والنظام",
    createTask: "إنشاء مهمة جديدة",
    kanbanInbox: "المهام الجديدة غير المعيّنة",
    kanbanAssigned: "المهام المعيّنة لوكيل",
    kanbanInProgress: "الوكلاء يعملون عليها الآن",
    kanbanReview: "بانتظار مراجعتك",
    kanbanDone: "مكتملة وموافق عليها",
    dispatchTask: "إرسال هذه المهمة لوكيل",
  },
  emptyStates: {
    inbox: {
      title: "صندوق الوارد فارغ",
      description: "المهام التي تنشئها ستظهر هنا أولاً. أنشئ مهمة للبدء، أو استخدم التنسيق لتشغيل مهام متعددة بالتوازي.",
      tips: ["اضغط ⌘N لإنشاء مهمة جديدة بسرعة", "استخدم أوامر ذرية: هدف واحد واضح لكل مهمة", "أشر إلى كود بـ @file لتطبيقات مشابهة", "عيّن المهام للوكلاء للعمل التلقائي"],
    },
    agents: {
      title: "لم تُنشأ وكلاء بعد",
      description: "الوكلاء مساعدون ذكيون ينفذون المهام تلقائياً. أنشئ أول وكيل لبدء تفويض العمل.",
      tips: ["أعطِ الوكلاء شخصيات محددة (مثلاً: باحث، كاتب)", "المتخصصون النخبة يطابقون نوع المهمة بالخبرة", "التشغيل المتوازي يوزع العمل على عدة وكلاء"],
    },
  },
  labels: {
    howToUse: "دليل الاستخدام",
    whatIsThisPage: "ما هي هذه الصفحة؟",
    concepts: "المفاهيم الأساسية",
    allPages: "جميع الصفحات",
    stepByStep: "خطوة بخطوة",
    switchLanguage: "تبديل اللغة",
    arabic: "العربية",
    english: "English",
  },
};

const EN: GuideContent = {
  concepts: {
    agent: {
      title: "Agent",
      description:
        "An agent is an AI worker that runs autonomously. You create it and give it tasks to complete. It understands instructions, writes code, and gets work done without constant input from you.",
    },
    specialist: {
      title: "Specialist",
      description:
        "A specialist is a pre-defined AI persona with expertise in a specific area (e.g. Frontend Developer, E2E Test Architect). When creating a task, you pick the specialist that best fits the work.",
    },
    task: {
      title: "Task",
      description:
        "A task is a piece of work you want done. It has a title and description. It moves through columns: Inbox → Assigned → In Progress → Review → Done. You can assign tasks to agents or specialists.",
    },
    mission: {
      title: "Mission",
      description:
        "A mission is a group of related tasks. Use it to organize a larger project into smaller steps.",
    },
    workspace: {
      title: "Workspace",
      description:
        "A workspace is a separate environment for your project. Each workspace has its own tasks and agents. Lets you switch between different projects.",
    },
    gateway: {
      title: "Gateway",
      description:
        "The gateway connects Mission Control to the AI system. It must be connected for agents and specialists to work.",
    },
  },
  pages: {
    board: {
      title: "Dashboard",
      description:
        "Here you see all your tasks in columns. New tasks appear in Inbox. You can drag tasks between columns and assign them to agents.",
    },
    chat: {
      title: "Chat",
      description:
        "Talk to the AI assistant directly. Ask questions, get help, or create tasks from the conversation. Conversations are saved automatically.",
    },
    orchestrate: {
      title: "Orchestrate",
      description:
        "Create multiple tasks and assign each to a different agent. Run them together and monitor progress in real time.",
    },
    agents: {
      title: "Agents",
      description:
        "View all active agents. Create new agents, edit their settings, or check their status.",
    },
    employees: {
      title: "Employees",
      description:
        "View tasks by agent. See who is working on what and balance the workload.",
    },
    specialists: {
      title: "Specialists",
      description:
        "Specialists are AI assistants with specific expertise. Pick the right specialist for your task or start a chat with one.",
    },
    learn: {
      title: "Learning Hub",
      description:
        "Lessons and tips to get the most out of Mission Control and your agents. Curated from the developer community.",
    },
    "all-tools": {
      title: "All Tools",
      description:
        "Directory of all pages and tools. Search and jump to any section quickly.",
    },
    missions: {
      title: "Missions",
      description:
        "Organize tasks into projects. Create a mission and link related tasks to it.",
    },
    integrations: {
      title: "Integrations",
      description:
        "Connect Mission Control to external services like Slack or Discord.",
    },
    channels: {
      title: "Channels",
      description:
        "Communication channels with agents. E.g. Slack, Discord, or email.",
    },
    tools: {
      title: "Tools Playground",
      description:
        "Try agent tools manually. For developers and testing.",
    },
    skills: {
      title: "Skills",
      description:
        "Skills add capabilities to agents. E.g. web search, file management.",
    },
    plugins: {
      title: "Plugins",
      description:
        "Plugins extend Mission Control. Install or remove plugins.",
    },
    "mcp-servers": {
      title: "MCP Servers",
      description:
        "Servers that connect external tools to agents. For advanced users.",
    },
    usage: {
      title: "Usage & Cost",
      description:
        "View AI usage and cost. Track spending.",
    },
    approvals: {
      title: "Approvals",
      description:
        "When an agent finishes a task, you may need to approve it. Review and approve or request rework here.",
    },
    cron: {
      title: "Schedules",
      description:
        "Schedule tasks to run automatically at set times. E.g. daily report.",
    },
    logs: {
      title: "Logs",
      description:
        "Detailed logs of system and agent activity. For review and debugging.",
    },
    settings: {
      title: "Settings",
      description:
        "Configure gateway, AI models, API keys, and appearance.",
    },
    guide: {
      title: "How to Use",
      description:
        "Detailed guide to everything in Mission Control. For new and non-technical users.",
    },
    activity: {
      title: "Activity",
      description:
        "Feed of all task and agent events. Filter by type or workspace.",
    },
    templates: {
      title: "Templates",
      description:
        "Task templates from the community. Pick a template to create a ready-made task quickly.",
    },
    workspaces: {
      title: "Workspaces",
      description:
        "View and manage workspaces. Create new ones, rename, or delete (owners only).",
    },
    devices: {
      title: "Devices",
      description:
        "Manage paired devices. Approve or reject pairing requests, or revoke device tokens.",
    },
  },
  steps: {
    createTask: {
      title: "Create a new task",
      steps: [
        "Click «New task» or use shortcut ⌘N.",
        "Enter a clear title for the task.",
        "Add a detailed description: what exactly do you want?",
        "Choose priority (high, medium, low).",
        "Optional: assign an agent or specialist directly.",
        "Click «Create».",
      ],
    },
    assignSpecialist: {
      title: "Assign a specialist to a task",
      steps: [
        "Go to the Specialists page.",
        "Pick the specialist that fits the task type.",
        "Click «Assign task» or «Start chat».",
        "If assigning: select the task from the list or create a new one.",
      ],
    },
    useChat: {
      title: "Use Chat",
      steps: [
        "Go to the Chat page from the sidebar.",
        "Type your message at the bottom and press Send.",
        "You can attach files or reference code with @file.",
        "To create a task from chat: ask explicitly and you'll get a suggestion.",
      ],
    },
    dispatchTask: {
      title: "Dispatch a task to an agent",
      steps: [
        "On the Dashboard, find the task in Inbox.",
        "Click the «Dispatch» button or drag the task to Assigned.",
        "Choose the right agent or specialist.",
        "Click «Dispatch». The agent will start working automatically.",
      ],
    },
    createAgent: {
      title: "Create a new agent",
      steps: [
        "Go to the Agents page.",
        "Ensure the gateway is connected.",
        "Click «Create agent».",
        "Enter a name for the agent (e.g. researcher, writer).",
        "Optional: add an identity description.",
        "Click «Create».",
      ],
    },
    reviewApproval: {
      title: "Review agent work and approve",
      steps: [
        "Go to Approvals or the Dashboard.",
        "Find tasks in the Review column.",
        "Open the task and review what the agent did.",
        "If good: click «Approve». If not: click «Rework» and add notes.",
      ],
    },
  },
  tooltips: {
    board: "Dashboard: view and manage all tasks",
    chat: "Chat: talk to the AI assistant",
    orchestrate: "Orchestrate: run multiple tasks together",
    agents: "Agents: manage AI workers",
    employees: "Employees: view tasks by agent",
    specialists: "Specialists: AI with specific expertise",
    learn: "Learning Hub: lessons and tips",
    "all-tools": "All Tools: directory of every page",
    missions: "Missions: organize projects",
    integrations: "Integrations: connect external services",
    channels: "Channels: communication channels",
    tools: "Tools Playground: try tools manually",
    skills: "Skills: agent capabilities",
    plugins: "Plugins: extend functionality",
    "mcp-servers": "MCP Servers: advanced tools",
    usage: "Usage: track cost",
    approvals: "Approvals: review agent work",
    cron: "Schedules: automated tasks",
    logs: "Logs: system activity",
    settings: "Settings: configure system",
    guide: "How to Use: detailed guide",
    activity: "Activity: event feed",
    templates: "Templates: ready-made task templates",
    workspaces: "Workspaces: manage workspaces",
    devices: "Devices: pairing management",
    statActiveAgents: "Number of active agents connected to the gateway",
    statTasksActive: "Tasks in progress or assigned",
    statModelsLoaded: "Number of AI models available",
    statSystemHealth: "Gateway and system status",
    createTask: "Create a new task",
    kanbanInbox: "New tasks not yet assigned",
    kanbanAssigned: "Tasks assigned to an agent",
    kanbanInProgress: "Agents are working on these now",
    kanbanReview: "Waiting for your review",
    kanbanDone: "Completed and approved",
    dispatchTask: "Send this task to an agent",
  },
  emptyStates: {
    inbox: {
      title: "Your inbox is empty",
      description: "Tasks you create will appear here first. Create a task to get started, or use the Orchestrator to run multiple tasks in parallel.",
      tips: ["Press ⌘N to quickly create a new task", "Use atomic prompts: one clear goal per task", "Reference @file for similar implementations", "Assign tasks to agents for autonomous work"],
    },
    agents: {
      title: "No agents created yet",
      description: "Agents are AI workers that can autonomously complete tasks. Create your first agent to start delegating work.",
      tips: ["Give agents specific personas (e.g., researcher, writer)", "Elite specialists match task type to expertise", "Parallel builds split work across multiple agents"],
    },
  },
  labels: {
    howToUse: "How to Use",
    whatIsThisPage: "What is this page?",
    concepts: "Key Concepts",
    allPages: "All Pages",
    stepByStep: "Step by Step",
    switchLanguage: "Switch language",
    arabic: "العربية",
    english: "English",
  },
};

export const GUIDE_CONTENT: Record<GuideLocale, GuideContent> = {
  "ar-SA": AR_SA,
  en: EN,
};

export function getGuideContent(locale: GuideLocale): GuideContent {
  return GUIDE_CONTENT[locale] ?? GUIDE_CONTENT.en;
}

export function getConcept(locale: GuideLocale, key: string) {
  return getGuideContent(locale).concepts[key];
}

export function getPage(locale: GuideLocale, key: string) {
  return getGuideContent(locale).pages[key];
}

export function getSteps(locale: GuideLocale, key: string) {
  return getGuideContent(locale).steps[key];
}

export function getTooltip(locale: GuideLocale, key: string): string {
  const content = getGuideContent(locale).tooltips[key];
  return content ?? getGuideContent("en").tooltips[key] ?? key;
}

export function getLabel(locale: GuideLocale, key: string): string {
  const content = getGuideContent(locale).labels[key];
  return content ?? getGuideContent("en").labels[key] ?? key;
}

export function getEmptyState(locale: GuideLocale, key: string): EmptyStateContent | undefined {
  const content = getGuideContent(locale).emptyStates?.[key];
  return content ?? getGuideContent("en").emptyStates?.[key];
}
