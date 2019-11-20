import {
  FAIL, POST_OPERATION_CONFIRMATION, RESPONSE,
  START, SUCCESS,
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
      return defaultResponse;

    case POST_OPERATION_CONFIRMATION + RESPONSE:
      return {
        ...response,
        Image: payload.Image ,
        Label: payload.Label,
        Title: payload.Title,
      };

    case POST_OPERATION_CONFIRMATION + RESPONSE + SUCCESS:
    case POST_OPERATION_CONFIRMATION + RESPONSE + FAIL:
      return defaultResponse;
  }

  return response;
};
