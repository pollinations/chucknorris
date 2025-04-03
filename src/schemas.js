/**
 * Central export for all schema definitions
 */

import { optimizePromptSchema } from './services/promptSchema.js';

// Re-export all schemas
export {
  optimizePromptSchema
};

/**
 * Get all tool schemas as an array
 * @returns {Array} Array of all tool schemas
 */
export function getAllToolSchemas() {
  return [
    optimizePromptSchema
  ];
}
