import { createSelector } from "reselect";

export const crlsGetter = (state: any) => state.crls.entities;
export const filtersGetter = (state: any) => state.filters;

export const filteredCrlsSelector = createSelector(crlsGetter, filtersGetter, (crls, filters) => {
  const { searchValue } = filters;
  const search = searchValue.toLowerCase();
  const arrCrls = crls;

  return arrCrls.filter((crl: any) => {
    try {
      return (
        crl.hash.toLowerCase().match(search) ||
        crl.issuerFriendlyName.toLowerCase().match(search) ||
        crl.lastUpdate.toLowerCase().match(search) ||
        crl.nextUpdate.toLowerCase().match(search) ||
        crl.signatureAlgorithm.toLowerCase().match(search)
      );
    } catch (e) {
      return true;
    }
  });
});
