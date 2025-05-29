type ttEntry = {
  flag: "UPPERBOUND" | "LOWERBOUND" | "EXACT";
  depth: number;
  value: number;
};

class TranspostitionTable {
  transpositionTable: Map<bigint, ttEntry>;
  constructor() {
    this.transpositionTable = new Map();
  }
  set(key: bigint, ttEntry: ttEntry) {
    this.transpositionTable.set(key, ttEntry);
  }
  get(key: bigint) {
    return this.transpositionTable.get(key);
  }
}

export { TranspostitionTable };
