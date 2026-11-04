/* Isari Nails — immersive WebGL art direction. Progressive enhancement: CSS art remains if WebGL unavailable. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarse=matchMedia("(pointer: coarse)").matches;
const palette={violeta:0xa75ac1,rosa:0xf2a1cd,vino:0x8f315e,negro:0x30243e};
function nailShape(){
 const s=new THREE.Shape();s.moveTo(-.31,-1.05);s.bezierCurveTo(-.34,-.55,-.43,.25,-.33,.69);s.bezierCurveTo(-.25,1.02,-.12,1.12,0,1.12);s.bezierCurveTo(.12,1.12,.25,1.02,.33,.69);s.bezierCurveTo(.43,.25,.34,-.55,.31,-1.05);s.quadraticCurveTo(0,-1.15,-.31,-1.05);
 const g=new THREE.ExtrudeGeometry(s,{depth:.16,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.065,bevelThickness:.075,curveSegments:20});
 g.computeVertexNormals();g.center();return g;
}
const geometry=nailShape();
function rendererFor(el){
 const r=new THREE.WebGLRenderer({alpha:true,antialias:!coarse,powerPreference:"low-power"});
 r.setPixelRatio(Math.min(devicePixelRatio,coarse?1.4:2));r.setClearColor(0xffffff,0);r.outputColorSpace=THREE.SRGBColorSpace;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.55;
 r.domElement.className="isari-webgl";r.domElement.setAttribute("aria-hidden","true");el.appendChild(r.domElement);return r;
}
function setLights(scene){
 scene.add(new THREE.AmbientLight(0xffe9fc,2.4));
 const key=new THREE.DirectionalLight(0xffffff,4.3);key.position.set(-3,6,9);scene.add(key);
 const pink=new THREE.PointLight(0xff78d4,85);pink.position.set(4,2,3);scene.add(pink);
 const violet=new THREE.PointLight(0x9955ff,60);violet.position.set(-4,-2,2);scene.add(violet);
}
function buildSet(color=palette.violeta){
 const group=new THREE.Group();
 for(let i=0;i<5;i++){
  const material=new THREE.MeshPhysicalMaterial({color,metalness:.12,roughness:.16,clearcoat:1,clearcoatRoughness:.08,side:THREE.DoubleSide});
  const nail=new THREE.Mesh(geometry,material);
  nail.position.set((i-2)*.85,Math.cos((i-2)*.63)*.25,Math.abs(i-2)*-.16);
  nail.rotation.z=(i-2)*-.13;nail.rotation.y=(i-2)*.09;
  nail.scale.set(i===2?1.02:.88,i===2?1.2:i===0||i===4?.84:1.06,1);
  group.add(nail);
  const motif=new THREE.Mesh(new THREE.OctahedronGeometry(.11,0),new THREE.MeshPhysicalMaterial({color:0xfff0fc,metalness:.65,roughness:.12,emissive:0xffb4ed,emissiveIntensity:.25}));
  motif.position.set(nail.position.x,nail.position.y+.22,nail.position.z+.18);motif.rotation.z=.3;group.add(motif);
 }
 return group;
}
function particles(scene,count=45){
 const geo=new THREE.BufferGeometry(),arr=new Float32Array(count*3);
 for(let i=0;i<count;i++){arr[i*3]=(Math.random()-.5)*13;arr[i*3+1]=(Math.random()-.5)*11;arr[i*3+2]=(Math.random()-.5)*7-2}
 geo.setAttribute("position",new THREE.BufferAttribute(arr,3));
 const material=new THREE.PointsMaterial({color:0xffffff,size:.07,transparent:true,opacity:.83,sizeAttenuation:true,depthWrite:false});
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
