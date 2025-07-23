import { type NextRequest, NextResponse } from "next/server"
import { parseInsuranceQuery, searchRelevantClauses, evaluateDecision } from "@/lib/insurance-utils"

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_openai_api_key_here") {
      return NextResponse.json(
        {
          error: "OpenAI API key is not configured. Please add your API key to the .env.local file.",
        },
        { status: 500 },
      )
    }

    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Step 1: Parse the query
    const parsedQuery = await parseInsuranceQuery(query)

    // Step 2: Search for relevant clauses
    const relevantClauses = await searchRelevantClauses(parsedQuery)

    // Step 3: Evaluate decision
    const decision = await evaluateDecision(parsedQuery, relevantClauses)

    return NextResponse.json({
      success: true,
      data: {
        query: parsedQuery,
        relevantClauses,
        decision,
      },
    })
  } catch (error) {
    console.error("Error processing insurance query:", error)

    // Handle specific OpenAI API errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          {
            error: "Invalid OpenAI API key. Please check your API key configuration.",
          },
          { status: 401 },
        )
      }
      if (error.message.includes("quota")) {
        return NextResponse.json(
          {
            error: "OpenAI API quota exceeded. Please check your usage limits.",
          },
          { status: 429 },
        )
      }
    }

    return NextResponse.json({ error: "Failed to process insurance query" }, { status: 500 })
  }
}
