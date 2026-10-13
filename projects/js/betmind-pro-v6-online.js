const DB_KEY='betmind_v6_online';
let currentType=null;

// =================================
// TOAST NOTIFICATIONS
// =================================
function showToast(message, type='success'){
const container=document.getElementById('toastContainer');
if(!container)return;
const toast=document.createElement('div');
toast.className=`toast toast-${type}`;
toast.innerHTML=`<span>${message}</span>`;
container.appendChild(toast);
setTimeout(()=>{
toast.classList.add('toast-out');
setTimeout(()=>toast.remove(),300);
},3000);
}

// =================================
// API CONFIGURATION
// =================================
const API_CONFIG={
  'api-football':{
    url:'https://v3.football.api-sports.io',
    key:'YOUR_KEY_HERE', // Free: 100 requests/day
    endpoints:{
      search:'/teams?search=',
      fixtures:'/fixtures?team=',
      stats:'/teams/statistics?team=',
      odds:'/odds?fixture='
    }
  },
  'football-data':{
    url:'https://api.football-data.org/v4',
    key:'FREE_KEY', // Free: 10 requests/minute
    endpoints:{
      teams:'/teams?name=',
      matches:'/matches?team=',
      standings:'/standings'
    }
  },
  'thesportsdb':{
    url:'https://www.thesportsdb.com/api/v1/json/3',
    endpoints:{
      searchTeam:'/searchteams.php?t=',
      teamStats:'/lookupteam.php?id='
    }
  }
};

// =================================
// DATABASE
// =================================
function getDB(){
const s=localStorage.getItem(DB_KEY);
return s?JSON.parse(s):{
capital:50000,
capitalInitial:50000,
apiKeys:{},
bets:[],
version:'6.0-online'
};
}

function saveDB(db){
localStorage.setItem(DB_KEY,JSON.stringify(db));
updateUI();
}

// =================================
// API FUNCTIONS
// =================================

async function searchTeam(teamName){
// Utilise plusieurs APIs pour trouver l'équipe
console.log(`🔍 Recherche: ${teamName}`);

// Simulation d'API (en production, vrais calls)
// En mode DEMO, on retourne des données mockées
return{
id:Math.floor(Math.random()*1000),
name:teamName,
league:'Ligue 1', // Détecté automatiquement
country:'France',
logo:'https://via.placeholder.com/50',
stats:{
attackStrength:2.1,
defenseStrength:1.2,
form:'VVNVD',
experience:'high'
}
};
}

async function getMatchData(homeTeam,awayTeam){
console.log(`📊 Récupération données: ${homeTeam} vs ${awayTeam}`);

// SIMULATION - En production, vrais appels API
await new Promise(resolve=>setTimeout(resolve,1500)); // Simule délai API

// Données mockées (remplacer par vrais appels API)
return{
home:{
name:homeTeam,
attack:parseFloat((Math.random()*2+0.5).toFixed(1)),
defense:parseFloat((Math.random()*2+0.5).toFixed(1)),
form:generateRandomForm(),
experience:['elite','high','medium','low'][Math.floor(Math.random()*4)]
},
away:{
name:awayTeam,
attack:parseFloat((Math.random()*2+0.5).toFixed(1)),
defense:parseFloat((Math.random()*2+0.5).toFixed(1)),
form:generateRandomForm(),
experience:['elite','high','medium','low'][Math.floor(Math.random()*4)]
},
competition:detectCompetition(homeTeam,awayTeam),
matchType:detectMatchType(homeTeam,awayTeam),
leagueAvg:2.5,
h2h:{
total:10,
homeWins:4,
awayWins:3,
draws:3,
avgGoals:2.8
}
};
}

function generateRandomForm(){
const results=['V','V','N','D','V'];
return results.sort(()=>Math.random()-0.5).join('');
}

function detectCompetition(home,away){
const leagues=['Ligue 1','Premier League','La Liga','Serie A','Bundesliga','Champions League','Europa League'];
return leagues[Math.floor(Math.random()*leagues.length)];
}

function detectMatchType(home,away){
const homeL=home.toLowerCase();
const awayL=away.toLowerCase();

if((homeL.includes('psg')&&awayL.includes('om'))||(homeL.includes('real')&&awayL.includes('barça')))return'derby';
if((homeL.includes('psg')||homeL.includes('real')||homeL.includes('bayern'))&&(awayL.includes('psg')||awayL.includes('real')||awayL.includes('bayern')))return'top_match';
return'normal';
}

// =================================
// NAVIGATION
// =================================
function goToPage(pageId){
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
document.getElementById(pageId).classList.add('active');
document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
event.currentTarget.classList.add('active');

if(pageId==='dashboard')refreshDashboard();
if(pageId==='history')refreshHistory();
if(pageId==='ml')refreshML();
if(pageId==='stats')refreshStats();
}

// =================================
// BET WORKFLOW
// =================================
function selectType(type){
currentType=type;
document.querySelectorAll('.bet-type-card').forEach(c=>c.classList.remove('selected'));
event.currentTarget.classList.add('selected');
if(type==='combined'){
document.getElementById('combinedOpt').style.display='block';
}else{
startBet();
}
}

function startBet(){
const numMatches=currentType==='simple'?1:parseInt(document.getElementById('numMatches').value);
const container=document.getElementById('matchFormsContainer');
const formTitle=document.getElementById('formTitle');

formTitle.textContent=currentType==='simple'?'Match à analyser':`${numMatches} matchs du combiné`;

let formsHTML='';
for(let i=0;i<numMatches;i++){
formsHTML+=`
<div class="match-card">
<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding-bottom:12px;border-bottom:2px solid var(--brd)">
<div class="match-badge">${i+1}</div>
<h3 style="font-size:18px;font-weight:700;color:var(--text)">Match ${i+1}</h3>
<span style="margin-left:auto;background:var(--primary-dim);color:var(--primary);font-size:11px;padding:4px 8px;border-radius:6px">🎭 DEMO</span>
</div>

<div class="form-row">
<div class="form-group">
<label class="form-label form-label-required">Équipe Domicile</label>
<input type="text" class="form-input" id="home_${i}" placeholder="Ex: PSG" required>
<small style="color:var(--text-muted);font-size:11px">L'IA cherchera toutes les stats automatiquement</small>
</div>
<div class="form-group">
<label class="form-label form-label-required">Équipe Extérieure</label>
<input type="text" class="form-input" id="away_${i}" placeholder="Ex: OM" required>
</div>
</div>

<div class="form-row">
<div class="form-group">
<label class="form-label form-label-required">Type d'événement</label>
<select class="form-select" id="eventType_${i}" required>
<option value="">-- Choisissez --</option>
<optgroup label="📌 RÉSULTAT">
<option value="1">1 (Victoire Domicile)</option>
<option value="x">X (Match Nul)</option>
<option value="2">2 (Victoire Extérieur)</option>
<option value="1x">1X (Domicile ou Nul)</option>
<option value="x2">X2 (Nul ou Extérieur)</option>
<option value="12">12 (Domicile ou Extérieur)</option>
</optgroup>
<optgroup label="⚽ BUTS">
<option value="btts_yes">BTTS Oui</option>
<option value="btts_no">BTTS Non</option>
<option value="over_0.5">Plus de 0.5</option>
<option value="over_1.5">Plus de 1.5</option>
<option value="over_2.5">Plus de 2.5</option>
<option value="over_3.5">Plus de 3.5</option>
<option value="under_2.5">Moins de 2.5</option>
</optgroup>
<optgroup label="🏅 MI-TEMPS/FIN">
<option value="ht_ft_1_1">1/1</option>
<option value="ht_ft_1_x">1/X</option>
<option value="ht_ft_x_x">X/X</option>
<option value="ht_ft_2_2">2/2</option>
</optgroup>
</select>
</div>
<div class="form-group">
<label class="form-label form-label-required">Cote proposée</label>
<input type="number" class="form-input" id="odds_${i}" placeholder="Ex: 1.85" step="0.01" min="1.01" required>
</div>
</div>

<div style="background:var(--primary-dim);padding:12px;border-radius:8px;border-left:3px solid var(--primary);margin-top:12px">
<small style="color:var(--text);font-size:12px">
✨ <strong>Recherche automatique :</strong> Compétition, Stats (attaque/défense), Forme récente, Expérience, Historique confrontations
</small>
</div>
</div>
`;
}
container.innerHTML=formsHTML;
document.getElementById('betForm').style.display='block';
window.scrollTo({top:document.getElementById('betForm').offsetTop-100,behavior:'smooth'});
}

// =================================
// ONLINE ANALYSIS
// =================================
async function analyzeBetOnline(){
const numMatches=currentType==='simple'?1:parseInt(document.getElementById('numMatches').value);
const analyzeBtn=document.getElementById('analyzeBtn');
const spinner=document.getElementById('loadingSpinner');

analyzeBtn.disabled=true;
spinner.style.display='inline-block';

try{
const matches=[];
for(let i=0;i<numMatches;i++){
const home=document.getElementById(`home_${i}`).value.trim();
const away=document.getElementById(`away_${i}`).value.trim();
const eventType=document.getElementById(`eventType_${i}`).value;
const odds=parseFloat(document.getElementById(`odds_${i}`).value);

if(!home||!away||!eventType||!odds||odds<1.01){
showToast(`⚠️ Match ${i+1}: Champs obligatoires manquants`, 'warning');
analyzeBtn.disabled=false;
spinner.style.display='none';
return;
}

// 🌐 RÉCUPÉRATION AUTOMATIQUE DES DONNÉES
console.log(`📡 Recherche en ligne: ${home} vs ${away}`);
const matchData=await getMatchData(home,away);

matches.push({
home:matchData.home.name,
away:matchData.away.name,
league:matchData.competition,
eventType:eventType,
odds:odds,
homeAttack:matchData.home.attack,
awayAttack:matchData.away.attack,
homeDefense:matchData.home.defense,
awayDefense:matchData.away.defense,
leagueAvg:matchData.leagueAvg,
matchType:matchData.matchType,
homeForm:matchData.home.form,
awayForm:matchData.away.form,
homeExp:matchData.home.experience,
awayExp:matchData.away.experience,
h2h:matchData.h2h
});
}

// ANALYSE COMPLÈTE
const analyzed=analyzeMatches(matches);
displayAnalysis(analyzed);

}catch(error){
console.error('Erreur:',error);
showToast('❌ Erreur lors de la récupération des données. Vérifiez votre connexion.', 'error');
}finally{
analyzeBtn.disabled=false;
spinner.style.display='none';
}
}

function analyzeMatches(matches){
const db=getDB();

const analyzed=matches.map((m,idx)=>{
const poissonProb=calculatePoisson(m.homeAttack,m.awayAttack,m.homeDefense,m.awayDefense,m.leagueAvg,m.eventType);
const bookProb=1/m.odds;
const mlAdj=getMLAdjustment(m.eventType,m.league);
const compAdj=getCompetitionAdjustment(m.league,m.matchType);
const expAdj=getExperienceAdjustment(m.homeExp,m.awayExp);
const formAdj=getFormAdjustment(m.homeForm,m.awayForm);

const finalProb=(poissonProb*0.4)+(mlAdj*0.2)+(bookProb*0.15)+(compAdj*0.15)+(expAdj*0.05)+(formAdj*0.05);
const clampedProb=Math.min(Math.max(finalProb,0.01),0.99);
const edge=clampedProb-bookProb;
const confidence=Math.round(clampedProb*100);

return{...m,finalProb:clampedProb,bookProb,edge,confidence,matchIndex:idx+1};
});

let totalOdds=1;
let totalProb=1;
analyzed.forEach(m=>{
totalOdds*=m.odds;
totalProb*=m.finalProb;
});

const kellyStake=totalProb>(1/totalOdds)?((totalProb-(1/totalOdds))/(totalOdds-1))*0.25:0;
const stake=Math.max(Math.min(kellyStake*db.capital,db.capital*0.1),db.capital*0.01);

return{
matches:analyzed,
totalOdds,
totalProb,
stake:Math.round(stake),
potentialWin:Math.round(stake*totalOdds),
profit:Math.round(stake*totalOdds-stake)
};
}

function displayAnalysis(result){
const{matches,totalOdds,totalProb,stake,potentialWin,profit}=result;

let riskLevel='ÉLEVÉ',riskColor='var(--danger)',riskIcon='🔴';
if(totalProb>0.6){riskLevel='FAIBLE';riskColor='var(--primary)';riskIcon='🟢';}
else if(totalProb>0.4){riskLevel='MOYEN';riskColor='var(--warning)';riskIcon='🟡';}

let recommendation='';
if(totalProb>0.65)recommendation='✅ Excellent pari ! L\'IA recommande fortement.';
else if(totalProb>0.5)recommendation='⚠️ Pari acceptable mais risqué.';
else recommendation='❌ Pari déconseillé. Probabilité trop faible.';

let matchesHTML='';
if(currentType==='combined'){
matchesHTML=`
<div class="card" style="background:var(--card3);margin-top:24px">
<h3 style="font-size:16px;font-weight:700;margin-bottom:16px">📋 Détail des ${matches.length} matchs (Données SIM)</h3>
${matches.map(m=>`
<div style="background:var(--bg3);padding:16px;border-radius:10px;margin-bottom:12px;border-left:3px solid ${m.confidence>=60?'var(--primary)':m.confidence>=40?'var(--warning)':'var(--danger)'}">
<div style="display:flex;justify-content:space-between;margin-bottom:12px">
<div>
<div style="font-weight:700;font-size:15px">${m.home} vs ${m.away}</div>
<div style="font-size:12px;color:var(--text-muted);margin-top:2px">${m.league} • ${getEventLabel(m.eventType)}</div>
</div>
<div style="text-align:right">
<div style="font-size:20px;font-weight:900;color:var(--gold)">${m.odds.toFixed(2)}</div>
</div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;font-size:12px">
<div>
<div style="color:var(--text-muted)">Prob. IA</div>
<div style="font-weight:700;color:var(--primary);font-size:16px">${(m.finalProb*100).toFixed(1)}%</div>
</div>
<div>
<div style="color:var(--text-muted)">Confiance</div>
<div style="font-weight:700;color:${m.confidence>=60?'var(--primary)':'var(--warning)'};font-size:16px">${m.confidence}/100</div>
</div>
<div>
<div style="color:var(--text-muted)">Source</div>
<div style="font-weight:700;color:var(--warning);font-size:12px">🧪 SIM</div>
</div>
</div>
</div>
`).join('')}
</div>
`;
}
document.getElementById('analysisResult').innerHTML=`
<div class="card" style="background:var(--card2);border:2px solid var(--primary);margin-top:32px;padding:32px">
<div style="text-align:center;margin-bottom:32px">
<h2 style="font-size:28px;font-weight:900;margin-bottom:8px">📊 Analyse ${currentType==='simple'?'Pari Simple':'Combiné '+matches.length+'x'}</h2>
<p style="color:var(--text-muted)">Données simulées (mode démo) - configurez vos clés API pour des données réelles</p>
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:24px">
<div class="result-card">
<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">COTE TOTALE</div>
<div class="result-value" style="color:var(--gold)">${totalOdds.toFixed(2)}</div>
</div>
<div class="result-card">
<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">PROBABILITÉ IA</div>
<div class="result-value" style="color:var(--primary)">${(totalProb*100).toFixed(1)}%</div>
</div>
<div class="result-card">
<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">RISQUE</div>
<div class="result-value" style="color:${riskColor};font-size:24px">${riskIcon} ${riskLevel}</div>
</div>
<div class="result-card">
<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">MISE</div>
<div class="result-value" style="font-size:24px">${stake.toLocaleString()} F</div>
</div>
</div>

<div class="alert ${totalProb>0.5?'alert-success':'alert-warning'}">
<span class="alert-icon">💡</span>
<div class="alert-content">
<div class="alert-title">Recommandation IA</div>
<div>${recommendation}</div>
</div>
</div>

${matchesHTML}

<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px">
<div style="background:var(--card3);padding:20px;border-radius:12px">
<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">GAIN POTENTIEL</div>
<div style="font-size:28px;font-weight:900;color:var(--primary)">${potentialWin.toLocaleString()} F</div>
<div style="font-size:12px;color:var(--text-muted);margin-top:4px">Profit: +${profit.toLocaleString()} F</div>
</div>
<div style="background:var(--card3);padding:20px;border-radius:12px">
<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">ESPÉRANCE (EV)</div>
<div style="font-size:28px;font-weight:900;color:var(--gold)">${((totalProb*potentialWin-stake)/stake*100).toFixed(1)}%</div>
<div style="font-size:12px;color:var(--text-muted);margin-top:4px">EV = ${Math.round(totalProb*potentialWin-stake).toLocaleString()} F</div>
</div>
</div>

<button class="btn btn-primary btn-block" style="margin-top:24px;font-size:16px;padding:16px" onclick='saveBet(${JSON.stringify(matches)},${totalOdds},${totalProb},${stake},${potentialWin})'>
💾 Enregistrer ce pari
</button>
</div>
`;

window.scrollTo({top:document.getElementById('analysisResult').offsetTop-100,behavior:'smooth'});
}

// =================================
// CALCULATION FUNCTIONS
// =================================
function calculatePoisson(homeAttack,awayAttack,homeDefense,awayDefense,leagueAvg,eventType){
const homeExpected=homeAttack*awayDefense*(leagueAvg/2);
const awayExpected=awayAttack*homeDefense*(leagueAvg/2);
const poisson=(lambda,k)=>(Math.pow(lambda,k)*Math.exp(-lambda))/factorial(k);
const factorial=n=>n<=1?1:n*factorial(n-1);

let probability=0.5;
if(eventType==='btts_yes'){
const homeScores=1-poisson(homeExpected,0);
const awayScores=1-poisson(awayExpected,0);
probability=homeScores*awayScores;
}else if(eventType.startsWith('over_')){
const threshold=parseFloat(eventType.split('_')[1]);
const totalExpected=homeExpected+awayExpected;
let prob=0;
for(let i=Math.floor(threshold)+1;i<=10;i++)prob+=poisson(totalExpected,i);
probability=prob;
}else if(eventType.startsWith('under_')){
const threshold=parseFloat(eventType.split('_')[1]);
const totalExpected=homeExpected+awayExpected;
let prob=0;
for(let i=0;i<=Math.floor(threshold);i++)prob+=poisson(totalExpected,i);
probability=prob;
}else if(eventType==='1'){
probability=homeExpected/(homeExpected+awayExpected+0.3);
}else if(eventType==='2'){
probability=awayExpected/(homeExpected+awayExpected+0.3);
}
return Math.min(Math.max(probability,0.01),0.99);
}

function getMLAdjustment(eventType,league){
const db=getDB();
const history=db.bets.filter(b=>b.status!=='pending');
if(history.length<3)return 0.5;
const typeHistory=history.filter(b=>b.matches&&b.matches.some(m=>m.eventType===eventType));
if(typeHistory.length===0)return 0.5;
const wins=typeHistory.filter(b=>b.status==='won').length;
return wins/typeHistory.length;
}

function getCompetitionAdjustment(league,matchType){
const leagueLower=league.toLowerCase();
let baseAdj=0.5;
if(leagueLower.includes('champions')||leagueLower.includes('europa'))baseAdj=0.55;
else if(leagueLower.includes('premier')||leagueLower.includes('liga')||leagueLower.includes('serie a'))baseAdj=0.52;
const typeAdj={'normal':0,'derby':0.05,'top_match':0.03,'relegation':-0.02};
return Math.min(Math.max(baseAdj+(typeAdj[matchType]||0),0.01),0.99);
}

function getExperienceAdjustment(homeExp,awayExp){
const expValues={'elite':0.55,'high':0.52,'medium':0.5,'low':0.48};
return(expValues[homeExp]+expValues[awayExp])/2;
}

function getFormAdjustment(homeForm,awayForm){
const calc=form=>{
if(!form)return 0.5;
let score=0;
for(let c of form){
if(c==='V')score+=1;
else if(c==='N')score+=0.5;
}
return score/form.length;
};
return(calc(homeForm)+calc(awayForm))/2;
}

function getEventLabel(eventType){
const labels={'1':'1 (Victoire Domicile)','x':'X (Match Nul)','2':'2 (Victoire Extérieur)','1x':'1X','x2':'X2','12':'12','btts_yes':'BTTS Oui','btts_no':'BTTS Non','over_0.5':'Plus de 0.5','over_1.5':'Plus de 1.5','over_2.5':'Plus de 2.5','over_3.5':'Plus de 3.5','under_2.5':'Moins de 2.5','ht_ft_1_1':'1/1','ht_ft_1_x':'1/X','ht_ft_x_x':'X/X','ht_ft_2_2':'2/2'};
return labels[eventType]||eventType;
}

// =================================
// SAVE BET
// =================================
function saveBet(matches,totalOdds,probability,stake,potentialWin){
const db=getDB();
db.bets.push({
id:Date.now(),
date:new Date().toISOString(),
type:currentType||'simple',
matches:matches,
totalOdds:totalOdds,
probability:probability,
stake:stake,
potentialWin:potentialWin,
status:'pending',
profit:null
});
saveDB(db);
showToast('✅ Pari enregistré !', 'success');
document.querySelectorAll('.bet-type-card').forEach(c=>c.classList.remove('selected'));
document.getElementById('combinedOpt').style.display='none';
document.getElementById('betForm').style.display='none';
document.getElementById('analysisResult').innerHTML='';
currentType=null;
goToPage('history');
}

// =================================
// HISTORY & STATS
// =================================
function refreshHistory(){
const db=getDB();
const tbody=document.getElementById('historyTable');
if(db.bets.length===0){
tbody.innerHTML='<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted)">Aucun historique</td></tr>';
return;
}
tbody.innerHTML=db.bets.map(bet=>{
const matchDisplay=bet.type==='simple'?`<strong>${bet.matches[0].home} vs ${bet.matches[0].away}</strong><br><small>${bet.matches[0].league}</small>`:`<strong>Combiné ${bet.matches.length}x</strong>`;
const eventDisplay=bet.type==='simple'?getEventLabel(bet.matches[0].eventType):'Multiple';
let statusBadge='<span class="badge badge-warning">En cours</span>';
if(bet.status==='won')statusBadge='<span class="badge badge-success">Gagné</span>';
if(bet.status==='lost')statusBadge='<span class="badge badge-danger">Perdu</span>';
return`<tr>
<td>${new Date(bet.date).toLocaleDateString('fr-FR')}</td>
<td>${matchDisplay}</td>
<td>${eventDisplay}</td>
<td><strong>${bet.totalOdds.toFixed(2)}</strong></td>
<td>${statusBadge}</td>
<td>
${bet.status==='pending'?`
<button onclick="updateStatus(${bet.id},'won')" style="background:var(--primary);color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;margin-right:4px">✓</button>
<button onclick="updateStatus(${bet.id},'lost')" style="background:var(--danger);color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer">✗</button>
`:''}
</td>
</tr>`;
}).join('');
}

function updateStatus(betId,status){
const db=getDB();
const bet=db.bets.find(b=>b.id===betId);
if(!bet)return;
bet.status=status;
if(status==='won'){
bet.profit=bet.potentialWin-bet.stake;
db.capital+=bet.profit;
}else{
bet.profit=-bet.stake;
db.capital-=bet.stake;
}
saveDB(db);
refreshHistory();
showToast(status==='won'?'🎉 Félicitations !':'😔 Dommage', status==='won'?'success':'error');
}

function refreshDashboard(){
const db=getDB();
const completed=db.bets.filter(b=>b.status!=='pending');
document.getElementById('totalBets').textContent=db.bets.length;
document.getElementById('historyCount').textContent=db.bets.length;
if(completed.length>0){
const wins=completed.filter(b=>b.status==='won').length;
document.getElementById('winRate').textContent=(wins/completed.length*100).toFixed(1)+'%';
const totalStaked=completed.reduce((sum,b)=>sum+b.stake,0);
const totalProfit=completed.reduce((sum,b)=>sum+(b.profit||0),0);
document.getElementById('roi').textContent=totalStaked>0?(totalProfit/totalStaked*100).toFixed(1)+'%':'0%';
document.getElementById('totalProfit').textContent=totalProfit.toLocaleString()+' F';
}
document.getElementById('sidebarCapital').textContent=db.capital.toLocaleString()+' F';
}

function refreshML(){
const db=getDB();
const completed=db.bets.filter(b=>b.status!=='pending');
if(completed.length<3){
document.getElementById('mlStats').innerHTML='<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div class="alert-content"><div>Minimum 3 paris terminés requis</div></div></div>';
return;
}
const eventStats={};
completed.forEach(bet=>{
if(bet.matches){
bet.matches.forEach(m=>{
if(!eventStats[m.eventType])eventStats[m.eventType]={wins:0,total:0,profit:0};
eventStats[m.eventType].total++;
if(bet.status==='won'){
eventStats[m.eventType].wins++;
eventStats[m.eventType].profit+=(bet.profit||0);
}else{
eventStats[m.eventType].profit-=(bet.stake||0);
}
});
}
});
let html='<table style="width:100%;border-collapse:collapse"><thead><tr style="background:var(--card2)"><th style="padding:12px">Type</th><th style="padding:12px">Paris</th><th style="padding:12px">Victoires</th><th style="padding:12px">Taux</th><th style="padding:12px">Profit</th></tr></thead><tbody>';
for(const[event,stats]of Object.entries(eventStats)){
const rate=(stats.wins/stats.total*100).toFixed(1);
const color=parseFloat(rate)>=60?'var(--primary)':'var(--warning)';
const profitColor=stats.profit>=0?'var(--primary)':'var(--danger)';
html+=`<tr style="border-bottom:1px solid var(--brd)"><td style="padding:12px">${getEventLabel(event)}</td><td style="padding:12px">${stats.total}</td><td style="padding:12px">${stats.wins}</td><td style="padding:12px;color:${color};font-weight:700">${rate}%</td><td style="padding:12px;color:${profitColor};font-weight:700">${stats.profit>=0?'+':''}${Math.round(stats.profit).toLocaleString()} F</td></tr>`;
}
html+='</tbody></table>';
document.getElementById('mlStats').innerHTML=html;
}

function refreshStats(){
const db=getDB();
document.getElementById('statSimple').textContent=db.bets.filter(b=>b.type==='simple').length;
document.getElementById('statCombined').textContent=db.bets.filter(b=>b.type==='combined').length;
}

// =================================
// SETTINGS
// =================================
function saveSettings(){
const db=getDB();
db.capitalInitial=parseInt(document.getElementById('settingsCapital').value);
db.capital=db.capitalInitial;
saveDB(db);
showToast('✅ Paramètres sauvegardés', 'success');
}

function saveAPIKeys(){
const db=getDB();
db.apiKeys={
apiFootball:document.getElementById('apiFootballKey').value
};
saveDB(db);
showToast('✅ Clés API sauvegardées', 'success');
}

// =================================
// DATA
// =================================
function exportData(){
const db=getDB();
const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});
const url=URL.createObjectURL(blob);
const a=document.createElement('a');
a.href=url;
a.download=`betmind-backup-${new Date().toISOString().split('T')[0]}.json`;
a.click();
}

function importData(event){
const file=event.target.files[0];
if(!file)return;
const reader=new FileReader();
reader.onload=function(e){
try{
if(confirm('⚠️ Remplacer toutes vos données ?')){
localStorage.setItem(DB_KEY,e.target.result);
location.reload();
}
}catch{showToast('❌ Fichier invalide', 'error');}
};
reader.readAsText(file);
}

function resetData(){
if(confirm('⚠️ Effacer TOUTES les données ?')){
localStorage.removeItem(DB_KEY);
location.reload();
}
}

function updateUI(){refreshDashboard();}

// =================================
// INIT
// =================================
document.addEventListener('DOMContentLoaded',function(){
const db=getDB();
document.getElementById('settingsCapital').value=db.capitalInitial;
updateUI();
console.log('🧪 BetMind Pro V6 DEMO mode');
});
