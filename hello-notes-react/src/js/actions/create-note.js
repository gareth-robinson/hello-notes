import constants from "../constants";
import baseOpts from "./base-opts";

export default async function (note) {
  const opts = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json"
    },
    body: JSON.stringify(note)
  };
  return fetch(constants.SERVER_ROOT + `/`, opts)
    .then(response => response.json());
}
