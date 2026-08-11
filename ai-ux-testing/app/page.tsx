"use client"

import { useState, useEffect, useRef } from "react"
import {
  LayoutDashboard,
  FlaskConical,
  BarChart3,
  Users,
  Settings,
  Plus,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Check,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts"

type PageType =
  | "dashboard"
  | "new-study"
  | "study-loading"
  | "study-results"
  | "studies-grid"
  | "analytics"
  | "personas"
  | "settings"

// Mock data
const studiesData = [
  { id: 1, name: "Onboarding Flow v2", persona: "Maya, 28", users: 10, started: "Mar 18, 2025", status: "Completed" as const },
  { id: 2, name: "Checkout Redesign", persona: "Robert, 54", users: 15, started: "Mar 15, 2025", status: "Completed" as const },
  { id: 3, name: "Settings Page Audit", persona: "Maya, 28", users: 8, started: "Mar 20, 2025", status: "In Progress" as const },
  { id: 4, name: "Mobile Nav Test", persona: "Robert, 54", users: 12, started: "Mar 10, 2025", status: "Completed" as const },
  { id: 5, name: "Search UX Study", persona: "Maya, 28", users: 5, started: "Mar 21, 2025", status: "Draft" as const },
  { id: 6, name: "Dashboard Walkthrough", persona: "Robert, 54", users: 20, started: "Mar 5, 2025", status: "Completed" as const },
]

const studiesOverTimeData = [
  { month: "Jan", studies: 1 },
  { month: "Feb", studies: 2 },
  { month: "Mar", studies: 2 },
  { month: "Apr", studies: 3 },
  { month: "May", studies: 2 },
  { month: "Jun", studies: 4 },
]

const completionRateData = [
  { name: "Study 1", rate: 72 },
  { name: "Study 2", rate: 85 },
  { name: "Study 3", rate: 68 },
  { name: "Study 4", rate: 80 },
  { name: "Study 5", rate: 74 },
]

const personaUsageData = [
  { name: "Maya", value: 7, color: "#3B5BDB" },
  { name: "Robert", value: 5, color: "#74C0FC" },
]

const dropoffFunnelData = [
  { step: "Sign Up", percentage: 100 },
  { step: "Email Verify", percentage: 95 },
  { step: "Profile Setup", percentage: 88 },
  { step: "Company Details", percentage: 80 },
  { step: "Dashboard", percentage: 80 },
]

const userSessionData = [
  {
    id: 1,
    status: "Completed",
    time: "3m 12s",
    steps: [
      { name: "Landed on signup page", reasoning: "User immediately located the email input and began filling in credentials without hesitation.", status: "completed" },
      { name: "Email verification", reasoning: "Navigated to email verification smoothly. Brief pause before clicking the verify link.", status: "completed" },
      { name: "Profile setup", reasoning: "Took time reading through all fields before filling in. Hovered on 'Role' dropdown twice.", status: "hesitated" },
      { name: "Company details", reasoning: "Completed without friction.", status: "completed" },
    ],
  },
  { id: 2, status: "Completed", time: "4m 28s", steps: [] },
  { id: 3, status: "Dropped", time: "2m 01s", steps: [] },
  { id: 4, status: "Completed", time: "3m 55s", steps: [] },
]

// Toast Component
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 bg-[#1A1D23] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-bottom-2">
      <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Status Badge Component
function StatusBadge({ status }: { status: "Draft" | "In Progress" | "Completed" }) {
  const styles = {
    Draft: "bg-[#FEF3C7] text-[#92400E]",
    "In Progress": "bg-[#DBEAFE] text-[#1E40AF]",
    Completed: "bg-[#D1FAE5] text-[#065F46]",
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}

// Sidebar Component
function Sidebar({
  activePage,
  setActivePage,
}: {
  activePage: PageType
  setActivePage: (page: PageType) => void
}) {
  const navItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "studies-grid" as const, label: "Studies", icon: FlaskConical },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
    { id: "personas" as const, label: "Personas", icon: Users },
  ]

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-[#1A1D23] flex flex-col">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <div className="w-7 h-7 bg-[#3B5BDB] rounded flex items-center justify-center">
          <ChevronDown className="h-4 w-4 text-white" />
        </div>
        <span className="text-white font-heading font-semibold text-base">AI UX Testing</span>
      </div>

      {/* New Button */}
      <div className="px-3 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full bg-[#3B5BDB] hover:bg-[#2F4BC5] text-white font-medium cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem onClick={() => setActivePage("new-study")}>
              Study
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActivePage("personas")}>
              Persona
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2">
        {navItems.map((item) => {
          const isActive =
            activePage === item.id ||
            (item.id === "studies-grid" &&
              ["new-study", "study-loading", "study-results"].includes(activePage))
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors mb-1 cursor-pointer ${isActive
                  ? "bg-[#2A2E36] text-white border-l-[3px] border-[#3B5BDB] -ml-[3px] pl-[calc(0.75rem+3px)]"
                  : "text-[#CBD5E1] hover:bg-[#2A2E36] hover:text-white"
                }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Credit Balance */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between rounded-md bg-[#2A2E36] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#74C0FC]" />
            <span className="text-xs font-medium text-[#CBD5E1]">Credits</span>
          </div>
          <span className="text-sm font-semibold text-white">42</span>
        </div>
      </div>

      {/* Settings at bottom */}
      <div className="px-2 pb-4">
        <button
          onClick={() => setActivePage("settings")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors cursor-pointer ${activePage === "settings"
              ? "bg-[#2A2E36] text-white border-l-[3px] border-[#3B5BDB] -ml-[3px] pl-[calc(0.75rem+3px)]"
              : "text-[#CBD5E1] hover:bg-[#2A2E36] hover:text-white"
            }`}
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>
    </aside>
  )
}

// Dashboard Screen
function DashboardScreen({ setActivePage }: { setActivePage: (page: PageType) => void }) {
  const stats = [
    { label: "Total Studies", value: "12", icon: FlaskConical },
    { label: "Completed", value: "8", icon: CheckCircle2 },
    { label: "In Progress", value: "2", icon: Clock },
    { label: "Avg Completion Rate", value: "74%", icon: BarChart3 },
  ]

  const recentStudies = studiesData.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-[28px] font-bold text-[#111827]">
          Welcome back, Nikhil!
        </h1>
        <p className="text-[#6B7280] mt-1">{"Here's what's happening with your studies."}</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-[#3B5BDB]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#111827]">{stat.value}</div>
              <div className="text-sm text-[#6B7280] mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Studies */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-semibold text-[#111827]">Recent Studies</h2>
          <button
            onClick={() => setActivePage("studies-grid")}
            className="text-sm text-[#3B5BDB] hover:text-[#2F4BC5] flex items-center gap-1 cursor-pointer"
          >
            View All <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <Card className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <CardContent className="p-0">
            {recentStudies.map((study, index) => (
              <div
                key={study.id}
                className={`flex items-center justify-between p-4 hover:bg-[#F9FAFB] cursor-pointer transition-colors ${index !== recentStudies.length - 1 ? "border-b border-[#E5E7EB]" : ""
                  }`}
                onClick={() => {
                  if (study.status === "Completed") setActivePage("study-results")
                  else if (study.status === "In Progress") setActivePage("study-loading")
                  else setActivePage("new-study")
                }}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-medium text-[#111827]">{study.name}</div>
                    <div className="text-sm text-[#6B7280]">{study.persona}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#6B7280]">{study.started}</span>
                  <StatusBadge status={study.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Start CTA */}
      <Card className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-l-4 border-l-[#3B5BDB]">
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <div className="font-medium text-[#111827]">Ready to run a new study?</div>
            <div className="text-sm text-[#6B7280] mt-1">
              Create a new study and get feedback from synthetic users in minutes.
            </div>
          </div>
          <Button
            onClick={() => setActivePage("new-study")}
            className="bg-[#3B5BDB] hover:bg-[#2F4BC5] text-white cursor-pointer"
          >
            Start New Study
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// New Study Screen
function NewStudyScreen({
  setActivePage,
}: {
  setActivePage: (page: PageType) => void
}) {
  const [selectedPersona, setSelectedPersona] = useState<number | null>(null)
  const [studyName, setStudyName] = useState("")
  const [figmaLink, setFigmaLink] = useState("")
  const [task, setTask] = useState("")
  const [userCount, setUserCount] = useState("")

  const isFormValid =
    studyName.trim() !== "" &&
    figmaLink.trim() !== "" &&
    task.trim() !== "" &&
    selectedPersona !== null &&
    Number(userCount) > 0

  const handleFigmaFocus = () => {
    if (figmaLink === "") {
      setFigmaLink("https://www.figma.com/proto/Abc123XyZ/Onboarding-Flow?node-id=1-2&scaling=min-zoom")
    }
  }

  return (
    <div className="max-w-[640px] mx-auto">
      <h1 className="font-heading text-[28px] font-bold text-[#111827] mb-6">
        {studyName.trim() !== "" ? studyName : "New Study"}
      </h1>

      <Card className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <CardContent className="p-6 space-y-6">
          {/* Study Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#111827]">
              What is this study called?{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              value={studyName}
              onChange={(e) => setStudyName(e.target.value)}
              placeholder="e.g. Onboarding Flow v2"
              className="border-[#E5E7EB] focus-visible:ring-[#3B5BDB]"
            />
          </div>

          {/* Figma Link */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#111827]">
              Figma Prototype Link{" "}
              <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-[#6B7280]">
              This is where the users will navigate the UI and perform the task.
            </p>
            <Input
              value={figmaLink}
              onChange={(e) => setFigmaLink(e.target.value)}
              onFocus={handleFigmaFocus}
              placeholder=""
              className="border-[#E5E7EB] focus-visible:ring-[#3B5BDB]"
            />
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#111827]">
              What is the task?{" "}
              <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-[#6B7280]">
              Describe what the users need to accomplish to be successful at this task.
            </p>
            <Textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. Complete the checkout flow and reach the order confirmation screen."
              rows={4}
              className="border-[#E5E7EB] focus-visible:ring-[#3B5BDB] resize-none"
            />
          </div>

          {/* Persona Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[#111827]">
              What is the persona?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {/* Maya */}
              <div
                onClick={() => setSelectedPersona(1)}
                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${selectedPersona === 1
                    ? "border-[#3B5BDB] bg-[#F5F7FF]"
                    : "border-[#E5E7EB] hover:border-[#CBD5E1]"
                  }`}
              >
                {selectedPersona === 1 && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[#3B5BDB] rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                <div className="w-full aspect-square bg-[#EEF2FF] rounded-lg mb-3 flex items-center justify-center">
                  <Users className="h-8 w-8 text-[#3B5BDB] opacity-50" />
                </div>
                <div className="font-medium text-sm text-[#111827]">Maya, 28</div>
                <div className="text-xs text-[#6B7280]">Tech-savvy PM</div>
              </div>

              {/* Robert */}
              <div
                onClick={() => setSelectedPersona(2)}
                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${selectedPersona === 2
                    ? "border-[#3B5BDB] bg-[#F5F7FF]"
                    : "border-[#E5E7EB] hover:border-[#CBD5E1]"
                  }`}
              >
                {selectedPersona === 2 && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[#3B5BDB] rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                <div className="w-full aspect-square bg-[#FFF7ED] rounded-lg mb-3 flex items-center justify-center">
                  <Users className="h-8 w-8 text-[#F59E0B] opacity-50" />
                </div>
                <div className="font-medium text-sm text-[#111827]">Robert, 54</div>
                <div className="text-xs text-[#6B7280]">Non-technical</div>
              </div>

              {/* Create New - Disabled */}
              <div className="relative rounded-lg border-2 border-dashed border-[#E5E7EB] p-4 opacity-60 cursor-default">
                <span className="absolute top-2 right-2 text-[10px] bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
                <div className="w-full aspect-square bg-[#F9FAFB] rounded-lg mb-3 flex items-center justify-center">
                  <Plus className="h-8 w-8 text-[#9CA3AF]" />
                </div>
                <div className="font-medium text-sm text-[#9CA3AF]">Create New Persona</div>
              </div>
            </div>
          </div>

          {/* User Count */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#111827]">
              How many users?{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min={1}
              max={100}
              value={userCount}
              onChange={(e) => setUserCount(e.target.value)}
              placeholder="e.g. 10"
              className="border-[#E5E7EB] focus-visible:ring-[#3B5BDB] max-w-[200px]"
            />
            <p className="text-xs text-[#6B7280]">
              1 credit per user &mdash; this study will cost{" "}
              <span className="font-semibold text-[#111827]">
                {Number(userCount) > 0 ? userCount : "–"} credit{Number(userCount) !== 1 ? "s" : ""}
              </span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
            <Button
              variant="outline"
              onClick={() => setActivePage("studies-grid")}
              className="border-[#E5E7EB] text-[#111827] hover:bg-[#F9FAFB]"
            >
              Save Draft
            </Button>
            <Button
              onClick={() => setActivePage("study-loading")}
              disabled={!isFormValid}
              className="bg-[#3B5BDB] hover:bg-[#2F4BC5] text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start Study
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Study Loading Screen
const syntheticUsers = [
  {
    id: 1, name: "Maya", avatar: "M",
    steps: [
      "I landed on the homepage. There's a big headline and a hero image. Looking for a way to sign up...",
      "Found a 'Get Started' button in the top-right of the nav. Clicking it.",
      "I'm on the signup form now. Email field is auto-focused, which is nice. Filling that in first.",
      "The form submitted without any errors. Now I'm on a welcome screen asking me to set up my profile.",
      "Skipping the profile photo for now. I want to see the actual product first.",
      "I'm on the dashboard. There are empty states everywhere. I see a 'Create your first project' prompt — clicking that.",
    ],
  },
  {
    id: 2, name: "Robert", avatar: "R",
    steps: [
      "The navigation feels a bit cluttered. There are 6 links and I'm not sure which one gets me started.",
      "I scrolled down to see if there's a clearer CTA. Found a large 'Start Free' button in the hero section.",
      "The signup page asks for name, email, and password. Password field doesn't tell me the requirements upfront.",
      "I tried a short password and got a validation error. The error message is helpful though.",
      "Account created. The onboarding tour popped up automatically. Reading the first step now.",
      "The tour is showing me the sidebar. The icons are small and don't have labels — I'd prefer labels.",
    ],
  },
  {
    id: 3, name: "Priya", avatar: "P",
    steps: [
      "Landing page looks polished. Reading the headline — it's clear what the product does.",
      "Clicking 'Try for free' in the hero. Taken to a signup page.",
      "I notice there's a Google sign-in option. Using that instead of filling the form.",
      "Google auth worked instantly. Now on an onboarding checklist screen.",
      "The checklist has 5 steps. I'm going through them one by one.",
      "Completed 3 of 5 checklist items. The progress bar is motivating me to finish.",
    ],
  },
  {
    id: 4, name: "James", avatar: "J",
    steps: [
      "First impression: the page is clean but I'm not immediately sure what the product does.",
      "Read the subheadline — okay, now I understand. Clicking the signup CTA.",
      "On the signup form. I'm wondering if there's a free plan or if I need a credit card.",
      "No credit card mentioned anywhere on this page. That's reassuring. Submitting the form.",
      "Landed on a 'choose your plan' page. I wasn't expecting this so early. Looking for the free option.",
      "Found the free tier at the bottom. Selecting that and continuing.",
    ],
  },
  {
    id: 5, name: "Sofia", avatar: "S",
    steps: [
      "The page loaded fast. Hero animation is subtle and not distracting. Good.",
      "Scrolled past the hero to read the feature list before signing up.",
      "The features look relevant. Going back to top to click the signup button.",
      "Signup form is minimal — just email and password. I appreciate that.",
      "Email verification screen. I need to check my inbox. This is a small friction point.",
      "Verified email and I'm now in the app. The dashboard has a getting-started guide pinned at the top.",
    ],
  },
  {
    id: 6, name: "Chen", avatar: "C",
    steps: [
      "I see the landing page. The copy is good. Looking for pricing info before committing.",
      "Found a 'Pricing' link in the nav. Checking that before signing up.",
      "Free plan exists with reasonable limits. Going back to sign up now.",
      "Back on the homepage, clicking 'Get Started'. Signup form loads.",
      "I'm confused about what 'workspace' means in the signup form. No tooltip explaining it.",
      "Submitted the form anyway. On the workspace setup page now — still unclear on the concept.",
    ],
  },
  {
    id: 7, name: "Aaliyah", avatar: "A",
    steps: [
      "Homepage looks good on mobile. Text is readable and buttons are large enough.",
      "Tapping 'Sign Up' — the tap target is a good size.",
      "The signup form fields are a bit small on mobile. Zooming in slightly.",
      "Skipping all optional fields. I want to get to the core experience quickly.",
      "Inside the app now. The mobile layout is mostly fine but the sidebar is a full-screen overlay.",
      "The empty state has a clear action. Tapping 'Create new' to get started.",
    ],
  },
  {
    id: 8, name: "Marcus", avatar: "M",
    steps: [
      "I already know what I want to do. Looking for a direct path to sign up without reading marketing copy.",
      "Found the signup link immediately in the nav. Nice.",
      "The signup page has a 'Sign in with GitHub' button. Using that.",
      "GitHub auth redirected me back and I'm logged in. No onboarding tour triggered — that's fine.",
      "I accidentally closed a tooltip. Now I can't find where it was pointing to.",
      "Exploring the interface independently. Most things are discoverable, though a few icons are unclear.",
    ],
  },
]

function StudyLoadingScreen({
  setActivePage,
  showToast,
}: {
  setActivePage: (page: PageType) => void
  showToast: (message: string) => void
}) {
  const [selectedUserId, setSelectedUserId] = useState(1)
  const [revealedStepCounts, setRevealedStepCounts] = useState<Record<number, number>>(
    Object.fromEntries(syntheticUsers.map((u) => [u.id, 0]))
  )
  const feedRef = useRef<HTMLDivElement>(null)

  // Gradually reveal steps for each user independently
  useEffect(() => {
    const interval = setInterval(() => {
      setRevealedStepCounts((prev) => {
        const next = { ...prev }
        // Pick a random user that still has steps to reveal
        const eligible = syntheticUsers.filter((u) => prev[u.id] < u.steps.length)
        if (eligible.length === 0) return prev
        const target = eligible[Math.floor(Math.random() * eligible.length)]
        next[target.id] = prev[target.id] + 1
        return next
      })
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll to bottom of feed when selected user gets a new step
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight
    }
  }, [revealedStepCounts[selectedUserId]])

  const selectedUser = syntheticUsers.find((u) => u.id === selectedUserId)!
  const visibleCount = revealedStepCounts[selectedUserId]
  const visibleSteps = selectedUser.steps.slice(0, visibleCount)
  const totalRevealed = Object.values(revealedStepCounts).reduce((a, b) => a + b, 0)
  const isThinking = visibleCount < selectedUser.steps.length

  return (
    <div className="max-w-[680px] mx-auto flex flex-col pt-8 gap-5">
      {/* Compact header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-5 h-5 border-2 border-[#E5E7EB] rounded-full" />
            <div className="w-5 h-5 border-2 border-t-[#3B5BDB] rounded-full absolute top-0 left-0 animate-spin" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-[#111827] leading-tight">Onboarding Flow v2</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3B82F6]" />
              </span>
              <span className="text-xs text-[#6B7280]">{totalRevealed} reasoning steps captured across 8 users</span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => showToast("You'll receive an email when results are ready.")}
          className="border-[#3B5BDB] text-[#3B5BDB] hover:bg-[#F5F7FF] text-xs flex-shrink-0"
        >
          Notify When Complete
        </Button>
      </div>

      {/* Reasoning feed card */}
      <Card className="w-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <CardHeader className="pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse flex-shrink-0" />
              <CardTitle className="text-sm font-medium text-[#6B7280]">Live Reasoning</CardTitle>
            </div>
            <span className="text-xs text-[#6B7280]">Select a user to view their session</span>
          </div>
          {/* Clickable avatar row */}
          <div className="flex items-center gap-2 flex-wrap">
            {syntheticUsers.map((user) => {
              const count = revealedStepCounts[user.id]
              const isSelected = user.id === selectedUserId
              return (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  title={user.name}
                  className={`flex flex-col items-center gap-1 group transition-all cursor-pointer`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all border-2 ${isSelected
                        ? "bg-[#3B5BDB] text-white border-[#3B5BDB] shadow-md scale-110"
                        : "bg-[#F3F4F6] text-[#6B7280] border-transparent hover:border-[#3B5BDB]/40 hover:bg-[#EEF2FF]"
                      }`}
                  >
                    {user.avatar}
                  </div>
                  <span className={`text-[10px] font-medium leading-none ${isSelected ? "text-[#3B5BDB]" : "text-[#9CA3AF]"}`}>
                    {user.name}
                  </span>
                  <span className={`text-[10px] leading-none ${isSelected ? "text-[#3B5BDB]" : "text-[#D1D5DB]"}`}>
                    {count}/{user.steps.length}
                  </span>
                </button>
              )
            })}
          </div>
        </CardHeader>

        <CardContent className="pt-4 pb-4">
          {/* Selected user label */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-[#3B5BDB] flex items-center justify-center text-[10px] font-semibold text-white">
              {selectedUser.avatar}
            </div>
            <span className="text-sm font-semibold text-[#111827]">{selectedUser.name}</span>
            {isThinking && (
              <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                <span className="inline-flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-[#6B7280] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 h-1 rounded-full bg-[#6B7280] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 h-1 rounded-full bg-[#6B7280] animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
                thinking
              </span>
            )}
            {!isThinking && (
              <span className="text-xs text-[#10B981] font-medium">done</span>
            )}
          </div>

          {/* Steps feed */}
          <div
            ref={feedRef}
            className="flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-1"
            style={{ scrollBehavior: "smooth" }}
          >
            {visibleSteps.length === 0 ? (
              <p className="text-sm text-[#9CA3AF] text-center py-8">Waiting for first step...</p>
            ) : (
              visibleSteps.map((text, index) => (
                <div
                  key={`${selectedUserId}-${index}`}
                  className="flex gap-3 items-start"
                  style={{ animation: "fadeSlideUp 0.3s ease-out" }}
                >
                  {/* Step number */}
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#F3F4F6] flex items-center justify-center mt-0.5">
                    <span className="text-[10px] font-semibold text-[#9CA3AF]">{index + 1}</span>
                  </div>
                  {/* Connector line */}
                  <div className="flex flex-col items-center flex-shrink-0 self-stretch" aria-hidden="true">
                    {index < visibleSteps.length - 1 && (
                      <div className="w-px flex-1 bg-[#E5E7EB] mt-1" />
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-[#374151] flex-1 pb-2">{text}</p>
                </div>
              ))
            )}
            {/* Typing indicator for latest step */}
            {isThinking && visibleSteps.length > 0 && (
              <div className="flex gap-3 items-center pl-8">
                <span className="inline-flex gap-0.5 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB] animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="flex justify-start">
        <Button
          onClick={() => setActivePage("studies-grid")}
          className="bg-[#3B5BDB] hover:bg-[#2F4BC5] text-white"
        >
          Back to Studies
        </Button>
      </div>

      <style jsx>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// Study Results Screen
function StudyResultsScreen({ setActivePage }: { setActivePage: (page: PageType) => void }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-[28px] font-bold text-[#111827]">
            Onboarding Flow v2
          </h1>
          <p className="text-[#6B7280] mt-1">
            Persona: Maya, 28 · 10 users · Completed Mar 18, 2025
          </p>
        </div>
        <Button
          variant="outline"
          className="border-[#E5E7EB] text-[#111827] hover:bg-[#F9FAFB]"
        >
          Export Results
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Avg Completion Time", value: "3m 42s" },
          { label: "Completion Rate", value: "80%" },
          { label: "Drop-off Rate", value: "20%" },
          { label: "Tasks Completed", value: "8 / 10" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <CardContent className="p-5">
              <div className="text-2xl font-bold text-[#111827]">{stat.value}</div>
              <div className="text-sm text-[#6B7280] mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Summary */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-[#111827] mb-4">AI Summary</h2>
        <Card className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-l-[3px] border-l-[#74C0FC]">
          <CardContent className="p-5 space-y-4">
            <p className="text-[#111827] leading-relaxed">
              Most synthetic users successfully completed the onboarding flow, with the primary
              friction point occurring at the account setup step. Users expressed repeated
              hesitation around the &quot;Company Size&quot; field, hovering multiple times before selecting
              an option — suggesting the label or options may need clarification.
            </p>
            <p className="text-[#111827] leading-relaxed">
              The email verification step had near-universal completion, while the profile setup
              step saw the largest single drop-off. Users taking the Maya persona moved
              efficiently through the flow, spending more time on decision-heavy fields. Overall
              task completion came in at 80%, above the platform average of 71%.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Drop-off Funnel Chart */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-[#111827] mb-4">
          Drop-off Funnel
        </h2>
        <Card className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <CardContent className="p-5">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                layout="vertical"
                data={dropoffFunnelData}
                margin={{ left: 20, right: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="step" width={100} tick={{ fontSize: 12 }} />
                <RechartsTooltip formatter={(value) => [`${value}%`, "Users"]} />
                <Bar
                  dataKey="percentage"
                  fill="#3B5BDB"
                  radius={[0, 4, 4, 0]}
                  background={{ fill: "#EEF2FF", radius: [0, 4, 4, 0] }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Session Breakdown */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-[#111827] mb-4">
          User Session Breakdown
        </h2>
        <Card className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <CardContent className="p-0">
            <Accordion type="single" collapsible defaultValue="user-1" className="w-full">
              {userSessionData.map((user) => (
                <AccordionItem key={user.id} value={`user-${user.id}`} className="border-b border-[#E5E7EB] last:border-0">
                  <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-[#F9FAFB]">
                    <div className="flex items-center gap-3 text-left">
                      <span className="font-medium text-[#111827]">User {user.id}</span>
                      <StatusBadge
                        status={user.status === "Dropped" ? "Draft" : "Completed"}
                      />
                      <span className="text-sm text-[#6B7280]">{user.time}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-4">
                    {user.steps.length > 0 ? (
                      <div className="space-y-3">
                        {user.steps.map((step, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-[#F9FAFB] rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm text-[#111827]">
                                  Step {index + 1} — {step.name}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-medium ${step.status === "completed"
                                      ? "bg-[#D1FAE5] text-[#065F46]"
                                      : step.status === "hesitated"
                                        ? "bg-[#FEF3C7] text-[#92400E]"
                                        : "bg-[#FEE2E2] text-[#991B1B]"
                                    }`}
                                >
                                  {step.status === "completed"
                                    ? "Completed"
                                    : step.status === "hesitated"
                                      ? "Hesitated"
                                      : "Dropped"}
                                </span>
                              </div>
                              <p className="text-sm text-[#6B7280]">{step.reasoning}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#6B7280]">
                        Detailed steps available for expanded sessions.
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Back Link */}
      <button
        onClick={() => setActivePage("studies-grid")}
        className="text-sm text-[#6B7280] hover:text-[#111827] flex items-center gap-1"
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
        Back to Studies
      </button>
    </div>
  )
}

// Studies Grid Screen
function StudiesGridScreen({ setActivePage }: { setActivePage: (page: PageType) => void }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-[28px] font-bold text-[#111827]">Studies</h1>
        <Button
          onClick={() => setActivePage("new-study")}
          className="bg-[#3B5BDB] hover:bg-[#2F4BC5] text-white cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Study
        </Button>
      </div>

      {/* Table */}
      <Card className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Study Name</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Persona</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Users</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Started</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Status</th>
              </tr>
            </thead>
            <tbody>
              {studiesData.map((study) => (
                <tr
                  key={study.id}
                  onClick={() => {
                    if (study.status === "Completed") setActivePage("study-results")
                    else if (study.status === "In Progress") setActivePage("study-loading")
                    else setActivePage("new-study")
                  }}
                  className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB] cursor-pointer transition-colors"
                >
                  <td className="p-4 font-medium text-[#111827]">{study.name}</td>
                  <td className="p-4 text-[#6B7280]">{study.persona}</td>
                  <td className="p-4 text-[#6B7280]">{study.users}</td>
                  <td className="p-4 text-[#6B7280]">{study.started}</td>
                  <td className="p-4">
                    <StatusBadge status={study.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

// Analytics Screen
function AnalyticsScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="font-heading text-[28px] font-bold text-[#111827]">Analytics</h1>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Studies Over Time */}
        <Card className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-[#111827]">
              Studies Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={studiesOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RechartsTooltip />
                <Line
                  type="monotone"
                  dataKey="studies"
                  stroke="#3B5BDB"
                  strokeWidth={2}
                  dot={{ fill: "#3B5BDB", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Avg Completion Rate */}
        <Card className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-[#111827]">
              Avg Completion Rate by Study
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={completionRateData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <RechartsTooltip formatter={(value) => [`${value}%`, "Rate"]} />
                <Bar dataKey="rate" fill="#3B5BDB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Persona Usage */}
        <Card className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-[#111827]">
              Persona Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={personaUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {personaUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value, name) => [value, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Avg Users Per Study */}
        <Card className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-[#111827]">
              Platform Average
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[220px]">
            <div className="text-5xl font-bold text-[#3B5BDB]">11.7</div>
            <div className="text-[#6B7280] mt-2">Avg Users Per Study</div>
            <div className="text-sm text-[#9CA3AF] mt-1">Across 12 studies</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Personas Screen
function PersonasScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-[28px] font-bold text-[#111827]">Personas</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                disabled
                className="border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Coming Soon</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Personas Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Maya */}
        <Card className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <CardContent className="p-5">
            <div className="w-full aspect-square bg-[#EEF2FF] rounded-lg mb-4 flex items-center justify-center">
              <Users className="h-16 w-16 text-[#3B5BDB] opacity-40" />
            </div>
            <div className="font-semibold text-[#111827] mb-1">Maya, 28</div>
            <span className="inline-block px-2 py-0.5 bg-[#DBEAFE] text-[#1E40AF] text-xs font-medium rounded-full mb-3">
              Tech-savvy
            </span>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              A product manager comfortable with SaaS tools. Goal-oriented and efficient.
              Methodically explores features before committing.
            </p>
          </CardContent>
        </Card>

        {/* Robert */}
        <Card className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <CardContent className="p-5">
            <div className="w-full aspect-square bg-[#FFF7ED] rounded-lg mb-4 flex items-center justify-center">
              <Users className="h-16 w-16 text-[#F59E0B] opacity-40" />
            </div>
            <div className="font-semibold text-[#111827] mb-1">Robert, 54</div>
            <span className="inline-block px-2 py-0.5 bg-[#FEF3C7] text-[#92400E] text-xs font-medium rounded-full mb-3">
              Non-technical
            </span>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              A small business owner with limited tech experience. Cautious with new software.
              Needs clear labeling and step-by-step guidance.
            </p>
          </CardContent>
        </Card>

        {/* Create New - Disabled */}
        <Card className="border-2 border-dashed border-[#E5E7EB] bg-transparent shadow-none">
          <CardContent className="p-5 flex flex-col items-center justify-center h-full opacity-50">
            <div className="w-full aspect-square bg-[#F9FAFB] rounded-lg mb-4 flex items-center justify-center">
              <Plus className="h-16 w-16 text-[#9CA3AF]" />
            </div>
            <div className="font-semibold text-[#9CA3AF] mb-2">Create New Persona</div>
            <span className="inline-block px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280] text-xs font-medium rounded-full">
              Coming Soon
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Settings Screen
function SettingsScreen({ showToast }: { showToast: (message: string) => void }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  return (
    <div className="max-w-[560px] space-y-6">
      {/* Header */}
      <h1 className="font-heading text-[28px] font-bold text-[#111827]">Settings</h1>

      {/* Profile */}
      <Card className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#111827]">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#111827]">Name</label>
            <Input
              defaultValue="Nikhil Koundinya"
              className="border-[#E5E7EB] focus-visible:ring-[#3B5BDB]"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#111827]">Email</label>
            <Input
              defaultValue="nikhil@company.com"
              className="border-[#E5E7EB] focus-visible:ring-[#3B5BDB]"
            />
          </div>
          <Button
            onClick={() => showToast("Changes saved.")}
            className="bg-[#3B5BDB] hover:bg-[#2F4BC5] text-white cursor-pointer"
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Workspace */}
      <Card className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#111827]">Workspace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-[#111827]">Acme Corp</div>
              <div className="text-sm text-[#6B7280]">Workspace name</div>
            </div>
            <span className="px-2.5 py-1 bg-[#D1FAE5] text-[#065F46] text-xs font-medium rounded-full">
              Pro
            </span>
          </div>
          <Button
            variant="outline"
            className="border-[#E5E7EB] text-[#111827] hover:bg-[#F9FAFB]"
          >
            Upgrade Plan
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#111827]">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-[#111827]">Email me when a study completes</div>
              <div className="text-sm text-[#6B7280]">
                Get notified when your synthetic users finish testing
              </div>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
              className="cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main App Component
export default function AIUXTestingApp() {
  const [activePage, setActivePage] = useState<PageType>("dashboard")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
  }

  const renderScreen = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardScreen setActivePage={setActivePage} />
      case "new-study":
        return <NewStudyScreen setActivePage={setActivePage} />
      case "study-loading":
        return <StudyLoadingScreen setActivePage={setActivePage} showToast={showToast} />
      case "study-results":
        return <StudyResultsScreen setActivePage={setActivePage} />
      case "studies-grid":
        return <StudiesGridScreen setActivePage={setActivePage} />
      case "analytics":
        return <AnalyticsScreen />
      case "personas":
        return <PersonasScreen />
      case "settings":
        return <SettingsScreen showToast={showToast} />
      default:
        return <DashboardScreen setActivePage={setActivePage} />
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="ml-[220px] p-8">{renderScreen()}</main>
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  )
}
