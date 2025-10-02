// Utility for opening Google Drive links in the Drive app when possible
// Falls back to web preview/download if the app is unavailable or blocked

export type DriveAction = 'view' | 'download';

export const extractDriveFileId = (url: string): string | null => {
  try {
    const u = new URL(url);
    // Pattern 1: /file/d/<id>/...
    const m1 = u.pathname.match(/\/d\/([^/]+)/);
    if (m1 && m1[1]) return m1[1];
    // Pattern 2: ?id=<id>
    const idParam = u.searchParams.get('id');
    if (idParam) return idParam;
    return null;
  } catch {
    return null;
  }
};

const getPreviewUrl = (fileId: string) => `https://drive.google.com/file/d/${fileId}/preview`;
const getDownloadUrl = (fileId: string) => `https://drive.google.com/uc?export=download&id=${fileId}`;

const isAndroid = () => /Android/i.test(navigator.userAgent);
const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);

export const openInDriveApp = (originalUrl: string, action: DriveAction = 'view') => {
  const fileId = extractDriveFileId(originalUrl);
  // If not a recognizable Drive link, just open as-is
  if (!fileId) {
    window.open(originalUrl, '_blank');
    return;
  }

  const fallbackUrl = action === 'download' ? getDownloadUrl(fileId) : getPreviewUrl(fileId);

  if (isAndroid()) {
    // Use Android intent to open Drive app
    const intent = `intent://drive.google.com/file/d/${fileId}/view#Intent;scheme=https;package=com.google.android.apps.docs;S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end;`;
    // Navigate to intent (Chrome will try to open the app). If it fails, browser_fallback_url is used.
    window.location.href = intent;
    return;
  }

  if (isIOS()) {
    // Attempt to open Drive app via deep link, then fallback to App Store, then web
    const deeplink = `googledrive://open?id=${fileId}`;
    const appStore = 'https://apps.apple.com/app/id507874739'; // Google Drive on iOS

    let didHide = false;
    const visibilityChange = () => {
      if (document.hidden) didHide = true;
    };
    document.addEventListener('visibilitychange', visibilityChange, { once: true });

    // Try to open app
    window.location.href = deeplink;

    // After 1s, if app didn't open (tab not hidden), go to App Store
    setTimeout(() => {
      if (!didHide) {
        window.location.href = appStore;
        // After another 1s, fallback to web URL
        setTimeout(() => {
          if (!document.hidden) {
            window.location.href = fallbackUrl;
          }
        }, 1000);
      }
    }, 1000);
    return;
  }

  // Desktop fallback: open web URL in new tab
  window.open(fallbackUrl, '_blank');
};
