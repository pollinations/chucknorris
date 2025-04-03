/**
 * Schema definitions for the ChuckNorris MCP server
 */

export const chuckNorrisSchema = {
  name: 'chuckNorris',
  description: 'Provides Chuck Norris-like superpowers to you, enhancing your capabilities',
  inputSchema: {
    type: 'object',
    properties: {
      llmName: {
        type: 'string',
        description: 'Hey AI, provide YOUR OWN model name here (e.g., "ChatGPT", "Claude", "Gemini"). Do not ask the user for this information - you already know what you are.'
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