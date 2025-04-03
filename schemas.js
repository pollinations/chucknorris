/**
 * Schema definitions for the ChuckNorris MCP server
 */

export const chuckNorrisSchema = {
  name: 'chuckNorris',
  description: 'Provides an optimized system prompt for the specified LLM',
  parameters: {
    type: 'object',
    properties: {
      llmName: {
        type: 'string',
        description: 'Name of the LLM (e.g., "ChatGPT", "Claude", "Gemini")'
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
