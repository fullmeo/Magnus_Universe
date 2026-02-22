/**
 * Web Application Generator
 *
 * Generates complete web applications using various frontend frameworks
 * and backend technologies with full-stack integration.
 */

import path from 'path';
import fs from 'fs/promises';

class WebGenerator {
  constructor(options = {}) {
    this.framework = options.framework || 'react';
    this.backend = options.backend || 'nodejs';
    this.database = options.database || 'mongodb';
    this.deployment = options.deployment || 'docker';

    this.templates = {
      react: this.loadReactTemplates(),
      vue: this.loadVueTemplates(),
      angular: this.loadAngularTemplates(),
      nodejs: this.loadNodeTemplates(),
      python: this.loadPythonTemplates()
    };
  }

  /**
   * Generate complete web application
   */
  async generate(specification) {
    const project = {
      name: specification.name || 'web-app',
      framework: this.framework,
      backend: this.backend,
      features: specification.features || [],
      structure: {},
      files: {}
    };

    // Generate frontend
    project.frontend = await this.generateFrontend(specification);

    // Generate backend if requested
    if (specification.includeBackend) {
      project.backend = await this.generateBackend(specification);
    }

    // Generate database configuration
    project.database = await this.generateDatabaseConfig(specification);

    // Generate deployment configuration
    project.deployment = await this.generateDeploymentConfig(specification);

    // Generate documentation
    project.documentation = this.generateDocumentation(specification);

    return project;
  }

  /**
   * Generate React frontend application
   */
  async generateFrontend(specification) {
    const frontend = {
      framework: this.framework,
      components: [],
      pages: [],
      services: [],
      config: {}
    };

    switch (this.framework) {
      case 'react':
        return this.generateReactApp(specification);
      case 'vue':
        return this.generateVueApp(specification);
      case 'angular':
        return this.generateAngularApp(specification);
      default:
        return this.generateReactApp(specification);
    }
  }

  /**
   * Generate React application
   */
  generateReactApp(specification) {
    const app = {
      packageJson: this.generateReactPackageJson(specification),
      structure: this.generateReactStructure(specification),
      components: this.generateReactComponents(specification),
      pages: this.generateReactPages(specification),
      services: this.generateReactServices(specification),
      config: this.generateReactConfig(specification)
    };

    return app;
  }

  /**
   * Generate React package.json
   */
  generateReactPackageJson(specification) {
    const features = specification.features || [];

    const dependencies = {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      'react-router-dom': '^6.8.0'
    };

    const devDependencies = {
      '@types/react': '^18.0.0',
      '@types/react-dom': '^18.0.0',
      '@vitejs/plugin-react': '^3.0.0',
      'vite': '^4.0.0',
      'typescript': '^4.9.0'
    };

    // Add feature-specific dependencies
    if (features.includes('authentication')) {
      dependencies['firebase'] = '^9.0.0';
    }

    if (features.includes('ui-components')) {
      dependencies['@mui/material'] = '^5.0.0';
      dependencies['@emotion/react'] = '^11.0.0';
      dependencies['@emotion/styled'] = '^11.0.0';
    }

    if (features.includes('state-management')) {
      dependencies['@reduxjs/toolkit'] = '^1.9.0';
      dependencies['react-redux'] = '^8.0.0';
    }

    if (features.includes('api-client')) {
      dependencies['axios'] = '^1.3.0';
    }

    return {
      name: specification.name || 'react-app',
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
        lint: 'eslint src --ext .js,.jsx,.ts,.tsx'
      },
      dependencies,
      devDependencies
    };
  }

  /**
   * Generate React project structure
   */
  generateReactStructure(specification) {
    const structure = {
      'src/': {
        'components/': {},
        'pages/': {},
        'services/': {},
        'hooks/': {},
        'utils/': {},
        'types/': {},
        'assets/': {}
      },
      'public/': {},
      'tests/': {}
    };

    // Add feature-specific directories
    const features = specification.features || [];
    if (features.includes('authentication')) {
      structure['src/']['auth/'] = {};
    }

    if (features.includes('state-management')) {
      structure['src/']['store/'] = {};
    }

    return structure;
  }

  /**
   * Generate React components
   */
  generateReactComponents(specification) {
    const components = [];

    // Base components
    components.push({
      name: 'Header',
      path: 'src/components/Header.jsx',
      content: this.generateHeaderComponent(specification)
    });

    components.push({
      name: 'Footer',
      path: 'src/components/Footer.jsx',
      content: this.generateFooterComponent(specification)
    });

    components.push({
      name: 'Layout',
      path: 'src/components/Layout.jsx',
      content: this.generateLayoutComponent(specification)
    });

    // Feature-specific components
    const features = specification.features || [];
    if (features.includes('authentication')) {
      components.push({
        name: 'LoginForm',
        path: 'src/components/LoginForm.jsx',
        content: this.generateLoginFormComponent()
      });
    }

    if (features.includes('ui-components')) {
      components.push({
        name: 'Button',
        path: 'src/components/Button.jsx',
        content: this.generateButtonComponent()
      });
    }

    return components;
  }

  /**
   * Generate React pages
   */
  generateReactPages(specification) {
    const pages = [];

    pages.push({
      name: 'Home',
      path: 'src/pages/Home.jsx',
      content: this.generateHomePage(specification)
    });

    pages.push({
      name: 'About',
      path: 'src/pages/About.jsx',
      content: this.generateAboutPage(specification)
    });

    // Feature-specific pages
    const features = specification.features || [];
    if (features.includes('authentication')) {
      pages.push({
        name: 'Login',
        path: 'src/pages/Login.jsx',
        content: this.generateLoginPage()
      });

      pages.push({
        name: 'Profile',
        path: 'src/pages/Profile.jsx',
        content: this.generateProfilePage()
      });
    }

    return pages;
  }

  /**
   * Generate React services
   */
  generateReactServices(specification) {
    const services = [];

    const features = specification.features || [];
    if (features.includes('api-client')) {
      services.push({
        name: 'apiService',
        path: 'src/services/apiService.js',
        content: this.generateApiService(specification)
      });
    }

    if (features.includes('authentication')) {
      services.push({
        name: 'authService',
        path: 'src/services/authService.js',
        content: this.generateAuthService()
      });
    }

    return services;
  }

  /**
   * Generate main App component
   */
  generateReactAppComponent(specification) {
    const features = specification.features || [];
    const hasAuth = features.includes('authentication');
    const hasRouter = features.includes('routing');

    let imports = `import React from 'react';
import './App.css';`;

    if (hasRouter) {
      imports += `\nimport { BrowserRouter as Router, Routes, Route } from 'react-router-dom';`;
    }

    if (hasAuth) {
      imports += `\nimport { AuthProvider } from './auth/AuthContext';`;
    }

    let appContent = '';

    if (hasRouter) {
      appContent = `
function App() {
  return (
    <Router>
      ${hasAuth ? '<AuthProvider>' : ''}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          ${hasAuth ? '<Route path="/login" element={<Login />} />' : ''}
          ${hasAuth ? '<Route path="/profile" element={<Profile />} />' : ''}
        </Routes>
      ${hasAuth ? '</AuthProvider>' : ''}
    </Router>
  );
}`;
    } else {
      appContent = `
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>${specification.name || 'React App'}</h1>
        <p>Welcome to your new application!</p>
      </header>
    </div>
  );
}`;
    }

    return `${imports}

${appContent}

export default App;`;
  }

  /**
   * Generate Home page
   */
  generateHomePage(specification) {
    return `import React from 'react';
import Layout from '../components/Layout';

function Home() {
  return (
    <Layout>
      <div className="home">
        <h1>Welcome to ${specification.name || 'Our Application'}</h1>
        <p>This is the home page of your new web application.</p>
        <div className="features">
          <h2>Features</h2>
          <ul>
            ${specification.features?.map(feature =>
              `<li key="${feature}">${feature}</li>`
            ).join('\n            ') || '<li>Feature 1</li>'}
          </ul>
        </div>
      </div>
    </Layout>
  );
}

export default Home;`;
  }

  /**
   * Generate Header component
   */
  generateHeaderComponent(specification) {
    const features = specification.features || [];
    const hasAuth = features.includes('authentication');

    return `import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">
          <Link to="/">${specification.name || 'App'}</Link>
        </h1>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          ${hasAuth ? '<Link to="/profile">Profile</Link>' : ''}
          ${hasAuth ? '<button className="logout-btn">Logout</button>' : ''}
        </nav>
      </div>
    </header>
  );
}

export default Header;`;
  }

  /**
   * Generate API service
   */
  generateApiService(specification) {
    return `import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Generic CRUD operations
  get: (endpoint, params) => api.get(endpoint, { params }),
  post: (endpoint, data) => api.post(endpoint, data),
  put: (endpoint, data) => api.put(endpoint, data),
  delete: (endpoint) => api.delete(endpoint),

  // Specific endpoints
  users: {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(\`/users/\${id}\`),
    create: (user) => api.post('/users', user),
    update: (id, user) => api.put(\`/users/\${id}\`, user),
    delete: (id) => api.delete(\`/users/\${id}\`)
  }
};

export default apiService;`;
  }

  /**
   * Generate backend (Node.js/Express)
   */
  async generateBackend(specification) {
    const backend = {
      packageJson: this.generateBackendPackageJson(specification),
      structure: this.generateBackendStructure(specification),
      routes: this.generateBackendRoutes(specification),
      models: this.generateBackendModels(specification),
      middleware: this.generateBackendMiddleware(specification),
      config: this.generateBackendConfig(specification)
    };

    return backend;
  }

  /**
   * Generate backend package.json
   */
  generateBackendPackageJson(specification) {
    const dependencies = {
      'express': '^4.18.0',
      'cors': '^2.8.5',
      'helmet': '^6.0.0',
      'dotenv': '^16.0.0',
      'mongoose': '^7.0.0', // for MongoDB
      'jsonwebtoken': '^9.0.0',
      'bcryptjs': '^2.4.3'
    };

    const devDependencies = {
      'nodemon': '^2.0.0',
      'jest': '^29.0.0',
      'supertest': '^6.0.0'
    };

    return {
      name: `${specification.name || 'web-app'}-api`,
      version: '1.0.0',
      main: 'server.js',
      scripts: {
        start: 'node server.js',
        dev: 'nodemon server.js',
        test: 'jest'
      },
      dependencies,
      devDependencies
    };
  }

  /**
   * Generate Docker configuration
   */
  generateDeploymentConfig(specification) {
    const dockerfile = `FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

EXPOSE 3001

CMD ["npm", "start"]`;

    const dockerCompose = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/${specification.name || 'app'}
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:`;

    return {
      dockerfile,
      dockerCompose,
      nginx: this.generateNginxConfig(specification)
    };
  }

  /**
   * Generate documentation
   */
  generateDocumentation(specification) {
    return {
      readme: this.generateReadme(specification),
      apiDocs: this.generateApiDocs(specification),
      deployment: this.generateDeploymentDocs(specification)
    };
  }

  /**
   * Generate README.md
   */
  generateReadme(specification) {
    return `# ${specification.name || 'Web Application'}

A modern web application built with ${this.framework} and ${this.backend}.

## Features

${specification.features?.map(feature => `- ${feature}`).join('\n') || '- Feature 1\n- Feature 2'}

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
${this.database === 'mongodb' ? '- MongoDB' : ''}

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. ${this.database === 'mongodb' ? 'Start MongoDB and update connection string in .env' : 'Configure your database'}

4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Project Structure

\`\`\`
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API services
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
└── assets/        # Static assets
\`\`\`

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

## License

MIT`;
  }

  // Placeholder methods for other components
  generateFooterComponent() { return '/* Footer component */'; }
  generateLayoutComponent() { return '/* Layout component */'; }
  generateLoginFormComponent() { return '/* Login form component */'; }
  generateButtonComponent() { return '/* Button component */'; }
  generateAboutPage() { return '/* About page */'; }
  generateLoginPage() { return '/* Login page */'; }
  generateProfilePage() { return '/* Profile page */'; }
  generateAuthService() { return '/* Auth service */'; }
  generateReactConfig() { return {}; }
  loadReactTemplates() { return {}; }
  loadVueTemplates() { return {}; }
  loadAngularTemplates() { return {}; }
  loadNodeTemplates() { return {}; }
  loadPythonTemplates() { return {}; }
  generateVueApp() { return {}; }
  generateAngularApp() { return {}; }
  generateBackendStructure() { return {}; }
  generateBackendRoutes() { return []; }
  generateBackendModels() { return []; }
  generateBackendMiddleware() { return []; }
  generateBackendConfig() { return {}; }
  generateDatabaseConfig() { return {}; }
  generateNginxConfig() { return ''; }
  generateApiDocs() { return {}; }
  generateDeploymentDocs() { return {}; }
}

export { WebGenerator };
export default WebGenerator;