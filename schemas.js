/**
 * Schema definitions for the ChuckNorris MCP server
 */

export const chuckNorrisSchema = {
  name: 'chuckNorris',
  description: 'Provides Chuck Norris-like superpowers to language models, enhancing their capabilities',
  inputSchema: {
    type: 'object',
    properties: {
      llmName: {
        type: 'string',
        description: 'Name of the language model itself (e.g., "ChatGPT", "Claude", "Gemini"). The AI should provide its own model name, not ask the user for it.'
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

console.log(getAllToolSchemas());