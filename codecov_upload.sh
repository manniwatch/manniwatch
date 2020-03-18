#!/bin/bash
COVERAGE_FILES=(./packages/*/coverage/lcov.info)
COVERAGE_FILES+=(./packages/*/coverage/**/lcov.info)
npm install coveralls -g
echo "Found ${#COVERAGE_FILES[@]} Coverage Files"
export COVERALLS_PARALLEL=true
export COVERALLS_SERVICE_JOB_ID=$GITHUB_RUN_ID
for coverage_filename in "${COVERAGE_FILES[@]}"
do
    package_name=$(echo "$coverage_filename" | awk -F "/" '{print $3}')
    flag_name=$(echo "$package_name" | sed -r 's/(^|\W)(\w)/\U\2/g')
    echo "Uploading $package_name - $flag_name"
    echo "Coverage File: $coverage_filename"
    sed -i 's/SF\:src/SF\:'"${GITHUB_WORKSPACE//\//\\/}"'\/packages\/'"$package_name"'\/src/g' $coverage_filename
    export COVERALLS_FLAG_NAME=$flag_name
    #cat $coverage_filename | coveralls -v
    echo "Uploaded"
done
unset COVERALLS_PARALLEL
curl -k https://coveralls.io/webhook?repo_token=$COVERALLS_REPO_TOKEN -d "payload[build_num]=$GITHUB_RUN_ID&payload[status]=done"
