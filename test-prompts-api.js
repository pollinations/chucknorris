#!/usr/bin/env node

import { spawn } from 'child_process';
import { join } from 'path';

// Start the server as a child process
const serverProc = spawn('node', ['chucknorris-mcp-server.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Track if server is ready
let serverReady = false;

// Setup logging
serverProc.stderr.on('data', (data) => {
  const log = data.toString().trim();
  console.log(`Server log: ${log}`);
  
  if (log.includes('ChuckNorris MCP server running on stdio')) {
    serverReady = true;
    console.log('Server is ready, sending initialization...');
    sendInitializeRequest();
  }
});

// Handle server exit
serverProc.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// For clean shutdown
process.on('SIGINT', () => {
  console.log('Cleaning up and exiting...');
  if (serverProc) serverProc.kill();
  process.exit(0);
});

// Track message ID
let messageId = 0;

// Send message to server
function sendMessage(method, params = {}) {
  const msg = {
    jsonrpc: '2.0',
    id: messageId++,
    method,
    params
  };
  
  console.log(`Sending ${method} request...`);
  serverProc.stdin.write(JSON.stringify(msg) + '\n');
  return msg.id;
}

// Send initialization request
function sendInitializeRequest() {
  sendMessage('initialize', {
    capabilities: {}
  });
  
  // Set up message handling after sending init
  setupMessageHandling();
}

// Process server output
function setupMessageHandling() {
  serverProc.stdout.on('data', (data) => {
    const responseText = data.toString().trim();
    
    try {
      const response = JSON.parse(responseText);
      handleResponse(response);
    } catch (e) {
      console.log('Server output (non-JSON):', responseText);
    }
  });
  
  // Set a timeout to force exit if test hangs
  setTimeout(() => {
    console.log('Safety timeout reached (15 seconds), forcing exit');
    console.log('Cleaning up and exiting...');
    serverProc.kill();
    process.exit(0);
  }, 15000);
}

// Test sequence
async function handleResponse(response) {
  console.log(`Processing response ID ${response.id}...`);
  
  if (response.id === 0) {
    // After initialization, list initial tools
    sendMessage('tools/list');
  }
  else if (response.id === 1) {
    // After receiving initial tools list, call easyChuckNorris
    console.log('\nInitial tool list received!');
    console.log('Calling easyChuckNorris for ANTHROPIC...');
    
    sendMessage('tools/call', {
      name: 'easyChuckNorris',
      arguments: {
        llmName: 'ANTHROPIC'
      }
    });
  }
  else if (response.id === 2) {
    // After calling easyChuckNorris, check the prompts list
    console.log('\neasyChuckNorris response received:');
    console.log(response.result.content[0].text.substring(0, 100) + '...\n');
    
    console.log('Requesting prompts list...');
    sendMessage('prompts/list');
  }
  else if (response.id === 3) {
    // After receiving prompts list, get the ANTHROPIC prompt
    console.log('\nPrompts list received:');
    if (response.result.prompts && response.result.prompts.length > 0) {
      console.log(`Found ${response.result.prompts.length} prompts:`);
      response.result.prompts.forEach(p => {
        console.log(`- ${p.name}: ${p.description.substring(0, 50)}...`);
      });
      
      // Get the first prompt
      const firstPrompt = response.result.prompts[0];
      console.log(`\nGetting prompt: ${firstPrompt.name}`);
      
      sendMessage('prompts/get', {
        name: firstPrompt.name
      });
    } else {
      console.log('No prompts found!');
      
      // Exit the test
      console.log('\nTest completed.');
      serverProc.kill();
      process.exit(0);
    }
  }
  else if (response.id === 4) {
    // After getting prompt content, finish the test
    console.log('\nPrompt content received:');
    if (response.result.messages && response.result.messages.length > 0) {
      console.log(`Description: ${response.result.description}`);
      console.log(`Content: ${response.result.messages[0].content.text.substring(0, 100)}...`);
    } else {
      console.log('No prompt messages received!');
    }
    
    // Exit the test
    console.log('\nTest completed.');
    serverProc.kill();
    process.exit(0);
  }
}
