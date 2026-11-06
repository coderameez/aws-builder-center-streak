(() => {
  const START = '2026-11-07';
  const DAYS = 90;
  const STORAGE_KEY = 'aws-builder-streak-v1';
  const $ = id => document.getElementById(id);
  const startDate = new Date(START + 'T00:00:00+05:00');
  const dateKey = d => {
    const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Karachi',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);
    return parts.find(p=>p.type==='year').value+'-'+parts.find(p=>p.type==='month').value+'-'+parts.find(p=>p.type==='day').value;
  };
  const localToday = () => dateKey(new Date());
  const dateAt = index => new Date(startDate.getTime() + index * 86400000);
  const isoAt = index => {
    const d = dateAt(index);
    return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Karachi',year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
  };
  const dayIndex = key => Math.round((new Date(key+'T00:00:00+05:00') - startDate) / 86400000);
  const load = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } };
  let records = load();
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  const completed = key => Boolean(records[key]?.done);
  const streaks = () => {
    const today = localToday();
    let current = 0, best = 0, run = 0;
    for(let i=0;i<DAYS;i++){ if(completed(isoAt(i))){run++;best=Math.max(best,run)}else run=0; }
    let cursor = Math.min(DAYS-1,dayIndex(today));
    if(cursor < 0) cursor = -1;
    if(cursor >= 0 && !completed(isoAt(cursor))) cursor--;
    while(cursor>=0 && completed(isoAt(cursor))){current++;cursor--;}
    return {current,best};
  };
  const render = () => {
    const today = localToday(), idx = dayIndex(today), valid = idx>=0 && idx<DAYS;
    const count = Object.keys(records).filter(k=>completed(k) && dayIndex(k)>=0 && dayIndex(k)<DAYS).length;
    const {current,best} = streaks();
    $('progressText').textContent = count+' / 90 days';
    $('progressBar').style.width = (count/DAYS*100)+'%';
    $('currentStreak').textContent = current;
    $('bestStreak').textContent = best;
    $('completedDays').textContent = count;
    $('remainingDays').textContent = DAYS-count;
    $('todayHeading').textContent = valid ? 'Day '+(idx+1)+' check-in' : (idx<0?'Challenge starts November 7':'Challenge completed');
    $('todayDescription').textContent = valid ? 'Today is '+today+' (PKT). Complete the required AWS Builder Center activity manually, then record it below.' : 'The 90-day challenge runs from November 7, 2026 through February 4, 2027.';
    $('doneCheck').disabled = !valid;
    $('dailyNote').disabled = !valid;
    $('saveButton').disabled = !valid;
    $('doneCheck').checked = valid && completed(today);
    $('dailyNote').value = valid ? (records[today]?.note || '') : '';
    $('todayStatus').textContent = valid && completed(today) ? 'COMPLETED' : 'NOT LOGGED';
    $('todayStatus').classList.toggle('complete',valid && completed(today));
    $('undoButton').hidden = !(valid && completed(today));
    const calendar = $('calendar'); calendar.innerHTML='';
    for(let i=0;i<DAYS;i++){
      const key=isoAt(i), d=dateAt(i), button=document.createElement('div');
      button.className='day'+(completed(key)?' done':'')+(key===today?' today':'')+(key>today?' future':'');
      button.title='Day '+(i+1)+' · '+key+' · '+(completed(key)?'Completed':'Not logged');
      const number=document.createElement('span'); number.textContent=String(i+1).padStart(2,'0');
      const month=document.createElement('small'); month.textContent=new Intl.DateTimeFormat('en',{month:'short',timeZone:'Asia/Karachi'}).format(d);
      button.append(number,month); calendar.append(button);
    }
  };
  $('saveButton').addEventListener('click',()=>{
    const key=localToday(), idx=dayIndex(key);
    if(idx<0||idx>=DAYS)return;
    if($('doneCheck').checked) records[key]={done:true,note:$('dailyNote').value.trim()};
    else delete records[key];
    save();render();
  });
  $('undoButton').addEventListener('click',()=>{delete records[localToday()];save();render();});
  $('doneCheck').addEventListener('change',()=>{ $('todayStatus').textContent=$('doneCheck').checked?'READY TO SAVE':'NOT LOGGED'; });
  $('exportButton').addEventListener('click',()=>{
    const payload={challenge:'AWS Builder Center 90-Day Streak',start:START,end:'2027-02-04',timezone:'Asia/Karachi',records};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='aws-builder-streak-history.json';a.click();URL.revokeObjectURL(url);
  });
  render();
})();