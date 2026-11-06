/* ===== お知らせ（ここを書き換えるだけで更新できます。新しいものを上に） ===== */
const NEWS = [
  { date: '2026-11-01', tag: 'お知らせ', text: 'ホームページをリニューアルしました。' },
  { date: '2026-11-01', tag: 'イベント', text: 'クラス・イベントのスケジュールは <a href="https://www.instagram.com/inochinomoristyle/" target="_blank" rel="noopener">Instagram（@inochinomoristyle）</a> で更新しています。' },
];

document.addEventListener('DOMContentLoaded', () => {
  // ニュース描画
  const newsEl = document.getElementById('news-list');
  if (newsEl) {
    newsEl.innerHTML = NEWS.map(n => {
      const d = n.date.replace(/-/g, '.');
      const cls = n.tag === 'イベント' ? 'tag event' : 'tag';
      return `<li><time datetime="${n.date}">${d}</time><span class="${cls}">${n.tag}</span><p>${n.text}</p></li>`;
    }).join('');
  }

  // スマホメニュー
  const btn = document.querySelector('.menu-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('.global-nav a').forEach(a =>
      a.addEventListener('click', () => document.body.classList.remove('nav-open')));
  }

  // ヒーロースライダー
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1) {
    let i = 0;
    setInterval(() => {
      slides[i].classList.remove('is-active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-active');
    }, 6000);
  }

  // フェードイン
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.fade').forEach(el => io.observe(el));

  // 画像拡大
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<img alt="">';
  document.body.appendChild(lb);
  lb.addEventListener('click', () => lb.classList.remove('open'));
  document.querySelectorAll('.gallery img, .meal-strip img').forEach(img => {
    img.addEventListener('click', () => {
      lb.querySelector('img').src = img.src;
      lb.querySelector('img').alt = img.alt;
      lb.classList.add('open');
    });
  });

  // ページトップ
  const top = document.querySelector('.pagetop');
  if (top) {
    window.addEventListener('scroll', () => top.classList.toggle('show', scrollY > 600), { passive: true });
    top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // お問い合わせフォーム（Web3Forms）
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const result = document.getElementById('form-result');
      const key = form.querySelector('[name=access_key]').value;
      if (!key || key.startsWith('YOUR_')) {
        result.textContent = '※ フォームは準備中です。お電話またはメールでお問い合わせください。';
        return;
      }
      result.textContent = '送信中です…';
      try {
        const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) });
        const json = await res.json();
        if (json.success) { result.textContent = '送信しました。助産院より折り返しご連絡いたします。'; form.reset(); }
        else throw new Error();
      } catch {
        result.textContent = '送信できませんでした。お手数ですがお電話でご連絡ください。';
      }
    });
  }
});
