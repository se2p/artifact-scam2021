#!/bin/bash

readonly ITERATIONS=30

readonly SCRIPT=$(realpath "${0}")
readonly BASE_PATH=$(dirname "${SCRIPT}")
readonly PID=$$
readonly START_TIME=$(date +"%Y-%m-%d_%H%M%S")

function my_echo {
  BLUE='\033[0;34m'
  NC='\033[0m'
  printf "${BLUE}${1}${NC}\n"
}

function sig_handler {
  my_echo "Killing ${0} and all its children..."
  pkill -TERM -P "${PID}"
  my_echo "Terminated: ${0}"
}
trap sig_handler INT TERM HUP QUIT

function cleanup() {
  my_echo "Cleaning up..."
  rm -rf "${BASE_PATH}/../data"
  rm -rf "${BASE_PATH}/litterbox-runs"
  rm -rf "${BASE_PATH}/litterbox-experiment-results"
  find "${BASE_PATH}" -name "run-*.sh" -exec rm {} \;
  if [[ -f "${BASE_PATH}/run_all_experiments.sh" ]]; then
      rm "${BASE_PATH}/run_all_experiments.sh"
  fi
}

function prepare_litterbox() {
  if [[ -z "$(ls -A ${BASE_PATH}/LitterBox)" ]]; then
      git submodule update --init --recursive
  fi
  cwd=$(pwd)
  cd "${BASE_PATH}/LitterBox" || exit 1
  git checkout 6b193f88
  git rev-parse --short HEAD > "${BASE_PATH}/LitterBox.version"
  my_echo "Building LitterBox"
  mvn -DskipTests=true package
  my_echo "Copy LitterBox.jar"
  cp target/Litterbox-1.6-SNAPSHOT.jar "${BASE_PATH}/Litterbox.jar"
  my_echo "LitterBox is ready"
  cd "${cwd}" || exit 1
}

function generate_scripts() {
  my_echo "Generate run scripts..."
  python execution.py -i "${ITERATIONS}"
  chmod +x *.sh
}

function merge_csvs() {
  my_echo "Merge CSV files..."
  mkdir -p "$(pwd)/data"
  python merge_statistics_csv.py ./litterbox-experiment-results ./data/results.csv
}

function run() {
  my_echo "Execute experiments..."
  ./run_all_experiments.sh
}

function main() {
  cleanup
  prepare_litterbox
  generate_scripts
  run
  merge_csvs
}

main
