#!/bin/bash
cd "$(dirname "$0")"
echo "On your phone (same Wi-Fi), open: http://$(ipconfig getifaddr en0):4000/"
echo "Press Ctrl+C to stop."
bin/jekyll serve --port 4000 --host 0.0.0.0
