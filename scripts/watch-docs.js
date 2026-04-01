import { watch } from 'node:fs';
import { promises as fs } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const docsDir = resolve('docs');
const reloadFile = resolve('src/__docsReload.ts');
const debounceMs = 300;

let timer = null;
let running = false;
let pending = false;

function log(message) {
  const ts = new Date().toLocaleTimeString();
  process.stdout.write(`[watch-docs ${ts}] ${message}\n`);
}

async function touchReloadFile() {
  const stamp = new Date().toISOString();
  await fs.writeFile(reloadFile, `export const docsReloadStamp = "${stamp}";\n`);
}

function runGenDocs() {
  if (running) {
    pending = true;
    return;
  }

  running = true;
  log('Running pnpm gen-docs...');

  const child = spawn('pnpm', ['gen-docs'], {
    stdio: 'inherit',
    shell: true,
  });

  child.on('close', async (code) => {
    running = false;

    if (code === 0) {
      try {
        await touchReloadFile();
        log('Docs generated. Reload trigger updated.');
      } catch (err) {
        log(`Docs generated, but failed to touch reload file: ${String(err)}`);
      }
    } else {
      log(`pnpm gen-docs failed with code ${code}.`);
    }

    if (pending) {
      pending = false;
      runGenDocs();
    }
  });
}

function scheduleRun() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(runGenDocs, debounceMs);
}

log(`Watching ${docsDir} ...`);
runGenDocs();

watch(docsDir, { recursive: true }, () => {
  scheduleRun();
});
