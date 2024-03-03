import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { target: 1, duration: "10s" },
    { target: 1, duration: "10s" },
  ],
  noConnectionReuse: false,
  dns: {
    ttl: "0",
    select: "random",
  },
};

const BASE_URL = "http://0.0.0.0:30466";

function getStatus(key, expectedValue, traceId) {
  const res = http.get(`${BASE_URL}/`, {
    headers: {
      "X-Trace-Id": traceId,
    },
  });
  check(res, { "status was 200": (r) => r.status == 200 });
}

export default function () {
  getStatus();
}
