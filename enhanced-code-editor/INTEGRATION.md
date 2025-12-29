# 🎯 CodeLab Pro - Integration Guide

Complete guide to integrating and extending CodeLab Pro in your React application.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Plugin System](#plugin-system)
3. [Custom Themes](#custom-themes)
4. [Custom Languages](#custom-languages)
5. [Advanced Configuration](#advanced-configuration)
6. [API Reference](#api-reference)

---

## 🚀 Quick Start

### Basic Integration

```tsx
import React from 'react';
import EnhancedCodeEditor from './enhanced-code-editor';
import './enhanced-code-editor/editor-styles.css';

function App() {
  return (
    <div className="App">
      <EnhancedCodeEditor />
    </div>
  );
}

export default App;
```

### With Custom Configuration

```tsx
import React, { useRef, useEffect } from 'react';
import EnhancedCodeEditor from './enhanced-code-editor';
import { advancedTypeScriptPlugin, markdownPlugin } from './enhanced-code-editor/example-plugin';
import './enhanced-code-editor/editor-styles.css';

function App() {
  const editorRef = useRef(null);

  useEffect(() => {
    // Access plugin manager and register plugins
    if (editorRef.current?.pluginManager) {
      editorRef.current.pluginManager.registerPlugin(advancedTypeScriptPlugin);
      editorRef.current.pluginManager.registerPlugin(markdownPlugin);
    }
  }, []);

  return <EnhancedCodeEditor ref={editorRef} />;
}
```

---

## 🔌 Plugin System

### Plugin Structure

Every plugin must implement the `Plugin` interface:

```typescript
interface Plugin {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  version: string;               // Semantic version
  description: string;           // Short description
  author: string;                // Plugin author
  activate: (api: PluginAPI) => void;     // Activation function
  deactivate?: () => void;       // Optional cleanup
  contributes?: {                // Optional auto-contributions
    languages?: LanguageDefinition[];
    themes?: ThemeDefinition[];
    commands?: CommandDefinition[];
    statusBarItems?: StatusBarItem[];
  };
}
```

### Complete Plugin Example

```typescript
import { Plugin, PluginAPI } from './enhanced-code-editor';

const myPlugin: Plugin = {
  id: 'my-plugin',
  name: 'My Awesome Plugin',
  version: '1.0.0',
  description: 'Does something awesome',
  author: 'Your Name',

  activate: (api: PluginAPI) => {
    // Called when plugin loads
    console.log('Plugin activated!');

    // Register a command
    api.registerCommand({
      id: 'my-command',
      name: 'My Command',
      description: 'Does something cool',
      keybinding: 'Ctrl+Shift+M',
      handler: () => {
        const editor = api.getActiveEditor();
        if (editor) {
          api.showNotification(`Current file: ${editor.name}`, 'info');
        }
      }
    });

    // Register a status bar item
    api.registerStatusBarItem({
      id: 'my-status',
      text: '✨ My Plugin',
      tooltip: 'Click me!',
      alignment: 'right',
      priority: 100,
      onClick: () => {
        api.showNotification('Status clicked!', 'success');
      }
    });

    // Listen to editor changes
    setInterval(() => {
      const editor = api.getActiveEditor();
      if (editor) {
        console.log(`Lines: ${editor.content.split('\n').length}`);
      }
    }, 5000);
  },

  deactivate: () => {
    // Cleanup
    console.log('Plugin deactivated');
  }
};

export default myPlugin;
```

### PluginAPI Methods

```typescript
interface PluginAPI {
  // Language support
  registerLanguage(lang: LanguageDefinition): void;

  // Theme support
  registerTheme(theme: ThemeDefinition): void;

  // Command system
  registerCommand(command: CommandDefinition): void;

  // Status bar
  registerStatusBarItem(item: StatusBarItem): void;

  // Notifications
  showNotification(
    message: string,
    type?: 'info' | 'success' | 'error' | 'warning'
  ): void;

  // Editor access
  getActiveEditor(): EditorState | null;
  updateEditor(content: string): void;
}
```

---

## 🎨 Custom Themes

### Creating a Theme

```typescript
const myTheme: ThemeDefinition = {
  id: 'my-theme',
  name: 'My Awesome Theme',
  type: 'dark', // or 'light'
  colors: {
    // Core colors
    background: '#1a1a2e',
    surface: '#16213e',
    surfaceAlt: '#0f3460',
    text: '#eee',
    textSecondary: '#aaa',
    border: '#333',

    // Accent colors
    primary: '#e94560',
    success: '#00d9a3',
    error: '#ff4757',
    warning: '#ffa502',

    // UI colors
    menuHover: '#1f2e4d',

    // Syntax colors
    keyword: '#ff6b9d',
    string: '#a8e6cf',
    comment: '#6c757d',
    function: '#ffd93d',
    number: '#c56cf0',

    // Add any custom colors
    customAccent: '#ff69b4',
  }
};

// Register via plugin
api.registerTheme(myTheme);
```

### Theme Color Reference

| Property | Purpose | Example |
|----------|---------|---------|
| `background` | Main editor background | `#0a0e27` |
| `surface` | Panels, menus, bars | `#141b3a` |
| `surfaceAlt` | Alternate surfaces, tabs | `#1f2847` |
| `text` | Primary text color | `#e0e7ff` |
| `textSecondary` | Secondary text, hints | `#8b92b8` |
| `border` | All borders | `#2d3a5f` |
| `primary` | Primary accent, highlights | `#00f0ff` |
| `success` | Success messages | `#00ff9f` |
| `error` | Error messages | `#ff0055` |
| `warning` | Warning messages | `#ffaa00` |
| `menuHover` | Menu item hover state | `#252e52` |
| `keyword` | Syntax: keywords | `#ff006e` |
| `string` | Syntax: strings | `#00f5d4` |
| `comment` | Syntax: comments | `#5a6488` |
| `function` | Syntax: functions | `#ffbe0b` |
| `number` | Syntax: numbers | `#a855f7` |

---

## 💬 Custom Languages

### Language Definition

```typescript
const myLanguage: LanguageDefinition = {
  id: 'mylang',
  name: 'MyLang',
  extensions: ['ml', 'mylang'],
  tokenizer: {
    keywords: /\b(func|var|if|else|return|class|import)\b/g,
    strings: /(["'])(?:(?=(\\?))\2.)*?\1/g,
    comments: /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm,
    numbers: /\b\d+\.?\d*\b/g,
    functions: /\b([a-zA-Z_][\w]*)\s*(?=\()/g,
  },
  autocomplete: [
    'func', 'var', 'if', 'else', 'return', 'class',
    'import', 'export', 'const', 'let'
  ]
};

// Register via plugin
api.registerLanguage(myLanguage);
```

### Advanced Tokenizer Example

```typescript
tokenizer: {
  // Keywords
  keywords: /\b(if|else|for|while|function|class|return|import|export)\b/g,

  // Strings with escape sequences
  strings: /(["'`])(?:(?=(\\?))\2.)*?\1/g,

  // Single and multi-line comments
  comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,

  // Numbers (int, float, hex, binary)
  numbers: /\b(0x[\da-fA-F]+|0b[01]+|\d+\.?\d*)\b/g,

  // Functions
  functions: /\b([a-zA-Z_$][\w$]*)\s*(?=\()/g,

  // Types (for typed languages)
  types: /\b(string|number|boolean|void|any|object)\b/g,

  // Operators
  operators: /[+\-*/%=<>!&|^~?:]+/g,

  // Decorators (TypeScript/Python style)
  decorators: /@\w+/g,

  // Class names (capitalized)
  classes: /\b([A-Z][\w]*)\b/g,
}
```

---

## ⚙️ Advanced Configuration

### Custom Commands with Complex Logic

```typescript
api.registerCommand({
  id: 'smart-duplicate-line',
  name: 'Smart Duplicate Line',
  description: 'Duplicate line and increment numbers',
  keybinding: 'Ctrl+Shift+D',
  handler: () => {
    const editor = api.getActiveEditor();
    if (!editor) return;

    const lines = editor.content.split('\n');
    const duplicated = lines.map(line => {
      // Duplicate and increment any numbers
      const incremented = line.replace(/\d+/g, match => {
        return String(parseInt(match) + 1);
      });
      return line + '\n' + incremented;
    }).join('\n');

    api.updateEditor(duplicated);
    api.showNotification('Lines duplicated with increments', 'success');
  }
});
```

### Multi-Step Status Bar Items

```typescript
let clickCount = 0;

api.registerStatusBarItem({
  id: 'click-counter',
  text: `Clicks: ${clickCount}`,
  tooltip: 'Click to increment',
  alignment: 'right',
  priority: 50,
  onClick: () => {
    clickCount++;
    // Update the status bar text
    // Note: This is simplified - actual implementation would need state management
    api.showNotification(`Total clicks: ${clickCount}`, 'info');
  }
});
```

### Dynamic Language Registration

```typescript
// Load language definitions from a server
async function loadRemoteLanguage(languageId: string) {
  const response = await fetch(`https://api.example.com/languages/${languageId}`);
  const langDef = await response.json();

  api.registerLanguage({
    id: langDef.id,
    name: langDef.name,
    extensions: langDef.extensions,
    tokenizer: langDef.tokenizer,
    autocomplete: langDef.autocomplete
  });

  api.showNotification(`Loaded ${langDef.name}!`, 'success');
}
```

---

## 📖 API Reference

### EditorState Interface

```typescript
interface EditorState {
  id: number;                // Unique tab ID
  name: string;              // File name
  content: string;           // File content
  language: string;          // Language ID
  hasUnsavedChanges: boolean; // Dirty flag
}
```

### CommandDefinition Interface

```typescript
interface CommandDefinition {
  id: string;                // Unique command ID
  name: string;              // Display name
  description: string;       // Description for command palette
  keybinding?: string;       // Optional keyboard shortcut
  handler: () => void;       // Command function
}
```

### StatusBarItem Interface

```typescript
interface StatusBarItem {
  id: string;                           // Unique item ID
  text: string;                         // Display text
  tooltip?: string;                     // Hover tooltip
  icon?: React.ComponentType<any>;      // Optional icon
  alignment: 'left' | 'right';          // Position
  priority: number;                     // Sort order
  onClick?: () => void;                 // Click handler
}
```

---

## 🎓 Best Practices

### 1. Plugin Naming

```typescript
// ✅ Good
id: 'company-feature-name'
name: 'Feature Name'

// ❌ Bad
id: 'plugin1'
name: 'My Plugin'
```

### 2. Error Handling

```typescript
activate: (api: PluginAPI) => {
  try {
    // Your plugin logic
    api.registerCommand({...});
  } catch (error) {
    api.showNotification(
      `Plugin error: ${error.message}`,
      'error'
    );
    console.error('Plugin activation failed:', error);
  }
}
```

### 3. Resource Cleanup

```typescript
let intervalId: NodeJS.Timeout;

activate: (api: PluginAPI) => {
  intervalId = setInterval(() => {
    // Do something periodically
  }, 1000);
},

deactivate: () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
}
```

### 4. Semantic Versioning

```
MAJOR.MINOR.PATCH

1.0.0 - Initial release
1.1.0 - New feature (backward compatible)
1.1.1 - Bug fix
2.0.0 - Breaking change
```

---

## 🔥 Real-World Examples

### Example 1: Git Integration Plugin

```typescript
const gitPlugin: Plugin = {
  id: 'git-integration',
  name: 'Git Integration',
  version: '1.0.0',
  description: 'Git status and commands',
  author: 'Your Team',

  activate: (api: PluginAPI) => {
    // Status bar item showing git branch
    api.registerStatusBarItem({
      id: 'git-branch',
      text: '⎇ main',
      tooltip: 'Current Git branch',
      alignment: 'left',
      priority: 100,
      onClick: async () => {
        // Switch branch logic
        api.showNotification('Git: On branch main', 'info');
      }
    });

    // Command to commit changes
    api.registerCommand({
      id: 'git-commit',
      name: 'Git: Commit',
      description: 'Commit staged changes',
      keybinding: 'Ctrl+Shift+G',
      handler: () => {
        // Commit logic
        api.showNotification('Changes committed!', 'success');
      }
    });
  }
};
```

### Example 2: Live Preview Plugin

```typescript
const livePreviewPlugin: Plugin = {
  id: 'live-preview',
  name: 'Live Preview',
  version: '1.0.0',
  description: 'Real-time HTML/CSS preview',
  author: 'Your Team',

  activate: (api: PluginAPI) => {
    let previewWindow: Window | null = null;

    api.registerCommand({
      id: 'preview-open',
      name: 'Open Live Preview',
      description: 'Open preview in new window',
      keybinding: 'Ctrl+Shift+V',
      handler: () => {
        const editor = api.getActiveEditor();
        if (editor && editor.language === 'html') {
          previewWindow = window.open('', 'preview', 'width=800,height=600');
          if (previewWindow) {
            previewWindow.document.write(editor.content);
            api.showNotification('Preview opened', 'success');
          }
        }
      }
    });
  }
};
```

---

## 🐛 Troubleshooting

### Plugin Not Loading

```typescript
// Check plugin manager initialization
useEffect(() => {
  if (editorRef.current?.pluginManager) {
    console.log('Plugin manager ready');
    editorRef.current.pluginManager.registerPlugin(myPlugin);
  } else {
    console.error('Plugin manager not available');
  }
}, []);
```

### Commands Not Executing

```typescript
// Verify command registration
api.registerCommand({
  id: 'test-command',
  name: 'Test Command',
  description: 'Testing',
  handler: () => {
    console.log('Command executed!');
    api.showNotification('Command works!', 'success');
  }
});
```

### Themes Not Applying

```typescript
// Check theme structure
const theme = {
  id: 'my-theme',
  name: 'My Theme',
  type: 'dark',
  colors: {
    // Ensure ALL required colors are present
    background: '#000',
    surface: '#111',
    // ... etc
  }
};
```

---

## 📚 Additional Resources

- [Main README](./README.md) - Overview and features
- [Example Plugins](./example-plugin.ts) - Complete plugin examples
- [GitHub Issues](https://github.com/your-repo/issues) - Bug reports

---

**Happy coding!** 🚀

If you create an awesome plugin, consider contributing it back to the community!
