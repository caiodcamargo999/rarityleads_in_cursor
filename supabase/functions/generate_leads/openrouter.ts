interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

export const AVAILABLE_MODELS = {
  'anthropic/claude-2': 'Claude 2',
  'anthropic/claude-instant-v1': 'Claude Instant',
  'google/palm-2-chat-bison': 'PaLM 2 Chat',
  'meta-llama/llama-2-70b-chat': 'Llama 2 70B',
  'openai/gpt-4': 'GPT-4',
  'openai/gpt-3.5-turbo': 'GPT-3.5 Turbo'
};

export async function generateWithLLM(
  prompt: string,
  model: keyof typeof AVAILABLE_MODELS,
  apiKey: string
): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://rarityleads.com',
      'X-Title': 'Rarity Leads'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: `You are an expert lead generation and sales assistant. Your task is to analyze the user's target customer description and create optimal search criteria for finding qualified B2B leads. Focus on:
1. Company characteristics (size, revenue, industry)
2. Decision maker profiles (roles, seniority)
3. Pain points and needs
4. Geographic and demographic factors
5. Behavioral indicators and buying signals`
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  const data: OpenRouterResponse = await response.json();
  return data.choices[0].message.content;
}
