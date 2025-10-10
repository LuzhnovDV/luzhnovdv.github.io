/* script.js
   Fill in WEBHOOK_URL with your n8n webhook URL.
   The form sends JSON { name, email, message, timestamp } via fetch POST.
*/
const PRELOADER_MIN = 600; // ms minimum visible

document.addEventListener('DOMContentLoaded', () => {
  // preloader logic
  const pre = document.getElementById('preloader');
  const start = performance.now();
  window.setTimeout(() => {
    const elapsed = performance.now() - start;
    const remaining = Math.max(0, PRELOADER_MIN - elapsed);
    setTimeout(() => {
      pre.style.opacity = '0';
      pre.style.pointerEvents = 'none';
      setTimeout(()=> pre.remove(), 400);
    }, remaining);
  }, 80);

  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // theme toggle (simple)
  const themeToggle = document.getElementById('themeToggle');
  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
    document.body.classList.toggle('theme-light');
  });

  // Form handling
  const form = document.getElementById('contactForm');
  const statusBox = document.getElementById('formStatus');

  // === IMPORTANT: Replace the placeholder below with your actual n8n webhook URL ===
  const WEBHOOK_URL = "PLACEHOLDER_N8N_WEBHOOK_URL";
  // Example: "https://n8n.example.com/webhook/feedback"

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusBox.textContent = 'Отправка...';
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if(!name || !email || !message){
      statusBox.textContent = 'Заполните все обязательные поля.';
      return;
    }

    const payload = {
      name, email, message,
      timestamp: (new Date()).toISOString()
    };

    try {
      const resp = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if(resp.ok){
        statusBox.textContent = 'Сообщение отправлено. Спасибо!';
        form.reset();
      } else {
        const txt = await resp.text().catch(()=>resp.statusText);
        statusBox.textContent = 'Ошибка отправки: ' + (txt || resp.status);
      }
    } catch (err) {
      statusBox.textContent = 'Ошибка сети: ' + err.message;
    }
  });

});
