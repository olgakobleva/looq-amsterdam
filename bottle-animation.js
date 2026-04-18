(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  const canvas = document.getElementById('bottle-canvas');
  if (!canvas || !window.THREE) return;

  const BASE_W = 360;
  const BASE_H = 540;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(BASE_W, BASE_H);

  // Scene + camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, BASE_W / BASE_H, 0.1, 50);
  camera.position.set(0, 0.3, 5.5);

  // Lighting — three-point setup
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const key = new THREE.DirectionalLight(0xfff8e0, 2.5);
  key.position.set(4, 6, 4);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x8aaeff, 1.0);
  fill.position.set(-4, 1, 3);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xffffff, 1.8);
  rim.position.set(0, -4, -3);
  scene.add(rim);

  // Materials
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x1b4a20,
    roughness: 0.04,
    metalness: 0.08,
  });

  const corkMat = new THREE.MeshStandardMaterial({
    color: 0xe2c98a,
    roughness: 0.95,
    metalness: 0,
  });

  const foilMat = new THREE.MeshStandardMaterial({
    color: 0xc0a020,
    roughness: 0.3,
    metalness: 0.7,
  });

  const labelMat = new THREE.MeshStandardMaterial({
    color: 0xf5edd0,
    roughness: 0.85,
    metalness: 0,
  });

  // Bottle group
  const bottle = new THREE.Group();

  function addCyl(rTop, rBot, height, y, mat, segs) {
    segs = segs || 48;
    var geo = new THREE.CylinderGeometry(rTop, rBot, height, segs);
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = y;
    bottle.add(mesh);
    return mesh;
  }

  // Base disc
  addCyl(0.36, 0.36, 0.06, -1.47, glassMat);
  // Body
  addCyl(0.36, 0.36, 1.80, -0.57, glassMat);
  // Shoulder taper
  addCyl(0.175, 0.36, 0.45, 0.555, glassMat);
  // Neck
  addCyl(0.175, 0.175, 0.85, 0.955, glassMat);
  // Foil cap
  addCyl(0.210, 0.210, 0.28, 1.44, foilMat, 32);
  // Lip ring
  addCyl(0.195, 0.175, 0.08, 1.59, glassMat, 32);
  // Cork
  addCyl(0.105, 0.105, 0.22, 1.72, corkMat, 24);

  // Label — curved cylinder segment on front half
  var labelGeo = new THREE.CylinderGeometry(0.365, 0.365, 0.9, 48, 1, true, -1.1, 2.2);
  var labelMesh = new THREE.Mesh(labelGeo, labelMat);
  labelMesh.position.y = -0.55;
  bottle.add(labelMesh);

  scene.add(bottle);

  // Scroll-driven rotation — full 360° over the section height
  gsap.to(bottle.rotation, {
    y: Math.PI * 2,
    ease: 'none',
    scrollTrigger: {
      trigger: '#bottle-demo',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
    },
  });

  // Ambient float
  gsap.to(bottle.position, {
    y: 0.12,
    yoyo: true,
    repeat: -1,
    duration: 2.5,
    ease: 'sine.inOut',
  });

  // Render loop
  (function loop() {
    requestAnimationFrame(loop);
    renderer.render(scene, camera);
  })();

  // Responsive canvas
  function resize() {
    var parent = canvas.parentElement;
    var w = Math.min(parent.clientWidth - 32, 420);
    var h = Math.round(w * (BASE_H / BASE_W));
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();
})();
