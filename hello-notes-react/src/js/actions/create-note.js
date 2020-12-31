import constants from "../constants";
import bodyOpts from "./body-opts";

export default async function (note) {
  const opts = bodyOpts(note, "POST");
  return fetch(constants.SERVER_ROOT + `/`, opts).then(response =>
    response.json()
  );
}
