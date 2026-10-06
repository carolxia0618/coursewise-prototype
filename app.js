const logo = `<span class="logo" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M3.5 5.5c3.2-.8 5.9-.3 8.5 1.5v12c-2.6-1.8-5.3-2.3-8.5-1.5v-12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M20.5 5.5c-3.2-.8-5.9-.3-8.5 1.5v12c2.6-1.8 5.3-2.3 8.5-1.5v-12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></span>`;

const state = {
  screen: "today",
  history: [],
  schedule: { date: "Wed, Oct 7", time: "7:00 PM", duration: "2 hours", calendar: "Google Calendar" },
  draft: null,
  picker: null,
  addedPlan: null,
  showPlanConfirmation: false,
  calendarMonth: new Date(2026, 9, 1),
};

const data = {
  plans: [
    { id: "prototype", type: "Planned work", course: "DES 220 · Interaction Design", when: "Today · 7:00–8:00 PM", title: "Prototype critique", copy: "Finish interaction flow and annotations · 60 min" },
    { id: "deadline", type: "Due", course: "DES 220 · Interaction Design", when: "Tomorrow · 11:59 PM", title: "Prototype critique", copy: "Submission deadline · About 2 hours remaining", warning: true },
    { id: "portfolio", type: "Planned work", course: "DES 230 · Portfolio Studio", when: "Friday · 3:00–4:30 PM", title: "Portfolio case study", copy: "Draft the problem framing and add two process images" },
    { id: "reading", type: "Planned work", course: "DES 240 · Design Research", when: "Monday · 6:00–6:45 PM", title: "Research methods reading", copy: "Read chapter 6 and capture three discussion notes" },
  ],
  grades: [
    { id: "research", posted: "Posted Oct 5", course: "DES 220 · Interaction Design", title: "Research synthesis", score: "84 / 100", copy: "3 comments ready" },
    { id: "quiz", posted: "Posted Oct 3", course: "DES 220 · Interaction Design", title: "Usability quiz", score: "18 / 20", copy: "No comments" },
    { id: "journey", posted: "Posted Sep 29", course: "DES 240 · Design Research", title: "Journey map critique", score: "92 / 100", copy: "1 instructor comment" },
    { id: "participation", posted: "Posted Sep 26", course: "DES 210 · Visual Systems", title: "Studio participation", score: "10 / 10", copy: "No comments" },
  ],
};

function go(screen) { state.history.push(state.screen); state.screen = screen; render(); }
function back() { state.screen = state.history.pop() || "today"; render(); }
function header(title, backLabel) { return `<header class="header">${backLabel ? `<button class="back" data-action="back">‹ ${backLabel}</button>` : ""}<div class="brand">${logo}<span>Coursewise</span></div><h1>${title}</h1></header>`; }
function nav(active) { return `<nav class="nav" aria-label="Primary">${["Today","Plan","Grades","Courses"].map(label => `<button data-tab="${label.toLowerCase()}" class="${active===label.toLowerCase()?"active":""}">${label}</button>`).join("")}</nav>`; }
function screen(body, active) { return `<div class="shell"><section class="phone"><div class="screen">${body}</div>${active ? nav(active) : ""}</section><aside class="desktop-note">Interactive Coursewise student prototype</aside></div>`; }
function card(item, kind) { return `<button class="card" data-${kind}="${item.id}">${item.type?`<span class="type-badge ${item.warning?"due":"planned"}">${item.type}</span>`:""}<span class="eyebrow ${item.warning?"warning":""}">${item.when || item.posted}</span>${item.course?`<div class="course-label">${item.course}</div>`:""}<div class="card-title">${item.title}</div>${item.score?`<div class="metric">${item.score}</div>`:""}<div class="card-copy">${item.copy}</div></button>`; }

const views = {
  today: () => screen(`${header("Good afternoon, Jamie")}<p class="lede">Here’s what changed and what deserves your attention.</p><div class="stack"><button class="card" data-action="grade"><span class="eyebrow">New grade</span><div class="course-label">DES 220 · Interaction Design</div><div class="card-title">Research synthesis</div><div class="metric">84 / 100</div><div class="card-copy">Your course grade changed from 88% to 86%.</div></button><button class="card" data-action="schedule"><span class="eyebrow warning">Due tomorrow</span><div class="course-label">DES 220 · Interaction Design</div><div class="card-title">Prototype critique</div><div class="card-copy">Due at 11:59 PM</div></button></div>`, "today"),
  plan: () => { const plans=state.addedPlan?[state.addedPlan,...data.plans.filter(p=>p.id!=="prototype")]:data.plans; return screen(`${header("Plan")}<p class="lede">Your next seven days</p>${state.showPlanConfirmation?'<div class="plan-sync"><span>✓</span><div><strong>Schedule added</strong><p>Your new work session is saved in Coursewise Plan.</p></div></div>':''}<div class="stack">${plans.map(p=>card(p,"plan")).join("")}</div>`, "plan"); },
  grades: () => screen(`${header("Grades")}<p class="lede">Recent grades and feedback</p><div class="stack">${data.grades.map(g=>card(g,"grade-id")).join("")}</div>`, "grades"),
  courses: () => screen(`${header("Courses")}<div class="stack">${[["Interaction Design","DES 220 · 86% · 1 deadline tomorrow"],["Design Research","DES 240 · 92% · Nothing due this week"],["Visual Systems","DES 210 · 89% · Next deadline Friday"]].map(([a,b],i)=>`<button class="card" ${i===0?'data-action="course"':''}><div class="card-title">${a}</div><div class="card-copy">${b}</div></button>`).join("")}</div>`, "courses"),
  grade: () => screen(`${header("Research synthesis", "Grades")}<p class="lede">Interaction Design · Graded today</p><div class="card"><div class="metric">84 / 100</div><p class="card-copy">Your course grade changed from 88% to 86%.</p><div class="score-grid">${[["Research depth","22 / 25"],["Synthesis","19 / 25"],["Evidence","20 / 25"],["Presentation","23 / 25"]].map(x=>`<div class="score-row"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join("")}</div></div><div class="actions"><button class="button primary" data-action="feedback">Review feedback</button></div>`),
  feedback: () => screen(`${header("Your feedback", "Grade")}<p class="lede">Everything connected to this grade, in one place.</p><div class="stack"><div class="card"><span class="eyebrow">AI summary</span><p class="card-copy">Your research is strong. Connect evidence more explicitly to each insight.</p></div><div class="card"><span class="eyebrow">Instructor comment</span><p class="card-copy">“Show which observations support each conclusion.”</p></div></div>`),
  laptop: () => screen(`${header("Open on your laptop", "Feedback")}<p class="lede">Continue with the full assignment and feedback when a laptop is available.</p><div class="card"><span class="eyebrow">Nearby device</span><div class="card-title">Jordan’s MacBook Pro</div><p class="card-copy">Signed in to Coursewise · Available now</p></div><div class="actions"><button class="button primary" data-action="opened">Open on this Mac</button><button class="button secondary" data-action="copied">Copy secure link</button></div>`),
  schedule: () => { const d=state.draft||state.schedule; return screen(`${header("Choose your work time", "Plan")}<p class="lede">Coursewise suggests two one-hour sessions based on the deadline and your open time.</p><div class="stack">${scheduleFields(d, "picker")}</div><div class="actions"><button class="button primary" data-action="save-schedule">Save custom time</button><button class="button secondary" data-action="suggested">Use suggested plan</button></div>`); },
  edit: () => { const d=state.draft||state.schedule; return screen(`${header("Edit schedule", "Custom schedule")}<p class="lede">Choose when Coursewise should reserve time.</p><div class="stack">${scheduleFields(d,"picker")}</div><div class="actions"><button class="button primary" data-action="confirm-edit">Confirm changes</button></div>`); },
  picker: () => pickerView(),
  saved: () => screen(`${header("Added to your Plan")}<div class="card notice"><span class="eyebrow">Coursewise Plan</span><div class="card-title">Prototype critique</div><p class="card-copy">${state.schedule.date} · ${state.schedule.time} · ${state.schedule.duration}</p></div><p class="saved-copy">${state.schedule.calendar==="No Calendar"?"This work session is now in your Coursewise Plan.":`This work session is now in your Coursewise Plan and ${state.schedule.calendar}.`}</p><div class="actions"><button class="button primary" data-action="view-plan">View in Plan</button><button class="button secondary" data-tab="today">Back to Today</button></div>`),
  detail: () => { const item=state.detail; return screen(`${header(item.title, item.kind==="plan"?"Plan":"Grades")}<span class="eyebrow">${item.when||item.score}</span><p class="lede" style="margin-top:10px">${item.copy}</p><div class="card"><div class="card-title">${item.kind==="plan"?"Work session details":"Grade details"}</div><p class="card-copy">${item.kind==="plan"?"Coursewise keeps this work block connected to the original assignment.":"This grade is included in your current course total."}</p></div>${item.kind==="plan"?'<div class="actions"><button class="button secondary" data-action="schedule">Edit this plan</button></div>':""}`); },
  course: () => screen(`${header("Interaction Design", "Courses")}<div class="card"><span class="eyebrow">DES 220 · Prof. Lin</span><div class="metric">86%</div><p class="card-copy">Grades, feedback, and plans for this course.</p></div>`),
  message: () => screen(`${header("Ready", "Back")}<div class="card notice"><div class="card-title">${state.message}</div></div><div class="actions"><button class="button primary" data-tab="today">Done</button></div>`),
};

function scheduleFields(d, action) { return [["date","Date"],["time","Start time"],["duration","Duration"],["calendar","Calendar"]].map(([key,label])=>`<button class="card row" data-${action}="${key}"><span>${label}</span><span class="field-value">${d[key]} ›</span></button>`).join(""); }
function escapeHtml(s) { return s.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }

function pickerView() {
  const d=state.draft||state.schedule;
  if(state.picker==="date") return screen(`${header("Choose a date", "Edit schedule")}<p class="lede">Select any day that works for you.</p>${calendarPicker(d.date)}`);
  if(state.picker==="time") return screen(`${header("Choose a start time", "Edit schedule")}<p class="lede">Scroll through the full day in 15-minute steps.</p>${wheelPicker(timeOptions(),d.time,"time")}`);
  if(state.picker==="duration") return screen(`${header("Choose a duration", "Edit schedule")}<p class="lede">Choose how long you want to work.</p>${wheelPicker(durationOptions(),d.duration,"duration")}`);
  const opts=["Google Calendar","Apple Calendar","No Calendar"];
  return screen(`${header("Choose a calendar", "Edit schedule")}<p class="lede">Select where to add this work session.</p><div class="stack">${opts.map(o=>choiceCard(o,d.calendar)).join("")}</div>`);
}

function calendarPicker(selected) {
  const days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const month=state.calendarMonth.getMonth(),year=state.calendarMonth.getFullYear();
  const blanks=new Date(year,month,1).getDay(),count=new Date(year,month+1,0).getDate();
  const cells=Array(blanks).fill("").concat(Array.from({length:count},(_,i)=>String(i+1)));
  const monthName=state.calendarMonth.toLocaleString("en-US",{month:"long"});
  return `<div class="calendar-card"><div class="calendar-head"><button class="icon-button" data-action="prev-month" aria-label="Previous month">‹</button><strong>${monthName} ${year}</strong><button class="icon-button" data-action="next-month" aria-label="Next month">›</button></div><div class="weekday-row">${days.map(x=>`<span>${x}</span>`).join("")}</div><div class="calendar-grid">${cells.map(day=>day?`<button class="day ${selected===dateLabel(day)?"selected":""}" data-date-day="${day}">${day}</button>`:'<span></span>').join("")}</div></div>`;
}

function timeOptions() {
  return Array.from({length:96},(_,i)=>{ const mins=i*15,h=Math.floor(mins/60),m=mins%60,period=h<12?"AM":"PM",hour=h%12||12; return `${hour}:${String(m).padStart(2,"0")} ${period}`; });
}
function durationOptions() { return [5,10,15,20,30,45,60,75,90,105,120].map(formatDuration); }
function formatDuration(mins) { if(mins<60)return `${mins} minutes`; if(mins===60)return "1 hour"; if(mins===120)return "2 hours"; const h=Math.floor(mins/60),m=mins%60; return `${h} hour ${m} minutes`; }
function wheelPicker(options,selected,type) {
  return `<div class="wheel-wrap"><div class="wheel-fade top"></div><div class="wheel-list" data-wheel="${type}">${options.map(o=>`<button class="wheel-option ${o===selected?"selected":""}" data-choice="${escapeHtml(o)}">${o}</button>`).join("")}</div><div class="wheel-fade bottom"></div></div><p class="picker-hint">Tap a value to select it.</p>`;
}
function choiceCard(o,selected) { return `<button class="card option ${selected===o?"selected":""}" data-choice="${escapeHtml(o)}"><div class="card-title">${o}</div></button>`; }
function dateLabel(day) { const y=state.calendarMonth.getFullYear(),m=state.calendarMonth.getMonth(),date=new Date(y,m,Number(day)); return `${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][date.getDay()]}, ${date.toLocaleString("en-US",{month:"short"})} ${day}`; }
function syncPlan() { state.addedPlan={id:"prototype",type:"Planned work",course:"DES 220 · Interaction Design",when:`${state.schedule.date} · ${state.schedule.time}`,title:"Prototype critique",copy:`${state.schedule.duration} work session`,warning:false}; }

function render() { document.getElementById("app").innerHTML = (views[state.screen]||views.today)(); window.scrollTo(0,0); }

document.addEventListener("click", e => {
  const el=e.target.closest("button"); if(!el)return;
  if(el.dataset.action==="back") return back();
  if(el.dataset.tab) { if(el.dataset.tab==="plan") state.showPlanConfirmation=false; return go(el.dataset.tab); }
  if(el.dataset.action==="grade") return go("grade");
  if(el.dataset.action==="feedback") return go("feedback");
  if(el.dataset.action==="laptop") return go("laptop");
  if(el.dataset.action==="schedule") { state.draft={...state.schedule}; return go("schedule"); }
  if(el.dataset.action==="course") return go("course");
  if(el.dataset.action==="opened"||el.dataset.action==="copied") { state.message=el.dataset.action==="opened"?"Coursewise opened the assignment on your laptop.":"Secure link copied. It expires in 24 hours."; return go("message"); }
  if(el.dataset.edit) { state.draft={...state.schedule}; return go("edit"); }
  if(el.dataset.picker) { state.draft=state.draft||{...state.schedule}; state.picker=el.dataset.picker; return go("picker"); }
  if(el.dataset.action==="prev-month"||el.dataset.action==="next-month") { const step=el.dataset.action==="next-month"?1:-1; state.calendarMonth=new Date(state.calendarMonth.getFullYear(),state.calendarMonth.getMonth()+step,1); return render(); }
  if(el.dataset.choice) { state.draft[state.picker]=el.dataset.choice; return back(); }
  if(el.dataset.dateDay) { state.draft.date=dateLabel(el.dataset.dateDay); return back(); }
  if(el.dataset.action==="confirm-edit") { state.schedule={...state.draft}; return go("schedule"); }
  if(el.dataset.action==="save-schedule") { state.schedule={...(state.draft||state.schedule)}; syncPlan(); return go("saved"); }
  if(el.dataset.action==="suggested") { state.schedule={date:"Wed, Oct 7",time:"7:00 PM",duration:"2 hours",calendar:"Google Calendar"}; syncPlan(); return go("saved"); }
  if(el.dataset.action==="view-plan") { state.showPlanConfirmation=true; return go("plan"); }
  if(el.dataset.plan) { const item=data.plans.find(x=>x.id===el.dataset.plan); if(item.id==="prototype"||item.id==="deadline") return go("schedule"); state.detail={...item,kind:"plan"}; return go("detail"); }
  if(el.dataset.gradeId) { const item=data.grades.find(x=>x.id===el.dataset.gradeId); if(item.id==="research")return go("grade"); state.detail={...item,kind:"grade"}; return go("detail"); }
});

render();
