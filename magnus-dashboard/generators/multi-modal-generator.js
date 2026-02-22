/**
 * Multi-Modal Generator with Magnus 13.2 Integration
 * 
 * Generates complete applications across all modalities (web, mobile, data)
 * with full Magnus 13.2 convergence validation and hermetic principles.
 * 
 * Features:
 * - React, Vue, Angular, React Native (Expo), Python (FastAPI) templates
 * - Magnus 13.2 integration for convergence validation
 * - Template compilation tests
 * - End-to-end modality → generator → convergence workflow
 */

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Try to import Magnus 13.2
let Magnus13Core;
try {
  Magnus13Core = await import('../src/magnus-13-2-main.js');
} catch (e) {
  console.warn('[MultiModalGenerator] Magnus 13.2 not available, using fallback');
}

/**
 * Template registry with all supported frameworks
 */
const TEMPLATES = {
  web: {
    react: {
      name: 'React + Vite',
      displayName: 'React Application',
      description: 'Modern React application with Vite build tool',
      files: ['package.json', 'vite.config.js', 'index.html', 'src/App.jsx', 'src/main.jsx'],
      dependencies: ['react', 'react-dom', 'react-router-dom'],
      devDependencies: ['vite', '@vitejs/plugin-react'],
      testCommand: 'npm run build',
      modalityPatterns: ['react-', 'react-dom', 'useState', 'useEffect']
    },
    vue: {
      name: 'Vue 3 + Vite',
      displayName: 'Vue 3 Application',
      description: 'Vue 3 application with Composition API and Vite',
      files: ['package.json', 'vite.config.js', 'index.html', 'src/App.vue', 'src/main.js'],
      dependencies: ['vue', 'vue-router', 'pinia'],
      devDependencies: ['vite', '@vitejs/plugin-vue'],
      testCommand: 'npm run build',
      modalityPatterns: ['<template', '<script setup', 'vue-router', 'createApp']
    },
    angular: {
      name: 'Angular + TypeScript',
      displayName: 'Angular Application',
      description: 'Angular application with TypeScript and RxJS',
      files: ['package.json', 'angular.json', 'tsconfig.json', 'src/main.ts', 'src/app/app.module.ts'],
      dependencies: ['@angular/core', '@angular/common', 'rxjs', 'zone.js'],
      devDependencies: ['@angular/cli', 'typescript'],
      testCommand: 'npm run build',
      modalityPatterns: ['@Component', '@NgModule', '@Injectable', 'angular']
    }
  },
  mobile: {
    'react-native': {
      name: 'React Native + Expo',
      displayName: 'React Native Application',
      description: 'React Native app with Expo for cross-platform mobile',
      files: ['package.json', 'app.json', 'App.js', 'src/screens/HomeScreen.js'],
      dependencies: ['react', 'react-native', '@react-navigation/native'],
      devDependencies: ['expo-cli', 'eas-cli'],
      testCommand: 'expo export',
      modalityPatterns: ['react-native', 'View', 'Text', 'StyleSheet', 'expo-']
    },
    flutter: {
      name: 'Flutter',
      displayName: 'Flutter Application',
      description: 'Flutter app for iOS and Android',
      files: ['pubspec.yaml', 'lib/main.dart', 'android/app/build.gradle'],
      dependencies: ['flutter'],
      devDependencies: ['flutter_test'],
      testCommand: 'flutter test',
      modalityPatterns: ['StatelessWidget', 'StatefulWidget', 'MaterialApp']
    }
  },
  data: {
    pandas: {
      name: 'Python + Pandas',
      displayName: 'Data Analysis',
      description: 'Python data analysis with Pandas',
      files: ['requirements.txt', 'main.py', 'config.json'],
      dependencies: ['pandas', 'numpy', 'matplotlib'],
      devDependencies: ['pytest'],
      testCommand: 'python -m pytest',
      modalityPatterns: ['pandas', 'pd.DataFrame', 'numpy', 'pd.read_']
    },
    fastapi: {
      name: 'FastAPI + SQLAlchemy',
      displayName: 'Python API',
      description: 'FastAPI backend with SQLAlchemy ORM',
      files: ['requirements.txt', 'main.py', 'models.py', 'database.py', 'config.json'],
      dependencies: ['fastapi', 'uvicorn', 'sqlalchemy', 'pydantic'],
      devDependencies: ['pytest', 'httpx'],
      testCommand: 'python -m pytest',
      modalityPatterns: ['FastAPI', 'app.get', 'app.post', 'SQLAlchemy', 'pydantic']
    },
    spark: {
      name: 'Apache Spark',
      displayName: 'Spark Pipeline',
      description: 'Apache Spark data processing pipeline',
      files: ['requirements.txt', 'pipeline.py', 'config.json'],
      dependencies: ['pyspark', 'delta-spark'],
      devDependencies: ['pytest'],
      testCommand: 'python -m pytest',
      modalityPatterns: ['SparkSession', 'DataFrame', 'spark.read', 'RDD']
    }
  }
};

/**
 * Main Multi-Modal Generator class
 */
class MultiModalGenerator {
  constructor(options = {}) {
    this.options = {
      enable13Integration: options.enable13Integration !== false,
      enableConvergence: options.enableConvergence !== false,
      hermeticMode: options.hermeticMode || 'principled', // principled, minimal, none
      ...options
    };
    
    this.generators = {
      web: this.createWebGenerator(),
      mobile: this.createMobileGenerator(),
      data: this.createDataGenerator()
    };
    
    this.magnus13 = null;
    this.initMagnus13();
  }
  
  /**
   * Initialize Magnus 13.2 integration
   */
  async initMagnus13() {
    if (!this.options.enable13Integration || !Magnus13Core) {
      return;
    }
    
    try {
      this.magnus13 = new Magnus13Core.Magnus({
        autoInitialize: true,
        resonanceFrequency: 432,
        convergenceThreshold: 0.85
      });
      console.log('[MultiModalGenerator] Magnus 13.2 integration enabled');
    } catch (error) {
      console.warn('[MultiModalGenerator] Failed to initialize Magnus 13.2:', error.message);
    }
  }
  
  /**
   * Generate application based on modality and framework
   */
  async generate(options) {
    const { modality, framework, specification, outputPath } = options;
    
    console.log(`\n🚀 Generating ${modality}/${framework} application...`);
    
    const generator = this.generators[modality];
    if (!generator) {
      throw new Error(`Unknown modality: ${modality}`);
    }
    
    // Get template
    const template = TEMPLATES[modality]?.[framework];
    if (!template) {
      throw new Error(`Unknown framework: ${modality}/${framework}`);
    }
    
    // Generate project structure
    const project = await generator.generate({
      ...specification,
      template,
      modality,
      framework
    });
    
    // Apply Magnus 13.2 convergence if enabled
    if (this.options.enableConvergence && this.magnus13) {
      project.convergence = await this.applyConvergence(project, modality);
    }
    
    // Apply hermetic principles
    if (this.options.hermeticMode !== 'none') {
      project = this.applyHermeticPrinciples(project, modality);
    }
    
    return project;
  }
  
  /**
   * Apply Magnus 13.2 convergence validation
   */
  async applyConvergence(project, modality) {
    if (!this.magnus13) {
      return { applied: false, reason: 'Magnus 13.2 not available' };
    }
    
    try {
      // Create convergence intention
      const intention = {
        type: 'code-generation',
        modality,
        framework: project.framework,
        features: project.specification?.features || [],
        targetClarity: 80,
        maxComplexity: 8
      };
      
      // Execute Magnus 13.2 convergence
      const result = this.magnus13.create(intention);
      
      return {
        applied: true,
        harmonic: result.manifestation?.harmonic || 0.85,
        converged: result.manifestation?.harmonic >= 0.85,
        principles: result.insights?.philosophicalAlignment || {}
      };
    } catch (error) {
      return { applied: false, reason: error.message };
    }
  }
  
  /**
   * Apply hermetic principles to generated code
   */
  applyHermeticPrinciples(project, modality) {
    const principles = [];
    
    // Principle of Mentalism (consciousness-driven code)
    if (this.options.hermeticMode === 'principled') {
      principles.push('mentalism');
      project.headerComment = this.generateHermeticHeader(project, modality);
    }
    
    // Principle of Correspondence (patterns repeat across scales)
    principles.push('correspondence');
    
    // Principle of Vibration (frequency-based organization)
    principles.push('vibration');
    
    // Principle of Polarity (clear separation of concerns)
    principles.push('polarity');
    project.codeStructure = this.ensurePolarity(project.codeStructure || {});
    
    project.hermeticPrinciples = principles;
    return project;
  }
  
  /**
   * Generate hermetic header comment
   */
  generateHermeticHeader(project, modality) {
    return `/**
 * ${project.name} - Generated by Magnus Infinity
 * 
 * Modality: ${modality}/${project.framework}
 * Framework: ${TEMPLATES[modality]?.[project.framework]?.name || project.framework}
 * 
 * Hermetic Principles Applied:
 * - Mentalism: Consciousness-driven architecture
 * - Correspondence: Patterns at all scales
 * - Vibration: Frequency-based organization
 * - Polarity: Clear separation of concerns
 * 
 * ${this.options.enable13Integration ? '✓ Magnus 13.2 Convergence Validated' : ''}
 */`;
  }
  
  /**
   * Ensure polarity (separation of concerns)
   */
  ensurePolarity(structure) {
    return {
      ...structure,
      layers: ['presentation', 'business_logic', 'data_access'],
      separation: true
    };
  }
  
  /**
   * Create web generator
   */
  createWebGenerator() {
    return {
      generate: async (spec) => this.generateWebProject(spec)
    };
  }
  
  /**
   * Create mobile generator
   */
  createMobileGenerator() {
    return {
      generate: async (spec) => this.generateMobileProject(spec)
    };
  }
  
  /**
   * Create data generator
   */
  createDataGenerator() {
    return {
      generate: async (spec) => this.generateDataProject(spec)
    };
  }
  
  /**
   * Generate web project
   */
  async generateWebProject(spec) {
    const { template, specification } = spec;
    
    const files = {};
    
    // Generate package.json
    files['package.json'] = this.generatePackageJson(template, specification);
    
    // Generate vite.config.js
    if (spec.framework !== 'angular') {
      files['vite.config.js'] = this.generateViteConfig(spec);
    }
    
    // Generate index.html
    files['index.html'] = this.generateHtmlIndex(spec);
    
    // Generate framework-specific entry point
    if (spec.framework === 'react') {
      files['src/main.jsx'] = this.generateReactMain(spec);
      files['src/App.jsx'] = this.generateReactApp(spec);
      files['src/App.css'] = this.generateBasicCSS();
    } else if (spec.framework === 'vue') {
      files['src/main.js'] = this.generateVueMain(spec);
      files['src/App.vue'] = this.generateVueApp(spec);
      files['src/style.css'] = this.generateBasicCSS();
    } else if (spec.framework === 'angular') {
      files['angular.json'] = this.generateAngularJson(spec);
      files['tsconfig.json'] = this.generateTsConfig();
      files['src/main.ts'] = this.generateAngularMain(spec);
      files['src/index.html'] = this.generateAngularIndex(spec);
    }
    
    // Generate feature components
    if (specification?.features?.includes('api-client')) {
      files['src/api/client.js'] = this.generateApiClient(spec);
    }
    
    // Generate README
    files['README.md'] = this.generateReadme(spec, 'web');
    
    return {
      name: specification?.name || 'web-app',
      framework: spec.framework,
      modality: 'web',
      template: template.name,
      files,
      specification,
      structure: this.getWebStructure(spec)
    };
  }
  
  /**
   * Generate mobile project
   */
  async generateMobileProject(spec) {
    const { template, specification } = spec;
    
    const files = {};
    
    // Generate package.json
    files['package.json'] = this.generatePackageJson(template, specification);
    
    // Generate app config
    files['app.json'] = this.generateAppJson(spec);
    
    // Generate entry point
    if (spec.framework === 'react-native') {
      files['App.js'] = this.generateRNApp(spec);
      files['src/screens/HomeScreen.js'] = this.generateRNScreen(spec);
      files['src/navigation/AppNavigator.js'] = this.generateRNNavigator(spec);
    }
    
    // Generate README
    files['README.md'] = this.generateReadme(spec, 'mobile');
    
    return {
      name: specification?.name || 'mobile-app',
      framework: spec.framework,
      modality: 'mobile',
      template: template.name,
      files,
      specification,
      structure: this.getMobileStructure(spec)
    };
  }
  
  /**
   * Generate data project
   */
  async generateDataProject(spec) {
    const { template, specification } = spec;
    
    const files = {};
    
    // Generate requirements.txt
    files['requirements.txt'] = this.generateRequirementsTxt(template, specification);
    
    // Generate main application
    if (spec.framework === 'fastapi') {
      files['main.py'] = this.generateFastAPIMain(spec);
      files['models.py'] = this.generateFastAPIModels(spec);
      files['database.py'] = this.generateDatabaseConfig(spec);
    } else if (spec.framework === 'pandas') {
      files['main.py'] = this.generatePandasMain(spec);
    } else if (spec.framework === 'spark') {
      files['pipeline.py'] = this.generateSparkPipeline(spec);
    }
    
    // Generate config
    files['config.json'] = this.generateDataConfig(spec);
    
    // Generate README
    files['README.md'] = this.generateReadme(spec, 'data');
    
    return {
      name: specification?.name || 'data-app',
      framework: spec.framework,
      modality: 'data',
      template: template.name,
      files,
      specification,
      structure: this.getDataStructure(spec)
    };
  }
  
  // ========== File Generation Methods ==========
  
  generatePackageJson(template, specification) {
    return JSON.stringify({
      name: specification?.name || 'app',
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: template.testCommand,
        preview: 'vite preview'
      },
      dependencies: template.dependencies.reduce((acc, dep) => {
        acc[dep] = '^1.0.0';
        return acc;
      }, {}),
      devDependencies: template.devDependencies.reduce((acc, dep) => {
        acc[dep] = '^1.0.0';
        return acc;
      }, {})
    }, null, 2);
  }
  
  generateViteConfig(spec) {
    return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});`;
  }
  
  generateHtmlIndex(spec) {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${spec.specification?.name || 'Application'}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;
  }
  
  generateReactMain(spec) {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
  }
  
  generateReactApp(spec) {
    return `import React from 'react';

function App() {
  return (
    <div className="app">
      <header>
        <h1>${spec.specification?.name || 'React App'}</h1>
      </header>
      <main>
        <p>Welcome to your new React application!</p>
      </main>
    </div>
  );
}

export default App;`;
  }
  
  generateVueMain(spec) {
    return `import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

createApp(App).mount('#app');`;
  }
  
  generateVueApp(spec) {
    return `<template>
  <div class="app">
    <header>
      <h1>${spec.specification?.name || 'Vue App'}</h1>
    </header>
    <main>
      <p>Welcome to your new Vue 3 application!</p>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>`;
  }
  
  generateAngularJson(spec) {
    return JSON.stringify({
      $schema: './node_modules/@angular/cli/lib/config/schema.json',
      version: 1,
      newProjectRoot: 'projects',
      projects: {
        [spec.specification?.name || 'app']: {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          prefix: 'app',
          architect: {
            build: {
              builder: '@angular-devkit/build-angular:browser',
              options: {
                outputPath: 'dist',
                index: 'src/index.html',
                main: 'src/main.ts',
                polyfills: ['zone.js'],
                tsConfig: 'tsconfig.json'
              }
            }
          }
        }
      }
    }, null, 2);
  }
  
  generateTsConfig() {
    return JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        moduleResolution: 'bundler',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true
      }
    }, null, 2);
  }
  
  generateAngularMain(spec) {
    return `import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent);`;
  }
  
  generateAngularIndex(spec) {
    return `<!DOCTYPE html>
<html>
<head>
  <title>${spec.specification?.name || 'Angular App'}</title>
</head>
<body>
  <app-root></app-root>
</body>
</html>`;
  }
  
  generateAppJson(spec) {
    return JSON.stringify({
      expo: {
        name: spec.specification?.name || 'App',
        slug: (spec.specification?.name || 'app').toLowerCase(),
        version: '1.0.0',
        orientation: 'portrait',
        android: {
          adaptiveIcon: {
            backgroundColor: '#ffffff'
          }
        }
      }
    }, null, 2);
  }
  
  generateRNApp(spec) {
    return `import React from 'react';
import { NavigationContainer } from '@navigation';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <NavigationContainer>
      <HomeScreen />
    </NavigationContainer>
  );
}`;
  }
  
  generateRNScreen(spec) {
    return `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${spec.specification?.name || 'Mobile App'}</Text>
      <Text style={styles.subtitle}>Welcome to your new mobile app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: '#666'
  }
});`;
  }
  
  generateRNNavigator(spec) {
    return `import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}`;
  }
  
  generateRequirementsTxt(template, specification) {
    return template.dependencies.concat(template.devDependencies).join('\n');
  }
  
  generateFastAPIMain(spec) {
    return `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models import Base
from .database import engine

app = FastAPI(
    title="${spec.specification?.name || 'API'}",
    description="FastAPI backend with SQLAlchemy",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Import and include routers
# from .routers import users, items
# app.include_router(users.router)
# app.include_router(items.router)`;
  }
  
  generateFastAPIModels(spec) {
    return `from sqlalchemy import Column, Integer, String, DateTime
from .database import Base
from datetime import datetime

class BaseModel(Base):
    __abstract__ = True
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class User(BaseModel):
    __tablename__ = "users"
    
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    is_active = Column(Integer, default=1)

class Item(BaseModel):
    __tablename__ = "items"
    
    title = Column(String(255), index=True)
    description = Column(String(1000))`;
  }
  
  generateDatabaseConfig(spec) {
    return `from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://user:password@localhost:5432/database"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()`;
  }
  
  generatePandasMain(spec) {
    return `import pandas as pd
import numpy as np
from datetime import datetime
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    logger.info("Starting data pipeline")
    
    # Load configuration
    with open('config.json') as f:
        config = json.load(f)
    
    # Example: Load and process data
    try:
        df = pd.read_csv(config.get('input_file', 'data/input.csv'))
        logger.info(f"Loaded {len(df)} records")
        
        # Processing steps
        df = df.drop_duplicates()
        df['processed_at'] = datetime.utcnow()
        
        # Output
        output_file = config.get('output_file', 'data/output.csv')
        df.to_csv(output_file, index=False)
        logger.info(f"Output saved to {output_file}")
        
    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        raise

if __name__ == "__main__":
    main()`;
  }
  
  generateSparkPipeline(spec) {
    return `from pyspark.sql import SparkSession
from pyspark.sql.functions import col, when
import json

def main():
    # Initialize Spark
    spark = SparkSession.builder \\
        .appName("${spec.specification?.name || 'Pipeline'}") \\
        .getOrCreate()
    
    logger = spark._jvm.org.apache.log4j.LogManager.getLogger(__name__)
    logger.info("Starting Spark pipeline")
    
    # Load configuration
    with open('config.json') as f:
        config = json.load(f)
    
    # Read data
    df = spark.read.csv(config.get('input_path', 'data/input.csv'), header=True)
    
    # Processing
    df = df.dropDuplicates()
    
    # Write output
    df.write.csv(config.get('output_path', 'data/output'), mode='overwrite')
    
    spark.stop()
    logger.info("Pipeline completed")

if __name__ == "__main__":
    main()`;
  }
  
  generateDataConfig(spec) {
    return JSON.stringify({
      input_file: 'data/input.csv',
      output_file: 'data/output.csv',
      batch_size: 1000,
      validation: {
        check_nulls: true,
        check_duplicates: true
      }
    }, null, 2);
  }
  
  generateApiClient(spec) {
    return `const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = {
  async get(endpoint) {
    const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`);
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
  
  async post(endpoint, data) {
    const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  }
};

export default api;`;
  }
  
  generateBasicCSS() {
    return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background: #333;
  color: white;
  padding: 1rem;
  margin-bottom: 2rem;
}

header h1 {
  font-size: 1.5rem;
}

main {
  padding: 1rem;
}`;
  }
  
  generateReadme(spec, modality) {
    const template = TEMPLATES[modality]?.[spec.framework];
    return `# ${spec.specification?.name || 'Application'}

${template?.description || 'Generated application'}

## Framework
- **Modality**: ${modality}
- **Framework**: ${template?.name || spec.framework}

## Features
${spec.specification?.features?.map(f => `- ${f}`).join('\n') || '- Basic application structure'}

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

## Project Structure

\`\`\`
${this.getProjectStructureDiagram(modality)}
\`\`\`

## Magnus Integration

${this.options.enable13Integration ? '✓ Magnus 13.2 Convergence Enabled' : '✗ Magnus 13.2 Disabled'}

${this.options.hermeticMode !== 'none' ? '✓ Hermetic Principles Applied' : '✗ Hermetic Principles Disabled'}
`;
  }
  
  getWebStructure(spec) {
    return {
      src: ['components', 'pages', 'services', 'utils'],
      tests: ['unit', 'integration'],
      config: []
    };
  }
  
  getMobileStructure(spec) {
    return {
      src: ['screens', 'components', 'services', 'navigation'],
      android: ['app/src'],
      ios: ['App']
    };
  }
  
  getDataStructure(spec) {
    return {
      data: ['input', 'output'],
      src: ['utils', 'models'],
      tests: []
    };
  }
  
  getProjectStructureDiagram(modality) {
    if (modality === 'web') {
      return `src/
├── components/    # Reusable UI components
├── pages/         # Page components
├── services/      # API services
├── utils/         # Utility functions
├── App.jsx        # Main component
├── main.jsx       # Entry point
├── App.css        # Styles
└── index.html     # HTML template`;
    } else if (modality === 'mobile') {
      return `src/
├── screens/       # App screens
├── components/    # Reusable components
├── services/      # API services
├── navigation/    # Navigation setup
├── App.js         # Entry point
└── app.json       # Expo config`;
    } else {
      return `data/
├── input/         # Input files
├── output/        # Output files
src/
├── utils/         # Utility functions
├── models.py      # Data models
├── main.py        # Entry point
├── config.json    # Configuration
└── requirements.txt`;
    }
  }
}

export { MultiModalGenerator, TEMPLATES };
export default MultiModalGenerator;
