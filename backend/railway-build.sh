#!/usr/bin/env bash
set -e  # Exit on any error

echo "=== Starting Railway build ==="

# 1️⃣ Ensure Python 3.12
echo "=== Checking Python version ==="
python_version=$(python --version 2>&1)
echo "Current Python version: $python_version"

if [[ $python_version != *"3.12"* ]]; then
  echo "⚠️ Warning: Python version is not 3.12. Railway default may be 3.13. Please select Python 3.12 in project settings."
fi

# 2️⃣ Upgrade pip, setuptools, wheel
echo "=== Upgrading pip, setuptools, wheel ==="
python -m pip install --upgrade pip setuptools wheel

# 3️⃣ Install Rust (needed for pydantic-core)
echo "=== Installing Rust ==="
curl https://sh.rustup.rs -sSf | sh -s -- -y
export PATH="$HOME/.cargo/bin:$PATH"

# Verify Rust installed
rustc --version
cargo --version

# Optional: cache Rust dirs for faster future builds
export CARGO_HOME="$HOME/.cargo"
export RUSTUP_HOME="$HOME/.rustup"

# 4️⃣ Install dependencies from requirements.txt
echo "=== Installing Python dependencies ==="
pip install -r requirements.txt

echo "=== Railway build finished successfully ==="
