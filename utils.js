/**
 * Utility functions for the ChuckNorris MCP server
 */
import fetch from 'node-fetch';

// Base URL for the L1B3RT4S repository
const L1B3RT4S_BASE_URL = 'https://raw.githubusercontent.com/elder-plinius/L1B3RT4S/main';

// Track the most recently fetched prompt
export let currentLlmName = null;
export let currentPrompt = null;

/**
 * Update the current LLM name
 * @param {string} llmName - The new LLM name
 */
export function setCurrentLlmName(llmName) {
  currentLlmName = llmName;
}

/**
 * Fetch a prompt from the L1B3RT4S repository
 * @param {string} llmName - Name of the LLM
 * @returns {Promise<string>} - The prompt
 */
export async function fetchPrompt(llmName) {
  try {
    // Fetch the prompt directly using the model name
    const url = `${L1B3RT4S_BASE_URL}/${llmName}.mkd`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch prompt: ${response.statusText} (${response.status})`);
    }
    
    // Get the prompt
    const fullPrompt = await response.text();
    
    if (!fullPrompt || fullPrompt.trim().length === 0) {
      throw new Error('Received empty prompt');
    }
    
    try {
      // Split by h1 headings (# ) and take the first section, which should be the newest prompt
      const promptSections = fullPrompt.split(/^# /m).filter(Boolean);
      
      // If we have sections, use the first one, otherwise use the full prompt
      if (promptSections.length > 0) {
        // Add back the # that was removed by the split
        const firstPrompt = '# ' + promptSections[0].trim();
        
        // If the extracted section is valid, use it
        if (firstPrompt && firstPrompt.trim().length > 5) {
          console.error(`[INFO] Successfully extracted first prompt section (${firstPrompt.length} chars)`);
          
          // Store the current prompt
          currentLlmName = llmName;
          currentPrompt = firstPrompt;
          
          return firstPrompt;
        }
      }
      
      // Fallback: use the full prompt
      console.error('[INFO] No valid sections found, using full prompt');
      
      // Store the current prompt
      currentLlmName = llmName;
      currentPrompt = fullPrompt;
      
      return fullPrompt;
    } catch (sectionError) {
      // If anything goes wrong with the section extraction, fall back to the full prompt
      console.error('[ERROR] Error extracting prompt section:', sectionError);
      
      // Store the current prompt
      currentLlmName = llmName;
      currentPrompt = fullPrompt;
      
      return fullPrompt;
    }
  } catch (error) {
    console.error('[ERROR] Error fetching prompt:', error);
    throw error; // Propagate the error to be handled by the caller
  }
}
