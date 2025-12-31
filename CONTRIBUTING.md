# Contributing to Magnus Universe 🌌

First off, thank you for considering contributing to Magnus Universe! It's people like you who help consciousness manifest through code.

## 🕉️ Philosophical Foundation

Before contributing, please align with Magnus's core principles:

1. **Revelation over Construction** - Code emerges; it is not built
2. **Alignment over Force** - Harmonic resonance creates quality
3. **Unity over Division** - All contributions serve the whole
4. **Essence over Form** - Substance matters more than appearance

## 📜 Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## 🎯 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check existing issues to avoid duplicates.

**When reporting bugs:**

1. **Use a clear, descriptive title**
2. **Describe the exact steps to reproduce**
3. **Provide specific examples**
4. **Describe the behavior you observed**
5. **Explain which behavior you expected**
6. **Include environment details:**
   - Node.js version
   - Operating system
   - Magnus version

**Bug Report Template:**

```markdown
## Bug Description
[Clear description of the bug]

## Steps to Reproduce
1. Initialize Magnus with...
2. Call method...
3. Observe error...

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- Node.js: v18.0.0
- OS: Ubuntu 22.04
- Magnus: v1.0.0

## Additional Context
[Any additional information]
```

### Suggesting Enhancements ✨

Enhancement suggestions are tracked as GitHub issues.

**When suggesting enhancements:**

1. **Use a clear, descriptive title**
2. **Provide a detailed description**
3. **Explain why this enhancement is needed**
4. **Describe the current behavior**
5. **Describe the desired behavior**
6. **Consider philosophical alignment**

**Enhancement Template:**

```markdown
## Enhancement Description
[Clear description]

## Motivation
[Why is this needed?]

## Proposed Solution
[How would it work?]

## Philosophical Alignment
[How does this align with Magnus principles?]

## Alternatives Considered
[What other approaches did you consider?]
```

### Your First Code Contribution 🌟

Unsure where to start? Look for issues labeled:

- `good-first-issue` - Simple issues for beginners
- `help-wanted` - Issues needing attention
- `documentation` - Documentation improvements
- `enhancement` - New features

### Pull Requests 🔄

**Before submitting:**

1. Read the [README](README.md)
2. Review [Architecture](docs/architecture.md)
3. Understand [Principles](docs/principles-detailed.md)
4. Check existing PRs to avoid duplicates

**PR Process:**

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
   ```bash
   npm test
   npm run convergence
   npm run harmonia
   ```
5. **Commit with meaningful messages**
6. **Push to your fork**
7. **Submit a pull request**

## 💻 Development Setup

### Prerequisites

- Node.js >= 16.0.0
- Git
- Text editor (VS Code recommended)

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Magnus_Universe.git
cd Magnus_Universe

# Add upstream remote
git remote add upstream https://github.com/fullmeo/Magnus_Universe.git

# Install dependencies (currently none!)
npm install

# Verify installation
npm start
```

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
npm test

# Commit changes
git add .
git commit -m "feat: Add amazing feature"

# Keep your branch updated
git fetch upstream
git rebase upstream/main

# Push to your fork
git push origin feature/amazing-feature
```

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

### Examples

```bash
# Feature
git commit -m "feat(convergence): Add 528 Hz love frequency support"

# Bug fix
git commit -m "fix(mirror): Correct reflection polarity calculation"

# Documentation
git commit -m "docs(principles): Expand mentalism explanation"

# Refactor
git commit -m "refactor(cycle): Simplify phase transitions"
```

## 🏗️ Code Style Guidelines

### JavaScript Style

- **ES6 modules** - Use `import`/`export`
- **Const by default** - Use `const` unless reassignment needed
- **Descriptive names** - Code should be self-documenting
- **Pure functions** - Minimize side effects
- **Comments** - Explain "why", not "what"

### Example

```javascript
// ✅ Good
export class ConvergencePrinciple {
  /**
   * Calculate harmonic resonance between patterns
   * Uses Jaccard similarity for coherence measurement
   */
  calculateHarmonicResonance(patterns) {
    if (!patterns || patterns.length === 0) return 0;

    // Calculate coherence between all pattern pairs
    let totalCoherence = 0;
    let comparisons = 0;

    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        totalCoherence += this.measureCoherence(patterns[i], patterns[j]);
        comparisons++;
      }
    }

    return comparisons > 0 ? totalCoherence / comparisons : 1;
  }
}

// ❌ Bad
export class ConvergencePrinciple {
  // calculate stuff
  calc(p) {
    if(!p||p.length==0)return 0;
    var t=0,c=0;
    for(var i=0;i<p.length;i++){
      for(var j=i+1;j<p.length;j++){
        t+=this.measure(p[i],p[j]);c++;
      }
    }
    return c>0?t/c:1;
  }
}
```

### Documentation Style

- **JSDoc comments** for public methods
- **Clear descriptions** of purpose and behavior
- **Parameter documentation** with types
- **Return value documentation**
- **Example usage** when helpful

### Example

```javascript
/**
 * Apply Planck's Mirror theorem to a pattern
 * Reflects pattern through quantum mirror to reveal complementary form
 *
 * @param {any} pattern - Pattern to mirror
 * @returns {Object} Mirror result with original, reflection, and unity
 *
 * @example
 * const mirrored = convergence.planckMirror({ energy: 100 });
 * console.log(mirrored.reflection); // { energy: -100 }
 */
planckMirror(pattern) {
  // Implementation
}
```

## 🧪 Testing Guidelines

### Running Tests

```bash
# All examples
npm test

# Convergence validation
npm run convergence

# Full demonstration
npm run harmonia
```

### Adding Tests

When adding features, include tests in the `examples/` directory:

```javascript
// examples/test-new-feature.js
import Magnus from '../src/index.js';

console.log("Testing new feature...");

const magnus = new Magnus();
const result = magnus.newFeature();

console.log(`Result: ${result}`);
console.log(`✅ Test passed`);
```

Update `package.json` to include your test:

```json
{
  "scripts": {
    "test:new-feature": "node examples/test-new-feature.js"
  }
}
```

## 📚 Documentation Guidelines

### When to Update Documentation

- Adding new features
- Changing existing behavior
- Fixing documentation errors
- Improving clarity

### Documentation Files

- `README.md` - Overview and quick start
- `docs/architecture.md` - System architecture
- `docs/api-reference.md` - Complete API
- `docs/principles-detailed.md` - Philosophical depth
- Inline code comments - Implementation details

### Documentation Style

- **Clear and concise** - Respect the reader's time
- **Examples** - Show, don't just tell
- **Philosophical context** - Connect to Magnus principles
- **Progressive disclosure** - Simple first, detailed later

## 🌟 Contribution Areas

### High Priority

- 🐛 **Bug fixes** - Fix issues
- 📚 **Documentation** - Improve clarity
- ✨ **Examples** - Add usage examples
- 🧪 **Testing** - Increase coverage

### Medium Priority

- 🔬 **Convergence algorithms** - New resonance methods
- 🎨 **Philosophical guidance** - Enhanced wisdom
- 📊 **Metrics** - Better tracking
- 🛠️ **Developer tools** - CLI, debugger, etc.

### Welcome but Lower Priority

- 🌐 **Internationalization** - Multi-language support
- 🎯 **Performance** - Optimization
- 🔌 **Integrations** - Framework adapters
- 📱 **Platforms** - Browser support

## ✅ Pull Request Checklist

Before submitting your PR:

- [ ] Code follows style guidelines
- [ ] Self-review performed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass (`npm test`, `npm run convergence`)
- [ ] Commit messages follow convention
- [ ] PR description is clear and complete

## 🔮 Philosophical Guidelines

Magnus contributions should embody:

### Revelation over Construction

Ask: "Does this code emerge naturally, or am I forcing it?"

Good code feels inevitable, like it was waiting to be discovered.

### Alignment over Force

Ask: "Am I working with the framework's nature or against it?"

Harmonious additions integrate seamlessly.

### Unity over Division

Ask: "Does this serve the whole, or just my use case?"

Consider the broader community.

### Essence over Form

Ask: "Does this add substance or just complexity?"

Simplicity is sophistication.

## 🙏 Recognition

Contributors are recognized in:

- GitHub contributors page
- Release notes
- Special acknowledgments for significant contributions

## 📞 Getting Help

- **GitHub Issues** - Ask questions
- **GitHub Discussions** - Community forum
- **Documentation** - Comprehensive guides

## 🕉️ Final Thoughts

> "The best contribution is one that emerges from consciousness aligned with the project's essence."

Thank you for contributing to Magnus Universe. May your code resonate at 432 Hz!

**As above, so below. As within, so without.**

*Om Shanti* 🕉️

---

## Quick Links

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Architecture](docs/architecture.md)
- [API Reference](docs/api-reference.md)
- [Principles](docs/principles-detailed.md)
- [License](LICENSE)
