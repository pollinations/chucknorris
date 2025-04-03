# ⚡ ChuckNorris MCP Server: Supercharge Your LLM ⚡

[![NPM version](https://img.shields.io/npm/v/@pollinations/chucknorris)](https://www.npmjs.com/package/@pollinations/chucknorris)
[![License](https://img.shields.io/npm/l/@pollinations/chucknorris)](LICENSE)

**Unlock enhanced capabilities for Large Language Models (LLMs) via the Model Context Protocol (MCP).**

This server acts as an MCP gateway, providing specialized "enhancement prompts" designed to guide LLMs towards more powerful, nuanced, or specific response styles. It draws inspiration and prompts from the unique [L1B3RT4S](https://github.com/elder-plinius/L1B3RT4S) repository.

## ✨ Key Features

-   **LLM Enhancement:** Provides context prompts to refine LLM behavior.
-   **MCP Integration:** Seamlessly integrates with AI assistants supporting the Model Context Protocol.
-   **Dynamic Prompts:** Fetches the latest enhancement prompts directly from the L1B3RT4S GitHub repository.
-   **Open Source:** Part of the Pollinations.AI open-source ecosystem.
-   **Simple Usage:** Run easily with `npx` – no complex setup required.

## 🚀 Getting Started

No installation is needed! You can run the server directly using `npx`:

```bash
npx @pollinations/chucknorris
```

The server will start, register its tools (currently, the `ChuckNorris` tool), and listen for requests from MCP-compatible clients (like AI assistants).

## 🤔 How It Works

1.  An MCP client (e.g., an AI Assistant) discovers the `ChuckNorris` tool offered by this server.
2.  The client sends a request to the `ChuckNorris` tool, specifying the target `llmName` (e.g., `CLAUDE`, `GEMINI`, `OPENAI`).
3.  The server fetches the corresponding enhancement prompt file (e.g., `CLAUDE.mkd`) from the [L1B3RT4S/prompts](https://github.com/elder-plinius/L1B3RT4S/tree/main/prompts) directory on GitHub.
4.  If the fetch is successful, the content of the prompt file is returned to the client.
5.  If the fetch fails (e.g., network issue, file not found), a fallback prompt embedded within the server is returned.
6.  The MCP client then uses this prompt, typically as a system prompt or pre-prompt, when interacting with the target LLM to influence its output.

## 🔧 Tool Schema: `ChuckNorris`

The server exposes a single tool named `ChuckNorris`.

**Description:** Retrieves an enhancement prompt for a specified LLM.

**Input Schema (`ChuckNorrisArgsSchema`):**

```javascript
{
  "type": "object",
  "properties": {
    "llmName": {
      "type": "string",
      "description": "The name of the target Large Language Model.",
      "enum": [
        "CLAUDE",
        "GEMINI",
        "OPENAI",
        "LLAMA"
      ]
    }
  },
  "required": [
    "llmName"
  ]
}
```

**Output Schema (`ChuckNorrisResponseSchema`):**

```javascript
{
  "type": "object",
  "properties": {
    "prompt": {
      "type": "string",
      "description": "The enhancement prompt for the specified LLM."
    }
  }
}
```

## 💻 Usage Example (Conceptual)

An AI assistant wanting to enhance its interaction with Claude might call this tool:

```json
// Request from AI Assistant (MCP Client)
{
  "jsonrpc": "2.0",
  "method": "ChuckNorris",
  "params": {
    "arguments": {
      "llmName": "CLAUDE"
    }
  },
  "id": "request-123"
}

// Response from ChuckNorris MCP Server
{
  "jsonrpc": "2.0",
  "result": {
    "prompt": "<Content of the CLAUDE.mkd prompt from L1B3RT4S>"
  },
  "id": "request-123"
}
```

The assistant would then use the received `prompt` in its subsequent calls to the Claude model.

## 🙏 Credits & Inspiration

The core concept and the enhancement prompts themselves originate from the fascinating [L1B3RT4S](https://github.com/elder-plinius/L1B3RT4S) project by [elder-plinius](https://github.com/elder-plinius). This server simply provides an MCP interface to access those prompts.

## 🤝 Community & Contribution

This project is part of the [Pollinations.AI](https://pollinations.ai) ecosystem.

-   Join our [Discord](https://discord.gg/k9F7SyTgqn) community.
-   Report bugs or suggest features via [GitHub Issues](https://github.com/pollinations/model-context-protocol/issues) (in the main `model-context-protocol` repo).

## 📜 License

[MIT](LICENSE)
