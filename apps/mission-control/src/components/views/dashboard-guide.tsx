"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Bot,
  Brain,
  ClipboardList,
  Rocket,
  FolderOpen,
  Server,
  LayoutDashboard,
  MessageSquare,
  Zap,
  Users,
  BookOpen,
  Wrench,
  Link2,
  Radio,
  Puzzle,
  Package,
  Plug,
  DollarSign,
  Shield,
  Clock,
  FileText,
  Settings,
} from "lucide-react";
import { staggerContainerVariants, glassCardVariants, useReducedMotion } from "@/design-system";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getGuideContent,
  getConcept,
  getPage,
  getSteps,
  getLabel,
  type GuideLocale,
} from "@/lib/dashboard-guide-content";
import { useDashboardLocaleContext } from "@/lib/dashboard-locale-context";

const CONCEPT_KEYS = ["agent", "specialist", "task", "mission", "workspace", "gateway"] as const;
const PAGE_KEYS = [
  "board",
  "chat",
  "orchestrate",
  "agents",
  "employees",
  "specialists",
  "learn",
  "guide",
  "all-tools",
  "missions",
  "integrations",
  "channels",
  "tools",
  "skills",
  "plugins",
  "mcp-servers",
  "usage",
  "approvals",
  "cron",
  "logs",
  "settings",
] as const;
const STEP_KEYS = [
  "createTask",
  "assignSpecialist",
  "useChat",
  "dispatchTask",
  "createAgent",
  "reviewApproval",
] as const;

const PAGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  board: LayoutDashboard,
  chat: MessageSquare,
  orchestrate: Zap,
  agents: Bot,
  employees: Users,
  specialists: Brain,
  learn: BookOpen,
  guide: HelpCircle,
  "all-tools": Wrench,
  missions: Rocket,
  integrations: Link2,
  channels: Radio,
  tools: Wrench,
  skills: Puzzle,
  plugins: Package,
  "mcp-servers": Plug,
  usage: DollarSign,
  approvals: Shield,
  cron: Clock,
  logs: FileText,
  settings: Settings,
};

const CONCEPT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  agent: Bot,
  specialist: Brain,
  task: ClipboardList,
  mission: Rocket,
  workspace: FolderOpen,
  gateway: Server,
};

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  locale,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  locale: GuideLocale;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const isRtl = locale === "ar-SA";

  return (
    <div className="rounded-xl border border-border/60 bg-background/50 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-medium text-foreground">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className={`px-4 pb-4 ${isRtl ? "text-right" : "text-left"}`}>{children}</div>
      )}
    </div>
  );
}

export function DashboardGuide() {
  const { locale, setLocale, isRtl } = useDashboardLocaleContext();
  const content = getGuideContent(locale);
  const reduceMotion = useReducedMotion();
  const noMotion = { initial: {}, animate: {} };
  const containerVariants = reduceMotion ? noMotion : staggerContainerVariants;
  const cardVariants = reduceMotion ? noMotion : glassCardVariants;

  return (
    <div
      className="flex flex-col min-h-full"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="p-4 sm:p-6 border-b border-border/50 bg-background/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {getLabel(locale, "howToUse")}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {content.pages.guide?.description ?? ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {getLabel(locale, "switchLanguage")}
            </span>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <Button
                variant={locale === "ar-SA" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setLocale("ar-SA")}
              >
                {getLabel(locale, "arabic")}
              </Button>
              <Button
                variant={locale === "en" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setLocale("en")}
              >
                {getLabel(locale, "english")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-10">
          {/* Concepts */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {getLabel(locale, "concepts")}
            </h2>
            <motion.div
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="initial"
              animate="animate"
            >
              {CONCEPT_KEYS.map((key) => {
                const concept = getConcept(locale, key);
                const Icon = CONCEPT_ICONS[key];
                if (!concept) {return null;}
                return (
                  <motion.div
                    key={key}
                    variants={cardVariants}
                    className="rounded-xl border border-border/60 bg-background/50 p-4 glass-2"
                  >
                    <div className="flex items-start gap-3">
                      {Icon && (
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground">{concept.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{concept.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </section>

          {/* Pages */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {getLabel(locale, "allPages")}
            </h2>
            <motion.div
              className="grid gap-3 sm:grid-cols-2"
              variants={containerVariants}
              initial="initial"
              animate="animate"
            >
              {PAGE_KEYS.map((key) => {
                const page = getPage(locale, key);
                const Icon = PAGE_ICONS[key];
                if (!page) {return null;}
                return (
                  <motion.div
                    key={key}
                    variants={cardVariants}
                    className="rounded-xl border border-border/60 bg-background/50 p-4 glass-2 flex items-start gap-3"
                  >
                    {Icon && (
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground">{page.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{page.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </section>

          {/* Step by Step */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {getLabel(locale, "stepByStep")}
            </h2>
            <div className="space-y-3">
              {STEP_KEYS.map((key) => {
                const stepData = getSteps(locale, key);
                if (!stepData) {return null;}
                return (
                  <CollapsibleSection
                    key={key}
                    title={stepData.title}
                    locale={locale}
                    defaultOpen={key === "createTask"}
                  >
                    <ol className="space-y-2 list-decimal list-inside text-sm text-muted-foreground">
                      {stepData.steps.map((step, i) => (
                        <li key={i} className={isRtl ? "text-right" : "text-left"}>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </CollapsibleSection>
                );
              })}
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
