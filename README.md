# lc-v3-cms
Basic CMS extentin for next.js to support faster and easier app development.

## Dependencies
- React 18
- Typescript
- Tailwindcss
- @mogenswintherdk/lc-v3-nextjs

## Use in development

### In this repo
1: Clone this repo
2: Run `npm link`
3: Run `npm uninstall @mogenswintherdk/lc-v3-nextjs` to remove the online npm package dpendency
4: Run `npm link @mogenswintherdk/lc-v3-nextjs` to create a local link to this npm package
5: Run `npm run watch` to build automatically on change

### In the using repo - When starting development
1: Run `npm uninstall @mogenswintherdk/lc-v3-cms` to remove the online npm package dpendency
2: Run `npm link @mogenswintherdk/lc-v3-cms` to create a local link to this npm package

### In the using repo - When development is done
1: Run `npm unlink @mogenswintherdk/lc-v3-cms` to remove the local link
2: Run `npm install @mogenswintherdk/lc-v3-cms` to reinstall the online version

## Publish to GitHub Package
1: Change the version in package.json
2: Run `npm run build`
3: Run `npm publish`