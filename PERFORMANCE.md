## PERFORMANCE OPTIMISATION

### Check unused dependencies

- install depcheck

```bash
npx depcheck
```

output

```bash
Unused dependencies
* @aws-amplify/ui-react
* @radix-ui/react-primitive
* @shadcn/ui
* tailwind-variants
Unused devDependencies
* autoprefixer
* baseline-browser-mapping
* postcss
* tw-animate-css
Missing dependencies
* @aws-amplify/auth: .\src\utils\aws-userAttributes.ts
* framer-motion: .\src\components\notifications\NotificationSidebar.tsx
```

- removed packages

```bash
* @aws-amplify/ui-react
* @radix-ui/react-primitive
* @shadcn/ui
* tailwind-variants

Unused devDependencies
* autoprefixer
* baseline-browser-mapping
* postcss

```

- remove the node modules and install again

```bash
# delete the old folder
rm -rf node_modules
# install new modules and build again to check package size
npm install | npm run build

```
