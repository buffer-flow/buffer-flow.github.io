import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  browserMessageRequest,
  type ExtensionMessage,
  type ExtensionType,
} from '../lib/browserMessaging'


interface MsgViewProps {
  extensionType: ExtensionType
  actionName: string
  actionData?: ExtensionMessage
  redirectUrl?: string
}

export function MsgView({ extensionType, actionName, actionData, redirectUrl }: MsgViewProps) {
  const [extensionFound, setExtensionFound] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState<null | boolean>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // First check if the extension is installed by sending a "ping" message
    async function checkExtensionExists() {
      try {
        await browserMessageRequest(extensionType, 'ping', {}, 1000, 10);
        setExtensionFound(true);
      } catch (err) {
        setExtensionFound(false);
      }
    }
    if (!extensionFound) {
      checkExtensionExists();
      return;
    }

    // If we know the extension is there, send the actual message
    async function sendActionMessage() {
      setIsProcessing(true);
      try {
        await browserMessageRequest(extensionType, actionName, actionData || {});
        setSuccess(true);
      } catch (err) {
        setActionError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsProcessing(false);
      }
    }
    if (isProcessing === null) {
      sendActionMessage();
      return;
    }

    // If we completed the action and have a redirect URL, navigate there after a short delay
    if (success && redirectUrl) {
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 3000);
    }
  }, [extensionType, actionName, actionData, redirectUrl, extensionFound, isProcessing, success]);
  

  const productName = extensionType === 'linkem' ? 'Link\'em' : extensionType === 'showem' ? 'Show\'em' : 'Unknown';
  return (
    <>
      <div className="flex items-center justify-center min-h-screen p-8 relative z-10">
        <div className="w-full max-w-2xl">
          {extensionFound === null ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center text-white">
              <h1 className="text-3xl font-bold mb-4 text-shadow">Detecting extension...</h1>
            </div>
          ) : extensionFound === false ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center text-white">
              <h1 className="text-3xl font-bold mb-4 text-shadow">Extension Not Found</h1>
              <p className="mb-2">The {productName} extension is not installed.</p>
              <p className="mb-6">Please install the extension to continue.</p>
            </div>
          ) : isProcessing ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center text-white">
              <h1 className="text-3xl font-bold mb-4 text-shadow">Processing action...</h1>
            </div>
          ) : actionError ? (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-8 text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">Configuration Error</h2>
              <p>{actionError}</p>
            </div>
          ) : success ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center text-white">
              <h1 className="text-3xl font-bold mb-4 text-shadow">Great success...</h1>
              {!redirectUrl && (
                <p className="text-sm opacity-90">You can now close this page.</p>
              )}
              {redirectUrl && (
                <p>Redirecting you now...</p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}


export function MsgPage() {
  const [searchParams] = useSearchParams()

  const extensionType = searchParams.get('for') as ExtensionType | null
  const actionName = searchParams.get('name')
  const redirectUrl = searchParams.get('redirectUrl') || undefined

  if (!extensionType || (extensionType !== 'linkem' && extensionType !== 'showem')) {
    return <div>Invalid or missing "for" parameter. Must be "linkem" or "showem".</div>;
  }
  if (!actionName) {
    return <div>Missing "name" query parameter</div>;
  }

  const actionData = {} as ExtensionMessage;
  const notData = ['for', 'name', 'redirectUrl'];
  for (const [key, value] of searchParams.entries()) {
    if (!notData.includes(key)) actionData[key] = value;
  }

  return <MsgView extensionType={extensionType} actionName={actionName} actionData={actionData} redirectUrl={redirectUrl} />
}
