export type ExtensionType = 'linkem' | 'showem'

export interface ExtensionMessage {
  [key: string]: unknown
}

/**
 * Check if an extension is installed by attempting to send a test message
 */
export async function checkExtensionInstalled(
  _extensionType: ExtensionType,
  timeout: number = 5000
): Promise<boolean> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(false)
    }, timeout)

    try {
      window.chrome?.runtime?.sendMessage?.(
        { action: 'ping' },
        (_response: unknown) => {
          clearTimeout(timer)
          if (window.chrome?.runtime?.lastError) {
            resolve(false)
          } else {
            resolve(true)
          }
        }
      )
    } catch {
      clearTimeout(timer)
      resolve(false)
    }
  })
}

/**
 * Send a message to an extension
 */
export async function sendExtensionMessage(
  extensionType: ExtensionType,
  name: string,
  data: ExtensionMessage,
  timeout: number = 5000
): Promise<ExtensionMessage | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(null)
    }, timeout)

    const messageType = `${extensionType}-${name}`

    try {
      window.chrome?.runtime?.sendMessage?.(
        { type: messageType, data },
        (response: unknown) => {
          clearTimeout(timer)
          if (window.chrome?.runtime?.lastError) {
            resolve(null)
          } else {
            resolve((response as ExtensionMessage) || null)
          }
        }
      )
    } catch {
      clearTimeout(timer)
      resolve(null)
    }
  })
}

/**
 * Listen for a specific response message from an extension
 */
export function listenForExtensionResponse(
  extensionType: ExtensionType,
  name: string,
  callback: (data: ExtensionMessage) => void
): () => void {
  const messageType = `${extensionType}-${name}-completed`

  const listener = (
    request: { type?: string; data?: ExtensionMessage },
    _sender: unknown,
    _sendResponse: (response?: unknown) => void
  ) => {
    if (request.type === messageType && request.data) {
      callback(request.data)
    }
  }

  window.chrome?.runtime?.onMessage?.addListener?.(listener as any)

  // Return unsubscribe function
  return () => {
    window.chrome?.runtime?.onMessage?.removeListener?.(listener as any)
  }
}
