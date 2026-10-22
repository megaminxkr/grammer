import { rmSync } from 'node:fs';
// Only the generated output beside this checkout is removed; never source/user files.
rmSync(new URL('../dist/', import.meta.url), { recursive: true, force: true });
