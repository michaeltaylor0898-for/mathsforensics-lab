#!/bin/sh
# Rebuilds the marking test rig (a claude.ai artifact) from the live marking code, so the rig always
# uses the same prompt, mark schemes and rules as the mark-written function.
# Needs Node. Output: eval/rig/marking-rig.html, which Claude publishes as the "Marking Test Rig" artifact.
set -e
cd "$(dirname "$0")"
cat > entry.ts <<'TS'
export { SCHEMES } from "../../supabase/functions/mark-written/schemes.ts";
export { ERRORS } from "../../supabase/functions/mark-written/errors.ts";
export { SYSTEM_PROMPT, MARKING_TOOL, schemeText, applyRules } from "../../supabase/functions/mark-written/marking.ts";
TS
npx --yes esbuild@0.24.2 entry.ts --bundle --format=iife --global-name=MF --target=es2020 --outfile=marking.js --log-level=warning
node -e "const fs=require('fs');let p=fs.readFileSync('page.html','utf8');p=p.replace('*{box-sizing:border-box}','*{box-sizing:border-box}\n[hidden]{display:none!important}');fs.writeFileSync('marking-rig.html',p.replace('/*MARKING_JS*/',()=>fs.readFileSync('marking.js','utf8')))"
rm entry.ts marking.js
echo "Built eval/rig/marking-rig.html"
