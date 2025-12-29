/**
 * EXAMPLE PLUGIN: Advanced TypeScript Support
 *
 * This demonstrates how to create a full-featured plugin for CodeLab Pro
 *
 * Features:
 * - Custom TypeScript language enhancements
 * - Custom theme (Dracula variant)
 * - Custom commands
 * - Status bar integration
 */

import type { Plugin, PluginAPI, LanguageDefinition, ThemeDefinition } from './index';

// Custom TypeScript Pro Language
const typescriptProLanguage: LanguageDefinition = {
  id: 'typescript-pro',
  name: 'TypeScript Pro',
  extensions: ['ts', 'tsx', 'mts'],
  tokenizer: {
    keywords: /\b(abstract|any|as|asserts|async|await|bigint|boolean|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|infer|instanceof|interface|is|keyof|let|module|namespace|never|new|null|number|object|of|package|private|protected|public|readonly|require|return|set|static|string|super|switch|symbol|this|throw|true|try|type|typeof|undefined|unique|unknown|var|void|while|with|yield)\b/g,
    types: /\b(string|number|boolean|any|void|never|unknown|object|null|undefined|Array|Promise|Set|Map|Record|Partial|Required|Readonly|Pick|Omit|Exclude|Extract|NonNullable|Parameters|ReturnType|InstanceType|ThisType)\b/g,
    strings: /(["'`])(?:(?=(\\?))\2.)*?\1/g,
    comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
    numbers: /\b\d+\.?\d*\b/g,
    functions: /\b([a-zA-Z_$][\w$]*)\s*(?=\()/g,
    decorators: /@\w+/g,
  },
  autocomplete: [
    'interface', 'type', 'enum', 'namespace', 'abstract', 'implements',
    'public', 'private', 'protected', 'readonly', 'static', 'async', 'await',
    'Promise', 'Array', 'Map', 'Set', 'Record', 'Partial', 'Required',
    'Pick', 'Omit', 'Exclude', 'Extract', 'ReturnType', 'Parameters',
  ],
};

// Custom Dracula Theme
const draculaTheme: ThemeDefinition = {
  id: 'dracula',
  name: 'Dracula',
  type: 'dark',
  colors: {
    background: '#282a36',
    surface: '#343746',
    surfaceAlt: '#44475a',
    text: '#f8f8f2',
    textSecondary: '#6272a4',
    border: '#44475a',
    primary: '#bd93f9',
    success: '#50fa7b',
    error: '#ff5555',
    warning: '#f1fa8c',
    menuHover: '#44475a',
    keyword: '#ff79c6',
    string: '#f1fa8c',
    comment: '#6272a4',
    function: '#50fa7b',
    number: '#bd93f9',
    cyan: '#8be9fd',
    orange: '#ffb86c',
    pink: '#ff79c6',
    purple: '#bd93f9',
    red: '#ff5555',
    yellow: '#f1fa8c',
  },
};

// Main Plugin Definition
export const advancedTypeScriptPlugin: Plugin = {
  id: 'advanced-typescript',
  name: 'Advanced TypeScript Support',
  version: '2.0.0',
  description: 'Enhanced TypeScript language support with Dracula theme',
  author: 'CodeLab Team',

  activate: (api: PluginAPI) => {
    console.log('🚀 Advanced TypeScript Plugin activated!');

    // Register enhanced TypeScript language
    api.registerLanguage(typescriptProLanguage);

    // Register Dracula theme
    api.registerTheme(draculaTheme);

    // Register custom commands
    api.registerCommand({
      id: 'ts-generate-interface',
      name: 'Generate TypeScript Interface',
      description: 'Generate a TypeScript interface from JSON',
      keybinding: 'Ctrl+Shift+I',
      handler: () => {
        const editor = api.getActiveEditor();
        if (!editor) {
          api.showNotification('No active editor', 'error');
          return;
        }

        try {
          // Try to parse JSON and generate interface
          const json = JSON.parse(editor.content);
          const interfaceName = 'GeneratedInterface';
          const interfaceCode = generateInterfaceFromJSON(json, interfaceName);

          api.updateEditor(interfaceCode);
          api.showNotification('Interface generated successfully!', 'success');
        } catch (e) {
          api.showNotification('Invalid JSON - cannot generate interface', 'error');
        }
      },
    });

    api.registerCommand({
      id: 'ts-add-type-annotations',
      name: 'Add TypeScript Type Annotations',
      description: 'Add type annotations to variables',
      keybinding: 'Ctrl+Shift+T',
      handler: () => {
        api.showNotification('Adding type annotations...', 'info');
        // This would analyze code and add type annotations
        // Simplified for demo purposes
        const editor = api.getActiveEditor();
        if (editor) {
          let content = editor.content;
          content = content.replace(/const (\w+) = /g, 'const $1: any = ');
          content = content.replace(/let (\w+) = /g, 'let $1: any = ');
          api.updateEditor(content);
          api.showNotification('Type annotations added', 'success');
        }
      },
    });

    api.registerCommand({
      id: 'ts-remove-console-logs',
      name: 'Remove All Console Logs',
      description: 'Remove all console.log statements',
      keybinding: 'Ctrl+Shift+R',
      handler: () => {
        const editor = api.getActiveEditor();
        if (editor) {
          const cleaned = editor.content.replace(/console\.log\(.*?\);?\n?/g, '');
          api.updateEditor(cleaned);
          api.showNotification('Console logs removed', 'success');
        }
      },
    });

    // Register status bar item
    api.registerStatusBarItem({
      id: 'ts-version',
      text: 'TS v5.0',
      tooltip: 'TypeScript version',
      alignment: 'right',
      priority: 90,
      onClick: () => {
        api.showNotification('TypeScript 5.0.0 Active', 'info');
      },
    });

    api.registerStatusBarItem({
      id: 'ts-strict-mode',
      text: '⚡ Strict',
      tooltip: 'Strict mode enabled',
      alignment: 'right',
      priority: 85,
      onClick: () => {
        api.showNotification('TypeScript strict mode is enabled', 'info');
      },
    });
  },

  deactivate: () => {
    console.log('Advanced TypeScript Plugin deactivated');
  },

  // Contributions are auto-registered by the plugin manager
  contributes: {
    languages: [typescriptProLanguage],
    themes: [draculaTheme],
  },
};

// Helper function to generate TypeScript interfaces from JSON
function generateInterfaceFromJSON(obj: any, name: string, indent: number = 0): string {
  const indentStr = '  '.repeat(indent);
  let result = `${indentStr}interface ${name} {\n`;

  for (const [key, value] of Object.entries(obj)) {
    const type = getTypeScriptType(value);
    result += `${indentStr}  ${key}: ${type};\n`;
  }

  result += `${indentStr}}\n`;
  return result;
}

function getTypeScriptType(value: any): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'any[]';
    return `${getTypeScriptType(value[0])}[]`;
  }

  const type = typeof value;
  if (type === 'object') {
    return '{\n' + Object.entries(value)
      .map(([k, v]) => `    ${k}: ${getTypeScriptType(v)};`)
      .join('\n') + '\n  }';
  }

  return type;
}

// ==================== EXAMPLE: MARKDOWN PLUGIN ====================

export const markdownPlugin: Plugin = {
  id: 'markdown-support',
  name: 'Markdown Support',
  version: '1.0.0',
  description: 'Adds Markdown language support',
  author: 'CodeLab Team',

  activate: (api: PluginAPI) => {
    api.registerLanguage({
      id: 'markdown',
      name: 'Markdown',
      extensions: ['md', 'markdown'],
      tokenizer: {
        headings: /^#+\s.+$/gm,
        bold: /\*\*([^*]+)\*\*/g,
        italic: /\*([^*]+)\*/g,
        code: /`([^`]+)`/g,
        links: /\[([^\]]+)\]\(([^)]+)\)/g,
        lists: /^[\s]*[-*+]\s/gm,
      },
      autocomplete: ['# ', '## ', '### ', '**bold**', '*italic*', '[link](url)', '- list item'],
    });

    api.registerCommand({
      id: 'md-preview',
      name: 'Preview Markdown',
      description: 'Open Markdown preview',
      keybinding: 'Ctrl+Shift+V',
      handler: () => {
        api.showNotification('Markdown preview would open here', 'info');
      },
    });

    api.showNotification('Markdown plugin loaded!', 'success');
  },
};

// ==================== EXAMPLE: PYTHON PLUGIN ====================

export const pythonPlugin: Plugin = {
  id: 'python-support',
  name: 'Python Support',
  version: '1.0.0',
  description: 'Enhanced Python language support',
  author: 'CodeLab Team',

  activate: (api: PluginAPI) => {
    api.registerLanguage({
      id: 'python',
      name: 'Python',
      extensions: ['py', 'pyw', 'pyi'],
      tokenizer: {
        keywords: /\b(False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/g,
        strings: /(["'])(?:(?=(\\?))\2.)*?\1/g,
        comments: /#.*$/gm,
        numbers: /\b\d+\.?\d*\b/g,
        functions: /\b([a-zA-Z_][\w]*)\s*(?=\()/g,
        decorators: /@\w+/g,
      },
      autocomplete: [
        'def', 'class', 'if', 'else', 'elif', 'for', 'while', 'try', 'except',
        'import', 'from', 'return', 'yield', 'async', 'await', 'lambda',
        'print', 'range', 'len', 'str', 'int', 'float', 'list', 'dict',
      ],
    });

    api.registerCommand({
      id: 'python-run',
      name: 'Run Python File',
      description: 'Execute current Python file',
      keybinding: 'F5',
      handler: () => {
        api.showNotification('Python execution would start here', 'info');
      },
    });
  },
};

// ==================== EXPORT ALL PLUGINS ====================

export const examplePlugins = [
  advancedTypeScriptPlugin,
  markdownPlugin,
  pythonPlugin,
];
