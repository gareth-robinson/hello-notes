import constants from "../constants";
import baseOpts from "./base-opts";

export default async function (query) {
  const encoded = encodeURIComponent(query);
  return fetch(constants.SERVER_ROOT + `/?search=${encoded}`, baseOpts)
    .then(response => response.json());
}
