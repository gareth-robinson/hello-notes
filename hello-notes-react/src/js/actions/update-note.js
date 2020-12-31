import constants from "../constants";
import bodyOpts from "./body-opts";

export default async function (note) {
  const opts = bodyOpts(note, "PATCH");
  return fetch(constants.SERVER_ROOT + `/${note.id}`, opts).then(response =>
    response.json()
  );
}
