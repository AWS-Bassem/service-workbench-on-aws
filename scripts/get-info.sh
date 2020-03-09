#!/bin/bash
set -e
set -o pipefail

# This sets STAGE to $1 if present and not null, otherwise it sets stage to
# $STAGE from the environment if present, else it defaults to $USER
STAGE="${1:-${STAGE:-$USER}}"

pushd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null
# shellcheck disable=SC1091
[[ $UTIL_SOURCED != yes && -f ./util.sh ]] && source ./util.sh
popd > /dev/null

# Ensure settings file exists
ensure_setttings_file "$@"

# Setup the execution command
init_package_manager

##
#  Sets the following environment variables containing information about the deployed environment and displays a
#  human friendly summary message containing info about the environment
#
# WEBSITE_DOMAIN_NAME
# WEBSITE_ENDPOINT
# API_ENDPOINT
#
##
function get_info() {
  pushd "$SOLUTION_DIR/infrastructure" > /dev/null
  local stack_name_infrastructure
  stack_name_infrastructure=$($EXEC sls info -s "$STAGE" | grep 'stack:' --ignore-case | sed 's/ //g' | cut -d':' -f2)
  popd > /dev/null

  pushd "$SOLUTION_DIR/backend" > /dev/null
  local stack_name_backend
  stack_name_backend=$($EXEC sls info -s "$STAGE" | grep 'stack:' --ignore-case | sed 's/ //g' | cut -d':' -f2)
  popd > /dev/null

  local solution_name aws_region aws_profile

  # Note that we disable exit on non-zero for this section as the awsProfile
  # will not be present in the CI/CD pipeline YAML and that fact, combined
  # with set -o pipefail, will cause this script to exit with a non-zero rc.
  set +e
  solution_name="$(grep '^solutionName:' --ignore-case < "$CONFIG_DIR/settings/$STAGE.yml" | sed 's/ //g' | cut -d':' -f2)"
  aws_region="$(grep '^awsRegion:' --ignore-case < "$CONFIG_DIR/settings/$STAGE.yml" | sed 's/ //g' | cut -d':' -f2)"
  aws_profile="$(grep '^awsProfile:' < "$CONFIG_DIR/settings/$STAGE.yml" | sed 's/ //g' | cut -d':' -f2)"
  set -e

  local root_psswd_cmd=''
  local website_domain_name=''

  if [ "$aws_profile" ]; then
    root_psswd_cmd="aws ssm get-parameters --names /$STAGE/$solution_name/user/root/password --output text --region $aws_region --profile $aws_profile --with-decryption --query Parameters[0].Value"
    # shellcheck disable=SC2016
    website_domain_name="$(aws cloudformation describe-stacks --stack-name "$stack_name_infrastructure" --output text --region "$aws_region" --profile "$aws_profile" --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontEndpoint`].OutputValue')"
    # shellcheck disable=SC2016
    api_endpoint="$(aws cloudformation describe-stacks --stack-name "$stack_name_backend" --output text --region "$aws_region" --profile "$aws_profile" --query 'Stacks[0].Outputs[?OutputKey==`ServiceEndpoint`].OutputValue')"
  else
    root_psswd_cmd="aws ssm get-parameters --names /$STAGE/$solution_name/user/root/password --output text --region $aws_region --with-decryption --query Parameters[0].Value"
    # shellcheck disable=SC2016
    website_domain_name="$(aws cloudformation describe-stacks --stack-name "$stack_name_infrastructure" --output text --region "$aws_region" --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontEndpoint`].OutputValue')"
    # shellcheck disable=SC2016
    api_endpoint="$(aws cloudformation describe-stacks --stack-name "$stack_name_backend" --output text --region "$aws_region" --query 'Stacks[0].Outputs[?OutputKey==`ServiceEndpoint`].OutputValue')"
  fi

  export ENV_NAME="${STAGE}"
  export WEBSITE_DOMAIN_NAME="${website_domain_name}"
  export WEBSITE_ENDPOINT="https://${website_domain_name}"
  export API_ENDPOINT="${api_endpoint}"

  echo "-------------------------------------------------------------------------"
  echo "Summary:"
  echo "-------------------------------------------------------------------------"
  echo "Env Name       : ${ENV_NAME}"
  echo "Solution       : ${solution_name}"
  echo "Website URL    : ${WEBSITE_ENDPOINT}"
  echo "API Endpoint   : ${API_ENDPOINT}"

  # only show profile and root password when running in an interactive terminal
  if [ -t 1 ] ; then
    [ -z "${aws_profile}" ] || echo "AWS Profile    : ${aws_profile}"
    root_passwd="$(${root_psswd_cmd})"
    echo "Root Password  : ${root_passwd}"
  else
    echo "Root Password  : execute ${root_psswd_cmd}"
  fi
  echo "-------------------------------------------------------------------------"
}

get_info