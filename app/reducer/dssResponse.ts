import {
  FAIL, POST_AUTHORIZATION_USER_DSS, POST_OPERATION_CONFIRMATION,
  RESPONSE, START, SUCCESS,
} from "../constants";

const defaultResponse = {
  Image: "",
  Label: "",
  Title: "",
};

export default (response = defaultResponse, action) => {
  const { type, payload } = action;

  switch (type) {
    case POST_OPERATION_CONFIRMATION + START:
    case POST_AUTHORIZATION_USER_DSS + START:
      return defaultResponse;

    case POST_OPERATION_CONFIRMATION + RESPONSE:
    case POST_AUTHORIZATION_USER_DSS + RESPONSE:
      return {
        ...response,
        Image: payload.Image,
        Label: payload.Label,
        Title: payload.Title,
      };

    case POST_OPERATION_CONFIRMATION + RESPONSE + SUCCESS:
    case POST_OPERATION_CONFIRMATION + RESPONSE + FAIL:
    case POST_AUTHORIZATION_USER_DSS + RESPONSE + SUCCESS:
    case POST_AUTHORIZATION_USER_DSS + RESPONSE + FAIL:
      return defaultResponse;
  }

  return response;
};
