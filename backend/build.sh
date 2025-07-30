#!/bin/bash

# Install Rust for pydantic compilation
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env

# Set environment variables for Rust
export CARGO_HOME=$HOME/.cargo
export PATH=$CARGO_HOME/bin:$PATH

# Install Python dependencies
pip install -r requirements.txt

echo "Build completed successfully!" 