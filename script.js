document.addEventListener('DOMContentLoaded', () => {
    // --- 3D СЦЕНА (твой старый код, я его сохранил) ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 200;
        posArray[i+1] = (Math.random() - 0.5) * 100;
        posArray[i+2] = (Math.random() - 0.5) * 100 - 50;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({ size: 0.2, color: 0xff4b2b, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    const torusGeometry = new THREE.TorusGeometry(8, 2, 64, 200);
    const torusMaterial = new THREE.MeshStandardMaterial({ color: 0xff3366, emissive: 0x441122, roughness: 0.3, metalness: 0.7 });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);
    
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

    // --- UI ЭЛЕМЕНТЫ ---
    const mainContent = document.getElementById('mainContent');
    const supportModal = document.getElementById('supportModal');
    const authModal = document.getElementById('authModal');
    const userBtn = document.getElementById('userBtn');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const authFormDiv = document.getElementById('authForm');
    const profileInfoDiv = document.getElementById('profileInfo');
    const profileEmailSpan = document.getElementById('profileEmail');
    const authEmail = document.getElementById('authEmail');
    const authPassword = document.getElementById('authPassword');
    const authMessage = document.getElementById('authMessage');

    // --- Функция показа тостов ---
    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // --- Функция закрытия модалок (клик вне окна) ---
    window.onclick = function(event) {
        if (event.target === supportModal) supportModal.style.display = 'none';
        if (event.target === authModal) authModal.style.display = 'none';
    }

    // --- Поддержка (иконка навбара) ---
    document.getElementById('supportBtn').onclick = (e) => {
        e.preventDefault();
        supportModal.style.display = 'flex';
    }
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.onclick = () => {
            supportModal.style.display = 'none';
            authModal.style.display = 'none';
        }
    });

    // --- Работа с пользователем (localStorage) ---
    function updateAuthUI() {
        const user = localStorage.getItem('svendlc_user');
        if (user) {
            const userData = JSON.parse(user);
            profileEmailSpan.textContent = userData.email;
            authFormDiv.style.display = 'none';
            profileInfoDiv.style.display = 'block';
            userBtn.style.color = '#ff4b2b';
            showToast(`Добро пожаловать, ${userData.email}`);
        } else {
            authFormDiv.style.display = 'block';
            profileInfoDiv.style.display = 'none';
            userBtn.style.color = '#fff';
        }
    }

    // Регистрация / Логин
    authSubmitBtn.onclick = () => {
        const email = authEmail.value.trim();
        const password = authPassword.value.trim();
        if (!email || !password) {
            authMessage.textContent = 'Заполните оба поля';
            return;
        }
        // Проверяем, есть ли пользователь в localStorage
        const users = JSON.parse(localStorage.getItem('svendlc_users') || '{}');
        if (users[email] && users[email].password === password) {
            // Логин
            localStorage.setItem('svendlc_user', JSON.stringify({ email: email, status: users[email].status }));
            authModal.style.display = 'none';
            updateAuthUI();
            authMessage.textContent = '';
        } else if (users[email]) {
            authMessage.textContent = 'Неверный пароль';
        } else {
            // Регистрация нового пользователя
            users[email] = { password: password, status: 'Free', registered: new Date().toISOString() };
            localStorage.setItem('svendlc_users', JSON.stringify(users));
            localStorage.setItem('svendlc_user', JSON.stringify({ email: email, status: 'Free' }));
            authModal.style.display = 'none';
            updateAuthUI();
            authMessage.textContent = '';
        }
        authEmail.value = '';
        authPassword.value = '';
    };

    logoutBtn.onclick = () => {
        localStorage.removeItem('svendlc_user');
        updateAuthUI();
        showToast('Вы вышли из аккаунта');
        authModal.style.display = 'none';
    };

    userBtn.onclick = (e) => {
        e.preventDefault();
        updateAuthUI(); // Обновляем UI на случай, если данные где-то изменились
        authModal.style.display = 'flex';
    }

    // --- РОУТИНГ И АНИМАЦИЯ ПЕРЕХОДОВ ---
    const pages = {
        home: `
            <div class="hero">
                <h1 class="glitch" data-text="SvenDLC">SvenDLC</h1>
                <p class="tagline">Премиум чит для Minecraft 1.16.5</p>
                <div class="hero-buttons">
                    <button class="btn btn-primary" id="downloadNavBtn"><i class="fas fa-download"></i> Скачать</button>
                    <button class="btn btn-secondary" id="featuresNavBtn"><i class="fas fa-eye"></i> Возможности</button>
                </div>
            </div>
        `,
        features: `
            <div class="features">
                <h2>Возможности</h2>
                <div class="features-grid">
                    <div class="feature-card"><i class="fas fa-shield-alt"></i><h3>Анти-бан</h3><p>Обход серверной защиты</p></div>
                    <div class="feature-card"><i class="fas fa-tachometer-alt"></i><h3>2000+ FPS</h3><p>Максимальная оптимизация</p></div>
                    <div class="feature-card"><i class="fas fa-eye"></i><h3>ESP / X-Ray</h3><p>Подсветка игроков и сундуков</p></div>
                    <div class="feature-card"><i class="fas fa-crosshairs"></i><h3>Aimbot</h3><p>Идеальное наведение</p></div>
                    <div class="feature-card"><i class="fas fa-cogs"></i><h3>Модульность</h3><p>Включай только нужное</p></div>
                    <div class="feature-card"><i class="fas fa-chart-line"></i><h3>Статистика</h3><p>K/D, убийства, смерти</p></div>
                </div>
            </div>
        `,
        download: `
            <div class="download-section">
                <div class="download-card">
                    <i class="fas fa-download" style="font-size: 4rem; color: #ff4b2b;"></i>
                    <h2>Скачать SvenDLC</h2>
                    <p>Версия 1.1.0 для Minecraft 1.16.5</p>
                    <button class="btn btn-primary download-btn" id="realDownloadBtn"><i class="fas fa-file-archive"></i> Скачать (JAR)</button>
                </div>
            </div>
        `
    };

    function loadPage(pageName) {
        if (!pages[pageName]) pageName = 'home';
        mainContent.style.opacity = '0';
        setTimeout(() => {
            mainContent.innerHTML = pages[pageName];
            mainContent.style.opacity = '1';
            // Переназначаем обработчики для кнопок внутри динамического контента
            if (pageName === 'home') {
                const downloadNavBtn = document.getElementById('downloadNavBtn');
                const featuresNavBtn = document.getElementById('featuresNavBtn');
                if (downloadNavBtn) downloadNavBtn.onclick = () => loadPage('download');
                if (featuresNavBtn) featuresNavBtn.onclick = () => loadPage('features');
            }
            if (pageName === 'download') {
                const realDownloadBtn = document.getElementById('realDownloadBtn');
                if (realDownloadBtn) realDownloadBtn.onclick = () => {
                    showToast('Скачивание начнется...');
                    setTimeout(() => {
                        window.location.href = 'https://github.com/anna62553gar-arch/SvenDLC/releases/download/v1.0/SvenDLC.jar';
                    }, 500);
                };
            }
        }, 150);
    }

    // Обработка кликов по навбару
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            loadPage(page);
        };
    });

    // Стартовая страница
    loadPage('home');
    updateAuthUI();
});