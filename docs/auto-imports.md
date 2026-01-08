# Auto-Import Configuration

This project uses `unplugin-auto-import` to automatically import UI components and React hooks without explicit import statements.

## How It Works

When you use a component like `Button` or `Card`, you don't need to write:

```tsx
import { Button } from "~/components/ui/button";
```

The plugin automatically injects the import at build time.

## What's Auto-Imported

### React Hooks
- `useState`
- `useEffect`
- `useCallback`
- `useMemo`
- `useRef`
- `forwardRef`

### UI Components (from `app/components/ui/`)
All exported components are auto-imported, including:
- `Button`, `Card`, `Badge`, `Alert`
- `Input`, `Dialog`, `Tabs`
- `Progress`, `Skeleton`, `Separator`
- `Avatar`, `Container`, `Section`, `Grid`
- And more...

## TypeScript Support

The plugin generates `app/auto-imports.d.ts` which provides TypeScript type definitions for all auto-imported items. This file is generated automatically and should be committed to the repository.

## IDE Support

Your IDE will recognize auto-imported components because of the generated type declaration file. If your IDE shows errors for undefined components:

1. Run the dev server once: `npm run dev`
2. The `auto-imports.d.ts` file will be generated
3. Restart your TypeScript server in your IDE

## Configuration

See `vite.config.ts` for the auto-import configuration. The relevant section:

```ts
AutoImport({
  imports: [
    { react: ["useState", "useEffect", ...] },
  ],
  dirs: ["./app/components/ui"],
  dts: "./app/auto-imports.d.ts",
})
```

## Why Use Auto-Imports?

1. **Less boilerplate** - No repetitive import statements
2. **Faster development** - Just use components directly
3. **Cleaner code** - Focus on logic, not imports
4. **Type-safe** - Full TypeScript support via generated declarations
