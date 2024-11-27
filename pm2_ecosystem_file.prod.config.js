module.exports = {
  apps: [
    {
      name: "spot_service_prod",
      script: "spot_service/build/src/index.js",
      env: {
        WW_ENV: "prod",
      },
      time: true,
    },
    {
      name: "forecast_service_prod",
      script: "forecast_service/build/src/index.js",
      env: {
        WW_ENV: "prod",
      },
      time: true,
    },
    {
      name: "user_service_prod",
      script: "user_service/build/src/index.js",
      env: {
        WW_ENV: "prod",
      },
      time: true,
    },
    {
      name: "forecast_fetcher_prod",
      script: "forecast_fetcher/build/src/index.js",
      env: {
        WW_ENV: "prod",
      },
      time: true,
    },
  ],

  //   deploy: {
  //     prod: {
  //       user: "SSH_USERNAME",
  //       host: "SSH_HOSTMACHINE",
  //       ref: "origin/master",
  //       repo: "GIT_REPOSITORY",
  //       path: "DESTINATION_PATH",
  //       "pre-deploy-local": "",
  //       "post-deploy":
  //         "npm install && pm2 reload ecosystem.config.js --env production",
  //       "pre-setup": "",
  //     },
  //   },
};
