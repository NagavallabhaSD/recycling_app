"use client"

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Users, Gift } from "lucide-react"

// Mock data
const submissionTrend = [
  { date: "Mon", submissions: 45 },
  { date: "Tue", submissions: 52 },
  { date: "Wed", submissions: 38 },
  { date: "Thu", submissions: 65 },
  { date: "Fri", submissions: 78 },
  { date: "Sat", submissions: 92 },
  { date: "Sun", submissions: 88 },
]

const materialDistribution = [
  { name: "Plastic", value: 35 },
  { name: "Paper", value: 25 },
  { name: "Glass", value: 20 },
  { name: "Metal", value: 15 },
  { name: "Organic", value: 5 },
]

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4"]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-2">Welcome to EcoQuest Admin Control Panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Users</CardTitle>
            <Users className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2,543</div>
            <p className="text-xs text-slate-400 mt-1">+234 this month</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Submissions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12,458</div>
            <p className="text-xs text-slate-400 mt-1">+1,245 this week</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Pending Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">42</div>
            <p className="text-xs text-slate-400 mt-1">Need approval</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Rewards Given</CardTitle>
            <Gift className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3,892</div>
            <p className="text-xs text-slate-400 mt-1">₹1.2L distributed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Submission Trend</CardTitle>
            <CardDescription>Last 7 days of activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={submissionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                <Line
                  type="monotone"
                  dataKey="submissions"
                  stroke="#10b981"
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Material Distribution</CardTitle>
            <CardDescription>Breakdown of recycled materials</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={materialDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {materialDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Pending Actions</CardTitle>
          <CardDescription>Quick overview of tasks needing attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div>
                <p className="text-white font-medium">12 Submissions Awaiting Review</p>
                <p className="text-sm text-slate-400">Average wait time: 2 hours</p>
              </div>
              <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition">
                Review
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div>
                <p className="text-white font-medium">3 Rewards Pending Delivery</p>
                <p className="text-sm text-slate-400">Coordinate with sponsors</p>
              </div>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition">
                Manage
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div>
                <p className="text-white font-medium">2 Flagged Posts for Moderation</p>
                <p className="text-sm text-slate-400">Spam and inappropriate content</p>
              </div>
              <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition">
                Review
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
