const logo = `<span class="logo" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M3.5 5.5c3.2-.8 5.9-.3 8.5 1.5v12c-2.6-1.8-5.3-2.3-8.5-1.5v-12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M20.5 5.5c-3.2-.8-5.9-.3-8.5 1.5v12c2.6-1.8 5.3-2.3 8.5-1.5v-12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></span>`;

const state = {
  screen: "today",
  history: [],
  schedule: { date: "Wed, Oct 7", time: "7:00 PM", duration: "2 hours", calendar: "Google Calendar" },
  draft: null,
  picker: null,
};

const data = {
  plans: [
    { id: "prototype", when: "Today · 7:00–8:00 PM", title: "Prototype critique", copy: "Finish interaction flow and annotations · 60 min", warning: false },
    { id: "deadline", when: "Tomorrow · 11:59 PM", title: "Prototype critique", copy: "Interaction Design · About 2 hours remaining", warning: true },
    { id: "portfolio", when: "Friday · 3:00–4:30 PM", title: "Portfolio case study", copy: "Draft the problem framing and add two process images" },
    { id: "reading", when: "Monday · 6:00–6:45 PM", title: "Research methods reading", copy: "Read chapter 6 and capture three discussion notes" },
  ],
  grades: [
    { id: "research", title: "Research synthesis", score: "84 / 100", copy: "Interaction Design · 3 comments ready" },
    { id: "quiz", title: "Usability quiz", score: "18 / 20", copy: "Interaction Design · No comments" },
    { id: "journey", title: "Journey map critique", score: "92 / 100", copy: "Service Design · 1 instructor comment" },
    { id: "participation", title: "Studio participation", score: "10 / 10", copy: "Interaction Design · No comments" },
  ],
};

function go(screen) { state.history.push(state.screen); state.screen = screen; render(); }
function back() { state.screen = state.history.pop() || "today"; render(); }
function header(title, backLabel) { return `<header class="header">${backLabel ? `<button class="back" data-action="back">‹ ${backLabel}</button>` : ""}<div class="brand">${logo}<span>Coursewise</span></div><h1>${title}</h1></header>`; }
function nav(active) { return `<nav class="nav" aria-label="Primary">${["Today","Plan","Grades","Courses"].map(label => `<button data-tab="${label.toLowerCase()}" class="${active===label.toLowerCase()?"active":""}">${label}</button>`).join("")}</nav>`; }
function screen(body, active) { return `<div class="shell"><section class="phone"><div class="screen">${body}</div>${active ? nav(active) : ""}</section><aside class="desktop-note">Interactive Coursewise student prototype</aside></div>`; }
function card(item, kind) { return `<button class="card" data-${kind}="${item.id}"><span class="eyebrow ${item.warning?"warning":""}">${item.when || "Posted recently"}</span><div class="card-title">${item.title}</div>${item.score?`<div class="metric">${item.score}</div>`:""}<div class="card-copy">${item.copy}</div></button>`; }

const views = {
  today: () => screen(`${header("Good afternoon, Jordan")}<p class="lede">Here’s what changed and what deserves your attention.</p><div class="stack"><button class="card" data-action="grade"><span class="eyebrow">New grade</span><div class="card-title">Research synthesis</div><div class="metric">84 / 100</div><div class="card-copy">Your course grade changed from 88% to 86%.</div></button><button class="card" data-action="schedule"><span class="eyebrow warning">Due tomorrow</span><div class="card-title">Prototype critique</div><div class="card-copy">Interaction Design · 11:59 PM</div></button></div>`, "today"),
  plan: () => screen(`${header("Plan")}<p class="lede">Your next seven days</p><div class="stack">${data.plans.map(p=>card(p,"plan")).join("")}</div>`, "plan"),
  grades: () => screen(`${header("Grades")}<p class="lede">Recent grades and feedback</p><div class="stack">${data.grades.map(g=>card(g,"grade-id")).join("")}</div>`, "grades"),
  courses: () => screen(`${header("Courses")}<div class="stack">${[["Interaction Design","DES 220 · 86% · 1 deadline tomorrow"],["Design Research","DES 240 · 92% · Nothing due this week"],["Visual Systems","DES 210 · 89% · Next deadline Friday"]].map(([a,b],i)=>`<button class="card" ${i===0?'data-action="course"':''}><div class="card-title">${a}</div><div class="card-copy">${b}</div></button>`).join("")}</div>`, "courses"),
  grade: () => screen(`${header("Research synthesis", "Grades")}<p class="lede">Interaction Design · Graded today</p><div class="card"><div class="metric">84 / 100</div><p class="card-copy">Your course grade changed from 88% to 86%.</p><div class="score-grid">${[["Research depth","22 / 25"],["Synthesis","19 / 25"],["Evidence","20 / 25"],["Presentation","23 / 25"]].map(x=>`<div class="score-row"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join("")}</div></div><div class="actions"><button class="button primary" data-action="feedback">Review feedback</button></div>`),
  feedback: () => screen(`${header("Your feedback", "Grade")}<p class="lede">Everything connected to this grade, in one place.</p><div class="stack"><div class="card"><span class="eyebrow">AI summary</span><p class="card-copy">Your research is strong. Connect evidence more explicitly to each insight.</p></div><div class="card"><span class="eyebrow">Instructor comment</span><p class="card-copy">“Show which observations support each conclusion.”</p></div></div><div class="actions"><button class="button primary" data-action="laptop">Open on laptop</button></div>`),
  laptop: () => screen(`${header("Open on your laptop", "Feedback")}<p class="lede">Continue with the full assignment and feedback when a laptop is available.</p><div class="card"><span class="eyebrow">Nearby device</span><div class="card-title">Jordan’s MacBook Pro</div><p class="card-copy">Signed in to Coursewise · Available now</p></div><div class="actions"><button class="button primary" data-action="opened">Open on this Mac</button><button class="button secondary" data-action="copied">Copy secure link</button></div>`),
  schedule: () => screen(`${header("Choose your work time", "Plan")}<p class="lede">Coursewise suggests two one-hour sessions based on the deadline and your open time.</p><div class="stack">${scheduleFields(state.schedule, "edit")}</div><div class="actions"><button class="button primary" data-action="save-schedule">Save custom time</button><button class="button secondary" data-action="suggested">Use suggested plan</button></div>`),
  edit: () => { const d=state.draft||state.schedule; return screen(`${header("Edit schedule", "Custom schedule")}<p class="lede">Choose when Coursewise should reserve time.</p><div class="stack">${scheduleFields(d,"picker")}</div><div class="actions"><button class="button primary" data-action="confirm-edit">Confirm changes</button></div>`); },
  picker: () => { const opts={date:["Wed, Oct 7","Thu, Oct 8","Fri, Oct 9"],time:["6:30 PM","7:00 PM","8:00 PM"],duration:["60 minutes","90 minutes","2 hours"],calendar:["Google Calendar","Apple Calendar"]}[state.picker]; const label={date:"date",time:"start time",duration:"duration",calendar:"calendar"}[state.picker]; return screen(`${header(`Choose a ${label}`, "Edit schedule")}<p class="lede">Select an option to update your schedule.</p><div class="stack">${opts.map(o=>`<button class="card option ${(state.draft||state.schedule)[state.picker]===o?"selected":""}" data-choice="${escapeHtml(o)}"><div class="card-title">${o}</div></button>`).join("")}</div>`); },
  saved: () => screen(`${header("Plan added")}<div class="card notice"><span class="eyebrow">Added to ${state.schedule.calendar}</span><div class="card-title">Prototype critique</div><p class="card-copy">${state.schedule.date} · ${state.schedule.time} · ${state.schedule.duration}</p></div><div class="actions"><button class="button primary" data-tab="today">Back to Today</button></div>`),
  detail: () => { const item=state.detail; return screen(`${header(item.title, item.kind==="plan"?"Plan":"Grades")}<span class="eyebrow">${item.when||item.score}</span><p class="lede" style="margin-top:10px">${item.copy}</p><div class="card"><div class="card-title">${item.kind==="plan"?"Work session details":"Grade details"}</div><p class="card-copy">${item.kind==="plan"?"Coursewise keeps this work block connected to the original assignment.":"This grade is included in your current course total."}</p></div>${item.kind==="plan"?'<div class="actions"><button class="button secondary" data-action="schedule">Edit this plan</button></div>':""}`); },
  course: () => screen(`${header("Interaction Design", "Courses")}<div class="card"><span class="eyebrow">DES 220 · Prof. Lin</span><div class="metric">86%</div><p class="card-copy">Grades, feedback, and plans for this course.</p></div>`),
  message: () => screen(`${header("Ready", "Back")}<div class="card notice"><div class="card-title">${state.message}</div></div><div class="actions"><button class="button primary" data-tab="today">Done</button></div>`),
};

function scheduleFields(d, action) { return [["date","Date"],["time","Start time"],["duration","Duration"],["calendar","Calendar"]].map(([key,label])=>`<button class="card row" data-${action}="${key}"><span>${label}</span><span class="field-value">${d[key]} ›</span></button>`).join(""); }
function escapeHtml(s) { return s.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }

function render() { document.getElementById("app").innerHTML = (views[state.screen]||views.today)(); window.scrollTo(0,0); }

document.addEventListener("click", e => {
  const el=e.target.closest("button"); if(!el)return;
  if(el.dataset.action==="back") return back();
  if(el.dataset.tab) return go(el.dataset.tab);
  if(el.dataset.action==="grade") return go("grade");
  if(el.dataset.action==="feedback") return go("feedback");
  if(el.dataset.action==="laptop") return go("laptop");
  if(el.dataset.action==="schedule") { state.draft={...state.schedule}; return go("schedule"); }
  if(el.dataset.action==="course") return go("course");
  if(el.dataset.action==="opened"||el.dataset.action==="copied") { state.message=el.dataset.action==="opened"?"Coursewise opened the assignment on your laptop.":"Secure link copied. It expires in 24 hours."; return go("message"); }
  if(el.dataset.edit) { state.draft={...state.schedule}; return go("edit"); }
  if(el.dataset.picker) { state.picker=el.dataset.picker; return go("picker"); }
  if(el.dataset.choice) { state.draft[state.picker]=el.dataset.choice; return back(); }
  if(el.dataset.action==="confirm-edit") { state.schedule={...state.draft}; return go("schedule"); }
  if(el.dataset.action==="save-schedule") return go("saved");
  if(el.dataset.action==="suggested") { state.schedule={date:"Wed, Oct 7",time:"7:00 PM",duration:"2 hours",calendar:"Google Calendar"}; return go("saved"); }
  if(el.dataset.plan) { const item=data.plans.find(x=>x.id===el.dataset.plan); if(item.id==="prototype"||item.id==="deadline") return go("schedule"); state.detail={...item,kind:"plan"}; return go("detail"); }
  if(el.dataset.gradeId) { const item=data.grades.find(x=>x.id===el.dataset.gradeId); if(item.id==="research")return go("grade"); state.detail={...item,kind:"grade"}; return go("detail"); }
});

render();
