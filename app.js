'use strict';
const $=(s,r)=>(r||document).querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const clamp=(v,a,b)=>Math.min(Math.max(v,a),b);
const rnd=n=>Math.floor(Math.random()*n);
const pick=a=>a[rnd(a.length)];
function shuf(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);const t=a[i];a[i]=a[j];a[j]=t}return a}
const KEY='ars_ct_v2';
function loadDB(){const def={v:2,cur:'',players:{},unlockAll:false,set:{sound:true,music:true,voice:false,mode:'choice',pace:'normal',afs:true}};
 try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&d.v===2){d.set=Object.assign(def.set,d.set||{});return Object.assign(def,d)}}catch(e){}
 try{const o=JSON.parse(localStorage.getItem('ars_ct_v1'));if(o&&o.v===1){def.cur=o.cur||'';def.unlockAll=!!o.unlockAll;def.set=Object.assign(def.set,o.set||{});Object.keys(o.players||{}).forEach(n=>{const q=o.players[n],pr={};Object.keys(q.prog||{}).forEach(k=>{if(+k<=8)pr[k]=q.prog[k]});def.players[n]=Object.assign({},q,{prog:pr,inf:{}})})}}catch(e){}
 return def}
let DB=loadDB();
function save(){try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}}
const P=()=>DB.players[DB.cur]||null;
const starsOf=p=>p?Object.keys(p.prog).reduce((s,k)=>s+(p.prog[k].s||0),0):0;
/* áudio */
let AC=null;
function tone(f,d,t,v,when){if(!DB.set.sound)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();const o=AC.createOscillator(),g=AC.createGain();o.type=t||'sine';o.frequency.value=f;o.connect(g);g.connect(AC.destination);const n=AC.currentTime+(when||0);g.gain.setValueAtTime(v||.08,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.start(n);o.stop(n+d+.02)}catch(e){}}
const seq=(fs,d,t,v,gap)=>fs.forEach((f,i)=>tone(f,d,t,v,i*(gap||.09)));
let musT=null,musN=0;
function music(on){clearInterval(musT);musT=null;if(!on||!DB.set.sound||!DB.set.music)return;const Pn=[392,440,523,587,659,784,880];musT=setInterval(()=>{if(!DB.set.sound||!DB.set.music)return;const f=Pn[(musN*3+rnd(3))%Pn.length];musN++;tone(f,.55,'sine',.022);if(musN%4===0)tone(f/2,.9,'triangle',.018)},560)}
const Snd={ok(){seq([660,880,1175],.16,'triangle',.08,.07)},bad(){tone(220,.18,'sawtooth',.05);tone(165,.26,'sawtooth',.05,.1)},tick(){tone(1000,.05,'square',.025)},
 combo(){seq([523,659,784,1047],.14,'triangle',.08,.06)},win(){seq([523,659,784,1047,1319,1568],.22,'triangle',.09,.11)},lose(){seq([392,330,262,196],.3,'sine',.09,.18)},
 ui(){tone(720,.06,'sine',.04)},go(){tone(1046,.35,'triangle',.1)},cd(){tone(520,.15,'triangle',.08)},star(){seq([1175,1568],.18,'triangle',.09,.08)},hint(){seq([880,1100],.1,'sine',.06,.06)}};
/* voz */
let VOICE=null;
function speak(t){if(!DB.set.voice||!window.speechSynthesis)return;sayNow(t)}
function sayNow(t){try{const s=window.speechSynthesis;if(!s)return;s.cancel();const u=new SpeechSynthesisUtterance(String(t));u.lang='pt-BR';u.rate=.9;if(!VOICE){const vs=s.getVoices();VOICE=vs.find(v=>/pt-BR/i.test(v.lang))||vs.find(v=>/^pt/i.test(v.lang))||null}if(VOICE)u.voice=VOICE;s.speak(u)}catch(e){}}
let toastT=0;
function toast(m,ms){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),ms||1800)}
const FSOK=!!(document.fullscreenEnabled||document.webkitFullscreenEnabled);
const isFS=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
function toggleFS(){try{const d=document,e=d.documentElement;if(isFS())(d.exitFullscreen||d.webkitExitFullscreen).call(d);else(e.requestFullscreen||e.webkitRequestFullscreen).call(e)}catch(x){}}


'use strict';
const R=(a,b)=>a+rnd(b-a+1);
const U=['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito','dezenove'];
const TE=['','','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa'];
const HU=['','cento','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos'];
function numWord(n){if(n<20)return U[n];if(n<100){const d=Math.floor(n/10),u=n%10;return TE[d]+(u?' e '+U[u]:'')}if(n===100)return'cem';if(n<1000){const h=Math.floor(n/100),r=n%100;return HU[h]+(r?' e '+numWord(r):'')}return'mil'}
const SYM={'+':'+','-':'−','*':'×','/':'÷'};
const WORLDS=[
 {name:'Terra',e:'🌍',c1:'#4fc3ff',c2:'#c9f0ff'},
 {name:'Marte',e:'🔴',c1:'#ff7a45',c2:'#ffd0b8'},
 {name:'Júpiter',e:'🟠',c1:'#e8a66b',c2:'#fbe3c8'},
 {name:'Saturno',e:'🪐',c1:'#ffc53d',c2:'#fff0b8'},
 {name:'Urano',e:'🔵',c1:'#5ee6e0',c2:'#d0fbf8'},
 {name:'Netuno',e:'🔷',c1:'#6f8bff',c2:'#d3dcff'},
 {name:'Mercúrio',e:'⚪',c1:'#b9bfcf',c2:'#eceff7'},
 {name:'Vênus',e:'🟡',c1:'#ffd86b',c2:'#fff3c7'},
 {name:'Galáxia Mágica',e:'🌌',c1:'#d77bff',c2:'#f5d6ff'}];
const ORB=w=>`<span class="orb o${w}"></span>`;
const gAdd=(lo,hi)=>()=>{const s=R(lo,hi),a=R(1,s-1);return{a,b:s-a,op:'+'}};
const gSub=(lo,hi)=>()=>{const a=R(lo,hi),b=R(1,a-1);return{a,b,op:'-'}};
const mix=(...g)=>()=>pick(g)();
const gCarry=()=>{let a,b;do{a=R(3,10);b=R(3,10)}while(a+b<11);return{a,b,op:'+'}};
const gSub20=()=>{const a=R(11,20),b=R(2,9);return{a,b,op:'-'}};
const gTA=()=>{const a=10*R(1,8),b=10*R(1,(100-a)/10);return{a,b,op:'+'}};
const gTS=()=>{const a=10*R(2,10),b=10*R(1,a/10-1);return{a,b,op:'-'}};
const gTU=()=>{const t=10*R(1,9),u=R(1,9);return rnd(2)?{a:t,b:u,op:'+'}:{a:t+u,b:u,op:'-'}};
const g50a=()=>{if(rnd(2)){const t=10*R(1,4),u1=R(1,8),u2=R(1,9-u1);return{a:t+u1,b:u2,op:'+'}}const t=10*R(1,4),u1=R(2,9),u2=R(1,u1);return{a:t+u1,b:u2,op:'-'}};
const g50=()=>{const k=rnd(4);
 if(k<2)return g50a();
 if(k===2){const a=R(11,39),b=10*R(1,Math.floor((50-a)/10));return{a,b,op:'+'}}
 const a=R(21,50),b=10*R(1,Math.floor((a-1)/10));return{a,b,op:'-'}};
const gA100=()=>{const a=R(11,89),b=R(2,Math.min(25,100-a));return{a,b,op:'+'}};
const gS100=()=>{const a=R(20,100),b=R(2,Math.min(25,a-1));return{a,b,op:'-'}};
const gTB=()=>{if(rnd(2)){const a=R(11,89),b=10*R(1,Math.floor((100-a)/10));return{a,b,op:'+'}}const a=R(21,100),b=10*R(1,Math.floor((a-1)/10));return{a,b,op:'-'}};
const gN1=()=>{const a=R(21,79),b=R(11,Math.min(40,100-a));return{a,b,op:'+'}};
const gN2=()=>{if(rnd(2))return gN1();const a=R(31,100),b=R(11,Math.min(45,a-1));return{a,b,op:'-'}};
const gX100=()=>{if(rnd(2)){let a,b;do{a=10*R(5,9);b=10*R(3,9)}while(a+b<110);return{a,b,op:'+'}}return{a:10*R(11,19),b:10*R(2,9),op:'-'}};
const gHH=()=>{if(rnd(2)){let a,b;do{a=100*R(1,8);b=100*R(1,8)}while(a+b>900);return{a,b,op:'+'}}const a=100*R(2,9);return{a,b:100*R(1,a/100-1),op:'-'}};
const gHT=()=>rnd(2)?{a:100*R(1,8),b:10*R(1,9),op:'+'}:{a:100*R(2,9),b:10*R(1,9),op:'-'};
const gHT2=()=>rnd(2)?{a:100*R(1,8)+10*R(1,9),b:10*R(1,9),op:'+'}:{a:100*R(1,9)+10*R(1,9),b:10*R(1,9),op:'-'};
const g500=mix(gHH,gHT,gHT2);
const gHard=()=>{let a,b;if(rnd(2)){do{a=100*R(1,8)+10*R(0,9);b=100*R(1,4)+10*R(1,9)}while(a+b>900);return{a,b,op:'+'}}
 do{a=100*R(3,9)+10*R(0,9);b=100*R(1,5)+10*R(1,9)}while(b>=a);return{a,b,op:'-'}};
const gMul=()=>{const a=pick([2,3,4,5,10]),b=R(1,10);return rnd(2)?{a,b,op:'*'}:{a:b,b:a,op:'*'}};
const gDiv=()=>{const d=pick([2,3,4,5,10]),q=R(1,10);return{a:d*q,b:d,op:'/'}};
const gExp=()=>{const k=rnd(4);if(k===0)return{a:R(2,10),b:R(2,10),op:'*'};if(k===1){const d=R(2,10),q=R(2,10);return{a:d*q,b:d,op:'/'}}return k===2?gA100():gS100()};
const defs=[
 ['Primeiro Voo','Somas até 5',6,50,4,1,5,gAdd(2,5)],['Estrelinhas','Somas até 10',8,55,4,1,10,gAdd(4,10)],['Chuva de Meteoros','Somas até 10, sem desenhos',8,55,4,0,10,gAdd(5,10)],
 ['Tirando Estrelas','Contas de menos até 10',8,55,4,1,10,gSub(3,10)],['Vai e Volta','Mais e menos até 10',10,60,3,0,10,mix(gAdd(3,10),gSub(3,10))],['Salto Duplo','Somas até 20',10,60,3,0,20,gCarry],
 ['Descida Suave','Contas de menos até 20',10,60,3,0,20,gSub20],['Anéis Mágicos','Mais e menos até 20',10,60,3,0,20,mix(gAdd(11,20),gSub20,gSub(10,20))],['Tempestade Vermelha','Mais e menos até 20, valendo!',10,60,3,0,20,mix(gCarry,gSub20)],
 ['Dezenas Douradas','Dezenas inteiras: 10, 20, 30…',10,60,3,0,100,mix(gTA,gTS)],['Dezena e Unidade','Mais e menos até 100 (fácil)',10,60,3,0,100,mix(g50a,gTU)],['Escada de Dezenas','Mais e menos até 50',10,65,3,0,50,g50],
 ['Anéis de Gelo','Mais até 100',10,65,3,0,100,gA100],['Descida Gelada','Menos até 100',10,65,3,0,100,gS100],['Rumo ao 100','Mais e menos até 100',10,70,3,0,100,mix(gA100,gS100)],
 ['Tempestade de Dezenas','Somar e tirar dezenas até 100',10,70,3,0,100,gTB],['Mar de Somas','Somas até 100',10,70,3,0,100,gN1],['Oceano 100','Mais e menos até 100, valendo!',10,70,3,0,100,gN2],
 ['Cruzando o 100','Passando do 100: 70 + 50…',10,70,3,0,200,gX100],['Centenas Rápidas','Centenas inteiras: 100, 200…',10,75,3,0,1000,gHH],['Centena e Dezena','Centenas com dezenas: 200 + 30…',10,75,3,0,1000,gHT],
 ['Centenas Douradas','Centenas e dezenas: 120 + 30…',10,75,3,0,1000,gHT2],['Nuvens de Centenas','Mistura de centenas',10,75,3,0,1000,g500],['Desafio de Vênus','Centenas, valendo!',10,80,3,0,1000,mix(gHard,g500,gX100)],
 ['Estrelas Multiplicadas','Vezes: tabuada até 10',10,70,3,1,100,gMul],['Estrelas Divididas','Dividido: tabuada até 10',10,70,3,0,100,gDiv],['Mestre Galáctico','Vezes, dividido, mais e menos',10,80,3,0,100,gExp]];
const PH=defs.map((x,i)=>({n:i+1,w:Math.floor(i/3),name:x[0],desc:x[1],goal:x[2],time:x[3],bonus:x[4],vis:x[5],top:x[6],gen:x[7]}));
const MAXST=PH.length*3;
const worldWon=(w,p)=>!!p&&PH.filter(x=>x.w===w).every(x=>p.prog[x.n]&&p.prog[x.n].s>=1);
const RANKS=[{s:0,n:'Aprendiz Estelar',e:'🌟'},{s:12,n:'Cadete do Tempo',e:'⏱️'},{s:30,n:'Piloto Veloz',e:'🚀'},{s:48,n:'Comandante',e:'🛰️'},{s:66,n:'Capitão Cósmico',e:'👨‍🚀'},{s:81,n:'Mestre do Tempo',e:'👑'}];
const rankOf=s=>{let r=RANKS[0];RANKS.forEach(x=>{if(s>=x.s)r=x});return r};
const PRAISE=['Boa!','Isso aí!','Muito bem!','Mandou bem!','Acertou!','Show!','Uau!','Perfeito!'];
const CHARS=['🧑‍🚀','👩‍🚀','👨‍🚀','🐱','🐶','🦊','🐼','🐸','🦁','🐯','🐵','🦄'];
const ITEMS=['⭐','🍎','🚀','🍪','🍓','🐠','🍬','🌙'];


'use strict';
const PACE={normal:{m:1,l:'Normal'},calmo:{m:1.6,l:'Calmo'},livre:{m:0,l:'Sem pressa'}};
let G=null;
function mkOpts(q,ph){const r=q.r,cap=Math.max(Math.ceil(ph.top*1.1)+3,r+6),c=[r+1,r-1,r+2,r-2];
 if(r>=20)c.push(r+10,r-10);if(r>=100)c.push(r+100,r-100,r+50,r-50);
 if(q.op==='*')c.push(r+q.a,r-q.a,r+q.b,r-q.b);
 c.push(q.op==='+'?q.a-q.b:q.op==='-'?q.a+q.b:q.op==='*'?q.a+q.b:q.a-q.b,q.a,q.b);
 const s=new Set(),out=[];shuf(c).forEach(v=>{if(v>=0&&v<=cap&&v!==r&&!s.has(v)&&out.length<3){s.add(v);out.push(v)}});
 let k=0;while(out.length<3&&k++<60){const v=clamp(r+R(-6,6),0,cap);if(v!==r&&!s.has(v)){s.add(v);out.push(v)}}
 return shuf(out.concat([r]))}
function genQ(ph,recent){let q,key,k=0;do{q=ph.gen();key=q.a+q.op+q.b}while(recent.indexOf(key)>=0&&k++<25);
 recent.push(key);if(recent.length>6)recent.shift();q.r=q.op==='+'?q.a+q.b:q.op==='-'?q.a-q.b:q.op==='*'?q.a*q.b:q.a/q.b;q.opts=mkOpts(q,ph);q.hint=false;return q}
function base(o){return Object.assign({got:0,wrong:0,hints:0,hintMax:3,streak:0,maxStreak:0,score:0,state:'cd',q:null,recent:[],paused:false,tick:-1,typed:'',res:null,inf:-1},o)}
function startPhase(n){const ph=PH[n-1],m=PACE[DB.set.pace].m,t=m?Math.round(ph.time*m):0;
 G=base({n,ph,goal:ph.goal,free:!m,max:t,t:t,cap:t*1.5,item:ITEMS[(n-1)%ITEMS.length],bonus:ph.bonus});UI.play();countdown(G)}
function startInf(w){const phs=PH.filter(x=>x.w===w);
 const ph={name:'Missão Estrela',vis:0,top:Math.max.apply(null,phs.map(x=>x.top)),gen:()=>phs[rnd(Math.min(phs.length,1+Math.floor((G?G.got:0)/4)))].gen()};
 G=base({n:0,inf:w,ph,goal:Infinity,free:false,max:90,t:90,cap:Infinity,item:'⭐',bonus:10});UI.play();countdown(G)}
function countdown(g){let i=3;const step=()=>{if(G!==g)return;const el=$('#cd');if(i>0){if(el){el.textContent=i;el.className='cd on';void el.offsetWidth;el.className='cd on pop'}Snd.cd();i--;setTimeout(step,750)}
 else{if(el){el.textContent='Vai!';el.className='cd on pop go'}Snd.go();setTimeout(()=>{if(G!==g)return;if(el)el.className='cd';g.state='play';nextQ()},550)}};step()}
function nextQ(){if(!G)return;G.q=genQ(G.ph,G.recent);G.typed='';G.state='play';UI.question();if(DB.set.voice)speakQ()}
const qWords=q=>numWord(q.a)+({'+':' mais ','-':' menos ','*':' vezes ','/':' dividido por '}[q.op])+numWord(q.b);
function speakQ(){if(G&&G.q)sayNow(qWords(G.q))}
function answer(v,btn){if(!G||G.state!=='play'||G.paused)return;const q=G.q;
 if(v===q.r){G.state='fb';G.got++;G.streak++;G.maxStreak=Math.max(G.maxStreak,G.streak);
  const pts=10+Math.min(G.streak-1,9)*2;G.score+=pts;G.t=Math.min(G.t+G.bonus+(G.streak>=3&&G.inf<0?1:0),G.cap);
  const msg=G.streak>=3?'Combo ×'+G.streak+'! 🔥':pick(PRAISE);
  if(G.streak>=3&&G.streak%3===0)Snd.combo();else Snd.ok();
  UI.right(btn,msg,pts);
  if(G.got>=G.goal)setTimeout(()=>win(G),650);else setTimeout(()=>{if(G&&G.state==='fb')nextQ()},650)}
 else{G.wrong++;G.streak=0;if(!G.free)G.t=Math.max(0,G.t-(G.inf>=0?10:2));Snd.bad();UI.wrongAns(btn);if(!G.free&&G.t<=0){G.t=0;lose(G)}}}
function typeKey(k){if(!G||G.state!=='play'||G.paused||DB.set.mode!=='type')return;
 if(k==='ok'){if(G.typed==='')return;const v=parseInt(G.typed,10);G.typed='';answer(v,null);if(G&&G.state==='play')UI.typed();return}
 if(k==='del')G.typed=G.typed.slice(0,-1);else if(G.typed.length<4)G.typed+=k;
 Snd.ui();UI.typed()}
function hint(){if(!G||G.state!=='play'||G.paused||G.hints>=G.hintMax||G.q.hint)return;G.q.hint=true;G.hints++;Snd.hint();UI.hint()}
function win(g){if(G!==g)return;g.state='end';const p=P(),n=g.n,w=g.ph.w,errs=g.wrong+g.hints/2,st=errs<=1?3:errs<=3?2:1;
 const tb=g.free?0:Math.round(g.t)*2;g.score+=tb;
 const old=p.prog[n]||{s:0,b:0},before=starsOf(p),rb=rankOf(before),wb=worldWon(w,p);
 const rec=g.score>old.b;p.prog[n]={s:Math.max(old.s,st),b:Math.max(old.b,g.score)};p.pts=(p.pts||0)+g.score;p.plays=(p.plays||0)+1;p.last=Date.now();save();
 const after=starsOf(p);g.res={win:1,st,tb,rec,rankUp:rankOf(after)!==rb?rankOf(after):null,newWorld:(n%3===0&&n<PH.length&&old.s===0)?WORLDS[n/3]:null,starNew:w<8&&!wb&&worldWon(w,p),done:n===PH.length&&old.s===0};
 Snd.win();UI.result()}
function lose(g){if(G!==g||g.state==='end')return;g.state='end';const p=P();p.plays=(p.plays||0)+1;
 if(g.inf>=0){p.inf=p.inf||{};const o=p.inf[g.inf]||{c:0,b:0};g.res={win:0,inf:1,rec:g.got>o.c,best:Math.max(o.c,g.got)};p.inf[g.inf]={c:Math.max(o.c,g.got),b:Math.max(o.b,g.score)};p.pts=(p.pts||0)+g.score;p.last=Date.now()}
 else g.res={win:0};
 save();Snd.lose();UI.result()}
function tickGame(dt){if(!G||G.state!=='play'||G.paused||G.free)return;G.t-=dt;const s=Math.ceil(G.t);
 if(s<=10&&s>0&&s!==G.tick){G.tick=s;Snd.tick()}if(G.t<=0){G.t=0;UI.clock();lose(G);return}UI.clock()}


'use strict';
const app=()=>$('#app');
const TIC=m=>`<svg class="tic" viewBox="0 0 120 134" aria-hidden="true"><defs><radialGradient id="tg" cx="40%" cy="30%"><stop offset="0" stop-color="#fff7c2"/><stop offset="1" stop-color="#ffc83a"/></radialGradient></defs>
<path d="M30 112l-9 14M90 112l9 14" stroke="#ff9d00" stroke-width="8" stroke-linecap="round"/>
<circle cx="25" cy="24" r="15" fill="#ff5d7a"/><circle cx="95" cy="24" r="15" fill="#ff5d7a"/><rect x="51" y="3" width="18" height="13" rx="5" fill="#ff5d7a"/>
<circle cx="60" cy="74" r="47" fill="url(#tg)" stroke="#ff9d00" stroke-width="5"/><circle cx="60" cy="74" r="37" fill="#fff"/>
<g stroke="#7a86c9" stroke-width="3" stroke-linecap="round"><path d="M60 42v5M60 101v5M28 74h5M87 74h5"/></g>
<ellipse cx="47" cy="68" rx="5" ry="7.5" fill="#1d1f4a"/><ellipse cx="73" cy="68" rx="5" ry="7.5" fill="#1d1f4a"/><circle cx="45" cy="65" r="2" fill="#fff"/><circle cx="71" cy="65" r="2" fill="#fff"/>
<circle cx="38" cy="80" r="5" fill="#ffb3c7" opacity=".8"/><circle cx="82" cy="80" r="5" fill="#ffb3c7" opacity=".8"/>
${m==='sad'?'<path d="M48 92q12-11 24 0" stroke="#1d1f4a" stroke-width="4" fill="none" stroke-linecap="round"/>':'<path d="M47 82q13 14 26 0" stroke="#1d1f4a" stroke-width="4" fill="none" stroke-linecap="round"/>'}</svg>`;
const starRow=(n,c)=>{let s='';for(let i=0;i<3;i++)s+=`<i class="${i<n?'on':''}">★</i>`;return`<span class="stars ${c||''}">${s}</span>`};
const unlocked=n=>n===1||DB.unlockAll||!!(P()&&P().prog[n-1]&&P().prog[n-1].s>=1);
let selChar=CHARS[0];
const infOK=w=>DB.unlockAll||worldWon(w,P());
function setScr(html,cls){const a=app();a.className=cls||'';a.innerHTML=html;a.scrollTop=0;document.body.classList.toggle('playing',/\bplay\b/.test(cls||''))}
function modal(html,cls){closeModal();const d=document.createElement('div');d.className='ov';d.id='ov';d.innerHTML=`<div class="mdl ${cls||''}">${html}</div>`;document.body.appendChild(d);return d}
function closeModal(){const o=$('#ov');if(o)o.remove()}
const UI={
welcome(){G=null;music(true);const last=Object.keys(DB.players).sort((a,b)=>(DB.players[b].last||0)-(DB.players[a].last||0)).slice(0,6);
 const cur=DB.players[DB.cur];if(cur)selChar=cur.char;
 setScr(`<div class="wel"><div class="hero"><div class="tictop">${TIC('happy')}</div><div class="ttl"><small>A.R.S. apresenta</small><h1>Viagem<br>contra o <em>Tempo</em></h1><p>Some de cabeça, vença o relógio e viaje pelas estrelas!</p></div></div>
 <div class="card form"><label>Qual é o seu nome, astronauta?</label><input id="nm" maxlength="14" autocomplete="off" placeholder="Digite seu nome" value="${esc(DB.cur)}">
 <div class="chars">${CHARS.map(c=>`<button class="ch ${c===selChar?'on':''}" data-act="char" data-c="${c}">${c}</button>`).join('')}</div>
 ${last.length?`<div class="recent"><span>Já jogaram aqui:</span>${last.map(n=>`<button class="chip" data-act="who" data-n="${esc(n)}">${DB.players[n].char} ${esc(n)}</button>`).join('')}</div>`:''}
 <button class="btn big" data-act="go">🚀 JOGAR</button>
 <div class="row"><button class="btn b sm" data-act="rank">🏆 Ranking</button><button class="btn b sm" data-act="settings">⚙️ Ajustes</button><button class="btn b sm" data-act="prof">👩‍🏫 Professor</button></div></div>
 <div class="brand"><div class="credits">A.R.S. HTML5 GAMES e APPS</div></div></div>`,'welcome')},
map(){G=null;const p=P();if(!p){UI.welcome();return}const st=starsOf(p),rk=rankOf(st),next=RANKS.find(r=>r.s>st);
 let cur=0;for(let i=1;i<=PH.length;i++){if(unlocked(i)&&!(p.prog[i]&&p.prog[i].s>=1)){cur=i;break}}
 setScr(`<div class="map"><header class="mh"><button class="ib" data-act="home" title="Início">🏠</button><div class="who"><span class="av">${p.char}</span><div><b>${esc(DB.cur)}</b><small>${rk.e} ${rk.n}</small></div></div>
 <div class="tot"><b>★ ${st}<small>/${MAXST}</small></b>${next?`<small>+${next.s-st}★ → ${next.e}</small>`:'<small>Nível máximo!</small>'}</div><button class="ib" data-act="settings" title="Ajustes">⚙️</button></header>
 <h2 class="mt">Viagem pelo Sistema Solar</h2>
 ${WORLDS.map((w,wi)=>{const ph=PH.filter(x=>x.w===wi),got=ph.reduce((s,x)=>s+((p.prog[x.n]||{}).s||0),0),lock=!unlocked(ph[0].n),ex=wi===8,ok=infOK(wi),rc=(p.inf||{})[wi];
 const inf=ex?'':`<button class="sbar ${ok?'':'sl'}" data-act="inf" data-w="${wi}"><span class="sst">⭐</span><div><b>Missão Estrela ∞</b><small>${ok?(rc&&rc.c?'Recorde: '+rc.c+' contas':'1m30 · +10s a cada acerto'):'🔒 Vença o mundo para liberar'}</small></div></button>`;
 return`<section class="wd ${lock?'lock':''} ${ex?'ex':''}" style="--c1:${w.c1};--c2:${w.c2}"><div class="wh"><span class="pl">${ORB(wi)}</span><div><b>Mundo ${wi+1} · ${w.name}</b><small>${got}/9 ★${ex?' · NÍVEL EXPERT':''}</small></div>${lock?'<span class="lk">🔒</span>':''}</div>
 <div class="nodes">${ph.map(x=>{const pr=p.prog[x.n]||{s:0},ul=unlocked(x.n);return`<button class="nd ${ul?'':'lk'} ${pr.s?'done':''} ${x.n===cur?'cur':''}" data-act="phase" data-n="${x.n}">${x.n===cur?'<span class="rk">🚀</span>':''}<span class="num">${ul?x.n:'🔒'}</span><b>${x.name}</b><small>${x.desc}</small>${starRow(pr.s||0)}</button>`}).join('')}</div>${inf}</section>`}).join('')}
 <div class="foot"><button class="btn b sm" data-act="rank">🏆 Ranking</button></div></div>`,'mapscr');
 const c=$('.nd.cur');if(c)c.scrollIntoView({block:'center'})},
intro(n){const ph=PH[n-1],w=WORLDS[ph.w],pr=(P().prog[n]||{s:0,b:0}),pc=PACE[DB.set.pace],t=pc.m?Math.round(ph.time*pc.m):0;
 const ex=ph.gen();
 modal(`<div class="mi" style="--c1:${w.c1};--c2:${w.c2}"><div class="mpl">${ORB(ph.w)}</div><small>Fase ${n} · ${w.name}</small><h2>${ph.name}</h2><p class="dsc">${ph.desc}</p>
 <div class="facts"><div><b>${ph.goal}</b><small>acertos para vencer</small></div><div><b>${t?t+'s':'∞'}</b><small>${t?'de tempo':'sem pressa'}</small></div><div><b>${t?'+'+ph.bonus+'s':'⭐'}</b><small>${t?'a cada acerto':'3 estrelas'}</small></div></div>
 <div class="exq">${ex.a} ${SYM[ex.op]} ${ex.b} = ?</div>
 ${pr.s?`<div class="best">Seu melhor: ${starRow(pr.s)} · ${pr.b} pontos</div>`:''}
 <div class="btns"><button class="btn big" data-act="start" data-n="${n}">🚀 DECOLAR!</button><button class="btn b" data-act="close">Voltar</button></div></div>`,'intro')},
introInf(wi){const w=WORLDS[wi],rc=(P().inf||{})[wi];
 modal(`<div class="mi" style="--c1:${w.c1};--c2:${w.c2}"><div class="mpl">${ORB(wi)}</div><small>Missão Estrela ∞ · ${w.name}</small><h2>Quantas você aguenta?</h2><p class="dsc">Contas de ${w.name} sem parar. Acertou, ganhou tempo!</p>
 <div class="facts"><div><b>1m30</b><small>de tempo</small></div><div><b>+10s</b><small>a cada acerto</small></div><div><b>−10s</b><small>a cada erro</small></div></div>
 ${rc&&rc.c?`<div class="best">🏅 Seu recorde: ${rc.c} contas · ${rc.b} pontos</div>`:''}
 <div class="btns"><button class="btn big" data-act="startinf" data-w="${wi}">⭐ COMEÇAR!</button><button class="btn b" data-act="close">Voltar</button></div></div>`,'intro')},
play(){const g=G,ph=g.ph,inf=g.inf>=0,wi=inf?g.inf:ph.w,w=WORLDS[wi];
 setScr(`<div class="gm" style="--c1:${w.c1};--c2:${w.c2}"><div class="top"><button class="ib" data-act="pause" title="Pausa (Esc)">⏸️</button><div class="tt"><small>${inf?'Missão Estrela ∞':'Fase '+g.n} · ${w.name}</small><b>${inf?'Quantas você aguenta?':ph.name}</b></div><button class="ib" data-act="say" title="Ouvir a conta">🔊</button></div>
 <div class="hud"><div class="st"><small>PONTOS</small><b id="sc">0</b></div>
 <div class="clk" id="clk"><svg viewBox="0 0 100 100"><circle class="bgc" cx="50" cy="50" r="44"/><circle class="fg" id="rg" cx="50" cy="50" r="44" transform="rotate(-90 50 50)"/></svg><div class="tm"><b id="tm">${g.free?'∞':g.t}</b><small>${g.free?'sem pressa':'segundos'}</small></div></div>
 <div class="st"><small>COMBO</small><b id="cb">0</b></div></div>
 ${inf?`<div class="trk inf"><b id="gt">⭐ 0 contas</b></div>`:`<div class="trk"><div class="line"><i id="pf"></i></div><span class="rkt" id="rk">🚀</span><span class="dst">${ORB(wi)}</span><small id="gt">0 / ${g.goal}</small></div>`}
 <div class="pb"><div class="qc" id="qc"><div id="vs" class="vs"></div><div class="qt" id="qt"></div><div class="msg" id="msg"></div></div><div class="ac" id="ac"></div></div>
 <div class="bar"><button class="btn b sm" data-act="hint" id="hb">💡 Dica <span id="hl">${g.hintMax}</span></button></div>
 <div class="cd" id="cd"></div></div>`,'play w'+wi);UI.clock();UI.prog()},
clock(){const g=G;if(!g)return;const tm=$('#tm'),rg=$('#rg');if(!tm)return;const C=276.46;
 if(g.free){rg.style.strokeDasharray=C;rg.style.strokeDashoffset=0;return}
 const f=clamp(g.t/g.max,0,1);rg.style.strokeDasharray=C;rg.style.strokeDashoffset=(C*(1-f)).toFixed(1);const s=Math.ceil(g.t);if(tm.textContent!=String(s))tm.textContent=s;
 $('#clk').classList.toggle('low',g.t<=10)},
prog(){const g=G;if(!g||!$('#sc'))return;if($('#pf')){const f=g.got/g.goal;$('#pf').style.width=(f*100)+'%';$('#rk').style.left='calc('+(f*100)+'% - '+(f*28)+'px)'}
 const gt=$('#gt');if(gt)gt.textContent=g.inf>=0?'⭐ '+g.got+(g.got===1?' conta':' contas'):g.got+' / '+g.goal;
 $('#sc').textContent=g.score;$('#cb').textContent=g.streak;$('#hl').textContent=g.hintMax-g.hints;$('#hb').classList.toggle('dim',g.hints>=g.hintMax)},
question(){const g=G,q=g.q;if(!$('#qt'))return;const sym=SYM[q.op];
 let v='';if(g.ph.vis){const it=g.item,sz=q.a>8||q.b>8?'sm':'';
  if(q.op==='+')v=`<div class="grp ${sz}">${Array.from({length:q.a},()=>`<i>${it}</i>`).join('')}</div><span class="vp">+</span><div class="grp ${sz}">${Array.from({length:q.b},()=>`<i>${it}</i>`).join('')}</div>`;
  else if(q.op==='*'){if(q.a*q.b<=30)v=`<div class="grps">${Array.from({length:q.a},()=>`<div class="grp sm mg">${Array.from({length:q.b},()=>`<i>${it}</i>`).join('')}</div>`).join('<span class="vp">+</span>')}</div>`}else if(q.op==='-')v=`<div class="grp ${sz}">${Array.from({length:q.a},(_,i)=>`<i class="${i>=q.a-q.b?'x':''}">${it}</i>`).join('')}</div>`}
 $('#vs').innerHTML=v;$('#msg').textContent='';
 $('#qt').innerHTML=`<span class="n">${q.a}</span><span class="o">${sym}</span><span class="n">${q.b}</span><span class="o">=</span><span class="n q" id="qq">?</span>`;
 const qc=$('#qc');qc.classList.remove('in');void qc.offsetWidth;qc.classList.add('in');
 if(DB.set.mode==='type'){$('#ac').innerHTML=`<div class="kp"><div class="kd" id="kd">&nbsp;</div>${[1,2,3,4,5,6,7,8,9].map(d=>`<button data-act="key" data-k="${d}">${d}</button>`).join('')}<button class="kx" data-act="key" data-k="del">⌫</button><button data-act="key" data-k="0">0</button><button class="ko" data-act="key" data-k="ok">✔</button></div>`;UI.typed()}
 else $('#ac').innerHTML=`<div class="op">${q.opts.map((o,i)=>`<button class="a a${i}" data-act="ans" data-v="${o}"><small>${i+1}</small>${o}</button>`).join('')}</div>`;
 UI.prog()},
typed(){const k=$('#kd');if(!k)return;k.textContent=G.typed===''?' ':G.typed;const q=$('#qq');if(q)q.textContent=G.typed===''?'?':G.typed},
right(btn,msg,pts){if(btn)btn.classList.add('ok');else{const q=$('#qq');if(q)q.textContent=G.q.r}const qq=$('#qq');if(qq){qq.textContent=G.q.r;qq.classList.add('rt')}
 const m=$('#msg');m.textContent=msg+'  +'+pts+(G.inf>=0?'  ⏱️ +10s':'');m.classList.remove('pop');void m.offsetWidth;m.classList.add('pop');
 document.querySelectorAll('#ac .a').forEach(b=>{if(b!==btn)b.classList.add('off')});
 const r=(btn||$('#qc')).getBoundingClientRect();FX.burst(r.left+r.width/2,r.top+r.height/2,G.streak>=3?34:20);UI.prog();UI.clock()},
wrongAns(btn){const el=btn||$('#kd');if(el){el.classList.remove('sk');void el.offsetWidth;el.classList.add('sk')}if(btn)btn.classList.add('bad');
 const m=$('#msg');m.textContent=G.free?'Tente de novo! 💪':G.inf>=0?'Ops! −10s':'Quase! −2s';m.classList.remove('pop');void m.offsetWidth;m.classList.add('pop');
 if(!btn){G.typed='';UI.typed()}UI.prog();UI.clock()},
hint(){const g=G,q=g.q;if(DB.set.mode==='type'){const r=q.r,st=r<20?4:r<100?10:100,lo=Math.floor(r/st)*st;$('#msg').textContent='Dica: está entre '+lo+' e '+(lo+st);}
 else{const w=shuf([...document.querySelectorAll('#ac .a')].filter(b=>+b.dataset.v!==q.r&&!b.classList.contains('bad'))).slice(0,2);w.forEach(b=>b.classList.add('off'));$('#msg').textContent='Dica: sobraram menos opções!'}UI.prog()},
pause(){if(!G||G.state==='end'||G.state==='cd')return;G.paused=true;
 modal(`<div class="pz"><h2>⏸️ Pausa</h2><p>O tempo está parado.</p><div class="btns"><button class="btn big g" data-act="resume">▶ Continuar</button><button class="btn b" data-act="again">🔄 Recomeçar a fase</button><button class="btn b" data-act="settings">⚙️ Ajustes</button><button class="btn r" data-act="tomap">🗺️ Voltar ao mapa</button></div></div>`,'pausem')},
result(){const g=G,r=g.res,ph=g.ph;
 if(r.win){let extra='';if(r.rankUp)extra+=`<div class="bn">🎖️ Nova patente: <b>${r.rankUp.e} ${r.rankUp.n}</b></div>`;if(r.newWorld)extra+=`<div class="bn">🌍 Novo mundo liberado: <b>${r.newWorld.e} ${r.newWorld.name}</b></div>`;if(r.starNew)extra+=`<div class="bn">⭐ Missão Estrela ∞ liberada em ${WORLDS[ph.w].name}!</div>`;if(r.rec)extra+=`<div class="bn">🏅 Novo recorde na fase!</div>`;
  const last=g.n===PH.length;
  modal(`<div class="res win"><div class="mas">${TIC('happy')}</div><h2>${last&&r.done?'Você é o Mestre do Tempo! 👑':'Fase vencida!'}</h2><p class="sb">${ph.name}</p>
  <div class="bigst">${[1,2,3].map(i=>`<i class="${i<=r.st?'on':''}" style="animation-delay:${.35*i}s">★</i>`).join('')}</div>
  <div class="facts"><div><b>${g.score}</b><small>pontos</small></div><div><b>${g.maxStreak}</b><small>maior combo</small></div><div><b>${g.wrong}</b><small>erros</small></div></div>
  ${r.tb?`<div class="bn">⏱️ Bônus de tempo: +${r.tb}</div>`:''}${extra}
  <div class="btns">${last?'':`<button class="btn big g" data-act="next">Próxima fase ▶</button>`}<button class="btn b" data-act="again">🔄 Jogar de novo</button><button class="btn b" data-act="tomap">🗺️ Mapa</button></div></div>`,'result');
  for(let i=1;i<=r.st;i++)setTimeout(()=>Snd.star(),350*i);FX.confetti();if(r.done)setTimeout(FX.confetti,900)}
 else if(r.inf){modal(`<div class="res win"><div class="mas">${TIC(g.got>=8?'happy':'sad')}</div><h2>Tempo esgotado!</h2><p class="sb">Missão Estrela ∞ · ${WORLDS[g.inf].name}</p>
  <div class="facts"><div><b>${g.got}</b><small>contas certas</small></div><div><b>${g.score}</b><small>pontos</small></div><div><b>${g.maxStreak}</b><small>maior combo</small></div></div>
  ${r.rec&&g.got>0?`<div class="bn">🏅 Novo recorde: ${g.got} contas!</div>`:`<div class="bn">Seu recorde: ${r.best} contas</div>`}
  <div class="btns"><button class="btn big" data-act="again">⭐ Jogar de novo</button><button class="btn b" data-act="tomap">🗺️ Mapa</button></div></div>`,'result');if(r.rec&&g.got>0){Snd.win();FX.confetti()}}
 else modal(`<div class="res lose"><div class="mas">${TIC('sad')}</div><h2>O tempo acabou!</h2><p class="sb">Você acertou ${g.got} de ${g.goal}. Quase lá!</p>
  <p class="enc">${pick(['Cada tentativa deixa você mais rápido! 💪','Respire fundo e tente de novo. Você consegue! 🌟','Dica: use o botão 💡 quando precisar!'])}</p>
  <div class="btns"><button class="btn big" data-act="again">🔄 Tentar de novo</button><button class="btn b" data-act="tomap">🗺️ Mapa</button></div></div>`,'result')},
rank(){const L=Object.keys(DB.players).map(n=>({n,p:DB.players[n],s:starsOf(DB.players[n])})).sort((a,b)=>b.s-a.s||(b.p.pts||0)-(a.p.pts||0));
 modal(`<div class="rkm"><h2>🏆 Ranking dos Astronautas</h2>${L.length?`<div class="rl">${L.map((x,i)=>`<div class="rw ${x.n===DB.cur?'me':''}"><span class="pos">${['🥇','🥈','🥉'][i]||i+1}</span><span class="av">${x.p.char}</span><div><b>${esc(x.n)}</b><small>${rankOf(x.s).e} ${rankOf(x.s).n}</small></div><div class="rs"><b>★ ${x.s}</b><small>${x.p.pts||0} pts</small></div></div>`).join('')}</div>`:'<p>Ninguém jogou ainda. Seja o primeiro!</p>'}<div class="btns"><button class="btn b" data-act="close">Fechar</button></div></div>`,'rankm')},
settings(){const s=DB.set,tg=(k,t)=>`<div class="sr"><span>${t}</span><button class="sw ${s[k]?'on':''}" data-act="tog" data-k="${k}"><i></i></button></div>`;
 const seg=(k,o)=>`<div class="seg">${o.map(x=>`<button class="${s[k]===x[0]?'on':''}" data-act="seg" data-k="${k}" data-v="${x[0]}">${x[1]}</button>`).join('')}</div>`;
 const was=G&&G.paused;
 modal(`<div class="st2"><h2>⚙️ Ajustes</h2>${tg('sound','🔊 Sons')}${tg('music','🎵 Música')}${tg('voice','🗣️ Ler a conta em voz alta')}
 <div class="sr col"><span>✍️ Como responder</span>${seg('mode',[['choice','Escolher'],['type','Digitar']])}</div>
 <div class="sr col"><span>⏱️ Ritmo do relógio</span>${seg('pace',[['normal','Normal'],['calmo','Calmo'],['livre','Sem pressa']])}</div>
 ${FSOK?`<div class="sr"><span>🖥️ Tela cheia</span><button class="btn b xs" data-act="fs">Alternar</button></div>`+tg('afs','🖥️ Tela cheia ao tocar em Jogar'):''}
 <p class="nt">${G?'As mudanças de ritmo valem a partir da próxima fase.':''}</p>
 <div class="btns"><button class="btn b" data-act="${was?'resumeback':'close'}">Fechar</button></div></div>`,'setm')},
prof(){modal(`<div class="pf"><h2>👩‍🏫 Área do Professor</h2><p>Digite a senha para continuar.</p><input id="pw" type="password" placeholder="Senha" autocomplete="off"><div class="btns"><button class="btn g" data-act="pwok">Entrar</button><button class="btn b" data-act="close">Voltar</button></div></div>`,'profm');setTimeout(()=>{const i=$('#pw');if(i)i.focus()},50)},
profPanel(){const L=Object.keys(DB.players);
 modal(`<div class="pf"><h2>👩‍🏫 Painel do Professor</h2><div class="sr"><span>🔓 Liberar todas as fases</span><button class="sw ${DB.unlockAll?'on':''}" data-act="unl"><i></i></button></div>
 <div class="sr col"><span>Alunos neste aparelho (${L.length})</span><div class="stl">${L.length?L.map(n=>`<div class="rw"><span class="av">${DB.players[n].char}</span><div><b>${esc(n)}</b><small>★ ${starsOf(DB.players[n])} · ${DB.players[n].pts||0} pts</small></div><button class="btn r xs" data-act="delp" data-n="${esc(n)}">Apagar</button></div>`).join(''):'<small>Nenhum aluno ainda.</small>'}</div></div>
 <div class="btns"><button class="btn r" data-act="clearall">🗑️ Apagar todo o ranking</button><button class="btn b" data-act="close">Fechar</button></div></div>`,'profm')}
};
const ACT={
char(el){selChar=el.dataset.c;document.querySelectorAll('.ch').forEach(b=>b.classList.toggle('on',b===el))},
who(el){const n=el.dataset.n;$('#nm').value=n;selChar=DB.players[n].char;document.querySelectorAll('.ch').forEach(b=>b.classList.toggle('on',b.dataset.c===selChar))},
go(){const n=($('#nm').value||'').trim().slice(0,14);if(!n){toast('Digite seu nome primeiro! ✍️');$('#nm').focus();return}if(DB.set.afs&&FSOK&&!isFS())toggleFS();
 if(!DB.players[n])DB.players[n]={char:selChar,prog:{},pts:0,plays:0,last:Date.now()};DB.players[n].char=selChar;DB.players[n].last=Date.now();DB.cur=n;save();UI.map()},
home(){UI.welcome()},
phase(el){const n=+el.dataset.n;if(!unlocked(n)){toast('Ganhe ao menos 1 ★ na fase anterior! 🔒');return}UI.intro(n)},
start(el){closeModal();startPhase(+el.dataset.n)},
close(){closeModal()},
pause(){UI.pause()},
resume(){closeModal();if(G)G.paused=false},
resumeback(){closeModal();UI.pause()},
tomap(){closeModal();G=null;UI.map()},
again(){closeModal();if(G){if(G.inf>=0)startInf(G.inf);else startPhase(G.n)}},
inf(el){const w=+el.dataset.w;if(!infOK(w)){toast('Vença os 3 níveis do mundo para liberar a ⭐');return}UI.introInf(w)},
startinf(el){closeModal();startInf(+el.dataset.w)},
next(){closeModal();const n=G.n+1;G=null;UI.map();UI.intro(n)},
say(){speakQ0()},
hint(){hint()},
ans(el){answer(+el.dataset.v,el)},
key(el){typeKey(el.dataset.k)},
rank(){UI.rank()},
settings(){UI.settings()},
tog(el){const k=el.dataset.k;DB.set[k]=!DB.set[k];save();el.classList.toggle('on',DB.set[k]);if(k==='sound'||k==='music')music(!!(DB.set.sound&&DB.set.music))},
seg(el){DB.set[el.dataset.k]=el.dataset.v;save();el.parentNode.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===el));if(el.dataset.k==='mode'&&G&&G.q&&G.state==='play'){UI.question()}},
fs(){toggleFS()},
prof(){UI.prof()},
pwok(){const v=($('#pw').value||'').trim();if(v==='prof123')UI.profPanel();else{toast('Senha incorreta');$('#pw').value=''}},
unl(el){DB.unlockAll=!DB.unlockAll;save();el.classList.toggle('on',DB.unlockAll)},
delp(el){const n=el.dataset.n;if(!confirm('Apagar '+n+'?'))return;delete DB.players[n];if(DB.cur===n)DB.cur='';save();UI.profPanel()},
clearall(){if(!confirm('Apagar TODOS os alunos e o ranking?'))return;DB.players={};DB.cur='';save();closeModal();UI.welcome()}
};
function speakQ0(){if(G&&G.q){const w=DB.set.voice;DB.set.voice=true;sayNow(qWords(G.q));DB.set.voice=w}}
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el)return;const f=ACT[el.dataset.act];if(f){if(el.dataset.act!=='ans'&&el.dataset.act!=='key')Snd.ui();f(el,e)}});
document.addEventListener('keydown',e=>{const tg=e.target&&e.target.tagName;
 if(tg==='INPUT'){if(e.key==='Enter'){if($('#pw'))ACT.pwok();else if($('#nm'))ACT.go()}return}
 if(e.key==='Escape'){if($('#ov')){if($('.pausem'))ACT.resume();else if(!$('.result')){closeModal();if(G&&G.paused&&G.state!=='end')UI.pause()}}else if(G)UI.pause();return}
 if(!G||$('#ov')||G.state!=='play')return;
 if(DB.set.mode==='type'){if(/^[0-9]$/.test(e.key))typeKey(e.key);else if(e.key==='Backspace')typeKey('del');else if(e.key==='Enter')typeKey('ok')}
 else if(/^[1-4]$/.test(e.key)){const b=document.querySelectorAll('#ac .a')[+e.key-1];if(b&&!b.classList.contains('off')&&!b.classList.contains('bad'))answer(+b.dataset.v,b)}
 if(e.key==='h'||e.key==='H')hint()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&G&&G.state==='play'&&!$('#ov'))UI.pause()});

'use strict';
const FX=(()=>{const cv=$('#bg'),cx=cv.getContext('2d');let W=0,H=0,D=1;const st=[],sym=[],pt=[];let sh=null;
 function size(){D=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;cv.style.width=W+'px';cv.style.height=H+'px';cx.setTransform(D,0,0,D,0,0)}
 size();addEventListener('resize',size);
 for(let i=0;i<150;i++)st.push({x:Math.random(),y:Math.random(),r:Math.random()*1.6+.3,p:Math.random()*6.28,s:Math.random()*.6+.2});
 const S=['+','−','1','2','3','4','5','6','7','8','9','0','=','⏱'];
 for(let i=0;i<16;i++)sym.push({x:Math.random(),y:Math.random(),t:pick(S),z:Math.random()*40+22,v:Math.random()*.012+.004,p:Math.random()*6.28});
 const COL=['#ffd84a','#ff6fa8','#4fe3ff','#7dff8a','#c58bff','#ff9a4a'];
 function burst(x,y,n){for(let i=0;i<(n||20);i++){const a=Math.random()*6.28,s=Math.random()*5+2;pt.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-2,l:1,c:pick(COL),r:Math.random()*4+2,g:.18})}}
 function confetti(){for(let i=0;i<110;i++)pt.push({x:Math.random()*W,y:-10-Math.random()*H*.4,vx:(Math.random()-.5)*3,vy:Math.random()*3+2,l:2.2,c:pick(COL),r:Math.random()*5+3,g:.05,sq:1,rot:Math.random()*6})}
 function draw(t){cx.clearRect(0,0,W,H);
  st.forEach(s=>{const a=.35+.65*Math.abs(Math.sin(t/1000*s.s+s.p));cx.globalAlpha=a;cx.fillStyle='#fff';cx.beginPath();cx.arc(s.x*W,s.y*H,s.r,0,6.283);cx.fill()});
  cx.globalAlpha=.07;cx.fillStyle='#fff';cx.font='700 28px Fredoka,sans-serif';cx.textAlign='center';
  sym.forEach(m=>{m.y-=m.v/60;if(m.y<-.1){m.y=1.1;m.x=Math.random()}cx.font='700 '+m.z+'px Fredoka,sans-serif';cx.fillText(m.t,m.x*W+Math.sin(t/2000+m.p)*14,m.y*H)});
  if(!sh&&Math.random()<.004)sh={x:Math.random()*W*.8,y:Math.random()*H*.4,l:1};
  if(sh){cx.globalAlpha=sh.l;cx.strokeStyle='#fff';cx.lineWidth=2;cx.beginPath();cx.moveTo(sh.x,sh.y);cx.lineTo(sh.x-70,sh.y-30);cx.stroke();sh.x+=14;sh.y+=6;sh.l-=.03;if(sh.l<=0)sh=null}
  for(let i=pt.length-1;i>=0;i--){const p=pt[i];p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.l-=.016;if(p.l<=0||p.y>H+20){pt.splice(i,1);continue}
   cx.globalAlpha=clamp(p.l,0,1);cx.fillStyle=p.c;if(p.sq){cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot+=.1);cx.fillRect(-p.r,-p.r/2,p.r*2,p.r);cx.restore()}else{cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fill()}}
  cx.globalAlpha=1}
 return{burst,confetti,draw}})();

'use strict';
let lastT=performance.now();
function frame(ts){requestAnimationFrame(frame);const dt=Math.min(.1,(ts-lastT)/1000);lastT=ts;FX.draw(ts);tickGame(dt)}
requestAnimationFrame(frame);
let musOn=false;
addEventListener('pointerdown',()=>{if(!musOn){musOn=true;if(DB.set.sound&&DB.set.music)music(true)}},{once:false});
if(window.speechSynthesis)speechSynthesis.onvoiceschanged=()=>{VOICE=null};
if('serviceWorker' in navigator&&location.protocol.indexOf('http')===0)navigator.serviceWorker.register('sw.js').catch(()=>{});
const fsb=$('#fsb');if(!FSOK)fsb.style.display='none';
['fullscreenchange','webkitfullscreenchange'].forEach(ev=>document.addEventListener(ev,()=>{fsb.textContent=isFS()?'✕':'⛶';fsb.classList.toggle('on',isFS());fsb.title=isFS()?'Sair da tela cheia':'Tela cheia'}));
UI.welcome();
window.__ct={get G(){return G},PH,startPhase,answer,genQ,DB:()=>DB};

