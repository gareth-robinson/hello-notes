import constants from "../constants";
import baseOpts from "./base-opts";

export default async function () {
  return fetch(constants.SERVER_ROOT, baseOpts)
    .then(response => response.json());
}
