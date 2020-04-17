#!/usr/bin/env node

const copy = require('@apexearth/copy')
const { bold } = require('kleur')
const fs = require('fs')
const path = require('path')

async function main() {
  const projects = fs.readdirSync(path.join(__dirname, 'projects'))
  if (!process.argv[2]) {
    throw new Error(`Please provide a template with ${bold('am PROJECT_NAME')}.
Available projects: ${bold(projects.join(', '))}`)
  }

  const cwdFiles = fs.readdirSync(process.cwd())
  if (cwdFiles.length > 0) {
    throw new Error(`Please run this in an empty dir. Files in this dir:

${cwdFiles.join('\n')}`)
  }

  const projectDir = path.join(__dirname, 'projects', process.argv[2])
  if (!fs.existsSync(projectDir)) {
    throw new Error(`Project dir ${projectDir} does not exist`)
  }

  await copy({
    from: projectDir,
    to: process.cwd(),
  })
}

main().catch((e) => console.error(e))
