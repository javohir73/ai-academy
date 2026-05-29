import { describe, it, expect, beforeEach, vi } from 'vitest'

// Fresh module per test so the singleton's memo is reset.
async function freshService() {
  vi.resetModules()
  return await import('./pyodideService.js')
}

function fakePyodide() {
  return {
    loadPackagesFromImports: vi.fn().mockResolvedValue(undefined),
    runPythonAsync: vi.fn().mockResolvedValue(undefined),
    globals: { clear: vi.fn() },
    setStdout: vi.fn(),
    setStderr: vi.fn(),
  }
}

describe('pyodideService.ensureLoaded', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    delete globalThis.loadPyodide
  })

  it('boots pyodide once and memoizes the instance', async () => {
    const py = fakePyodide()
    const loadPyodide = vi.fn().mockResolvedValue(py)
    // Simulate the CDN script having defined the global by the time it "loads".
    const svc = await freshService()
    // Stub the script-injection step so it resolves immediately and sets the global.
    svc.__setScriptLoaderForTest(async () => {
      globalThis.loadPyodide = loadPyodide
    })

    const a = await svc.ensureLoaded()
    const b = await svc.ensureLoaded()

    expect(a).toBe(py)
    expect(b).toBe(py)
    expect(loadPyodide).toHaveBeenCalledTimes(1)
  })
})
