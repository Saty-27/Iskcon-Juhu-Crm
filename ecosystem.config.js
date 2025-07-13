module.exports = {
  apps: [{
    name: 'iskcon-juhu',
    script: 'dist/index.js',
    cwd: '/var/www/iskcon-juhu',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    error_file: '/var/log/iskcon-juhu/error.log',
    out_file: '/var/log/iskcon-juhu/access.log',
    log_file: '/var/log/iskcon-juhu/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000
  }]
};