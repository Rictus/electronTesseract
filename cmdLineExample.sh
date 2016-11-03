#!/bin/bash

URL="http://localhost:8090/imageUpload"
FIELD_NAME="image"
FILE_PATH="./testcases/testcase.jpg"

curl -X POST -F "${FIELD_NAME}=@${FILE_PATH}" $URL