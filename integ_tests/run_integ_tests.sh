# set -x

# first, make sure we are authenticated
caller_identity=$(aws sts get-caller-identity)
if [[ ! $caller_identity == *"cli_user"* ]]; then
  echo "Not logged in, run the following command to login."
  echo "aws sso login"
  exit 1
fi


# start all services in laptopIT mode
cd ../forecast_service && npm run start-laptopIT &
cd ../spot_service && npm run start-laptopIT &

# ping each addres to ensure that things are working good
# or just wait
echo 'sleeping for 15 seconds'
sleep 15
echo 'done sleeping for 15 seconds'

# run laptopIT integ tests
npm run integ-test-laptopIT


# TODO get ports from app_config
pid_spot=$(lsof -ti tcp:8880)
pid_forecast=$(lsof -ti tcp:8881)

# close everything
kill -9 $pid_spot $pid_forecast
