(function () {
  'use strict';

  var canvas = document.getElementById('bottle-canvas');
  var section = document.getElementById('bottle-demo');
  if (!canvas || !section) return;

  var SCRIPTS = [
    'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js',
    'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js',
    'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js',
  ];

  var scriptsLoaded = false;
  var isVisible = false;
  var rafId = null;

  // Load Three.js + GSAP only when section is 300px away from viewport
  var loadObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !scriptsLoaded) {
      scriptsLoaded = true;
      loadObserver.disconnect();
      loadSequential(SCRIPTS, initScene);
    }
  }, { rootMargin: '300px 0px' });

  loadObserver.observe(section);

  function loadSequential(srcs, done) {
    var i = 0;
    (function next() {
      if (i >= srcs.length) { done(); return; }
      var s = document.createElement('script');
      s.src = srcs[i++];
      s.onload = next;
      document.head.appendChild(s);
    })();
  }

  function initScene() {
    gsap.registerPlugin(ScrollTrigger);

    var BASE_W = 360, BASE_H = 540;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(BASE_W, BASE_H);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, BASE_W / BASE_H, 0.1, 50);
    camera.position.set(0, 0.3, 5.5);

    // Three-point lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    var key = new THREE.DirectionalLight(0xfff8e0, 2.5);
    key.position.set(4, 6, 4);
    scene.add(key);

    var fill = new THREE.DirectionalLight(0x8aaeff, 1.0);
    fill.position.set(-4, 1, 3);
    scene.add(fill);

    var rim = new THREE.DirectionalLight(0xffffff, 1.8);
    rim.position.set(0, -4, -3);
    scene.add(rim);

    // Materials
    var glassMat = new THREE.MeshStandardMaterial({ color: 0x1b4a20, roughness: 0.04, metalness: 0.08 });
    var corkMat  = new THREE.MeshStandardMaterial({ color: 0xe2c98a, roughness: 0.95, metalness: 0 });
    var foilMat  = new THREE.MeshStandardMaterial({ color: 0xc0a020, roughness: 0.3,  metalness: 0.7 });
    var labelMat = new THREE.MeshStandardMaterial({ color: 0xf5edd0, roughness: 0.85, metalness: 0 });

    // Bottle geometry — reduced segment counts vs v1
    var bottle = new THREE.Group();

    function addCyl(rTop, rBot, h, y, mat, segs) {
      var mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, segs || 32), mat);
      mesh.position.y = y;
      bottle.add(mesh);
    }

    addCyl(0.36,  0.36,  0.06,  -1.47,  glassMat);       // base
    addCyl(0.36,  0.36,  1.80,  -0.57,  glassMat);       // body
    addCyl(0.175, 0.36,  0.45,   0.555, glassMat);       // shoulder
    addCyl(0.175, 0.175, 0.85,   0.955, glassMat);       // neck
    addCyl(0.210, 0.210, 0.28,   1.44,  foilMat, 24);    // foil cap
    addCyl(0.195, 0.175, 0.08,   1.59,  glassMat, 24);   // lip
    addCyl(0.105, 0.105, 0.22,   1.72,  corkMat, 16);    // cork

    var labelMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.365, 0.365, 0.9, 32, 1, true, -1.1, 2.2),
      labelMat
    );
    labelMesh.position.y = -0.55;
    bottle.add(labelMesh);

    scene.add(bottle);

    // Scroll-driven rotation
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
      y: 0.12, yoyo: true, repeat: -1, duration: 2.5, ease: 'sine.inOut',
    });

    // Pause RAF when canvas is off-screen — saves GPU when user isn't watching
    var visObserver = new IntersectionObserver(function (entries) {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !rafId) loop();
    }, { threshold: 0.01 });
    visObserver.observe(canvas);

    function loop() {
      if (!isVisible) { rafId = null; return; }
      rafId = requestAnimationFrame(loop);
      renderer.render(scene, camera);
    }

    // Responsive resize
    function resize() {
      var w = Math.min(canvas.parentElement.clientWidth - 32, 420);
      var h = Math.round(w * (BASE_H / BASE_W));
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();
  }
})();
