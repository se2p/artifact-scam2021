# Experiment Execution

This folder provides all necessary tooling to execute the experiments.
The following assumes that you have a terminal window open with a prompt
in the directory of this file.

## Preparations

Set up a Python virtual environment at some arbitrary path—referenced as
*<path>* from now.
Make sure to use Python 3!
To execute the execution pipeline you need to have the virtual environment
active.
```
virtualenv -p python3 <path>
source <path>/bin/activate
pip install -r requirements.txt
```

## Execution

Execute the script `./run_everything.sh`.
It will clone the LitterBox repository,
checkout revision `6b193f88`,
build LitterBox,
copy the JAR archive to the expected location,
execute the runs,
and create a `results.csv` in the `data` folder.
Afterwards, the statistical evaluation can be
performed by exeuction the Jupyter Notebook
script in the `analysis` folder.


## Changes

The single location that you might want to change is the value of the constant
`ITERATIONS` in `run_everything.sh`,
which determines how many different seeds will be executed.

The individual run configurations for a single tool run
can be configured in the `execution.py` script,
which generates a bash script for each tool invocation.
