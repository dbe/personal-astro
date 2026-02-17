# Notes & Evidence

## The btc-scan case study (primary evidence)

### What was built
- Rust CLI tool: ~2,000 lines across 9 modules
- File walker, string extractor, format-aware extraction (SQLite, ZIP, gzip, tar, JSON)
- Pattern matching for 5 key types: WIF, hex, BIP39 mnemonic, xprv, mini keys
- Cryptographic validation using bitcoin/secp256k1 crates
- Address derivation: P2PKH, P2WPKH, P2SH-P2WPKH, P2TR (Taproot)
- BIP32/44/49/84/86 derivation paths for mnemonic seeds
- Bloom filter (428.5 MB) loaded with 55.6M funded Bitcoin addresses
- SQLite checkpoint DB with WAL mode for crash-safe resume
- Parallel processing via rayon

### Timeline
- Human sent ~10 messages total
- LLM wrote all code, fixed all compilation errors, debugged test vectors
- Full scan: 633,601 files in ~8 minutes (release build)
- Downloaded 1.4GB UTXO data, built bloom filter, re-scanned -- all autonomous

### Key debugging moments
- 4 compilation errors fixed in sequence (type mismatch, API signature, unused imports)
- xprv test vector had 2 extra characters causing checksum failure
- LLM added debug prints, traced to the specific error, generated valid key programmatically
- Monitored long-running scan by querying checkpoint DB every 30-120 seconds

### The steering pattern in action
1. LLM writes code, compiles -> reads compiler errors -> fixes -> recompiles
2. LLM runs tool on test data -> reads output -> identifies missing key type
3. LLM adds debug output -> re-runs -> reads debug output -> finds root cause
4. LLM runs full scan in background -> periodically queries SQLite -> calculates throughput
5. LLM notices scan stalling in walk phase -> adjusts check interval -> waits
6. LLM identifies need for UTXO data -> researches sources -> downloads -> rebuilds -> re-runs

## Research threads for expanding the piece

### LLM-optimal languages
- Rust's compiler errors as structured feedback (vs Python's runtime errors)
- Type systems as verification layers that reduce LLM iteration cycles
- The training data argument weakening as reasoning improves
- Potential characteristics of a purpose-built LLM language:
  - Extremely rich type system (dependent types?)
  - Compiler errors as structured data (JSON error output?)
  - No ambiguous constructs (one way to do everything)
  - Optimized for formal verification
  - Memory safety guaranteed at compile time

### CLI-as-interface precedent
- Unix philosophy (small composable tools) was already LLM-friendly
- jq, sqlite3, curl -- these are the building blocks of LLM orchestration
- Contrast with GUI-based development (Xcode, VS Code) -- those interfaces are for humans
- The "progress bar for machines" concept -- not visual, just queryable state

### Ephemeral programs
- Analogous to serverless functions but even more disposable
- The LLM as a "runtime" that generates, executes, and discards code
- Durable tools vs. ephemeral glue -- a useful taxonomy
- Examples: the gen_xprv.rs program that existed for 60 seconds

## Style notes
- Open with the concrete example, not the thesis
- Lead with "I just built X" not "in the future, AI will..."
- Keep the crypto/Bitcoin detail grounded -- it's the case study, not the point
- The "Tuesday" line is the closer -- this isn't a prediction, it's a trip report
