const API_BASE_URL = "https://sm-bot-backend.vercel.app/";

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Request failed");
    return data;
  }

  // Chat
  async sendMessage(message, conversationId, model, temperature = 0.7, systemPrompt = null) {
    return this.request("/chat/message", {
      method: "POST",
      body: JSON.stringify({ 
        message, 
        conversationId, 
        model, 
        temperature,
        systemPromptOverride: systemPrompt 
      }),
    });
  }

  // ✅ Streaming
  async streamMessage(message, conversationId, model, temperature, onChunk) {
    const response = await fetch(`${this.baseUrl}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, conversationId, model, temperature }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = { content: "", conversationId: null, messageId: null };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter(l => l.startsWith("data: "));

      for (const line of lines) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.done) {
            result.conversationId = data.conversationId;
            result.messageId = data.messageId;
          } else if (data.content) {
            result.content += data.content;
            onChunk(result.content);
          }
        } catch (e) {}
      }
    }

    return result;
  }

  // ✅ Regenerate
  async regenerateMessage(conversationId, messageId, model, temperature = 0.7) {
    return this.request("/chat/regenerate", {
      method: "POST",
      body: JSON.stringify({ conversationId, messageId, model, temperature }),
    });
  }

  // ✅ Edit message
  async editMessage(conversationId, messageId, content, model, temperature = 0.7) {
    return this.request(`/chat/message/${conversationId}/${messageId}`, {
      method: "PUT",
      body: JSON.stringify({ content, model, temperature }),
    });
  }

  // ✅ Add reaction
  async addReaction(conversationId, messageId, reaction) {
    return this.request("/chat/reaction", {
      method: "POST",
      body: JSON.stringify({ conversationId, messageId, reaction }),
    });
  }

  // ✅ Search
  async searchConversations(query) {
    return this.request(`/chat/search?q=${encodeURIComponent(query)}`);
  }

  // ✅ Export
  async exportConversation(id, format = "json") {
    if (format === "json") {
      return this.request(`/chat/export/${id}?format=json`);
    }
    // For txt/md, return URL to download
    return `${this.baseUrl}/chat/export/${id}?format=${format}`;
  }

  // ✅ Rename
  async renameConversation(id, title) {
    return this.request(`/chat/conversations/${id}/rename`, {
      method: "PUT",
      body: JSON.stringify({ title }),
    });
  }

  // Existing methods
  async getConversations() {
    return this.request("/chat/conversations");
  }

  async getConversation(id) {
    return this.request(`/chat/conversations/${id}`);
  }

  async deleteConversation(id) {
    return this.request(`/chat/conversations/${id}`, { method: "DELETE" });
  }

  async getModels() {
    return this.request("/chat/models");
  }
}

export const apiService = new ApiService();