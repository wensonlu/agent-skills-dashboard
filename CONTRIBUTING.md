# Contributing to Agent Skills Dashboard

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build all packages
pnpm build

# Generate demo data
pnpm tsx scripts/generate-demo-data.ts
```

## Release Process

### 1. Update versions

```bash
# Bump version in all packages
# Edit packages/core/package.json and packages/react/package.json
```

### 2. Create git tag

```bash
git tag v0.1.0
git push origin v0.1.0
```

### 3. GitHub Actions handles the rest

The `release.yml` workflow will:
- Run tests
- Build both packages
- Publish to npm (`@agent-skills/core` then `@agent-skills/react`)
- Create GitHub Release

### Manual npm publish (if needed)

```bash
# Set up .npmrc with token first
echo "//registry.npmjs.org/:_authToken=YOUR_TOKEN" >> ~/.npmrc

cd packages/core && pnpm publish --access public
cd ../react && pnpm publish --access public
```

## Required Secrets

For automated releases via GitHub Actions, add these secrets:

- `NPM_TOKEN` — npm access token with package publish permission

Get one at: https://www.npmjs.com/settings/tokens
