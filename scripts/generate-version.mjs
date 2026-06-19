// Generuje src/version.ts s číslom verzie pre hlavičku.
// Verzia = BASE_VERSION + počet commitov na `main` od BASE_COMMIT.
// Spúšťa sa ako `prebuild` (npm) tesne pred `vite build`.
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// BASE_COMMIT = HEAD vetvy `main` v čase zavedenia tohto skriptu (issue #46).
// Pri tomto commite je počet commitov 0, takže verzia = BASE_VERSION = 23.
// Každý ďalší (squash) merge do `main` pridá presne +1.
const BASE_VERSION = 23;
const BASE_COMMIT = '0468f0c78e73ceee580a18a68e485b1e7a933332';

const dir = dirname(fileURLToPath(import.meta.url));
const outFile = join(dir, '..', 'src', 'version.ts');

function git(cmd) {
  return execSync(`git ${cmd}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

let version = BASE_VERSION;
try {
  // Vercel klonuje repo plytko (shallow) — potrebujeme históriu až po BASE_COMMIT.
  try {
    git('fetch --unshallow');
  } catch {
    // Repo už má úplnú históriu (lokálny build alebo už odšallované) — pokračuj.
  }
  const count = Number.parseInt(git(`rev-list --count ${BASE_COMMIT}..HEAD`), 10);
  if (Number.isFinite(count)) {
    version = BASE_VERSION + count;
  } else {
    console.warn(`[generate-version] Neplatný počet commitov, použijem ${BASE_VERSION}.`);
  }
} catch (err) {
  console.warn(
    `[generate-version] Verziu sa nepodarilo spočítať z gitu, použijem ${BASE_VERSION}.`,
    err.message,
  );
  version = BASE_VERSION;
}

const content = `// Tento súbor je generovaný skriptom scripts/generate-version.mjs.
// Needituj ručne — pri builde sa prepíše.
export const APP_VERSION = ${version};
`;

writeFileSync(outFile, content);
console.log(`[generate-version] APP_VERSION = ${version}`);
