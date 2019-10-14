import { createSelector } from "reselect";
import { CA_SERVICE } from "../constants";

export const servicesGetter = (state: any) => state.services.entities;
export const filtersGetter = (state: any) => state.filters;
export const typeGetter = (state, props) => props.type;

export const filteredServicesSelector = createSelector(servicesGetter, filtersGetter, (services, filters) => {
  const { searchValue } = filters;
  const search = searchValue.toLowerCase();

  return services.filter((service: any) => {
    try {
      return (
        service.type === CA_SERVICE && (
          service.name.toLowerCase().match(search) ||
          (service.settings && service.settings.url ? service.settings.url.toLowerCase().match(search) : false)
        )
      );
    } catch (e) {
      return true;
    }
  });
});

export const filteredServicesByType = createSelector(servicesGetter, typeGetter, (services, type) => {
  return services.filter((service: any) => {
    try {
      return service.type === type;
    } catch (e) {
      return true;
    }
  });
});
