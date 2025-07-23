"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ExternalLink, Key } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ApiKeySetup() {
  return (
    <Card className="max-w-2xl mx-auto border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800">
          <Key className="h-5 w-5" />
          OpenAI API Key Required
        </CardTitle>
        <CardDescription className="text-yellow-700">
          To use the LLM Document Parser, you need to configure your OpenAI API key.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-yellow-200">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              <strong>Step 1:</strong> Get your OpenAI API key from the OpenAI platform
            </p>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Get API Key <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-yellow-200">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Step 2:</strong> Add your API key to the{" "}
            <code className="bg-gray-100 px-1 rounded">.env.local</code> file:
          </p>
          <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
            OPENAI_API_KEY=sk-your-actual-api-key-here
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-yellow-200">
          <p className="text-sm text-gray-700">
            <strong>Step 3:</strong> Restart your development server after adding the API key
          </p>
          <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mt-2">npm run dev</div>
        </div>
      </CardContent>
    </Card>
  )
}
