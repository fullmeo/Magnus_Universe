module.exports = {
  apps: [
    {
      name: 'magnus-dashboard',
      script: './server/index.js',
      cwd: './magnus-dashboard',
      instances: 1,
      exec_mode: 'fork',
      env: {
        PORT: 3333,
        HOST: 'localhost',
        NODE_ENV: 'production'
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'public'],
      max_memory_restart: '1G'
    }
  ]
};
