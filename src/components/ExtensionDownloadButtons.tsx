import { getBrowserId, KNOWN_EXTENSIONS, type BrowserId, type ExtensionId, type ExtensionInfo } from "../lib/knownExtensions";

interface ExtensionDownloadButtonsProps {
  extensionId: ExtensionId;
}


export function ExtensionDownloadButtons({ extensionId }: ExtensionDownloadButtonsProps) {
  const extensionInfo = KNOWN_EXTENSIONS[extensionId];
  const currentBrowser = getBrowserId();


  return (
    <div className="flex flex-col justify-center items-center gap-3">
      {/* One big button at the top for the current browser */}
      {currentBrowser && extensionInfo.installLinks[currentBrowser] && (
        <ExtensionDownloadButton extensionInfo={extensionInfo} browserId={currentBrowser} bigger={true} />
      )}
      {/* All the other browser links smaller below it */}
      <div className="flex flex-row justify-center items-center flex-wrap gap-2">
        {Object.keys(extensionInfo.installLinks).filter(b => b !== currentBrowser).map((b, i) => (
          // @ts-ignore
          <ExtensionDownloadButton key={i} extensionInfo={extensionInfo} browserId={b} bigger={false} />
        ))}
      </div>
    </div>
  )
}

interface ExtensionDownloadButtonProps {
  extensionInfo: ExtensionInfo;
  browserId: BrowserId;
  bigger: boolean;
}

function ExtensionDownloadButton({ extensionInfo, browserId, bigger }: ExtensionDownloadButtonProps) {
  return (
    <a
    href={extensionInfo.installLinks[browserId]}
    className={'block rounded-xl bg-blue-500 px-4 py-2 w-fit shadow-2xl border-2 border-white ' + (
      bigger ? 'text-xl px-6' : 'text-base opacity-90'
    )}
    >
      <div>Install {extensionInfo.displayName}</div>
      <div>For {browserId.slice(0, 1).toUpperCase() + browserId.slice(1)}</div>
    </a>
  )
}
