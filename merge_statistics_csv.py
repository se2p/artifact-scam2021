#!/usr/bin/env python3
import sys
from pathlib import Path
from typing import List

import pandas as pd


def main(argv: List[str]) -> None:
    input_dir = Path(argv[1])
    output_file = Path(argv[2])

    combined_csv = pd.concat([pd.read_csv(i) for i in input_dir.rglob("*.csv")])
    combined_csv.to_csv(output_file, index=False, encoding="utf-8-sig")


if __name__ == '__main__':
    main(sys.argv)
