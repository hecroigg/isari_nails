'use strict';
// Small, dependency-free enhancements. All core content is usable without JavaScript.
document.documentElement.classList.add('js');
const header=document.getElementById('site-header');
const progress=document.getElementById('header-progress');
const menu=document.getElementById('menu-button');
const nav=document.getElementById('main-nav');
const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer=window.matchMedia('(pointer: coarse)').matches;
const dmLink='https://ig.me/m/isari_nails';
const profileLink='https://www.instagram.com/isari_nails/';
const contactLinks=document.querySelectorAll('[data-contact]');
// Instagram DM deep links open the app on mobile. Use the profile on desktops.
contactLinks.forEach(link=>{link.href=coarsePointer?dmLink:profileLink});
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú')}
menu.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
document.addEventListener('click',e=>{if(!header.contains(e.target))closeMenu()});
let queued=false;
function onScroll(){if(queued)return;queued=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;header.classList.toggle('is-scrolled',scrollY>8);if(!prefersReduced){const stage=document.getElementById('hero-stage');if(stage){const rect=stage.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight){const distance=Math.max(-1,Math.min(1,-rect.top/innerHeight));stage.style.setProperty('--art-y',`${distance*15}px`);stage.style.setProperty('--art-r',`${distance*3}deg`)}}const story=document.querySelector('.story-visual');if(story){const rect=story.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight){const offset=Math.min(1,Math.max(-1,(innerHeight/2-(rect.top+rect.height/2))/innerHeight));story.style.setProperty('--story-front-y',`${offset*-15}px`);story.style.setProperty('--story-back-y',`${offset*18}px`)}}}queued=false})}
window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll,{passive:true});onScroll();
if(!prefersReduced&&'IntersectionObserver' in window){const items=document.querySelectorAll('.product-card,.step-card,.section-heading,.story-copy,.tailor-copy,.faq-heading,.outro-inner');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{rootMargin:'0px 0px 80px 0px',threshold:.04});items.forEach(el=>{el.classList.add('reveal');io.observe(el)})}
const filters=document.querySelectorAll('[data-filter]');const cards=document.querySelectorAll('.product-card');
filters.forEach(button=>button.addEventListener('click',()=>{const selected=button.dataset.filter;filters.forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});cards.forEach(card=>{card.classList.toggle('is-hidden',selected!=='todos'&&card.dataset.category!==selected)})}));
// Compose a useful inquiry, and only claim copying when the browser confirms it worked.
const ideaForm=document.getElementById('idea-form');const hint=document.getElementById('form-hint');const followup=document.getElementById('followup-dm');
ideaForm.addEventListener('submit',async e=>{e.preventDefault();const form=new FormData(ideaForm);const style=form.get('estilo')||'Personalizado';const details=String(form.get('detalle')||'').trim();const message=`¡Hola, Isari Nails! ♡ Me gustaría consultar un set press-on.\nEstilo: ${style}.${details?'\nMi idea: '+details:''}\n¿Podéis contarme cómo hacer el pedido?`;let copied=false;try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(message);copied=true}}catch(err){copied=false}if(!copied){try{const field=document.createElement('textarea');field.value=message;field.setAttribute('readonly','');field.style.cssText='position:fixed;left:-9999px;top:-9999px';document.body.appendChild(field);field.select();copied=document.execCommand('copy');field.remove()}catch(err){copied=false}}if(copied){hint.textContent='✓ Idea copiada. Abre Instagram y pega el texto en la conversación.';hint.style.color='#5a3e6c';followup.hidden=false}else{hint.textContent='No se ha podido copiar automáticamente. Copia el texto que aparece a continuación y envíalo desde Instagram.';hint.style.color='#773f65';const field=document.createElement('textarea');field.value=message;field.readOnly=true;field.rows=5;field.className='message-copy-fallback';hint.after(field);field.select();followup.hidden=false}});
document.getElementById('year').textContent=String(new Date().getFullYear());

// Desktop-only depth interaction: photographs keep their real texture and edges.
if(!prefersReduced && !coarsePointer){
 const stage=document.getElementById('hero-stage');
 if(stage){
  let frame=0, tx=0, ty=0, cx=0, cy=0;
  const update=()=>{cx+=(tx-cx)*.09;cy+=(ty-cy)*.09;stage.style.transform=`perspective(1200px) rotateY(${cx*3.6}deg) rotateX(${cy*-2.5}deg)`;if(Math.abs(tx-cx)+Math.abs(ty-cy)>.002)frame=requestAnimationFrame(update);else frame=0};
  stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();tx=Math.max(-1,Math.min(1,(e.clientX-r.left-r.width/2)/(r.width/2)));ty=Math.max(-1,Math.min(1,(e.clientY-r.top-r.height/2)/(r.height/2)));if(!frame)frame=requestAnimationFrame(update)},{passive:true});
  stage.addEventListener('pointerleave',()=>{tx=0;ty=0;if(!frame)frame=requestAnimationFrame(update)});
 }
}
