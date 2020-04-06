import { SERVICE_REST } from "../constants";
import store from "../store";

export const getApplicationsFetch = () => {
  const token = window.localStorage.getItem("access_token");

  if (token) {
    store.dispatch(fetchApplicationsPending());
    return fetch(SERVICE_REST + "/app/list/v2", {
      headers: {
        Authorization: "Bearer " + token,
      },
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.code && data.code !== 200) {
          store.dispatch(fetchApplicationsError(data.message));

          window.localStorage.removeItem("access_token");
        } else {
          // tslint:disable-next-line: no-console
          console.log("data", data);

          store.dispatch(fetchApplicationsSuccess(data.data));
        }
      });
  }
};

const fetchApplicationsPending = () => ({
  type: "FETCH_APPLICATIONS_PENDING",
});

const fetchApplicationsError = (error: string) => ({
  error,
  type: "FETCH_APPLICATIONS_ERROR",
});

const fetchApplicationsSuccess = (applications: any) => ({
  payload: applications,
  type: "FETCH_APPLICATIONS_SUCCESS",
});
