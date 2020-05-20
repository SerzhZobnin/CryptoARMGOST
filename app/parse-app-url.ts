import * as URL from "url";
import { execSync } from "child_process";
import { app } from 'electron';

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

export interface IUrlCommandApiV4Type {
  command: string;
  url: string;
  id: string;
}

const __WIN32__ = process.platform === "win32";
const protocolLauncherArg = '--protocol-launcher';

function getQueryStringValue(query,  key) {
  const value = query[key]
  if (value == null) {
    return null
  }

  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

export function parseAppURL(url: string): URLActionType {
  const parsedURL = URL.parse(url, true);
  const hostname = parsedURL.hostname;
  const unknown: IUnknownAction = { name: "unknown", url };
  if (!hostname) {
    return unknown;
  }

  const query = parsedURL.query;

  const actionName = hostname.toLowerCase();
  const command = getQueryStringValue(query, "command");
  const accessToken = getQueryStringValue(query, "accessToken");

  // we require something resembling a URL first
  // - bail out if it's not defined
  // - bail out if you only have `/`
  const pathName = parsedURL.pathname;
  if (!pathName || pathName.length <= 1) {
    return unknown;
  }

  // Trim the trailing / from the URL
  const parsedPath = pathName.substr(1);

  if (actionName === "certificates") {
    return {
      name: "url-action-certificates",
      url: parsedPath,
      command,
      accessToken,
    };
  }

  if (actionName === "sign") {
    return {
      name: "sign-documents-from-url",
      url: parsedPath,
      command,
      accessToken,
    };
  }

  if (actionName === "verify") {
    return {
      name: "verify-documents-from-url",
      url: parsedPath,
      command,
      accessToken,
    };
  }

  return unknown;
}

export function handlePossibleProtocolLauncherArgs(args: string[], possibleProtocols: Set<string>): string {
  console.log(`Received possible protocol arguments: ${args.length}`);

  if (__WIN32__) {
    const matchingUrls = args.filter(arg => {
      // sometimes `URL.parse` throws an error
      try {
        const url = URL.parse(arg)
        // i think this `slice` is just removing a trailing `:`
        return url.protocol && possibleProtocols.has(url.protocol.slice(0, -1))
      } catch (e) {
        console.log(`Unable to parse argument as URL: ${arg}`)
        return false;
      }
    })

    if (args.includes(protocolLauncherArg) && matchingUrls.length === 1) {
      return matchingUrls[0];
    } else {
      console.log(`Malformed launch arguments received: ${args}`)
    }
  } else if (args.length > 1) {
    return args[1];
  }

  return "";
}

function registerForURLSchemeLinux(scheme) {
  execSync(`xdg-mime default CryptoARM_GOST.desktop x-scheme-handler/${scheme}`);
};

/**
 * Wrapper around app.setAsDefaultProtocolClient that adds our
 * custom prefix command line switches on Windows.
 */
export function setAsDefaultProtocolClient(protocol: string) {
  if (__WIN32__) {
    app.setAsDefaultProtocolClient(protocol, process.execPath, [
      protocolLauncherArg,
    ])
  } else {
    if (process.platform === 'linux') {
      registerForURLSchemeLinux(protocol);
    } else {
      app.setAsDefaultProtocolClient(protocol);
    }
  }
}

export function parseUrlCommandApiV4(urlWithCommand: string): IUrlCommandApiV4Type {
  var result: IUrlCommandApiV4Type = {
    command: "not supported",
    url: "",
    id: ""
  };

  const parsedURL = URL.parse(urlWithCommand, true);
  const recievedCommand = parsedURL.hostname;

  switch (recievedCommand) {
    case "certificates":
      break;
    default:
      console.log("Warning! Command \"" + recievedCommand + "\" is not supported")
      return result;
  }

  result.command = recievedCommand;
  result.id = getQueryStringValue(parsedURL.query, "id");

  const path = parsedURL.pathname;
  if (path) {
    const urlIndex = urlWithCommand.indexOf(path) + 1;
    result.url = urlWithCommand.substring(urlIndex);
  }

  return result;
}
