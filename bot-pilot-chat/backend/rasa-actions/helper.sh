#!/bin/bash

find src/actions -type f -name "*.py" | while read -r file; do
  filename="${file##*/}"
  echo "Filename without path: ${filename}"
  if [[ $filename == action_* ]]; then
    echo "Processing file: ${filename}"
    if [[ ! -s "$file" ]]; then
      echo "File is empty, starting to fill it: ${file}"
      class_name="$(echo "$filename" \
                  | sed -E 's/\.py$//' \
                  | awk -F'_' '{for(i=1;i<=NF;i++){ $i=toupper(substr($i,1,1)) tolower(substr($i,2)) }}1' OFS=""
                  )"
      action_name=$(echo "${filename}" | sed -E 's/\.py$//')
      echo "from bot_pilot_chat.domain.response import BotResponse" >> "$file"
      echo "from rasa_sdk import Action" >> "$file"
      echo "from ..utils.response_wrapper import send_response" >> "$file"

      echo "class ${class_name}(Action):" >> "$file"
      echo "  def name(self):" >> "$file"
      echo "    return '${action_name}'" >> "$file"

      echo "  def run(self, dispatcher, tracker, domain):" >> "$file"
      echo "    return []" >> "$file"
    fi
  else
    echo "Skipping file: ${file}"
  fi
done