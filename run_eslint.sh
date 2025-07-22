#!/bin/bash
cd bot-pilot-chat/frontend || exit 1
# Strip leading "bot-pilot-chat/frontend/" from all args
ARGS=()
for path in "$@"; do
  ARGS+=("${path#bot-pilot-chat/frontend/}")
done

yarn lint "${ARGS[@]}"
