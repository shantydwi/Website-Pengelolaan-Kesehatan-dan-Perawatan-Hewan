// =================== LOGIN & REGISTER ===================
function toggleForms(show) {
  document.getElementById('loginCard').style.display = show === 'login' ? 'block' : 'none';
  document.getElementById('registerCard').style.display = show === 'register' ? 'block' : 'none';
}

function register(event) {
  event.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value.trim();

  let users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.some(user => user.email === email)) return alert('Email sudah terdaftar!');

  const newUser = { name, email, password, role: "user" };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('activeUser', JSON.stringify(newUser));
  alert('Pendaftaran berhasil!');
  toggleForms('login');
}

function login(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) return alert("Email dan password wajib diisi.");

  if (email === "admin@petcare.com" && password === "admin123") {
    const adminUser = { name: "Admin", email, role: "admin" };
    localStorage.setItem("activeUser", JSON.stringify(adminUser));
    alert("Login admin berhasil!");
    return window.location.href = "admin.html";
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const matchedUser = users.find(u => u.email === email && u.password === password);

  if (!matchedUser) return alert("Email atau password salah.");

  localStorage.setItem("activeUser", JSON.stringify(matchedUser));
  alert("Login berhasil!");
  window.location.href = "beranda.html";
}

function logout() {
  localStorage.removeItem("activeUser");
  window.location.href = "login.html";
}

// =================== NAVIGASI ===================
function showSection(sectionId) {
  const sections = ['berandaSection', 'artikelSection', 'forumSection', 'adopsiSection', 'kontakSection'];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (id === sectionId) ? 'block' : 'none';
  });
}

function showUserName() {
  const user = JSON.parse(localStorage.getItem("activeUser"));
  if (user && document.getElementById("userName")) {
    document.getElementById("userName").textContent = user.name;
  }
}

// =================== FORUM ===================
function initForumPosts() {
  if (!localStorage.getItem("forumPosts")) {
    const defaultPosts = [
      {
        id: 1,
        title: "Bagaimana cara merawat kucing yang baru diadopsi?",
        body: "Tips merawat kucing...",
        comments: []
      },
      {
        id: 2,
        title: "Apa yang harus dilakukan jika anjing saya terlihat lesu?",
        body: "Tips anjing lesu...",
        comments: []
      }
    ];
    localStorage.setItem("forumPosts", JSON.stringify(defaultPosts));
  }
}

function renderForumPosts() {
  const posts = JSON.parse(localStorage.getItem("forumPosts")) || [];
  const container = document.querySelector(".forum-category");
  if (!container) return;

  container.innerHTML = "<h3>Pertanyaan & Jawaban</h3>";

  posts.forEach(post => {
    const postDiv = document.createElement("div");
    postDiv.className = "forum-post";
    postDiv.id = `post${post.id}`;

    let commentsHTML = "";
    post.comments.forEach((c, i) => {
      commentsHTML += `
        <div class="comment">
          ${c}
          <button onclick="deleteComment(${post.id}, ${i})">Hapus</button>
        </div>`;
    });

    postDiv.innerHTML = `
      <h4>${post.title}</h4>
      <p>${post.body}</p>
      <button onclick="deletePost(${post.id})">Hapus Postingan</button>
      <div class="comment-section">
        <textarea id="commentInput${post.id}" placeholder="Tulis komentar..."></textarea>
        <button onclick="addComment(${post.id})">Kirim Komentar</button>
        <div class="comments" id="comments${post.id}">
          ${commentsHTML}
        </div>
      </div>
    `;
    container.appendChild(postDiv);
  });
}

function addNewPost() {
  const title = document.getElementById("newPostTitle").value.trim();
  const body = document.getElementById("newPostBody").value.trim();
  if (!title || !body) return alert("Judul dan isi pertanyaan tidak boleh kosong.");

  const posts = JSON.parse(localStorage.getItem("forumPosts")) || [];
  posts.push({ id: Date.now(), title, body, comments: [] });
  localStorage.setItem("forumPosts", JSON.stringify(posts));
  renderForumPosts();
  document.getElementById("newPostTitle").value = "";
  document.getElementById("newPostBody").value = "";
}

function addComment(postId) {
  const input = document.getElementById(`commentInput${postId}`);
  const text = input.value.trim();
  if (!text) return alert("Komentar tidak boleh kosong.");

  const posts = JSON.parse(localStorage.getItem("forumPosts")) || [];
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.comments.push(text);
    localStorage.setItem("forumPosts", JSON.stringify(posts));
    renderForumPosts();
  }
}

function deleteComment(postId, index) {
  const posts = JSON.parse(localStorage.getItem("forumPosts")) || [];
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.comments.splice(index, 1);
    localStorage.setItem("forumPosts", JSON.stringify(posts));
    renderForumPosts();
  }
}

function deletePost(postId) {
  const posts = JSON.parse(localStorage.getItem("forumPosts")) || [];
  const updated = posts.filter(p => p.id !== postId);
  localStorage.setItem("forumPosts", JSON.stringify(updated));
  renderForumPosts();
}

// =================== KONSULTASI / PESAN ===================
function renderPesan() {
  const pesanList = JSON.parse(localStorage.getItem("pesanKonsultasi") || "[]");
  const list = document.getElementById("pesanList");
  if (!list) return;

  list.innerHTML = '';
  if (pesanList.length === 0) {
    list.innerHTML = "<li>Belum ada pesan masuk.</li>";
    return;
  }

  pesanList.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${p.nama}</strong> (${p.email})<br/><em>${p.teks}</em>`;
    li.style = "background: #f0f8ff; margin-bottom: 10px; padding: 10px; border-left: 4px solid #007BFF;";
    list.appendChild(li);
  });
}

function simpanPesan(event) {
  event.preventDefault();
  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const teks = document.getElementById("pesan").value.trim();

  if (!nama || !email || !teks) return alert("Semua kolom wajib diisi.");

  const pesanList = JSON.parse(localStorage.getItem("pesanKonsultasi") || "[]");
  pesanList.push({ nama, email, teks });
  localStorage.setItem("pesanKonsultasi", JSON.stringify(pesanList));

  document.getElementById("formKontak").reset();
  renderPesan();
  alert("Pesan berhasil dikirim!");
}

// =================== ADOPSI ===================
function ajukanAdopsi(namaHewan) {
  const email = prompt("Masukkan Email Anda:");
  if (!email) return alert("Email wajib diisi.");

  const data = JSON.parse(localStorage.getItem("adopsiData") || "[]");
  data.push({ email, hewan: namaHewan, status: "Menunggu" });
  localStorage.setItem("adopsiData", JSON.stringify(data));
  alert(`Permintaan adopsi untuk ${namaHewan} berhasil diajukan!`);
  renderHewanAdopsi();
}

function renderHewanAdopsi() {
  const container = document.getElementById("adopsiContainer");
  if (!container) return;
  container.innerHTML = "";

  const daftarHewan = [
    { nama: "Milo", usia: "1 tahun", gambar: "kucing1.jpg" },
    { nama: "Buddy", usia: "2 tahun", gambar: "anjing1.jpg" },
    { nama: "Lili", usia: "8 bulan", gambar: "kelinci1.jpg" },
    { nama: "Tom", usia: "3 tahun", gambar: "kucing2.jpg" },
    { nama: "Choco", usia: "5 bulan", gambar: "hamster1.jpg" },
    { nama: "Max", usia: "1,5 tahun", gambar: "anjing2.jpg" },
    { nama: "Luna", usia: "2 tahun", gambar: "otter1.jpg" },
    { nama: "Nemo", usia: "6 bulan", gambar: "ikan1.jpg" },
    { nama: "Sky", usia: "1 tahun", gambar: "burung1.jpg" },
    { nama: "Shelly", usia: "4 tahun", gambar: "kura1.jpg" }
  ];

  const adopsiData = JSON.parse(localStorage.getItem("adopsiData") || "[]");
  const hewanTeradopsi = adopsiData.filter(a => a.status === "Selesai").map(a => a.hewan);

  daftarHewan.forEach(h => {
    if (hewanTeradopsi.includes(h.nama)) return;
    container.innerHTML += `
      <div class="hewan-card">
        <img src="${h.gambar}" alt="${h.nama}">
        <div class="hewan-info">
          <h3>${h.nama}</h3>
          <p>Usia: ${h.usia}</p>
          <button class="btn-adopsi" onclick="ajukanAdopsi('${h.nama}')">Adopsi</button>
        </div>
      </div>
    `;
  });
}

// =================== INISIALISASI ===================
document.addEventListener("DOMContentLoaded", () => {
  showUserName();
  if (document.getElementById("formKontak")) {
    document.getElementById("formKontak").addEventListener("submit", simpanPesan);
  }
  if (document.querySelector(".forum-category")) {
    initForumPosts();
    renderForumPosts();
  }
  renderPesan();
  renderHewanAdopsi();
});
