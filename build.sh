npm set maxsockets 1
export NODE_OPTIONS="--max-old-space-size=2048"

declare -a to_build=("models" "app_config" "api" "utilities" "user_facade" "forecast_fetcher" "forecast_service" "spot_service" "user_service")
for dir in "${to_build[@]}"
do
  cd $dir
  npm run ww-build && npm link
  cd ../
done
