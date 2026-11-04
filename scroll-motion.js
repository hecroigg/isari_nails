'use strict';
// A single passive scroll pipeline controls the entire backdrop and a three-act photo story.
// Only transforms and opacity are animated. No canvas, WebGL, layout tween, or imported library.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const world = document.getElementById('scroll-world');
  const cinema = document.getElementById('universo');
  const stage = document.querySelector('.hero-stage');
  const heroAura = document.querySelector('.hero-aura');
  const storyVisual = document.querySelector('.story-visual');
  const tailorVisual = document.querySelector('.tailor-art');
  const outroGlow = document.querySelector('.outro-glow');
  const line = document.getElementById('scroll-edge');
  const photos = [...document.querySelectorAll('.cinema-photo')];
  const steps = [...document.querySelectorAll('.cinema-step')];
  const dots = [...document.querySelectorAll('.cinema-dots i')];
  if (!world || !cinema || !photos.length) return;

  const wash = world.querySelector('.world-wash');
  const washB = world.querySelector('.world-wash-b');
  const pearls = [...world.querySelectorAll('.world-pearl')];
  const arcs = [...world.querySelectorAll('.world-arc')];
  const stars = [...world.querySelectorAll('.world-spark')];
  const tone = cinema.querySelector('.cinema-color');
  const halo = cinema.querySelector('.cinema-halo');
  const orbit = cinema.querySelector('.cinema-orbit');
  const satellites = [...cinema.querySelectorAll('.cinema-satellite')];
  const counter = cinema.querySelector('.cinema-counter');
  const clamp = (v,a=0,b=1) => Math.min(b,Math.max(a,v));
  const smooth = (a,b,t) => { const x=clamp((t-a)/(b-a)); return x*x*(3-2*x); };

  let currentY = Math.max(0, window.scrollY), targetY = currentY;
  let raf = 0, screenH = innerHeight, docH = 1;
  let cinemaTop = 0, cinemaDistance = 1;
  let heroTop=0, heroHeight=1,storyTop=0,storyHeight=1,tailorTop=0,tailorHeight=1,outroTop=0,outroHeight=1;

  function measure(){
    const scrollY=window.scrollY;
    const rect=(el)=>{ if(!el)return {top:0,height:1}; const r=el.getBoundingClientRect();return {top:r.top+scrollY,height:r.height}; };
    const c=rect(cinema);cinemaTop=c.top;cinemaDistance=Math.max(1,c.height-innerHeight);
    const h=rect(stage);heroTop=h.top;heroHeight=h.height;
    const s=rect(storyVisual);storyTop=s.top;storyHeight=s.height;
    const t=rect(tailorVisual);tailorTop=t.top;tailorHeight=t.height;
    const o=rect(outroGlow?.parentElement);outroTop=o.top;outroHeight=o.height;
    docH=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    screenH=innerHeight;
  }
  function region(y,top,height){return clamp((y+screenH*.65-top)/(height+screenH*.35));}
  const translate=(el,x,y,rotation=0,scale=1)=>{if(el)el.style.transform=`translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${rotation.toFixed(2)}deg) scale(${scale.toFixed(3)})`;};
  function render(){
    raf=0;
    if(reduced.matches)return;
    currentY=targetY; // Scroll-linked animation: no lag or unnecessary frames.
    const y=currentY, progress=clamp(y/docH);
    const responsive=innerWidth<650?.66:1;
    if(line)line.style.transform=`scaleY(${progress.toFixed(4)})`;

    // Persistent moving backdrop, visible through all translucent chapter backgrounds.
    translate(wash,-progress*110*responsive,-progress*195*responsive,progress*13,1.09+progress*.1);
    translate(washB,progress*95*responsive,-progress*85*responsive,-progress*8,1.04+progress*.08);
    washB.style.opacity=(.08+.54*smooth(0,.55,progress)).toFixed(3);
    pearls.forEach((el,i)=>translate(el,Math.sin(y/460+i*1.9)*20*responsive+(i%2?1:-1)*progress*170*responsive,
      (i===1?-1:1)*progress*(240+i*75)*responsive,progress*(i===0?23:-17),1+progress*(i===2?.22:.08)));
    arcs.forEach((el,i)=>translate(el,(i?1:-1)*progress*80*responsive,-progress*(i?190:285)*responsive,progress*(i?34:-23),1+progress*.13));
    stars.forEach((el,i)=>translate(el,Math.cos(y/350+i*2.3)*17*responsive,
      -progress*(i?120:245)*responsive,progress*(i?160:-120)));

    // Hero photographs and background move independently while the page leaves the first screen.
    const h=region(y,heroTop,heroHeight);
    if(h>0&&h<1.001){
      translate(heroAura,-h*36*responsive,h*120*responsive,h*5,1+h*.18);
      const heroMain=stage?.querySelector('.hero-photo-main'),heroSecondary=stage?.querySelector('.hero-photo-secondary');
      if(heroMain)heroMain.style.transform=`translate3d(${(h*18*responsive).toFixed(1)}px,${(-h*83*responsive).toFixed(1)}px,0) rotate(${(8+h*7).toFixed(2)}deg) scale(${(1+h*.075).toFixed(3)})`;
      if(heroSecondary)heroSecondary.style.transform=`translate3d(${(-h*34*responsive).toFixed(1)}px,${(h*95*responsive).toFixed(1)}px,0) rotate(${(-13-h*9).toFixed(2)}deg) scale(${(1-h*.06).toFixed(3)})`;
      stage?.querySelectorAll('.hero-orbit').forEach((el,i)=>{el.style.translate=`${(i?-1:1)*h*38*responsive}px ${(-h*(i?80:52)*responsive).toFixed(1)}px`});
    }

    // An intentional pinned sequence: each image and sentence moves with the scroll.
    const t=clamp((y-cinemaTop)/cinemaDistance);
    const weights=[1-smooth(.25,.40,t),smooth(.25,.40,t)*(1-smooth(.65,.80,t)),smooth(.65,.80,t)];
    steps.forEach((el,i)=>{
      const alpha=weights[i]; el.style.opacity=alpha.toFixed(3);
      el.style.transform=`translate3d(0,${((1-alpha)*22).toFixed(1)}px,0)`;
      el.style.pointerEvents=alpha>.9?'auto':'none';
      el.setAttribute('aria-hidden',alpha<.5?'true':'false');
    });
    photos.forEach((el,i)=>{
      const alpha=weights[i], offset=(i===0?t:(i===1?t-.5:t-1));
      const x=(i===0?-1:1)*(-offset)*60*responsive;
      const yp=offset*-105*responsive;
      const rotate=(-7+(i-1)*8)+t*30;
      const scale=1.04+(1-alpha)*-.19;
      el.style.opacity=alpha.toFixed(3);
      el.style.transform=`translate3d(${x.toFixed(1)}px,${yp.toFixed(1)}px,0) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      el.setAttribute('aria-hidden',alpha<.5?'true':'false');
    });
    const active=t<.36?0:t<.72?1:2;
    dots.forEach((dot,i)=>dot.classList.toggle('active',i===active));
    if(counter)counter.textContent=`0${active+1} / 03`;
    tone.style.opacity=(smooth(.25,.64,t)*.55).toFixed(3);
    if(halo)halo.style.transform=`translate3d(calc(-50% + ${(Math.sin(t*Math.PI*2)*25*responsive).toFixed(1)}px),calc(-50% + ${(-t*35*responsive).toFixed(1)}px),0) scale(${(1+t*.24).toFixed(3)})`;
    if(orbit)orbit.style.transform=`translate3d(-50%,-50%,0) rotate(${(-20+t*170).toFixed(1)}deg) scaleY(${(.78+t*.07).toFixed(3)}) scale(${(1+t*.12).toFixed(3)})`;
    satellites.forEach((el,i)=>translate(el,(i?-1:1)*t*(100+i*40)*responsive,-t*(i?150:75)*responsive,t*(i?100:-70),1+t*.12));

    // Photo collage + customization: opposite-depth movements, never repositioning the layout.
    const sv=region(y,storyTop,storyHeight),tv=region(y,tailorTop,tailorHeight);
    if(storyVisual){
      const front=(.5-sv)*30*responsive,back=(sv-.5)*46*responsive;
      storyVisual.style.setProperty('--float-front',`${front.toFixed(1)}px`);
      storyVisual.style.setProperty('--float-back',`${back.toFixed(1)}px`);
      storyVisual.style.setProperty('--stamp-y',`${((sv-.5)*45*responsive).toFixed(1)}px`);
      const sphere=storyVisual.querySelector('.story-visual-bg');
      translate(sphere,(sv-.5)*-30*responsive,(sv-.5)*75*responsive,(sv-.5)*22,1+(sv-.5)*.15);
    }
    if(tailorVisual){
      const art=tailorVisual.querySelector('img'),background=tailorVisual.querySelector('.tailor-art-bg');
      if(art)art.style.transform=`translate3d(0,${((.5-tv)*64*responsive).toFixed(1)}px,0) rotate(${(-9+tv*9).toFixed(1)}deg) scale(${(1+tv*.045).toFixed(3)})`;
      translate(background,(tv-.5)*50*responsive,(tv-.5)*48*responsive,-10+(tv-.5)*21,1+tv*.11);
      tailorVisual.style.setProperty('--tailor-label-y',`${((.5-tv)*36*responsive).toFixed(1)}px`);
    }
    if(outroGlow){const o=region(y,outroTop,outroHeight);translate(outroGlow,(o-.5)*125*responsive,(.5-o)*120*responsive,o*12,1+o*.12)}

  }
  function trigger(){ if(reduced.matches)return; targetY=Math.max(0,scrollY); if(!raf)raf=requestAnimationFrame(render); }
  function reset(){measure();targetY=scrollY; currentY=targetY;trigger();}
  window.addEventListener('scroll',trigger,{passive:true});
  window.addEventListener('resize',reset,{passive:true});
  window.addEventListener('pageshow',reset);
  window.addEventListener('load',reset,{once:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)reset()});
  reduced.addEventListener?.('change',()=>{if(reduced.matches){world.removeAttribute('style');photos.forEach((el,i)=>{el.removeAttribute('style');el.setAttribute('aria-hidden',i?'true':'false')});steps.forEach((el,i)=>{el.removeAttribute('style');el.setAttribute('aria-hidden',i?'true':'false')})}else reset()});
  document.documentElement.classList.add('scroll-motion');
  measure(); trigger();
})();
