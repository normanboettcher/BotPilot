/// <reference types="vitest" />

declare module 'vitest' {
  export interface TestContext {
    // add any custom properties to the test context here if needed
  }
}

export {};
// Declare the global variables
declare global {
  const describe: (typeof import('vitest'))['describe'];
  const it: (typeof import('vitest'))['it'];
  const expect: (typeof import('vitest'))['expect'];
  const vi: (typeof import('vitest'))['vi'];
  const beforeEach: (typeof import('vitest'))['beforeEach'];
  const afterEach: (typeof import('vitest'))['afterEach'];
  const beforeAll: (typeof import('vitest'))['beforeAll'];
  const afterAll: (typeof import('vitest'))['afterAll'];
}
