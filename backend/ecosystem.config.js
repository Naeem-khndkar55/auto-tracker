module.exports = {
  apps: [{
    name: "cumillavehicle-backend",
    script: "./server.js",
    env: {
      NODE_ENV: "production",
      PORT: 5000
    },     
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    error_file: "logs/err.log",
    out_file: "logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    merge_logs: true
  }]
} 