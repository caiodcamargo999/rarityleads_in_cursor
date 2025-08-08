export const AVAILABLE_MODELS = {
  'anthropic/claude-2': 'Claude 2',
  'anthropic/claude-instant-v1': 'Claude Instant',
  'google/palm-2-chat-bison': 'PaLM 2 Chat',
  'meta-llama/llama-2-70b-chat': 'Llama 2 70B',
  'openai/gpt-4': 'GPT-4',
  'openai/gpt-3.5-turbo': 'GPT-3.5 Turbo'
} as const;

export type ModelId = keyof typeof AVAILABLE_MODELS;
