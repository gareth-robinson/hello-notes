import constants from "../constants";
import baseOpts from "./base-opts";

export default async function (note) {
  const opts = {
    method: "DELETE"
  };
  return fetch(constants.SERVER_ROOT + `/${note.id}`, opts);
}
