import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../../app/AC/dssActions";
import {
  FAIL, GET_CERTIFICATES_DSS, GET_POLICY_DSS, POST_AUTHORIZATION_USER_DSS, START, SUCCESS,
} from "../../app/constants";
import { uuid } from "../../app/utils";

const URL = "https://dss.cryptopro.ru/STS/oauth";
const LOGIN = "test";
const PASSWORD = "password";
const INCORRECT_PASSWORD = "incorrectPassword";

const DATA = {
  access_token: "eyJ0eXAiOiJKeyJ1bmlxdWVfbmFtZSI6ImFsZzIi",
  expires_in: 300,
  token_type: "Bearer",
};

const body = "grant_type=password" + "&client_id=" + encodeURIComponent("cryptoarm") + "&scope=dss" +
  "&username=" + encodeURIComponent(LOGIN) + "&password=" + encodeURIComponent(PASSWORD) +
  "&resource=https://dss.cryptopro.ru/SignServer/rest/api/certificates";

actions.postApi = jest.fn((url: string, postfields: any, headerfields: string[]) => {
  if (postfields === body) {
    return Promise.resolve(DATA);
  } else {
    return Promise.reject("Cannot load data");
  }
});

uuid = jest.fn(() => "051fbf41-3bc5-8c69-9f59-a80e11a5157b");

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("async dss actions", () => {
  it("creates POST_AUTHORIZATION_USER_DSS + SUCCESS", () => {
    const store = mockStore({});

    const expectedActions = [
      { type: POST_AUTHORIZATION_USER_DSS + START },
      {
        payload: {
          access_token: "eyJ0eXAiOiJKeyJ1bmlxdWVfbmFtZSI6ImFsZzIi",
          expires_in: 300,
          id: "051fbf41-3bc5-8c69-9f59-a80e11a5157b",
          token_type: "Bearer",
        },
        type: POST_AUTHORIZATION_USER_DSS + SUCCESS,
      },
    ];

    return store.dispatch(actions.dssPostAuthUser(URL, LOGIN, PASSWORD)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("creates POST_AUTHORIZATION_USER_DSS + FAIL", () => {
    const store = mockStore({});

    const expectedActions = [
      { type: POST_AUTHORIZATION_USER_DSS + START },
      {
        type: POST_AUTHORIZATION_USER_DSS + FAIL,
      },
    ];

    return store.dispatch(actions.dssPostAuthUser(URL, LOGIN, INCORRECT_PASSWORD)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
