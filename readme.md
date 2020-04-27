# `@timsuchanek/auto`

Helps you automate setting up projects.

## Projects

### Prisma

Includes the latest Prisma Client alpha with a running SQLite example.
I'm using this myself a lot, to quickly get reproductions running.

This is not an official Prisma tool!

## Usage

If you want to set the default url use, add the following config file to `~/.autorc.json`

```json
{
  "prisma": {
    "postgres": "postgresql://postgres:postgres@localhost:5432/",
    "mysql": "mysql://root:root@localhost:3306/"
  }
}
```

Use default(spins up a sqlite project)

```bash
mkdir test
cd test
npx @timsuchanek/auto prisma
ts-node main.ts
```

Postgres

```bash
mkdir test
cd test
npx @timsuchanek/auto prisma --pg DATABASE_NAME
ts-node main.ts
```

MySQL

```bash
mkdir test
cd test
npx @timsuchanek/auto prisma --mysql DATABASE_NAME
ts-node main.ts
```
