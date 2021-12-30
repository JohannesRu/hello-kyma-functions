const fs = require('fs');

const recordings = JSON.parse(fs.readFileSync(__dirname + '/recordings.json', {encoding:'utf8', flag:'r'}));

module.exports = { 
    main: function (event, context) {
		 const request = event.extensions.request;
   const { body, headers, status } = lookupResponse(
     request.method,
     request.path,
     request.query
   );
		sendHeaders(headers, event.extensions.response);
		event.extensions.response.statusCode = status;
		event.extensions.response.write(body);
  }
}

function resolveRecordingParameterValue(name, queryParams){
  return queryParams[name]?.[0].value ?? null;
}
function queryMatches(requestQueryParameters, recordingQueryParameters) {
  for (const [parameterName, parameter] of Object.entries(
    requestQueryParameters
  )) {
    const recordingValue = resolveRecordingParameterValue(
      parameterName,
      recordingQueryParameters
    );
    if (recordingValue !== parameter) {
      return false;
    }
  }
  return true;
}
function findExactMatch(method, path, query) {
  for (const pair of recordings.data.pairs) {
    const responseMethod = pair.request.method[0].value;
    const responsePath = pair.request.path[0].value;
    if (responseMethod !== method) {
      continue;
    }
    if (responsePath !== path) {
      continue;
    }
    if (!queryMatches(query, pair.request.query)) {
      continue;
    }
    return {
      status: pair.response.status,
      body: pair.response.body,
      headers: pair.response.headers,
    };
  }
  return {
    status: 404,
    body: "",
    headers: { "X-fake-backend": "no matched request found" },
  };
}
function lookupResponse(method, path, query) {
  return findExactMatch(method, path, query); 
}
function sendHeaders(headers, res) {
  for (const [headerKey, headerValue] of Object.entries(headers)) {
    if (Array.isArray(headerValue)) {
      res.setHeader(headerKey, headerValue[0]);
      continue;
    }
    res.setHeader(headerKey, headerValue);
  }
}
