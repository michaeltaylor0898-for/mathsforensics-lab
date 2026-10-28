#!/bin/sh
# Builds the coached-paper prototype (a claude.ai artifact) from the live marking code and question bank,
# so it marks with exactly the same prompts, schemes and rules as the mark-written function.
# Needs Node. Output: eval/coached/coached-paper.html
# Mike's photo avatar is read from eval/private/mike-avatar.webp (kept out of the public repo); without it, a placeholder face is used.
set -e
cd "$(dirname "$0")"
cat > entry.ts <<'TS'
export { SCHEMES } from "../../supabase/functions/mark-written/schemes.ts";
export { ERRORS } from "../../supabase/functions/mark-written/errors.ts";
export { SYSTEM_PROMPT, MARKING_TOOL, schemeText, applyRules, CHECK_PROMPT, CHECK_TOOL, checkText, applyCheck, MONITOR_PROMPT, MONITOR_TOOL, monitorText, applyMonitor } from "../../supabase/functions/mark-written/marking.ts";
TS
npx --yes esbuild@0.24.2 entry.ts --bundle --format=iife --global-name=MF --target=es2020 --outfile=marking.js --log-level=warning
node -e "const fs=require('fs');let p=fs.readFileSync('page.html','utf8');
const av='../private/mike-avatar.webp';
if(fs.existsSync(av)){const uri='data:image/webp;base64,'+fs.readFileSync(av).toString('base64');p=p.replace(/<!--AVATAR-->[\\s\\S]*?<!--\\/AVATAR-->/,'<img src=\\''+uri+'\\' alt=\\'\\'>')}
fs.writeFileSync('coached-paper.html',p.replace('/*MARKING_JS*/',()=>fs.readFileSync('marking.js','utf8').replace(/<\/script/gi,'<\\\\/script')))"
rm entry.ts marking.js
echo "Built eval/coached/coached-paper.html"
