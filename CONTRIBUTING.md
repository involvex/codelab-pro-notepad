# Contributing to CodeLab Pro Notepad

First off, thank you for considering contributing to CodeLab Pro Notepad! It's people like you that make this project better for everyone.

## 🌟 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
**Description:**
A clear and concise description of the bug.

**To Reproduce:**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What you expected to happen.

**Screenshots:**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11, macOS 14, Ubuntu 22.04]
- Bun Version: [e.g., 1.0.20]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

**Additional Context:**
Any other context about the problem.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

**Feature Request Template:**

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like:**
A clear description of what you want to happen.

**Describe alternatives you've considered:**
Alternative solutions or features you've considered.

**Additional context:**
Any other context or screenshots.
```

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the code style** - Use Prettier and ESLint
3. **Write clear commit messages** - Follow conventional commits
4. **Add tests** if applicable
5. **Update documentation** for any changes
6. **Run all checks** before submitting

## 🔧 Development Setup

### Prerequisites

- [Bun](https://bun.sh) >= 1.0.0
- Git
- A code editor (VS Code recommended)

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/codelab-pro-notepad.git
cd codelab-pro-notepad

# Install dependencies
bun install

# Start development server
bun run dev

# In another terminal, run type checking
bun run typecheck --watch
```

### Development Workflow

1. **Create a branch:**
   ```bash
   git checkout -b feature/my-feature
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes:**
   - Write clean, readable code
   - Follow existing patterns and conventions
   - Add comments for complex logic

3. **Test your changes:**
   ```bash
   # Type checking
   bun run typecheck

   # Linting
   bun run lint

   # Fix linting issues
   bun run lint:fix

   # Format code
   bun run format

   # Build to ensure no errors
   bun run build
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork:**
   ```bash
   git push origin feature/my-feature
   ```

6. **Open a Pull Request**

## 📝 Code Style

### TypeScript/React

- Use **functional components** with hooks
- Use **TypeScript** for type safety
- Prefer **const** over let, avoid var
- Use **arrow functions** for consistency
- Use **destructuring** where appropriate
- Keep components **small and focused**

**Good Example:**

```typescript
import { useState, useCallback } from 'react';

interface Props {
  title: string;
  onSave: (content: string) => void;
}

export const Editor: React.FC<Props> = ({ title, onSave }) => {
  const [content, setContent] = useState('');

  const handleSave = useCallback(() => {
    onSave(content);
  }, [content, onSave]);

  return (
    <div className="editor">
      <h1>{title}</h1>
      <textarea value={content} onChange={e => setContent(e.target.value)} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};
```

### CSS

- Use **meaningful class names**
- Follow **BEM-like naming** for complex components
- Group related properties
- Use **CSS variables** for theming
- Mobile-first responsive design

**Example:**

```css
.editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.editor__header {
  padding: 1rem;
  background: var(--bg-header);
}

.editor__content {
  flex: 1;
  overflow: auto;
}
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat: add syntax highlighting for Rust
fix: resolve tab closing bug
docs: update plugin API documentation
style: format code with prettier
refactor: extract theme logic to separate module
perf: optimize rendering for large files
chore: update dependencies
```

## 🔌 Plugin Development

### Creating a Plugin

Plugins should follow this structure:

```typescript
import type { Plugin, PluginAPI } from '../enhanced-code-editor/index';

export const myPlugin: Plugin = {
  id: 'unique-plugin-id',
  name: 'Human Readable Name',
  version: '1.0.0',
  description: 'Clear description of what the plugin does',
  author: 'Your Name',

  activate: (api: PluginAPI) => {
    // Plugin initialization
    // Register languages, themes, commands, etc.
  },

  deactivate: () => {
    // Cleanup resources
  },

  contributes: {
    languages: [/* language definitions */],
    themes: [/* theme definitions */],
    commands: [/* command definitions */],
    statusBarItems: [/* status bar items */],
  }
};
```

### Plugin Guidelines

1. **Single Responsibility** - Each plugin should do one thing well
2. **Clean Activation** - Initialize quickly, defer heavy operations
3. **Proper Cleanup** - Deactivate should remove all side effects
4. **Error Handling** - Don't crash the editor
5. **Documentation** - Provide clear usage instructions

## 🧪 Testing

Currently, the project uses TypeScript and ESLint for compile-time checks. We welcome contributions to add:

- Unit tests (Jest/Vitest)
- Integration tests
- E2E tests (Playwright)

## 📚 Documentation

When adding features or making changes:

1. **Update README.md** if user-facing
2. **Update API docs** in `enhanced-code-editor/INTEGRATION.md`
3. **Add JSDoc comments** for public APIs
4. **Update examples** if behavior changes

## 🏗️ Project Structure

```
codelab-pro-notepad/
├── bin/                    # CLI tools
├── enhanced-code-editor/   # Core editor (main component)
├── scripts/               # Build and utility scripts
├── src/                   # Application entry points
│   ├── App.tsx           # Root component
│   ├── index.tsx         # Entry point
│   └── dev-server.tsx    # Dev server
├── .codelabrc.example.json
├── package.json
├── tsconfig.json
└── eslint.config.ts
```

### Key Files

- `enhanced-code-editor/index.tsx` - Main editor component (2500+ lines)
- `bin/codelab.js` - CLI entry point
- `bin/config.js` - Configuration system
- `scripts/serve.ts` - Production server

## 🚫 What NOT to Do

- Don't commit `node_modules/`, `dist/`, or `dev-build/`
- Don't commit `.codelabrc.json` (user config)
- Don't break existing APIs without discussion
- Don't add dependencies without good reason
- Don't skip the pre-commit checks
- Don't use `any` type unless absolutely necessary

## ✅ Pull Request Checklist

Before submitting your PR, verify:

- [ ] Code follows the project's style guidelines
- [ ] TypeScript compilation passes (`bun run typecheck`)
- [ ] Linting passes (`bun run lint`)
- [ ] Code is formatted (`bun run format`)
- [ ] Build succeeds (`bun run build`)
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] PR description clearly describes changes

## 🎯 Good First Issues

Look for issues labeled `good first issue` or `help wanted`. These are great starting points for new contributors.

## 💬 Getting Help

- **GitHub Issues** - For bugs and feature requests
- **Discussions** - For questions and general discussion
- **Code Review** - We review all PRs and provide constructive feedback

## 🙏 Recognition

All contributors will be recognized in our README and release notes. We appreciate every contribution, no matter how small!

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Being respectful and inclusive
- Providing constructive feedback
- Accepting constructive criticism gracefully
- Focusing on what's best for the community

**Unacceptable behavior includes:**
- Harassment, trolling, or derogatory comments
- Publishing others' private information
- Any conduct inappropriate in a professional setting

## 📧 Contact

Questions? Reach out via:
- GitHub Issues
- GitHub Discussions
- Repository: https://github.com/involvex/codelab-pro-notepad

---

**Thank you for contributing to CodeLab Pro Notepad! 🚀**
