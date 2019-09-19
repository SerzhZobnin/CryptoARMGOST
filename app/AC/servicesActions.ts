import { IMegafonSettings, IService } from "../components/Services/types";
import { ADD_SERVICE, ADD_SERVICE_CERTIFICATE, CHANGE_SERVICE_NAME,
  CHANGE_SERVICE_SETTINGS, DELETE_CERTIFICATE, DELETE_SERVICE } from "../constants";

export function addService(service: IService) {
  return {
    payload: {
      service,
    },
    type: ADD_SERVICE,
  };
}

export function deleteService(id: string) {
  return {
    payload: {
      id,
    },
    type: DELETE_SERVICE,
  };
}

export function changeServiceSettings(id: string, settings: any) {
  return {
    payload: {
      id,
      settings,
    },
    type: CHANGE_SERVICE_SETTINGS,
  };
}

export function changeServiceName(id: string, name: string) {
  return {
    payload: {
      id,
      name,
    },
    type: CHANGE_SERVICE_NAME,
  };
}
