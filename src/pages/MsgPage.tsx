import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  browserMessageRequest,
  type ExtensionMessage,
} from '../lib/browserMessaging'
import { KNOWN_EXTENSIONS, type ExtensionId } from '../lib/knownExtensions'
import { ExtensionDownloadButtons } from '../components/ExtensionDownloadButtons'


interface MsgViewProps {
  extensionId: ExtensionId
  actionName: string
  actionData?: ExtensionMessage
  redirectUrl?: string
}

function useDetectAndSendAction({ extensionId, actionName, actionData, redirectUrl }: MsgViewProps) {
  const [extensionFound, setExtensionFound] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState<null | boolean>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [redirectTimer, setRedirectTimer] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // First check if the extension is installed by sending a "ping" message
    async function checkExtensionExists() {
      try {
        await browserMessageRequest(extensionId, 'ping', {}, 1000, 3);
        // setExtensionFound(false);
        setExtensionFound(true);
      } catch (err) {
        setExtensionFound(false);
      }
    }
    if (!extensionFound) {
      checkExtensionExists();
      return;
    }
  }, [extensionId, extensionFound]);


  useEffect(() => {
    // If we know the extension is there, send the actual message
    async function sendActionMessage() {
      setIsProcessing(true);
      try {
        await browserMessageRequest(extensionId, actionName, actionData || {});
        setSuccess(true);
      } catch (err) {
        setActionError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsProcessing(false);
      }
    }
    if (extensionFound && !success && isProcessing === null) {
      sendActionMessage();
      return;
    }
  }, [extensionId, actionName, actionData, extensionFound, success, isProcessing]);

  useEffect(() => {
    // If we completed the action and have a redirect URL, navigate there after a short delay
    if (redirectTimer !== null) {
      setTimeout(() => {
        setRedirectTimer(redirectTimer - 1);
      }, 1000);
    }
    if (success && redirectUrl && redirectTimer === null) {
      setRedirectTimer(3);
    }
    if (redirectUrl && redirectTimer === 0) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl, success, redirectTimer]);
  
  return { extensionFound, actionError, success, isProcessing, redirectTimer };
}


export function MsgView({ extensionId, actionName, actionData, redirectUrl }: MsgViewProps) {
  const { extensionFound, actionError, success, isProcessing, redirectTimer } = useDetectAndSendAction({ extensionId, actionName, actionData, redirectUrl });
  const extensionInfo = KNOWN_EXTENSIONS[extensionId];
  const niceActionName = actionName.replaceAll('-', ' ').replaceAll('_', ' ');
  return (
    <>
      <div className="flex items-center justify-center min-h-screen p-8 relative z-10">
        <div className="w-full max-w-2xl">
          {extensionFound === null ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center text-white">
              <h1 className="text-3xl font-bold mb-4 text-shadow">Detecting extension...</h1>
            </div>
          ) : extensionFound === false ? (
            <div className="bg-yellow-500/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center text-white">
              <h1 className="text-3xl font-bold mb-4 text-shadow">Extension Not Found</h1>
              <p className="mb-2">The {extensionInfo.displayName} extension is not installed.</p>
              <p className="mb-6">Please install the extension to continue.</p>
              <ExtensionDownloadButtons extensionId={extensionId} />
            </div>
          ) : isProcessing ? (
            <div className="bg-blue-500/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center text-white">
              <h1 className="text-3xl font-bold mb-4 text-shadow">Asking {extensionInfo.displayName} to {niceActionName}...</h1>
            </div>
          ) : actionError ? (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-8 text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">Configuration Error</h2>
              <p>{actionError}</p>
            </div>
          ) : success ? (
            <div className="bg-green-500/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center text-white">
              <h1 className="text-3xl font-bold mb-4 text-shadow">{niceActionName.slice(0, 1).toUpperCase() + niceActionName.slice(1)} complete!</h1>
              {redirectUrl ? (
                <p>
                  Redirecting you to
                  <a href={redirectUrl}>{redirectUrl}</a>
                  in {redirectTimer} seconds...
                </p>
              ) : (
                <p className="text-sm opacity-90">You can now close this page.</p>
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

  const extensionId = searchParams.get('for') as ExtensionId | null
  const actionName = searchParams.get('name')
  const redirectUrl = searchParams.get('redirectUrl') || undefined

  if (!extensionId || !(extensionId in KNOWN_EXTENSIONS)) {
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

  return <MsgView extensionId={extensionId} actionName={actionName} actionData={actionData} redirectUrl={redirectUrl} />
}
