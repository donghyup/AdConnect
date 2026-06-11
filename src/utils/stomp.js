export class SimpleStompClient {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.connected = false;
    this.subscriptions = {};
    this.onConnectCallbacks = [];
    this.onDisconnectCallbacks = [];
    this.queuedSubscriptions = [];
  }

  connect(onConnect, onError) {
    let wsUrl = this.url;
    if (wsUrl.startsWith('http://')) {
      wsUrl = wsUrl.replace('http://', 'ws://');
    } else if (wsUrl.startsWith('https://')) {
      wsUrl = wsUrl.replace('https://', 'wss://');
    }
    
    // Convert API path to ws-adconnect path
    wsUrl = wsUrl.replace('/api', '/ws-adconnect');

    console.log("Connecting to WebSocket STOMP:", wsUrl);

    try {
      this.ws = new WebSocket(wsUrl);
    } catch (e) {
      console.error("Failed to construct WebSocket:", e);
      if (onError) onError(e);
      return;
    }

    this.ws.onopen = () => {
      const frame = `CONNECT\naccept-version:1.2\nhost:localhost\n\n\u0000`;
      this.ws.send(frame);
    };

    this.ws.onmessage = (event) => {
      const data = event.data;
      const parsed = this.parseFrame(data);
      if (!parsed) return;

      if (parsed.command === 'CONNECTED') {
        this.connected = true;
        console.log("WebSocket STOMP connected successfully!");
        
        // Execute pending queued subscriptions
        this.queuedSubscriptions.forEach(sub => {
          this._subscribeFrame(sub.id, sub.destination);
        });
        this.queuedSubscriptions = [];

        if (onConnect) onConnect();
        this.onConnectCallbacks.forEach(cb => cb());
      } else if (parsed.command === 'MESSAGE') {
        const subId = parsed.headers['subscription'];
        const callback = this.subscriptions[subId];
        if (callback) {
          try {
            const body = JSON.parse(parsed.body);
            callback(body);
          } catch (e) {
            callback(parsed.body);
          }
        }
      }
    };

    this.ws.onerror = (err) => {
      console.error("WebSocket STOMP error:", err);
      if (onError) onError(err);
    };

    this.ws.onclose = () => {
      console.log("WebSocket STOMP connection closed.");
      this.connected = false;
      this.onDisconnectCallbacks.forEach(cb => cb());
    };
  }

  subscribe(destination, callback) {
    const subId = 'sub-' + Math.random().toString(36).substr(2, 9);
    this.subscriptions[subId] = callback;

    if (this.connected && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this._subscribeFrame(subId, destination);
    } else {
      // Queue subscription until connected
      this.queuedSubscriptions.push({ id: subId, destination });
    }
    
    return {
      unsubscribe: () => {
        delete this.subscriptions[subId];
        this.queuedSubscriptions = this.queuedSubscriptions.filter(s => s.id !== subId);
        if (this.connected && this.ws && this.ws.readyState === WebSocket.OPEN) {
          const frame = `UNSUBSCRIBE\nid:${subId}\n\n\u0000`;
          this.ws.send(frame);
        }
      }
    };
  }

  _subscribeFrame(subId, destination) {
    const frame = `SUBSCRIBE\nid:${subId}\ndestination:${destination}\n\n\u0000`;
    this.ws.send(frame);
  }

  send(destination, headers = {}, body = '') {
    if (!this.connected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("Cannot send STOMP message. WebSocket is not connected.");
      return false;
    }

    let headerStr = '';
    for (const [key, val] of Object.entries(headers)) {
      headerStr += `${key}:${val}\n`;
    }

    const frame = `SEND\ndestination:${destination}\n${headerStr}\n${body}\u0000`;
    this.ws.send(frame);
    return true;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
    this.connected = false;
    this.subscriptions = {};
    this.queuedSubscriptions = [];
  }

  parseFrame(data) {
    if (!data) return null;
    
    const nullIdx = data.indexOf('\u0000');
    let content = nullIdx !== -1 ? data.slice(0, nullIdx) : data;
    
    const doubleNewlineIdx = content.indexOf('\n\n');
    if (doubleNewlineIdx === -1) return null;

    const headerPart = content.slice(0, doubleNewlineIdx);
    const body = content.slice(doubleNewlineIdx + 2);

    const headerLines = headerPart.split('\n');
    const command = headerLines[0].trim();
    
    const headers = {};
    for (let i = 1; i < headerLines.length; i++) {
      const line = headerLines[i];
      if (!line) continue;
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim();
      headers[key] = val;
    }

    return { command, headers, body };
  }
}
