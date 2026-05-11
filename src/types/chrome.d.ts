/* Type definitions for Chrome Extension API */
declare global {
  interface Window {
    chrome?: {
      runtime?: {
        sendMessage?: (
          message: Record<string, unknown>,
          callback?: (response?: unknown) => void
        ) => void
        lastError?: Error
        onMessage?: {
          addListener?: (
            listener: (
              request: Record<string, unknown>,
              sender: chrome.runtime.MessageSender,
              sendResponse: (response?: unknown) => void
            ) => void
          ) => void
          removeListener?: (
            listener: (
              request: Record<string, unknown>,
              sender: chrome.runtime.MessageSender,
              sendResponse: (response?: unknown) => void
            ) => void
          ) => void
        }
      }
    }
  }
}

declare namespace chrome {
  namespace runtime {
    interface MessageSender {
      tabId?: number
      frameId?: number
      id?: string
      url?: string
      tlsChannelId?: string
    }
  }
}

export {}
