import { describe, it, expect, beforeEach, vi } from 'vitest'

// Fresh module per test so the singleton's memo is reset.
async function freshService() {
  vi.resetModules()
  return await import('./pyodideService.js')
}

function fakePyodide() {
  return {
    loadPackage: vi.fn().mockResolvedValue(undefined),
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

  it('clears the memo on boot failure so a later call can retry', async () => {
    const svc = await freshService()
    let calls = 0
    svc.__setScriptLoaderForTest(async () => {
      calls += 1
      if (calls === 1) throw new Error('pyodide-script-failed')
      globalThis.loadPyodide = vi.fn().mockResolvedValue(fakePyodide())
    })
    await expect(svc.ensureLoaded()).rejects.toThrow('pyodide-script-failed')
    await expect(svc.ensureLoaded()).resolves.toBeDefined() // retry works
  })
})

describe('pyodideService.runCell', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    delete globalThis.loadPyodide
  })

  async function bootedService(py) {
    const svc = await freshService()
    svc.__setScriptLoaderForTest(async () => {
      globalThis.loadPyodide = vi.fn().mockResolvedValue(py)
    })
    await svc.ensureLoaded()
    return svc
  }

  it('loads packages from imports and returns captured stdout on success', async () => {
    const py = fakePyodide()
    // Simulate stdout capture: when runPythonAsync runs, push to the batched writer.
    py.setStdout.mockImplementation(({ batched }) => {
      py.__emit = batched
    })
    py.runPythonAsync.mockImplementation(async () => {
      py.__emit('hello\n')
    })
    const svc = await bootedService(py)

    const res = await svc.runCell('print("hello")', { packages: ['numpy'] })

    expect(py.loadPackage).toHaveBeenCalledWith(['numpy'])
    expect(py.loadPackagesFromImports).toHaveBeenCalledWith('print("hello")')
    expect(res.ok).toBe(true)
    expect(res.stdout).toContain('hello')
    expect(res.error).toBeNull()
  })

  it('returns ok:false and the error message when the code raises', async () => {
    const py = fakePyodide()
    py.runPythonAsync.mockRejectedValue(new Error('NameError: name "x" is not defined'))
    const svc = await bootedService(py)

    const res = await svc.runCell('print(x)', { packages: [] })

    expect(res.ok).toBe(false)
    expect(res.error).toContain('NameError')
  })

  it('runTests returns passed:true when assertions do not raise', async () => {
    const py = fakePyodide()
    const svc = await bootedService(py)
    const res = await svc.runTests('assert 1 == 1')
    expect(res.passed).toBe(true)
  })

  it('runTests returns passed:false with the assertion message on failure', async () => {
    const py = fakePyodide()
    py.runPythonAsync.mockRejectedValue(new Error('AssertionError: accuracy too low'))
    const svc = await bootedService(py)
    const res = await svc.runTests('assert acc > 0.8, "accuracy too low"')
    expect(res.passed).toBe(false)
    expect(res.message).toContain('accuracy too low')
  })

  it('resetNamespace clears interpreter globals', async () => {
    const py = fakePyodide()
    const svc = await bootedService(py)
    await svc.resetNamespace()
    expect(py.globals.clear).toHaveBeenCalled()
  })
})
