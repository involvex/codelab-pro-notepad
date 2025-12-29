# 🚀 CodeLab Pro Notepad

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Bun](https://img.shields.io/badge/bun-%3E=1.0.0-black.svg)
![React](https://img.shields.io/badge/react-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.9-3178c6.svg)

A production-ready, highly customizable code editor with plugin system, custom themes, and modern UI built with React, TypeScript, and Bun.

[Features](#-features) •
[Installation](#-installation) •
[Usage](#-usage) •
[Configuration](#%EF%B8%8F-configuration) •
[Documentation](#-documentation) •
[Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎨 Beautiful & Modern UI
- **Neo-Brutalist Design** - Bold, striking interface with glass morphism effects
- **Custom Fonts** - JetBrains Mono for code, Outfit for UI elements
- **Smooth Animations** - Polished transitions and micro-interactions
- **Responsive Layout** - Works seamlessly across different screen sizes

### 🔌 Extensible Plugin System
- **Full Plugin API** - Comprehensive API for extending functionality
- **Lifecycle Hooks** - `activate` and `deactivate` methods for clean plugin management
- **Multiple Extension Points**:
  - Language definitions with custom tokenizers
  - Theme registration and customization
  - Command palette integration
  - Status bar item additions
- **Example Plugins Included** - Advanced TypeScript plugin with Dracula theme

### 🎭 Powerful Theme Engine
- **3 Built-in Themes**:
  - 🌙 **Dracula** - Dark purple theme with vibrant syntax highlighting
  - 🌃 **Monokai** - Classic dark theme with balanced colors
  - ☀️ **Light** - Clean, bright theme for daytime coding
- **Custom Theme Creation** - Define your own color schemes with ease
- **Theme Hot-Swapping** - Change themes instantly without reloading

### 💻 Language Support
- **Built-in Languages**: JavaScript, TypeScript, HTML, CSS, JSON, Python, Rust, Go
- **Syntax Highlighting** - Context-aware tokenization
- **Extensible** - Add new languages through plugins
- **Smart Indentation** - Language-specific indentation rules

### ⚡ Performance & Build
- **Lightning Fast** - Built with Bun for maximum speed
- **Optimized Bundle** - ~420KB minified with code splitting
- **Source Maps** - Full debugging support
- **Hot Module Replacement** - Instant updates during development
- **Production Ready** - Minified, tree-shaken, and optimized

### ⚙️ Configuration System
- **Multiple Config Sources**:
  - JSON configuration files (`.codelabrc.json`)
  - Environment variables
  - CLI arguments
- **Comprehensive Settings**:
  - Server configuration (port, host, caching)
  - Editor preferences (theme, font size, tab size, word wrap)
  - Plugin management
  - Security settings

### 🖥️ CLI Tool
- **Simple Commands**:
  - `codelab` - Start production server
  - `codelab init` - Create default config
  - `codelab config` - Display configuration
  - `codelab help` - Show usage
- **Flexible Options** - Override settings via CLI flags
- **Environment Support** - Respect environment variables

### 🎯 Advanced Features
- **Command Palette** (`Ctrl+Shift+P`) - Quick access to all commands
- **Multi-tab Support** - Work on multiple files simultaneously
- **Split View** - Side-by-side editing
- **Customizable Status Bar** - Show relevant information
- **Menu Bar** - File, Edit, View, Settings menus
- **Keyboard Shortcuts** - Extensive hotkey support

---

## 📦 Installation

### Prerequisites

- [Bun](https://bun.sh) >= 1.0.0 (recommended) or [Node.js](https://nodejs.org) >= 18.0.0

### Option 1: Install via npm (Recommended)

```bash
# Install globally
npm install -g codelab-pro-notepad

# Or use with npx (no installation required)
npx codelab-pro-notepad
```

### Option 2: Install from Source

```bash
# Clone the repository
git clone https://github.com/involvex/codelab-pro-notepad.git

# Navigate to directory
cd codelab-pro-notepad

# Install dependencies
bun install

# Build the project
bun run build

# Run locally
bun run start
# Or use the CLI
./bin/codelab.js
```

---

## 🚀 Usage

### Quick Start (npm/npx)

If you installed via npm or are using npx:

```bash
# Using npx (no installation)
npx codelab-pro-notepad

# Or if installed globally
codelab

# With custom options
codelab --port 8080 --theme monokai

# Initialize config file
codelab init

# View current configuration
codelab config

# Show help
codelab help
```

### Development Mode (Source Installation)

Start the development server with hot module replacement:

```bash
bun run dev
```

Then open your browser to `http://localhost:3000`

### Production Mode (Source Installation)

#### Option 1: Using npm scripts

```bash
# Build the application
bun run build

# Start production server
bun run start
```

#### Option 2: Using the CLI directly

```bash
# Build first
bun run build

# Start with default settings
./bin/codelab.js

# Start with custom port
./bin/codelab.js --port 8080

# Start with custom host and theme
./bin/codelab.js --host localhost --theme monokai

# Disable plugins
./bin/codelab.js --no-plugins
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server with hot reload |
| `bun run build` | Build production bundle |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint checks |
| `bun run lint:fix` | Fix ESLint issues automatically |
| `bun run format` | Format code with Prettier |
| `bun run typecheck` | Run TypeScript type checking |
| `bun run clean` | Remove build artifacts |
| `bun run preview` | Build and start production server |

---

## ⚙️ Configuration

### Configuration File

Create a `.codelabrc.json` file in your project root:

```bash
# Generate default configuration
./bin/codelab.js init
```

This creates a configuration file with all available options:

```json
{
  "server": {
    "port": 3000,
    "host": "0.0.0.0",
    "maxAge": 31536000
  },
  "editor": {
    "defaultTheme": "dracula",
    "defaultLanguage": "javascript",
    "fontSize": 14,
    "tabSize": 2,
    "wordWrap": false,
    "lineNumbers": true,
    "minimap": true,
    "autoSave": false,
    "autoSaveDelay": 1000
  },
  "plugins": {
    "enabled": true,
    "autoLoad": true,
    "directory": "./plugins"
  },
  "security": {
    "allowRemotePlugins": false,
    "trustedDomains": []
  }
}
```

### Environment Variables

Override configuration with environment variables:

```bash
# Server settings
export CODELAB_PORT=8080
export CODELAB_HOST=localhost

# Editor settings
export CODELAB_THEME=monokai
export CODELAB_PLUGINS_DIR=./my-plugins

# Start server
./bin/codelab.js
```

### CLI Arguments

Highest priority configuration method:

```bash
# Custom port
./bin/codelab.js --port 8080

# Custom host
./bin/codelab.js --host localhost

# Custom theme
./bin/codelab.js --theme light

# Disable plugins
./bin/codelab.js --no-plugins

# Combined options
./bin/codelab.js --port 8080 --theme monokai --no-plugins
```

### Configuration Priority

1. **CLI Arguments** (highest)
2. **Environment Variables**
3. **Configuration File** (`.codelabrc.json`)
4. **Default Values** (lowest)

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` | Open command palette |
| `Ctrl+T` | New tab |
| `Ctrl+W` | Close tab |
| `Ctrl+S` | Save file |
| `Ctrl+Shift+F` | Format code |
| `Ctrl+/` | Toggle comment |
| `Ctrl+F` | Find in file |
| `Ctrl+H` | Find and replace |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+A` | Select all |
| `Ctrl+D` | Duplicate line |
| `Ctrl+Shift+K` | Delete line |
| `Tab` | Indent |
| `Shift+Tab` | Outdent |

---

## 🔌 Plugin Development

### Creating a Plugin

Plugins extend CodeLab Pro's functionality. Here's a simple example:

```typescript
import type { Plugin, PluginAPI } from '../enhanced-code-editor/index';

export const myPlugin: Plugin = {
  id: 'my-custom-plugin',
  name: 'My Custom Plugin',
  version: '1.0.0',
  description: 'A custom plugin example',
  author: 'Your Name',

  activate: (api: PluginAPI) => {
    // Register a command
    api.registerCommand({
      id: 'myCommand',
      name: 'My Command',
      keybinding: 'Ctrl+Shift+M',
      execute: () => {
        api.showNotification('Hello from my plugin!', 'success');
      }
    });

    // Register a theme
    api.registerTheme({
      id: 'my-theme',
      name: 'My Theme',
      colors: {
        background: '#1e1e1e',
        foreground: '#ffffff',
        // ... more colors
      }
    });
  },

  deactivate: () => {
    // Cleanup if needed
  }
};
```

### Plugin API

The Plugin API provides:

- `registerLanguage()` - Add language support
- `registerTheme()` - Add custom themes
- `registerCommand()` - Add command palette commands
- `registerStatusBarItem()` - Add status bar items
- `showNotification()` - Display notifications
- `getActiveEditor()` - Get current editor state
- `updateEditor()` - Modify editor content

See [enhanced-code-editor/INTEGRATION.md](./enhanced-code-editor/INTEGRATION.md) for complete API documentation.

---

## 📖 Documentation

### Core Documentation

- [Features Overview](./enhanced-code-editor/FEATURES.md) - Complete feature list
- [Integration Guide](./enhanced-code-editor/INTEGRATION.md) - API reference and plugin development
- [Quick Start Guide](./enhanced-code-editor/QUICKSTART.md) - Get started quickly
- [Usage Documentation](./USAGE.md) - Detailed usage instructions

### Additional Resources

- [Configuration Guide](#%EF%B8%8F-configuration) - Configure the editor
- [Plugin Development](#-plugin-development) - Create custom plugins
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute
- [Changelog](./CHANGELOG.md) - Version history

---

## 🏗️ Architecture

### Project Structure

```
codelab-pro-notepad/
├── bin/                      # CLI executables
│   ├── codelab.js           # Main CLI entry point
│   └── config.js            # Configuration management
├── enhanced-code-editor/    # Core editor component
│   ├── index.tsx            # Main editor component
│   ├── editor-styles.css    # Editor styles
│   ├── example-plugin.ts    # Example plugin
│   └── *.md                 # Documentation
├── scripts/                 # Build scripts
│   ├── serve.ts            # Production server
│   └── generate-html.js    # HTML generation
├── src/                     # Application source
│   ├── App.tsx             # App component
│   ├── index.tsx           # Entry point
│   ├── index.css           # Global styles
│   └── dev-server.tsx      # Development server
├── .codelabrc.example.json # Example configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── eslint.config.ts       # ESLint configuration
```

### Technology Stack

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime & bundler
- **Framework**: [React 19](https://react.dev) - UI library
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org) - Type safety
- **Icons**: [Lucide React](https://lucide.dev) - Beautiful icons
- **Build**: Bun's native bundler - Fast, optimized builds
- **Linting**: ESLint 9 - Code quality
- **Formatting**: Prettier - Code formatting

---

## 🧪 Testing

```bash
# Type checking
bun run typecheck

# Linting
bun run lint

# Run all checks
bun run typecheck && bun run lint
```

---

## 🚀 Deployment

### Build for Production

```bash
# Install dependencies
bun install

# Run pre-build checks (format, lint, typecheck)
bun run build
```

The build outputs to `dist/` directory:
- Minified JavaScript bundle (~420KB)
- Optimized CSS (~14KB)
- Source maps for debugging
- Generated HTML

### Deploy

The built files in `dist/` can be:
- Served with the included production server (`bun run start`)
- Deployed to any static hosting (Vercel, Netlify, GitHub Pages, etc.)
- Containerized with Docker
- Served with Nginx, Apache, or any web server

### Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM oven/bun:1 as build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
RUN bun run build

FROM oven/bun:1
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/bin ./bin
COPY --from=build /app/package.json ./
EXPOSE 3000
CMD ["bun", "bin/codelab.js"]
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`bun run typecheck && bun run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Bun](https://bun.sh) - The fast all-in-one JavaScript runtime
- UI powered by [React 19](https://react.dev)
- Icons from [Lucide](https://lucide.dev)
- Fonts: [JetBrains Mono](https://www.jetbrains.com/lp/mono/) & [Outfit](https://fonts.google.com/specimen/Outfit)

---

## 📧 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/involvex/codelab-pro-notepad/issues)
- **Author**: Involvex
- **Repository**: [https://github.com/involvex/codelab-pro-notepad](https://github.com/involvex/codelab-pro-notepad)

---

<div align="center">

**Built with ❤️ by Involvex**

⭐ Star this repository if you find it helpful!

</div>
