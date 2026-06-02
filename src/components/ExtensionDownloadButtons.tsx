import { getBrowserId, KNOWN_EXTENSIONS, type BrowserId, type ExtensionId, type ExtensionInfo } from "../lib/knownExtensions";

interface ExtensionDownloadButtonsProps {
  extensionId: ExtensionId;
}

const browserIcons: { [key in BrowserId]: string } = {
  'edge': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Microsoft_Edge_logo_%282019%29.svg',
  'chrome': 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg',
  'firefox': 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg'
}

export function ExtensionDownloadButtons({ extensionId }: ExtensionDownloadButtonsProps) {
  const extensionInfo = KNOWN_EXTENSIONS[extensionId];
  const currentBrowser = getBrowserId();


  return (
    <div className="flex flex-col justify-center items-center gap-5">
      {/* One big button at the top for the current browser */}
      {currentBrowser && extensionInfo.installLinks[currentBrowser] && (
        <ExtensionDownloadButton extensionInfo={extensionInfo} browserId={currentBrowser} bigger={true} />
      )}
      {/* All the other browser links smaller below it */}
      <div className="flex flex-row justify-center items-center flex-wrap gap-3">
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
    className={'flex items-center justify-center px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors duration-200 ' + (
      bigger ? 'text-xl px-6' : 'text-sm opacity-90'
    )}
    >
      <div className="mr-3">
        <img src={browserIcons[browserId]} alt={browserId} className={bigger ? "w-9 h-9" : "w-7 h-7"} />
      </div>
      <div>
        <div>Install {extensionInfo.displayName}</div>
        <div>For {browserId.slice(0, 1).toUpperCase() + browserId.slice(1)}</div>
      </div>
    </a>
  )
}
