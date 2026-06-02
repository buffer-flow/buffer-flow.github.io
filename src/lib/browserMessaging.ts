import type { ExtensionId } from "./knownExtensions";

export interface ExtensionMessage {
  [key: string]: unknown
}

/**
 * Send a message to an extension
 */
export async function browserMessageSend(
  extensionName: ExtensionId,
  messageName: string,
  data: ExtensionMessage,
) {
  const messageAction = `${extensionName}-${messageName}`;
  window.postMessage({ action: messageAction, ...data }, '*');
}

/**
 * Listen for a specific response message from an extension
 */
export function browserMessageListen(
  extensionName: ExtensionId,
  messageName: string,
  callback: (data: ExtensionMessage) => void,
) {
  const messageAction = `${extensionName}-${messageName}`;
  function listener(event: MessageEvent) {
    if (event.source == window && event.data.action && event.data.action == messageAction) {
      callback(event.data.data);
    }
  }

  window.addEventListener("message", listener);
  return () => { window.removeEventListener("message", listener); }
}

export function browserMessageRequest(
  extensionName: ExtensionId,
  messageName: string,
  data: ExtensionMessage,
  timeout: number | null = 1000,
  retries: number = 3,
) {
  return new Promise((resolve, reject) => {
    let resolved = false;
    const responseName = messageName === 'ping' ? 'pong' : `${messageName}-completed`;
    browserMessageListen(extensionName, responseName, (response) => {
      resolved = true;
      resolve(response);
    });

    async function sendMessage(attempt: number) {
      if (resolved) return;
      if (attempt > retries) {
        reject(`Extension did not respond after ${retries} tries.`);
      } else {
        await browserMessageSend(extensionName, messageName, data);
        if (timeout !== null) {
          setTimeout(() => {
            sendMessage(attempt + 1);
          }, timeout);
        }
      }
    }

    sendMessage(0);
  });
}
