/**
 * CodeLab Pro - Interactive Demo
 *
 * This file demonstrates all features of the enhanced code editor:
 * - Plugin system
 * - Custom themes
 * - Custom languages
 * - Commands
 * - Status bar customization
 * - Split view
 * - Settings management
 */

import React, { useRef, useEffect, useState } from 'react';
import EnhancedCodeEditor from './index';
import {
  advancedTypeScriptPlugin,
  markdownPlugin,
  pythonPlugin,
  examplePlugins
} from './example-plugin';
import './editor-styles.css';

// ==================== DEMO PLUGIN: Feature Showcase ====================
const demoPlugin = {
  id: 'demo-showcase',
  name: 'Demo Showcase',
  version: '1.0.0',
  description: 'Demonstrates all CodeLab Pro features',
  author: 'CodeLab Team',

  activate: (api: any) => {
    console.log('🎉 Demo Plugin Activated!');

    // Demo Command 1: Insert Template
    api.registerCommand({
      id: 'insert-react-component',
      name: 'Insert React Component Template',
      description: 'Insert a React functional component boilerplate',
      keybinding: 'Ctrl+Shift+R',
      handler: () => {
        const componentName = 'MyComponent';
        const template = `import React from 'react';

interface ${componentName}Props {
  // Define props here
}

const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <div className="${componentName.toLowerCase()}">
      <h1>Hello from ${componentName}!</h1>
    </div>
  );
};

export default ${componentName};
`;
        api.updateEditor(template);
        api.showNotification('React component template inserted!', 'success');
      }
    });

    // Demo Command 2: Count Words
    api.registerCommand({
      id: 'count-words',
      name: 'Count Words',
      description: 'Count words in current file',
      keybinding: 'Ctrl+Shift+W',
      handler: () => {
        const editor = api.getActiveEditor();
        if (editor) {
          const words = editor.content.trim().split(/\s+/).length;
          const lines = editor.content.split('\n').length;
          const chars = editor.content.length;
          api.showNotification(
            `📊 Stats: ${words} words, ${lines} lines, ${chars} chars`,
            'info'
          );
        }
      }
    });

    // Demo Command 3: Transform Text
    api.registerCommand({
      id: 'transform-uppercase',
      name: 'Transform to UPPERCASE',
      description: 'Convert all text to uppercase',
      handler: () => {
        const editor = api.getActiveEditor();
        if (editor) {
          api.updateEditor(editor.content.toUpperCase());
          api.showNotification('Transformed to UPPERCASE', 'success');
        }
      }
    });

    api.registerCommand({
      id: 'transform-lowercase',
      name: 'Transform to lowercase',
      description: 'Convert all text to lowercase',
      handler: () => {
        const editor = api.getActiveEditor();
        if (editor) {
          api.updateEditor(editor.content.toLowerCase());
          api.showNotification('Transformed to lowercase', 'success');
        }
      }
    });

    // Demo Status Bar: Live Stats
    let statsUpdateInterval: NodeJS.Timeout;

    api.registerStatusBarItem({
      id: 'live-stats',
      text: '📈 Stats',
      tooltip: 'Live editor statistics',
      alignment: 'right',
      priority: 200,
      onClick: () => {
        const editor = api.getActiveEditor();
        if (editor) {
          const stats = {
            words: editor.content.trim().split(/\s+/).length,
            lines: editor.content.split('\n').length,
            chars: editor.content.length,
          };
          api.showNotification(
            `Words: ${stats.words} | Lines: ${stats.lines} | Chars: ${stats.chars}`,
            'info'
          );
        }
      }
    });

    // Demo Status Bar: Time Tracker
    api.registerStatusBarItem({
      id: 'time-tracker',
      text: '⏱️ 00:00',
      tooltip: 'Time spent coding',
      alignment: 'right',
      priority: 190,
      onClick: () => {
        api.showNotification('Time tracking feature demo', 'info');
      }
    });

    // Cleanup on deactivate
    return () => {
      if (statsUpdateInterval) {
        clearInterval(statsUpdateInterval);
      }
    };
  },

  deactivate: () => {
    console.log('Demo plugin deactivated');
  }
};

// ==================== DEMO CUSTOM THEME ====================
const demoTheme = {
  id: 'neon-city',
  name: 'Neon City',
  type: 'dark',
  colors: {
    background: '#0d0221',
    surface: '#190b28',
    surfaceAlt: '#240b36',
    text: '#e7dfdd',
    textSecondary: '#a799b7',
    border: '#4a1942',
    primary: '#f72585',
    success: '#06ffa5',
    error: '#ff006e',
    warning: '#ffbe0b',
    menuHover: '#2d1b3d',
    keyword: '#f72585',
    string: '#06ffa5',
    comment: '#7209b7',
    function: '#4361ee',
    number: '#4cc9f0',
  }
};

// ==================== DEMO CUSTOM LANGUAGE ====================
const demoLanguage = {
  id: 'demo-lang',
  name: 'DemoLang',
  extensions: ['demo', 'dl'],
  tokenizer: {
    keywords: /\b(start|end|loop|check|output|input|store)\b/g,
    strings: /(["'])(?:(?=(\\?))\2.)*?\1/g,
    comments: /\/\/.*$/gm,
    numbers: /\b\d+\.?\d*\b/g,
  },
  autocomplete: ['start', 'end', 'loop', 'check', 'output', 'input', 'store']
};

// ==================== MAIN DEMO COMPONENT ====================
const CodeLabDemo: React.FC = () => {
  const editorRef = useRef<any>(null);
  const [pluginsLoaded, setPluginsLoaded] = useState(false);

  useEffect(() => {
    // Wait for editor to mount, then register all demo plugins
    const timer = setTimeout(() => {
      if (editorRef.current?.pluginManagerRef?.current) {
        const manager = editorRef.current.pluginManagerRef.current;

        // Load all example plugins
        console.log('🔌 Loading demo plugins...');

        // Demo plugin
        manager.registerPlugin(demoPlugin);

        // Language-specific plugins
        examplePlugins.forEach(plugin => {
          manager.registerPlugin(plugin);
        });

        // Register custom theme via plugin
        const themePlugin = {
          id: 'neon-city-plugin',
          name: 'Neon City Theme',
          version: '1.0.0',
          description: 'Adds Neon City theme',
          author: 'Demo',
          activate: (api: any) => {
            api.registerTheme(demoTheme);
            api.showNotification('🌃 Neon City theme available!', 'success');
          }
        };
        manager.registerPlugin(themePlugin);

        // Register demo language via plugin
        const langPlugin = {
          id: 'demo-lang-plugin',
          name: 'DemoLang Support',
          version: '1.0.0',
          description: 'Adds DemoLang support',
          author: 'Demo',
          activate: (api: any) => {
            api.registerLanguage(demoLanguage);
            api.showNotification('📝 DemoLang language available!', 'success');
          }
        };
        manager.registerPlugin(langPlugin);

        setPluginsLoaded(true);
        console.log('✅ All demo plugins loaded!');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <EnhancedCodeEditor ref={editorRef} />

      {/* Demo Info Overlay */}
      {!pluginsLoaded && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            zIndex: 9999,
          }}
        >
          🔄 Loading demo plugins...
        </div>
      )}

      {pluginsLoaded && (
        <DemoGuide />
      )}
    </div>
  );
};

// ==================== DEMO GUIDE OVERLAY ====================
const DemoGuide: React.FC = () => {
  const [showGuide, setShowGuide] = useState(true);

  if (!showGuide) {
    return (
      <button
        onClick={() => setShowGuide(true)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: '#f72585',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          zIndex: 9999,
        }}
      >
        ?
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        right: 20,
        width: '320px',
        background: 'rgba(13, 2, 33, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '2px solid #f72585',
        borderRadius: '12px',
        padding: '20px',
        color: 'white',
        fontSize: '13px',
        zIndex: 9999,
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>🚀 Demo Guide</h3>
        <button
          onClick={() => setShowGuide(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#f72585' }}>✨ Try These Features:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
          <li><code>Ctrl+Shift+P</code> - Command Palette</li>
          <li><code>Ctrl+Shift+R</code> - Insert React Template</li>
          <li><code>Ctrl+Shift+F</code> - Format Code</li>
          <li><code>Ctrl+T</code> - New Tab</li>
          <li><code>Ctrl+S</code> - Save File</li>
        </ul>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#06ffa5' }}>🎨 Available Themes:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Cyberpunk Night (default)</li>
          <li>Warm Sunrise</li>
          <li>Deep Midnight</li>
          <li>Dracula (via plugin)</li>
          <li>Neon City (demo theme)</li>
        </ul>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#4cc9f0' }}>🔌 Active Plugins:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6', fontSize: '12px' }}>
          <li>Demo Showcase</li>
          <li>Advanced TypeScript</li>
          <li>Markdown Support</li>
          <li>Python Support</li>
          <li>Neon City Theme</li>
          <li>DemoLang Support</li>
        </ul>
      </div>

      <div style={{
        padding: '12px',
        background: 'rgba(247, 37, 133, 0.2)',
        borderRadius: '6px',
        border: '1px solid #f72585',
        marginTop: '16px'
      }}>
        <strong>💡 Pro Tip:</strong> Click the status bar items at the bottom to see interactive features!
      </div>
    </div>
  );
};

export default CodeLabDemo;

// ==================== USAGE INSTRUCTIONS ====================
/*

1. BASIC USAGE:
   import CodeLabDemo from './enhanced-code-editor/DEMO';
   <CodeLabDemo />

2. EXPLORE FEATURES:
   - Open command palette: Ctrl+Shift+P
   - Try different themes via settings
   - Create multiple tabs
   - Enable split view
   - Test custom commands

3. PLUGIN DEVELOPMENT:
   - Check example-plugin.ts for more examples
   - Use INTEGRATION.md for detailed API docs
   - Create your own plugins following the patterns

4. CUSTOMIZATION:
   - Modify demo theme colors
   - Add your own commands
   - Create custom status bar items
   - Register new languages

*/
