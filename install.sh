declare -a to_build=("models" "app_config" "api" "utilities" "user_facade" "forecast_service" "spot_service" "user_service")
for dir in "${to_build[@]}"
do
  cd $dir
  rm -rf package-lock.json && npm install
  cd ../
done

