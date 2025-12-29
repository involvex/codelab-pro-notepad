# Changelog

All notable changes to CodeLab Pro Notepad will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2024-12-29

### Fixed
- **npm Publishing Issue** - Fixed `npx codelab-pro-notepad` not working due to missing dist files
- Added `files` field to package.json to explicitly include necessary files in npm package
- Added `prepublishOnly` script to automatically build before publishing
- Added `.npmignore` to exclude development files from npm package

### Added
- **npm Installation Support** - Can now be installed via `npm install -g codelab-pro-notepad`
- **npx Support** - Can be run directly with `npx codelab-pro-notepad` without installation
- Package metadata: `main`, `homepage`, `bugs`, and `engines` fields
- Updated README with npm/npx installation and usage instructions

### Changed
- Version bumped to 1.0.4
- Improved documentation for npm users
- Added Node.js >= 18.0.0 as alternative to Bun

## [1.0.0] - 2024-12-29

### Initial Release

This is the first stable release of CodeLab Pro Notepad - a production-ready, highly customizable code editor built with React, TypeScript, and Bun.

### ✨ Features

#### Core Editor
- **Modern Code Editor** with syntax highlighting for JavaScript, TypeScript, HTML, CSS, JSON, Python, Rust, and Go
- **Neo-Brutalist UI Design** with glass morphism effects and smooth animations
- **Multi-tab Support** for working on multiple files simultaneously
- **Split View** for side-by-side editing
- **Command Palette** (Ctrl+Shift+P) for quick access to all commands
- **Customizable Menu Bar** with File, Edit, View, and Settings menus
- **Status Bar** with clickable segments showing file info, cursor position, and language

#### Plugin System
- **Full Plugin API** for extending functionality
- **Lifecycle Hooks** (activate/deactivate) for clean plugin management
- **Extension Points** for languages, themes, commands, and status bar items
- **Example Plugin** included (Advanced TypeScript with Dracula theme)
- **Plugin Manager** for loading and managing plugins

#### Theme System
- **3 Built-in Themes**:
  - Dracula (dark purple theme)
  - Monokai (classic dark theme)
  - Light (clean bright theme)
- **Custom Theme Creation** with complete color customization
- **Theme Hot-Swapping** without reloading
- **Theme API** for plugin developers

#### Configuration System
- **JSON Configuration** via `.codelabrc.json`
- **Environment Variables** support (CODELAB_PORT, CODELAB_HOST, etc.)
- **CLI Arguments** for runtime overrides
- **Comprehensive Settings** for server, editor, plugins, and security
- **Configuration Priority** system (CLI > Env > File > Defaults)

#### CLI Tool
- **Production Server** with optimized serving
- **Commands**:
  - `codelab` - Start server
  - `codelab init` - Create config file
  - `codelab config` - Display configuration
  - `codelab help` - Show usage
- **Options**: `--port`, `--host`, `--theme`, `--no-plugins`
- **Executable Script** with proper shebang for direct execution

#### Build System
- **Bun Native Bundler** for fast builds (~200ms)
- **Optimized Output** (~420KB minified JS, ~14KB CSS)
- **Code Splitting** with ESM format
- **Source Maps** for debugging
- **Minification** for production
- **HTML Generation** script for proper asset references

#### Developer Experience
- **Hot Module Replacement** in development mode
- **TypeScript** with full type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Pre-build Checks** (format, lint, typecheck)
- **Clean Scripts** for build artifact management

### 📦 Project Structure

```
codelab-pro-notepad/
├── bin/                      # CLI executables
│   ├── codelab.js           # Main CLI entry point
│   └── config.js            # Configuration management
├── enhanced-code-editor/    # Core editor component
│   ├── index.tsx            # Main editor (2500+ lines)
│   ├── editor-styles.css    # Complete styling
│   ├── example-plugin.ts    # Plugin example
│   └── *.md                 # Documentation
├── scripts/                 # Build scripts
│   ├── serve.ts            # Production server
│   └── generate-html.js    # HTML generation
├── src/                     # Application source
│   ├── App.tsx             # App component
│   ├── index.tsx           # Entry point
│   ├── index.css           # Global styles
│   └── dev-server.tsx      # Development server
└── Configuration files
```

### 📚 Documentation

- **README.md** - Comprehensive project overview with installation, usage, and deployment
- **CONTRIBUTING.md** - Detailed contribution guidelines
- **LICENSE** - MIT License
- **USAGE.md** - Detailed usage instructions
- **CHANGELOG.md** - This file
- **enhanced-code-editor/FEATURES.md** - Complete feature list
- **enhanced-code-editor/INTEGRATION.md** - API reference and plugin development guide
- **enhanced-code-editor/QUICKSTART.md** - Quick start guide
- **.codelabrc.example.json** - Example configuration file

### 🛠️ Technical Stack

- **Runtime**: Bun >= 1.0.0
- **Framework**: React 19
- **Language**: TypeScript 5.9
- **Icons**: Lucide React 0.562.0
- **Build Tool**: Bun's native bundler
- **Linting**: ESLint 9
- **Formatting**: Prettier 3.7
- **Package Manager**: Bun

### 🎨 Design

- **Design Language**: Neo-Brutalism with glass morphism
- **Typography**:
  - JetBrains Mono (monospace for code)
  - Outfit (sans-serif for UI)
- **Color Palette**: Theme-based with CSS variables
- **Layout**: Flexbox-based responsive design

### ⌨️ Keyboard Shortcuts

- `Ctrl+Shift+P` - Command Palette
- `Ctrl+T` - New Tab
- `Ctrl+W` - Close Tab
- `Ctrl+S` - Save File
- `Ctrl+Shift+F` - Format Code
- `Ctrl+/` - Toggle Comment
- `Ctrl+F` - Find
- `Ctrl+H` - Replace
- Plus standard editing shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+A, etc.)

### 🔧 Scripts

- `bun run dev` - Development server with HMR
- `bun run build` - Production build
- `bun run start` - Production server
- `bun run lint` - Run ESLint
- `bun run lint:fix` - Auto-fix ESLint issues
- `bun run format` - Format with Prettier
- `bun run typecheck` - TypeScript type checking
- `bun run clean` - Remove build artifacts
- `bun run preview` - Build and start production

### 🌐 Browser Support

- Chrome/Edge >= 90
- Firefox >= 88
- Safari >= 14

### 📄 License

MIT License - See LICENSE file for details

### 👥 Contributors

- **Involvex** - Initial work and project creation

### 🔗 Links

- **Repository**: https://github.com/involvex/codelab-pro-notepad
- **Issues**: https://github.com/involvex/codelab-pro-notepad/issues
- **Documentation**: See README.md and docs in `enhanced-code-editor/`

---

## [Unreleased]

### Planned Features

- [ ] File system integration (open/save files)
- [ ] Git integration
- [ ] Terminal integration
- [ ] More language support
- [ ] Marketplace for plugins
- [ ] Collaborative editing
- [ ] Mobile support
- [ ] Electron app wrapper
- [ ] VS Code theme compatibility
- [ ] Extension marketplace

### Potential Improvements

- [ ] Add unit tests (Jest/Vitest)
- [ ] Add E2E tests (Playwright)
- [ ] Improve accessibility (ARIA labels, keyboard navigation)
- [ ] Add search and replace across files
- [ ] Add snippets system
- [ ] Add intellisense/autocomplete
- [ ] Add linting integration
- [ ] Add formatting on save
- [ ] Add diff viewer
- [ ] Add minimap enhancements

---

## Version History

- **1.0.0** (2024-12-29) - Initial stable release

---

For more details about any release, see the [commit history](https://github.com/involvex/codelab-pro-notepad/commits/main).
