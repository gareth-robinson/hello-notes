export default function (body, method) {
  return {
    method,
    headers: {
      accept: "application/json",
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  };
}
