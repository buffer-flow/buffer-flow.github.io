import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatedBackground } from '../components/AnimatedBackground'
import {
  checkExtensionInstalled,
  sendExtensionMessage,
  listenForExtensionResponse,
  type ExtensionType,
  type ExtensionMessage,
} from '../lib/extensionMessaging'

export function MsgPage() {
  const [searchParams] = useSearchParams()

  const extensionType = searchParams.get('for') as ExtensionType | null
  const actionName = searchParams.get('name')
  const actionData = searchParams.get('data')
  const redirectUrl = searchParams.get('redirect')

  const [extensionFound, setExtensionFound] = useState<boolean | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [checkAttempts, setCheckAttempts] = useState(0)

  // Validate query parameters
  useEffect(() => {
    if (!extensionType || (extensionType !== 'linkem' && extensionType !== 'showem')) {
      setError('Invalid or missing "for" parameter. Must be "linkem" or "showem".')
      return
    }

    if (!actionName) {
      setError('Missing "name" query parameter.')
      return
    }
  }, [extensionType, actionName])

  // Check for extension installation
  useEffect(() => {
    if (!extensionType) return

    const checkExtension = async () => {
      const found = await checkExtensionInstalled(extensionType)
      setExtensionFound(found)

      if (found && actionName && actionData) {
        // Extension found, send message
        await sendMessageToExtension()
      }
    }

    checkExtension()

    // Set up interval to keep checking
    const interval = setInterval(() => {
      checkExtension()
      setCheckAttempts((prev) => prev + 1)
    }, 10000)

    return () => clearInterval(interval)
  }, [extensionType])

  // Send message to extension when it's found
  const sendMessageToExtension = async () => {
    if (!extensionType || !actionName) return

    setIsProcessing(true)

    try {
      // Parse data if it's JSON, otherwise send as-is
      let parsedData: ExtensionMessage = {}
      if (actionData) {
        try {
          parsedData = JSON.parse(actionData)
        } catch {
          parsedData = { raw: actionData }
        }
      }

      // Send the message
      const response = await sendExtensionMessage(extensionType, actionName, parsedData)

      if (response) {
        // Listen for completion message
        const unsubscribe = listenForExtensionResponse(
          extensionType,
          actionName,
          (_completedData) => {
            unsubscribe()
            setSuccess(true)
            setIsProcessing(false)

            // Redirect if redirect URL was provided
            if (redirectUrl) {
              setTimeout(() => {
                window.location.href = decodeURIComponent(redirectUrl)
              }, 1000)
            }
          }
        )

        // Timeout if no response within 30 seconds
        setTimeout(() => {
          unsubscribe()
          if (!success) {
            setError('Extension did not respond in time. Please try again.')
            setIsProcessing(false)
          }
        }, 30000)
      } else {
        setError('Failed to send message to extension.')
        setIsProcessing(false)
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setIsProcessing(false)
    }
  }

  const getProductName = (type: ExtensionType | null) => {
    return type === 'linkem' ? 'Link\'em' : type === 'showem' ? 'Show\'em' : 'Unknown'
  }

  return (
    <>
      <AnimatedBackground />
      <div className="flex items-center justify-center min-h-screen p-8 relative z-10">
        <div className="w-full max-w-2xl">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-8 text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">Configuration Error</h2>
              <p>{error}</p>
            </div>
          )}

          {!error && extensionFound === false && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center text-white">
              <h1 className="text-3xl font-bold mb-4 text-shadow">Extension Not Found</h1>
              <p className="mb-2">The {getProductName(extensionType)} extension is not installed.</p>
              <p className="mb-6">Please install the extension to continue.</p>
              
              <div className="space-y-4">
                <p className="text-sm opacity-90">
                  If you've just installed the extension, this page will update automatically in 10 seconds.
                </p>
                <a
                  href={
                    extensionType === 'linkem'
                      ? 'https://chrome.google.com/webstore'
                      : 'https://chrome.google.com/webstore'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg transition-all duration-300 font-medium"
                >
                  Install {getProductName(extensionType)}
                </a>
                {checkAttempts > 0 && (
                  <p className="text-sm opacity-75">
                    (Checked {checkAttempts} times...)
                  </p>
                )}
              </div>
            </div>
          )}

          {!error && extensionFound && isProcessing && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center text-white">
              <h1 className="text-3xl font-bold mb-4 text-shadow">Processing</h1>
              <p className="mb-6">Sending request to {getProductName(extensionType)}...</p>
              <div className="flex justify-center">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            </div>
          )}

          {!error && extensionFound && success && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center text-white">
              <h1 className="text-3xl font-bold mb-4 text-shadow">Success!</h1>
              <p className="mb-4">Your action has been completed successfully.</p>
              {!redirectUrl && (
                <p className="text-sm opacity-90">You can now close this page.</p>
              )}
              {redirectUrl && (
                <p>Redirecting you now...</p>
              )}
            </div>
          )}

          {!error && extensionFound === null && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center text-white">
              <h1 className="text-3xl font-bold mb-4 text-shadow">Checking Installation</h1>
              <p className="mb-6">Please wait...</p>
              <div className="flex justify-center">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
