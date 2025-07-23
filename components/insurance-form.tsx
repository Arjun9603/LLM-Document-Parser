"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import ApiKeySetup from "./api-key-setup"

interface InsuranceResponse {
  query: {
    type: string
    claimAmount?: number
    policyType: string
    keywords: string[]
  }
  relevantClauses: Array<{
    clause: string
    relevance: number
    source: string
  }>
  decision: {
    approved: boolean
    amount?: number
    justification: string
    confidence: number
  }
}

export default function InsuranceForm() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<InsuranceResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch("/api/insurance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401 || res.status === 500) {
          // API key related errors
          throw new Error(data.error || "API configuration error")
        }
        throw new Error(data.error || "Failed to process query")
      }

      setResponse(data.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)

      // Log the full error for debugging
      console.error("Insurance form error:", err)
    } finally {
      setLoading(false)
    }
  }

  const getDecisionIcon = (approved: boolean) => {
    return approved ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800"
    if (confidence >= 0.6) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Insurance Document Parser
          </CardTitle>
          <CardDescription>Enter your insurance query to get AI-powered analysis and decision</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="query">Insurance Query</Label>
              <Textarea
                id="query"
                placeholder="e.g., I need to claim $5000 for medical expenses under my health insurance policy..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[100px]"
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading || !query.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Analyze Query"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {error && error.includes("API key") && <ApiKeySetup />}

      {response && (
        <div className="space-y-6">
          {/* Query Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Query Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <Badge variant="outline">{response.query.type}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Policy Type</Label>
                  <Badge variant="outline">{response.query.policyType}</Badge>
                </div>
                {response.query.claimAmount && (
                  <div>
                    <Label className="text-sm font-medium">Claim Amount</Label>
                    <Badge variant="outline">${response.query.claimAmount.toLocaleString()}</Badge>
                  </div>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium">Keywords</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {response.query.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Relevant Clauses */}
          <Card>
            <CardHeader>
              <CardTitle>Relevant Policy Clauses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {response.relevantClauses.map((clause, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{clause.source}</Badge>
                      <Badge className={getConfidenceColor(clause.relevance)}>
                        {Math.round(clause.relevance * 100)}% relevant
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{clause.clause}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Decision */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getDecisionIcon(response.decision.approved)}
                Decision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={response.decision.approved ? "default" : "destructive"} className="ml-2">
                    {response.decision.approved ? "Approved" : "Denied"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Confidence</Label>
                  <Badge className={getConfidenceColor(response.decision.confidence)}>
                    {Math.round(response.decision.confidence * 100)}%
                  </Badge>
                </div>
              </div>
              {response.decision.amount && (
                <div>
                  <Label className="text-sm font-medium">Approved Amount</Label>
                  <div className="text-2xl font-bold text-green-600">${response.decision.amount.toLocaleString()}</div>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">Justification</Label>
                <p className="text-sm text-gray-700 mt-1">{response.decision.justification}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
