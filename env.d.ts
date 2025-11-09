// This file provides type definitions for environment variables
// injected by Vite. It resolves TypeScript errors when using
// `process.env` in client-side code by declaring its shape.

// Fix for: Cannot redeclare block-scoped variable 'process'.
// This augments the existing NodeJS.ProcessEnv interface
// instead of trying to redeclare the `process` variable.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
