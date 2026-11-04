/* Isari Nails — immersive WebGL art direction. Progressive enhancement: CSS art remains if WebGL unavailable. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarse=matchMedia("(pointer: coarse)").matches;
const palette={violeta:0xa75ac1,rosa:0xf2a1cd,vino:0x8f315e,negro:0x30243e};
function nailShape(){
 // Slim, anatomically plausible almond-shaped press-on tip, rather than a rounded rectangular block.
 const shape=new THREE.Shape();
 shape.moveTo(-.36,-1.05);
 shape.bezierCurveTo(-.43,-.68,-.42,.18,-.28,.64);
 shape.bezierCurveTo(-.19,.91,-.075,1.10,0,1.13);
 shape.bezierCurveTo(.075,1.10,.19,.91,.28,.64);
 shape.bezierCurveTo(.42,.18,.43,-.68,.36,-1.05);
 shape.quadraticCurveTo(0,-1.16,-.36,-1.05);
 const g=new THREE.ExtrudeGeometry(shape,{depth:.065,bevelEnabled:true,bevelSegments:9,steps:1,bevelSize:.045,bevelThickness:.085,curveSegments:40});
 const p=g.attributes.position;
 // Curved nail bed, with subtly convex upper surface, not a flat slab.
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);if(z>.025)p.setZ(i,z+.115*(1-Math.min(1,Math.pow(x/.45,2)))*(.8+.2*Math.cos(y*1.5)))}
 g.computeVertexNormals();g.center();return g;
}
const geometry=nailShape();
function rendererFor(el){
 const r=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});
 r.setPixelRatio(Math.min(devicePixelRatio,coarse?2:2.5));r.setClearColor(0xffffff,0);r.outputColorSpace=THREE.SRGBColorSpace;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.18;
 r.domElement.className="isari-webgl";r.domElement.setAttribute("aria-hidden","true");el.appendChild(r.domElement);return r;
}
function setLights(scene){
 scene.add(new THREE.AmbientLight(0xffe9fc,2.4));
 const key=new THREE.DirectionalLight(0xffffff,4.3);key.position.set(-3,6,9);scene.add(key);
 const pink=new THREE.PointLight(0xffb2e1,35);pink.position.set(4,2,3);scene.add(pink);
 const violet=new THREE.PointLight(0xbda1ed,28);violet.position.set(-4,-2,2);scene.add(violet);
}
function buildSet(){
 const group=new THREE.Group();
 const colors=[0xf2d4dc,0xed7c97,0x73345f,0xf7e5e7,0xec8c9f];
 for(let i=0;i<5;i++){
  const material=new THREE.MeshPhysicalMaterial({color:colors[i],metalness:.03,roughness:.13,clearcoat:1,clearcoatRoughness:.055,side:THREE.DoubleSide});
  const nail=new THREE.Mesh(geometry,material);
  nail.position.set((i-2)*.86,Math.cos((i-2)*.63)*.19,-Math.abs(i-2)*.10);
  nail.rotation.z=(i-2)*-.115;nail.rotation.y=(i-2)*.045;
  nail.scale.set(i===2?1.02:.9,i===2?1.16:i===0||i===4?.91:1.06,1);
  group.add(nail);
  // Realistic, fine gold French-tip accent, flush with the nail surface.
  if(i===0||i===3){
   const gold=new THREE.Mesh(new THREE.TorusGeometry(.285,.013,5,64,Math.PI),new THREE.MeshStandardMaterial({color:0xb77b56,metalness:.65,roughness:.22}));
   gold.position.set(nail.position.x,nail.position.y-.53,nail.position.z+.205);gold.rotation.z=Math.PI;gold.scale.set(1,.33,1);group.add(gold);
  }
  // Small dark organic tortoiseshell spots on the accent nails.
  if(i===1||i===4){for(let j=0;j<5;j++){
   const spot=new THREE.Mesh(new THREE.SphereGeometry(.075+(j%3)*.012,12,8),new THREE.MeshPhysicalMaterial({color:j%2?0x6e274b:0x3d2135,transparent:true,opacity:.76,roughness:.3}));
   spot.scale.set(1.15,.6,.12);spot.position.set(nail.position.x+Math.sin(j*2.7)*.17,nail.position.y+(j-2)*.25,nail.position.z+.24);group.add(spot);
  }}
 }
 return group;
}
function particles(scene,count=45){
 const geo=new THREE.BufferGeometry(),arr=new Float32Array(count*3);
 for(let i=0;i<count;i++){arr[i*3]=(Math.random()-.5)*13;arr[i*3+1]=(Math.random()-.5)*11;arr[i*3+2]=(Math.random()-.5)*7-2}
 geo.setAttribute("position",new THREE.BufferAttribute(arr,3));
 const material=new THREE.PointsMaterial({color:0xffffff,size:.035,transparent:true,opacity:.83,sizeAttenuation:true,depthWrite:false});
 const mesh=new THREE.Points(geo,material);scene.add(mesh);return mesh;
}
const views=[];
function createView(host,mode){
 if(!host)return;
 let renderer;
 try{renderer=rendererFor(host)}catch(err){console.warn("3D unavailable; keeping illustrated fallback.",err);return}
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);
 camera.position.set(0,0,mode==="hero"?11:10);
 setLights(scene);const set=buildSet();scene.add(set);const dust=particles(scene,mode==="hero"?50:90);
 const resize=()=>{const b=host.getBoundingClientRect();if(b.width<1||b.height<1)return;renderer.setSize(b.width,b.height,false);camera.aspect=b.width/b.height;camera.updateProjectionMatrix()};
 resize();const observer=new ResizeObserver(resize);observer.observe(host);
 host.classList.add("webgl-ready");
 views.push({host,mode,renderer,scene,camera,set,dust,visible:true,observer});
}
createView(document.querySelector(".scene"),"hero");
createView(document.querySelector(".story-sticky"),"story");
const visibility=new IntersectionObserver(es=>es.forEach(e=>{const v=views.find(x=>x.host===e.target);if(v)v.visible=e.isIntersecting}),{rootMargin:"150px"});
views.forEach(v=>visibility.observe(v.host));
let scrollT=0,pointerX=0,pointerY=0;
addEventListener("pointermove",e=>{pointerX=(e.clientX/innerWidth-.5)*2;pointerY=(e.clientY/innerHeight-.5)*2},{passive:true});
function readScroll(){
 const story=document.querySelector(".scroll-story");
 if(story){const rect=story.getBoundingClientRect();scrollT=Math.max(0,Math.min(1,-rect.top/Math.max(1,story.offsetHeight-innerHeight)))}
}
addEventListener("scroll",readScroll,{passive:true});readScroll();
let running=true;document.addEventListener("visibilitychange",()=>running=!document.hidden);
const clock=new THREE.Clock();
function frame(){
 requestAnimationFrame(frame);const t=clock.getElapsedTime();if(!running)return;
 for(const v of views){if(!v.visible)continue;
  const {set,dust,mode}=v;
  if(mode==="hero"){
   set.rotation.y+=(pointerX*.15+Math.sin(t*.28)*.13-set.rotation.y)*.045;
   set.rotation.x+=(-pointerY*.09+Math.cos(t*.32)*.07-set.rotation.x)*.04;
   set.rotation.z=Math.sin(t*.37)*.055;set.position.y=Math.sin(t*.8)*.15;
  }else{
   const target=scrollT*Math.PI*2.15;
   set.rotation.y+=(target-set.rotation.y)*.07;
   set.rotation.z=Math.sin(scrollT*Math.PI*2)*.18;
   set.rotation.x=Math.sin(scrollT*Math.PI)*.25;
   const scale=.8+scrollT*.45;set.scale.setScalar(scale);
   set.position.y=-.3+Math.sin(scrollT*Math.PI)*.45;
  }
  if(!reduced){dust.rotation.y=t*.014;dust.rotation.z=Math.sin(t*.15)*.04}
  v.renderer.render(v.scene,v.camera);
 }
}
frame();
const colors=document.getElementById("colors");
if(colors)colors.addEventListener("click",e=>{const b=e.target.closest("[data-color]");if(!b)return;for(const v of views){v.set.children.forEach(child=>{if(child.isMesh&&child.geometry===geometry)child.material.color.setHex(palette[b.dataset.color]||palette.violeta)})}});
