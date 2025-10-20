import request from "supertest";
import { spawn } from "child_process";

let serverProcess;
const PORT = 4000;
const BASE = `http://localhost:${PORT}`;

beforeAll((done) => {
  // start server on a different port for tests
  serverProcess = spawn("node", ["server.js"], {
    env: { ...process.env, PORT: PORT },
    stdio: ["ignore", "pipe", "pipe"]
  });
  // wait a moment for server to start
  setTimeout(done, 800);
});

afterAll(() => {
  if (serverProcess) serverProcess.kill();
});

test("GET /me returns correct shape", async () => {
  const res = await request(BASE).get("/me").expect(200).expect('Content-Type', /json/);
  expect(res.body.status).toBe("success");
  expect(res.body.user).toBeDefined();
  expect(typeof res.body.user.email).toBe("string");
  expect(typeof res.body.user.name).toBe("string");
  expect(typeof res.body.user.stack).toBe("string");
  expect(typeof res.body.timestamp).toBe("string");
  expect(res.body.fact).toBeDefined();
});
