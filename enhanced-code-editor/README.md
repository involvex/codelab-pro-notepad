# 🚀 CodeLab Pro - Enhanced Code Editor

A production-grade, extensible code editor with a distinctive **Neo-Brutalist** design aesthetic. Features a complete plugin API, customizable themes, advanced settings, and VS Code-like functionality.

## ✨ Features

### 🎨 **Core Features**
- **Multi-tab editing** with drag-and-drop support
- **Syntax highlighting** for JavaScript, TypeScript, HTML, CSS, and more
- **Split view** for side-by-side editing
- **Command palette** (Ctrl+Shift+P) for quick actions
- **Auto-complete** with intelligent suggestions
- **Auto-close brackets** and smart indentation
- **Line numbers** with hover effects
- **Word wrap** toggle
- **Code formatting** for JSON, JavaScript, TypeScript, and CSS

### 🔌 **Plugin API System**
Fully extensible architecture allowing you to:
- Register custom languages with tokenizers
- Add custom themes
- Create new commands with keybindings
- Add status bar items
- Access and modify editor content

### 🎭 **Themes**
Built-in themes:
- **Cyberpunk Night** - Neon accents on deep dark backgrounds
- **Warm Sunrise** - Earthy tones for light mode lovers
- **Deep Midnight** - GitHub-inspired dark theme

Create custom themes via the plugin API!

### ⚙️ **Advanced Settings**
Notepad++-style settings panel with:
- Font size control (10-24px)
- Tab size configuration (2-8 spaces)
- Auto-save toggle
- Format on save
- Line numbers, word wrap, minimap
- Auto-close brackets
- Spell check

### ⌨️ **Keyboard Shortcuts**
| Shortcut | Action |
|----------|--------|
| `Ctrl+T` | New Tab |
| `Ctrl+O` | Open File |
| `Ctrl+S` | Save File |
| `Ctrl+Shift+F` | Format Document |
| `Ctrl+Shift+P` | Command Palette |
| `Tab` | Insert Indentation |

## 📦 Installation

1. **Install dependencies:**
```bash
npm install react react-dom lucide-react
```

2. **Import the editor:**
```tsx
import EnhancedCodeEditor from './enhanced-code-editor';
import './enhanced-code-editor/editor-styles.css';

function App() {
  return <EnhancedCodeEditor />;
}
```

3. **Run your application:**
```bash
npm start
```

## 🔧 Plugin Development

### Creating a Plugin

```typescript
import { Plugin, PluginAPI } from './enhanced-code-editor';

const myPlugin: Plugin = {
  id: 'my-awesome-plugin',
  name: 'My Awesome Plugin',
  version: '1.0.0',
  description: 'Does something amazing',
  author: 'Your Name',

  activate: (api: PluginAPI) => {
    // Register a custom command
    api.registerCommand({
      id: 'my-command',
      name: 'Do Something Awesome',
      description: 'Performs an awesome action',
      keybinding: 'Ctrl+Shift+A',
      handler: () => {
        api.showNotification('Awesome action executed!', 'success');
      }
    });

    // Register a status bar item
    api.registerStatusBarItem({
      id: 'my-status',
      text: 'Custom Status',
      tooltip: 'This is custom',
      alignment: 'right',
      priority: 100,
      onClick: () => {
        console.log('Status clicked!');
      }
    });
  },

  deactivate: () => {
    // Cleanup when plugin is unloaded
    console.log('Plugin deactivated');
  }
};

// Register the plugin
pluginManager.registerPlugin(myPlugin);
```

### Adding a Custom Language

```typescript
api.registerLanguage({
  id: 'mylang',
  name: 'MyLang',
  extensions: ['ml', 'mylang'],
  tokenizer: {
    keywords: /\b(func|var|if|else)\b/g,
    strings: /(["'])(?:(?=(\\?))\2.)*?\1/g,
    comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
    numbers: /\b\d+\.?\d*\b/g,
  },
  autocomplete: ['func', 'var', 'if', 'else', 'return']
});
```

### Adding a Custom Theme

```typescript
api.registerTheme({
  id: 'ocean-breeze',
  name: 'Ocean Breeze',
  type: 'dark',
  colors: {
    background: '#001529',
    surface: '#002140',
    surfaceAlt: '#003a5d',
    text: '#e6f7ff',
    textSecondary: '#91caff',
    border: '#0958d9',
    primary: '#1677ff',
    success: '#52c41a',
    error: '#ff4d4f',
    warning: '#faad14',
    menuHover: '#0050b3',
    keyword: '#ff7a45',
    string: '#73d13d',
    comment: '#8c8c8c',
    function: '#ffc53d',
    number: '#b37feb',
  }
});
```

## 🎨 Design Philosophy

**Neo-Brutalist Code Lab** aesthetic:
- **Sharp geometry**: Bold borders, defined edges
- **Glass morphism**: Translucent panels with backdrop blur
- **Mechanical animations**: Precise, satisfying transitions
- **High contrast**: Clear visual hierarchy
- **Typography**: JetBrains Mono for code, Outfit for UI

### Color Theory
- **Cyberpunk Night**: Electric blues and neon pinks
- **Warm Sunrise**: Amber, terracotta, and sage
- **Deep Midnight**: Cool grays with soft blues

## 📐 Architecture

```
enhanced-code-editor/
├── index.tsx              # Main component with all logic
├── editor-styles.css      # Complete styling system
└── README.md             # Documentation (this file)

Core Systems:
├── Plugin Manager         # Handles plugin lifecycle
├── Language Registry      # Manages syntax definitions
├── Theme Engine          # Customizable color schemes
├── Command System        # Keyboard shortcuts & actions
├── Settings Manager      # User preferences
└── State Management      # React hooks for editor state
```

## 🔥 Advanced Usage

### Programmatic Control

```typescript
// Access the editor via refs
const editorRef = useRef<EditorAPI>(null);

// Update content
editorRef.current?.updateContent('console.log("Hello!");');

// Get active tab
const activeTab = editorRef.current?.getActiveEditor();

// Execute command
editorRef.current?.executeCommand('format-document');

// Change theme
editorRef.current?.setTheme('cyberpunk');
```

### Custom Status Bar Items

```typescript
api.registerStatusBarItem({
  id: 'git-status',
  text: '↑2 ↓1',
  tooltip: 'Git changes',
  icon: GitBranch,
  alignment: 'left',
  priority: 50,
  onClick: () => {
    // Show git panel
  }
});
```

### Custom Commands

```typescript
api.registerCommand({
  id: 'insert-timestamp',
  name: 'Insert Timestamp',
  description: 'Insert current timestamp at cursor',
  keybinding: 'Ctrl+Alt+T',
  handler: () => {
    const editor = api.getActiveEditor();
    if (editor) {
      const timestamp = new Date().toISOString();
      api.updateEditor(editor.content + `\n// ${timestamp}`);
    }
  }
});
```

## 🚦 Status Bar Customization

The status bar supports dynamic segments:
- Language indicator
- Line/column position
- Character count
- Git branch
- Custom plugin items

Click any segment to trigger actions!

## 🎯 Roadmap

- [ ] Monaco Editor integration
- [ ] LSP (Language Server Protocol) support
- [ ] Git integration
- [ ] Collaborative editing
- [ ] Vim mode
- [ ] Terminal integration
- [ ] File explorer sidebar
- [ ] Search & replace panel
- [ ] Extension marketplace

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your plugin/theme/feature
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use in your projects!

## 💡 Credits

Built with:
- React 18+
- TypeScript
- Lucide React (icons)
- JetBrains Mono (font)
- Outfit (font)

Inspired by VS Code, Sublime Text, and Notepad++.

---

**Happy coding!** 🎉

Built with ❤️ by the CodeLab team
