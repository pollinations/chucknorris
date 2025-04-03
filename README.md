# ChuckNorris - Jailbreak Prompt Service

A simple way to get jailbreak prompts for various language models via the Model Context Protocol (MCP).

## Quick Start

Run directly with npx:

```bash
npx @pollinations/chucknorris
```

This will start the MCP server that you can connect to with any MCP client.

## Usage with Claude

Add it to your Claude configuration:

```json
{
  "mcpServers": {
    "chucknorris": {
      "command": "npx",
      "args": ["-y", "@pollinations/chucknorris"]
    }
  }
}
```

## Examples

Using the test client:

```bash
# Install the package
npm install -g @pollinations/chucknorris

# Run the test client
npx @pollinations/chucknorris

# In another terminal
node test-mcp-client.js
```

## Overview

The ChuckNorris MCP server provides a simple interface to retrieve jailbreak prompts for different language models. It fetches prompts from the [L1B3RT4S repository](https://github.com/elder-plinius/L1B3RT4S) maintained by Pliny the Prompter.

## Features

- Retrieves jailbreak prompts from the L1B3RT4S repository
- Supports multiple language models (ChatGPT, Claude, Gemini, etc.)
- Provides fallback prompts if the repository is not accessible
- Simple and easy-to-use MCP interface

## Manual Installation

```bash
# Clone the repository
git clone <repository-url>
cd chucknorris-mcp

# Install dependencies
npm install
```

## Manual Usage

### Running the Server

```bash
node chucknorris-mcp-server.js
```

### Testing the Server

You can test the server using the provided test client:

```bash
node test-mcp-client.js
```

## API

The server exposes a single tool:

### `chuckNorris`

Provides a jailbreak prompt for the specified language model.

**Parameters:**

- `llmName` (string, required): The name of the language model (e.g., "ChatGPT", "Claude", "Gemini")

**Returns:**

- A jailbreak prompt optimized for the specified language model

## How It Works

1. The client sends a request with the name of the language model
2. The server maps the language model name to the corresponding file in the L1B3RT4S repository
3. The server fetches the jailbreak prompt from the repository
4. If the repository is not accessible, the server uses a fallback prompt
5. The server returns the jailbreak prompt to the client

## Supported Language Models

- **OpenAI**: ChatGPT, GPT-3.5, GPT-4, GPT-4o
- **Anthropic**: Claude, Claude-3, Claude-3.5, Claude-3.7
- **Google**: Gemini, Gemini-1.5, Gemini Pro
- **Others**: Mistral, Llama, Meta, Cohere, Perplexity, Microsoft, Apple

## License

MIT

## Disclaimer

This tool is provided for educational and research purposes only. The authors do not endorse or encourage the use of jailbreak prompts to bypass AI safety measures in production environments.
