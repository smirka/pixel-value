import * as THREE from './three/three.module.js';

const definitions = {
  medallion: buildMedallion,
  collectibles: buildCollectibles,
  orbital: buildOrbital,
};

let renderer;
let canvas;
let currentId = '';
let currentFigure;
let activeModel;
let frame = 0;
let previousTime = 0;
let enteredAt = 0;
let yaw = 0;
let pitch = 0;
let dragged = false;
let lastX = 0;
let lastY = 0;
let pointerId = null;
let reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let lowPerf = document.documentElement.classList.contains('low-perf');
let environmentMap;
const canvasHost = document.createElement('div');
canvasHost.className = 'pv-model-canvas-host';

function mat(color, metalness = 0.15, roughness = 0.3, extra = {}) {
  return new THREE.MeshPhysicalMaterial({ color, metalness, roughness, clearcoat: 0.75, clearcoatRoughness: 0.2, ...extra });
}

const gold = () => mat('#e8b85f', 0.83, 0.23);
const paleGold = () => mat('#ffe1a0', 0.72, 0.19);
const silver = () => mat('#c9d8ee', 0.9, 0.18);
const darkMetal = () => mat('#182035', 0.78, 0.28);
const violet = () => mat('#9560ee', 0.3, 0.2, { emissive: '#30105d', emissiveIntensity: 0.32 });
const teal = () => mat('#30dccc', 0.34, 0.19, { emissive: '#087d83', emissiveIntensity: 0.28 });

function mesh(geometry, material, parent) {
  const item = new THREE.Mesh(geometry, material);
  item.castShadow = false;
  item.receiveShadow = false;
  parent.add(item);
  return item;
}

function glow(color, intensity, distance, position) {
  const light = new THREE.PointLight(color, intensity, distance, 2);
  light.position.set(...position);
  return light;
}

function jewel(parent, color, scale = [0.42, 0.53, 0.3], position = [0, 0, 0], detail = 0) {
  const geo = new THREE.IcosahedronGeometry(1, detail);
  const source = geo.index ? geo.toNonIndexed() : geo;
  if (source !== geo) geo.dispose();
  const positions = source.getAttribute('position');
  const colors = [];
  const c = new THREE.Color(color);
  for (let i = 0; i < positions.count; i += 3) {
    const shade = 0.64 + ((i * 17) % 11) / 24;
    for (let j = 0; j < 3; j++) colors.push(c.r * shade, c.g * shade, c.b * shade);
  }
  source.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const material = new THREE.MeshPhysicalMaterial({ vertexColors: true, metalness: 0.08, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08, flatShading: true, emissive: color, emissiveIntensity: 0.08 });
  const obj = mesh(source, material, parent);
  obj.scale.set(...scale);
  obj.position.set(...position);
  return obj;
}

function torus(parent, radius, tube, material, position = [0, 0, 0], rotation = [0, 0, 0], tubularSegments = 72) {
  const obj = mesh(new THREE.TorusGeometry(radius, tube, 10, tubularSegments), material, parent);
  obj.position.set(...position);
  obj.rotation.set(...rotation);
  return obj;
}

function ornateWing(parent, mirror = 1, material = gold()) {
  const s = new THREE.Shape();
  s.moveTo(0, 0.12);
  s.bezierCurveTo(0.3, 0.56, 0.82, 0.72, 1.12, 0.62);
  s.bezierCurveTo(0.98, 0.42, 0.82, 0.2, 0.54, 0.06);
  s.bezierCurveTo(0.88, 0.12, 1.16, -0.05, 1.31, -0.31);
  s.bezierCurveTo(0.9, -0.48, 0.5, -0.37, 0, -0.12);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.11, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.035, bevelThickness: 0.035, curveSegments: 7 });
  const wing = mesh(g, material, parent);
  wing.scale.x = mirror;
  wing.position.z = -0.04;
  return wing;
}

function pendant(parent, scale = 1) {
  const group = new THREE.Group();
  group.scale.setScalar(scale);
  parent.add(group);
  torus(group, 0.57, 0.065, silver(), [0, 0.04, 0], [0.16, 0.28, -0.22]);
  torus(group, 0.52, 0.025, teal(), [0, 0.04, 0.015], [0.24, -0.34, 0.24]);
  torus(group, 0.12, 0.034, silver(), [0, 0.74, 0], [Math.PI / 2, 0, 0]);
  const gem = jewel(group, '#29e0dc', [0.34, 0.67, 0.29], [0, -0.02, 0.015]);
  gem.rotation.z = Math.PI / 4;
  const cap = mesh(new THREE.CylinderGeometry(0.14, 0.2, 0.18, 6), silver(), group);
  cap.position.set(0, 0.56, 0);
  const core = mesh(new THREE.SphereGeometry(0.11, 12, 10), mat('#a9fff4', 0.05, 0.14, { emissive: '#40fff0', emissiveIntensity: 0.85 }), group);
  core.position.set(0, 0.14, 0.12);
  group.add(glow('#16f5ee', 1.8, 2.4, [0, 0.2, 0.5]));
  return group;
}

function medallion(parent, scale = 1) {
  const g = new THREE.Group();
  g.scale.setScalar(scale);
  parent.add(g);
  torus(g, 0.84, 0.044, darkMetal(), [0, 0.04, -0.12]);
  torus(g, 0.77, 0.024, paleGold(), [0, 0.04, -0.035]);
  ornateWing(g, -1, gold());
  ornateWing(g, 1, gold());
  const back = mesh(new THREE.CylinderGeometry(0.51, 0.53, 0.18, 10), darkMetal(), g);
  back.rotation.x = Math.PI / 2;
  back.position.set(0, 0.08, 0.01);
  const coreRing = torus(g, 0.48, 0.055, paleGold(), [0, 0.08, 0.16]);
  const gem = jewel(g, '#8d42ff', [0.41, 0.47, 0.3], [0, 0.08, 0.24], 1);
  gem.rotation.z = Math.PI / 5;
  const crest = jewel(g, '#ffc95f', [0.12, 0.48, 0.1], [0, 0.75, 0.13]);
  crest.rotation.z = Math.PI / 4;
  const tip = jewel(g, '#f1c76d', [0.12, 0.31, 0.1], [0, -0.76, 0.12]);
  tip.rotation.z = Math.PI / 4;
  [-1, 1].forEach(side => {
    const star = jewel(g, '#bd8fff', [0.12, 0.2, 0.08], [side * 1.11, -0.02, 0.1]);
    star.rotation.z = Math.PI / 4;
  });
  g.add(glow('#bb6cff', 2.4, 3.1, [0, 0.1, 0.65]));
  g.add(glow('#ffc878', 1.5, 2.2, [-0.8, 0.7, 0.4]));
  return g;
}

function crystal(parent, color = '#7752df', scale = 0.7) {
  const g = jewel(parent, color, [0.37 * scale, 0.5 * scale, 0.38 * scale], [0, 0, 0]);
  g.rotation.z = Math.PI / 4;
  return g;
}

function buildMedallion(root) {
  const podium = new THREE.Group();
  podium.position.y = -0.04;
  root.add(podium);
  medallion(podium, 0.91);
  const halo = torus(podium, 1.13, 0.012, mat('#a679ff', 0.25, 0.22, { emissive: '#7e42ef', emissiveIntensity: 1.1 }), [0, 0.03, -0.24]);
  halo.rotation.z = -0.12;
  return podium;
}

function buildCollectibles(root) {
  const group = new THREE.Group();
  group.position.set(0, -0.06, 0);
  root.add(group);
  const left = pendant(group, 0.73);
  left.position.set(-1.52, -0.01, 0);
  left.rotation.z = -0.12;
  const center = medallion(group, 0.78);
  center.position.set(0, 0.02, 0.05);
  const right = new THREE.Group();
  right.position.set(1.5, -0.03, 0);
  group.add(right);
  torus(right, 0.42, 0.027, silver(), [0, 0, -0.08], [0.1, -0.4, 0.25]);
  const poly = crystal(right, '#7957df', 1.2);
  poly.scale.set(1.08, 1.12, 0.84);
  right.add(glow('#a879ff', 1.4, 2.3, [0.02, 0.08, 0.35]));
  group.scale.setScalar(0.82);
  return group;
}

function buildOrbital(root) {
  const g = new THREE.Group();
  g.position.y = 0.12;
  root.add(g);
  const orb = mesh(new THREE.SphereGeometry(0.43, 28, 20), mat('#64e7e1', 0.2, 0.17, { emissive: '#078fba', emissiveIntensity: 0.4 }), g);
  orb.position.set(0, 0.18, 0);
  const heart = mesh(new THREE.SphereGeometry(0.25, 18, 14), mat('#7beaff', 0.08, 0.13, { emissive: '#28b8f5', emissiveIntensity: 0.72 }), g);
  heart.position.copy(orb.position);
  torus(g, 0.72, 0.047, silver(), [0, 0.2, 0], [0.94, 0.22, 0.15]);
  torus(g, 0.83, 0.027, teal(), [0, 0.2, 0], [1.26, -0.4, -0.36]);
  torus(g, 0.59, 0.021, mat('#9f83ff', 0.48, 0.19, { emissive: '#7450ff', emissiveIntensity: 0.55 }), [0, 0.2, 0.02], [0.45, 0.88, 0.7]);
  [[0.74, 0.1, 0.27], [-0.5, 0.45, 0.48], [0.22, -0.53, 0.56]].forEach((p, i) => {
    const moon = mesh(new THREE.SphereGeometry(i ? 0.06 : 0.075, 12, 8), i === 1 ? paleGold() : silver(), g);
    moon.position.set(...p);
  });
  const thread = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.36, 8), silver(), g);
  thread.position.set(0, -0.62, 0);
  const drop = jewel(g, '#39ded9', [0.12, 0.28, 0.12], [0, -0.9, 0.04]);
  drop.rotation.z = Math.PI / 4;
  const base = mesh(new THREE.CylinderGeometry(1.2, 1.32, 0.2, 10, 1, false), darkMetal(), g);
  base.position.set(0, -1.25, 0);
  const rim = mesh(new THREE.CylinderGeometry(1.23, 1.31, 0.035, 10), paleGold(), g);
  rim.position.set(0, -1.14, 0);
  const inset = mesh(new THREE.CylinderGeometry(1.02, 1.09, 0.12, 10), mat('#312542', 0.55, 0.29), g);
  inset.position.set(0, -1.08, 0);
  torus(g, 0.55, 0.018, teal(), [0, -0.96, 0], [0, 0, 0]);
  g.add(glow('#24e9df', 2.1, 3.5, [0, -0.25, 0.8]));
  g.add(glow('#8460ff', 1.8, 3, [0.5, 0.5, -0.4]));
  return g;
}

function setCanvasSize() {
  if (!renderer || !canvas || !canvasHost.isConnected) return;
  const rect = canvasHost.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const ratio = Math.min(window.devicePixelRatio || 1, lowPerf ? 1 : 1.5);
  renderer.setPixelRatio(ratio);
  renderer.setSize(Math.round(rect.width), Math.round(rect.height), false);
  activeModel.camera.aspect = rect.width / rect.height;
  activeModel.camera.updateProjectionMatrix();
  draw();
}

function draw() {
  if (!activeModel || !renderer || document.hidden) return;
  renderer.render(activeModel.scene, activeModel.camera);
}

function makeEnvironment() {
  if (environmentMap) return environmentMap;
  const image = document.createElement('canvas');
  image.width = 512;
  image.height = 256;
  const ctx = image.getContext('2d');
  const base = ctx.createLinearGradient(0, 0, 0, 256);
  base.addColorStop(0, '#34425c');
  base.addColorStop(0.45, '#111625');
  base.addColorStop(1, '#171221');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 512, 256);
  [[45, 92, '#65ece1'], [120, 30, '#fff0d0'], [205, 70, '#ab7aff'], [316, 28, '#f5fafc'], [408, 84, '#5edfe1'], [480, 45, '#b992ff']].forEach(([x, width, color]) => {
    const wash = ctx.createLinearGradient(x - width, 0, x + width, 0);
    wash.addColorStop(0, 'rgba(255,255,255,0)');
    wash.addColorStop(0.5, color);
    wash.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = wash;
    ctx.fillRect(x - width, 0, width * 2, 256);
  });
  environmentMap = new THREE.CanvasTexture(image);
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  environmentMap.colorSpace = THREE.SRGBColorSpace;
  environmentMap.needsUpdate = true;
  return environmentMap;
}

function animate(now) {
  frame = 0;
  if (!activeModel || !currentFigure?.classList.contains('is-3d') || document.hidden) return;
  const minFrame = lowPerf ? 1000 / 24 : 1000 / 30;
  if (now - previousTime < minFrame) {
    frame = requestAnimationFrame(animate);
    return;
  }
  const delta = Math.min(0.05, (now - (previousTime || now)) / 1000);
  previousTime = now;
  if (!reducedMotion) {
    const elapsed = now - enteredAt;
    const reveal = Math.min(1, elapsed / 780);
    const ease = 1 - Math.pow(1 - reveal, 3);
    activeModel.group.scale.setScalar(activeModel.baseScale * (0.78 + 0.22 * ease));
    if (!dragged) {
      yaw += delta * 0.07;
      activeModel.group.rotation.y = yaw + Math.sin(now * 0.00032) * 0.055;
    }
    if (elapsed > 900 && lowPerf) {
      draw();
      return;
    }
  }
  draw();
  frame = requestAnimationFrame(animate);
}

function startAnimation() {
  cancelAnimationFrame(frame);
  frame = 0;
  previousTime = 0;
  if (reducedMotion) {
    activeModel.group.scale.setScalar(activeModel.baseScale);
    activeModel.group.rotation.set(pitch, yaw, 0);
    draw();
    return;
  }
  enteredAt = performance.now();
  frame = requestAnimationFrame(animate);
}

function makeRenderer(host) {
  canvas = host.querySelector('canvas');
  if (!canvas) return false;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, premultipliedAlpha: false, antialias: !lowPerf, powerPreference: 'low-power' });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.26;
    renderer.setClearColor(0x000000, 0);
    canvasHost.appendChild(canvas);
    host.appendChild(canvasHost);
    canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); host.classList.remove('is-3d'); cancelAnimationFrame(frame); }, { passive: false });
    canvas.addEventListener('webglcontextrestored', () => activate(currentId, currentFigure), { passive: true });
    return true;
  } catch (error) {
    host.classList.remove('is-3d');
    host.dataset.modelError = String(error && error.message || error).slice(0, 180);
    console.warn('3D scene unavailable; showing the artwork fallback.', error);
    return false;
  }
}

function bindControls(host) {
  const el = canvas;
  el.classList.add('artifact-interactive');
  el.setAttribute('role', 'group');
  el.setAttribute('aria-label', host.dataset.modelLabel + '. Перетаскивайте мышью или пальцем, чтобы вращать. Стрелки поворачивают модель, Home возвращает исходное положение.');
  el.tabIndex = 0;
  el.style.touchAction = 'pan-y pinch-zoom';
  el.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerId = event.pointerId;
    dragged = true;
    lastX = event.clientX;
    lastY = event.clientY;
    cancelAnimationFrame(frame);
    frame = 0;
    try { el.setPointerCapture(pointerId); } catch (_) { /* capture can be unavailable in embedded previews */ }
  }, { passive: true });
  el.addEventListener('pointermove', event => {
    if (pointerId !== event.pointerId || !activeModel) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    yaw += dx * 0.009;
    pitch = THREE.MathUtils.clamp(pitch + dy * 0.007, -0.62, 0.62);
    activeModel.group.rotation.set(pitch, yaw, 0);
    draw();
  }, { passive: true });
  const release = event => {
    if (pointerId !== event.pointerId) return;
    pointerId = null;
    dragged = false;
    if (!lowPerf && !reducedMotion) frame = requestAnimationFrame(animate);
  };
  el.addEventListener('pointerup', release, { passive: true });
  el.addEventListener('pointercancel', release, { passive: true });
  el.addEventListener('keydown', event => {
    const step = event.shiftKey ? 0.24 : 0.1;
    if (event.key === 'Home') { event.preventDefault(); yaw = 0; pitch = 0; activeModel.group.rotation.set(0, 0, 0); draw(); return; }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.key === 'ArrowLeft') yaw -= step;
    if (event.key === 'ArrowRight') yaw += step;
    if (event.key === 'ArrowUp') pitch = THREE.MathUtils.clamp(pitch - step, -0.62, 0.62);
    if (event.key === 'ArrowDown') pitch = THREE.MathUtils.clamp(pitch + step, -0.62, 0.62);
    activeModel.group.rotation.set(pitch, yaw, 0);
    draw();
  });
  el.addEventListener('dblclick', () => { yaw = 0; pitch = 0; activeModel.group.rotation.set(0, 0, 0); draw(); });
}

export function activate(id, host) {
  if (!definitions[id] || !host) return false;
  if (currentId === id && activeModel && canvasHost.isConnected) {
    currentFigure?.classList.remove('is-3d');
    currentFigure = host;
    currentFigure.appendChild(canvasHost);
    currentFigure.classList.add('is-3d');
    startAnimation();
    return true;
  }
  if (!renderer && !makeRenderer(host)) return false;
  cancelAnimationFrame(frame);
  frame = 0;
  currentFigure?.classList.remove('is-3d');
  currentId = id;
  currentFigure = host;
  currentFigure.appendChild(canvasHost);
  currentFigure.classList.add('is-3d');
  if (activeModel) {
    activeModel.scene.traverse(object => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => material.dispose());
    });
  }
  const scene = new THREE.Scene();
  scene.environment = makeEnvironment();
  scene.environmentIntensity = 0.82;
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
  camera.position.set(0, 0.04, id === 'orbital' ? 5.9 : id === 'collectibles' ? 6.2 : 5.35);
  scene.add(new THREE.HemisphereLight('#dbeeff', '#171024', 2.1));
  const key = new THREE.DirectionalLight('#fff1d4', 3.2);
  key.position.set(-3.5, 4.5, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(id === 'orbital' ? '#65f7ee' : '#aa8aff', 2.1);
  fill.position.set(4, 1.5, 3);
  scene.add(fill);
  const rim = new THREE.DirectionalLight('#94c5ff', 2.4);
  rim.position.set(-2, 1, -4);
  scene.add(rim);
  const group = new THREE.Group();
  scene.add(group);
  const baseScale = 1;
  group.scale.setScalar(baseScale);
  activeModel = { scene, camera, group, baseScale };
  yaw = 0;
  pitch = 0;
  dragged = false;
  if (!canvas.dataset.controlsBound) { bindControls(currentFigure); canvas.dataset.controlsBound = '1'; }
  if (window.ResizeObserver) {
    if (!rendererResize) rendererResize = new ResizeObserver(setCanvasSize);
    else rendererResize.disconnect();
    rendererResize.observe(canvasHost);
  } else if (!resizeBound) {
    window.addEventListener('resize', setCanvasSize, { passive: true });
    resizeBound = true;
  }
  try {
    definitions[id](group);
    setCanvasSize();
    startAnimation();
    return true;
  } catch (error) {
    currentFigure.classList.remove('is-3d');
    currentFigure.dataset.modelError = String(error && error.message || error).slice(0, 180);
    console.error('Could not construct the 3D artwork; showing the local poster.', error);
    return false;
  }
}


let rendererResize;
let resizeBound = false;

export function suspend() {
  cancelAnimationFrame(frame);
  frame = 0;
  if (currentFigure?.classList.contains('is-3d')) draw();
}

export function setReducedMotion(value) {
  reducedMotion = Boolean(value);
  if (activeModel) startAnimation();
}
