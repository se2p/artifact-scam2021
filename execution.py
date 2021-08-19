import argparse
import dataclasses
import os
import sys
from pathlib import Path
from typing import List, Union


@dataclasses.dataclass
class ExperimentSetup:
    iterations: int


@dataclasses.dataclass
class Run:
    project_name: str
    project_sources: Union[str, os.PathLike]
    iteration: int
    run_id: int


def _create_runs(
    experiment_setup: ExperimentSetup, projects: List[Path],
) -> List[Run]:
    runs: List[Run] = []
    i = 1
    for iteration in range(experiment_setup.iterations):
        for project in projects:
            runs.append(Run(
                project_name=project.name,
                project_sources=project,
                iteration=iteration,
                run_id=i,
            ))
            i += 1
    return runs


def _collect_projects(root_path: Path) -> List[Path]:
    project_path = root_path / "projects" / "json"
    projects: List[Path] = list(project_path.glob("*.json"))
    return projects


def _write_run_script(run: Run) -> None:
    base_path = Path(".").absolute()
    project_dir = base_path / "projects" / "json"
    script = f"""#!/bin/bash

RESULTS_DIR="{base_path}/litterbox-experiment-results/"

WORK_DIR=$(mktemp -d -p "{base_path}")
OUTPUT_DIR="${{WORK_DIR}}/litterbox-results"

LITTERBOX_JAR="{base_path}/Litterbox.jar"
PROJECT_DIR="{project_dir}"

mkdir -p "${{RESULTS_DIR}}"
mkdir -p "${{OUTPUT_DIR}}"

cleanup () {{
  cp "${{OUTPUT_DIR}}/output.csv" \\
      "${{RESULTS_DIR}}/result-{run.project_name}-{run.iteration}.csv" \\
      || true

  cwd=$(pwd)
  cd "${{OUTPUT_DIR}}" || true
  tar cJf \\
      "${{RESULTS_DIR}}/result-{run.project_name}-{run.iteration}.tar.xz" \\
      *.json *.sb3 *.csv || true
  cd "${{cwd}}" || true

  rm -rf "${{WORK_DIR}}" || true
}}
trap cleanup INT TERM HUP QUIT

mkdir -p "${{OUTPUT_DIR}}"

java \\
    -Xmx6g \\
    -DlogLevel=FINE \\
    -Dnsga-ii.populationSize=30 \\
    -Dnsga-ii.generations=100 \\
    -Dnsga-ii.maxSecondsRuntime=1800 \\
    -Dnsga-ii.initialProductionsPerSolution=20 \\
    -Dnsga-ii.seed={run.iteration} \\
    -jar "${{LITTERBOX_JAR}}" \\
    -r \\
    -p "${{PROJECT_DIR}}/{run.project_name}" \\
    -e "${{OUTPUT_DIR}}" \\
    -o output.csv

cleanup
"""

    with open(base_path / f"run-{run.run_id}.sh", mode="w") as f:
        f.write(script)


def _write_main_script(num_total_runs: int) -> None:
    base_path = Path(".").absolute()
    script = f"""#!/bin/bash

for i in $(seq 1 {num_total_runs}); do
    ./run-${{i}}.sh
done
"""

    with open(base_path / "run_all_experiments.sh", mode="w") as f:
        f.write(script)


def main(argv: List[str]) -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-i",
        "--iterations",
        default=30,
        dest="iterations",
        type=int,
        help="Number of iterations to be run",
    )
    config = parser.parse_args(argv[1:])
    experiment_setup = ExperimentSetup(
        iterations=config.iterations
    )
    projects: List[Path] = _collect_projects(Path(".").absolute())
    runs: List[Run] = _create_runs(experiment_setup, projects)
    for run in runs:
        _write_run_script(run)
    _write_main_script(len(runs))


if __name__ == '__main__':
    main(sys.argv)
