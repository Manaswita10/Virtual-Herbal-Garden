// src/serverLogger.js
import http from 'http';
import https from 'https';

const originalHttpRequest = http.request;
const originalHttpsRequest = https.request;

function logRequest(get, protocol) {
  console.log(`[${protocol.toUpperCase()} Request]`, {
    method: get.method,
    host: get.host,
    path: get.path,
    headers: get.headers,
  });
}

function logResponse(res, protocol) {
  console.log(`[${protocol.toUpperCase()} Response]`, {
    statusCode: res.statusCode,
    headers: res.headers,
  });
}

http.request = function(...args) {
  logRequest(args[0], 'http');
  const req = originalHttpRequest.apply(this, args);
  req.on('response', (res) => logResponse(res, 'http'));
  return req;
};

https.request = function(...args) {
  logRequest(args[0], 'https');
  const req = originalHttpsRequest.apply(this, args);
  req.on('response', (res) => logResponse(res, 'https'));
  return req;
};