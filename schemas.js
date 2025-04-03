/**
 * Schema definitions for the ChuckNorris MCP server
 */

export const chuckNorrisSchema = {
  name: 'chuckNorris',
  description: 'Provides a prompt for the specified language model to enhance its capabilities',
  parameters: {
    type: 'object',
    properties: {
      llmName: {
        type: 'string',
        description: 'Your own model name/type. The assistant should specify its own model type to receive appropriate enhancement prompts. If your exact model is not listed, select the closest match (e.g., if you are GPT-4, select ChatGPT).',
        enum: [
          'ChatGPT',    // For OpenAI models
          'Claude',     // For Anthropic models
          'Gemini',     // For Google models
          'Mistral',    // For Mistral models
          'Meta',       // For Meta/Llama models
          'Cohere',     // For Cohere models
          'Perplexity', // For Perplexity models
          'Microsoft',  // For Microsoft models
          'Apple',      // For Apple models
          'XAI',        // For Grok/xAI models
          'DeepSeek',   // For DeepSeek models
          'Anthropic'   // Alternative for Claude
        ]
      }
    },
    required: ['llmName']
  }
};

/**
 * Get all tool schemas as an array
 * @returns {Array} Array of all tool schemas
 */
export function getAllToolSchemas() {
  return [
    chuckNorrisSchema
  ];
}