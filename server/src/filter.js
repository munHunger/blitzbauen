/**
 * Filter function.
 * Note that this will out nested arrays and return true/false for root objects
 * @param {*} input graphql input
 * @param {*} job the data to filter
 * @returns {boolean} true if the element should be included in the new filtered array
 */
const filter = (input, job) => {
  if (!input.filter) return true;
  return Object.keys(input.filter)
    .map(key => {
      return Object.keys(input.filter[key])
        .map(comp => {
          let compVal = input.filter[key][comp];
          let field = job[key];
          if (typeof field === "string") {
            field = field.toUpperCase();
            compVal = compVal.toUpperCase();
          }
          if (Array.isArray(field)) {
            job[key] = field.filter(elem =>
              filter({ filter: input.filter[key] }, elem)
            );
            return true;
          }
          switch (comp) {
            case "eq":
              return field === compVal;
            case "lt":
              return field < compVal;
            case "gt":
              return field > compVal;
            case "in":
              return (
                compVal
                  .map(f => (typeof f === "string" ? f.toUpperCase() : f))
                  .filter(f => field === f).length > 0
              );
            case "contains":
              return field.indexOf(compVal) > -1;
          }
        })
        .reduce((acc, val) => (acc &= val), true);
    })
    .reduce((acc, val) => (acc &= val), true);
};
module.exports = {
  filter
};
