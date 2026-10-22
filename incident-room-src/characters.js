/* ---------- Character avatars: a forensic team, 6 roles x 2 ---------- */
const CHAR_DEFS = [
  { id: "det-f",   role: "Detective",    skin: "#8D5524", hair: "#1F1A17", style: "long",    outfit: "trench",   hat: "none",     extra: "magnifier" },
  { id: "det-m",   role: "Detective",    skin: "#F1C9A5", hair: "#5A3A22", style: "short",   outfit: "trench",   hat: "fedora",   extra: "magnifier" },
  { id: "off-f",   role: "Officer",      skin: "#D08B5B", hair: "#3B2416", style: "bob",     outfit: "uniform",  hat: "cap",      extra: "none" },
  { id: "off-m",   role: "Officer",      skin: "#5C3A21", hair: "#151210", style: "short",   outfit: "uniform",  hat: "cap",      extra: "none" },
  { id: "sci-f",   role: "Scientist",    skin: "#EDB98A", hair: "#1B36FF", style: "hijab",   outfit: "labcoat",  hat: "goggles",  extra: "none" },
  { id: "sci-m",   role: "Scientist",    skin: "#AE5D29", hair: "#151210", style: "curly",   outfit: "labcoat",  hat: "goggles",  extra: "none" },
  { id: "ana-f",   role: "Analyst",      skin: "#F6D2B8", hair: "#8A3B12", style: "ponytail",outfit: "cardigan", hat: "glasses",  extra: "print" },
  { id: "ana-m",   role: "Analyst",      skin: "#8D5524", hair: "#151210", style: "short",   outfit: "cardigan", hat: "glasses",  extra: "print" },
  { id: "pho-f",   role: "Photographer", skin: "#5C3A21", hair: "#151210", style: "afro",    outfit: "jacket",   hat: "none",     extra: "camera" },
  { id: "pho-m",   role: "Photographer", skin: "#EDB98A", hair: "#6B4226", style: "short",   outfit: "jacket",   hat: "beanie",   extra: "camera" },
  { id: "cod-f",   role: "Codebreaker",  skin: "#D08B5B", hair: "#3B2416", style: "long",    outfit: "hoodie",   hat: "headset",  extra: "none" },
  { id: "cod-m",   role: "Codebreaker",  skin: "#F1C9A5", hair: "#D9A94A", style: "short",   outfit: "hoodie",   hat: "headset",  extra: "none" }
];
let charUid = 0;
function charSvgBody(d) {
  const uid = "c" + (++charUid);
  const ink = "#0B122C", cyan = "#00FCF1", blue = "#1B36FF", amber = "#FFC857", line = "#151210";
  const S = d.skin, Hc = d.hair;
  const OUT = { trench: "#A07A45", uniform: "#1C2B6E", labcoat: "#EEF1FA", cardigan: "#0E8C86", jacket: "#5E6B3A", hoodie: "#4B3FA0" }[d.outfit];
  let back = "", body = "", hairFront = "", hat = "", extra = "";

  /* hair behind the head */
  if (d.style === "long") back = `<path d="M18 27C18 13 46 13 46 27L47 47H17Z" fill="${Hc}"/>`;
  if (d.style === "curly") back = `<ellipse cx="32" cy="22" rx="14" ry="11" fill="${Hc}"/><circle cx="20" cy="26" r="4" fill="${Hc}"/><circle cx="44" cy="26" r="4" fill="${Hc}"/>`;
  if (d.style === "afro") back = `<circle cx="32" cy="24" r="16" fill="${Hc}"/>`;
  if (d.style === "ponytail") back = `<path d="M42 22C50 24 51 36 46 42C45 34 43 28 41 26Z" fill="${Hc}"/>`;
  if (d.style === "bob") back = `<path d="M18 26C18 13 46 13 46 26V40C46 43 41 43 41 40V30H23V40C23 43 18 43 18 40Z" fill="${Hc}"/>`;
  if (d.style === "bun") back = `<circle cx="32" cy="15" r="5" fill="${Hc}"/>`;
  if (d.style === "hijab") back = `<ellipse cx="32" cy="29" rx="15" ry="17" fill="${Hc}"/>`;

  /* body / outfit */
  body = `<path d="M9 64C11 50 20 45 32 45S53 50 55 64Z" fill="${OUT}"/>`;
  if (d.outfit === "trench") body += `<path d="M26 45L32 55L38 45Z" fill="#F4F1EA"/><path d="M24 45.6L32 58L27 64H22Z" fill="#7E5D31"/><path d="M40 45.6L32 58L37 64H42Z" fill="#7E5D31"/>`;
  if (d.outfit === "uniform") body += `<path d="M27 45L32 53L37 45Z" fill="#BFD3FF"/><path d="M31.2 50h1.6v14h-1.6z" fill="${ink}"/><path d="M40 52l3-1.2 3 1.2v3.2c0 2-1.4 3.2-3 3.8-1.6-.6-3-1.8-3-3.8z" fill="${amber}"/><rect x="14" y="49" width="7" height="2.2" rx="1" fill="${amber}" transform="rotate(-18 17.5 50)"/><rect x="43" y="49" width="7" height="2.2" rx="1" fill="${amber}" transform="rotate(18 46.5 50)"/>`;
  if (d.outfit === "labcoat") body += `<path d="M27 45L32 53L37 45Z" fill="${cyan}"/><path d="M26 46L32 60L30 64H24Z" fill="#D5DBEC"/><path d="M38 46L32 60L34 64H40Z" fill="#D5DBEC"/><rect x="40" y="54" width="6" height="5" rx="1" fill="#D5DBEC"/><rect x="42" y="51" width="1.2" height="5" fill="${blue}"/>`;
  if (d.outfit === "cardigan") body += `<path d="M27 45L32 54L37 45Z" fill="#F4F1EA"/><path d="M27 46 32 64M37 46 32 64" stroke="${cyan}" stroke-width="1.4" fill="none"/>`;
  if (d.outfit === "jacket") body += `<path d="M27 45L32 52L37 45Z" fill="#2E3A55"/><path d="M22 47L42 62" stroke="#3B2416" stroke-width="2.2"/>`;
  if (d.outfit === "hoodie") body += `<path d="M22 46C24 52 40 52 42 46" stroke="#3A3085" stroke-width="3" fill="none"/><path d="M29 50v7M35 50v7" stroke="#E9EDFA" stroke-width="1.2"/>`;

  /* head */
  let head = `<rect x="28" y="37" width="8" height="9" rx="3" fill="${S}"/>`;
  if (d.style !== "hijab") head += `<circle cx="21" cy="30" r="2.6" fill="${S}"/><circle cx="43" cy="30" r="2.6" fill="${S}"/>`;
  else head += `<path d="M17 33C17 50 47 50 47 33L44 46C40 50 24 50 20 46Z" fill="${Hc}"/>`;
  head += d.style === "hijab" ? `<ellipse cx="32" cy="30.5" rx="9.6" ry="10.8" fill="${S}"/>` : `<ellipse cx="32" cy="29" rx="11" ry="12" fill="${S}"/>`;

  /* hair in front */
  if (d.style === "short") hairFront = `<path d="M20.5 28C20 15 44 15 43.5 28C41 21 26 20 20.5 28Z" fill="${Hc}"/>`;
  if (d.style === "long") hairFront = `<path d="M20.5 29C20 15 44 15 43.5 29C40 20 30 19 26 23C24 25 22 27 20.5 29Z" fill="${Hc}"/>`;
  if (d.style === "curly") hairFront = `<path d="M21 27C21 18 43 18 43 27C40 22 24 22 21 27Z" fill="${Hc}"/>`;
  if (d.style === "afro") hairFront = `<path d="M21 26C22 18 42 18 43 26C39 22 25 22 21 26Z" fill="${Hc}"/>`;
  if (d.style === "ponytail" || d.style === "bun" || d.style === "bob") hairFront = `<path d="M20.5 27C20.5 16 43.5 16 43.5 27C38 20 26 20 20.5 27Z" fill="${Hc}"/>`;

  /* face */
  const fy = d.style === "hijab" ? 30 : 30;
  const face = `<circle cx="28" cy="${fy}" r="1.5" fill="${line}"/><circle cx="36" cy="${fy}" r="1.5" fill="${line}"/>
    <rect class="a-blink" x="25.5" y="${fy - 2}" width="13" height="4" fill="${S}"/>
    <path d="M28.6 ${fy + 5}Q32 ${fy + 7.6} 35.4 ${fy + 5}" stroke="#6B2E22" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;

  /* headwear and eyewear */
  if (d.hat === "fedora") hat = `<path d="M23 19C23 10 41 10 41 19Z" fill="#2B2B33"/><rect x="23" y="16" width="18" height="3" fill="${amber}"/><ellipse cx="32" cy="19.5" rx="16" ry="3.2" fill="#2B2B33"/>`;
  if (d.hat === "cap") hat = `<path d="M19 19C19 9 45 9 45 19Z" fill="#1C2B6E"/><rect x="19" y="17" width="26" height="4" fill="${ink}"/><path d="M22 21Q32 27 42 21Z" fill="${ink}"/><path class="a-shine" d="M32 10.5l1.3 2.7 3 .4-2.2 2 .6 3-2.7-1.5-2.7 1.5.6-3-2.2-2 3-.4z" fill="${amber}"/>`;
  if (d.hat === "goggles") hat = `<rect x="20" y="20" width="24" height="2.6" fill="#2E3A55"/><circle cx="27" cy="21.3" r="4.2" fill="${cyan}" fill-opacity=".55" stroke="#2E3A55" stroke-width="1.6"/><circle cx="37" cy="21.3" r="4.2" fill="${cyan}" fill-opacity=".55" stroke="#2E3A55" stroke-width="1.6"/><circle class="a-flash" cx="25.6" cy="20" r="1.2" fill="#fff"/>`;
  if (d.hat === "glasses") hat = `<circle cx="28" cy="30" r="3.6" fill="none" stroke="${line}" stroke-width="1.2"/><circle cx="36" cy="30" r="3.6" fill="none" stroke="${line}" stroke-width="1.2"/><path d="M31.6 30h.8" stroke="${line}" stroke-width="1.2"/>`;
  if (d.hat === "beanie") hat = `<path d="M20.5 24C20.5 9 43.5 9 43.5 24Z" fill="#B23A48"/><rect x="20" y="21" width="24" height="4.5" rx="2" fill="#8E2C39"/>`;
  if (d.hat === "headset") hat = `<path d="M19.5 30C19.5 13 44.5 13 44.5 30" stroke="#2E3A55" stroke-width="2.6" fill="none"/><rect x="16.5" y="26" width="6" height="9" rx="2.5" fill="#2E3A55"/><rect x="41.5" y="26" width="6" height="9" rx="2.5" fill="#2E3A55"/><path d="M20 34Q22 40 28 39" stroke="#2E3A55" stroke-width="1.4" fill="none"/><circle class="a-flick" cx="28.5" cy="39" r="1.6" fill="${cyan}"/>`;

  /* accessories */
  if (d.extra === "magnifier") extra = `<g class="a-bob"><circle cx="48" cy="51" r="5" fill="${cyan}" fill-opacity=".25" stroke="${cyan}" stroke-width="2"/><path d="M44.5 54.5L40 59" stroke="${cyan}" stroke-width="2.6" stroke-linecap="round"/></g>`;
  if (d.extra === "camera") extra = `<rect x="25" y="53" width="14" height="9" rx="2" fill="#20263A"/><circle cx="32" cy="57.5" r="3" fill="#56607E" stroke="#C9D2EA" stroke-width="1"/><circle class="a-flash" cx="36.8" cy="55" r="1.4" fill="${amber}"/>`;
  if (d.extra === "print") extra = `<g fill="none" stroke="${amber}" stroke-width="1" stroke-linecap="round"><path d="M40 58c0-3 1.6-5 3.5-5s3.5 2 3.5 5"/><path d="M41.6 58.5c0-2 .8-3.4 1.9-3.4s1.9 1.4 1.9 3.4"/><path class="a-scan" d="M39 56h9" stroke="${cyan}"/></g>`;

  return `<defs><clipPath id="${uid}"><circle cx="32" cy="32" r="30"/></clipPath></defs>
    <circle cx="32" cy="32" r="30" fill="${ink}"/>
    <g clip-path="url(#${uid})">${back}${body}${head}${hairFront}${face}${hat}${extra}</g>
    <circle cx="32" cy="32" r="30" fill="none" stroke="${blue}" stroke-width="2"/>`;
}
