module.exports = {
  apps: [
    {
      name: 'my-react-app',
      script: 'npm',
      args: 'start',
      watch: false,
      autorestart: true,
      max_memory_restart: '1G',
    },
  ],
};

