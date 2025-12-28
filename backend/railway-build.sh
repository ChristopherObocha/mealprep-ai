#!/bin/bash
# Step 1: Install Rust
curl https://sh.rustup.rs -sSf | sh -s -- -y
export PATH="$HOME/.cargo/bin:$PATH"

# Step 2: Upgrade pip (optional but recommended)
python -m pip install --upgrade pip

# Step 3: Install dependencies
pip install -r requirements.txt
