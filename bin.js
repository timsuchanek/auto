#!/usr/bin/env node

const copy = require('@apexearth/copy')
const { bold } = require('kleur')
const fs = require('fs')
const path = require('path')
const execa = require('execa')
const arg = require('arg')
const os = require('os')

const args = arg({
  '--pg': String,
  '--postgres': '--pg',
  '--mysql': String,
  '--sqlite': String,
})

const DEFAULT_POSTGRES_URL = 'postgresql://postgres:postgres@localhost:5432/'
const DEFAULT_MYSQL_URL = 'mysql://root:root@localhost:3306/'

function changeDatabaseType(type, url) {
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')
  const envPath = path.join(process.cwd(), 'prisma', '.env')

  const PROVIDER_REGEX = /^\s+provider\s+=\s+["']sqlite["']/m
  const END_REGEX = /^DATABASE_URL=.+/m

  const schema = fs.readFileSync(schemaPath).toString()
  const env = fs.readFileSync(envPath).toString()

  const newProvider = `  provider = "${type}"`
  const newURL = `DATABASE_URL=${url}`

  const newSchema = schema.replace(PROVIDER_REGEX, newProvider)
  const newEnv = env.replace(END_REGEX, newURL)

  fs.writeFileSync(schemaPath, newSchema)
  fs.writeFileSync(envPath, newEnv)
}

async function main() {
  const projects = fs.readdirSync(path.join(__dirname, 'projects'))
  const command = args._[0]

  if (!command) {
    throw new Error(`Please provide a template with ${bold(
      'auto PROJECT_NAME',
    )}.
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
    recursive: true,
  })

  switch (command) {
    case 'prisma': {
      // resolve config from the home directory
      const configPath = path.join(os.homedir(), '.autorc.json')
      const configExists = fs.existsSync(configPath)

      let config
      if (configExists) {
        config = fs.readFileSync(configPath)
        config = JSON.parse(config)
      }

      // change files based on the flags provided
      // POSTGRES
      if (args['--pg']) {
        // deleting the sqlite database
        fs.unlinkSync(path.join(process.cwd(), 'prisma', 'dev.db'))
        // add the database name
        let database
        if (config && config.prisma && config.prisma.postgres) {
          database = `${config.prisma.postgres}${
            config.prisma.postgres.endsWith('/') ? '' : '/'
          }${args['--pg']}`
        } else {
          console.log('Using default pg url')
          database = DEFAULT_POSTGRES_URL + args['--pg']
        }
        changeDatabaseType('postgresql', database)
      }

      // MYSQL
      if (args['--mysql']) {
        // deleting the sqlite database
        fs.unlinkSync(path.join(process.cwd(), 'prisma', 'dev.db'))
        // add the database name
        let database
        if (config && config.prisma && config.prisma.mysql) {
          database = `${config.prisma.mysql}${
            config.prisma.mysql.endsWith('/') ? '' : '/'
          }${args['--mysql']}`
        } else {
          console.log('Using default mysql url')
          database = DEFAULT_MYSQL_URL + args['--mysql']
        }
        changeDatabaseType('mysql', database)
      }

      // SQLITE
      if (args['--sqlite']) {
        // deleting the sqlite database
        fs.unlinkSync(path.join(process.cwd(), 'prisma', 'dev.db'))
        database = 'file:' + args['--sqlite']
        changeDatabaseType('sqlite', database)
      }

      await execa.command('yarn add @prisma/client@dev @prisma/cli@dev', {
        stdio: 'inherit',
        shell: true,
      })
    }
  }
}

main().catch((e) => console.error(e.message))
