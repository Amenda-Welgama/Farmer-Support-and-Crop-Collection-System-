#!/usr/bin/env node
const net = require('net');
const { spawn } = require('child_process');

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => server.close(() => resolve(true)));
    // Listen on all interfaces to better detect conflicts (not just 127.0.0.1)
    try {
      server.listen({ port, host: '0.0.0.0' });
    } catch (e) {
      // fallback to localhost if host binding not allowed
      server.listen(port, '127.0.0.1');
    }
  });
}

async function findFreePort(start = 19000, end = 19200) {
  for (let p = start; p <= end; p++) {
    // eslint-disable-next-line no-await-in-loop
    const free = await isPortFree(p);
    if (free) return p;
  }
  throw new Error('No free port found in range');
}

(async () => {
  const dry = process.argv.includes('--dry');
  try {
    const chosenPort = await findFreePort();
    if (dry) {
      console.log(chosenPort);
      process.exit(0);
    }
    console.log(`Starting Expo on port ${chosenPort} (auto-selected)`);
    const args = ['expo', 'start', '--clear', '--dev-client', '--port', String(chosenPort)];
    // Use npx so the local CLI is used when available
    const spawnEnv = Object.assign({}, process.env);
    const child = spawn('npx', args, { stdio: 'pipe', shell: true, env: spawnEnv });

    // Relay child output to parent stdout/stderr, while also watching for prompts
    child.stdout.on('data', (data) => {
      const text = data.toString();
      process.stdout.write(text);
      // If Expo asks about using another port, answer 'yes' automatically
      if (/Use port .* instead\?/i.test(text) || /Use port .* instead\?/i.test(text)) {
        try { child.stdin.write('y\n'); } catch (e) {}
      }
    });
    child.stderr.on('data', (data) => {
      const text = data.toString();
      process.stderr.write(text);
      if (/Use port .* instead\?/i.test(text)) {
        try { child.stdin.write('y\n'); } catch (e) {}
      }
    });

    child.on('close', async (code) => {
      if (code !== 0) {
        // If the CLI exits non-zero, try the next few ports once
        try {
          const nextPort = await findFreePort(chosenPort + 1, chosenPort + 10);
          console.log(`Expo exited with code ${code}. Retrying on port ${nextPort}`);
          const retryArgs = ['expo', 'start', '--clear', '--dev-client', '--port', String(nextPort)];
          const retry = spawn('npx', retryArgs, { stdio: 'inherit', shell: true, env: spawnEnv });
          retry.on('close', (c) => process.exit(c));
        } catch (err) {
          console.error('Retry failed:', err);
          process.exit(code);
        }
      } else {
        process.exit(code);
      }
    });
  } catch (err) {
    console.error('Failed to start Expo:', err);
    process.exit(1);
  }
})();
