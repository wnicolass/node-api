import { resolve } from 'node:path';
import { createReadStream } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { regExpCompiler } from './common.js';

let foundEnv = false;

function addEnvToProcess(envPath) {
  console.log('this is your envPath:', envPath);
}

async function walkDir(path, envName = '.env') {
  try {
    const files = await readdir(path);
    const envPath = await searchDotEnv(files, path, envName);
    !!envPath && addEnvToProcess(envPath);
    return;
  } catch (err) {
    console.error(err);
  }
}

async function searchDotEnv(files, cwd, envName) {
  const regexCompiler = regExpCompiler(/(node_modules|.git|.venv)/, ['g']);
  const isIgnorablePath = regexCompiler();
  for (const file of files) {
    const filePath = resolve(cwd, file);
    const fileStats = await stat(filePath);

    if (!isIgnorablePath.test(filePath)) {
      if (filePath.endsWith(envName)) {
        foundEnv = true;
        return filePath;
      }

      if (!foundEnv && fileStats.isDirectory()) {
        await walkDir(filePath, envName);
      }

      if (foundEnv) {
        return;
      }
    }
  }
}

export default async function loadEnv(envName, path) {
  const cwd = path || process.cwd();
  try {
    await walkDir(cwd, envName);
  } catch (err) {
    console.error(err);
  }
}
