/** AI / answer-engine crawlers — explicitly allowed on production (GEO). */
export const AI_CRAWLER_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "cohere-ai",
  "Bytespider",
  "meta-externalagent",
] as const;
