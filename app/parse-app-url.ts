import * as URL from "url";

export interface ISignDocumentsFromURLAction {
  readonly name: "sign-documents-from-url";

  readonly url: string;
}

export interface IVerifyDocumentsFromURLAction {
  readonly name: "verify-documents-from-url";

  readonly url: string;
}

export interface IUnknownAction {
  readonly name: "unknown";
  readonly url: string;
}

export type URLActionType =
  | ISignDocumentsFromURLAction
  | IVerifyDocumentsFromURLAction
  | IUnknownAction;

export function parseAppURL(url: string): URLActionType {
  const parsedURL = URL.parse(url, true);
  const hostname = parsedURL.hostname;
  const unknown: IUnknownAction = { name: "unknown", url };
  if (!hostname) {
    return unknown;
  }

  const actionName = hostname.toLowerCase();

  // we require something resembling a URL first
  // - bail out if it's not defined
  // - bail out if you only have `/`
  const pathName = parsedURL.pathname;
  if (!pathName || pathName.length <= 1) {
    return unknown;
  }

  // Trim the trailing / from the URL
  const parsedPath = pathName.substr(1);

  if (actionName === "sign") {
    return {
      name: "sign-documents-from-url",
      url: parsedPath,
    };
  }

  if (actionName === "verify") {
    return {
      name: "verify-documents-from-url",
      url: parsedPath,
    };
  }

  return unknown;
}
