export interface IMegafonSettings {
  mobileNumber: string;
}

export interface ICryptoProSettings {
  authURL: string;
  restURL: string;
}

export interface ICryptoProSVSSettings {
  hostName: string;
  applicationName: string;
}

export interface ICAServiceSettings {
  url: string;
}

export interface IService {
  id: string;
  type: "CA_SERVICE";
  settings: ICAServiceSettings;
  name: string;
}

export interface ICertificateRequestCA {
  id: string;
  certificateReq: string;
}
