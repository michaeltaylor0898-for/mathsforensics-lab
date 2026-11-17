const fs=require('fs');eval(fs.readFileSync(process.argv[2],'utf8')+';global.KUG=KUG;');
let bad=0, samples={};
for (const id of KUG.IDS) for (const lv of [1,2,3]) { let nulls=0, briefs=new Set();
  for (let i=0;i<3000;i++){ let q; try{q=KUG.G[id](lv);}catch(e){console.log('THROW',id,lv,e.message);bad++;break;}
    if(!q){nulls++;continue;} briefs.add(q.brief);
    const t=JSON.stringify(q);
    if(q.opts.length!==4||new Set(q.opts).size!==4||q.a<0||/NaN|undefined|Infinity|null/.test(t)){ if(bad<15)console.log('BAD',id,lv,t); bad++; }
    const k=id+lv; (samples[k]=samples[k]||[]); if(samples[k].length<3) samples[k].push(q.brief+' => '+q.opts[q.a]+'  | '+q.opts.filter((_,j)=>j!==q.a).join(' ; '));
  }
  console.log(id,lv,'null%',(nulls/30).toFixed(1),'distinct',briefs.size);
}
console.log('bad',bad); for(const k in samples) console.log(k, samples[k].join('\n    '));
