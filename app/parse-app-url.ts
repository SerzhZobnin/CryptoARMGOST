import * as URL from "url";

export interface ISignDocumentsFromURLAction {
  name: "sign-documents-from-url";
  url: string;
  command?: string;
  accessToken?: string;
}

export interface IVerifyDocumentsFromURLAction {
  name: "verify-documents-from-url";
  url: string;
  command?: string;
  accessToken?: string;
}

export interface IUnknownAction {
  name: "unknown";
  url: string;
  command?: string;
  accessToken?: string;
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
