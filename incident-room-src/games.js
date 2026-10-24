/* ================= THE GAMES: one list drives the home page and the teacher's game switch =================
   Students never choose a game: they type the code from the board and land in whatever game the teacher opened. */
const GI = {
  cy: "#00FCF1", am: "#FFC857", bl: "#1B36FF", pk: "#FF8FB1", ink: "#0B122C", mu: "#8EA0DA"
};
const GAME_ICONS = {
  rapid: `<circle cx="32" cy="36" r="19" fill="none" stroke="${GI.cy}" stroke-width="4"/><rect x="27" y="9" width="10" height="6" rx="2" fill="${GI.cy}"/><path d="M32 36V24" stroke="${GI.cy}" stroke-width="4" stroke-linecap="round"/><path d="M36 30l-6 9h6l-4 9 10-12h-6l4-6z" fill="${GI.am}"/>`,
  so: `<g stroke="${GI.mu}" stroke-width="1.5" opacity=".7">${[14, 24, 34, 44, 54].map(v => `<path d="M${v} 10v44M10 ${v}h44"/>`).join("")}</g><path d="M10 34h44M34 10v44" stroke="${GI.cy}" stroke-width="2.5"/><circle cx="44" cy="24" r="7" fill="none" stroke="${GI.am}" stroke-width="3.5"/><path d="M44 13v5M44 30v5M33 24h5M50 24h5" stroke="${GI.am}" stroke-width="3" stroke-linecap="round"/>`,
  ik: `<rect x="12" y="8" width="40" height="48" rx="6" fill="none" stroke="${GI.cy}" stroke-width="3"/><circle cx="32" cy="27" r="9" fill="${GI.mu}"/><path d="M18 52c2-9 8-13 14-13s12 4 14 13z" fill="${GI.mu}"/><rect x="14" y="10" width="18" height="15" fill="${GI.am}"/><rect x="32" y="40" width="18" height="14" fill="${GI.am}"/><path d="M14 25h36M14 40h36M32 10v44" stroke="${GI.ink}" stroke-width="2"/>`,
  inquiry: `${[[20, 18, GI.cy], [36, 18, GI.mu], [12, 32, GI.mu], [28, 32, GI.cy], [44, 32, GI.am], [20, 46, GI.am], [36, 46, GI.cy]].map(([x, y, c]) => `<path d="M${x} ${y - 9}l8 4.5v9l-8 4.5-8-4.5v-9z" fill="${c}" opacity="${c === GI.mu ? .45 : 1}"/>`).join("")}`,
  trail: `<rect x="8" y="8" width="48" height="48" rx="6" fill="none" stroke="${GI.mu}" stroke-width="2.5"/><path d="M14 46h10V30h16v-12h10" fill="none" stroke="${GI.cy}" stroke-width="4" stroke-dasharray="4 4" stroke-linecap="round"/><path d="M50 10c-4 0-7 3-7 7 0 5 7 11 7 11s7-6 7-11c0-4-3-7-7-7z" fill="${GI.am}"/><circle cx="50" cy="17" r="2.6" fill="${GI.ink}"/><circle cx="14" cy="46" r="4" fill="${GI.pk}"/>`,
  lineup: `<rect x="8" y="12" width="48" height="40" rx="5" fill="${GI.bl}"/>${[0, 1, 2, 3].map(r => [0, 1, 2, 3, 4].map(c => { const f = (r === 3 && c < 4) ? GI.am : (r === 2 && c === 1) || (r === 3 && c === 4) ? GI.cy : GI.ink; return `<circle cx="${15 + c * 8.5}" cy="${19 + r * 9}" r="3.4" fill="${f}"/>`; }).join("")).join("")}<path d="M10 56h44" stroke="${GI.mu}" stroke-width="3" stroke-linecap="round"/>`,
  crimelab: `<path d="M25 8h14M28 8v16L14 50c-1.5 3 .5 6 4 6h28c3.5 0 5.5-3 4-6L36 24V8" fill="none" stroke="${GI.cy}" stroke-width="3.5" stroke-linejoin="round"/><path d="M19 44h26l4 7c.6 1.3-.2 2.5-1.6 2.5H16.6c-1.4 0-2.2-1.2-1.6-2.5z" fill="${GI.am}"/><circle cx="29" cy="38" r="2.5" fill="${GI.am}"/><circle cx="36" cy="33" r="1.8" fill="${GI.am}"/>`
};
const gameIcon = (id, cls = "") => `<svg class="gicon ${cls}" viewBox="0 0 64 64" aria-hidden="true">${GAME_ICONS[id] || ""}</svg>`;
const GAMES = [
  { id: "rapid", name: "Rapid Response", tag: "Quick-fire case questions", desc: "Spot the mistake, multiple choice, true or false, put in order and type the answer, across all 76 GCSE topics.", maths: "Every GCSE topic", modes: ["Live class", "Team showdown", "Solo"], ready: true },
  { id: "so", name: "Stakeout", tag: "Find the hidden suspect", desc: "Three surveillance reports point to one spot on a coordinate grid. Rule out points, draw the lines, make one arrest.", maths: "Coordinates and straight-line graphs", modes: ["Live class"], ready: true },
  { id: "ik", name: "The Identikit", tag: "Who, or what, is under the tiles?", desc: "Every right answer lifts tiles off a hidden graph, shape, solid, famous mathematician or catchphrase. Make one ID from the line-up.", maths: "Key terms, graphs, shapes and solids", modes: ["Live class", "Solo"], ready: true, isNew: true },
  { id: "inquiry", name: "Line of Inquiry", tag: "Claim a path across the board", desc: "Two teams win hexagons by answering. The first unbroken line across wins, so blocking matters.", maths: "Mixed revision", modes: ["Two teams"] },
  { id: "trail", name: "Case Trail", tag: "Follow the trail round the board", desc: "Move round a board of topics. Answer to claim a topic; rivals who land there face a harder question.", maths: "Longer revision lessons", modes: ["2 to 6 players or teams"] },
  { id: "lineup", name: "The Lineup", tag: "Four in a row", desc: "Answer to drop a counter. Harder questions let you choose any column.", maths: "Quick-fire practice", modes: ["1 v 1", "Teams"] },
  { id: "crimelab", name: "Crime Lab", tag: "Solve it together", desc: "A multi-step problem split between teammates: each holds one step, and nobody finishes alone.", maths: "Multi-step problems", modes: ["Teams of 3 or 4"] }
];
const READY = GAMES.filter(g => g.ready);

/* the teacher's switch between the games that are ready to host */
const gameSwitch = cur => `<div class="gameswitch" role="group" aria-label="Choose a game">
  ${READY.map(g => `<button class="gsw" data-game="${g.id}" aria-pressed="${cur === g.id}">${gameIcon(g.id, "sm")}<span>${esc(g.name)}</span>${g.isNew ? `<span class="newtag">New</span>` : ""}</button>`).join("")}
  <button class="gsw quiet" data-game="home">All games</button></div>`;
const hostGame = id => { Sound.unlock(); if (id === "home") return signIn(); store.set("ir-game", id); ({ so: soHostSetup, ik: ikHostSetup }[id] || hostSetup)(); };
const bindGameSwitch = () => app.querySelectorAll("[data-game]").forEach(b => b.onclick = () => hostGame(b.dataset.game));

function gameCard(g) {
  const acts = g.id === "ik"
    ? `<button class="btn primary" data-host="ik">Host on the board</button><button class="btn" data-iksolo>Play solo</button>`
    : g.id === "rapid"
    ? `<button class="btn primary" data-host="rapid">Host on the board</button><button class="btn" data-teams>Team showdown</button><button class="btn" data-solo>Practise solo</button>`
    : g.ready ? `<button class="btn primary" data-host="${g.id}">Host on the board</button><span class="muted small">Students: join with your teacher's code</span>`
    : `<span class="tag">Coming soon</span>`;
  return `<article class="gcard${g.ready ? " ready" : " soon"}">
    <div class="ghead">${gameIcon(g.id)}<div><h3>${esc(g.name)}${g.isNew ? ` <span class="newtag">New</span>` : ""}</h3><p class="gtag">${esc(g.tag)}</p></div></div>
    <p class="gdesc">${esc(g.desc)}</p>
    <div class="gchips"><span class="chip-s maths">${esc(g.maths)}</span>${g.modes.map(m => `<span class="chip-s">${esc(m)}</span>`).join("")}</div>
    <div class="row gacts">${acts}</div></article>`;
}
function signIn() {
  stopTimer(); S.pad = null;
  if (!S.host && !S.stu) disarmGuard();
  const last = store.get("ir-last", null);
  const canRejoin = last && Date.now() - last.t < 3 * 3600e3;
  const showUpgrade = gating() && !soloUnlimited();
  set(`${brand(liveConfigured() ? planLabel() : undefined)}
    <div class="tape"></div>
    <section class="panel joinhero">
      <div><span class="eyebrow">Playing in class?</span><h2>Type the code from the board</h2>
        <p class="muted small">One code works for every game. Your teacher has already chosen which one you're playing.</p></div>
      <form class="joinform" id="hjoin" autocomplete="off">
        <input id="hcode" class="field code-in" inputmode="numeric" maxlength="7" placeholder="000 000" aria-label="Game code">
        <button class="btn primary big" type="submit">Join the game</button>
      </form>
      ${canRejoin ? `<button class="btn" id="rejoin">Rejoin game ${esc(spaced(last.code))} as ${esc(last.name)}</button>` : ""}
    </section>
    <section class="gamesec">
      <div class="row spread"><div><span class="eyebrow">Incident Room games</span><h2>Choose a game</h2></div>
        <p class="muted small">Teachers: pick a game and show it on the board. Students join with the code.</p></div>
      <div class="games">${GAMES.map(gameCard).join("")}</div>
    </section>
    <section class="panel">
      <span class="eyebrow">Your detective</span>
      ${S.user ? `<p>Signed in as <b>${esc(S.user.name)}</b> (${esc(S.user.email)}). Your results are saved to your case record.</p>`
        : `<p class="muted">Sign in to Maths Forensics Lab with Google, Microsoft or your Lab email to save your results and earn promotions.</p>`}
      <div class="row">${S.user ? "" : `<a class="btn primary" href="${signInUrl()}">Sign in to the Lab</a>`}<button class="btn" data-solo>Practise solo</button><button class="btn" id="toRec">My case record</button>${liveConfigured() ? `<button class="btn quiet" id="toAcct">My account and plan</button>` : ""}</div>
    </section>
    ${showUpgrade ? `<section class="panel upsell"><div><span class="eyebrow">Free plan</span><h3>Unlock all 76 GCSE topics</h3><p class="muted">The Exam Pass gives you unlimited solo games, your case record and all of Maths Forensics Lab.</p></div>
      <div class="row"><a class="btn primary" href="${esc(CFG.examPassUrl || LAB_URL)}">Get the Exam Pass · ${esc(PRICES.pass)}</a></div></section>` : ""}`, true);
  document.getElementById("hjoin").onsubmit = e => { e.preventDefault(); Sound.unlock(); joinScreen(document.getElementById("hcode").value.replace(/\D/g, "").slice(0, 6)); };
  app.querySelectorAll("[data-host]").forEach(b => b.onclick = () => hostGame(b.dataset.host));
  app.querySelectorAll("[data-teams]").forEach(b => b.onclick = () => { Sound.unlock(); teamSetup(); });
  app.querySelectorAll("[data-solo]").forEach(b => b.onclick = () => profile(soloSetup));
  app.querySelectorAll("[data-iksolo]").forEach(b => b.onclick = () => profile(ikSoloSetup));
  document.getElementById("toRec").onclick = recordScreen;
  const ta = document.getElementById("toAcct"); if (ta) ta.onclick = () => accountScreen();
  const rj = document.getElementById("rejoin");
  if (rj) rj.onclick = () => { S.player.name = last.name; S.player.avatar = last.avatar; Sound.unlock(); studentJoin(last.code, last.id); };
}
