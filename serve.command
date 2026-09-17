#!/bin/bash
cd "$(dirname "$0")"
open http://127.0.0.1:4000/
bin/jekyll serve --port 4000
