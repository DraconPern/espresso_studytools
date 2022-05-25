export default function manageResponse(response, successcb) {
  return Promise.all([response.json(), response])
  .then(([responsejson, response]) => {
    if(!response.ok) {
      throw(responsejson.message);      ;
    }

    if(successcb)
      successcb(responsejson.message);

    return responsejson;
  });
};
