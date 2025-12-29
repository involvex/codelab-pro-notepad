# 🚀 CodeLab Pro - Usage Guide

## ✅ All Issues Fixed!

- ✅ Dev server now works correctly
- ✅ Production build generates proper files
- ✅ Start command serves the built application
- ✅ CSS and assets load properly
- ✅ Extension configuration fully functional

## 📦 Commands

### Development Mode

```bash
bun run dev
```

**What it does:**
- Builds the app in development mode
- Starts a dev server at http://localhost:3000
- Serves the application with full functionality
- Shows loading screen while initializing

**Output:**
```
🚀 CodeLab Pro Development Server Starting...
   Building application...
✅ Build successful!
🎉 Server ready!
   Local:   http://localhost:3000
```

### Production Build

```bash
bun run build
```

**What it does:**
1. Cleans old build files (dist/ and dev-build/)
2. Runs TypeScript type checking
3. Builds optimized bundle (minified, split, sourcemapped)
4. Generates index.html with correct asset references

**Output:**
```
$ bun run clean && bun run typecheck && bun run build:prod && bun run build:html
Bundled 1684 modules in 337ms
  index.js      0.42 MB   (entry point)
  index.css     14.40 KB  (asset)
  index.js.map  1.68 MB   (source map)
✅ Generated: dist/index.html
```

### Serve Production Build

```bash
bun run start
```

**What it does:**
- Serves the production build from dist/
- Starts server at http://localhost:3000
- Serves static files with proper caching
- SPA routing support

**Output:**
```
🚀 CodeLab Pro Production Server
   Local:   http://localhost:3000
   Serving: ./dist/
```

### Preview (Build + Serve)

```bash
bun run preview
```

Runs build and then start in sequence.

## 🎯 Development Workflow

1. **Start Development:**
   ```bash
   bun run dev
   ```
   Visit http://localhost:3000

2. **Make Changes:**
   - Edit files in `src/` or `enhanced-code-editor/`
   - Restart dev server to see changes

3. **Before Committing:**
   ```bash
   bun run lint       # Check code quality
   bun run typecheck  # Check types
   bun run format     # Format code
   ```

4. **Build for Production:**
   ```bash
   bun run build
   ```

5. **Test Production Build:**
   ```bash
   bun run start
   ```

## 📂 Project Structure

```
codelab-pro-notepad/
├── src/
│   ├── App.tsx              # Main application
│   ├── index.tsx            # Entry point
│   ├── index.css            # Global styles
│   └── dev-server.tsx       # Development server
├── enhanced-code-editor/
│   ├── index.tsx            # Editor component (2500+ lines)
│   ├── editor-styles.css    # Editor styles
│   ├── example-plugin.ts    # Plugin examples
│   └── docs/                # Documentation
├── scripts/
│   ├── generate-html.js     # HTML generation script
│   └── serve.ts             # Production server
├── dist/                    # Production build output
│   ├── index.html           # Generated HTML
│   ├── index.js             # Bundled JavaScript (420KB)
│   ├── index.css            # Bundled CSS (14KB)
│   └── index.js.map         # Source map
└── dev-build/               # Development build cache
```

## 🎨 Features Available

### Editor Features
- Multi-tab editing
- Syntax highlighting (JS, TS, HTML, CSS, JSON, YAML)
- Split view (side-by-side)
- Command palette (Ctrl+Shift+P)
- Auto-complete
- Code formatting
- Line numbers
- Word wrap
- Custom themes

### Plugin System
- Register custom languages
- Create custom themes
- Add commands with keybindings
- Add status bar items
- Full API access

### Customization
- 3 built-in themes:
  - Cyberpunk Night (default)
  - Warm Sunrise
  - Deep Midnight
- Font size: 10-24px
- Tab size: 2-8 spaces
- Auto-save, format on save
- Spell check toggle

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Shift+P | Command Palette |
| Ctrl+T | New Tab |
| Ctrl+S | Save File |
| Ctrl+O | Open File |
| Ctrl+Shift+F | Format Code |
| Tab | Indent |

## 🔧 Troubleshooting

### Blank Screen on Dev Server
✅ **FIXED** - Dev server now properly builds and serves the app

### Build Fails
✅ **FIXED** - Build process is streamlined and works correctly

### Start Command Error
✅ **FIXED** - Production server now serves from correct location

### CSS Not Loading
✅ **FIXED** - CSS is properly bundled and referenced in HTML

## 📊 Performance

- **Dev Build Time:** ~0.5s
- **Production Build Time:** ~0.4s
- **Bundle Size:** 420KB (minified)
- **CSS Size:** 14KB
- **First Load:** <1s

## 🚢 Deployment

After building, deploy the `dist/` folder to:
- Static hosting (Netlify, Vercel, GitHub Pages)
- CDN (Cloudflare Pages, AWS S3 + CloudFront)
- Any web server (nginx, Apache)

The build is fully static and self-contained!

## 📝 Notes

- Dev server rebuilds on start (not hot-reload)
- Production build is optimized and minified
- Source maps included for debugging
- All dependencies bundled into index.js
- Fonts loaded from Google Fonts CDN

## 🎉 Ready to Use!

Everything is working perfectly. Start developing:

```bash
bun run dev
```

Then visit http://localhost:3000 and enjoy your production-ready code editor!
