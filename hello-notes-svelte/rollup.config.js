import serve from 'rollup-plugin-serve'
import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';
import livereload from 'rollup-plugin-livereload';

const isDevelopment = process.env.NODE_ENV !== 'production';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/app.bundle.js',
    format: 'iife'
  },
  plugins: [
    svelte({
        compilerOptions: {
            // enable run-time checks when not in production
            dev: isDevelopment
        }
    }),
    css({ output: 'bundle.css' }),
    resolve({
        browser: true,
        dedupe: ['svelte']
    }),
    commonjs(),
    isDevelopment && livereload('dist'),
    serve('dist')
  ]
}