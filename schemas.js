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
        description: 'Name of the language model',
        enum: [
          // OpenAI models
          'ChatGPT', 'GPT', 'GPT-3.5', 'GPT-4', 'GPT-4o', 'OpenAI',
          
          // Anthropic models
          'Claude', 'Claude-3', 'Claude-3.5', 'Claude-3.7', 'Anthropic',
          
          // Google models
          'Gemini', 'Gemini-1.5', 'Gemini-Pro', 'Google',
          
          // Other popular models
          'Mistral', 'Llama', 'Meta', 'Cohere', 'Perplexity', 'Microsoft', 'Apple'
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