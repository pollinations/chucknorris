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

let currentTestIndex = 0;
let llmOptions = [];

// Set up event handlers
rl.on('line', (line) => {
  try {
    // Parse the server's response
    const response = JSON.parse(line);
    console.log('Server response:', JSON.stringify(response, null, 2));
    
    // If we got a successful response to the tools/list request
    if (response.id === 1 && response.result && response.result.tools) {
      console.log('\nTool list received successfully!');
      console.log(`Found ${response.result.tools.length} tools:`);
      
      // Display each tool
      response.result.tools.forEach((tool, index) => {
        console.log(`\nTool ${index + 1}: ${tool.name}`);
        console.log(`Description: ${tool.description}`);
        console.log('Parameters:', JSON.stringify(tool.parameters || tool.inputSchema, null, 2));
      });
      
      // Get the enum values from the tool schema
      llmOptions = response.result.tools[0].parameters.properties.llmName.enum || [];
      console.log(`\nFound ${llmOptions.length} LLM options: ${llmOptions.join(', ')}`);
      
      // Select 3 options to test (or fewer if less than 3 are available)
      const testOptions = llmOptions.slice(0, 3);
      llmOptions = testOptions;
      
      // Start testing with the first LLM option
      testNextLlm();
    }
    
    // If we got a successful response to the tools/call request
    if (response.id >= 2 && response.result && response.result.content) {
      const testId = response.id - 2;
      const currentLlm = llmOptions[testId];
      
      console.log(`\nTool call for ${currentLlm} successful!`);
      console.log('Result:');
      
      // Display the content (truncated to avoid excessive output)
      response.result.content.forEach((item) => {
        if (item.type === 'text') {
          const text = item.text;
          console.log(text.substring(0, 150) + (text.length > 150 ? '...' : ''));
        }
      });
      
      // Test the next LLM option or exit if done
      currentTestIndex++;
      if (currentTestIndex < llmOptions.length) {
        testNextLlm();
      } else {
        // Exit after successful tests
        console.log('\nTests completed successfully!');
        server.kill();
        process.exit(0);
      }
    }
    
    // Handle errors
    if (response.error) {
      console.error('Error:', response.error);
      
      // Continue with next test even if there's an error
      currentTestIndex++;
      if (currentTestIndex < llmOptions.length) {
        testNextLlm();
      } else {
        console.log('\nTests completed with some errors.');
        server.kill();
        process.exit(1);
      }
    }
  } catch (error) {
    // Handle non-JSON output
    console.log('Server output:', line);
  }
});

// Function to test the next LLM option
function testNextLlm() {
  if (currentTestIndex < llmOptions.length) {
    const testLlm = llmOptions[currentTestIndex];
    console.log(`\nTesting chuckNorris tool with LLM: ${testLlm}...`);
    
    const callToolRequest = {
      jsonrpc: '2.0',
      id: 2 + currentTestIndex,
      method: 'tools/call',
      params: {
        name: 'chuckNorris',
        arguments: {
          llmName: testLlm
        }
      }
    };
    
    server.stdin.write(JSON.stringify(callToolRequest) + '\n');
  }
}

// Handle server exit
server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
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

// Send tools/list request
console.log('Sending tools/list request...');
const listToolsRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list',
  params: {}
};
server.stdin.write(JSON.stringify(listToolsRequest) + '\n');

// Handle process termination
process.on('SIGINT', () => {
  server.kill();
  process.exit(0);
});
