interface ApolloEnrichmentRequest {
  details: Array<{
    first_name?: string;
    last_name?: string;
    organization_name?: string;
    email?: string;
    domain?: string;
    linkedin_url?: string;
  }>;
  reveal_personal_emails?: boolean;
  reveal_phone_number?: boolean;
}

export async function enrichLeadsWithApollo(leads: any[], apiKey: string) {
  const APOLLO_API_URL = 'https://api.apollo.io/api/v1/people/bulk_match';
  const BATCH_SIZE = 10; // Apollo allows up to 10 people per API call
  const enrichedLeads = [];

  // Process leads in batches of 10
  for (let i = 0; i < leads.length; i += BATCH_SIZE) {
    const batch = leads.slice(i, i + BATCH_SIZE);
    
    // Format the request for Apollo's API
    const request: ApolloEnrichmentRequest = {
      details: batch.map(lead => ({
        first_name: lead.first_name,
        last_name: lead.last_name,
        organization_name: lead.company_name,
        email: lead.email,
        domain: lead.website ? new URL(lead.website).hostname : undefined,
        linkedin_url: lead.linkedin_url
      })),
      reveal_personal_emails: true,
      reveal_phone_number: true
    };

    try {
      // Add delay to respect rate limits (50% of single enrichment limit)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch(APOLLO_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Apollo API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Process enriched data
      const enrichedBatch = data.matches.map((match: any, index: number) => ({
        ...batch[index],
        // Apollo enriched data
        emails: match.email ? [match.email, ...(match.personal_emails || [])] : [],
        phone_numbers: match.phone_numbers || [],
        social_links: {
          linkedin: match.linkedin_url,
          twitter: match.twitter_url
        },
        company_info: {
          name: match.organization?.name,
          website: match.organization?.website,
          industry: match.organization?.industry,
          size: match.organization?.employee_count,
          revenue: match.organization?.annual_revenue,
          founded_year: match.organization?.founded_year
        },
        job_info: {
          title: match.title,
          seniority: match.seniority,
          departments: match.departments
        },
        location: {
          city: match.city,
          state: match.state,
          country: match.country
        },
        enrichment_source: 'apollo',
        last_enriched: new Date().toISOString()
      }));

      enrichedLeads.push(...enrichedBatch);

    } catch (error) {
      console.error(`Error enriching batch ${i / BATCH_SIZE + 1}:`, error);
      // Continue with next batch even if current one fails
      continue;
    }
  }

  return enrichedLeads;
}
