# ⚡ CodeLab Pro - Quick Start Guide

Get up and running with CodeLab Pro in 5 minutes!

---

## 🚀 Installation

### Step 1: Copy Files

Copy the `enhanced-code-editor` folder to your React project:

```
your-project/
├── src/
│   ├── App.tsx
│   └── ...
└── enhanced-code-editor/     ← Copy this folder here
    ├── index.tsx
    ├── editor-styles.css
    ├── example-plugin.ts
    └── ...
```

### Step 2: Install Dependencies

```bash
npm install react react-dom lucide-react
# or
yarn add react react-dom lucide-react
```

### Step 3: Import and Use

**Basic Usage** (src/App.tsx):

```tsx
import React from 'react';
import EnhancedCodeEditor from '../enhanced-code-editor/index';
import '../enhanced-code-editor/editor-styles.css';

function App() {
  return (
    <div className="App">
      <EnhancedCodeEditor />
    </div>
  );
}

export default App;
```

### Step 4: Run

```bash
npm start
# or
yarn start
```

**Done! 🎉** Your editor is now running!

---

## 🎯 First Steps

### 1. Open the Command Palette

Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)

Try these commands:
- **New File** - Create a new tab
- **Open File** - Load a file from disk
- **Format Document** - Beautify your code
- **Open Settings** - Customize the editor

### 2. Try Different Themes

Click the theme name in the **status bar** (bottom-right) to switch themes:
- Cyberpunk Night (default)
- Warm Sunrise
- Deep Midnight

### 3. Create Multiple Tabs

- Press `Ctrl+T` to create a new tab
- Click the `+` button in the tab bar
- Open files with `Ctrl+O`

### 4. Enable Split View

- Open Command Palette (`Ctrl+Shift+P`)
- Search for "Toggle Split View"
- Or use the View menu

### 5. Customize Settings

- Click the gear icon (⚙️) in the top-right
- Or press `Ctrl+Shift+P` → "Open Settings"
- Adjust font size, tab size, line numbers, etc.

---

## 🔌 Adding Your First Plugin

### Create a Plugin File

Create `my-plugin.ts` in your project:

```typescript
import { Plugin, PluginAPI } from './enhanced-code-editor/index';

const myFirstPlugin: Plugin = {
  id: 'my-first-plugin',
  name: 'My First Plugin',
  version: '1.0.0',
  description: 'My awesome plugin!',
  author: 'Your Name',

  activate: (api: PluginAPI) => {
    console.log('🎉 Plugin activated!');

    // Add a command
    api.registerCommand({
      id: 'say-hello',
      name: 'Say Hello',
      description: 'Shows a hello message',
      keybinding: 'Ctrl+Shift+H',
      handler: () => {
        api.showNotification('Hello from my plugin!', 'success');
      }
    });

    // Add a status bar item
    api.registerStatusBarItem({
      id: 'my-status',
      text: '👋 Hello',
      tooltip: 'Click me!',
      alignment: 'right',
      priority: 100,
      onClick: () => {
        api.showNotification('Status bar clicked!', 'info');
      }
    });
  }
};

export default myFirstPlugin;
```

### Load the Plugin

Update your `App.tsx`:

```tsx
import React, { useRef, useEffect } from 'react';
import EnhancedCodeEditor from '../enhanced-code-editor/index';
import myFirstPlugin from './my-plugin';
import '../enhanced-code-editor/editor-styles.css';

function App() {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current?.pluginManagerRef?.current) {
      editorRef.current.pluginManagerRef.current.registerPlugin(myFirstPlugin);
    }
  }, []);

  return <EnhancedCodeEditor ref={editorRef} />;
}

export default App;
```

### Test Your Plugin

1. Restart your app
2. Press `Ctrl+Shift+P`
3. Search for "Say Hello"
4. Execute it!

You should see a notification: "Hello from my plugin!"

---

## 🎨 Creating a Custom Theme

### 1. Define Your Theme

```typescript
const myTheme = {
  id: 'my-custom-theme',
  name: 'My Custom Theme',
  type: 'dark',
  colors: {
    background: '#1a1a2e',
    surface: '#16213e',
    surfaceAlt: '#0f3460',
    text: '#eee',
    textSecondary: '#aaa',
    border: '#333',
    primary: '#e94560',
    success: '#00d9a3',
    error: '#ff4757',
    warning: '#ffa502',
    menuHover: '#1f2e4d',
    keyword: '#ff6b9d',
    string: '#a8e6cf',
    comment: '#6c757d',
    function: '#ffd93d',
    number: '#c56cf0',
  }
};
```

### 2. Register via Plugin

```typescript
activate: (api: PluginAPI) => {
  api.registerTheme(myTheme);
  api.showNotification('Custom theme loaded!', 'success');
}
```

### 3. Apply Your Theme

Open Settings → Appearance → Select "My Custom Theme"

---

## 💻 Common Tasks

### Task 1: Format JSON

1. Create a new tab (`Ctrl+T`)
2. Paste some JSON
3. Press `Ctrl+Shift+F` to format

### Task 2: Edit Multiple Files

1. Open first file (`Ctrl+O`)
2. Create new tab for second file (`Ctrl+T`)
3. Toggle split view (`Ctrl+Shift+P` → "Toggle Split View")
4. Edit both files side-by-side!

### Task 3: Save Your Work

- **Single file**: `Ctrl+S`
- **All files**: Not yet implemented (coming soon!)

### Task 4: Search Commands

1. Press `Ctrl+Shift+P`
2. Start typing (fuzzy search works!)
3. Use arrow keys to navigate
4. Press Enter to execute

---

## ⌨️ Essential Keyboard Shortcuts

Print this out and keep it handy!

```
╔════════════════════════════════════════════╗
║  CodeLab Pro - Essential Shortcuts         ║
╠════════════════════════════════════════════╣
║  GENERAL                                   ║
║  Ctrl+Shift+P  → Command Palette           ║
║  Ctrl+,        → Settings (not implemented)║
║                                            ║
║  FILE                                      ║
║  Ctrl+T        → New Tab                   ║
║  Ctrl+O        → Open File                 ║
║  Ctrl+S        → Save File                 ║
║  Ctrl+W        → Close Tab (not impl.)     ║
║                                            ║
║  EDIT                                      ║
║  Ctrl+Z        → Undo                      ║
║  Ctrl+Y        → Redo                      ║
║  Ctrl+X        → Cut                       ║
║  Ctrl+C        → Copy                      ║
║  Ctrl+V        → Paste                     ║
║  Tab           → Indent                    ║
║  Ctrl+Shift+F  → Format Document           ║
║                                            ║
║  VIEW                                      ║
║  Ctrl+\        → Split View (via palette)  ║
╚════════════════════════════════════════════╝
```

---

## 🎓 Learning Path

### Beginner (15 minutes)
1. ✅ Install and run the editor
2. ✅ Try different themes
3. ✅ Create and edit multiple tabs
4. ✅ Use the command palette
5. ✅ Customize basic settings

### Intermediate (1 hour)
1. ✅ Create your first plugin
2. ✅ Add a custom command
3. ✅ Register a status bar item
4. ✅ Create a custom theme
5. ✅ Use split view for editing

### Advanced (3 hours)
1. ✅ Create a language definition
2. ✅ Build a multi-feature plugin
3. ✅ Integrate with external APIs
4. ✅ Add complex commands with logic
5. ✅ Contribute to the ecosystem

---

## 🐛 Troubleshooting

### Problem: Editor not showing

**Solution**: Check that you imported the CSS:
```tsx
import '../enhanced-code-editor/editor-styles.css';
```

### Problem: Plugins not loading

**Solution**: Ensure you're accessing the plugin manager after mount:
```tsx
useEffect(() => {
  if (editorRef.current?.pluginManagerRef?.current) {
    // Load plugins here
  }
}, []);
```

### Problem: Themes not applying

**Solution**: Verify theme structure has all required colors.

### Problem: Keyboard shortcuts not working

**Solution**:
- Ensure editor has focus
- Check browser doesn't override shortcuts
- Try in different browser

### Problem: Performance issues

**Solution**:
- Reduce font size
- Disable minimap
- Close unused tabs
- Check browser extensions

---

## 📚 Next Steps

### Explore Examples

Check out the included example plugins:
```typescript
import {
  advancedTypeScriptPlugin,
  markdownPlugin,
  pythonPlugin
} from '../enhanced-code-editor/example-plugin';
```

### Read Documentation

- **[README.md](./README.md)** - Overview
- **[FEATURES.md](./FEATURES.md)** - Complete feature list
- **[INTEGRATION.md](./INTEGRATION.md)** - API reference
- **[DEMO.tsx](./DEMO.tsx)** - Interactive demo

### Join the Community

- Report bugs on GitHub
- Share your plugins
- Request features
- Contribute code

---

## 🎯 Pro Tips

### Tip 1: Command Palette is Your Friend
Don't remember a shortcut? Just press `Ctrl+Shift+P` and search!

### Tip 2: Customize Your Workflow
Create plugin commands for repetitive tasks:
```typescript
handler: () => {
  const editor = api.getActiveEditor();
  // Do something with editor.content
  api.updateEditor(transformedContent);
}
```

### Tip 3: Status Bar = Quick Info
Click status bar items to interact with them. They're not just for display!

### Tip 4: Use Split View for Comparison
Perfect for comparing two versions of a file or working on related files.

### Tip 5: Theme Based on Context
- **Dark themes** - Less eye strain for long sessions
- **Light themes** - Better for presentations
- **High contrast** - Accessibility

---

## ✅ Checklist

Before you start coding, make sure:

- [ ] Editor is installed and running
- [ ] You can open the command palette
- [ ] You can create new tabs
- [ ] You can save files
- [ ] You understand how to load plugins
- [ ] You've tried at least 2 themes
- [ ] You've opened the settings panel
- [ ] You've formatted some code

---

## 🚀 Ready to Build Something Awesome?

You now have everything you need to:
- Edit code efficiently
- Customize your environment
- Extend functionality with plugins
- Create beautiful themes
- Build your perfect editor

**Happy coding!** 🎉

---

## 📞 Get Help

- **Documentation**: Check the `/enhanced-code-editor/` folder
- **Examples**: See `example-plugin.ts` and `DEMO.tsx`
- **Issues**: Report bugs on GitHub
- **Community**: Share and discuss

---

*Last updated: December 2024*
*Version: 1.0.0*
