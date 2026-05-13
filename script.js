document.addEventListener('DOMContentLoaded', () => {
    // 3D фон
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Группа частиц
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 200;
        posArray[i+1] = (Math.random() - 0.5) * 100;
        posArray[i+2] = (Math.random() - 0.5) * 100 - 50;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        color: 0xff4b2b,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Тор
    const torusGeometry = new THREE.TorusGeometry(8, 2, 64, 200);
    const torusMaterial = new THREE.MeshStandardMaterial({ color: 0xff3366, emissive: 0x441122, roughness: 0.3, metalness: 0.7 });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);
    
    // Освещение
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xff4b2b, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    const pointLight2 = new THREE.PointLight(0xff416c, 0.5);
    pointLight2.position.set(-10, 5, 10);
    scene.add(pointLight2);
    
    camera.position.z = 30;
    camera.position.y = 5;
    
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    
    function animate() {
        requestAnimationFrame(animate);
        
        torus.rotation.x += 0.003;
        torus.rotation.y += 0.005;
        torus.rotation.z += 0.002;
        
        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0003;
        
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Тосты
    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
    
    document.getElementById('downloadBtn').addEventListener('click', () => {
        showToast('Скачивание начнется через секунду...');
        setTimeout(() => {
            window.location.href = '#';
        }, 1000);
    });
    
    document.getElementById('licenseBtn').addEventListener('click', () => {
        showToast('Форма активации будет доступна позже');
    });
});
