import { execFileSync, spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Node 22.12 crashes when the entry file is a .js path that contains
// non-ASCII characters. This project folder name is not ASCII, so tools in
// node_modules are started from a temporary drive letter.
const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)

const mount = mountProject(projectRoot)
let removed = false

process.on('exit', () => {
  removed = true
  mount.cleanup()
})

try {
  const code = await runCommand(mount.root, process.argv.slice(2))
  process.exitCode = code
} finally {
  if (!removed) mount.cleanup()
}

function mountProject(root) {
  if (![...root].some((char) => char.charCodeAt(0) > 127)) {
    return { root, cleanup() {} }
  }

  const letter = freeDriveLetter()
  execFileSync('subst', [`${letter}:`, root], { stdio: 'ignore' })
  return {
    root: `${letter}:\\`,
    cleanup() {
      try {
        execFileSync('subst', [`${letter}:`, '/d'], { stdio: 'ignore' })
      } catch {
        // The mapping is already gone.
      }
    },
  }
}

function freeDriveLetter() {
  for (let code = 90; code >= 68; code -= 1) {
    const letter = String.fromCharCode(code)
    if (!fs.existsSync(`${letter}:\\`)) return letter
  }
  throw new Error('沒有可用的磁碟機代號，無法啟動這個路徑下的工具。')
}

async function runCommand(root, [command, ...extra]) {
  if (command === 'build') {
    const typecheck = await runNode(root, [
      'node_modules/typescript/lib/tsc.js',
      '-b',
    ])
    if (typecheck !== 0) return typecheck
    return runNode(root, ['node_modules/vite/bin/vite.js', 'build', ...extra])
  }

  if (command === 'dev') {
    return runNode(root, ['node_modules/vite/bin/vite.js', ...extra])
  }

  if (command === 'preview') {
    return runNode(root, [
      'node_modules/vite/bin/vite.js',
      'preview',
      ...extra,
    ])
  }

  if (command === 'lint') {
    return runNode(root, ['node_modules/oxlint/bin/oxlint', ...extra])
  }

  console.error(`未知指令：${command ?? '(空白)'}`)
  return 1
}

function runNode(root, parts) {
  const [script, ...args] = parts
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(root, script), ...args], {
      cwd: root,
      stdio: 'inherit',
    })
    child.on('error', (error) => {
      console.error(error.message)
      resolve(1)
    })
    child.on('exit', (code) => {
      if (code === 3221225477 || code === -1073741819) {
        console.error(
          `工具在 Node.js ${process.version} 下崩潰了，所以終端機只看得到 npm 印出的指令。請改用 Node.js 24，或任何比 22.12.0 更新的版本，然後再執行一次。`,
        )
      }
      resolve(code ?? 1)
    })
  })
}
