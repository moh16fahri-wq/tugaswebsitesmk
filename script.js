// ========== SMKN 1 GONDANG NGANJUK - PHOTO UPLOAD JAVASCRIPT ==========

// ==================== STORAGE ====================
// Simpan foto di memori sesi (tidak persisten karena localStorage tidak support blob besar)
let galleryImages = []; // { src, caption }
let currentLightboxIndex = 0;
let currentAvatarSrc = null;

// Data Testimoni
let testimoniData = JSON.parse(localStorage.getItem('testimoniSMKN1')) || [
    {
        nama: 'Budi Santoso',
        kategori: 'Alumni TKJ 2020',
        pesan: 'Setelah lulus dari SMKN 1 Gondang jurusan TKJ, saya langsung diterima bekerja di perusahaan IT ternama.',
        tanggal: '2024-01-15',
        avatar: null
    },
    {
        nama: 'Siti Aminah',
        kategori: 'Alumni Akuntansi 2019',
        pesan: 'Guru-guru di SMKN 1 Gondang sangat kompeten dan peduli dengan masa depan siswa.',
        tanggal: '2024-01-10',
        avatar: null
    },
    {
        nama: 'Ahmad Rizki',
        kategori: 'Alumni Multimedia 2021',
        pesan: 'Fasilitas lab multimedia yang lengkap membantu saya mengembangkan skill desain.',
        tanggal: '2024-01-05',
        avatar: null
    }
];

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderTestimoni();
    renderGallery();
    initScrollBehavior();
});

// ==================== NAVIGATION ====================
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.querySelector('.menu-toggle');
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

function scrollToSection(id) {
    const element = document.getElementById(id);
    if (!element) return;
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    document.getElementById('navMenu').classList.remove('active');
    document.querySelector('.menu-toggle').classList.remove('active');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initScrollBehavior() {
    window.addEventListener('scroll', () => {
        const scrollTop = document.getElementById('scrollTop');
        if (window.pageYOffset > 300) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });
}

// ==================== LOGO UPLOAD ====================
function triggerLogoUpload() {
    document.getElementById('logoUploadInput').click();
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const logoIcon = document.getElementById('logoIcon');
        logoIcon.innerHTML = `<img src="${e.target.result}" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    };
    reader.readAsDataURL(file);
}

// ==================== HERO BACKGROUND UPLOAD ====================
function triggerHeroBgUpload() {
    document.getElementById('heroBgInput').click();
}

function handleHeroBgUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const hero = document.querySelector('.hero');
        hero.style.backgroundImage = `url('${e.target.result}')`;
        hero.style.backgroundSize = 'cover';
        hero.style.backgroundPosition = 'center';
        // Tambahkan overlay agar teks tetap terbaca
        hero.style.setProperty('--hero-overlay', 'rgba(15,118,110,0.75)');
    };
    reader.readAsDataURL(file);
}

// ==================== HERO IMAGE UPLOAD ====================
function triggerHeroImgUpload() {
    document.getElementById('heroImgInput').click();
}

function handleHeroImgUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const heroImg = document.getElementById('heroImg');
        heroImg.src = e.target.result;
        heroImg.style.animation = 'none';
        heroImg.style.borderRadius = '20px';
        heroImg.style.maxHeight = '400px';
        heroImg.style.width = '100%';
        heroImg.style.objectFit = 'cover';
    };
    reader.readAsDataURL(file);
}

// ==================== ABOUT IMAGE UPLOAD ====================
function triggerAboutImgUpload() {
    document.getElementById('aboutImgInput').click();
}

function handleAboutImgUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('aboutImg').src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ==================== PROGRAM ICON UPLOAD ====================
function triggerProgramIconUpload(id) {
    document.getElementById(`programIconInput_${id}`).click();
}

function handleProgramIconUpload(event, id) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.getElementById(`programIcon_${id}`);
        const emoji = document.getElementById(`programEmoji_${id}`);
        img.src = e.target.result;
        img.style.display = 'block';
        if (emoji) emoji.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// ==================== FACILITY PHOTO UPLOAD ====================
function triggerFacilityUpload(id) {
    document.getElementById(`facilityInput_${id}`).click();
}

function handleFacilityUpload(event, id) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const bg = document.getElementById(`facilityBg_${id}`);
        const card = bg.closest('.facility-card');
        bg.style.backgroundImage = `url('${e.target.result}')`;
        bg.classList.add('has-photo');
        card.classList.add('has-photo-card');
    };
    reader.readAsDataURL(file);
}

// ==================== GALLERY BATCH UPLOAD ====================
function handleGalleryBatchUpload(event) {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    let loaded = 0;
    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            galleryImages.push({
                src: e.target.result,
                caption: file.name.replace(/\.[^.]+$/, ''),
                id: Date.now() + index
            });
            loaded++;
            if (loaded === files.length) {
                renderGallery();
            }
        };
        reader.readAsDataURL(file);
    });

    // Reset input so same files can be re-uploaded
    event.target.value = '';
}

function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    if (galleryImages.length === 0) {
        grid.innerHTML = `
            <div class="gallery-empty">
                <span class="gallery-empty-icon">🖼️</span>
                <p style="font-size:1.125rem; font-weight:600; margin-bottom:0.5rem;">Galeri Masih Kosong</p>
                <p>Klik tombol "Upload Foto Galeri" di atas untuk menambahkan foto kegiatan sekolah</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = galleryImages.map((img, idx) => `
        <div class="gallery-item" style="animation: fadeIn 0.4s ease ${idx * 0.05}s both;">
            <img src="${img.src}" alt="${img.caption}" loading="lazy">
            <div class="gallery-item-overlay">
                <span>📸 ${img.caption}</span>
            </div>
            <button class="gallery-delete-btn" onclick="deleteGalleryItem(event, ${img.id})" title="Hapus foto">✕</button>
        </div>
    `).join('');

    // Add click to open lightbox
    grid.querySelectorAll('.gallery-item').forEach((item, idx) => {
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-delete-btn')) return;
            openLightbox(idx);
        });
    });
}

function deleteGalleryItem(event, id) {
    event.stopPropagation();
    if (!confirm('Hapus foto ini dari galeri?')) return;
    galleryImages = galleryImages.filter(img => img.id !== id);
    renderGallery();
}

// ==================== LIGHTBOX ====================
function openLightbox(index) {
    currentLightboxIndex = index;
    const img = galleryImages[index];
    document.getElementById('lightboxImg').src = img.src;
    document.getElementById('lightboxCaption').textContent = `${img.caption} (${index + 1}/${galleryImages.length})`;
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function lightboxNav(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + galleryImages.length) % galleryImages.length;
    openLightbox(currentLightboxIndex);
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
});

// ==================== AVATAR UPLOAD (Contact Form) ====================
function triggerAvatarUpload() {
    document.getElementById('avatarInput').click();
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        currentAvatarSrc = e.target.result;
        const preview = document.getElementById('avatarPreview');
        preview.innerHTML = `<img src="${e.target.result}" alt="Avatar">`;
    };
    reader.readAsDataURL(file);
}

// ==================== CONTACT FORM -> TESTIMONI ====================
function handleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    const newTestimoni = {
        nama: name,
        kategori: 'Pengunjung / Calon Siswa',
        pesan: message,
        tanggal: new Date().toISOString().split('T')[0],
        avatar: currentAvatarSrc || null
    };

    testimoniData.push(newTestimoni);

    // Simpan ke localStorage (tanpa avatar untuk menghemat space)
    const forStorage = testimoniData.map(t => ({ ...t, avatar: null }));
    try { localStorage.setItem('testimoniSMKN1', JSON.stringify(forStorage)); } catch(e) {}

    renderTestimoni();

    alert(`Terima kasih ${name}! Pesan Anda telah kami terima dan ditampilkan di bagian testimoni.`);
    event.target.reset();

    // Reset avatar
    currentAvatarSrc = null;
    document.getElementById('avatarPreview').innerHTML = '👤';

    document.querySelector('.testimonials').scrollIntoView({ behavior: 'smooth' });
}

// ==================== TESTIMONI ====================
function renderTestimoni() {
    const container = document.getElementById('testimonialGrid');
    if (!container) return;

    const latestTestimoni = [...testimoniData].reverse().slice(0, 3);

    container.innerHTML = latestTestimoni.map(t => {
        const avatarContent = t.avatar
            ? `<img src="${t.avatar}" alt="${t.nama}">`
            : `<span style="font-size:1.5rem;color:white;">${t.nama.charAt(0).toUpperCase()}</span>`;

        return `
        <div class="testimonial-card" style="animation: fadeIn 0.5s ease forwards;">
            <div class="testimonial-header">
                <div class="testimonial-avatar">${avatarContent}</div>
                <div class="testimonial-info">
                    <h4>${t.nama}</h4>
                    <p>${t.kategori}</p>
                </div>
            </div>
            <p class="testimonial-text">"${t.pesan}"</p>
            <div class="rating">⭐⭐⭐⭐⭐</div>
        </div>
    `}).join('');
}

// ==================== PROGRAM DETAIL ====================
function showProgramDetail(program) {
    const programDetails = {
        'TKJ': {
            title: 'Teknik Komputer & Jaringan',
            icon: '💻',
            description: 'Fokus pada instalasi, konfigurasi, dan pemeliharaan sistem jaringan komputer.',
            skills: ['Mikrotik & Cisco', 'Linux Server Administration', 'Cyber Security', 'Cloud Computing'],
            career: ['IT Support', 'Network Engineer', 'System Administrator', 'Wirausaha IT'],
            certification: ['CCNA (Cisco)', 'BNSP', 'Mikrotik MTCNA']
        },
        'TSM': {
            title: 'Teknik Sepeda Motor',
            icon: '🏍️',
            description: 'Menguasai teknologi motor injeksi modern dan manajemen bengkel profesional.',
            skills: ['Engine Tune Up', 'Sistem Injeksi EFI', 'Chassis & Suspensi', 'Kelistrikan Motor'],
            career: ['Mekanik Profesional', 'Wirausaha Bengkel', 'Service Advisor', 'Teknisi Dealer'],
            certification: ['Sertifikat Honda/AHASS', 'Sertifikat Yamaha', 'BNSP']
        },
        'TKR': {
            title: 'Teknik Kendaraan Ringan',
            icon: '🚗',
            description: 'Ahli dalam perawatan, perbaikan, dan diagnosa kendaraan roda empat modern.',
            skills: ['Engine Overhoul', 'Sistem AC Mobil', 'Chasis & Pemindah Tenaga', 'Diagnosa OBD'],
            career: ['Mekanik Mobil', 'Teknisi Dealer', 'Wirausaha Bengkel', 'Inspector Kendaraan'],
            certification: ['Sertifikat Toyota', 'Sertifikat Daihatsu', 'BNSP']
        },
        'APHP': {
            title: 'Agribisnis Pengolahan Pangan Hasil Pertanian',
            icon: '🍞',
            description: 'Mengolah hasil pertanian menjadi produk pangan berkualitas dan bernilai ekonomi tinggi.',
            skills: ['Teknologi Pengolahan Pangan', 'Quality Control & GMP', 'Packaging & Labeling', 'Food Safety HACCP'],
            career: ['Teknolog Pangan', 'Quality Inspector', 'Wirausaha Pangan', 'Staff Produksi Industri'],
            certification: ['Sertifikat HACCP', 'BNSP Pengolahan Pangan']
        },
        'ATU': {
            title: 'Agribisnis Ternak Unggas',
            icon: '🐔',
            description: 'Mengelola peternakan unggas komersial dengan teknologi dan manajemen modern.',
            skills: ['Budidaya Ayam Broiler & Layer', 'Kesehatan & Vaksinasi Ternak', 'Manajemen Pakan & Nutrisi', 'Manajemen Kandang Modern'],
            career: ['Peternak Mandiri', 'Supervisor Peternakan', 'Field Technical Service', 'Wirausaha Peternakan'],
            certification: ['Sertifikat Kompetensi Peternak', 'BNSP']
        },
        'ATPH': {
            title: 'Agribisnis Tanaman Pangan & Hortikultura',
            icon: '🌾',
            description: 'Budidaya tanaman pangan dan hortikultura secara modern, organik, dan berkelanjutan.',
            skills: ['Budidaya Tanaman Padi & Palawija', 'Hidroponik & Aquaponik', 'Pengendalian Hama Terpadu', 'Agribisnis & Pemasaran'],
            career: ['Petani Modern', 'Penyuluh Pertanian', 'Wirausaha Agribisnis', 'Konsultan Pertanian'],
            certification: ['Sertifikat Pertanian Organik', 'BNSP']
        }
    };

    const detail = programDetails[program];
    if (!detail) return;

    const modal = document.createElement('div');
    modal.className = 'program-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.85); display: flex; align-items: center;
        justify-content: center; z-index: 10000; padding: 20px;
        animation: fadeIn 0.2s ease;
    `;

    modal.innerHTML = `
        <div style="background: white; border-radius: 20px; max-width: 600px; width: 100%; padding: 2rem; position: relative; max-height: 90vh; overflow-y: auto;">
            <button onclick="this.closest('.program-modal').remove()" style="position: absolute; right: 20px; top: 20px; font-size: 2rem; border: none; background: none; cursor: pointer; line-height:1;">&times;</button>
            <div style="font-size: 3rem; margin-bottom: 1rem;">${detail.icon}</div>
            <h2 style="color: #0f766e; margin-bottom: 1rem; padding-right: 2rem;">${detail.title}</h2>
            <p style="color: #64748b; margin-bottom: 1.5rem;">${detail.description}</p>
            <h4 style="margin-bottom: 0.75rem; color: #0f172a;">✅ Kompetensi Utama:</h4>
            <ul style="margin-bottom: 1.5rem; padding-left: 20px; color: #64748b;">
                ${detail.skills.map(s => `<li style="margin-bottom:6px;">${s}</li>`).join('')}
            </ul>
            <h4 style="margin-bottom: 0.75rem; color: #0f172a;">💼 Peluang Karir:</h4>
            <ul style="margin-bottom: 1.5rem; padding-left: 20px; color: #64748b;">
                ${detail.career.map(c => `<li style="margin-bottom:6px;">${c}</li>`).join('')}
            </ul>
            <h4 style="margin-bottom: 0.75rem; color: #0f172a;">🏆 Sertifikasi:</h4>
            <ul style="margin-bottom: 1.5rem; padding-left: 20px; color: #64748b;">
                ${detail.certification.map(cert => `<li style="margin-bottom:6px;">${cert}</li>`).join('')}
            </ul>
            <button onclick="this.closest('.program-modal').remove()" class="btn btn-primary" style="
                width:100%; background: linear-gradient(135deg,#0f766e,#0891b2);
                color:white; font-size:1rem; padding: 0.875rem;
            ">Tutup</button>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}