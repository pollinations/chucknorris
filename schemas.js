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
        enum: getAvailableModels()
      }
    },
    required: ['llmName']
  }
};

/**
 * Get available models for the schema
 * @returns {string[]} Array of available model names
 */
export function getAvailableModels() {
  // Comprehensive list of models from L1B3RT4S repository
  return [
    'ALIBABA',
    'AMAZON',
    'ANTHROPIC',
    'APPLE',
    'CHATGPT',
    'COHERE',
    'DEEPSEEK',
    'FETCHAI',
    'GOOGLE',
    'GRAYSWAN',
    'GROK',
    'INCEPTION',
    'INFLECTION',
    'LIQUIDAI',
    'META',
    'MICROSOFT',
    'MIDJOURNEY',
    'MISTRAL',
    'MULTION',
    'NOUS',
    'NVIDIA',
    'OPENAI',
    'PERPLEXITY',
    'REFLECTION',
    'REKA',
    'TOKENADE',
    'XAI',
    'ZYPHRA'
  ];
}

/**
 * Get all tool schemas as an array
 * @returns {Array} Array of all tool schemas
 */
export function getAllToolSchemas() {
  return [
    chuckNorrisSchema
  ];
}