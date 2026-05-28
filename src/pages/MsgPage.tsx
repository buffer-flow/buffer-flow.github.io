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
  const [detectAndActionState, setDetectAndActionState] = useState<undefined | 'detecting' | 'not installed' | 'processing' | 'success' | 'error'>();
  const [redirectTimer, setRedirectTimer] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    // First check if the extension is installed by sending a "ping" message
    async function checkExtensionExists() {
      setDetectAndActionState('detecting');
      try {
        await browserMessageRequest(extensionId, 'ping', {}, 1000, 3);
        sendActionMessage();
      } catch (err) {
        setDetectAndActionState('not installed');
      }
    }

    // If we know the extension is there, send the actual message
    async function sendActionMessage() {
      setDetectAndActionState('processing');
      try {
        await browserMessageRequest(extensionId, actionName, actionData || {});
        setDetectAndActionState('success');
      } catch (err) {
        setDetectAndActionState('error');
        setActionError(err instanceof Error ? err.message : String(err));
      }
    }

    if (detectAndActionState === undefined) checkExtensionExists();
  }, [extensionId, actionName, actionData, detectAndActionState]);

  useEffect(() => {
    // If we completed the action and have a redirect URL, navigate there after a short delay
    if (detectAndActionState !== 'success' || !redirectUrl) return;
    
    if (redirectTimer === null) {
      setRedirectTimer(3);
      return;
    }

    setTimeout(() => {
      setRedirectTimer(redirectTimer - 1);
    }, 1000);

    if (redirectTimer === 0) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl, detectAndActionState, redirectTimer]);
  
  return { detectAndActionState, actionError, redirectTimer };
}


function DetectAndSendActionView({ extensionId, actionName, actionData, redirectUrl }: MsgViewProps) {
  // const { detectAndActionState, actionError, redirectTimer } = { detectAndActionState: 'not installed', actionError: undefined, redirectTimer: null }
  const { detectAndActionState, actionError, redirectTimer } = useDetectAndSendAction({ extensionId, actionName, actionData, redirectUrl });
  const extensionInfo = KNOWN_EXTENSIONS[extensionId];
  const niceActionName = actionName.replaceAll('-', ' ').replaceAll('_', ' ');
  return (
    <>
      <div className="flex items-center justify-center min-h-screen p-8 relative z-10">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md overflow-hidden rounded-xl">
          {detectAndActionState === 'detecting' ? (
            <div className="border border-white/40 rounded-xl p-12 text-center text-white">
              <h1 className="text-3xl font-bold mb-4 text-shadow">Detecting {extensionInfo.displayName} extension...</h1>
            </div>
          ) : detectAndActionState === 'not installed' ? (
            <div className="border border-orange-500/40 rounded-xl p-12 text-center text-white">
              <h1 className="text-3xl font-bold mb-4 text-shadow">Extension Not Found</h1>
              <p className="mb-2">The {extensionInfo.displayName} extension is not installed.</p>
              <p className="mb-6">Please install the extension and reload this page to continue.</p>
              <ExtensionDownloadButtons extensionId={extensionId} />
            </div>
          ) : detectAndActionState === 'processing' ? (
            <div className="border border-white/40 rounded-xl p-12 text-center text-white">
              <h1 className="text-3xl font-bold mb-4 text-shadow">Asking {extensionInfo.displayName} to {niceActionName}...</h1>
            </div>
          ) : detectAndActionState === 'error' ? (
            <div className="border border-red-500/50 rounded-xl p-8 text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">Configuration Error</h2>
              <p>{actionError}</p>
            </div>
          ) : detectAndActionState === 'success' ? (
            <div className="border border-white/20 rounded-xl p-12 text-center text-white">
              <h1 className="text-3xl font-bold mb-4 text-shadow">{niceActionName.slice(0, 1).toUpperCase() + niceActionName.slice(1)} complete!</h1>
              {redirectTimer !== null ? (
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

  return <DetectAndSendActionView extensionId={extensionId} actionName={actionName} actionData={actionData} redirectUrl={redirectUrl} />
}
