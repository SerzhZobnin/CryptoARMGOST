import { createSelector } from "reselect";
import { mapToArr } from "../utils";

export const servicesGetter = (state: any) => state.services.entities;
export const filtersGetter = (state: any) => state.filters;

export const filteredServicesSelector = createSelector(servicesGetter, filtersGetter, (services, filters) => {
  const { searchValue } = filters;
  const search = searchValue.toLowerCase();

  return services.filter((service: any) => {
    try {
      return (
        service.name.toLowerCase().match(search) ||
        (service.settings && service.settings.url ? service.settings.url.toLowerCase().match(search) : false)
      );
    } catch (e) {
      return true;
    }
  });
});
