import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function createBrewScene(host, state, onContextLost) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  host.prepend(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 50);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .06);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffedd0, 0x23160f, 2));
  const key = new THREE.DirectionalLight(0xffe5bb, 5);
  key.position.set(-3, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = key.shadow.camera.bottom = -5;
  key.shadow.camera.right = key.shadow.camera.top = 5;
  key.shadow.normalBias = .03;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 3);
  rim.position.set(4, 3, -2);
  scene.add(rim);
  const world = new THREE.Group();
  scene.add(world);
  const brass = new THREE.MeshStandardMaterial({ color: 0xd9a64c, metalness: .92, roughness: .23 });
  const liquid = new THREE.MeshStandardMaterial({ color: 0x9c5628, roughness: .25, metalness: .05 });
  const foamMaterial = new THREE.MeshStandardMaterial({ color: 0xe7b973, roughness: .85 });
  const darkBean = new THREE.MeshStandardMaterial({ color: 0x4b2111, roughness: .65 });
  const seamMaterial = new THREE.MeshStandardMaterial({ color: 0x180a05, roughness: 1 });
  function mesh(geometry, material, parent = world) {
    const object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  function lathe(profile, parent) {
    return mesh(new THREE.LatheGeometry(profile.map(p => new THREE.Vector2(...p)), 64), brass, parent);
  }
  function tumbler(parent) {
    lathe([[0,0],[.42,0],[.47,.05],[.64,1.25],[.66,1.29],[.63,1.32],[.60,1.27],[.44,.1],[0,.1]], parent);
    const lip = mesh(new THREE.TorusGeometry(.635,.025,10,64), brass, parent);
    lip.rotation.x = Math.PI / 2;
    lip.position.y = 1.29;
  }
  const base = new THREE.Group();
  base.position.y = -.7;
  world.add(base);
  lathe([[0,-.12],[.76,-.12],[.99,-.03],[1.12,.25],[1.14,.29],[1.09,.32],[.97,.03],[0,.02]], base);
  tumbler(base);
  const surface = mesh(new THREE.CircleGeometry(.58,64), liquid, base);
  surface.rotation.x = -Math.PI / 2;
  surface.position.y = 1.2;
  // Instanced foam gives the drink a textured surface without hundreds of draw calls.
  const foam = new THREE.InstancedMesh(new THREE.SphereGeometry(1,7,5), foamMaterial, 110);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 110; i++) {
    const angle = i * 2.39996;
    const radius = .56 * Math.sqrt((i + .5) / 110);
    const size = .014 + (i % 7) * .003;
    dummy.position.set(Math.cos(angle)*radius, 1.21, Math.sin(angle)*radius);
    dummy.scale.set(size, size*.55, size);
    dummy.updateMatrix();
    foam.setMatrixAt(i,dummy.matrix);
  }
  base.add(foam);
  const upper = new THREE.Group();
  upper.position.set(1.4, 3, 0);
  upper.rotation.z = 1.9;
  world.add(upper);
  tumbler(upper);
  const stream = mesh(new THREE.CylinderGeometry(.037,.055,1,12), liquid);
  const start = new THREE.Vector3();
  const end = new THREE.Vector3(.08,.52,0);
  const direction = new THREE.Vector3();
  const axis = new THREE.Vector3(0,1,0);
  const splash = mesh(new THREE.TorusGeometry(.15,.011,6,32), foamMaterial);
  splash.rotation.x = Math.PI/2;
  splash.position.copy(end);
  const plinth = mesh(new THREE.CylinderGeometry(1.8,1.95,.18,64), new THREE.MeshStandardMaterial({ color: 0x713323, roughness: .9 }));
  plinth.position.y = -.94;
  const beans = [];
  const beanGeometry = new THREE.SphereGeometry(1,18,12);
  const slitGeometry = new THREE.TorusGeometry(.15,.018,6,24,Math.PI);
  const leafGeometry = new THREE.SphereGeometry(1,12,8);
  const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x5f8539, roughness: .75 });
  for (let i=0;i<7;i++) {
    const bean = new THREE.Group();
    const body = mesh(beanGeometry,darkBean,bean);
    body.scale.set(.16,.24,.11);
    const slit = mesh(slitGeometry,seamMaterial,bean);
    slit.rotation.z = Math.PI / 2;
    slit.position.z = .105;
    slit.scale.set(1,.3,1);
    const leaf = mesh(leafGeometry,leafMaterial,bean);
    leaf.scale.set(.13,.34,.025);
    leaf.visible = false;
    bean.userData = { body, slit, leaf };
    world.add(bean);
    beans.push(bean);
  }
  const steamCanvas = document.createElement('canvas');
  steamCanvas.width = steamCanvas.height = 64;
  const ctx = steamCanvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32,32,0,32,32,32);
  gradient.addColorStop(0,'rgba(255,245,221,0.5)');
  gradient.addColorStop(.4,'rgba(255,245,221,0.15)');
  gradient.addColorStop(1,'rgba(255,245,221,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0,0,64,64);
  const steamTexture = new THREE.CanvasTexture(steamCanvas);
  const steam = Array.from({length:12},() => {
    const puff = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTexture, transparent:true, depthWrite:false, opacity:.3 }));
    world.add(puff);
    return puff;
  });
  let time = 0, last = 0, raf = 0, disposed = false, visible = true, yaw = -.3, dragging = false, previousX = 0;
  let currentKind = '';
  function pose() {
    if (currentKind !== state.current.kind) {
      currentKind = state.current.kind;
      const tea = currentKind === 'tea';
      brass.color.set(tea ? 0xad512d : 0xd9a64c);
      brass.metalness = tea ? .05 : .92;
      brass.roughness = tea ? .85 : .23;
      liquid.color.set(tea ? 0xc08a50 : 0x9c5628);
      beans.forEach(b => { b.userData.leaf.visible = tea; b.userData.body.visible = b.userData.slit.visible = !tea; });
    }
    world.rotation.y = yaw + Math.sin(time*.24)*.12;
    upper.position.y = 3 + Math.sin(time*.8)*.12;
    upper.rotation.z = 1.9 + Math.sin(time*.8)*.035;
    upper.updateMatrix();
    start.set(-.63,1.29,0).applyMatrix4(upper.matrix);
    direction.subVectors(start,end);
    stream.position.copy(start).add(end).multiplyScalar(.5);
    stream.scale.set(1+Math.sin(time*9)*.1,direction.length(),1);
    stream.quaternion.setFromUnitVectors(axis,direction.normalize());
    const ripple = 1 + (time*1.5 % 1)*1.3;
    splash.scale.set(ripple,ripple,1);
    beans.forEach((bean,i) => {
      const angle = i/7*Math.PI*2 + time*.13;
      bean.position.set(Math.cos(angle)*2.05, .8 + Math.sin(angle*2 + i)*1.1, Math.sin(angle)*.85);
      bean.rotation.set(time*.25+i,i*.9,time*.17+i);
    });
    steam.forEach((puff,i) => {
      const age = (time*.2+i/12)%1;
      puff.position.set(Math.sin(age*6+i)*(.1+age*.3), .6+age*2, Math.cos(i*2)*.3);
      puff.scale.setScalar(.2+age*.7);
      puff.material.opacity = Math.sin(age*Math.PI)*.22;
    });
    canvas.dataset.motion = state.current.paused || state.current.localPaused ? 'paused' : 'playing';
  }
  function draw(now = performance.now()) {
    raf = 0;
    if (disposed) return;
    if (!visible || document.hidden) { last = 0; return; }
    const playing = !state.current.paused && !state.current.localPaused;
    if (playing && last) time += Math.min((now-last)/1000,.05);
    last = now;
    pose();
    renderer.render(scene,camera);
    if (playing) raf = requestAnimationFrame(draw);
  }
  function refresh() { if (!raf && !disposed) raf = requestAnimationFrame(draw); }
  function resize() {
    const {width,height} = host.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width/height;
    const distance = camera.aspect < 1 ? 10.7 : 9;
    camera.position.set(0,4.1,distance);
    camera.lookAt(0,1,0);
    camera.updateProjectionMatrix();
    renderer.setSize(width,height,false);
    refresh();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  function down(e) { dragging = true; previousX = e.clientX; canvas.setPointerCapture(e.pointerId); }
  function move(e) { if (dragging) { yaw += (e.clientX-previousX)*.008; previousX = e.clientX; refresh(); } }
  function up() { dragging = false; }
  function visibility() { last = 0; refresh(); }
  function lost(e) { e.preventDefault(); cancelAnimationFrame(raf); onContextLost(); }
  canvas.addEventListener('pointerdown',down);
  canvas.addEventListener('pointermove',move);
  canvas.addEventListener('pointerup',up);
  canvas.addEventListener('pointercancel',up);
  canvas.addEventListener('webglcontextlost',lost);
  document.addEventListener('visibilitychange',visibility);
  resize();
  return {
    refresh,
    setVisible(value) { visible = value; last = 0; if (value) refresh(); },
    rotate(amount) { yaw += amount; refresh(); },
    reset() { yaw = -.3; time = 0; refresh(); },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange',visibility);
      canvas.removeEventListener('pointerdown',down);
      canvas.removeEventListener('pointermove',move);
      canvas.removeEventListener('pointerup',up);
      canvas.removeEventListener('pointercancel',up);
      canvas.removeEventListener('webglcontextlost',lost);
      const geometries = new Set(), materials = new Set();
      scene.traverse(object => { if (object.geometry) geometries.add(object.geometry); if (object.material) materials.add(object.material); });
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      steamTexture.dispose();
      environment.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
