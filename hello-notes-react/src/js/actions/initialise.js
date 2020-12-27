import constants from "../constants";
import baseOpts from "./base-opts";

export default function (callback) {
  fetch(constants.SERVER_ROOT, baseOpts)
    .then(response => response.json())
    .then(data => callback(data));
}
