import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════
   EDUMARK AI — COMBINED APP
   Includes: Landing · Login · Register · Teacher Portal ·
             Student Portal · Admin Dashboard
   Admin login: admin@edumark.ai / admin123
═══════════════════════════════════════════════════════════════════ */

/* ─── DESIGN TOKENS ──────────────────────────────────────────────── */
const G = {
  ink:"#0d1117", inkSoft:"#1e2530", inkMuted:"#3d4a5c",
  paper:"#f5f2eb", paperWarm:"#ede9df", paperDark:"#ddd8cc",
  gold:"#c8a84b", goldLt:"#e8c96a", goldPale:"#f7efd4",
  green:"#2d6a4f", greenLt:"#52b788", greenPale:"#d8f3dc",
  red:"#9b2226", redLt:"#e74c3c", redPale:"#fde8e9",
  blue:"#1a3a5c", blueLt:"#4a90d9", bluePale:"#dceeff",
  orange:"#d4731a", orangePale:"#fdecd8",
  purple:"#5a3d8a", purplePale:"#ede8f7",
};

/* ─── GLOBAL CSS ─────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:${G.paper};color:${G.ink};font-size:14px;line-height:1.5;}
h1,h2,h3,h4{font-family:'Syne',sans-serif;line-height:1.2;}
input,select,textarea{width:100%;padding:9px 12px;border:1.5px solid ${G.paperDark};border-radius:9px;font-family:'DM Sans',sans-serif;font-size:13px;color:${G.ink};background:white;outline:none;transition:border-color .15s;}
input:focus,select:focus,textarea:focus{border-color:${G.gold};box-shadow:0 0 0 3px rgba(200,168,75,.1);}
textarea{resize:vertical;min-height:70px;}
input[type=radio],input[type=checkbox]{width:auto;accent-color:${G.gold};cursor:pointer;}
label{display:block;font-size:12px;font-weight:500;margin-bottom:4px;color:${G.ink};}
table{width:100%;border-collapse:collapse;}
th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:${G.inkMuted};padding:8px 14px;border-bottom:1.5px solid ${G.paperDark};font-weight:600;white-space:nowrap;}
td{padding:10px 14px;border-bottom:1px solid ${G.paperWarm};font-size:13px;vertical-align:middle;}
tr:last-child td{border-bottom:none;}
tr:hover td{background:${G.paperWarm};}
.tbl-wrap{overflow-x:auto;}
.pb{height:6px;background:${G.paperDark};border-radius:3px;overflow:hidden;}
.pb-fill{height:100%;border-radius:3px;transition:width .8s;}
.divider{height:1.5px;background:${G.paperDark};margin:14px 0;}
.text-muted{color:${G.inkMuted};font-size:12px;}
.fg{margin-bottom:14px;}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
.flex{display:flex;}.aic{align-items:center;}.jb{justify-content:space-between;}.gap2{gap:8px;}.gap3{gap:12px;}.wrap{flex-wrap:wrap;}
.mb2{margin-bottom:8px;}.mb3{margin-bottom:12px;}.mb4{margin-bottom:16px;}.mt4{margin-top:14px;}
.fw7{font-weight:700;}
.tabs{display:flex;border-bottom:1.5px solid ${G.paperDark};margin-bottom:16px;overflow-x:auto;scrollbar-width:none;}
.tabs::-webkit-scrollbar{display:none;}
.fadeUp{animation:fadeUp .2s ease;}
.sidebar-desktop{display:flex;}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes pulse2{0%,100%{transform:scale(1)}50%{transform:scale(1.4)}}
@keyframes slideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes mIn{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}
@media(max-width:720px){
  .g4{grid-template-columns:1fr 1fr;}
  .g3{grid-template-columns:1fr;}
  .g2{grid-template-columns:1fr;}
  .hide-mob{display:none!important;}
  .sidebar-desktop{display:none!important;}
}
`;

/* ═══════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
═══════════════════════════════════════════════════════════════════ */

const Btn = ({ children, onClick, variant="ink", sm, full, disabled, style={} }) => {
  const base = { display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6, padding:sm?"7px 12px":"10px 18px", borderRadius:9, fontFamily:"'DM Sans',sans-serif", fontSize:sm?12:13, fontWeight:500, cursor:disabled?"not-allowed":"pointer", border:"none", transition:"all .15s", whiteSpace:"nowrap", opacity:disabled?.5:1, width:full?"100%":undefined, ...style };
  const v = {
    ink:   { background:G.ink,    color:G.gold },
    gold:  { background:G.gold,   color:G.ink,   fontWeight:600 },
    green: { background:G.green,  color:"white", fontWeight:600 },
    ghost: { background:"transparent", color:G.ink, border:`1.5px solid ${G.paperDark}` },
    danger:{ background:G.redPale, color:G.red,  border:`1px solid #f5c0c2` },
    blue:  { background:G.blueLt, color:"white", fontWeight:600 },
    orange:{ background:G.orange, color:"white", fontWeight:600 },
  };
  return <button onClick={!disabled?onClick:undefined} style={{...base,...(v[variant]||v.ink)}}>{children}</button>;
};

const Badge = ({ type, children, dot }) => {
  const m = {
    green:`${G.greenPale};${G.green};#b7e4c7`,
    gold:`${G.goldPale};#8a6d10;#e0c060`,
    red:`${G.redPale};${G.red};#f5c0c2`,
    blue:`${G.bluePale};${G.blue};#b8d8f5`,
    gray:`${G.paperWarm};${G.inkMuted};${G.paperDark}`,
    orange:`${G.orangePale};${G.orange};#f0c090`,
    purple:`${G.purplePale};${G.purple};#c5b3e8`,
  };
  const [bg,color,border] = (m[type]||m.gray).split(";");
  return <span style={{ display:"inline-flex", alignItems:"center", gap:dot?5:0, padding:"3px 9px", borderRadius:100, fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em", whiteSpace:"nowrap", background:bg, color, border:`1px solid ${border}` }}>{dot&&<span style={{width:6,height:6,borderRadius:"50%",background:color,flexShrink:0}}/>}{children}</span>;
};

const Card = ({ children, style={}, onClick }) => (
  <div onClick={onClick} style={{ background:"white", borderRadius:12, border:`1.5px solid ${G.paperDark}`, padding:18, boxShadow:"0 2px 10px rgba(13,17,23,.07)", ...style }}>{children}</div>
);

// Used in teacher/student panels
const StatCard = ({ accent, label, value, sub }) => (
  <Card>
    <div style={{ height:3, borderRadius:2, background:accent, marginBottom:10 }} />
    <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.05em", color:G.inkMuted, marginBottom:4 }}>{label}</div>
    <div style={{ fontFamily:"Syne,sans-serif", fontSize:24, fontWeight:800 }}>{value}</div>
    {sub && <div style={{ fontSize:11, color:G.inkMuted, marginTop:2 }}>{sub}</div>}
  </Card>
);

// Used in admin panels
const KpiCard = ({ icon, label, value, sub, change, color=G.gold }) => (
  <Card style={{ position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:color, borderRadius:"12px 12px 0 0" }} />
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
      <div style={{ width:40, height:40, background:`${color}22`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
      {change !== undefined && <span style={{ fontSize:11, fontWeight:600, color:change>=0?G.greenLt:G.red, background:change>=0?G.greenPale:G.redPale, padding:"2px 8px", borderRadius:100 }}>{change>=0?"+":""}{change}%</span>}
    </div>
    <div style={{ fontSize:28, fontWeight:800, fontFamily:"Syne,sans-serif", marginBottom:3 }}>{value}</div>
    <div style={{ fontSize:12, fontWeight:500, color:G.ink, marginBottom:2 }}>{label}</div>
    {sub && <div className="text-muted">{sub}</div>}
  </Card>
);

const Logo = ({ onClick, dark }) => (
  <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:7, background:"transparent", border:"none", cursor:"pointer", fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:17, color:dark?G.ink:"white", padding:0, transition:"opacity .15s" }}
    onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
    <div style={{ width:30, height:30, background:G.gold, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", color:G.ink, fontSize:13, fontWeight:800, flexShrink:0 }}>E</div>
    EduMark <span style={{ color:G.gold, marginLeft:3 }}>AI</span>
  </button>
);

const Toast = ({ msg, type="info", onDone }) => {
  useEffect(()=>{ const t=setTimeout(onDone,3500); return()=>clearTimeout(t); },[]);
  const border = { info:G.gold, success:G.greenLt, error:G.red, warning:G.gold }[type]||G.gold;
  const bg = { info:G.ink, success:G.green, error:G.red, warning:"#7a4a00" }[type]||G.ink;
  return <div style={{ position:"fixed", top:16, right:16, background:bg, color:"white", padding:"11px 16px", borderRadius:10, fontSize:13, zIndex:9999, borderLeft:`4px solid ${border}`, boxShadow:"0 8px 28px rgba(13,17,23,.25)", maxWidth:290, fontFamily:"'DM Sans',sans-serif", animation:"slideIn .3s ease" }}>{msg}</div>;
};

const Modal = ({ open, onClose, title, children, width=520 }) => {
  if (!open) return null;
  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{ position:"fixed", inset:0, background:"rgba(13,17,23,.65)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)", padding:16 }}>
      <div style={{ background:"white", borderRadius:14, padding:28, width:"100%", maxWidth:width, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 60px rgba(13,17,23,.3)", animation:"fadeUp .2s ease" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontFamily:"Syne,sans-serif", fontSize:18, fontWeight:800 }}>{title}</div>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:G.inkMuted, lineHeight:1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Spinner = ({ size=48, color=G.gold }) => (
  <div style={{ width:size, height:size, border:`3px solid ${G.paperDark}`, borderTopColor:color, borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto 16px" }} />
);

const ProgressBar = ({ value, color=G.gold }) => (
  <div className="pb"><div className="pb-fill" style={{ width:`${value}%`, background:color }} /></div>
);

const DonutChart = ({ segments, size=80, label }) => {
  let total = segments.reduce((s,x)=>s+x.value,0);
  let cum = 0;
  const r = size/2-8, cx = size/2, cy = size/2;
  const paths = segments.map((seg,i)=>{
    const s1 = (cum/total)*360-90; cum+=seg.value;
    const e1 = (cum/total)*360-90;
    const p1={x:cx+r*Math.cos(s1*Math.PI/180),y:cy+r*Math.sin(s1*Math.PI/180)};
    const p2={x:cx+r*Math.cos(e1*Math.PI/180),y:cy+r*Math.sin(e1*Math.PI/180)};
    return <path key={i} d={`M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${e1-s1>180?1:0} 1 ${p2.x} ${p2.y} Z`} fill={seg.color} opacity={0.9}/>;
  });
  return (
    <div style={{ position:"relative", display:"inline-block" }}>
      <svg width={size} height={size}>{paths}<circle cx={cx} cy={cy} r={r*0.6} fill="white"/></svg>
      {label&&<div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",lineHeight:1.1 }}>
        <div style={{ fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:13 }}>{label.main}</div>
        <div style={{ fontSize:9,color:G.inkMuted }}>{label.sub}</div>
      </div>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   GEOGRAPHIC & STATIC DATA
═══════════════════════════════════════════════════════════════════ */
const SA_GEO = {
  "Gauteng":{code:"GP",districts:{"City of Tshwane":{municipalities:{"Tshwane Central":35,"Tshwane North":30,"Mamelodi":32,"Soshanguve":38}},"City of Johannesburg":{municipalities:{"Johannesburg Central":45,"Soweto":60,"Sandton":40,"Midrand":25}},"Ekurhuleni Metro":{municipalities:{"Boksburg":20,"Benoni":22,"Kempton Park":24}},"West Rand District":{municipalities:{"Mogale City":49,"Rand West City":37}}}},
  "KwaZulu-Natal":{code:"KZN",districts:{"eThekwini Metro":{municipalities:{"Durban Central":55,"Durban North":38,"Pinetown":25,"Umlazi":35}},"uMgungundlovu District":{municipalities:{"Msunduzi":45,"uMngeni":18}},"King Cetshwayo District":{municipalities:{"uMhlathuze":35}}}},
  "Western Cape":{code:"WC",districts:{"City of Cape Town":{municipalities:{"Cape Town Central":55,"Cape Town Southern":38,"Khayelitsha":45,"Mitchells Plain":40}},"Cape Winelands District":{municipalities:{"Stellenbosch":30,"Drakenstein":35}},"Eden District":{municipalities:{"George":28,"Mossel Bay":22}}}},
  "Eastern Cape":{code:"EC",districts:{"Buffalo City Metro":{municipalities:{"Buffalo City":130}},"Nelson Mandela Bay Metro":{municipalities:{"Nelson Mandela Bay":120}},"Amathole District":{municipalities:{"Mnquma":28,"Mbhashe":25}},"OR Tambo District":{municipalities:{"King Sabata Dalindyebo":30}}}},
  "Limpopo":{code:"LP",districts:{"Capricorn District":{municipalities:{"Polokwane":50,"Lepelle-Nkumpi":22}},"Mopani District":{municipalities:{"Greater Tzaneen":30,"Greater Giyani":25}},"Vhembe District":{municipalities:{"Thulamela":35,"Makhado":30}}}},
  "Mpumalanga":{code:"MP",districts:{"Ehlanzeni District":{municipalities:{"City of Mbombela":55,"Bushbuckridge":42}},"Nkangala District":{municipalities:{"Emalahleni":38,"Steve Tshwete":28}}}},
  "Free State":{code:"FS",districts:{"Mangaung Metro":{municipalities:{"Mangaung":97}},"Thabo Mofutsanyana District":{municipalities:{"Maluti-a-Phofung":42}}}},
  "North West":{code:"NW",districts:{"Bojanala Platinum District":{municipalities:{"Rustenburg":42,"Madibeng":32}},"Dr Kenneth Kaunda District":{municipalities:{"City of Matlosana":42}}}},
  "Northern Cape":{code:"NC",districts:{"Frances Baard District":{municipalities:{"Sol Plaatje":30}},"ZF Mgcawu District":{municipalities:{"Dawid Kruiper":14}}}},
};

const SCHOOL_DB_INIT = [
  {id:"GP-0001",name:"Hoerskool Pretoria Noord",type:"Public Secondary",province:"Gauteng",district:"City of Tshwane",municipality:"Tshwane North",ward:"Ward 12"},
  {id:"GP-0002",name:"Pretoria High School for Girls",type:"Public Secondary",province:"Gauteng",district:"City of Tshwane",municipality:"Tshwane Central",ward:"Ward 5"},
  {id:"GP-0003",name:"St Albans College Pretoria",type:"Independent Secondary",province:"Gauteng",district:"City of Tshwane",municipality:"Tshwane East",ward:"Ward 3"},
  {id:"JHB-0001",name:"Johannesburg High School",type:"Public Secondary",province:"Gauteng",district:"City of Johannesburg",municipality:"Johannesburg Central",ward:"Ward 15"},
  {id:"KZN-0001",name:"Durban Girls High School",type:"Public Secondary",province:"KwaZulu-Natal",district:"eThekwini Metro",municipality:"Durban North",ward:"Ward 18"},
  {id:"WC-0001",name:"SACS South African College Schools",type:"Independent Secondary",province:"Western Cape",district:"City of Cape Town",municipality:"Cape Town Southern",ward:"Ward 58"},
  {id:"WC-0002",name:"Rondebosch Boys High School",type:"Public Secondary",province:"Western Cape",district:"City of Cape Town",municipality:"Cape Town Southern",ward:"Ward 60"},
  {id:"EC-0001",name:"Grahamstown High School",type:"Public Secondary",province:"Eastern Cape",district:"Buffalo City Metro",municipality:"Buffalo City",ward:"Ward 4"},
];

const DEMO_ASSESSMENTS = [
  { id:"a1", title:"Term 2 Mathematics Test", subject:"Mathematics", grade:"Grade 11", totalMarks:20, duration:90, status:"live", due:"24 Feb 2026",
    instructions:"Answer ALL questions. Show ALL working — method marks apply.",
    questions:[
      {id:"q1",number:"Q1",text:"Solve for x: 2x² - 50 = 0. Show all working.",marks:4,memo:"x = 5 or x = -5. Award 2 marks for correct method, 1 mark each correct solution.",type:"maths"},
      {id:"q2",number:"Q2",text:"Use the quadratic formula to solve: x² + 3x - 10 = 0. Show all steps including the discriminant.",marks:6,memo:"Discriminant=49. x=2 or x=-5. Award: 1 mark formula, 2 marks discriminant, 1 mark substitution, 1 mark each root.",type:"maths"},
      {id:"q3",number:"Q3",text:"State Newton's Third Law and give a real-world example with the action-reaction pair identified.",marks:4,memo:"Equal and opposite forces act on DIFFERENT objects. Must name both objects and both forces.",type:"science"},
      {id:"q4",number:"Q4",text:"A car accelerates from rest to 90 km/h in 10 seconds. Calculate (a) acceleration and (b) distance covered.",marks:6,memo:"Convert: 25 m/s. a=2.5 m/s². s=125 m. Award marks for conversion, formula, answer with unit.",type:"maths"},
    ]
  },
  { id:"a2", title:"Life Sciences Chapter 3 Quiz", subject:"Life Sciences", grade:"Grade 10", totalMarks:15, duration:45, status:"live", due:"26 Feb 2026",
    instructions:"Answer all questions in full sentences where applicable.",
    questions:[
      {id:"q5",number:"Q1",text:"Explain the process of osmosis. Include the role of the semi-permeable membrane and direction of water movement.",marks:5,memo:"Osmosis: water from high to low concentration through semi-permeable membrane. Must mention: membrane, direction, concentration gradient.",type:"biology"},
      {id:"q6",number:"Q2",text:"Describe three differences between mitosis and meiosis.",marks:6,memo:"Any 3 correct differences (2 marks each): cells produced, chromosome number, purpose, crossing over.",type:"biology"},
      {id:"q7",number:"Q3",text:"What is the function of mitochondria? Explain using the term cellular respiration.",marks:4,memo:"Mitochondria = site of cellular respiration. Convert glucose+oxygen to ATP, CO2 and water. Must mention ATP or energy production.",type:"biology"},
    ]
  }
];

/* Admin seed data */
const ADMIN_SCHOOLS_INIT = [
  {id:"GP-0001",name:"Hoerskool Pretoria Noord",type:"Public Secondary",province:"Gauteng",district:"City of Tshwane",municipality:"Tshwane North",ward:"Ward 12",teachers:8,students:142,plan:"School",status:"active",contact:"012 345 6789",email:"admin@pretorianorth.co.za",joined:"2026-01-10",monthlySubmissions:284},
  {id:"GP-0002",name:"Pretoria High School for Girls",type:"Public Secondary",province:"Gauteng",district:"City of Tshwane",municipality:"Tshwane Central",ward:"Ward 5",teachers:12,students:210,plan:"School",status:"active",contact:"012 456 7890",email:"info@phsg.co.za",joined:"2026-01-12",monthlySubmissions:420},
  {id:"JHB-0001",name:"Johannesburg High School",type:"Public Secondary",province:"Gauteng",district:"City of Johannesburg",municipality:"Johannesburg North",ward:"Ward 15",teachers:6,students:98,plan:"Starter",status:"active",contact:"011 234 5678",email:"office@joburg-high.co.za",joined:"2026-02-01",monthlySubmissions:156},
  {id:"KZN-0001",name:"Durban Girls High School",type:"Public Secondary",province:"KwaZulu-Natal",district:"eThekwini Metro",municipality:"Durban North",ward:"Ward 18",teachers:4,students:67,plan:"Starter",status:"active",contact:"031 345 6789",email:"dghs@edu.co.za",joined:"2026-02-15",monthlySubmissions:89},
  {id:"WC-0001",name:"SACS South African College Schools",type:"Independent Secondary",province:"Western Cape",district:"City of Cape Town",municipality:"Cape Town Southern",ward:"Ward 58",teachers:3,students:45,plan:"Trial",status:"trial",contact:"021 234 5678",email:"info@sacs.co.za",joined:"2026-04-01",monthlySubmissions:12},
  {id:"WC-0002",name:"Rondebosch Boys High School",type:"Public Secondary",province:"Western Cape",district:"City of Cape Town",municipality:"Cape Town Southern",ward:"Ward 60",teachers:0,students:0,plan:"—",status:"pending",contact:"021 345 6789",email:"rhs@edu.co.za",joined:"2026-04-20",monthlySubmissions:0},
];

const ADMIN_ASSESSMENTS_INIT = [
  {id:"a1",title:"Term 2 Mathematics Test",subject:"Mathematics",grade:"Grade 11",school:"GP-0001",teacher:"N. Dlamini",created:"2026-02-20",due:"2026-02-24",status:"live",submissions:28,marked:28,avgScore:64,totalMarks:100},
  {id:"a2",title:"Life Sciences Ch3 Quiz",subject:"Life Sciences",grade:"Grade 10",school:"GP-0001",teacher:"N. Dlamini",created:"2026-02-18",due:"2026-02-26",status:"live",submissions:15,marked:15,avgScore:71,totalMarks:50},
  {id:"a3",title:"Physical Science Test",subject:"Physical Science",grade:"Grade 11",school:"GP-0002",teacher:"S. Nkosi",created:"2026-02-15",due:"2026-02-20",status:"closed",submissions:42,marked:42,avgScore:58,totalMarks:80},
  {id:"a4",title:"Mathematics Assignment",subject:"Mathematics",grade:"Grade 12",school:"JHB-0001",teacher:"K. Sithole",created:"2026-02-10",due:"2026-02-17",status:"closed",submissions:30,marked:29,avgScore:72,totalMarks:60},
  {id:"a5",title:"English Essay Assessment",subject:"English HL",grade:"Grade 11",school:"KZN-0001",teacher:"L. Mbatha",created:"2026-02-22",due:"2026-03-01",status:"draft",submissions:0,marked:0,avgScore:0,totalMarks:40},
];

const ACTIVITY_LOG = [
  {id:1,type:"submit",msg:"Thabo Mokoena submitted Term 2 Maths Test",school:"GP-0001",time:"2 min ago",icon:"📝",severity:"info"},
  {id:2,type:"mark",msg:"Claude AI marked 28 scripts for Term 2 Maths (avg: 64%)",school:"GP-0001",time:"2 min ago",icon:"🤖",severity:"success"},
  {id:3,type:"register",msg:"New teacher registered: Aarav Patel (WC-0001)",school:"WC-0001",time:"3 hrs ago",icon:"👤",severity:"info"},
  {id:4,type:"school",msg:"New school pending approval: Rondebosch Boys High",school:"WC-0002",time:"3 hrs ago",icon:"🏫",severity:"warning"},
  {id:5,type:"publish",msg:"Assessment published: Accounting Term Test (GP-0002)",school:"GP-0002",time:"13 hrs ago",icon:"📊",severity:"info"},
  {id:6,type:"error",msg:"API timeout on 2 submissions — auto-retried successfully",school:"KZN-0001",time:"1 day ago",icon:"⚠️",severity:"warning"},
  {id:7,type:"plan",msg:"School GP-0001 renewed School plan (R4 500/month)",school:"GP-0001",time:"2 days ago",icon:"💳",severity:"success"},
];

/* ─── CLAUDE MARKING ENGINE ──────────────────────────────────────── */
async function markWithClaude(question, studentAnswer, memo, subject) {
  const prompt = `You are an experienced South African school examiner marking a ${subject} assessment according to the CAPS curriculum.

QUESTION: ${question.text}
TOTAL MARKS: ${question.marks}
MEMORANDUM / MARKING GUIDELINES: ${memo}
STUDENT'S ANSWER: "${studentAnswer}"

Mark this answer strictly according to the memorandum. Apply method marks where applicable.

Respond ONLY with valid JSON, no markdown:
{"marks_awarded":<number>,"marks_available":${question.marks},"percentage":<number>,"verdict":"correct"|"partial"|"wrong","feedback":"<specific feedback max 60 words>","method_marks_awarded":<true|false>,"key_elements_present":["<el>"],"key_elements_missing":["<el>"]}`;

  const res = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:500,messages:[{role:"user",content:prompt}]})
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return JSON.parse(data.content[0].text.trim().replace(/```json|```/g,"").trim());
}

async function generateStudyPlan(results, assessmentTitle, subject) {
  const summary = results.map(r=>({student:r.studentName,pct:Math.round((r.totalMarks/r.totalAvailable)*100)}));
  const avg = Math.round(summary.reduce((s,r)=>s+r.pct,0)/summary.length);
  const res = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,messages:[{role:"user",content:`South African CAPS educator. Assessment: "${assessmentTitle}" (${subject}). Results: ${JSON.stringify(summary)}. Class avg: ${avg}%. Generate 3 short actionable recommendations. Respond ONLY with JSON: {"class_average":${avg},"recommendations":[{"title":"<short>","detail":"<1-2 sentences>"},{"title":"","detail":""},{"title":"","detail":""}]}`}]})
  });
  const data = await res.json();
  return JSON.parse(data.content[0].text.trim().replace(/```json|```/g,"").trim());
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP — SINGLE DEFAULT EXPORT
═══════════════════════════════════════════════════════════════════ */
export default function EduMarkApp() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [users, setUsers] = useState([
    {id:"u1",email:"teacher@demo.co.za",password:"demo123",role:"teacher",fname:"Nomsa",lname:"Dlamini",sace:"PR 1234567",schools:[{id:"GP-0001",name:"Hoerskool Pretoria Noord"},{id:"GP-0002",name:"Pretoria High School for Girls"}],province:"Gauteng",district:"City of Tshwane",municipality:"Tshwane North",ward:"Ward 12",status:"active",plan:"School",submissions:87,created:"2026-01-15",lastLogin:"2026-04-22"},
    {id:"u2",email:"student@demo.co.za",password:"demo123",role:"student",fname:"Thabo",lname:"Mokoena",grade:"Grade 11",schools:[{id:"GP-0001",name:"Hoerskool Pretoria Noord"}],province:"Gauteng",district:"City of Tshwane",municipality:"Tshwane North",ward:"Ward 12",status:"active",plan:"School",submissions:12,created:"2026-01-20",lastLogin:"2026-04-23"},
    {id:"u3",email:"admin@edumark.ai",password:"admin123",role:"admin",fname:"Super",lname:"Admin",schools:[],province:"Gauteng",district:"—",municipality:"—",ward:"—",status:"active",plan:"—",submissions:0,created:"2026-01-01",lastLogin:"2026-04-23"},
  ]);
  const [allResults, setAllResults] = useState([]);
  const [schoolDB, setSchoolDB] = useState(SCHOOL_DB_INIT);
  const [schoolCounters, setSchoolCounters] = useState({GP:3,KZN:1,WC:2,EC:1});
  const [adminSchools, setAdminSchools] = useState(ADMIN_SCHOOLS_INIT);
  const [adminAssessments, setAdminAssessments] = useState(ADMIN_ASSESSMENTS_INIT);

  const notify = (msg, type="info") => setToast({msg, type});
  const go = page => { setScreen(page); window.scrollTo(0,0); };

  const login = (email, password) => {
    const found = users.find(u=>u.email===email && u.password===password);
    if (!found) return false;
    setUser(found);
    if (found.role==="admin") go("admin");
    else if (found.role==="teacher") go("teacher");
    else go("student");
    notify(`Welcome back, ${found.fname}!`, "success");
    return true;
  };

  const register = (newUser) => {
    const nu = {...newUser, id:"u"+Date.now(), status:"active", submissions:0, created:new Date().toLocaleDateString("en-ZA"), lastLogin:"never", plan:"Trial"};
    setUsers(prev=>[...prev, nu]);
    setUser(nu);
    go(nu.role==="teacher"?"teacher":"student");
    notify(`Welcome to EduMark AI, ${nu.fname}!`, "success");
  };

  const addResult = result => setAllResults(prev=>[...prev, result]);
  const addSchool = school => { setSchoolDB(prev=>[...prev,school]); setAdminSchools(prev=>[...prev,{...school,teachers:0,students:0,plan:"Trial",status:"trial",contact:"",email:"",joined:new Date().toLocaleDateString("en-ZA"),monthlySubmissions:0}]); };

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:G.paper, minHeight:"100vh", color:G.ink }}>
      <style>{css}</style>
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)} />}
      {screen==="landing"  && <Landing onNav={go} />}
      {screen==="login"    && <LoginPage users={users} onLogin={login} onNav={go} />}
      {screen==="register" && <RegisterPage onRegister={register} onNav={go} existingSchools={schoolDB} schoolCounters={schoolCounters} setSchoolCounters={setSchoolCounters} addSchool={addSchool} />}
      {screen==="teacher"  && <TeacherApp user={user} onNav={go} notify={notify} allResults={allResults} />}
      {screen==="student"  && <StudentApp user={user} onNav={go} notify={notify} onAddResult={addResult} allResults={allResults.filter(r=>r.studentEmail===user?.email)} />}
      {screen==="admin"    && <AdminApp user={user} onNav={go} notify={notify} users={users} setUsers={setUsers} adminSchools={adminSchools} setAdminSchools={setAdminSchools} adminAssessments={adminAssessments} setAdminAssessments={setAdminAssessments} allResults={allResults} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LANDING
═══════════════════════════════════════════════════════════════════ */
function Landing({ onNav }) {
  return (
    <div>
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 32px", background:G.paper, borderBottom:`1.5px solid ${G.paperDark}`, position:"sticky", top:0, zIndex:100 }}>
        <Logo dark onClick={()=>onNav("landing")} />
        <div style={{ display:"flex", gap:8 }}>
          <Btn variant="ghost" sm onClick={()=>onNav("login")}>Login</Btn>
          <Btn variant="ink" sm onClick={()=>onNav("register")}>Register Free</Btn>
        </div>
      </nav>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"calc(100vh - 130px)" }}>
        <div style={{ padding:"56px 52px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:G.goldPale, border:`1px solid ${G.gold}`, padding:"5px 12px", borderRadius:100, fontSize:11, fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:20, width:"fit-content" }}>🇿🇦 CAPS Aligned · Real AI Marking</div>
          <h1 style={{ fontSize:42, fontWeight:800, marginBottom:16, lineHeight:1.05 }}>AI Marking.<br /><span style={{ color:G.gold }}>Instant Results.</span><br />Real Intelligence.</h1>
          <p style={{ fontSize:15, color:G.inkMuted, maxWidth:420, marginBottom:32, fontWeight:300, lineHeight:1.7 }}>EduMark AI uses Claude to read, understand and mark student answers — applying your rubric, awarding method marks, and giving detailed feedback in seconds.</p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <Btn variant="ink" onClick={()=>onNav("login")}>🎓 Teacher Portal</Btn>
            <Btn variant="gold" onClick={()=>onNav("login")}>📚 Student Portal</Btn>
            <Btn variant="ghost" onClick={()=>onNav("register")}>Register Free →</Btn>
          </div>
          <div className="divider" style={{ marginTop:32 }} />
          <div style={{ display:"flex", gap:28, flexWrap:"wrap" }}>
            {[["Claude AI","Powers marking"],["CAPS","Curriculum aligned"],["9 Provinces","Full SA coverage"],["POPIA","Compliant"]].map(([n,l])=>(
              <div key={n}><div style={{ fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:800 }}>{n}</div><div className="text-muted" style={{ marginTop:2 }}>{l}</div></div>
            ))}
          </div>
        </div>
        <div style={{ background:G.ink, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"44px 36px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-60, right:-60, width:260, height:260, background:"radial-gradient(circle,rgba(200,168,75,.15) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />
          <div style={{ color:"rgba(255,255,255,.35)", fontSize:10, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:16, alignSelf:"flex-start" }}>Quick Access</div>
          {[["🎓","Teacher Portal","Create assessments, configure rubrics, and let Claude AI mark your students' scripts."],["📚","Student Portal","Submit your answers online. Claude AI marks them and gives instant feedback."]].map(([ico,title,desc])=>(
            <button key={title} onClick={()=>onNav("login")} style={{ background:"rgba(255,255,255,.05)", border:`1px solid rgba(255,255,255,.08)`, borderRadius:14, padding:20, cursor:"pointer", width:"100%", maxWidth:350, marginBottom:14, transition:"all .2s", textAlign:"left" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=G.gold;e.currentTarget.style.transform="translateX(6px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.08)";e.currentTarget.style.transform="translateX(0)";}}>
              <div style={{ fontSize:18, marginBottom:9 }}>{ico}</div>
              <div style={{ color:"white", fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:15, marginBottom:4 }}>{title}</div>
              <div style={{ color:"rgba(255,255,255,.4)", fontSize:12 }}>{desc}</div>
            </button>
          ))}
          <div style={{ background:"rgba(200,168,75,.08)", border:"1px solid rgba(200,168,75,.2)", borderRadius:10, padding:"11px 15px", width:"100%", maxWidth:350 }}>
            <div style={{ fontSize:10, color:G.gold, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600, marginBottom:6 }}>🔑 Demo Credentials</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.5)" }}>Teacher: <span style={{ color:"white" }}>teacher@demo.co.za / demo123</span></div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", marginTop:3 }}>Student: <span style={{ color:"white" }}>student@demo.co.za / demo123</span></div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", marginTop:3 }}>Admin: <span style={{ color:"white" }}>admin@edumark.ai / admin123</span></div>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", borderTop:`1.5px solid ${G.paperDark}`, background:G.paperWarm }}>
        {[["Claude AI","Powers marking"],["25 000+","SA Schools"],["< 90s","Mark Time"],["R800/mo","Starting Price"]].map(([n,l])=>(
          <div key={n} style={{ flex:1, padding:"16px 12px", textAlign:"center", borderRight:`1.5px solid ${G.paperDark}` }}>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:800 }}>{n}</div>
            <div className="text-muted" style={{ marginTop:3 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════════════════════════════ */
function LoginPage({ users, onLogin, onNav }) {
  const [email, setEmail] = useState("teacher@demo.co.za");
  const [pass, setPass] = useState("demo123");
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("teacher");
  const [error, setError] = useState("");

  const ROLES = [
    { id:"teacher", ico:"🎓", label:"Teacher", desc:"Access your dashboard" },
    { id:"student", ico:"📚", label:"Student", desc:"View your assessments" },
    { id:"admin",   ico:"⚙️", label:"Admin",   desc:"Platform administration" },
  ];
  const CREDS = { teacher:"teacher@demo.co.za", student:"student@demo.co.za", admin:"admin@edumark.ai" };
  const PASSES = { teacher:"demo123", student:"demo123", admin:"admin123" };

  const handleRole = r => { setRole(r); setEmail(CREDS[r]); setPass(PASSES[r]); setError(""); };

  return (
    <div style={{ minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr" }}>
      <div style={{ background:G.ink, display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 56px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-80, left:-80, width:320, height:320, background:"radial-gradient(circle,rgba(200,168,75,.12) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />
        <Logo onClick={()=>onNav("landing")} />
        <div style={{ fontFamily:"Syne,sans-serif", fontSize:34, fontWeight:800, color:"white", lineHeight:1.1, margin:"32px 0 16px" }}>Welcome<br />back to<br /><em style={{ fontStyle:"normal", color:G.gold }}>EduMark AI</em></div>
        <div style={{ color:"rgba(255,255,255,.5)", fontSize:14, fontWeight:300, lineHeight:1.7, maxWidth:380 }}>South Africa's intelligent assessment platform — powered by Claude AI.</div>
        <div style={{ marginTop:40, display:"flex", flexDirection:"column", gap:12 }}>
          {[["🤖","Claude AI marks every submission in real-time"],["🇿🇦","All 9 Provinces · 52 Districts · 4 468 Wards"],["🏫","Schools identified by unique allocated number"],["⚙️","Full admin dashboard for platform management"]].map(([ico,txt])=>(
            <div key={txt} style={{ display:"flex", alignItems:"center", gap:10, color:"rgba(255,255,255,.65)", fontSize:13 }}>
              <div style={{ width:28, height:28, background:"rgba(200,168,75,.15)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{ico}</div>{txt}
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:G.paper, display:"flex", flexDirection:"column", justifyContent:"center", padding:"48px 56px", overflowY:"auto" }}>
        <div style={{ maxWidth:420, width:"100%", margin:"0 auto" }}>
          <Logo dark onClick={()=>onNav("landing")} />
          <div style={{ height:28 }} />
          <div style={{ fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800, marginBottom:6 }}>Sign in to your account</div>
          <div style={{ fontSize:13, color:G.inkMuted, marginBottom:24 }}>Choose your role and enter your credentials</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
            {ROLES.map(r=>(
              <div key={r.id} onClick={()=>handleRole(r.id)} style={{ border:`2px solid ${role===r.id?G.gold:G.paperDark}`, borderRadius:12, padding:14, cursor:"pointer", transition:"all .2s", textAlign:"center", background:role===r.id?G.goldPale:"white", boxShadow:role===r.id?`0 0 0 3px rgba(200,168,75,.15)`:"none" }}>
                <div style={{ fontSize:24, marginBottom:6 }}>{r.ico}</div>
                <div style={{ fontWeight:700, fontSize:13, marginBottom:2 }}>{r.label}</div>
                <div style={{ fontSize:10, color:G.inkMuted }}>{r.desc}</div>
              </div>
            ))}
          </div>
          <div className="fg"><label>Email Address</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="yourname@school.co.za" /></div>
          <div className="fg"><label>Password</label>
            <div style={{ position:"relative" }}>
              <input type={showPass?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} style={{ paddingRight:44 }} onKeyDown={e=>e.key==="Enter"&&(!onLogin(email,pass)&&setError("Invalid credentials"))} />
              <button onClick={()=>setShowPass(!showPass)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:G.inkMuted, fontSize:14 }}>{showPass?"🙈":"👁"}</button>
            </div>
          </div>
          {error && <div style={{ background:G.redPale, border:`1px solid #f5c0c2`, borderRadius:8, padding:10, fontSize:12, color:G.red, marginBottom:14, textAlign:"center" }}>{error}</div>}
          <Btn variant="ink" full onClick={()=>{ if(!onLogin(email,pass)) setError("Invalid email or password."); }} style={{ padding:13 }}>Sign In →</Btn>
          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"18px 0", fontSize:12, color:G.inkMuted }}>
            <div style={{ flex:1, height:1, background:G.paperDark }} />or<div style={{ flex:1, height:1, background:G.paperDark }} />
          </div>
          <Btn variant="ghost" full onClick={()=>onNav("register")} style={{ padding:12 }}>Create a new account</Btn>
          <div style={{ fontSize:13, color:G.inkMuted, marginTop:16, textAlign:"center" }}>Back to <button onClick={()=>onNav("landing")} style={{ background:"none", border:"none", color:G.gold, cursor:"pointer", fontWeight:500 }}>Home</button></div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   REGISTER
═══════════════════════════════════════════════════════════════════ */
function RegisterPage({ onRegister, onNav, existingSchools, schoolCounters, setSchoolCounters, addSchool }) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({ fname:"", lname:"", email:"", pass:"", pass2:"", phone:"", sace:"", grade:"" });
  const [loc, setLoc] = useState({ province:"", district:"", municipality:"", ward:"" });
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [schoolResults, setSchoolResults] = useState([]);
  const [newSchool, setNewSchool] = useState({ name:"", type:"", phone:"" });
  const [error, setError] = useState("");

  const districts = loc.province ? Object.keys(SA_GEO[loc.province]?.districts||{}) : [];
  const municipalities = (loc.province&&loc.district) ? Object.keys(SA_GEO[loc.province]?.districts[loc.district]?.municipalities||{}) : [];
  const wardCount = (loc.province&&loc.district&&loc.municipality) ? (SA_GEO[loc.province]?.districts[loc.district]?.municipalities[loc.municipality]||20) : 20;

  useEffect(()=>{
    if (!schoolSearch||schoolSearch.length<2){setSchoolResults([]);return;}
    const q=schoolSearch.toLowerCase();
    setSchoolResults(existingSchools.filter(s=>s.name.toLowerCase().includes(q)||s.id.toLowerCase().includes(q)).slice(0,5));
  },[schoolSearch,existingSchools]);

  const next = () => {
    setError("");
    if (step===0){if(!role){setError("Please select a role.");return;}setStep(1);}
    else if (step===1){
      const{fname,lname,email,pass,pass2,sace,grade}=form;
      if(!fname||!lname||!email||!pass){setError("Please fill in all required fields.");return;}
      if(pass.length<8){setError("Password must be at least 8 characters.");return;}
      if(pass!==pass2){setError("Passwords do not match.");return;}
      if(role==="teacher"&&!sace){setError("SACE Registration Number is required.");return;}
      if(role==="student"&&!grade){setError("Please select your current grade.");return;}
      setStep(2);
    }
    else if (step===2){
      if(!loc.province||!loc.district||!loc.municipality||!loc.ward){setError("Please complete all location fields.");return;}
      setStep(3);
    }
    else if (step===3){
      if(selectedSchools.length===0){setError("Please add at least one school.");return;}
      onRegister({email:form.email,password:form.pass,role,fname:form.fname,lname:form.lname,schools:selectedSchools,province:loc.province,district:loc.district,municipality:loc.municipality,ward:loc.ward,sace:role==="teacher"?form.sace:null,grade:role==="student"?form.grade:null});
    }
  };

  const addSch = (id,name)=>{
    if(role==="student"&&selectedSchools.length>=1)return;
    if(selectedSchools.find(s=>s.id===id))return;
    setSelectedSchools(p=>[...p,{id,name}]);
    setSchoolSearch(""); setSchoolResults([]);
  };

  const regNewSchool = ()=>{
    if(!newSchool.name||!newSchool.type){setError("Enter school name and type.");return;}
    if(!loc.province){setError("Select your province first.");return;}
    const pcode=SA_GEO[loc.province]?.code||"XX";
    const count=(schoolCounters[pcode]||0)+1;
    setSchoolCounters(p=>({...p,[pcode]:count}));
    const newId=pcode+"-"+String(count).padStart(4,"0");
    addSchool({id:newId,name:newSchool.name,type:newSchool.type,province:loc.province,district:loc.district,municipality:loc.municipality,ward:loc.ward});
    addSch(newId,newSchool.name);
    setNewSchool({name:"",type:"",phone:""});
    setError("");
  };

  const steps=["Role","Details","Location","School","Done"];

  return (
    <div style={{ minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr" }}>
      <div style={{ background:G.ink, display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 56px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-80, left:-80, width:320, height:320, background:"radial-gradient(circle,rgba(200,168,75,.12) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />
        <Logo onClick={()=>onNav("landing")} />
        <div style={{ fontFamily:"Syne,sans-serif", fontSize:34, fontWeight:800, color:"white", lineHeight:1.1, margin:"32px 0 16px" }}>Join<br /><em style={{ fontStyle:"normal", color:G.gold }}>EduMark AI</em><br />today</div>
        <div style={{ color:"rgba(255,255,255,.5)", fontSize:14, fontWeight:300, lineHeight:1.7, maxWidth:380 }}>Register and connect to your school using South Africa's official geographic structure.</div>
        <div style={{ marginTop:32, display:"flex", flexDirection:"column", gap:10 }}>
          {[["📍","Province → District → Municipality → Ward"],["🏫","Find school by name or unique number"],["🎓","Teachers can register at multiple schools"],["🤖","Claude AI marks student work instantly"]].map(([ico,txt])=>(
            <div key={txt} style={{ display:"flex", alignItems:"center", gap:10, color:"rgba(255,255,255,.65)", fontSize:13 }}>
              <div style={{ width:28, height:28, background:"rgba(200,168,75,.15)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{ico}</div>{txt}
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:G.paper, display:"flex", flexDirection:"column", justifyContent:"center", padding:"32px 48px", overflowY:"auto" }}>
        <div style={{ maxWidth:460, width:"100%", margin:"0 auto" }}>
          <Logo dark onClick={()=>onNav("landing")} />
          <div style={{ height:20 }} />
          {/* Step tracker */}
          <div style={{ display:"flex", alignItems:"center", marginBottom:24 }}>
            {steps.map((s,i)=>(
              <div key={s} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", position:"relative" }}>
                {i<steps.length-1&&<div style={{ position:"absolute",top:14,left:"50%",width:"100%",height:2,background:i<step?G.gold:G.paperDark,zIndex:0 }}/>}
                <div style={{ width:28,height:28,borderRadius:"50%",border:`2px solid ${i<step?G.gold:i===step?G.ink:G.paperDark}`,background:i<step?G.gold:i===step?G.ink:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:i<=step?"white":G.inkMuted,zIndex:1,position:"relative",transition:"all .2s" }}>{i<step?"✓":i+1}</div>
                <div style={{ fontSize:9,color:i===step?G.ink:G.inkMuted,marginTop:4,fontWeight:i===step?600:400 }}>{s}</div>
              </div>
            ))}
          </div>

          {/* Step 0 */}
          {step===0&&<div className="fadeUp">
            <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:6 }}>Who are you?</div>
            <div style={{ fontSize:13,color:G.inkMuted,marginBottom:20 }}>Choose your role on EduMark AI</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16 }}>
              {[["teacher","🎓","Teacher","Create assessments and let Claude AI mark your students' work."],["student","📚","Student","Submit assessments and get instant AI-powered feedback."]].map(([r,ico,title,desc])=>(
                <div key={r} onClick={()=>setRole(r)} style={{ border:`2px solid ${role===r?G.gold:G.paperDark}`,borderRadius:12,padding:18,cursor:"pointer",transition:"all .2s",background:role===r?G.goldPale:"white",boxShadow:role===r?`0 0 0 3px rgba(200,168,75,.15)`:"none" }}>
                  <div style={{ fontSize:28,marginBottom:8 }}>{ico}</div>
                  <div style={{ fontWeight:700,fontSize:14,marginBottom:4 }}>{title}</div>
                  <div style={{ fontSize:11,color:G.inkMuted }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>}

          {/* Step 1 */}
          {step===1&&<div className="fadeUp">
            <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:6 }}>{role==="teacher"?"Teacher Details":"Student Details"}</div>
            <div style={{ fontSize:13,color:G.inkMuted,marginBottom:20 }}>Your personal information</div>
            <div className="g2"><div className="fg"><label>First Name *</label><input value={form.fname} onChange={e=>setForm(p=>({...p,fname:e.target.value}))} placeholder="e.g. Nomsa"/></div>
            <div className="fg"><label>Surname *</label><input value={form.lname} onChange={e=>setForm(p=>({...p,lname:e.target.value}))} placeholder="e.g. Dlamini"/></div></div>
            <div className="fg"><label>Email Address *</label><input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="yourname@school.co.za"/></div>
            <div className="g2">
              <div className="fg"><label>Password *</label><input type="password" value={form.pass} onChange={e=>setForm(p=>({...p,pass:e.target.value}))} placeholder="Min 8 characters"/></div>
              <div className="fg"><label>Confirm Password *</label><input type="password" value={form.pass2} onChange={e=>setForm(p=>({...p,pass2:e.target.value}))} placeholder="Repeat password"/></div>
            </div>
            <div className="fg"><label>Cell Phone</label><input type="tel" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="e.g. 082 123 4567"/></div>
            {role==="teacher"&&<div className="fg"><label>SACE Registration Number *</label><input value={form.sace} onChange={e=>setForm(p=>({...p,sace:e.target.value}))} placeholder="e.g. PR 1234567"/><div className="text-muted" style={{ marginTop:4 }}>South African Council for Educators number</div></div>}
            {role==="student"&&<div className="fg"><label>Current Grade *</label><select value={form.grade} onChange={e=>setForm(p=>({...p,grade:e.target.value}))}><option value="">— Select Grade —</option>{["Grade 12","Grade 11","Grade 10","Grade 9","Grade 8","Grade 7"].map(g=><option key={g}>{g}</option>)}</select></div>}
          </div>}

          {/* Step 2 */}
          {step===2&&<div className="fadeUp">
            <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:6 }}>Your Location</div>
            <div style={{ background:G.bluePale,border:`1px solid ${G.blueLt}`,borderRadius:9,padding:"11px 13px",marginBottom:16,fontSize:12,color:G.blue }}>📍 <strong>Province → District → Municipality → Ward</strong></div>
            <div className="fg"><label>Province *</label><select value={loc.province} onChange={e=>setLoc({province:e.target.value,district:"",municipality:"",ward:""})}><option value="">— Select Province —</option>{Object.keys(SA_GEO).map(p=><option key={p}>{p}</option>)}</select></div>
            <div className="fg"><label>District Municipality *</label><select value={loc.district} disabled={!loc.province} onChange={e=>setLoc(p=>({...p,district:e.target.value,municipality:"",ward:""}))}><option value="">— Select District —</option>{districts.map(d=><option key={d}>{d}</option>)}</select></div>
            <div className="fg"><label>Local Municipality *</label><select value={loc.municipality} disabled={!loc.district} onChange={e=>setLoc(p=>({...p,municipality:e.target.value,ward:""}))}><option value="">— Select Municipality —</option>{municipalities.map(m=><option key={m}>{m}</option>)}</select></div>
            <div className="fg"><label>Ward *</label><select value={loc.ward} disabled={!loc.municipality} onChange={e=>setLoc(p=>({...p,ward:e.target.value}))}><option value="">— Select Ward —</option>{loc.municipality&&Array.from({length:wardCount},(_,i)=><option key={i+1}>{`Ward ${i+1}`}</option>)}</select><div className="text-muted" style={{ marginTop:4 }}>2021 Municipal Demarcation Board boundaries</div></div>
          </div>}

          {/* Step 3 */}
          {step===3&&<div className="fadeUp">
            <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:6 }}>Your School{role==="teacher"?"s":""}</div>
            <div style={{ fontSize:13,color:G.inkMuted,marginBottom:16 }}>{role==="teacher"?"Add all schools where you teach.":"Find your school by name or unique number."}</div>
            {selectedSchools.length>0&&(
              <div style={{ marginBottom:14 }}>
                {selectedSchools.map(s=>(
                  <div key={s.id} style={{ display:"flex",alignItems:"center",gap:8,background:G.greenPale,border:`1px solid #b7e4c7`,borderRadius:8,padding:"8px 12px",marginBottom:8 }}>
                    <div style={{ fontFamily:"Syne,sans-serif",fontSize:11,fontWeight:700,color:G.green,background:"white",padding:"2px 7px",borderRadius:4,border:`1px solid #b7e4c7` }}>{s.id}</div>
                    <div style={{ flex:1,fontSize:13,fontWeight:500 }}>{s.name}</div>
                    <button onClick={()=>setSelectedSchools(p=>p.filter(x=>x.id!==s.id))} style={{ background:"none",border:"none",cursor:"pointer",color:G.red,fontSize:16 }}>×</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ position:"relative",marginBottom:16 }}>
              <div className="fg"><label>Search by Name or School Number</label>
                <input value={schoolSearch} onChange={e=>setSchoolSearch(e.target.value)} placeholder="e.g. Hoerskool Pretoria or GP-0001" autoComplete="off"/>
                <div className="text-muted" style={{ marginTop:4 }}>Schools have unique IDs like <strong>GP-0001</strong></div>
              </div>
              {schoolResults.length>0&&(
                <div style={{ position:"absolute",top:"100%",left:0,right:0,background:"white",border:`1.5px solid ${G.gold}`,borderRadius:9,zIndex:50,maxHeight:200,overflowY:"auto",boxShadow:"0 8px 24px rgba(13,17,23,.15)" }}>
                  {schoolResults.map(s=>(
                    <div key={s.id} onClick={()=>addSch(s.id,s.name)} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 13px",cursor:"pointer",borderBottom:`1px solid ${G.paperWarm}` }}
                      onMouseEnter={e=>e.currentTarget.style.background=G.goldPale} onMouseLeave={e=>e.currentTarget.style.background="white"}>
                      <div style={{ fontFamily:"Syne,sans-serif",fontSize:10,fontWeight:700,color:G.gold,background:G.ink,padding:"2px 7px",borderRadius:4,flexShrink:0 }}>{s.id}</div>
                      <div><div style={{ fontSize:13,fontWeight:500 }}>{s.name}</div><div style={{ fontSize:11,color:G.inkMuted }}>{s.type} · {s.province}</div></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ background:G.paperWarm,border:`1.5px solid ${G.paperDark}`,borderRadius:10,padding:14 }}>
              <div style={{ fontWeight:600,fontSize:13,marginBottom:10 }}>🏫 Can't find your school? Register it</div>
              <div className="fg"><label>School Name</label><input value={newSchool.name} onChange={e=>setNewSchool(p=>({...p,name:e.target.value}))} placeholder="Full school name"/></div>
              <div className="fg"><label>School Type</label><select value={newSchool.type} onChange={e=>setNewSchool(p=>({...p,type:e.target.value}))}><option value="">— Select —</option>{["Public Primary","Public Secondary","Public Combined","Independent Primary","Independent Secondary","Special Needs","TVET College"].map(t=><option key={t}>{t}</option>)}</select></div>
              <Btn variant="ghost" full sm onClick={regNewSchool}>+ Register and Add This School</Btn>
            </div>
          </div>}

          {error&&<div style={{ background:G.redPale,border:`1px solid #f5c0c2`,borderRadius:8,padding:10,fontSize:12,color:G.red,marginTop:12,textAlign:"center" }}>{error}</div>}
          <div style={{ display:"flex",justifyContent:"space-between",marginTop:16,gap:10 }}>
            {step>0?<Btn variant="ghost" onClick={()=>{setStep(s=>s-1);setError("");}}>← Back</Btn>:<span/>}
            <Btn variant={step===3?"green":"ink"} onClick={next}>{step===3?"Complete Registration ✓":"Continue →"}</Btn>
          </div>
          <div style={{ fontSize:13,color:G.inkMuted,marginTop:14,textAlign:"center" }}>Already registered? <button onClick={()=>onNav("login")} style={{ background:"none",border:"none",color:G.gold,cursor:"pointer",fontWeight:500 }}>Sign in</button></div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TEACHER APP
═══════════════════════════════════════════════════════════════════ */
function TeacherApp({ user, onNav, notify, allResults }) {
  const [panel, setPanel] = useState("dashboard");

  const AppHeader = () => (
    <header style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",background:G.ink,borderBottom:`1px solid rgba(255,255,255,.07)`,position:"sticky",top:0,zIndex:200,height:54,gap:10 }}>
      <Logo onClick={()=>onNav("landing")} />
      <div style={{ display:"flex",gap:2 }} className="hide-mob">
        {[["dashboard","Dashboard"],["create","New Assessment"],["mark","Mark Scripts"],["roster","Students"],["analytics","Analytics"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setPanel(id)} style={{ padding:"6px 12px",borderRadius:7,border:"none",background:panel===id?"rgba(200,168,75,.1)":"transparent",color:panel===id?G.gold:"rgba(255,255,255,.5)",fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer",transition:"all .15s" }}>{lbl}</button>
        ))}
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
        <button onClick={()=>onNav("landing")} style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:9,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:500,cursor:"pointer",border:"none",background:"rgba(255,255,255,0.1)",color:"white" }}>🏠 Home</button>
        <button onClick={()=>onNav("landing")} style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.07)",padding:"5px 10px 5px 6px",borderRadius:100,cursor:"pointer",border:"none" }}>
          <div style={{ width:26,height:26,borderRadius:"50%",background:G.gold,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:G.ink }}>{user?.fname?.[0]}{user?.lname?.[0]}</div>
          <span style={{ color:"rgba(255,255,255,.75)",fontSize:12,fontFamily:"'DM Sans',sans-serif" }}>Ms. {user?.lname}</span>
        </button>
      </div>
    </header>
  );

  const Sidebar = () => (
    <aside className="sidebar-desktop" style={{ width:200,background:G.paperWarm,borderRight:`1.5px solid ${G.paperDark}`,padding:"16px 12px",display:"flex",flexDirection:"column",gap:3,minHeight:"calc(100vh - 54px)" }}>
      {[["dashboard","⊞","Overview"],["create","✚","New Assessment"],["mark","✓","Mark Scripts"],["roster","👥","Roster"]].map(([id,ico,lbl])=>(
        <button key={id} onClick={()=>setPanel(id)} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,border:"none",background:panel===id?G.ink:"transparent",color:panel===id?"white":G.inkMuted,fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer",transition:"all .15s",textAlign:"left" }}><span>{ico}</span>{lbl}</button>
      ))}
      <div style={{ fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:G.inkMuted,padding:"8px 10px 3px",fontWeight:600,marginTop:6 }}>Analytics</div>
      {[["analytics","📊","Performance"],["reports","📄","Reports"],["profile","👤","My Profile"]].map(([id,ico,lbl])=>(
        <button key={id} onClick={()=>setPanel(id)} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,border:"none",background:panel===id?G.ink:"transparent",color:panel===id?"white":G.inkMuted,fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer",transition:"all .15s",textAlign:"left" }}><span>{ico}</span>{lbl}</button>
      ))}
      <div style={{ flex:1 }} />
      <button onClick={()=>onNav("landing")} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,border:"none",background:"transparent",color:G.inkMuted,fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer",marginTop:8,borderTop:`1px solid ${G.paperDark}`,paddingTop:12 }}><span>🏠</span> Home</button>
      <div style={{ background:G.goldPale,border:`1px solid ${G.gold}`,borderRadius:8,padding:"9px 11px",marginTop:8,fontSize:11 }}>
        <div style={{ fontWeight:600,color:"#8a6d10",marginBottom:3 }}>⚡ Claude AI Engine</div>
        <div className="text-muted">Powered by Claude for intelligent marking</div>
      </div>
    </aside>
  );

  return (
    <div>
      <AppHeader />
      <div style={{ display:"flex" }}>
        <Sidebar />
        <main style={{ flex:1,padding:"22px 26px",overflowY:"auto",background:G.paper,minHeight:"calc(100vh - 54px)" }}>
          {panel==="dashboard"  && <TeacherDashboard user={user} onNavTo={setPanel} notify={notify} allResults={allResults} />}
          {panel==="create"     && <CreateAssessment notify={notify} />}
          {panel==="mark"       && <MarkScripts notify={notify} allResults={allResults} />}
          {panel==="roster"     && <StudentRoster notify={notify} />}
          {panel==="analytics"  && <AnalyticsPanel allResults={allResults} />}
          {panel==="reports"    && <ReportsPanel notify={notify} />}
          {panel==="profile"    && <TeacherProfile user={user} notify={notify} />}
        </main>
      </div>
    </div>
  );
}

function TeacherDashboard({ user, onNavTo, notify, allResults }) {
  const mySchools = user?.schools?.map(s=>s.name).join(", ")||"";
  return (
    <div className="fadeUp">
      <div className="flex jb aic wrap gap2" style={{ marginBottom:18 }}>
        <div><div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800 }}>Good morning, {user?.fname} 👋</div><div className="text-muted">{mySchools} · Grade 11</div></div>
        <Btn variant="ink" sm onClick={()=>onNavTo("create")}>+ New Assessment</Btn>
      </div>
      <div className="g4 mb4">
        <StatCard accent={G.gold} label="Active Assessments" value="4" sub="2 due this week" />
        <StatCard accent={G.blueLt} label="Pending Review" value={allResults.filter(r=>r.flagged).length||"12"} sub="AI flagged scripts" />
        <StatCard accent={G.greenLt} label="Marked This Week" value={allResults.length||"87"} sub="+34 vs last week" />
        <StatCard accent={G.red} label="Class Average" value={allResults.length>0?Math.round(allResults.reduce((s,r)=>s+(r.totalMarks/r.totalAvailable)*100,0)/allResults.length)+"%":"61%"} sub="Grade 11 Maths" />
      </div>
      <div className="g2 mb4">
        <Card>
          <div className="card-title" style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:12 }}>Recent Assessments</div>
          <div className="tbl-wrap"><table><thead><tr><th>Title</th><th>Subject</th><th>Status</th><th>Due</th></tr></thead>
          <tbody>
            {DEMO_ASSESSMENTS.map(a=><tr key={a.id}><td><strong>{a.title}</strong></td><td>{a.subject}</td><td><Badge type="green">Live</Badge></td><td>{a.due}</td></tr>)}
            <tr><td><strong>Algebra Assignment</strong></td><td>Mathematics</td><td><Badge type="gray">Closed</Badge></td><td>15 Feb</td></tr>
          </tbody></table></div>
        </Card>
        <Card>
          <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:12 }}>Class Performance</div>
          {[["Grade 11A — Maths",61,G.gold],["Grade 11B — Maths",74,G.greenLt],["Grade 11A — Science",58,G.red],["Grade 11B — Science",69,G.blueLt]].map(([l,v,c])=>(
            <div key={l} className="mb3"><div className="flex jb mb2" style={{ fontSize:12 }}><span>{l}</span><strong>{v}%</strong></div><ProgressBar value={v} color={c} /></div>
          ))}
        </Card>
      </div>
      {allResults.length>0&&(
        <Card>
          <div className="flex jb aic mb3"><div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14 }}>Recent Claude AI Results</div><Badge type="green">{allResults.length} marked</Badge></div>
          <div className="tbl-wrap"><table><thead><tr><th>Student</th><th>Assessment</th><th>Score</th><th>%</th><th>Marked by</th></tr></thead>
          <tbody>{allResults.slice(-5).reverse().map((r,i)=>(
            <tr key={i}><td><strong>{r.studentName}</strong></td><td style={{ fontSize:11 }}>{r.assessmentTitle}</td><td><span style={{ fontFamily:"Syne,sans-serif",fontWeight:700 }}>{r.totalMarks}/{r.totalAvailable}</span></td><td><Badge type={r.totalMarks/r.totalAvailable>=0.7?"green":r.totalMarks/r.totalAvailable>=0.4?"gold":"red"}>{Math.round((r.totalMarks/r.totalAvailable)*100)}%</Badge></td><td><span style={{ background:"rgba(200,168,75,.1)",color:G.gold,padding:"2px 8px",borderRadius:100,fontWeight:600,fontSize:10 }}>🤖 Claude AI</span></td></tr>
          ))}</tbody></table></div>
        </Card>
      )}
    </div>
  );
}

function CreateAssessment({ notify }) {
  const [tab, setTab] = useState(0);
  const [rubric, setRubric] = useState([{q:"1",ans:"",marks:5,memo:""},{q:"2",ans:"",marks:4,memo:""}]);
  const tabs=["Details","Rubric & Memo","Release","Publish"];
  const addRow=()=>setRubric(p=>[...p,{q:String(p.length+1),ans:"",marks:2,memo:""}]);
  return (
    <div className="fadeUp">
      <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:4 }}>New Assessment</div>
      <div className="text-muted mb4">Configure rubric and set release schedule</div>
      <div className="tabs">{tabs.map((t,i)=><button key={t} onClick={()=>setTab(i)} style={{ padding:"9px 16px",border:"none",background:"transparent",fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer",color:tab===i?G.ink:G.inkMuted,borderBottom:`2px solid ${tab===i?G.gold:"transparent"}`,marginBottom:-1.5,transition:"all .15s",whiteSpace:"nowrap" }}>{`${i+1}. ${t}`}</button>)}</div>
      {tab===0&&<div>
        <div className="g2 mb4">
          <Card>
            <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:12 }}>Assessment Info</div>
            <div className="fg"><label>Title *</label><input placeholder="e.g. Term 2 Mathematics Test"/></div>
            <div className="g2"><div className="fg"><label>Subject</label><select>{["Mathematics","Physical Science","Life Sciences","English HL","Afrikaans","History","Geography","Accounting","Business Studies"].map(s=><option key={s}>{s}</option>)}</select></div>
            <div className="fg"><label>Grade</label><select>{["Grade 12","Grade 11","Grade 10","Grade 9","Grade 8"].map(g=><option key={g}>{g}</option>)}</select></div></div>
            <div className="g2"><div className="fg"><label>Total Marks</label><input type="number" defaultValue="100"/></div><div className="fg"><label>Duration (mins)</label><input type="number" defaultValue="90"/></div></div>
          </Card>
          <Card>
            <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:12 }}>Question Paper</div>
            <div style={{ border:`2px dashed ${G.paperDark}`,borderRadius:12,padding:"28px 16px",textAlign:"center",cursor:"pointer",background:G.paperWarm }} onClick={()=>notify("📄 File upload — connect to cloud storage","info")} onMouseEnter={e=>{e.currentTarget.style.borderColor=G.gold;e.currentTarget.style.background=G.goldPale;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=G.paperDark;e.currentTarget.style.background=G.paperWarm;}}>
              <div style={{ fontSize:28,marginBottom:8 }}>📄</div>
              <div style={{ fontSize:13,color:G.inkMuted }}><strong>Upload</strong> question paper</div>
            </div>
            <div className="divider"/>
            <div style={{ background:G.bluePale,border:`1px solid ${G.blueLt}`,borderRadius:8,padding:12 }}>
              <div style={{ fontWeight:600,fontSize:12,color:G.blue,marginBottom:4 }}>🤖 Claude AI Marking</div>
              <div className="text-muted">Claude reads your memorandum and marks submissions intelligently, awarding method marks and generating feedback per question.</div>
            </div>
          </Card>
        </div>
        <div style={{ display:"flex",justifyContent:"flex-end" }}><Btn variant="ink" onClick={()=>setTab(1)}>Next: Rubric →</Btn></div>
      </div>}
      {tab===1&&<div>
        <Card style={{ marginBottom:16 }}>
          <div className="flex jb aic mb3"><div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14 }}>Marking Rubric</div><Btn variant="ghost" sm onClick={addRow}>+ Add Question</Btn></div>
          <div style={{ display:"grid",gridTemplateColumns:"30px 1fr 1fr 60px",gap:6,paddingBottom:8,borderBottom:`2px solid ${G.paperDark}`,marginBottom:8,fontSize:9,textTransform:"uppercase",color:G.inkMuted,fontWeight:600 }}><div>Q</div><div>Expected Answer</div><div>Memorandum Notes (for Claude)</div><div>Marks</div></div>
          {rubric.map((row,i)=>(
            <div key={i} style={{ display:"grid",gridTemplateColumns:"30px 1fr 1fr 60px",gap:6,alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${G.paperWarm}` }}>
              <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:12,color:G.inkMuted,textAlign:"center" }}>{row.q}</div>
              <input type="text" value={row.ans} placeholder="Expected answer or keywords..." style={{ fontSize:11 }} onChange={e=>setRubric(p=>p.map((r,j)=>j===i?{...r,ans:e.target.value}:r))}/>
              <input type="text" value={row.memo} placeholder="Notes for Claude AI..." style={{ fontSize:11 }} onChange={e=>setRubric(p=>p.map((r,j)=>j===i?{...r,memo:e.target.value}:r))}/>
              <input type="number" value={row.marks} style={{ fontSize:11 }} onChange={e=>setRubric(p=>p.map((r,j)=>j===i?{...r,marks:e.target.value}:r))}/>
            </div>
          ))}
        </Card>
        <div style={{ display:"flex",justifyContent:"space-between" }}><Btn variant="ghost" onClick={()=>setTab(0)}>← Back</Btn><Btn variant="ink" onClick={()=>setTab(2)}>Next: Release →</Btn></div>
      </div>}
      {tab===2&&<div>
        <Card style={{ marginBottom:16 }}><div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:12 }}>Submission Window</div>
          <div className="g2"><div className="fg"><label>Available From</label><input type="datetime-local" defaultValue="2026-02-24T08:00"/></div><div className="fg"><label>Due Date</label><input type="datetime-local" defaultValue="2026-02-24T13:00"/></div></div>
          <div className="fg"><label>Late Submission</label><select><option>Block late submissions</option><option>Allow late — deduct 10% per day</option><option>Allow late — no penalty</option></select></div>
        </Card>
        <Card style={{ marginBottom:16 }}><div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:12 }}>Result Release</div>
          {["Instant — Released immediately after Claude marks","After Due Date — Released after deadline","Scheduled — Released on a specific date","Manual — Teacher reviews AI marks first"].map(opt=>(
            <label key={opt} style={{ display:"flex",alignItems:"flex-start",gap:9,cursor:"pointer",padding:9,border:`1.5px solid ${G.paperDark}`,borderRadius:8,marginBottom:7,fontSize:13 }}><input type="radio" name="rel" defaultChecked={opt.startsWith("Instant")}/><div><strong>{opt.split("—")[0]}</strong>{"—"+opt.split("—")[1]}</div></label>
          ))}
        </Card>
        <div style={{ display:"flex",justifyContent:"space-between" }}><Btn variant="ghost" onClick={()=>setTab(1)}>← Back</Btn><Btn variant="ink" onClick={()=>setTab(3)}>Next: Publish →</Btn></div>
      </div>}
      {tab===3&&<div>
        <Card style={{ border:`2px solid ${G.greenLt}`,marginBottom:16 }}>
          <div className="flex aic gap2 mb4"><div style={{ width:34,height:34,background:G.greenPale,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>✅</div><div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:15 }}>Ready to Publish</div></div>
          <div style={{ background:G.paperWarm,borderRadius:8,padding:14,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            {[["Subject","Mathematics · Grade 11"],["Marks","100 · 90 min"],["Classes","64 students"],["Release","Instant with Claude AI feedback"],["Rubric",rubric.length+" questions"],["AI Model","Claude Sonnet 4"]].map(([k,v])=>(
              <div key={k}><div className="text-muted">{k}</div><div style={{ fontWeight:500,marginTop:2,fontSize:12 }}>{v}</div></div>
            ))}
          </div>
        </Card>
        <div style={{ display:"flex",justifyContent:"space-between",gap:10 }}>
          <Btn variant="ghost" onClick={()=>setTab(2)}>← Back</Btn>
          <div style={{ display:"flex",gap:10 }}><Btn variant="ghost" onClick={()=>notify("💾 Saved as draft","info")}>Save Draft</Btn><Btn variant="green" onClick={()=>notify("🚀 Published! Students notified.","success")}>🚀 Publish Assessment</Btn></div>
        </div>
      </div>}
    </div>
  );
}

function MarkScripts({ notify, allResults }) {
  return (
    <div className="fadeUp">
      <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:4 }}>Mark Scripts</div>
      <div className="text-muted mb4">Claude AI-marked submissions</div>
      <div className="g2">
        <Card>
          {allResults.length===0?(
            <div style={{ textAlign:"center",padding:"32px 16px",color:G.inkMuted }}><div style={{ fontSize:36,marginBottom:10 }}>📭</div><div>No submissions yet. Students submit via the Student Portal and Claude AI marks them automatically.</div></div>
          ):(
            <div className="tbl-wrap"><table><thead><tr><th>Student</th><th>Score</th><th>%</th><th>Marked by</th></tr></thead>
            <tbody>{allResults.map((r,i)=>(
              <tr key={i}><td><strong>{r.studentName}</strong></td><td><strong>{r.totalMarks}/{r.totalAvailable}</strong></td><td><Badge type={r.totalMarks/r.totalAvailable>=0.7?"green":r.totalMarks/r.totalAvailable>=0.4?"gold":"red"}>{Math.round((r.totalMarks/r.totalAvailable)*100)}%</Badge></td><td><span style={{ background:"rgba(200,168,75,.1)",color:G.gold,padding:"2px 8px",borderRadius:100,fontWeight:600,fontSize:10 }}>🤖 Claude AI</span></td></tr>
            ))}</tbody></table></div>
          )}
        </Card>
        <Card>
          <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:12 }}>Marking Summary</div>
          <div className="flex jb aic" style={{ padding:"12px 0" }}>
            {[[allResults.length,G.greenLt,"AI Marked"],["0",G.gold,"Flagged"],["—",G.inkMuted,"Pending"]].map(([n,c,l])=>(
              <div key={l} style={{ textAlign:"center" }}><div style={{ fontFamily:"Syne,sans-serif",fontSize:28,fontWeight:800,color:c }}>{n}</div><div className="text-muted">{l}</div></div>
            ))}
          </div>
          <ProgressBar value={Math.min((allResults.length/64)*100,100)} />
          <div className="text-muted" style={{ textAlign:"center",margin:"8px 0 12px" }}>{allResults.length} of 64 students marked</div>
          <div className="divider"/>
          <div style={{ background:G.bluePale,border:`1px solid ${G.blueLt}`,borderRadius:8,padding:10,fontSize:12,color:G.blue,marginBottom:12 }}>
            🤖 Claude reads each answer against your memorandum, applies method marks, and generates feedback per question — typically under 30 seconds per submission.
          </div>
          <Btn variant="ink" full onClick={()=>notify("✅ All results released to students!","success")}>Release All Results</Btn>
        </Card>
      </div>
    </div>
  );
}

function StudentRoster({ notify }) {
  const students=[{name:"T. Mokoena",class:"11A",avg:67,status:"active"},{name:"A. Joubert",class:"11B",avg:81,status:"active"},{name:"N. Sithole",class:"11A",avg:52,status:"risk"},{name:"L. Van der Berg",class:"11B",avg:44,status:"fail"},{name:"P. Ndlovu",class:"11A",avg:89,status:"active"}];
  return (
    <div className="fadeUp">
      <div className="flex jb aic wrap gap2" style={{ marginBottom:18 }}>
        <div><div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800 }}>Student Roster</div><div className="text-muted">Manage your classes</div></div>
        <div style={{ display:"flex",gap:8 }}><Btn variant="ghost" sm onClick={()=>notify("📂 Upload CSV — connect backend","info")}>CSV</Btn><Btn variant="ink" sm onClick={()=>notify("👤 Add student — connect backend","info")}>+ Add</Btn></div>
      </div>
      <Card>
        <div style={{ display:"flex",gap:8,marginBottom:12,flexWrap:"wrap" }}><input type="text" placeholder="🔍 Search students..." style={{ maxWidth:220,flex:"1 1 120px" }}/><select style={{ width:140 }}><option>All Classes</option><option>Grade 11A</option><option>Grade 11B</option></select></div>
        <div className="tbl-wrap"><table><thead><tr><th>Name</th><th>Class</th><th>Average</th><th>Status</th></tr></thead>
        <tbody>{students.map(s=><tr key={s.name}><td><strong>{s.name}</strong></td><td>{s.class}</td><td><strong>{s.avg}%</strong></td><td><Badge type={s.status==="active"?"green":s.status==="risk"?"gold":"red"}>{s.status==="active"?"Active":s.status==="risk"?"At Risk":"Failing"}</Badge></td></tr>)}</tbody></table></div>
      </Card>
    </div>
  );
}

function AnalyticsPanel({ allResults }) {
  const avg = allResults.length>0?Math.round(allResults.reduce((s,r)=>s+(r.totalMarks/r.totalAvailable)*100,0)/allResults.length):61;
  return (
    <div className="fadeUp">
      <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:4 }}>Analytics</div>
      <div className="text-muted mb4">Question-level insights powered by Claude AI</div>
      <div className="g4 mb4">
        <StatCard accent={G.red} label="Most Missed" value="Q3b" sub="78% lost marks"/>
        <StatCard accent={G.greenLt} label="Top Scoring" value="Q1a" sub="92% correct"/>
        <StatCard accent={G.gold} label="Class Average" value={avg+"%"} sub="Grade 11A"/>
        <StatCard accent={G.green} label="Pass Rate" value="68%" sub="≥30% threshold"/>
      </div>
      <div className="g2">
        <Card>
          <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:12 }}>Per-Question Performance</div>
          {[["Q1a — Algebra",92,G.greenLt],["Q1b — Quadratics",64,G.gold],["Q2 — Newton",57,G.gold],["Q3a — Kinematics",71,G.gold],["Q3b — Graphs",22,G.red]].map(([l,v,c])=>(
            <div key={l} className="mb3"><div className="flex jb mb2" style={{ fontSize:12 }}><span>{l}</span><strong style={{ color:c }}>{v}%</strong></div><ProgressBar value={v} color={c}/></div>
          ))}
          <div style={{ background:G.redPale,border:`1px solid #f5c0c2`,borderRadius:8,padding:9,marginTop:10 }}>
            <div style={{ fontWeight:600,fontSize:11,color:G.red,marginBottom:2 }}>⚠ Claude AI Recommendation</div>
            <div className="text-muted">Q3b (Graphs) missed by 78% — consider a dedicated revision lesson.</div>
          </div>
        </Card>
        <Card>
          <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:12 }}>Grade Distribution</div>
          <div style={{ display:"flex",alignItems:"flex-end",gap:4,height:100,marginBottom:10 }}>
            {[["0-29",2,14,G.red],["30-39",4,27,"#c0392b"],["40-49",6,41,G.gold],["50-59",9,63,"#e8c96a"],["60-69",13,100,G.greenLt],["70-79",8,60,G.green],["80+",3,22,"#245a42"]].map(([l,c,h,col])=>(
              <div key={l} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",gap:3 }}>
                <div style={{ fontSize:9,color:G.inkMuted }}>{c}</div>
                <div style={{ width:"100%",height:h+"%",background:col,borderRadius:"3px 3px 0 0" }}/>
                <div style={{ fontSize:9,color:G.inkMuted }}>{l}</div>
              </div>
            ))}
          </div>
          <div className="divider"/>
          <div className="g2" style={{ gap:8 }}>{[["Median","62%"],["Std Dev","14.3"],["Highest","91%"],["Lowest","18%"]].map(([l,v])=><div key={l}><div className="text-muted">{l}</div><div style={{ fontWeight:600,marginTop:2 }}>{v}</div></div>)}</div>
        </Card>
      </div>
    </div>
  );
}

function ReportsPanel({ notify }) {
  return (
    <div className="fadeUp">
      <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:4 }}>Reports</div>
      <div className="text-muted mb4">Download assessment reports</div>
      <div className="g3">
        {[["📊","Class Report","Full performance breakdown with question analysis","Download PDF"],["👤","Student Reports","Individual report per student","Download ZIP"],["📋","Marksheet","Export scores to Excel/CSV","Download CSV"]].map(([ico,t,d,a])=>(
          <Card key={t} style={{ textAlign:"center" }}>
            <div style={{ fontSize:28,marginBottom:8 }}>{ico}</div>
            <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:4 }}>{t}</div>
            <div className="text-muted mb4">{d}</div>
            <Btn variant="ghost" sm onClick={()=>notify(`📄 Generating ${t}... Connect backend for real downloads`,"info")}>↓ {a}</Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TeacherProfile({ user, notify }) {
  return (
    <div className="fadeUp">
      <div className="flex jb aic wrap gap2" style={{ marginBottom:18 }}>
        <div><div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800 }}>My Profile</div><div className="text-muted">Your account and school information</div></div>
        <Btn variant="ghost" sm onClick={()=>notify("💾 Profile saved — connect backend to persist","success")}>Save Changes</Btn>
      </div>
      <div className="g2">
        <Card>
          <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:12 }}>Personal Information</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            {[["Full Name",`${user?.fname} ${user?.lname}`],["Email",user?.email||"—"],["SACE Number",user?.sace||"N/A"],["Role","Teacher"],["Province",user?.province||"—"],["Ward",user?.ward||"—"]].map(([k,v])=>(
              <div key={k}><div className="text-muted">{k}</div><div style={{ fontWeight:500,marginTop:2,fontSize:13 }}>{v}</div></div>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:12 }}>My Schools</div>
          {user?.schools?.map(s=>(
            <div key={s.id} style={{ display:"flex",alignItems:"center",gap:8,background:G.greenPale,border:`1px solid #b7e4c7`,borderRadius:8,padding:"8px 12px",marginBottom:8 }}>
              <div style={{ fontFamily:"Syne,sans-serif",fontSize:11,fontWeight:700,color:G.green,background:"white",padding:"2px 7px",borderRadius:4,border:`1px solid #b7e4c7` }}>{s.id}</div>
              <div style={{ flex:1,fontSize:13,fontWeight:500 }}>{s.name}</div>
              <Badge type="green">Active</Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STUDENT APP
═══════════════════════════════════════════════════════════════════ */
function StudentApp({ user, onNav, notify, onAddResult, allResults }) {
  const [panel, setPanel] = useState("home");

  const AppHeader = () => (
    <header style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",background:G.ink,borderBottom:`1px solid rgba(255,255,255,.07)`,position:"sticky",top:0,zIndex:200,height:54,gap:10 }}>
      <Logo onClick={()=>onNav("landing")} />
      <div style={{ display:"flex",gap:2 }}>
        {[["home","Assessments"],["results","My Results"],["progress","Progress"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setPanel(id)} style={{ padding:"6px 12px",borderRadius:7,border:"none",background:(panel===id||(panel==="submit"&&id==="home")||(panel==="marking"&&id==="home")||(panel==="result-view"&&id==="results"))?"rgba(200,168,75,.1)":"transparent",color:(panel===id||(panel==="submit"&&id==="home")||(panel==="marking"&&id==="home")||(panel==="result-view"&&id==="results"))?G.gold:"rgba(255,255,255,.5)",fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer",transition:"all .15s" }}>{lbl}</button>
        ))}
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
        <button onClick={()=>onNav("landing")} style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:9,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:500,cursor:"pointer",border:"none",background:"rgba(255,255,255,0.1)",color:"white" }}>🏠 Home</button>
        <button onClick={()=>onNav("landing")} style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.07)",padding:"5px 10px 5px 6px",borderRadius:100,cursor:"pointer",border:"none" }}>
          <div style={{ width:26,height:26,borderRadius:"50%",background:G.greenLt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"white" }}>{user?.fname?.[0]}{user?.lname?.[0]}</div>
          <span style={{ color:"rgba(255,255,255,.75)",fontSize:12,fontFamily:"'DM Sans',sans-serif" }}>{user?.fname} {user?.lname?.[0]}.</span>
        </button>
      </div>
    </header>
  );

  return (
    <div>
      <AppHeader />
      <div style={{ maxWidth:840,margin:"0 auto",padding:"22px 18px 80px",width:"100%" }}>
        {panel==="home"        && <StudentHome user={user} onPanel={setPanel} allResults={allResults}/>}
        {panel==="submit"      && <SubmitAssessment user={user} onPanel={setPanel} notify={notify} onAddResult={onAddResult}/>}
        {panel==="marking"     && <MarkingProgress onPanel={setPanel}/>}
        {panel==="results"     && <ResultsList results={allResults} onPanel={setPanel}/>}
        {panel==="result-view" && <ResultDetail results={allResults} notify={notify}/>}
        {panel==="progress"    && <StudentProgress user={user} results={allResults}/>}
      </div>
    </div>
  );
}

function StudentHome({ user, onPanel, allResults }) {
  const hasResult = allResults.length>0;
  return (
    <div className="fadeUp">
      <div className="flex jb aic wrap gap2" style={{ marginBottom:18 }}>
        <div><div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800 }}>My Assessments</div><div className="text-muted">{user?.grade} · {user?.schools?.[0]?.name}</div></div>
      </div>
      {!hasResult&&<div style={{ background:G.goldPale,border:`1.5px solid ${G.gold}`,borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:10,marginBottom:16,flexWrap:"wrap" }}>
        <div style={{ fontSize:20 }}>⚡</div>
        <div style={{ flex:"1 1 150px" }}><div style={{ fontWeight:600,fontSize:13 }}>Term 2 Maths Test — Due Today 13:00</div><div className="text-muted">Submit your answers and let Claude AI mark them instantly!</div></div>
        <Btn variant="gold" sm onClick={()=>onPanel("submit")}>Start Now →</Btn>
      </div>}
      {hasResult&&<div style={{ background:G.greenPale,border:`1.5px solid ${G.greenLt}`,borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:10,marginBottom:16,flexWrap:"wrap" }}>
        <div style={{ fontSize:20 }}>🎉</div>
        <div style={{ flex:"1 1 150px" }}><div style={{ fontWeight:600,fontSize:13 }}>Your results are ready!</div><div className="text-muted">Claude AI has marked your submission.</div></div>
        <Btn variant="green" sm onClick={()=>onPanel("result-view")}>View Results →</Btn>
      </div>}
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {DEMO_ASSESSMENTS.map((a,i)=>(
          <Card key={a.id} style={{ display:"flex",alignItems:"center",gap:12,flexWrap:"wrap" }}>
            <div style={{ width:40,height:40,background:G.paperWarm,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{a.subject.includes("Math")?"📐":"🔬"}</div>
            <div style={{ flex:"1 1 150px" }}>
              <div style={{ fontWeight:600,marginBottom:2,fontSize:13 }}>{a.title}</div>
              <div className="text-muted">{a.subject} · {a.totalMarks} marks · {a.duration} min</div>
              <div style={{ display:"flex",gap:5,marginTop:5,flexWrap:"wrap" }}>
                <Badge type={i===0&&!hasResult?"red":"green"}>{i===0&&!hasResult?"Due Today":hasResult&&i===0?"Submitted ✓":"Live"}</Badge>
                {i===0&&hasResult&&<Badge type="green">Claude Marked ✓</Badge>}
                {i===0&&!hasResult&&<Badge type="gray">Not Submitted</Badge>}
              </div>
            </div>
            {i===0&&!hasResult&&<Btn variant="gold" sm onClick={()=>onPanel("submit")}>Submit</Btn>}
            {i===0&&hasResult&&<Btn variant="green" sm onClick={()=>onPanel("result-view")}>View Result</Btn>}
            {i>0&&<Btn variant="ghost" sm disabled>Not Open</Btn>}
          </Card>
        ))}
      </div>
    </div>
  );
}

function SubmitAssessment({ user, onPanel, notify, onAddResult }) {
  const assessment = DEMO_ASSESSMENTS[0];
  const [answers, setAnswers] = useState({});
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markStep, setMarkStep] = useState(0);
  const [error, setError] = useState("");
  const steps=["Reading your answers...","Applying CAPS marking guidelines...","Checking method marks...","Generating question feedback...","Calculating final score...","Preparing your report..."];

  const handleSubmit = async () => {
    const answered = assessment.questions.filter(q=>answers[q.id]?.trim());
    if (answered.length===0){setError("Please answer at least one question.");return;}
    setError(""); setLoading(true); setMarkStep(0);
    try {
      const results=[];
      for (let i=0;i<assessment.questions.length;i++){
        const q=assessment.questions[i]; setMarkStep(i);
        try {
          const result=await markWithClaude(q,answers[q.id]||"(No answer provided)",q.memo,assessment.subject);
          results.push({question:q,studentAnswer:answers[q.id],...result});
        } catch(e){
          results.push({question:q,studentAnswer:answers[q.id]||"",marks_awarded:answers[q.id]?.trim()?Math.floor(q.marks*0.6):0,marks_available:q.marks,percentage:60,verdict:"partial",feedback:"Marking service unavailable — check your API key in the Claude console.",key_elements_present:[],key_elements_missing:[]});
        }
      }
      setMarkStep(steps.length-1);
      await new Promise(r=>setTimeout(r,500));
      const totalMarks=results.reduce((s,r)=>s+(r.marks_awarded||0),0);
      const totalAvailable=results.reduce((s,r)=>s+r.marks_available,0);
      onAddResult({assessmentId:assessment.id,assessmentTitle:assessment.title,studentEmail:user.email,studentName:`${user.fname} ${user.lname}`,totalMarks,totalAvailable,questionResults:results,timestamp:new Date().toISOString(),markedBy:"Claude AI (claude-sonnet-4-20250514)"});
      setLoading(false); onPanel("result-view");
    } catch(err){ setLoading(false); setError("An error occurred. Check your internet connection."); }
  };

  if (loading) return (
    <div className="fadeUp">
      <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:4 }}>Claude AI is marking your script</div>
      <div className="text-muted mb4">Please wait — this usually takes 20–40 seconds</div>
      <Card style={{ textAlign:"center",padding:48 }}>
        <Spinner/>
        <div style={{ fontFamily:"Syne,sans-serif",fontSize:18,fontWeight:700,marginBottom:8 }}>Marking in progress...</div>
        <div className="text-muted" style={{ marginBottom:24 }}>Claude is reading your answers and applying your teacher's rubric</div>
        <div style={{ textAlign:"left",maxWidth:320,margin:"0 auto" }}>
          {steps.map((s,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:9,padding:"8px 0",fontSize:12,color:i<markStep?G.green:i===markStep?G.ink:G.inkMuted,borderBottom:`1px solid ${G.paperWarm}` }}>
              <div style={{ width:7,height:7,borderRadius:"50%",background:i<markStep?G.greenLt:i===markStep?G.gold:G.paperDark,flexShrink:0,animation:i===markStep?"pulse2 1s ease infinite":"none"}}/>
              {i<markStep?"✓ ":""}{s}
            </div>
          ))}
        </div>
        <div style={{ marginTop:24,fontSize:12,color:G.inkMuted,background:G.goldPale,border:`1px solid ${G.gold}`,borderRadius:8,padding:"8px 14px" }}>🤖 <strong>Powered by Claude AI</strong> — Applying CAPS marking guidelines and generating personalised feedback</div>
      </Card>
    </div>
  );

  return (
    <div className="fadeUp">
      <div className="flex jb aic wrap gap2" style={{ marginBottom:18 }}>
        <div><div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800 }}>Submit Your Work</div><div className="text-muted">{assessment.title} · Due 24 Feb · 13:00</div></div>
        <Badge type="red">⏱ 2h 14m left</Badge>
      </div>
      <Card style={{ marginBottom:16 }}>
        <div className="flex aic gap2">
          <div style={{ background:G.ink,color:"white",borderRadius:8,padding:"7px 10px",fontSize:18,flexShrink:0 }}>📄</div>
          <div><div style={{ fontWeight:600,marginBottom:2,fontSize:13 }}>{assessment.title}</div><div className="text-muted">{assessment.subject} · {assessment.totalMarks} marks · {assessment.duration} minutes</div></div>
        </div>
        <div className="divider"/>
        <div style={{ background:G.paperWarm,padding:10,borderRadius:8,fontSize:12,color:G.inkMuted }}><strong>Instructions:</strong> {assessment.instructions}</div>
        <div style={{ background:G.goldPale,border:`1px solid ${G.gold}`,borderRadius:8,padding:10,marginTop:10,fontSize:12 }}>🤖 <strong>Claude AI Marking:</strong> Your answers will be marked by Claude AI against your teacher's memorandum. Method marks are awarded automatically. You'll receive detailed feedback per question.</div>
      </Card>
      <div style={{ marginBottom:16 }}>
        {assessment.questions.map(q=>(
          <Card key={q.id} style={{ marginBottom:12 }}>
            <div className="flex jb aic mb3">
              <div style={{ fontWeight:700,fontSize:13 }}>{q.number} <span style={{ fontWeight:400,color:G.inkMuted }}>({q.marks} mark{q.marks>1?"s":""})</span></div>
              <Badge type={answers[q.id]?.trim()?"green":"gray"}>{answers[q.id]?.trim()?"✓ Answered":"Not answered"}</Badge>
            </div>
            <div style={{ fontSize:13,color:G.ink,marginBottom:10,lineHeight:1.6 }}>{q.text}</div>
            <textarea value={answers[q.id]||""} onChange={e=>setAnswers(p=>({...p,[q.id]:e.target.value}))} placeholder="Type your answer here. Show all working where applicable..." style={{ minHeight:q.type==="maths"?110:80 }}/>
          </Card>
        ))}
      </div>
      {error&&<div style={{ background:G.redPale,border:`1px solid #f5c0c2`,borderRadius:8,padding:10,fontSize:12,color:G.red,marginBottom:14 }}>{error}</div>}
      <div style={{ display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap" }}>
        <Btn variant="ghost" onClick={()=>onPanel("home")}>← Back</Btn>
        <Btn variant="green" onClick={handleSubmit}>Submit for Claude AI Marking →</Btn>
      </div>
    </div>
  );
}

function MarkingProgress({ onPanel }) {
  useEffect(()=>{ const t=setTimeout(()=>onPanel("result-view"),4000); return()=>clearTimeout(t); },[]);
  return (
    <div className="fadeUp">
      <Card style={{ textAlign:"center",padding:48 }}>
        <Spinner/><div style={{ fontFamily:"Syne,sans-serif",fontSize:18,fontWeight:700,marginBottom:8 }}>Claude AI is marking your script</div>
        <div className="text-muted">Redirecting to your results shortly...</div>
      </Card>
    </div>
  );
}

function ResultsList({ results, onPanel }) {
  return (
    <div className="fadeUp">
      <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:4 }}>My Results</div>
      <div className="text-muted mb4">All Claude AI-marked assessments</div>
      {results.length===0?(
        <Card style={{ textAlign:"center",padding:"40px 24px" }}>
          <div style={{ fontSize:36,marginBottom:10 }}>📭</div>
          <div className="text-muted">No results yet. Submit an assessment and Claude AI will mark it.</div>
          <Btn variant="gold" style={{ marginTop:16 }} onClick={()=>onPanel("home")}>View Assessments →</Btn>
        </Card>
      ):results.map((r,i)=>(
        <Card key={i} onClick={()=>onPanel("result-view")} style={{ display:"flex",alignItems:"center",gap:12,cursor:"pointer",marginBottom:10,flexWrap:"wrap" }}>
          <div style={{ textAlign:"center",minWidth:54 }}><div style={{ fontFamily:"Syne,sans-serif",fontSize:28,fontWeight:800,color:G.gold,lineHeight:1 }}>{r.totalMarks}</div><div className="text-muted">/{r.totalAvailable}</div></div>
          <div style={{ width:1.5,height:40,background:G.paperDark,flexShrink:0 }}/>
          <div style={{ flex:"1 1 120px" }}><div style={{ fontWeight:600,fontSize:13 }}>{r.assessmentTitle}</div><div className="text-muted">Marked by Claude AI · {new Date(r.timestamp).toLocaleDateString("en-ZA")}</div></div>
          <div style={{ textAlign:"right" }}><Badge type={r.totalMarks/r.totalAvailable>=0.7?"green":r.totalMarks/r.totalAvailable>=0.4?"gold":"red"}>{Math.round((r.totalMarks/r.totalAvailable)*100)}%</Badge><div className="text-muted" style={{ marginTop:4 }}>View feedback →</div></div>
        </Card>
      ))}
    </div>
  );
}

function ResultDetail({ results, notify }) {
  const r = results[results.length-1];
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const loadInsights = async () => {
    if (!r||insights) return;
    setLoadingInsights(true);
    try {
      const data = await generateStudyPlan([r], r.assessmentTitle, "Mathematics");
      setInsights(data);
    } catch(e) {
      setInsights({recommendations:[{title:"Review your mistakes",detail:"Go through each question you lost marks on and understand why."},{title:"Show all working",detail:"Always write out every step — method marks can save your score."},{title:"Practise regularly",detail:"Consistent daily practice improves retention more than cramming."}]});
    }
    setLoadingInsights(false);
  };

  if (!r) return <Card style={{ textAlign:"center",padding:"40px 24px" }}><div style={{ fontSize:36,marginBottom:10 }}>📭</div><div className="text-muted">No result to display. Submit an assessment first.</div></Card>;

  const pct=Math.round((r.totalMarks/r.totalAvailable)*100);
  const symbol=pct>=80?"A — Outstanding":pct>=70?"B — Merit":pct>=60?"C — Achievement":pct>=50?"D — Adequate":pct>=40?"E — Elementary":"F — Not Achieved";

  return (
    <div className="fadeUp">
      <div className="flex jb aic wrap gap2" style={{ marginBottom:18 }}>
        <div><div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800 }}>Your Result</div><div className="text-muted">{r.assessmentTitle} · {new Date(r.timestamp).toLocaleDateString("en-ZA")}</div></div>
        <Btn variant="ghost" sm onClick={()=>notify("📄 PDF download — connect backend for reports","info")}>↓ Download PDF</Btn>
      </div>
      <div style={{ background:G.ink,borderRadius:12,padding:"20px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,color:"white",flexWrap:"wrap",gap:12 }}>
        <div>
          <div style={{ color:"rgba(255,255,255,.4)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5 }}>Your Score</div>
          <div style={{ fontFamily:"Syne,sans-serif",fontSize:52,fontWeight:800,color:G.gold,lineHeight:1 }}>{r.totalMarks}<span style={{ fontSize:22,color:"rgba(255,255,255,.3)" }}>/{r.totalAvailable}</span></div>
          <div style={{ display:"flex",gap:7,marginTop:10,flexWrap:"wrap" }}>
            <span style={{ background:"rgba(200,168,75,.2)",color:G.gold,padding:"3px 10px",borderRadius:100,fontSize:12 }}>{symbol}</span>
            <span style={{ background:"rgba(255,255,255,.07)",color:"rgba(255,255,255,.5)",padding:"3px 10px",borderRadius:100,fontSize:12 }}>Marked by Claude AI</span>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ color:"rgba(255,255,255,.35)",fontSize:12,marginBottom:4 }}>Score</div>
          <div style={{ fontFamily:"Syne,sans-serif",fontSize:32,fontWeight:800,color:pct>=60?G.greenLt:G.red }}>{pct}%</div>
          <div style={{ fontSize:11,color:"rgba(255,255,255,.35)",marginTop:4 }}>{r.markedBy}</div>
        </div>
      </div>
      <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:15,marginBottom:12 }}>Question-by-Question Breakdown</div>
      {r.questionResults?.map((qr,i)=>(
        <Card key={i} style={{ marginBottom:10,borderLeft:`4px solid ${qr.verdict==="correct"?G.greenLt:qr.verdict==="partial"?G.gold:G.red}` }}>
          <div className="flex jb aic mb2">
            <div style={{ fontWeight:700,fontSize:13 }}>{qr.question.number} — {qr.question.text.slice(0,60)}{qr.question.text.length>60?"...":""}</div>
            <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,color:qr.verdict==="correct"?G.green:qr.verdict==="partial"?G.gold:G.red,flexShrink:0,marginLeft:8 }}>{qr.marks_awarded}/{qr.marks_available}</div>
          </div>
          <div style={{ background:G.paperWarm,padding:"7px 11px",borderRadius:6,fontSize:12,marginBottom:6 }}>📝 <em>Your answer: {qr.studentAnswer?.slice(0,120)}{qr.studentAnswer?.length>120?"...":""}</em></div>
          {qr.verdict!=="correct"&&<div style={{ background:G.redPale,padding:"7px 11px",borderRadius:6,fontSize:12,marginBottom:6,color:G.red }}>Missing: {qr.key_elements_missing?.join(", ")||"See feedback below"}</div>}
          {qr.verdict==="correct"&&<div style={{ background:G.greenPale,padding:"7px 11px",borderRadius:6,fontSize:12,marginBottom:6,color:G.green }}>✅ Elements present: {qr.key_elements_present?.join(", ")}</div>}
          <div style={{ fontSize:12,color:G.inkMuted,fontStyle:"italic" }}>💬 <strong>Claude AI:</strong> {qr.feedback}</div>
          {qr.method_marks_awarded&&<div style={{ fontSize:11,background:G.goldPale,padding:"4px 8px",borderRadius:6,marginTop:6,display:"inline-block",color:"#8a6d10" }}>⭐ Method marks awarded</div>}
        </Card>
      ))}
      <Card style={{ background:G.ink,borderColor:G.ink,marginTop:4,marginBottom:16 }}>
        <div style={{ color:G.gold,fontFamily:"Syne,sans-serif",fontWeight:700,marginBottom:10 }}>💡 Claude AI Study Recommendations</div>
        {insights?(
          <div>{insights.recommendations?.map((rec,i)=>(
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ color:"white",fontWeight:600,fontSize:13,marginBottom:3 }}>{rec.title}</div>
              <div style={{ color:"rgba(255,255,255,.65)",fontSize:12,lineHeight:1.6 }}>{rec.detail}</div>
            </div>
          ))}</div>
        ):(
          <div>
            <div style={{ color:"rgba(255,255,255,.65)",fontSize:13,lineHeight:1.7,marginBottom:12 }}>Claude AI can generate personalised study recommendations based on your results.</div>
            <Btn variant="gold" sm onClick={loadInsights} disabled={loadingInsights}>{loadingInsights?"⏳ Generating...":"🤖 Generate AI Study Plan"}</Btn>
          </div>
        )}
      </Card>
    </div>
  );
}

function StudentProgress({ user, results }) {
  const avg = results.length>0?Math.round(results.reduce((s,r)=>s+(r.totalMarks/r.totalAvailable)*100,0)/results.length):0;
  return (
    <div className="fadeUp">
      <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:4 }}>My Progress</div>
      <div className="text-muted mb4">Track your performance over time</div>
      <div className="g3 mb4">
        <StatCard accent={G.gold} label="Overall Average" value={avg?avg+"%":"—"} sub={avg?"Based on "+results.length+" assessment"+(results.length!==1?"s":""):"No results yet"} />
        <StatCard accent={G.greenLt} label="Assessments Done" value={results.length+"/4"} sub={4-results.length+" outstanding"} />
        <StatCard accent={G.green} label="Grade" value={user?.grade||"—"} sub={user?.schools?.[0]?.name||""} />
      </div>
      {results.length>0?(
        <Card>
          <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:12 }}>Assessment History</div>
          {results.map((r,i)=>(
            <div key={i} className="mb4">
              <div className="flex jb mb2" style={{ fontSize:13 }}><span>{r.assessmentTitle}</span><strong style={{ color:r.totalMarks/r.totalAvailable>=0.7?G.green:r.totalMarks/r.totalAvailable>=0.4?G.gold:G.red }}>{Math.round((r.totalMarks/r.totalAvailable)*100)}%</strong></div>
              <ProgressBar value={Math.round((r.totalMarks/r.totalAvailable)*100)} color={r.totalMarks/r.totalAvailable>=0.7?G.greenLt:r.totalMarks/r.totalAvailable>=0.4?G.gold:G.red}/>
            </div>
          ))}
        </Card>
      ):(
        <Card style={{ textAlign:"center",padding:"40px 24px" }}><div style={{ fontSize:36,marginBottom:10 }}>📈</div><div className="text-muted">Submit your first assessment to start tracking your progress.</div></Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ADMIN APP
═══════════════════════════════════════════════════════════════════ */
function AdminApp({ user, onNav, notify, users, setUsers, adminSchools, setAdminSchools, adminAssessments, setAdminAssessments, allResults }) {
  const [panel, setPanel] = useState("overview");
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const openModal = (name, data={}) => setModal({name,data});
  const closeModal = () => setModal(null);

  const NAV=[
    {id:"overview",icon:"⊞",label:"Overview",section:"Main"},
    {id:"users",icon:"👥",label:"Users",section:"Main"},
    {id:"schools",icon:"🏫",label:"Schools",section:"Main"},
    {id:"assessments",icon:"📝",label:"Assessments",section:"Main"},
    {id:"marking",icon:"🤖",label:"AI Marking",section:"Main"},
    {id:"content",icon:"📚",label:"Content & Subjects",section:"Content"},
    {id:"billing",icon:"💳",label:"Billing & Plans",section:"Content"},
    {id:"analytics",icon:"📊",label:"Analytics",section:"Analytics"},
    {id:"logs",icon:"📋",label:"Activity Logs",section:"Analytics"},
    {id:"settings",icon:"⚙️",label:"System Settings",section:"Config"},
    {id:"security",icon:"🔒",label:"Security",section:"Config"},
  ];
  const sections=[...new Set(NAV.map(n=>n.section))];
  const totalRevenue = adminSchools.filter(s=>s.status==="active").reduce((s,school)=>s+({School:4500,Starter:800,Trial:0}[school.plan]||0),0);

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:G.ink,fontFamily:"'DM Sans',sans-serif" }}>
      {/* Sidebar */}
      <aside className="sidebar-desktop" style={{ width:sidebarOpen?220:64,background:"#080c11",borderRight:"1px solid rgba(255,255,255,.06)",padding:"0 0 24px",display:"flex",flexDirection:"column",transition:"width .2s",overflowX:"hidden",flexShrink:0,minHeight:"100vh" }}>
        <div style={{ padding:"18px 16px 14px",borderBottom:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",gap:8,cursor:"pointer" }} onClick={()=>setSidebarOpen(!sidebarOpen)}>
          <div style={{ width:32,height:32,background:G.gold,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",color:G.ink,fontSize:14,fontWeight:800,flexShrink:0 }}>E</div>
          {sidebarOpen&&<div style={{ fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:15,color:"white",whiteSpace:"nowrap" }}>EduMark <span style={{ color:G.gold }}>AI</span></div>}
        </div>
        {sidebarOpen&&<div style={{ margin:"12px 14px",background:"rgba(200,168,75,.1)",border:"1px solid rgba(200,168,75,.2)",borderRadius:8,padding:"8px 10px" }}>
          <div style={{ fontSize:9,color:G.gold,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,marginBottom:3 }}>Admin Console</div>
          <div style={{ fontSize:11,color:"rgba(255,255,255,.5)" }}>Super Administrator</div>
        </div>}
        <nav style={{ flex:1,padding:"8px 10px",overflowY:"auto" }}>
          {sections.map(sec=>(
            <div key={sec}>
              {sidebarOpen&&<div style={{ fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",color:"rgba(255,255,255,.25)",padding:"12px 8px 4px",fontWeight:600 }}>{sec}</div>}
              {NAV.filter(n=>n.section===sec).map(item=>(
                <button key={item.id} onClick={()=>setPanel(item.id)} title={!sidebarOpen?item.label:undefined}
                  style={{ display:"flex",alignItems:"center",gap:sidebarOpen?9:0,justifyContent:sidebarOpen?"flex-start":"center",padding:"9px 10px",borderRadius:8,border:"none",background:panel===item.id?"rgba(200,168,75,.12)":"transparent",color:panel===item.id?G.gold:"rgba(255,255,255,.45)",fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer",transition:"all .15s",width:"100%",textAlign:"left",marginBottom:2 }}
                  onMouseEnter={e=>{if(panel!==item.id)e.currentTarget.style.background="rgba(255,255,255,.05)";e.currentTarget.style.color="rgba(255,255,255,.85)";}}
                  onMouseLeave={e=>{if(panel!==item.id){e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,.45)";}else e.currentTarget.style.color=G.gold;}}>
                  <span style={{ fontSize:16,flexShrink:0 }}>{item.icon}</span>
                  {sidebarOpen&&<span style={{ whiteSpace:"nowrap" }}>{item.label}</span>}
                  {sidebarOpen&&panel===item.id&&<span style={{ marginLeft:"auto",width:4,height:4,borderRadius:"50%",background:G.gold,flexShrink:0 }}/>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        {sidebarOpen&&<div style={{ margin:"0 14px 8px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",borderRadius:8,padding:12 }}>
          <div style={{ fontSize:11,fontWeight:600,color:"rgba(255,255,255,.6)",marginBottom:6 }}>Platform Status</div>
          <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4 }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:G.greenLt,animation:"pulse 2s ease infinite" }}/>
            <span style={{ fontSize:11,color:"rgba(255,255,255,.4)" }}>All systems operational</span>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:10 }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:G.gold }}/>
            <span style={{ fontSize:11,color:"rgba(255,255,255,.4)" }}>Claude API active</span>
          </div>
          <button onClick={()=>onNav("landing")} style={{ display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.07)",border:"none",color:"rgba(255,255,255,.6)",padding:"7px 10px",borderRadius:7,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:12,width:"100%" }}>🏠 Back to Home</button>
        </div>}
      </aside>

      {/* Main content */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",background:G.paper,minHeight:"100vh",overflow:"auto" }}>
        <header style={{ background:"white",borderBottom:`1.5px solid ${G.paperDark}`,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:54,position:"sticky",top:0,zIndex:100,gap:12,flexShrink:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ fontFamily:"Syne,sans-serif",fontSize:16,fontWeight:800,color:G.ink }}>{NAV.find(n=>n.id===panel)?.label||"Admin"}</div>
            <div style={{ fontSize:11,color:G.inkMuted,background:G.paperWarm,padding:"2px 10px",borderRadius:100 }}>EduMark AI Administration</div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <input type="text" placeholder="🔍 Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{ width:180,fontSize:12,padding:"7px 12px" }}/>
            <div style={{ position:"relative" }}>
              <button style={{ width:34,height:34,borderRadius:8,border:`1.5px solid ${G.paperDark}`,background:"white",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={()=>notify("3 pending approvals — review in Schools or Users","warning")}>🔔</button>
              <span style={{ position:"absolute",top:-2,right:-2,width:8,height:8,background:G.red,borderRadius:"50%",border:"2px solid white" }}/>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:7,background:G.paperWarm,padding:"5px 12px 5px 7px",borderRadius:100 }}>
              <div style={{ width:26,height:26,borderRadius:"50%",background:G.ink,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:G.gold }}>SA</div>
              <span style={{ fontSize:12,fontWeight:500 }}>Super Admin</span>
            </div>
            <Btn variant="ghost" sm onClick={()=>onNav("landing")}>🏠 Home</Btn>
          </div>
        </header>

        <div style={{ flex:1,padding:"24px 28px",overflowY:"auto" }}>
          {panel==="overview"    && <AdminOverview users={users} schools={adminSchools} assessments={adminAssessments} notify={notify} openModal={openModal} setPanel={setPanel} totalRevenue={totalRevenue} allResults={allResults} />}
          {panel==="users"       && <AdminUsers users={users} setUsers={setUsers} notify={notify} openModal={openModal} closeModal={closeModal} modal={modal} search={search} />}
          {panel==="schools"     && <AdminSchools schools={adminSchools} setSchools={setAdminSchools} notify={notify} openModal={openModal} closeModal={closeModal} modal={modal} search={search} />}
          {panel==="assessments" && <AdminAssessments assessments={adminAssessments} setAssessments={setAdminAssessments} notify={notify} search={search} />}
          {panel==="marking"     && <AdminMarking notify={notify} />}
          {panel==="content"     && <AdminContent notify={notify} openModal={openModal} closeModal={closeModal} modal={modal} />}
          {panel==="billing"     && <AdminBilling schools={adminSchools} setSchools={setAdminSchools} notify={notify} openModal={openModal} closeModal={closeModal} modal={modal} totalRevenue={totalRevenue} />}
          {panel==="analytics"   && <AdminAnalytics users={users} schools={adminSchools} assessments={adminAssessments} allResults={allResults} />}
          {panel==="logs"        && <AdminLogs />}
          {panel==="settings"    && <AdminSettings notify={notify} />}
          {panel==="security"    && <AdminSecurity notify={notify} users={users} />}
        </div>
      </div>
    </div>
  );
}

/* ── ADMIN PANELS ────────────────────────────────────────────────── */

function AdminOverview({ users, schools, assessments, notify, openModal, setPanel, totalRevenue, allResults }) {
  const activeSchools  = schools.filter(s=>s.status==="active").length;
  const activeTeachers = users.filter(u=>u.role==="teacher"&&u.status==="active").length;
  const activeStudents = users.filter(u=>u.role==="student"&&u.status==="active").length;
  const totalMarked    = assessments.reduce((s,a)=>s+a.marked,0);
  const pending        = [...schools.filter(s=>s.status==="pending"), ...users.filter(u=>u.status==="pending")];

  return (
    <div className="fadeUp">
      <div className="flex jb aic wrap gap2" style={{ marginBottom:20 }}>
        <div><div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800 }}>Platform Overview</div><div className="text-muted">EduMark AI — Global administration dashboard</div></div>
        <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
          <Btn variant="ghost" sm onClick={()=>notify("📊 Generating full platform report...","info")}>Export Report</Btn>
          <Btn variant="ink" sm onClick={()=>openModal("addSchool")}>+ Add School</Btn>
        </div>
      </div>
      <div className="g4 mb4">
        <KpiCard icon="🏫" label="Active Schools" value={activeSchools} sub={`${schools.filter(s=>s.status==="trial").length} on trial`} change={12} color={G.blueLt} />
        <KpiCard icon="🎓" label="Active Teachers" value={activeTeachers} sub={`${users.filter(u=>u.status==="pending").length} pending`} change={8} color={G.gold} />
        <KpiCard icon="📚" label="Active Students" value={activeStudents} sub={`${users.reduce((s,u)=>s+u.submissions,0)} submissions`} change={23} color={G.greenLt} />
        <KpiCard icon="💰" label="Monthly Revenue" value={`R${totalRevenue.toLocaleString()}`} sub="Recurring" change={15} color={G.green} />
      </div>
      <div className="g4 mb4">
        <KpiCard icon="🤖" label="Claude Markings" value={totalMarked+allResults.length} sub="This month" change={34} color={G.purple} />
        <KpiCard icon="📝" label="Assessments" value={assessments.length} sub={`${assessments.filter(a=>a.status==="live").length} live now`} change={5} color={G.orange} />
        <KpiCard icon="⚡" label="Avg Mark Time" value="28s" sub="Per submission" change={-12} color={G.gold} />
        <KpiCard icon="✅" label="Accuracy" value="98.2%" sub="Override rate: 1.8%" change={0.3} color={G.greenLt} />
      </div>
      <div className="g2 mb4">
        <Card>
          <div className="flex jb aic mb3"><div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14 }}>Schools by Plan</div><button onClick={()=>setPanel("schools")} style={{ fontSize:12,color:G.gold,background:"none",border:"none",cursor:"pointer" }}>View all →</button></div>
          <div style={{ display:"flex",alignItems:"center",gap:20 }}>
            <DonutChart size={100} label={{ main:schools.length,sub:"schools" }} segments={[{value:schools.filter(s=>s.plan==="School").length,color:G.greenLt},{value:schools.filter(s=>s.plan==="Starter").length,color:G.gold},{value:schools.filter(s=>!["School","Starter"].includes(s.plan)).length,color:G.blueLt}]}/>
            <div style={{ flex:1 }}>
              {[["School Plan",schools.filter(s=>s.plan==="School").length,G.greenLt,"R4 500/mo"],["Starter Plan",schools.filter(s=>s.plan==="Starter").length,G.gold,"R800/mo"],["Trial / Pending",schools.filter(s=>!["School","Starter"].includes(s.plan)).length,G.blueLt,"Free"]].map(([l,c,col,note])=>(
                <div key={l} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                  <span style={{ width:8,height:8,borderRadius:"50%",background:col,flexShrink:0 }}/>
                  <span style={{ flex:1,fontSize:12 }}>{l}</span>
                  <span style={{ fontWeight:700,fontSize:13 }}>{c}</span>
                  <span style={{ fontSize:11,color:G.inkMuted }}>{note}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:14 }}>Schools by Province</div>
          {[["Gauteng",schools.filter(s=>s.province==="Gauteng").length,G.gold],["KwaZulu-Natal",schools.filter(s=>s.province==="KwaZulu-Natal").length,G.greenLt],["Western Cape",schools.filter(s=>s.province==="Western Cape").length,G.blueLt],["Other",schools.filter(s=>!["Gauteng","KwaZulu-Natal","Western Cape"].includes(s.province)).length,G.inkMuted]].map(([p,c,col])=>(
            <div key={p} style={{ marginBottom:10 }}>
              <div className="flex jb mb2" style={{ fontSize:12 }}><span>{p}</span><span style={{ fontWeight:700 }}>{c}</span></div>
              <div className="pb"><div className="pb-fill" style={{ width:`${(c/schools.length)*100}%`,background:col }}/></div>
            </div>
          ))}
        </Card>
      </div>
      {pending.length>0&&(
        <Card style={{ marginBottom:16,border:`1.5px solid ${G.gold}` }}>
          <div className="flex jb aic mb3"><div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14 }}>⚠️ Pending Approvals ({pending.length})</div><Badge type="gold" dot>Needs Action</Badge></div>
          {pending.map((item,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<pending.length-1?`1px solid ${G.paperWarm}`:"none",flexWrap:"wrap" }}>
              <div style={{ width:36,height:36,background:G.goldPale,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>{item.teachers!==undefined?"🏫":"👤"}</div>
              <div style={{ flex:1 }}><div style={{ fontWeight:600,fontSize:13 }}>{item.name||`${item.fname} ${item.lname}`}</div><div className="text-muted">{item.type||item.role} · {item.province}</div></div>
              <div style={{ display:"flex",gap:8 }}>
                <Btn variant="green" sm onClick={()=>notify(`✅ Approved: ${item.name||item.fname+" "+item.lname}`,"success")}>Approve</Btn>
                <Btn variant="danger" sm onClick={()=>notify(`❌ Rejected: ${item.name||item.fname+" "+item.lname}`,"error")}>Reject</Btn>
              </div>
            </div>
          ))}
        </Card>
      )}
      <Card>
        <div className="flex jb aic mb3"><div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14 }}>Recent Activity</div><button onClick={()=>setPanel("logs")} style={{ fontSize:12,color:G.gold,background:"none",border:"none",cursor:"pointer" }}>View all →</button></div>
        {ACTIVITY_LOG.slice(0,5).map(log=>(
          <div key={log.id} style={{ display:"flex",alignItems:"flex-start",gap:10,padding:"9px 0",borderBottom:`1px solid ${G.paperWarm}` }}>
            <div style={{ width:32,height:32,background:G.paperWarm,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>{log.icon}</div>
            <div style={{ flex:1 }}><div style={{ fontSize:13 }}>{log.msg}</div><div className="text-muted">{log.school} · {log.time}</div></div>
            <Badge type={log.severity==="success"?"green":log.severity==="warning"?"gold":"gray"}>{log.severity}</Badge>
          </div>
        ))}
      </Card>
    </div>
  );
}

function AdminUsers({ users, setUsers, notify, openModal, closeModal, modal, search }) {
  const [filter, setFilter] = useState("all");
  const [editUser, setEditUser] = useState(null);
  const filtered = users.filter(u=>{
    const q=search.toLowerCase();
    const ms=!q||`${u.fname} ${u.lname} ${u.email} ${u.school||""}`.toLowerCase().includes(q);
    const mf=filter==="all"||u.role===filter||u.status===filter;
    return ms&&mf&&u.role!=="admin";
  });

  return (
    <div className="fadeUp">
      <div className="flex jb aic wrap gap2 mb4">
        <div><div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800 }}>User Management</div><div className="text-muted">{users.filter(u=>u.role!=="admin").length} users registered</div></div>
        <div style={{ display:"flex",gap:8 }}>
          <Btn variant="ghost" sm onClick={()=>notify("📤 Exporting user list...","info")}>Export CSV</Btn>
          <Btn variant="ink" sm onClick={()=>openModal("addUser")}>+ Add User</Btn>
        </div>
      </div>
      <div className="g4 mb4">
        <KpiCard icon="🎓" label="Teachers" value={users.filter(u=>u.role==="teacher").length} sub={`${users.filter(u=>u.role==="teacher"&&u.status==="active").length} active`} color={G.gold} />
        <KpiCard icon="📚" label="Students" value={users.filter(u=>u.role==="student").length} sub={`${users.filter(u=>u.role==="student"&&u.status==="active").length} active`} color={G.greenLt} />
        <KpiCard icon="⏳" label="Pending" value={users.filter(u=>u.status==="pending").length} sub="Awaiting approval" color={G.orange} />
        <KpiCard icon="🚫" label="Inactive" value={users.filter(u=>u.status==="inactive").length} sub="No recent activity" color={G.inkMuted} />
      </div>
      <div style={{ display:"flex",gap:6,marginBottom:14,flexWrap:"wrap" }}>
        {[["all","All"],["teacher","Teachers"],["student","Students"],["active","Active"],["pending","Pending"],["inactive","Inactive"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{ padding:"5px 14px",borderRadius:100,border:`1.5px solid ${filter===v?G.gold:G.paperDark}`,background:filter===v?G.goldPale:"white",color:filter===v?"#8a6d10":G.inkMuted,fontSize:12,fontWeight:filter===v?600:400,cursor:"pointer",transition:"all .15s" }}>{l}</button>
        ))}
      </div>
      <Card>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Name</th><th>Role</th><th>School</th><th>Province</th><th>Plan</th><th>Status</th><th>Submissions</th><th>Actions</th></tr></thead>
            <tbody>{filtered.map(u=>(
              <tr key={u.id}>
                <td><div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <div style={{ width:30,height:30,borderRadius:"50%",background:u.role==="teacher"?G.goldPale:G.greenPale,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:u.role==="teacher"?"#8a6d10":G.green,flexShrink:0 }}>{u.fname[0]}{u.lname[0]}</div>
                  <div><div style={{ fontWeight:600,fontSize:13 }}>{u.fname} {u.lname}</div><div style={{ fontSize:11,color:G.inkMuted }}>{u.email}</div></div>
                </div></td>
                <td><Badge type={u.role==="teacher"?"gold":"blue"}>{u.role}</Badge></td>
                <td style={{ fontSize:12 }}>{u.schools?.[0]?.id||"—"}</td>
                <td style={{ fontSize:12 }}>{u.province}</td>
                <td><Badge type={u.plan==="School"?"green":u.plan==="Starter"?"gold":"gray"}>{u.plan||"Trial"}</Badge></td>
                <td><Badge type={u.status==="active"?"green":u.status==="pending"?"orange":"gray"} dot>{u.status}</Badge></td>
                <td style={{ fontFamily:"Syne,sans-serif",fontWeight:700 }}>{u.submissions}</td>
                <td><div style={{ display:"flex",gap:4 }}>
                  <Btn variant="ghost" sm onClick={()=>{setEditUser(u);openModal("editUser");}}>Edit</Btn>
                  {u.status==="pending"&&<Btn variant="green" sm onClick={()=>{setUsers(p=>p.map(x=>x.id===u.id?{...x,status:"active"}:x));notify("✅ User approved","success");}}>Approve</Btn>}
                  <Btn variant="danger" sm onClick={()=>{setUsers(p=>p.filter(x=>x.id!==u.id));notify("🗑️ User removed","info");}}>Remove</Btn>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
      <Modal open={modal?.name==="editUser"} onClose={closeModal} title="Edit User">
        {editUser&&<div>
          <div className="g2"><div className="fg"><label>First Name</label><input defaultValue={editUser.fname} onChange={e=>setEditUser(p=>({...p,fname:e.target.value}))}/></div><div className="fg"><label>Surname</label><input defaultValue={editUser.lname} onChange={e=>setEditUser(p=>({...p,lname:e.target.value}))}/></div></div>
          <div className="fg"><label>Email</label><input type="email" defaultValue={editUser.email} onChange={e=>setEditUser(p=>({...p,email:e.target.value}))}/></div>
          <div className="g2"><div className="fg"><label>Role</label><select defaultValue={editUser.role} onChange={e=>setEditUser(p=>({...p,role:e.target.value}))}><option value="teacher">Teacher</option><option value="student">Student</option></select></div>
          <div className="fg"><label>Status</label><select defaultValue={editUser.status} onChange={e=>setEditUser(p=>({...p,status:e.target.value}))}><option>active</option><option>inactive</option><option>pending</option></select></div></div>
          <div className="fg"><label>Plan</label><select defaultValue={editUser.plan} onChange={e=>setEditUser(p=>({...p,plan:e.target.value}))}><option>School</option><option>Starter</option><option>Trial</option></select></div>
          {editUser.role==="teacher"&&<div className="fg"><label>SACE Number</label><input defaultValue={editUser.sace||""} onChange={e=>setEditUser(p=>({...p,sace:e.target.value}))}/></div>}
          <div style={{ display:"flex",gap:10,justifyContent:"flex-end",marginTop:8 }}>
            <Btn variant="ghost" onClick={closeModal}>Cancel</Btn>
            <Btn variant="green" onClick={()=>{setUsers(p=>p.map(x=>x.id===editUser.id?editUser:x));notify("✅ User updated","success");closeModal();}}>Save Changes</Btn>
          </div>
        </div>}
      </Modal>
      <Modal open={modal?.name==="addUser"} onClose={closeModal} title="Add New User">
        <div>
          <div className="g2"><div className="fg"><label>First Name *</label><input placeholder="e.g. Nomsa"/></div><div className="fg"><label>Surname *</label><input placeholder="e.g. Dlamini"/></div></div>
          <div className="fg"><label>Email *</label><input type="email" placeholder="name@school.co.za"/></div>
          <div className="g2"><div className="fg"><label>Role</label><select><option>Teacher</option><option>Student</option></select></div><div className="fg"><label>Plan</label><select><option>Trial</option><option>Starter</option><option>School</option></select></div></div>
          <div className="fg"><label>School ID</label><input placeholder="e.g. GP-0001"/></div>
          <div style={{ display:"flex",gap:10,justifyContent:"flex-end",marginTop:8 }}>
            <Btn variant="ghost" onClick={closeModal}>Cancel</Btn>
            <Btn variant="green" onClick={()=>{notify("✅ User added","success");closeModal();}}>Add User</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function AdminSchools({ schools, setSchools, notify, openModal, closeModal, modal, search }) {
  const [editSchool, setEditSchool] = useState(null);
  const filtered = schools.filter(s=>!search||`${s.id} ${s.name} ${s.province}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="fadeUp">
      <div className="flex jb aic wrap gap2 mb4">
        <div><div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800 }}>School Management</div><div className="text-muted">{schools.length} registered schools</div></div>
        <div style={{ display:"flex",gap:8 }}>
          <Btn variant="ghost" sm onClick={()=>notify("📤 Exporting schools...","info")}>Export</Btn>
          <Btn variant="ink" sm onClick={()=>openModal("addSchool")}>+ Add School</Btn>
        </div>
      </div>
      <div className="g4 mb4">
        <KpiCard icon="✅" label="Active" value={schools.filter(s=>s.status==="active").length} sub="Paying" color={G.greenLt} />
        <KpiCard icon="🔬" label="On Trial" value={schools.filter(s=>s.status==="trial").length} sub="Free 30 days" color={G.blueLt} />
        <KpiCard icon="⏳" label="Pending" value={schools.filter(s=>s.status==="pending").length} sub="Awaiting review" color={G.orange} />
        <KpiCard icon="👥" label="Total Users" value={schools.reduce((s,x)=>s+x.teachers+x.students,0)} sub="Across all schools" color={G.gold} />
      </div>
      <Card>
        <div className="tbl-wrap"><table>
          <thead><tr><th>ID</th><th>School Name</th><th>Province</th><th>Type</th><th>Teachers</th><th>Students</th><th>Plan</th><th>Status</th><th>Submissions/mo</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map(s=>(
            <tr key={s.id}>
              <td><span style={{ fontFamily:"Syne,sans-serif",fontSize:11,fontWeight:700,color:G.gold,background:G.ink,padding:"2px 7px",borderRadius:4 }}>{s.id}</span></td>
              <td><div style={{ fontWeight:600,fontSize:13 }}>{s.name}</div><div style={{ fontSize:11,color:G.inkMuted }}>{s.district}</div></td>
              <td style={{ fontSize:12 }}>{s.province}</td>
              <td style={{ fontSize:11,color:G.inkMuted }}>{s.type}</td>
              <td style={{ textAlign:"center",fontWeight:700 }}>{s.teachers}</td>
              <td style={{ textAlign:"center",fontWeight:700 }}>{s.students}</td>
              <td><Badge type={s.plan==="School"?"green":s.plan==="Starter"?"gold":s.plan==="Trial"?"blue":"gray"}>{s.plan}</Badge></td>
              <td><Badge type={s.status==="active"?"green":s.status==="trial"?"blue":s.status==="pending"?"orange":"gray"} dot>{s.status}</Badge></td>
              <td style={{ textAlign:"center",fontWeight:700 }}>{s.monthlySubmissions}</td>
              <td><div style={{ display:"flex",gap:4 }}>
                <Btn variant="ghost" sm onClick={()=>{setEditSchool(s);openModal("editSchool");}}>Edit</Btn>
                {s.status==="pending"&&<Btn variant="green" sm onClick={()=>{setSchools(p=>p.map(x=>x.id===s.id?{...x,status:"trial"}:x));notify(`✅ ${s.name} approved`,"success");}}>Approve</Btn>}
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>
      </Card>
      <Modal open={modal?.name==="editSchool"} onClose={closeModal} title="Edit School">
        {editSchool&&<div>
          <div className="fg"><label>School Name</label><input defaultValue={editSchool.name} onChange={e=>setEditSchool(p=>({...p,name:e.target.value}))}/></div>
          <div className="g2"><div className="fg"><label>Plan</label><select defaultValue={editSchool.plan} onChange={e=>setEditSchool(p=>({...p,plan:e.target.value}))}><option>School</option><option>Starter</option><option>Trial</option></select></div><div className="fg"><label>Status</label><select defaultValue={editSchool.status} onChange={e=>setEditSchool(p=>({...p,status:e.target.value}))}><option>active</option><option>trial</option><option>pending</option><option>suspended</option></select></div></div>
          <div className="fg"><label>Contact Email</label><input defaultValue={editSchool.email} onChange={e=>setEditSchool(p=>({...p,email:e.target.value}))}/></div>
          <div className="fg"><label>Contact Phone</label><input defaultValue={editSchool.contact} onChange={e=>setEditSchool(p=>({...p,contact:e.target.value}))}/></div>
          <div className="fg"><label>Admin Notes</label><textarea placeholder="Internal notes about this school..."/></div>
          <div style={{ display:"flex",gap:10,justifyContent:"flex-end",marginTop:8 }}>
            <Btn variant="ghost" onClick={closeModal}>Cancel</Btn>
            <Btn variant="green" onClick={()=>{setSchools(p=>p.map(x=>x.id===editSchool.id?editSchool:x));notify("✅ School updated","success");closeModal();}}>Save Changes</Btn>
          </div>
        </div>}
      </Modal>
      <Modal open={modal?.name==="addSchool"} onClose={closeModal} title="Register New School">
        <div>
          <div className="fg"><label>School Name *</label><input placeholder="e.g. Hoerskool Pretoria Noord"/></div>
          <div className="g2"><div className="fg"><label>Type</label><select><option>Public Secondary School</option><option>Public Primary School</option><option>Independent Secondary School</option><option>Independent Primary School</option><option>TVET College</option></select></div><div className="fg"><label>Province</label><select>{Object.keys(SA_GEO).map(p=><option key={p}>{p}</option>)}</select></div></div>
          <div className="g2"><div className="fg"><label>Contact Email</label><input type="email" placeholder="admin@school.co.za"/></div><div className="fg"><label>Contact Phone</label><input type="tel" placeholder="012 345 6789"/></div></div>
          <div className="fg"><label>Initial Plan</label><select><option>Trial</option><option>Starter</option><option>School</option></select></div>
          <div style={{ background:G.goldPale,border:`1px solid ${G.gold}`,borderRadius:8,padding:10,fontSize:12,marginBottom:14 }}>💡 The school will receive a unique ID (e.g. <strong>GP-0007</strong>) upon approval.</div>
          <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={closeModal}>Cancel</Btn>
            <Btn variant="green" onClick={()=>{notify("🏫 School registered and ID allocated","success");closeModal();}}>Register School</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function AdminAssessments({ assessments, setAssessments, notify, search }) {
  const filtered = assessments.filter(a=>!search||`${a.title} ${a.subject} ${a.school}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="fadeUp">
      <div className="flex jb aic wrap gap2 mb4">
        <div><div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800 }}>Assessment Oversight</div><div className="text-muted">{assessments.length} assessments across all schools</div></div>
        <Btn variant="ghost" sm onClick={()=>notify("📤 Exporting assessment data...","info")}>Export</Btn>
      </div>
      <div className="g4 mb4">
        <KpiCard icon="🟢" label="Live" value={assessments.filter(a=>a.status==="live").length} sub="Open for submission" color={G.greenLt} />
        <KpiCard icon="📋" label="Draft" value={assessments.filter(a=>a.status==="draft").length} sub="Not yet published" color={G.gold} />
        <KpiCard icon="🔒" label="Closed" value={assessments.filter(a=>a.status==="closed").length} sub="Marking complete" color={G.inkMuted} />
        <KpiCard icon="📊" label="Avg Score" value={Math.round(assessments.filter(a=>a.marked>0).reduce((s,a)=>s+a.avgScore,0)/Math.max(assessments.filter(a=>a.marked>0).length,1))+"%"} sub="All marked" color={G.blue} />
      </div>
      <Card>
        <div className="tbl-wrap"><table>
          <thead><tr><th>Title</th><th>Subject</th><th>School</th><th>Due</th><th>Submissions</th><th>Avg Score</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map(a=>(
            <tr key={a.id}>
              <td><div style={{ fontWeight:600,fontSize:13 }}>{a.title}</div><div style={{ fontSize:11,color:G.inkMuted }}>{a.grade}</div></td>
              <td style={{ fontSize:12 }}>{a.subject}</td>
              <td><span style={{ fontFamily:"Syne,sans-serif",fontSize:11,fontWeight:700,color:G.gold,background:G.ink,padding:"2px 6px",borderRadius:4 }}>{a.school}</span></td>
              <td style={{ fontSize:12,color:G.inkMuted }}>{a.due}</td>
              <td style={{ textAlign:"center" }}><div style={{ fontWeight:700 }}>{a.submissions}</div>{a.submissions>0&&<div className="pb" style={{ marginTop:3,height:3 }}><div className="pb-fill" style={{ width:`${(a.marked/a.submissions)*100}%`,background:a.marked===a.submissions?G.greenLt:G.gold }}/></div>}</td>
              <td>{a.marked>0?<Badge type={a.avgScore>=70?"green":a.avgScore>=50?"gold":"red"}>{a.avgScore}%</Badge>:<span style={{ color:G.inkMuted,fontSize:12 }}>—</span>}</td>
              <td><Badge type={a.status==="live"?"green":a.status==="draft"?"gold":"gray"} dot>{a.status}</Badge></td>
              <td><div style={{ display:"flex",gap:4 }}>
                <Btn variant="ghost" sm onClick={()=>notify(`📋 Viewing ${a.title}`,"info")}>View</Btn>
                {a.status==="live"&&<Btn variant="danger" sm onClick={()=>{setAssessments(p=>p.map(x=>x.id===a.id?{...x,status:"closed"}:x));notify("Assessment closed","info");}}>Close</Btn>}
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>
      </Card>
    </div>
  );
}

function AdminMarking({ notify }) {
  const [config, setConfig] = useState({ model:"claude-sonnet-4-20250514", maxTokens:600, methodMarks:true, partialCredit:true, spellingLeniency:true, showReasoning:true, flagThreshold:0.75, autoRelease:false });
  const Toggle = ({ value, onChange }) => (
    <div onClick={onChange} style={{ width:44,height:24,borderRadius:12,background:value?G.green:G.paperDark,cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0 }}>
      <div style={{ width:18,height:18,borderRadius:"50%",background:"white",position:"absolute",top:3,left:value?23:3,transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.2)" }}/>
    </div>
  );
  return (
    <div className="fadeUp">
      <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:4 }}>AI Marking Configuration</div>
      <div className="text-muted mb4">Configure how Claude AI marks submissions across the platform</div>
      <div className="g2 mb4">
        <Card>
          <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:14 }}>Claude Model Settings</div>
          <div className="fg"><label>Active Model</label>
            <select value={config.model} onChange={e=>setConfig(p=>({...p,model:e.target.value}))}>
              <option value="claude-sonnet-4-20250514">Claude Sonnet 4 (Recommended)</option>
              <option value="claude-opus-4-6">Claude Opus 4.6 (Highest accuracy)</option>
              <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 (Fastest)</option>
            </select>
            <div className="text-muted" style={{ marginTop:4 }}>Sonnet 4 offers the best balance of speed and accuracy</div>
          </div>
          <div className="fg"><label>Max Tokens per Response</label>
            <input type="number" value={config.maxTokens} onChange={e=>setConfig(p=>({...p,maxTokens:parseInt(e.target.value)}))}/>
            <div className="text-muted" style={{ marginTop:4 }}>Higher = more detailed feedback, higher API cost</div>
          </div>
          <div className="fg"><label>AI Confidence Threshold: {Math.round(config.flagThreshold*100)}%</label>
            <input type="range" min="0.5" max="1" step="0.05" value={config.flagThreshold} onChange={e=>setConfig(p=>({...p,flagThreshold:parseFloat(e.target.value)}))} style={{ padding:0,border:"none",background:"transparent",height:"auto" }}/>
            <div className="flex jb" style={{ fontSize:11,color:G.inkMuted,marginTop:4 }}><span>Flag more (50%)</span><span>Flag less (100%)</span></div>
          </div>
        </Card>
        <Card>
          <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:14 }}>Global Marking Rules</div>
          {[["methodMarks","Award Method Marks","Give partial credit for correct working even when final answer is wrong"],[" partialCredit","Partial Credit for Essays","Allow Claude to award partial marks for partially correct answers"],["spellingLeniency","Spelling Leniency","Don't penalise for minor spelling errors in correct answers"],["showReasoning","Show AI Reasoning","Include Claude's reasoning in feedback shown to students"],["autoRelease","Auto-Release Results","Automatically release results after Claude marks (no teacher review)"]].map(([key,title,desc])=>(
            <div key={key} style={{ display:"flex",alignItems:"flex-start",gap:12,padding:"10px 0",borderBottom:`1px solid ${G.paperWarm}` }}>
              <Toggle value={config[key.trim()]} onChange={()=>setConfig(p=>({...p,[key.trim()]:!p[key.trim()]}))}/>
              <div><div style={{ fontWeight:600,fontSize:13 }}>{title}</div><div className="text-muted">{desc}</div></div>
            </div>
          ))}
        </Card>
      </div>
      <Card style={{ marginBottom:14 }}>
        <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:12 }}>CAPS Subject-Specific Prompts for Claude</div>
        <div style={{ background:G.goldPale,border:`1px solid ${G.gold}`,borderRadius:8,padding:10,fontSize:12,marginBottom:14 }}>💡 These prompts are prepended to every Claude marking request for the specified subject.</div>
        {[["Mathematics","Award method marks for correct substitution into formulas. Accept equivalent algebraic forms. Penalise missing units in final answers."],["Physical Science","Accept both SI and CGS units. Award ECF (error carried forward) marks. Diagrams must be labelled."],["Life Sciences","Accept scientific terminology variations. Award marks for correctly labelled diagrams. Essays must show logical progression."],["English HL","Mark according to CAPS rubric: Content (10), Language (10), Structure (5). Spelling errors capped at -3 marks per essay."]].map(([s,p])=>(
          <div key={s} style={{ marginBottom:12 }}>
            <div style={{ fontWeight:600,fontSize:13,marginBottom:4 }}>{s}</div>
            <textarea defaultValue={p} style={{ minHeight:60,fontSize:12 }}/>
          </div>
        ))}
      </Card>
      <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
        <Btn variant="ghost" onClick={()=>notify("Settings reset to defaults","info")}>Reset to Defaults</Btn>
        <Btn variant="green" onClick={()=>notify("✅ Claude AI marking configuration saved globally","success")}>Save Global Config</Btn>
      </div>
    </div>
  );
}

function AdminContent({ notify, openModal, closeModal, modal }) {
  const [subjects, setSubjects] = useState([
    {id:"s1",name:"Mathematics",grades:"Grade 8–12",active:true,assessments:42,avgScore:63},
    {id:"s2",name:"Physical Science",grades:"Grade 10–12",active:true,assessments:28,avgScore:58},
    {id:"s3",name:"Life Sciences",grades:"Grade 10–12",active:true,assessments:19,avgScore:71},
    {id:"s4",name:"English HL",grades:"Grade 8–12",active:true,assessments:24,avgScore:67},
    {id:"s5",name:"Afrikaans HL",grades:"Grade 8–12",active:true,assessments:16,avgScore:69},
    {id:"s6",name:"History",grades:"Grade 10–12",active:true,assessments:11,avgScore:72},
    {id:"s7",name:"Geography",grades:"Grade 10–12",active:true,assessments:14,avgScore:68},
    {id:"s8",name:"Accounting",grades:"Grade 10–12",active:true,assessments:18,avgScore:61},
    {id:"s9",name:"isiZulu HL",grades:"Grade 8–12",active:false,assessments:0,avgScore:0},
    {id:"s10",name:"Sesotho HL",grades:"Grade 8–12",active:false,assessments:0,avgScore:0},
  ]);
  return (
    <div className="fadeUp">
      <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:4 }}>Content & Subject Management</div>
      <div className="text-muted mb4">Manage CAPS subjects and platform content</div>
      <div className="g2 mb4">
        <Card>
          <div className="flex jb aic mb3"><div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14 }}>CAPS Subjects</div><Btn variant="ink" sm onClick={()=>notify("+ Add Subject — coming soon","info")}>+ Add</Btn></div>
          <div className="tbl-wrap"><table>
            <thead><tr><th>Subject</th><th>Grades</th><th>Assessments</th><th>Avg</th><th>Active</th></tr></thead>
            <tbody>{subjects.map(s=>(
              <tr key={s.id}>
                <td style={{ fontWeight:600 }}>{s.name}</td>
                <td style={{ fontSize:12 }}>{s.grades}</td>
                <td style={{ textAlign:"center" }}>{s.assessments}</td>
                <td>{s.assessments>0?<Badge type={s.avgScore>=70?"green":s.avgScore>=50?"gold":"red"}>{s.avgScore}%</Badge>:<span className="text-muted">—</span>}</td>
                <td><input type="checkbox" checked={s.active} onChange={e=>{setSubjects(p=>p.map(x=>x.id===s.id?{...x,active:e.target.checked}:x));notify(`${s.name} ${e.target.checked?"enabled":"disabled"}`);}}/></td>
              </tr>
            ))}</tbody>
          </table></div>
        </Card>
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <Card>
            <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:12 }}>CAPS Achievement Levels</div>
            {[["7 — Outstanding","80–100%",G.greenLt],["6 — Meritorious","70–79%",G.green],["5 — Substantial","60–69%",G.gold],["4 — Adequate","50–59%","#c8a84b"],["3 — Moderate","40–49%",G.orange],["2 — Elementary","30–39%",G.red],["1 — Not Achieved","0–29%","#6b1015"]].map(([l,r,c])=>(
              <div key={l} style={{ display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:`1px solid ${G.paperWarm}` }}>
                <div style={{ width:10,height:10,borderRadius:2,background:c,flexShrink:0 }}/>
                <div style={{ flex:1,fontSize:12 }}>{l}</div>
                <div style={{ fontSize:12,fontWeight:700,color:c }}>{r}</div>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:10 }}>Platform Announcements</div>
            <div className="fg"><label>System-wide Banner</label><textarea placeholder="Leave blank to hide. e.g. Platform maintenance Saturday 02:00-04:00" style={{ minHeight:60 }}/></div>
            <div className="fg"><label>Banner Type</label><select><option>Info (blue)</option><option>Warning (gold)</option><option>Critical (red)</option></select></div>
            <Btn variant="green" full sm onClick={()=>notify("📢 Announcement published","success")}>Publish</Btn>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AdminBilling({ schools, setSchools, notify, openModal, closeModal, modal, totalRevenue }) {
  return (
    <div className="fadeUp">
      <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:4 }}>Billing & Subscription Management</div>
      <div className="text-muted mb4">Manage plans, pricing, and school subscriptions</div>
      <div className="g4 mb4">
        <KpiCard icon="💰" label="Monthly Revenue" value={`R${totalRevenue.toLocaleString()}`} sub="Active subscriptions" change={15} color={G.greenLt} />
        <KpiCard icon="📈" label="Annual Run Rate" value={`R${(totalRevenue*12).toLocaleString()}`} sub="Projected ARR" color={G.gold} />
        <KpiCard icon="🔄" label="Renewals Due" value="3" sub="Next 30 days" color={G.orange} />
        <KpiCard icon="📊" label="Avg Per School" value={`R${schools.filter(s=>s.status==="active").length>0?Math.round(totalRevenue/schools.filter(s=>s.status==="active").length).toLocaleString():"0"}`} sub="Per active school" color={G.blue} />
      </div>
      <div className="g4 mb4" style={{ gap:14 }}>
        {[{name:"Trial",price:0,teachers:2,students:30,color:G.blueLt},{name:"Starter",price:800,teachers:5,students:150,color:G.gold},{name:"School",price:4500,teachers:60,students:1200,color:G.greenLt},{name:"District",price:0,teachers:999,students:9999,color:G.purple}].map(p=>(
          <div key={p.name} style={{ border:`1.5px solid ${G.paperDark}`,borderRadius:12,padding:16,position:"relative",background:"white" }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:p.color,borderRadius:"12px 12px 0 0" }}/>
            <div style={{ fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:15,marginBottom:4 }}>{p.name}</div>
            <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,color:p.color,marginBottom:6 }}>{p.price===0?p.name==="District"?"Custom":"Free":"R"+p.price.toLocaleString()}<span style={{ fontSize:11,fontWeight:400,color:G.inkMuted }}>{p.price>0?"/mo":""}</span></div>
            <div style={{ fontSize:11,marginBottom:8 }}><div className="mb2">👨‍🏫 {p.teachers===999?"Unlimited":p.teachers} teachers</div><div className="mb2">📚 {p.students===9999?"Unlimited":p.students} students</div><div>🤖 Claude AI included</div></div>
            <div style={{ fontWeight:700,fontSize:13,color:p.color }}>{schools.filter(s=>s.plan===p.name).length} schools</div>
          </div>
        ))}
      </div>
      <Card>
        <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:14 }}>School Subscriptions</div>
        <div className="tbl-wrap"><table>
          <thead><tr><th>School</th><th>Plan</th><th>Monthly Fee</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>{schools.map(s=>(
            <tr key={s.id}>
              <td><div style={{ fontWeight:600 }}>{s.name}</div><div style={{ fontSize:11,color:G.inkMuted }}>{s.id} · {s.province}</div></td>
              <td><Badge type={s.plan==="School"?"green":s.plan==="Starter"?"gold":"gray"}>{s.plan}</Badge></td>
              <td style={{ fontFamily:"Syne,sans-serif",fontWeight:700 }}>{s.plan==="School"?"R4 500":s.plan==="Starter"?"R800":s.plan==="District"?"Custom":"Free"}</td>
              <td><Badge type={s.status==="active"?"green":s.status==="trial"?"blue":"gray"} dot>{s.status}</Badge></td>
              <td style={{ fontSize:12,color:G.inkMuted }}>{s.joined}</td>
              <td><div style={{ display:"flex",gap:4 }}>
                <Btn variant="ghost" sm onClick={()=>openModal("changePlan",s)}>Change Plan</Btn>
                <Btn variant="danger" sm onClick={()=>notify(`⚠️ Subscription cancelled for ${s.name}`)}>Cancel</Btn>
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>
      </Card>
      <Modal open={modal?.name==="changePlan"} onClose={closeModal} title={`Change Plan — ${modal?.data?.name||""}`}>
        <div>
          <div className="fg"><label>Current Plan</label><input disabled value={modal?.data?.plan||""}/></div>
          <div className="fg"><label>New Plan</label><select><option>Trial</option><option>Starter (R800/mo)</option><option>School (R4 500/mo)</option><option>District (Custom)</option></select></div>
          <div className="fg"><label>Reason for Change</label><textarea placeholder="e.g. School requested upgrade, renewal discount applied..."/></div>
          <div style={{ display:"flex",gap:10,justifyContent:"flex-end",marginTop:8 }}>
            <Btn variant="ghost" onClick={closeModal}>Cancel</Btn>
            <Btn variant="green" onClick={()=>{notify("✅ Plan updated and school notified","success");closeModal();}}>Update Plan</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function AdminAnalytics({ users, schools, assessments, allResults }) {
  const monthlyData=[42,58,71,89,112,134,158,203,247,289,312,356];
  const avg=allResults.length>0?Math.round(allResults.reduce((s,r)=>s+(r.totalMarks/r.totalAvailable)*100,0)/allResults.length):assessments.filter(a=>a.marked>0).length>0?Math.round(assessments.filter(a=>a.marked>0).reduce((s,a)=>s+a.avgScore,0)/assessments.filter(a=>a.marked>0).length):0;
  return (
    <div className="fadeUp">
      <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:4 }}>Platform Analytics</div>
      <div className="text-muted mb4">Usage statistics across all schools</div>
      <div className="g4 mb4">
        <KpiCard icon="📈" label="Total Submissions" value={assessments.reduce((s,a)=>s+a.submissions,0)+allResults.length} sub="All time" change={34} color={G.greenLt} />
        <KpiCard icon="⚡" label="This Month" value="1 247" sub="AI-marked" change={18} color={G.gold} />
        <KpiCard icon="🎯" label="Platform Avg" value={avg+"%"} sub="Across all subjects" color={G.blueLt} />
        <KpiCard icon="🔄" label="Override Rate" value="1.8%" sub="Of Claude markings" change={-0.3} color={G.green} />
      </div>
      <div className="g2 mb4">
        <Card>
          <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:12 }}>Monthly Submissions (12 months)</div>
          <div style={{ display:"flex",alignItems:"flex-end",gap:4,height:120 }}>
            {monthlyData.map((v,i)=>(
              <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",gap:3 }}>
                <div style={{ width:"100%",background:i===monthlyData.length-1?G.gold:G.blueLt,borderRadius:"3px 3px 0 0",height:`${(v/Math.max(...monthlyData))*100}%`,opacity:0.6+0.4*(i/monthlyData.length) }}/>
                <div style={{ fontSize:8,color:G.inkMuted }}>{"JFMAMJJASONDK"[i]}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:12 }}>Top Performing Schools</div>
          <div className="tbl-wrap"><table>
            <thead><tr><th>School</th><th>Plan</th><th>Submissions/mo</th></tr></thead>
            <tbody>{schools.filter(s=>s.status==="active").sort((a,b)=>b.monthlySubmissions-a.monthlySubmissions).slice(0,4).map(s=>(
              <tr key={s.id}><td><div style={{ fontWeight:600,fontSize:12 }}>{s.name.slice(0,30)}</div></td><td><Badge type={s.plan==="School"?"green":"gold"}>{s.plan}</Badge></td><td style={{ textAlign:"center",fontWeight:700 }}>{s.monthlySubmissions}</td></tr>
            ))}</tbody>
          </table></div>
        </Card>
      </div>
    </div>
  );
}

function AdminLogs() {
  const [filter, setFilter] = useState("all");
  return (
    <div className="fadeUp">
      <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:4 }}>Activity Logs</div>
      <div className="text-muted mb4">All platform events and user activity</div>
      <div style={{ display:"flex",gap:6,marginBottom:14,flexWrap:"wrap" }}>
        {[["all","All Events"],["success","Success"],["warning","Warnings"],["info","Info"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{ padding:"5px 14px",borderRadius:100,border:`1.5px solid ${filter===v?G.gold:G.paperDark}`,background:filter===v?G.goldPale:"white",color:filter===v?"#8a6d10":G.inkMuted,fontSize:12,cursor:"pointer" }}>{l}</button>
        ))}
      </div>
      <Card>
        {ACTIVITY_LOG.filter(l=>filter==="all"||l.severity===filter).map((log,i,arr)=>(
          <div key={log.id} style={{ display:"flex",alignItems:"flex-start",gap:12,padding:"12px 0",borderBottom:i<arr.length-1?`1px solid ${G.paperWarm}`:"none" }}>
            <div style={{ width:36,height:36,background:log.severity==="success"?G.greenPale:log.severity==="warning"?G.goldPale:G.paperWarm,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{log.icon}</div>
            <div style={{ flex:1 }}><div style={{ fontSize:13,fontWeight:500 }}>{log.msg}</div><div className="text-muted">{log.school} · {log.time}</div></div>
            <Badge type={log.severity==="success"?"green":log.severity==="warning"?"gold":"gray"}>{log.severity}</Badge>
          </div>
        ))}
      </Card>
    </div>
  );
}

function AdminSettings({ notify }) {
  const [s, setS] = useState({ platformName:"EduMark AI", supportEmail:"support@edumark.ai", timezone:"Africa/Johannesburg", maintenanceMode:false, newRegistrations:true, trialDays:30, apiRateLimit:100, emailNotifications:true, backupFrequency:"daily", defaultLanguage:"en-ZA" });
  const Toggle = ({ value, onChange }) => (
    <div onClick={onChange} style={{ width:44,height:24,borderRadius:12,background:value?G.green:G.paperDark,cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0 }}>
      <div style={{ width:18,height:18,borderRadius:"50%",background:"white",position:"absolute",top:3,left:value?23:3,transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.2)" }}/>
    </div>
  );
  const Row = ({ label, desc, children }) => (
    <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",padding:"14px 0",borderBottom:`1px solid ${G.paperWarm}`,gap:16,flexWrap:"wrap" }}>
      <div style={{ flex:1,minWidth:200 }}><div style={{ fontWeight:600,fontSize:13 }}>{label}</div><div className="text-muted">{desc}</div></div>
      <div style={{ flexShrink:0 }}>{children}</div>
    </div>
  );
  return (
    <div className="fadeUp">
      <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:4 }}>System Settings</div>
      <div className="text-muted mb4">Global configuration for the EduMark AI platform</div>
      <div className="g2 mb4">
        <Card>
          <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:4 }}>Platform Identity</div><div className="divider"/>
          <Row label="Platform Name" desc="Displayed throughout the app"><input value={s.platformName} onChange={e=>setS(p=>({...p,platformName:e.target.value}))} style={{ width:180,fontSize:12 }}/></Row>
          <Row label="Support Email" desc="Where users contact for help"><input value={s.supportEmail} onChange={e=>setS(p=>({...p,supportEmail:e.target.value}))} style={{ width:200,fontSize:12 }}/></Row>
          <Row label="Default Language" desc="Platform interface language"><select value={s.defaultLanguage} onChange={e=>setS(p=>({...p,defaultLanguage:e.target.value}))} style={{ width:150,fontSize:12 }}><option value="en-ZA">English (South Africa)</option><option value="af-ZA">Afrikaans</option><option value="zu-ZA">isiZulu</option><option value="xh-ZA">isiXhosa</option></select></Row>
          <Row label="Timezone" desc="All timestamps in this timezone"><select value={s.timezone} onChange={e=>setS(p=>({...p,timezone:e.target.value}))} style={{ width:200,fontSize:12 }}><option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option><option value="UTC">UTC</option></select></Row>
        </Card>
        <Card>
          <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:4 }}>Registration & Access</div><div className="divider"/>
          <Row label="New Registrations" desc="Allow new schools and users to register"><Toggle value={s.newRegistrations} onChange={()=>setS(p=>({...p,newRegistrations:!p.newRegistrations}))}/></Row>
          <Row label="Maintenance Mode" desc="Show maintenance page to all users"><Toggle value={s.maintenanceMode} onChange={()=>setS(p=>({...p,maintenanceMode:!p.maintenanceMode}))}/></Row>
          <Row label="Trial Period (days)" desc="How long free trials last"><input type="number" value={s.trialDays} onChange={e=>setS(p=>({...p,trialDays:parseInt(e.target.value)}))} style={{ width:70,fontSize:12 }}/></Row>
          <Row label="API Rate Limit" desc="Claude API calls per school per hour"><input type="number" value={s.apiRateLimit} onChange={e=>setS(p=>({...p,apiRateLimit:parseInt(e.target.value)}))} style={{ width:70,fontSize:12 }}/></Row>
          <Row label="Email Notifications" desc="Send automated emails for key events"><Toggle value={s.emailNotifications} onChange={()=>setS(p=>({...p,emailNotifications:!p.emailNotifications}))}/></Row>
        </Card>
      </div>
      <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
        <Btn variant="danger" onClick={()=>notify("⚠️ Cache cleared","warning")}>Clear Cache</Btn>
        <Btn variant="ghost" onClick={()=>notify("Settings unchanged")}>Discard</Btn>
        <Btn variant="green" onClick={()=>notify("✅ Settings saved globally","success")}>Save All Settings</Btn>
      </div>
    </div>
  );
}

function AdminSecurity({ notify, users }) {
  const [ss, setSs] = useState({ twoFactor:false, sessionTimeout:60, minPasswordLength:8, maxLoginAttempts:5, requireSACE:true, auditLogs:true });
  const Toggle = ({ value, onChange }) => (
    <div onClick={onChange} style={{ width:44,height:24,borderRadius:12,background:value?G.green:G.paperDark,cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0 }}>
      <div style={{ width:18,height:18,borderRadius:"50%",background:"white",position:"absolute",top:3,left:value?23:3,transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.2)" }}/>
    </div>
  );
  const Row = ({ label, desc, children }) => (
    <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",padding:"14px 0",borderBottom:`1px solid ${G.paperWarm}`,gap:16,flexWrap:"wrap" }}>
      <div style={{ flex:1,minWidth:200 }}><div style={{ fontWeight:600,fontSize:13 }}>{label}</div><div className="text-muted">{desc}</div></div>
      <div style={{ flexShrink:0 }}>{children}</div>
    </div>
  );
  return (
    <div className="fadeUp">
      <div style={{ fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,marginBottom:4 }}>Security Settings</div>
      <div className="text-muted mb4">Authentication, access control, and POPIA compliance</div>
      <div style={{ background:G.greenPale,border:`1px solid ${G.greenLt}`,borderRadius:10,padding:"11px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10 }}>
        <span style={{ fontSize:20 }}>🔒</span>
        <div><div style={{ fontWeight:600,fontSize:13,color:G.green }}>POPIA Compliance Active</div><div style={{ fontSize:12,color:G.green }}>Platform registered with the SA Information Regulator. Data hosted in AWS Cape Town (af-south-1).</div></div>
      </div>
      <div className="g2 mb4">
        <Card>
          <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:4 }}>Authentication</div><div className="divider"/>
          <Row label="Two-Factor Authentication" desc="Require 2FA for admin and teacher accounts"><Toggle value={ss.twoFactor} onChange={()=>setSs(p=>({...p,twoFactor:!p.twoFactor}))}/></Row>
          <Row label="Session Timeout (minutes)" desc="Auto-logout inactive users"><input type="number" value={ss.sessionTimeout} onChange={e=>setSs(p=>({...p,sessionTimeout:e.target.value}))} style={{ width:70,fontSize:12 }}/></Row>
          <Row label="Min Password Length" desc="Minimum characters for passwords"><input type="number" value={ss.minPasswordLength} onChange={e=>setSs(p=>({...p,minPasswordLength:e.target.value}))} style={{ width:70,fontSize:12 }}/></Row>
          <Row label="Max Login Attempts" desc="Lock account after failed attempts"><input type="number" value={ss.maxLoginAttempts} onChange={e=>setSs(p=>({...p,maxLoginAttempts:e.target.value}))} style={{ width:70,fontSize:12 }}/></Row>
          <Row label="Require SACE Number" desc="Teachers must provide valid SACE registration"><Toggle value={ss.requireSACE} onChange={()=>setSs(p=>({...p,requireSACE:!p.requireSACE}))}/></Row>
        </Card>
        <Card>
          <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:4 }}>POPIA & Data Protection</div><div className="divider"/>
          <Row label="Audit Logs" desc="Log all user actions for POPIA compliance"><Toggle value={ss.auditLogs} onChange={()=>setSs(p=>({...p,auditLogs:!p.auditLogs}))}/></Row>
          <Row label="Data Retention Period" desc="How long student data is kept"><select style={{ width:150,fontSize:12 }}><option>3 years (CAPS)</option><option>5 years</option><option>7 years</option></select></Row>
          <Row label="Data Hosting Region" desc="Where student data is physically stored"><select style={{ width:180,fontSize:12 }}><option>AWS Cape Town (af-south-1)</option><option>Azure SA North (Johannesburg)</option></select></Row>
          <Row label="Information Officer" desc="Registered with SA Information Regulator"><div style={{ fontSize:12,fontWeight:500,color:G.green }}>✅ Registered</div></Row>
          <Row label="Right to Erasure" desc="Allow data deletion requests under POPIA"><Btn variant="ghost" sm onClick={()=>notify("📧 Configure POPIA erasure workflow — connect backend","info")}>Configure</Btn></Row>
        </Card>
      </div>
      <Card style={{ marginBottom:14 }}>
        <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,marginBottom:12 }}>Flagged Accounts</div>
        {users.filter(u=>u.status==="inactive"||u.status==="pending").length===0?(
          <div style={{ textAlign:"center",padding:"24px 16px",color:G.inkMuted }}>No flagged or suspended accounts</div>
        ):users.filter(u=>u.status!=="active"&&u.role!=="admin").map(u=>(
          <div key={u.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${G.paperWarm}`,flexWrap:"wrap" }}>
            <div style={{ flex:1 }}><div style={{ fontWeight:600,fontSize:13 }}>{u.fname} {u.lname}</div><div className="text-muted">{u.email} · {u.role}</div></div>
            <Badge type={u.status==="pending"?"orange":"gray"} dot>{u.status}</Badge>
            <div style={{ display:"flex",gap:6 }}>
              <Btn variant="green" sm onClick={()=>notify(`✅ ${u.fname} account restored`,"success")}>Restore</Btn>
              <Btn variant="danger" sm onClick={()=>notify(`🗑️ ${u.fname} deleted`)}>Delete</Btn>
            </div>
          </div>
        ))}
      </Card>
      <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
        <Btn variant="ghost" onClick={()=>notify("Security audit log downloaded","info")}>Download Audit Log</Btn>
        <Btn variant="green" onClick={()=>notify("✅ Security settings saved","success")}>Save Security Settings</Btn>
      </div>
    </div>
  );
}
