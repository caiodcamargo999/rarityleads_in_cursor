import { LeadInputForm } from '@/components/leads/LeadInputForm';

export default function LeadsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-medium mb-2">AI-Powered Lead Generation</h1>
        <p className="text-gray-400 mb-8">
          Describe your ideal client and let our AI find the perfect leads for you using multiple data sources.
        </p>
        
        <LeadInputForm />
        
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-medium mb-2">How it works:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Describe your ideal client in the text box above</li>
            <li>Choose your preferred AI model for analysis</li>
            <li>Set advanced filters to refine your search</li>
            <li>Click "Generate Leads" to get AI-powered results</li>
            <li>Your leads will be enriched with Apollo.io, LinkedIn, and other sources</li>
          </ol>
        </div>
      </div>
    </div>
  );
}