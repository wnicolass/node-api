export default function buildRes(res, headers, body, status = 200) {
  res.statusCode = status;
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
  res.write(JSON.stringify(body));
  res.emit('ready');
}
