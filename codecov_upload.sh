#!/bin/bash
COVERAGE_FILES=(./packages/*/coverage/lcov.info)
echo "Found ${#COVERAGE_FILES[@]} Coverage Files"
for coverage_filename in "${COVERAGE_FILES[@]}"
do
    package_name=$(echo "$coverage_filename" | awk -F "/" '{print $3}')
    flag_name=$(echo "$package_name" | sed -r 's/(^|\W)(\w)/\U\2/g')
    echo "Uploading $package_name - $flag_name"
    echo "Coverage File: $coverage_filename"
    bash <(curl -s https://codecov.io/bash) -F $flag_name -f $coverage_filename -n Unittest -y ./.codecov.yml
    echo "Uploaded"
done