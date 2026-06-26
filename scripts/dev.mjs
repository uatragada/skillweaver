import { spawn } from "node:child_process";

const children = [];

function run(label, command, args) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: "development"
    }
  });
  children.push(child);
  child.on("exit", (code) => {
    if (code && !process.exitCode) process.exitCode = code;
    for (const sibling of children) {
      if (sibling !== child && !sibling.killed) sibling.kill();
    }
  });
  return child;
}

process.on("SIGINT", () => {
  for (const child of children) child.kill();
  process.exit(0);
});

run("api", "node", ["server/index.js"]);
run("web", "vite", ["--host", "127.0.0.1"]);

