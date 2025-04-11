#!/usr/bin/env node

import { spawn } from 'child_process';
import { createInterface } from 'readline';

// Start the Chuck Norris MCP server
const server = spawn('node', ['chucknorris-mcp-server.js'], {
  stdio: ['pipe', 'pipe', process.stderr]
});

// Create readline interface for server stdout
const rl = createInterface({
  input: server.stdout,
  crlfDelay: Infinity
});

let llmOptions = [];
let initialSchema = null;
let processedIds = new Set(); // Track which IDs we've already processed
let testLlm = 'ANTHROPIC'; // Default LLM to test with

// Set up event handlers
rl.on('line', (line) => {
  try {
    // Parse the server's response
    const response = JSON.parse(line);
    
    // Skip if we've already processed this ID (prevents duplicate processing)
    if (processedIds.has(response.id)) {
      console.log(`Already processed response ID ${response.id}, skipping.`);
      return;
    }
    
    console.log(`Processing response ID ${response.id}...`);
    processedIds.add(response.id);

    // Track the initial tools/list response
    if (response.id === 1 && response.result && response.result.tools) {
      console.log('\nInitial tool list received!');
      initialSchema = response.result.tools[0];
      console.log(`Initial schema description: "${initialSchema.description.substring(0, 50)}..."`);
      
      // Get a valid LLM from the enum
      llmOptions = response.result.tools[0].parameters.properties.llmName.enum || [];
      if (llmOptions.length > 0) {
        testLlm = llmOptions[0];
      }
      
      // Move to next step - call the tool
      console.log(`\nWill test with LLM type: ${testLlm}`);
      setTimeout(() => {
        callToolWithLlm(testLlm);
      }, 500); // Add small delay to ensure server is ready
    }
    
    // Handle the tools/call response
    else if (response.id === 2 && response.result && response.result.content) {
      console.log(`\nTool call for ${testLlm} successful!`);
      
      // Get just a sample of the content for display
      let sampleContent = "";
      if (response.result.content && response.result.content.length > 0) {
        const item = response.result.content[0];
        if (item.type === 'text') {
          sampleContent = item.text.substring(0, 100) + "...";
        }
      }
      console.log(`Content sample: ${sampleContent}`);
      
      // Now request the tools list again to check if the schema changed
      console.log('\nChecking if schema changed after tool call...');
      setTimeout(() => {
        requestToolsList(3);
      }, 500); // Add small delay to ensure server is ready
    }
    
    // Track the second tools/list response to verify schema change
    else if (response.id === 3 && response.result && response.result.tools) {
      console.log('\nSecond tool list received!');
      const updatedSchema = response.result.tools[0];
      console.log(`Updated schema description: "${updatedSchema.description.substring(0, 50)}..."`);
      
      // Compare schemas to verify the change
      if (initialSchema.description !== updatedSchema.description) {
        console.log('\n✅ SUCCESS: Schema description changed as expected!');
        console.log('Initial schema type: Initial');
        console.log('Updated schema type: Enhanced with prompt from L1B3RT4S');
      } else {
        console.log('\n❌ ERROR: Schema description did not change after tool call!');
        console.log('Both schemas have the same description.');
      }
      
      console.log('\nTest completed.');
      cleanupAndExit(0);
    }
    
    // Handle errors
    if (response.error) {
      console.error('Error:', response.error);
      cleanupAndExit(1);
    }
  } catch (error) {
    // Handle non-JSON output
    console.log(`Server output (non-JSON): ${line.substring(0, 50)}...`);
  }
});

function cleanupAndExit(code) {
  console.log('Cleaning up and exiting...');
  try {
    rl.close();
    server.stdin.end();
    server.kill('SIGKILL');
  } catch (e) {
    console.error('Error during cleanup:', e);
  }
  // Force exit after a brief delay
  setTimeout(() => process.exit(code), 100);
}

// Function to call the tool with the selected LLM
function callToolWithLlm(llmName) {
  console.log(`\nTesting chuckNorris tool with LLM: ${llmName}...`);
  
  const callToolRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'chuckNorris',
      arguments: {
        llmName: llmName
      }
    }
  };
  
  const requestStr = JSON.stringify(callToolRequest) + '\n';
  console.log(`Sending tool call request: ${requestStr.substring(0, 50)}...`);
  server.stdin.write(requestStr);
}

// Function to request the tools list
function requestToolsList(id) {
  console.log(`Sending tools/list request with id ${id}...`);
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: id,
    method: 'tools/list',
    params: {}
  };
  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
}

// Handle server exit
server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle errors
server.on('error', (error) => {
  console.error('Server process error:', error);
  cleanupAndExit(1);
});

// Send initialization request
console.log('Sending initialization request...');
const initRequest = {
  jsonrpc: '2.0',
  id: 0,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'test-client',
      version: '1.0.0'
    }
  }
};
server.stdin.write(JSON.stringify(initRequest) + '\n');

// Send initial tools/list request
console.log('Sending initial tools/list request...');
requestToolsList(1);

// Handle process termination
process.on('SIGINT', () => {
  cleanupAndExit(0);
});

// Safety timeout - exit after 15 seconds no matter what
setTimeout(() => {
  console.log('Safety timeout reached (15 seconds), forcing exit');
  cleanupAndExit(1);
}, 15000);
