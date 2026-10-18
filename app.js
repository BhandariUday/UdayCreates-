const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const STORAGE = {users:'uc_demo_users', current:'uc_demo_current', posts:'uc_demo_posts', projects:'uc_demo_projects', plan:'uc_demo_plan'};
const getStore = (key, fallback=[]) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const setStore = (key, value) => localStorage.setItem(key, JSON.stringify(value));
let authMode = 'signup';
let pendingPlan = '';
let pendingFreelancer = '';
let toastTimer;

$('#year').textContent = new Date().getFullYear();
$('#menuToggle').addEventListener('click', () => $('#navLinks').classList.toggle('open'));
$$('#navLinks a').forEach(a => a.addEventListener('click', () => $('#navLinks').classList.remove('open')));

function toast(message) {
  const el = $('#toast'); el.textContent = message; el.classList.remove('hidden');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.add('hidden'), 3400);
}
function openModal(id) { $('#'+id).classList.remove('hidden'); document.body.style.overflow='hidden'; }
function closeModals() { $$('.modal-backdrop').forEach(m=>m.classList.add('hidden')); document.body.style.overflow=''; }
$$('[data-close-modal]').forEach(b=>b.addEventListener('click',closeModals));
$$('.modal-backdrop').forEach(b=>b.addEventListener('click',e=>{if(e.target===b)closeModals()}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModals()});

function setAuthMode(mode) {
  authMode=mode;
  $('#authTitle').textContent=mode==='signup'?'Your people are here.':'Welcome back.';
  $('#authSubtitle').textContent=mode==='signup'?'Create a demo account to explore the experience.':'Log in to your demo account on this device.';
  $('#authName').closest('label').classList.toggle('hidden',mode==='login');
  $('#authName').required=mode==='signup';
  $('#authSubmit').textContent=mode==='signup'?'Create demo account ↗':'Log in ↗';
  $$('.auth-tab').forEach(t=>t.classList.toggle('active',t.dataset.authTab===mode));
  $('#authMessage').classList.add('hidden');
}
$$('[data-open-auth]').forEach(b=>b.addEventListener('click',()=>{setAuthMode(b.dataset.openAuth);openModal('authModal')}));
$$('[data-auth-tab]').forEach(b=>b.addEventListener('click',()=>setAuthMode(b.dataset.authTab)));
$('#authForm').addEventListener('submit',e=>{
  e.preventDefault();
  const fd=new FormData(e.currentTarget), email=String(fd.get('email')).trim().toLowerCase(), password=String(fd.get('password'));
  const users=getStore(STORAGE.users,[]);
  if(authMode==='signup'){
    if(users.some(u=>u.email===email)){showAuthMessage('An account with this email already exists on this device. Try logging in.');return;}
    const user={name:String(fd.get('name')).trim(),email,password,plan:pendingPlan||'Free',createdAt:new Date().toISOString()};
    users.push(user);setStore(STORAGE.users,users);setStore(STORAGE.current,{name:user.name,email:user.email,plan:user.plan});
    showAuthMessage('Demo account created! You can now explore the prototype.');toast('Welcome to UdayCreates, '+user.name+'!');
    if(pendingPlan){setStore(STORAGE.plan,{email,plan:pendingPlan});pendingPlan='';}
    setTimeout(closeModals,900);
  } else {
    const user=users.find(u=>u.email===email&&u.password===password);
    if(!user){showAuthMessage('No matching demo account found on this device. Sign up first.');return;}
    setStore(STORAGE.current,{name:user.name,email:user.email,plan:user.plan||'Free'});
    showAuthMessage('You’re logged in. Welcome back!');toast('Welcome back, '+user.name+'!');
    setTimeout(closeModals,700);
  }
});
function showAuthMessage(msg){const el=$('#authMessage');el.textContent=msg;el.classList.remove('hidden');}

function renderPosts(){
  const posts=getStore(STORAGE.posts,[]);
  const container=$('#feedPosts');
  $$('.user-post',container).forEach(n=>n.remove());
  posts.slice().reverse().forEach((p,i)=>{
    const article=document.createElement('article');article.className='feed-post user-post';
    const avatar=document.createElement('div');avatar.className='post-avatar avatar-purple';avatar.textContent=(p.name||'Y').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
    const body=document.createElement('div');body.className='post-body';
    const meta=document.createElement('div');meta.className='post-meta';
    const strong=document.createElement('strong');strong.textContent=p.name||'Community member';
    const time=document.createElement('span');time.textContent='Just now';meta.append(strong,time);
    const para=document.createElement('p');para.textContent=p.text;
    const tags=document.createElement('div');tags.className='post-tags';const tag=document.createElement('span');tag.textContent='#community';tags.append(tag);
    const like=document.createElement('button');like.className='like-button';like.dataset.like='';like.innerHTML='♡ <span>0</span> helpful';
    body.append(meta,para,tags,like);article.append(avatar,body);container.prepend(article);
  });
  $('#emptyPosts').classList.toggle('hidden',posts.length!==0);
}
$('#postForm').addEventListener('submit',e=>{
  e.preventDefault();
  const current=getStore(STORAGE.current,null);
  if(!current){setAuthMode('signup');openModal('authModal');toast('Create a demo account to post.');return;}
  const text=$('#postInput').value.trim();if(!text)return;
  const posts=getStore(STORAGE.posts,[]);posts.push({name:current.name,text,createdAt:new Date().toISOString()});setStore(STORAGE.posts,posts);
  $('#postInput').value='';renderPosts();toast('Your post was added on this device.');
});
document.addEventListener('click',e=>{
  const like=e.target.closest('[data-like]');
  if(like){const span=$('span',like);let n=Number(span.textContent)||0;const active=like.classList.toggle('liked');span.textContent=String(n+(active?1:-1));like.firstChild.textContent=active?'♥ ':'♡ ';}
});
renderPosts();

$$('#talentFilters [data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
  const filter=btn.dataset.filter;$$('#talentFilters [data-filter]').forEach(b=>b.classList.toggle('active',b===btn));
  let count=0;$$('.talent-card').forEach(card=>{const show=filter==='All'||card.dataset.role===filter;card.classList.toggle('hidden',!show);if(show)count++;});
  $('#talentCount').textContent=count+' profile'+(count===1?'':'s');
}));
function openProject(type, freelancer=''){
  pendingFreelancer=freelancer;openModal('projectModal');
  if(type==='studio')$('#projectType').value='';
  if(freelancer)$('#projectType').value='Project with a freelancer';
  $('#projectTitle').textContent=freelancer?'Discuss a project with '+freelancer+'.':'Tell us what you’re building.';
  $('#projectMessage').classList.add('hidden');
}
$$('[data-open-project]').forEach(b=>b.addEventListener('click',()=>openProject(b.dataset.openProject)));
$$('[data-project]').forEach(b=>b.addEventListener('click',()=>openProject('freelancer',b.dataset.project)));
$('#projectForm').addEventListener('submit',e=>{
  e.preventDefault();const fd=new FormData(e.currentTarget);
  const projects=getStore(STORAGE.projects,[]);
  projects.push({name:fd.get('name'),email:fd.get('email'),type:fd.get('type'),budget:fd.get('budget'),brief:fd.get('brief'),freelancer:pendingFreelancer,createdAt:new Date().toISOString()});
  setStore(STORAGE.projects,projects);
  const msg=$('#projectMessage');msg.textContent='Enquiry saved in this browser prototype. For a real launch, connect a backend and email/CRM inbox to receive it.';msg.classList.remove('hidden');
  toast('Project enquiry saved locally.');e.currentTarget.reset();
});
$$('[data-plan]').forEach(b=>b.addEventListener('click',()=>{
  const plan=b.dataset.plan;const current=getStore(STORAGE.current,null);
  if(!current){pendingPlan=plan;setAuthMode('signup');openModal('authModal');toast('Create a demo account to select '+plan+'.');return;}
  current.plan=plan;setStore(STORAGE.current,current);setStore(STORAGE.plan,{email:current.email,plan});
  const users=getStore(STORAGE.users,[]);const u=users.find(x=>x.email===current.email);if(u){u.plan=plan;setStore(STORAGE.users,users);}
  toast(plan==='Free'?'You’re on the Free demo plan.':plan+' selected in demo mode — no payment collected.');
}));
