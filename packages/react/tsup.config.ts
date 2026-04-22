import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  async onSuccess() {
    // Copy CSS after build
    const srcCss = join(__dirname, 'src/styles.css');
    const destDir = join(__dirname, 'dist');
    const destCss = join(destDir, 'styles.css');
    if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
    copyFileSync(srcCss, destCss);
    console.log('✅ CSS copied to dist/');
  },
});
