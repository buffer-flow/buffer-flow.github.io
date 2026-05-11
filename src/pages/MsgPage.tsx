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
import './MsgPage.css'

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
      <div className="msg-page">
        <div className="msg-container">
          {error && (
            <div className="msg-error">
              <h2>Configuration Error</h2>
              <p>{error}</p>
            </div>
          )}

          {!error && extensionFound === false && (
            <div className="msg-box">
              <h1>Extension Not Found</h1>
              <p>The {getProductName(extensionType)} extension is not installed.</p>
              <p>Please install the extension to continue.</p>
              
              <div className="install-link-section">
                <p className="checking-note">
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
                  className="install-btn"
                >
                  Install {getProductName(extensionType)}
                </a>
                <p className="checking-status">
                  {checkAttempts > 0 && `(Checked ${checkAttempts} times...)`}
                </p>
              </div>
            </div>
          )}

          {!error && extensionFound && isProcessing && (
            <div className="msg-box">
              <h1>Processing</h1>
              <p>Sending request to {getProductName(extensionType)}...</p>
              <div className="spinner"></div>
            </div>
          )}

          {!error && extensionFound && success && (
            <div className="msg-box success">
              <h1>Success!</h1>
              <p>Your action has been completed successfully.</p>
              {!redirectUrl && (
                <p className="close-message">You can now close this page.</p>
              )}
              {redirectUrl && (
                <p>Redirecting you now...</p>
              )}
            </div>
          )}

          {!error && extensionFound === null && (
            <div className="msg-box">
              <h1>Checking Installation</h1>
              <p>Please wait...</p>
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
