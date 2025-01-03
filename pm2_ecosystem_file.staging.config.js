module.exports = {
  apps: [
    {
      name: "spot_service_staging",
      script: "spot_service/build/src/index.js",
      env: {
        WW_ENV: "staging",
      },
      time: true,
    },
    {
      name: "forecast_service_staging",
      script: "forecast_service/build/src/index.js",
      env: {
        WW_ENV: "staging",
      },
      time: true,
    },
    {
      name: "user_service_staging",
      script: "user_service/build/src/index.js",
      env: {
        WW_ENV: "staging",
      },
      time: true,
    },
    {
      name: "forecast_fetcher_staging",
      script: "forecast_fetcher/build/src/index.js",
      env: {
        WW_ENV: "staging",
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
