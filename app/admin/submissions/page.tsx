"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, AlertCircle, Search } from "lucide-react"

// Mock submission data
const mockSubmissions = [
  {
    id: 1,
    user: "Rajesh Kumar",
    material: "Plastic Bottle",
    confidence: 92,
    timestamp: "2 hours ago",
    image: "/plastic-bottle.png",
    status: "pending",
  },
  {
    id: 2,
    user: "Priya Singh",
    material: "Paper Box",
    confidence: 88,
    timestamp: "4 hours ago",
    image: "/simple-cardboard-box.png",
    status: "pending",
  },
  {
    id: 3,
    user: "Amit Patel",
    material: "Glass Jar",
    confidence: 95,
    timestamp: "6 hours ago",
    image: "/glass-jar.png",
    status: "pending",
  },
]

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState(mockSubmissions)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Using mock data in demo mode
  }, [])

  const handleApprove = async (id: number) => {
    setSubmissions(submissions.filter((sub) => sub.id !== id))
  }

  const handleReject = async (id: number) => {
    setSubmissions(submissions.filter((sub) => sub.id !== id))
  }

  const filtered = submissions.filter(
    (sub) =>
      sub.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.material.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Submission Verification</h1>
        <p className="text-slate-400 mt-2">Review and approve recycling submissions from users</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by user or material..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-900 border-slate-800 text-white"
        />
      </div>

      {/* Submissions Queue */}
      <div className="space-y-3">
        {filtered.map((submission) => (
          <Card key={submission.id} className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    src={submission.image || "/placeholder.svg"}
                    alt={submission.material}
                    className="w-20 h-20 rounded-lg object-cover bg-slate-800"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{submission.user}</h3>
                      <p className="text-sm text-slate-400">{submission.material}</p>
                      <p className="text-xs text-slate-500 mt-1">{submission.timestamp}</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-sm font-medium text-emerald-400">
                          {submission.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-800 justify-end">
                <Button
                  onClick={() => handleReject(submission.id)}
                  variant="outline"
                  className="gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <XCircle size={16} />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(submission.id)}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle2 size={16} />
                  Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No submissions found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
