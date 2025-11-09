// This file provides a type definition for the `process` object, which is
// made available to client-side code through Vite's `define` config.
// This resolves "Cannot find name 'process'" (TS2580) errors during the
// `tsc` build step, as the browser environment doesn't have a native
// `process` object.

// FIX: To fix the "Cannot redeclare block-scoped variable 'process'" error,
// we augment the existing `NodeJS.ProcessEnv` interface instead of declaring
// a new `process` constant. This avoids conflicts with global types for `process`
// that are likely included from `@types/node`.
declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}
