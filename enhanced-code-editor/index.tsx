import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Code,
  Save,
  FolderOpen,
  Plus,
  X,
  Check,
  WrapText,
  CheckSquare,
  Wand2,
  FileCode,
  FileJson,
  FileText,
  Terminal,
  Paintbrush,
  File,
  Hash,
  Clock,
  Settings,
  Search,
  Command,
  ChevronRight,
  ChevronDown,
  GitBranch,
  Bell,
  Cpu,
  Layout,
  Palette,
  Zap,
  Download,
  Upload,
  Eye,
  EyeOff,
  Grid,
  List,
  Moon,
  Sun,
  Copy,
  Scissors,
  ClipboardPaste,
  Undo,
  Redo,
  Type,
  Maximize2,
  Minimize2,
  SplitSquareVertical,
  Info,
} from "lucide-react";
import "./editor-styles.css";

// ==================== PLUGIN API SYSTEM ====================
interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  activate: (api: PluginAPI) => void;
  deactivate?: () => void;
  contributes?: {
    languages?: LanguageDefinition[];
    themes?: ThemeDefinition[];
    commands?: CommandDefinition[];
    statusBarItems?: StatusBarItem[];
  };
}

interface PluginAPI {
  registerLanguage: (lang: LanguageDefinition) => void;
  registerTheme: (theme: ThemeDefinition) => void;
  registerCommand: (command: CommandDefinition) => void;
  registerStatusBarItem: (item: StatusBarItem) => void;
  showNotification: (
    message: string,
    type?: "info" | "success" | "error" | "warning",
  ) => void;
  getActiveEditor: () => EditorState | null;
  updateEditor: (content: string) => void;
}

interface LanguageDefinition {
  id: string;
  name: string;
  extensions: string[];
  tokenizer: {
    [key: string]: RegExp;
  };
  autocomplete?: string[];
}

interface ThemeDefinition {
  id: string;
  name: string;
  type: "light" | "dark";
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    success: string;
    error: string;
    warning: string;
    menuHover: string;
    keyword: string;
    string: string;
    comment: string;
    function: string;
    number: string;
    [key: string]: string;
  };
}

interface CommandDefinition {
  id: string;
  name: string;
  description: string;
  keybinding?: string;
  handler: () => void;
}

interface StatusBarItem {
  id: string;
  text: string;
  tooltip?: string;
  icon?: React.ComponentType<any>;
  alignment: "left" | "right";
  priority: number;
  onClick?: () => void;
}

interface EditorState {
  id: number;
  name: string;
  content: string;
  language: string;
  hasUnsavedChanges: boolean;
}

// ==================== BUILT-IN LANGUAGES ====================
const builtInLanguages: { [key: string]: LanguageDefinition } = {
  javascript: {
    id: "javascript",
    name: "JavaScript",
    extensions: ["js", "jsx", "mjs"],
    tokenizer: {
      keywords:
        /\b(const|let|var|function|return|if|else|for|while|class|extends|import|export|from|async|await|try|catch|throw|new|this|super|static|get|set|switch|case|break|continue|default|typeof|instanceof|in|of|do|yield|delete|void)\b/g,
      strings: /(["'`])(?:(?=(\\?))\2.)*?\1/g,
      comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
      numbers: /\b\d+\.?\d*\b/g,
      functions: /\b([a-zA-Z_$][\w$]*)\s*(?=\()/g,
    },
    autocomplete: [
      "console.log",
      "function",
      "const",
      "let",
      "return",
      "import",
      "export",
      "async",
      "await",
    ],
  },
  typescript: {
    id: "typescript",
    name: "TypeScript",
    extensions: ["ts", "tsx"],
    tokenizer: {
      keywords:
        /\b(const|let|var|function|return|if|else|for|while|class|extends|import|export|from|async|await|try|catch|throw|new|this|super|static|interface|type|enum|namespace|declare|public|private|protected|readonly|abstract|as|is)\b/g,
      strings: /(["'`])(?:(?=(\\?))\2.)*?\1/g,
      comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
      numbers: /\b\d+\.?\d*\b/g,
      types:
        /\b(string|number|boolean|any|void|never|unknown|object|null|undefined|Array|Promise|Set|Map)\b/g,
    },
    autocomplete: [
      "interface",
      "type",
      "enum",
      "namespace",
      "public",
      "private",
      "protected",
    ],
  },
  html: {
    id: "html",
    name: "HTML",
    extensions: ["html", "htm"],
    tokenizer: {
      tags: /<\/?[\w\s="/.':;#-\/]+>/g,
      attributes: /\s[\w-]+=["'][^"']*["']/g,
      comments: /<!--[\s\S]*?-->/g,
    },
    autocomplete: [
      "div",
      "span",
      "p",
      "a",
      "img",
      "button",
      "input",
      "h1",
      "h2",
      "h3",
    ],
  },
  css: {
    id: "css",
    name: "CSS",
    extensions: ["css", "scss"],
    tokenizer: {
      selectors: /^[\s]*[.#]?[\w-]+(?=\s*\{)/gm,
      properties: /[\w-]+(?=\s*:)/g,
      values: /:\s*[^;{]+/g,
      comments: /\/\*[\s\S]*?\*\//g,
    },
    autocomplete: [
      "display",
      "position",
      "width",
      "height",
      "margin",
      "padding",
      "background",
      "color",
    ],
  },
};

// ==================== BUILT-IN THEMES ====================
const builtInThemes: { [key: string]: ThemeDefinition } = {
  cyberpunk: {
    id: "cyberpunk",
    name: "Cyberpunk Night",
    type: "dark",
    colors: {
      background: "#0a0e27",
      surface: "#141b3a",
      surfaceAlt: "#1f2847",
      text: "#e0e7ff",
      textSecondary: "#8b92b8",
      border: "#2d3a5f",
      primary: "#00f0ff",
      success: "#00ff9f",
      error: "#ff0055",
      warning: "#ffaa00",
      menuHover: "#252e52",
      keyword: "#ff006e",
      string: "#00f5d4",
      comment: "#5a6488",
      function: "#ffbe0b",
      number: "#a855f7",
    },
  },
  sunrise: {
    id: "sunrise",
    name: "Warm Sunrise",
    type: "light",
    colors: {
      background: "#fff9f0",
      surface: "#ffffff",
      surfaceAlt: "#fef3e8",
      text: "#2d1b0e",
      textSecondary: "#7a6556",
      border: "#e8d5c4",
      primary: "#ff6b35",
      success: "#52b788",
      error: "#d62828",
      warning: "#f77f00",
      menuHover: "#ffe5d4",
      keyword: "#c1121f",
      string: "#2a9d8f",
      comment: "#9c8578",
      function: "#fb8500",
      number: "#9d4edd",
    },
  },
  midnight: {
    id: "midnight",
    name: "Deep Midnight",
    type: "dark",
    colors: {
      background: "#0d1117",
      surface: "#161b22",
      surfaceAlt: "#21262d",
      text: "#c9d1d9",
      textSecondary: "#8b949e",
      border: "#30363d",
      primary: "#58a6ff",
      success: "#3fb950",
      error: "#f85149",
      warning: "#d29922",
      menuHover: "#2d333b",
      keyword: "#ff7b72",
      string: "#a5d6ff",
      comment: "#8b949e",
      function: "#d2a8ff",
      number: "#79c0ff",
    },
  },
};

// ==================== PLUGIN MANAGER ====================
class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private api: PluginAPI;

  constructor(api: PluginAPI) {
    this.api = api;
  }

  registerPlugin(plugin: Plugin) {
    this.plugins.set(plugin.id, plugin);
    plugin.activate(this.api);

    // Auto-register contributions
    if (plugin.contributes) {
      plugin.contributes.languages?.forEach(lang =>
        this.api.registerLanguage(lang),
      );
      plugin.contributes.themes?.forEach(theme =>
        this.api.registerTheme(theme),
      );
      plugin.contributes.commands?.forEach(cmd =>
        this.api.registerCommand(cmd),
      );
      plugin.contributes.statusBarItems?.forEach(item =>
        this.api.registerStatusBarItem(item),
      );
    }
  }

  unregisterPlugin(pluginId: string) {
    const plugin = this.plugins.get(pluginId);
    if (plugin?.deactivate) {
      plugin.deactivate();
    }
    this.plugins.delete(pluginId);
  }

  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }
}

// ==================== MAIN EDITOR COMPONENT ====================
const EnhancedCodeEditor: React.FC = () => {
  // State Management
  const [tabs, setTabs] = useState<EditorState[]>([
    {
      id: 1,
      name: "welcome.js",
      content:
        '// Welcome to Enhanced Code Editor\n// Press Ctrl+Shift+P to open command palette\n\nfunction greet() {\n  console.log("Happy coding!");\n}\n',
      language: "javascript",
      hasUnsavedChanges: false,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [currentTheme, setCurrentTheme] = useState("cyberpunk");
  const [settings, setSettings] = useState({
    wordWrap: true,
    lineNumbers: true,
    minimap: false,
    spellCheck: false,
    autoSave: false,
    fontSize: 14,
    tabSize: 2,
    autoCloseBrackets: true,
    formatOnSave: false,
  });
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: string;
  } | null>(null);
  const [splitView, setSplitView] = useState(false);
  const [secondaryTabId, setSecondaryTabId] = useState<number | null>(null);
  const [commandSearch, setCommandSearch] = useState("");

  // Refs
  const editorRef = useRef<HTMLDivElement>(null);
  const secondaryEditorRef = useRef<HTMLDivElement>(null);
  const nextTabId = useRef(2);
  const pluginManagerRef = useRef<PluginManager | null>(null);

  // State for extensibility
  const [customLanguages, setCustomLanguages] = useState<{
    [key: string]: LanguageDefinition;
  }>({});
  const [customThemes, setCustomThemes] = useState<{
    [key: string]: ThemeDefinition;
  }>({});
  const [customCommands, setCustomCommands] = useState<CommandDefinition[]>([]);
  const [customStatusBarItems, setCustomStatusBarItems] = useState<
    StatusBarItem[]
  >([]);

  // Derived state
  const allLanguages = useMemo(
    () => ({ ...builtInLanguages, ...customLanguages }),
    [customLanguages],
  );
  const allThemes = useMemo(
    () => ({ ...builtInThemes, ...customThemes }),
    [customThemes],
  );
  const theme = allThemes[currentTheme];
  const activeTab = tabs.find(t => t.id === activeTabId);
  const secondaryTab = secondaryTabId
    ? tabs.find(t => t.id === secondaryTabId)
    : null;

  // ==================== PLUGIN API IMPLEMENTATION ====================
  const pluginAPI: PluginAPI = useMemo(
    () => ({
      registerLanguage: (lang: LanguageDefinition) => {
        setCustomLanguages(prev => ({ ...prev, [lang.id]: lang }));
      },
      registerTheme: (theme: ThemeDefinition) => {
        setCustomThemes(prev => ({ ...prev, [theme.id]: theme }));
      },
      registerCommand: (command: CommandDefinition) => {
        setCustomCommands(prev => [...prev, command]);
      },
      registerStatusBarItem: (item: StatusBarItem) => {
        setCustomStatusBarItems(prev => [...prev, item]);
      },
      showNotification: (
        message: string,
        type: "info" | "success" | "error" | "warning" = "info",
      ) => {
        showNotification(message, type);
      },
      getActiveEditor: () => activeTab || null,
      updateEditor: (content: string) => {
        if (activeTab) {
          updateTabContent(activeTab.id, content);
        }
      },
    }),
    [activeTab],
  );

  // Initialize Plugin Manager
  useEffect(() => {
    pluginManagerRef.current = new PluginManager(pluginAPI);

    // Example: Load built-in "prettier" plugin
    const prettierPlugin: Plugin = {
      id: "prettier-formatter",
      name: "Prettier Formatter",
      version: "1.0.0",
      description: "Advanced code formatting",
      author: "Built-in",
      activate: api => {
        api.registerCommand({
          id: "format-document-advanced",
          name: "Format Document (Advanced)",
          description: "Format code with advanced rules",
          keybinding: "Ctrl+Shift+F",
          handler: () => formatCodeAdvanced(),
        });
      },
    };

    pluginManagerRef.current.registerPlugin(prettierPlugin);
  }, [pluginAPI]);

  // ==================== NOTIFICATION SYSTEM ====================
  const showNotification = useCallback(
    (message: string, type: string = "info") => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    },
    [],
  );

  // ==================== TAB MANAGEMENT ====================
  const createNewTab = useCallback(() => {
    const newTab: EditorState = {
      id: nextTabId.current++,
      name: `untitled-${nextTabId.current}.js`,
      content: "// Start coding...\n",
      language: "javascript",
      hasUnsavedChanges: false,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    showNotification("New tab created", "success");
  }, [showNotification]);

  const closeTab = useCallback(
    (tabId: number) => {
      if (tabs.length === 1) {
        showNotification("Cannot close last tab", "error");
        return;
      }

      const tabIndex = tabs.findIndex(t => t.id === tabId);
      const newTabs = tabs.filter(t => t.id !== tabId);
      setTabs(newTabs);

      if (activeTabId === tabId) {
        const newActiveIndex = Math.max(0, tabIndex - 1);
        setActiveTabId(newTabs[newActiveIndex].id);
      }
      if (secondaryTabId === tabId) {
        setSecondaryTabId(null);
      }
    },
    [tabs, activeTabId, secondaryTabId, showNotification],
  );

  const updateTabContent = useCallback((tabId: number, content: string) => {
    setTabs(prev =>
      prev.map(tab =>
        tab.id === tabId ? { ...tab, content, hasUnsavedChanges: true } : tab,
      ),
    );
  }, []);

  // ==================== FILE OPERATIONS ====================
  const openFile = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".js,.jsx,.ts,.tsx,.html,.css,.json,.txt";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const content = e.target.result;
          const ext = file.name.split(".").pop()?.toLowerCase() || "";
          let language = "plaintext";
          for (const [langId, langDef] of Object.entries(allLanguages)) {
            if (langDef.extensions.includes(ext)) {
              language = langId;
              break;
            }
          }
          const newTab: EditorState = {
            id: nextTabId.current++,
            name: file.name,
            content,
            language,
            hasUnsavedChanges: false,
          };
          setTabs(prev => [...prev, newTab]);
          setActiveTabId(newTab.id);
          showNotification(`Opened ${file.name}`, "success");
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [allLanguages, showNotification]);

  const saveCurrentTab = useCallback(() => {
    if (!activeTab) return;

    const blob = new Blob([activeTab.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeTab.name;
    a.click();
    URL.revokeObjectURL(url);

    setTabs(prev =>
      prev.map(tab =>
        tab.id === activeTabId ? { ...tab, hasUnsavedChanges: false } : tab,
      ),
    );
    showNotification(`Saved ${activeTab.name}`, "success");
  }, [activeTab, activeTabId, showNotification]);

  // ==================== CODE FORMATTING ====================
  const formatCode = useCallback(() => {
    if (!activeTab) return;

    let formatted = activeTab.content;

    if (activeTab.language === "json") {
      try {
        formatted = JSON.stringify(
          JSON.parse(formatted),
          null,
          settings.tabSize,
        );
      } catch (e) {
        showNotification("Invalid JSON", "error");
        return;
      }
    } else if (
      ["javascript", "typescript", "css"].includes(activeTab.language)
    ) {
      let indent = 0;
      const indentStr = " ".repeat(settings.tabSize);
      formatted = formatted
        .split("\n")
        .map(line => {
          const trimmed = line.trim();
          if (trimmed.startsWith("}") || trimmed.startsWith("]")) {
            indent = Math.max(0, indent - 1);
          }
          const indented = indentStr.repeat(indent) + trimmed;
          if (trimmed.endsWith("{") || trimmed.endsWith("[")) {
            indent++;
          }
          return indented;
        })
        .join("\n");
    }

    if (editorRef.current) {
      editorRef.current.innerText = formatted;
      updateTabContent(activeTabId, formatted);
      showNotification("Code formatted", "success");
    }
  }, [
    activeTab,
    activeTabId,
    settings.tabSize,
    updateTabContent,
    showNotification,
  ]);

  const formatCodeAdvanced = useCallback(() => {
    formatCode();
    showNotification("Advanced formatting applied", "success");
  }, [formatCode, showNotification]);

  // ==================== EDITOR INTERACTIONS ====================
  const handleTextChange = useCallback(
    (editorElement: HTMLDivElement, tabId: number) => {
      const content = editorElement.innerText;
      updateTabContent(tabId, content);
    },
    [updateTabContent],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Command Palette
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
        return;
      }

      // Save
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        saveCurrentTab();
        return;
      }

      // New Tab
      if (e.ctrlKey && e.key === "t") {
        e.preventDefault();
        createNewTab();
        return;
      }

      // Format
      if (e.ctrlKey && e.shiftKey && e.key === "F") {
        e.preventDefault();
        formatCode();
        return;
      }

      // Auto-close brackets
      if (settings.autoCloseBrackets) {
        const bracketPairs: { [key: string]: string } = {
          "(": ")",
          "[": "]",
          "{": "}",
          '"': '"',
          "'": "'",
          "`": "`",
        };

        if (bracketPairs[e.key]) {
          e.preventDefault();
          document.execCommand(
            "insertText",
            false,
            e.key + bracketPairs[e.key],
          );
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.setStart(range.startContainer, range.startOffset - 1);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          return;
        }
      }

      // Tab indentation
      if (e.key === "Tab") {
        e.preventDefault();
        document.execCommand("insertText", false, " ".repeat(settings.tabSize));
      }
    },
    [settings, saveCurrentTab, createNewTab, formatCode],
  );

  // ==================== COMMAND PALETTE ====================
  const allCommands = useMemo(() => {
    const builtIn: CommandDefinition[] = [
      {
        id: "new-file",
        name: "New File",
        description: "Create a new file",
        keybinding: "Ctrl+T",
        handler: createNewTab,
      },
      {
        id: "open-file",
        name: "Open File",
        description: "Open an existing file",
        keybinding: "Ctrl+O",
        handler: openFile,
      },
      {
        id: "save-file",
        name: "Save File",
        description: "Save current file",
        keybinding: "Ctrl+S",
        handler: saveCurrentTab,
      },
      {
        id: "format-document",
        name: "Format Document",
        description: "Format the current document",
        keybinding: "Ctrl+Shift+F",
        handler: formatCode,
      },
      {
        id: "toggle-split",
        name: "Toggle Split View",
        description: "Enable/disable split view",
        handler: () => setSplitView(prev => !prev),
      },
      {
        id: "settings",
        name: "Open Settings",
        description: "Open settings panel",
        handler: () => setShowSettings(true),
      },
      {
        id: "change-theme",
        name: "Change Theme",
        description: "Switch editor theme",
        handler: () => {},
      },
    ];
    return [...builtIn, ...customCommands];
  }, [customCommands, createNewTab, openFile, saveCurrentTab, formatCode]);

  const filteredCommands = useMemo(() => {
    if (!commandSearch) return allCommands;
    const search = commandSearch.toLowerCase();
    return allCommands.filter(
      cmd =>
        cmd.name.toLowerCase().includes(search) ||
        cmd.description.toLowerCase().includes(search),
    );
  }, [allCommands, commandSearch]);

  const executeCommand = useCallback((command: CommandDefinition) => {
    command.handler();
    setShowCommandPalette(false);
    setCommandSearch("");
  }, []);

  // ==================== SPLIT VIEW ====================
  const toggleSplitView = useCallback(() => {
    setSplitView(prev => {
      const newState = !prev;
      if (newState && !secondaryTabId && tabs.length > 1) {
        const otherTab = tabs.find(t => t.id !== activeTabId);
        setSecondaryTabId(otherTab?.id || null);
      } else if (!newState) {
        setSecondaryTabId(null);
      }
      return newState;
    });
  }, [secondaryTabId, tabs, activeTabId]);

  // ==================== KEYBOARD SHORTCUTS ====================
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // ==================== SYNC EDITOR CONTENT ====================
  useEffect(() => {
    if (editorRef.current && activeTab) {
      editorRef.current.innerText = activeTab.content;
    }
  }, [activeTabId]);

  useEffect(() => {
    if (secondaryEditorRef.current && secondaryTab) {
      secondaryEditorRef.current.innerText = secondaryTab.content;
    }
  }, [secondaryTabId]);

  // ==================== RENDER ====================
  return (
    <div
      className="editor-container"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Menu Bar */}
      <MenuBar
        theme={theme}
        showMenuDropdown={showMenuDropdown}
        setShowMenuDropdown={setShowMenuDropdown}
        openFile={openFile}
        saveCurrentTab={saveCurrentTab}
        createNewTab={createNewTab}
        formatCode={formatCode}
        toggleSplitView={toggleSplitView}
        setShowSettings={setShowSettings}
        settings={settings}
        setSettings={setSettings}
      />

      {/* Tab Bar */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        setActiveTabId={setActiveTabId}
        closeTab={closeTab}
        createNewTab={createNewTab}
        theme={theme}
      />

      {/* Editor Area */}
      <div className="editor-area">
        <EditorPane
          ref={editorRef}
          tab={activeTab}
          theme={theme}
          settings={settings}
          handleTextChange={e => handleTextChange(e, activeTabId)}
          handleKeyDown={handleKeyDown}
        />

        {splitView && secondaryTab && (
          <>
            <div
              className="split-divider"
              style={{ backgroundColor: theme.colors.border }}
            />
            <EditorPane
              ref={secondaryEditorRef}
              tab={secondaryTab}
              theme={theme}
              settings={settings}
              handleTextChange={e => handleTextChange(e, secondaryTab.id)}
              handleKeyDown={handleKeyDown}
            />
          </>
        )}
      </div>

      {/* Status Bar */}
      <StatusBar
        tab={activeTab}
        theme={theme}
        customItems={customStatusBarItems}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        allThemes={allThemes}
      />

      {/* Command Palette */}
      {showCommandPalette && (
        <CommandPalette
          theme={theme}
          commands={filteredCommands}
          commandSearch={commandSearch}
          setCommandSearch={setCommandSearch}
          executeCommand={executeCommand}
          onClose={() => setShowCommandPalette(false)}
        />
      )}

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          theme={theme}
          settings={settings}
          setSettings={setSettings}
          allThemes={allThemes}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Notifications */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          theme={theme}
        />
      )}
    </div>
  );
};

// ==================== SUB-COMPONENTS ====================

// Menu Bar Component
const MenuBar: React.FC<any> = ({
  theme,
  showMenuDropdown,
  setShowMenuDropdown,
  openFile,
  saveCurrentTab,
  createNewTab,
  formatCode,
  toggleSplitView,
  setShowSettings,
  settings,
  setSettings,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenuDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowMenuDropdown]);

  const menus = [
    {
      name: "File",
      items: [
        {
          label: "New File",
          icon: Plus,
          shortcut: "Ctrl+T",
          action: createNewTab,
        },
        {
          label: "Open File",
          icon: FolderOpen,
          shortcut: "Ctrl+O",
          action: openFile,
        },
        {
          label: "Save",
          icon: Save,
          shortcut: "Ctrl+S",
          action: saveCurrentTab,
        },
        { label: "Save As...", icon: Download, action: saveCurrentTab },
      ],
    },
    {
      name: "Edit",
      items: [
        {
          label: "Undo",
          icon: Undo,
          shortcut: "Ctrl+Z",
          action: () => document.execCommand("undo"),
        },
        {
          label: "Redo",
          icon: Redo,
          shortcut: "Ctrl+Y",
          action: () => document.execCommand("redo"),
        },
        {
          label: "Cut",
          icon: Scissors,
          shortcut: "Ctrl+X",
          action: () => document.execCommand("cut"),
        },
        {
          label: "Copy",
          icon: Copy,
          shortcut: "Ctrl+C",
          action: () => document.execCommand("copy"),
        },
        {
          label: "Paste",
          icon: ClipboardPaste,
          shortcut: "Ctrl+V",
          action: () => document.execCommand("paste"),
        },
        {
          label: "Format Document",
          icon: Wand2,
          shortcut: "Ctrl+Shift+F",
          action: formatCode,
        },
      ],
    },
    {
      name: "View",
      items: [
        {
          label: "Toggle Split View",
          icon: SplitSquareVertical,
          action: toggleSplitView,
        },
        {
          label: "Toggle Line Numbers",
          icon: Hash,
          action: () =>
            setSettings((prev: any) => ({
              ...prev,
              lineNumbers: !prev.lineNumbers,
            })),
        },
        {
          label: "Toggle Word Wrap",
          icon: WrapText,
          action: () =>
            setSettings((prev: any) => ({ ...prev, wordWrap: !prev.wordWrap })),
        },
        {
          label: "Command Palette",
          icon: Command,
          shortcut: "Ctrl+Shift+P",
          action: () => {},
        },
      ],
    },
    {
      name: "Settings",
      items: [
        {
          label: "Preferences",
          icon: Settings,
          action: () => setShowSettings(true),
        },
        { label: "Themes", icon: Palette, action: () => setShowSettings(true) },
        { label: "Extensions", icon: Zap, action: () => setShowSettings(true) },
      ],
    },
  ];

  return (
    <div
      className="menu-bar"
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
      }}
      ref={menuRef}
    >
      <div className="menu-left">
        <Code className="menu-logo" style={{ color: theme.colors.primary }} />
        <span className="menu-title" style={{ color: theme.colors.text }}>
          CodeLab Pro
        </span>
      </div>

      <div className="menu-center">
        {menus.map(menu => (
          <div key={menu.name} className="menu-item-wrapper">
            <button
              className="menu-button"
              style={{
                color:
                  showMenuDropdown === menu.name
                    ? theme.colors.primary
                    : theme.colors.text,
                backgroundColor:
                  showMenuDropdown === menu.name
                    ? theme.colors.menuHover
                    : "transparent",
              }}
              onClick={() =>
                setShowMenuDropdown(
                  showMenuDropdown === menu.name ? null : menu.name,
                )
              }
            >
              {menu.name}
              <ChevronDown className="menu-chevron" size={14} />
            </button>

            {showMenuDropdown === menu.name && (
              <div
                className="menu-dropdown"
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }}
              >
                {menu.items.map((item, idx) => (
                  <button
                    key={idx}
                    className="menu-dropdown-item"
                    style={{ color: theme.colors.text }}
                    onClick={() => {
                      item.action();
                      setShowMenuDropdown(null);
                    }}
                  >
                    {item.icon && <item.icon size={16} />}
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span
                        className="menu-shortcut"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="menu-right">
        <button
          className="menu-icon-button"
          style={{ color: theme.colors.textSecondary }}
          title="Notifications"
        >
          <Bell size={16} />
        </button>
        <button
          className="menu-icon-button"
          style={{ color: theme.colors.textSecondary }}
          onClick={() => setShowSettings(true)}
          title="Settings"
        >
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};

// Tab Bar Component
const TabBar: React.FC<any> = ({
  tabs,
  activeTabId,
  setActiveTabId,
  closeTab,
  createNewTab,
  theme,
}) => {
  return (
    <div
      className="tab-bar"
      style={{
        backgroundColor: theme.colors.surfaceAlt,
        borderColor: theme.colors.border,
      }}
    >
      <div className="tab-list">
        {tabs.map((tab: EditorState) => (
          <div
            key={tab.id}
            className={`tab ${tab.id === activeTabId ? "tab-active" : ""}`}
            style={{
              backgroundColor:
                tab.id === activeTabId ? theme.colors.surface : "transparent",
              borderColor: theme.colors.border,
              color: theme.colors.text,
            }}
            onClick={() => setActiveTabId(tab.id)}
          >
            <FileCode size={14} />
            <span className="tab-name">{tab.name}</span>
            {tab.hasUnsavedChanges && (
              <div
                className="tab-dot"
                style={{ backgroundColor: theme.colors.primary }}
              />
            )}
            <button
              className="tab-close"
              style={{ color: theme.colors.textSecondary }}
              onClick={e => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              <X size={14} />
            </button>
            {tab.id === activeTabId && (
              <div
                className="tab-indicator"
                style={{ backgroundColor: theme.colors.primary }}
              />
            )}
          </div>
        ))}
      </div>
      <button
        className="tab-new"
        style={{ color: theme.colors.textSecondary }}
        onClick={createNewTab}
        title="New Tab"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

// Editor Pane Component
const EditorPane = React.forwardRef<HTMLDivElement, any>(
  ({ tab, theme, settings, handleTextChange, handleKeyDown }, ref) => {
    if (!tab) return null;

    const lineCount = tab.content.split("\n").length;

    return (
      <div className="editor-pane">
        {settings.lineNumbers && (
          <div
            className="line-numbers"
            style={{
              backgroundColor: theme.colors.surfaceAlt,
              color: theme.colors.textSecondary,
              borderColor: theme.colors.border,
            }}
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="line-number">
                {i + 1}
              </div>
            ))}
          </div>
        )}

        <div className="editor-content-wrapper">
          <div
            ref={ref}
            className="editor-content"
            contentEditable
            spellCheck={settings.spellCheck}
            onInput={e => handleTextChange(e.currentTarget)}
            onKeyDown={handleKeyDown}
            style={{
              color: theme.colors.text,
              fontSize: `${settings.fontSize}px`,
              whiteSpace: settings.wordWrap ? "pre-wrap" : "pre",
              tabSize: settings.tabSize,
            }}
          />
        </div>
      </div>
    );
  },
);

// Status Bar Component
const StatusBar: React.FC<any> = ({
  tab,
  theme,
  customItems,
  currentTheme,
  setCurrentTheme,
  allThemes,
}) => {
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  return (
    <div
      className="status-bar"
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        color: theme.colors.textSecondary,
      }}
    >
      <div className="status-left">
        <div className="status-item" title="Language">
          <FileCode size={12} />
          <span>{tab?.language.toUpperCase() || "PLAIN"}</span>
        </div>
        <div className="status-item" title="Lines">
          <Hash size={12} />
          <span>{tab?.content.split("\n").length || 0} lines</span>
        </div>
        <div className="status-item" title="Characters">
          <Type size={12} />
          <span>{tab?.content.length || 0} chars</span>
        </div>
        <div className="status-item" title="Git Branch">
          <GitBranch size={12} />
          <span>main</span>
        </div>
      </div>

      <div className="status-right">
        {customItems.map((item: StatusBarItem) => (
          <div
            key={item.id}
            className="status-item status-clickable"
            onClick={item.onClick}
            title={item.tooltip}
          >
            {item.icon && <item.icon size={12} />}
            <span>{item.text}</span>
          </div>
        ))}

        <div
          className="status-item status-clickable"
          onClick={() => setShowThemeSelector(!showThemeSelector)}
          title="Change Theme"
        >
          <Palette size={12} />
          <span>{theme.name}</span>
        </div>

        {showThemeSelector && (
          <div
            className="theme-selector"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }}
          >
            {Object.values(allThemes).map((t: ThemeDefinition) => (
              <div
                key={t.id}
                className="theme-option"
                style={{
                  color:
                    currentTheme === t.id
                      ? theme.colors.primary
                      : theme.colors.text,
                  backgroundColor:
                    currentTheme === t.id
                      ? theme.colors.menuHover
                      : "transparent",
                }}
                onClick={() => {
                  setCurrentTheme(t.id);
                  setShowThemeSelector(false);
                }}
              >
                <div
                  className="theme-preview"
                  style={{ backgroundColor: t.colors.primary }}
                />
                <span>{t.name}</span>
                {currentTheme === t.id && <Check size={14} />}
              </div>
            ))}
          </div>
        )}

        <div className="status-item" title="Encoding">
          <span>UTF-8</span>
        </div>
        <div className="status-item" title="Line Ending">
          <span>LF</span>
        </div>
      </div>
    </div>
  );
};

// Command Palette Component
const CommandPalette: React.FC<any> = ({
  theme,
  commands,
  commandSearch,
  setCommandSearch,
  executeCommand,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, commands.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (commands[selectedIndex]) {
          executeCommand(commands[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commands, selectedIndex, executeCommand, onClose]);

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div
        className="command-palette"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="command-palette-header"
          style={{ borderColor: theme.colors.border }}
        >
          <Search size={18} style={{ color: theme.colors.textSecondary }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={commandSearch}
            onChange={e => setCommandSearch(e.target.value)}
            style={{ color: theme.colors.text, backgroundColor: "transparent" }}
          />
        </div>

        <div className="command-palette-list">
          {commands.map((cmd: CommandDefinition, idx: number) => (
            <div
              key={cmd.id}
              className={`command-palette-item ${idx === selectedIndex ? "selected" : ""}`}
              style={{
                backgroundColor:
                  idx === selectedIndex
                    ? theme.colors.menuHover
                    : "transparent",
                color: theme.colors.text,
              }}
              onClick={() => executeCommand(cmd)}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <div className="command-info">
                <Command size={14} style={{ color: theme.colors.primary }} />
                <div>
                  <div className="command-name">{cmd.name}</div>
                  <div
                    className="command-description"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {cmd.description}
                  </div>
                </div>
              </div>
              {cmd.keybinding && (
                <div
                  className="command-keybinding"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {cmd.keybinding}
                </div>
              )}
            </div>
          ))}

          {commands.length === 0 && (
            <div
              className="command-palette-empty"
              style={{ color: theme.colors.textSecondary }}
            >
              No commands found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Settings Panel Component
const pkg = import("../package.json");
const SettingsPanel: React.FC<any> = ({
  theme,
  settings,
  setSettings,
  allThemes,
  currentTheme,
  setCurrentTheme,
  onClose,
}) => {
  const categories = [
    {
      name: "Editor",
      icon: Code,
      settings: [
        {
          key: "fontSize",
          label: "Font Size",
          type: "number",
          min: 10,
          max: 24,
        },
        { key: "tabSize", label: "Tab Size", type: "number", min: 2, max: 8 },
        { key: "lineNumbers", label: "Line Numbers", type: "boolean" },
        { key: "wordWrap", label: "Word Wrap", type: "boolean" },
        { key: "minimap", label: "Minimap", type: "boolean" },
        {
          key: "autoCloseBrackets",
          label: "Auto Close Brackets",
          type: "boolean",
        },
      ],
    },
    {
      name: "Appearance",
      icon: Palette,
      settings: [
        {
          key: "theme",
          label: "Theme",
          type: "select",
          options: Object.values(allThemes).map((t: ThemeDefinition) => ({
            value: t.id,
            label: t.name,
          })),
        },
      ],
    },
    {
      name: "Files",
      icon: File,
      settings: [
        { key: "autoSave", label: "Auto Save", type: "boolean" },
        { key: "formatOnSave", label: "Format On Save", type: "boolean" },
      ],
    },
    {
      name: "About",
      icon: Info,
      settings: [
        { key: "version", label: "Version", type: "text" },
        { key: "author", label: "Author: Involvex", type: "text" },
        {
          key: "repo",
          label:
            "Repository: " + (pkg.then(p => p.repository.url.toString()) || ""),
          type: "text",
        },
      ],
    },
  ];

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div
        className="settings-panel glass-panel"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="settings-header"
          style={{ borderColor: theme.colors.border }}
        >
          <div className="settings-title" style={{ color: theme.colors.text }}>
            <Settings size={20} />
            <h2>Settings</h2>
          </div>
          <button
            className="settings-close"
            onClick={onClose}
            style={{ color: theme.colors.textSecondary }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="settings-content">
          {categories.map(category => (
            <div key={category.name} className="settings-category">
              <div
                className="settings-category-header"
                style={{ color: theme.colors.text }}
              >
                <category.icon size={18} />
                <h3>{category.name}</h3>
              </div>

              <div className="settings-category-items">
                {category.settings.map(setting => (
                  <div key={setting.key} className="settings-item">
                    <label
                      className="settings-label"
                      style={{ color: theme.colors.text }}
                    >
                      {setting.label}
                    </label>

                    {setting.type === "boolean" && (
                      <label className="settings-toggle">
                        <input
                          type="checkbox"
                          checked={settings[setting.key]}
                          onChange={e =>
                            setSettings((prev: any) => ({
                              ...prev,
                              [setting.key]: e.target.checked,
                            }))
                          }
                        />
                        <span
                          className="settings-toggle-slider"
                          style={{
                            backgroundColor: settings[setting.key]
                              ? theme.colors.primary
                              : theme.colors.border,
                          }}
                        />
                      </label>
                    )}

                    {setting.type === "number" && (
                      <input
                        type="number"
                        value={settings[setting.key]}
                        min={setting.min}
                        max={setting.max}
                        onChange={e =>
                          setSettings((prev: any) => ({
                            ...prev,
                            [setting.key]: parseInt(e.target.value),
                          }))
                        }
                        className="settings-input"
                        style={{
                          backgroundColor: theme.colors.surfaceAlt,
                          color: theme.colors.text,
                          borderColor: theme.colors.border,
                        }}
                      />
                    )}

                    {setting.type === "select" && setting.key === "theme" && (
                      <select
                        value={currentTheme}
                        onChange={e => setCurrentTheme(e.target.value)}
                        className="settings-select"
                        style={{
                          backgroundColor: theme.colors.surfaceAlt,
                          color: theme.colors.text,
                          borderColor: theme.colors.border,
                        }}
                      >
                        {setting.options?.map((opt: any) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                    {setting.type === "text" && setting.key === "info" && (
                      <div>
                        <span>{setting.label}</span>
                        <span>{setting.value}</span>
                        <span>{setting.description}</span>
                        <span>{setting.version}</span>
                        <span>{setting.author}</span>
                        <span>{setting.license}</span>
                        <span>{setting.repository}</span>
                        <span>{setting.homepage}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Notification Component
const Notification: React.FC<any> = ({ message, type, theme }) => {
  const colors = {
    success: theme.colors.success,
    error: theme.colors.error,
    warning: theme.colors.warning,
    info: theme.colors.primary,
  };

  return (
    <div
      className="notification"
      style={{ backgroundColor: colors[type as keyof typeof colors] }}
    >
      <Check size={16} />
      <span>{message}</span>
    </div>
  );
};

export default EnhancedCodeEditor;

// Export types for plugin development
export type {
  Plugin,
  PluginAPI,
  LanguageDefinition,
  ThemeDefinition,
  CommandDefinition,
  StatusBarItem,
  EditorState,
};

// Export PluginManager class
export { PluginManager };
