module.exports = {
  app: [
    {
      name: "spot_service",
      script: "spot_service/build/src/index.js",
    },
    {
      name: "forecast_service",
      script: "forecast_service/build/src/index.js",
    },
    {
      name: "user_service",
      script: "user_service/build/src/index.js",
    },
  ],
};
