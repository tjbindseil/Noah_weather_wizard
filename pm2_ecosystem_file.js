module.exports = {
  app: [
    {
      name: "spot_service",
      script: "spot_service/build/src/index.js",
      time: true,
    },
    {
      name: "forecast_service",
      script: "forecast_service/build/src/index.js",
      time: true,
    },
    {
      name: "user_service",
      script: "user_service/build/src/index.js",
      time: true,
    },
  ],
};
