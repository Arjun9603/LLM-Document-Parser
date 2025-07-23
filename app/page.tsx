import InsuranceForm from "@/components/insurance-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">LLM Document Parser</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced AI-powered system for processing natural language queries and retrieving relevant information from
            insurance policy documents.
          </p>
        </div>
        <InsuranceForm />
      </div>
    </main>
  )
}
