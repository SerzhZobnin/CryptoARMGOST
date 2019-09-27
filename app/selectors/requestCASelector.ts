import { createSelector } from "reselect";
import { mapToArr } from "../utils";

export const requestsGetter = (state: any) => state.requestsCA.entities;
export const filtersGetter = (state: any) => state.filters;

export const filteredRequestCASelector = createSelector(requestsGetter, filtersGetter, (requests, filters) => {
  const { searchValue } = filters;
  const search = searchValue.toLowerCase();
  const arrRequests = mapToArr(requests);

  return arrRequests.filter((request: any) => {
    try {
      return (
        request.status.toLowerCase().match(search) ||
        request.certRequestId.toLowerCase().match(search)
      );
    } catch (e) {
      return true;
    }
  });
});
