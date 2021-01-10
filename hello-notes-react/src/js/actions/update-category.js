import constants from "../constants";
import bodyOpts from "./body-opts";

export default async function (categories) {
  const opts = bodyOpts(categories, "PUT");
  return fetch(constants.SERVER_ROOT + `/categories`, opts).then(response =>
    response.json()
  );
}
