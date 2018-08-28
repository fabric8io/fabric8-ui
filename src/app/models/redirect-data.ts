export class RedirectStatusData {
  statusMessage: string;
  secondaryStatusMessage?: string;
  callToActionUrl?: string;
  callToActionLabel?: string;
}

export class RedirectData {
  success?: RedirectStatusData;
  fail?: RedirectStatusData;
}
