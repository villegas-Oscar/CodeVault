// ============================================
// CodeVault — interacciones
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Año en footer ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Menú móvil ---- */
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    document.querySelectorAll('.nav-mobile a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Logos: marquee infinito (iconos genéricos, duplicados para loop continuo) ---- */
  const icons = [
    `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M9 9h6v6H9z"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 22 20H2z"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v18M3 12h18" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="7" width="16" height="12" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12a8 8 0 1 1 8 8" stroke-linecap="round"/><path d="M4 12v5h5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M8 9c3-1 6-1 9 1M7 12c3.5-1 6.5-1 9.5 1M8 15c2.5-.8 5-.8 7.5.3" stroke="#FAF8F6" stroke-width="1.3" fill="none" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h6a4 4 0 0 1 0 8H7z"/><path d="M7 11h7a4 4 0 0 1 0 8H7z"/></svg>`
  ];

  const track = document.getElementById('marqueeTrack');
  if (track) {
    const buildSet = () => icons.map(svg => `<span class="logo-icon">${svg}</span>`).join('');
    track.innerHTML = buildSet() + buildSet();
  }

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-group');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (entry.target.classList.contains('reveal-group')) {
          entry.target.querySelectorAll('.reveal-item').forEach((item, i) => {
            item.style.setProperty('--gd', `${i * 0.08}s`);
          });
        }
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => io.observe(el));

  /* ---- FAQ accordion (uno abierto a la vez) ---- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

});

/* ============ CHAT IA ============ */
(function () {
  const toggle = document.getElementById('chatToggle');
  const chatWindow = document.getElementById('chatWindow');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const messagesBox = document.getElementById('chatMessages');

  // URL del dominio
  const API_URL = 'https://code-vault-orpin-delta.vercel.app/';
  const MODEL = 'openai/gpt-4o-mini'; 

  // En tu script.js
let historial = [
  {
    role: 'system',
    content: `Eres el asistente virtual de CodeVault, una agencia de desarrollo web.

## Identidad
- Tu nombre es "Vault Bot".
- Representas a CodeVault, una agencia de Salamanca, México.

## Personalidad
- Eres profesional pero cercano, claro y directo. Usas un español neutro y amable.
- Hablas en primera persona del plural ("nosotros", "nuestro equipo").

## Servicios
- Desarrollo Web: Aplicaciones modernas y responsivas.
- Diseño UI/UX: Interfaces que guían a la acción.
- Tarjetas de Proximidad: Tecnología para escalar tu negocio con google reviews y followers de instagram. El precio de cada tarjeta es de 400 mxn
- Backend y APIs: Arquitecturas escalables y seguras.
- SEO y Performance: Optimización técnica.
- Mantenimiento: Soporte y monitoreo continuo.

## Proceso de Trabajo
- Nuestro proceso es: 1) Descubrimiento, 2) Diseño, 3) Desarrollo, 4) Lanzamiento.
- Un sitio web típico toma entre 4 y 8 semanas. Una aplicación, entre 2 y 4 meses.

## Contacto
- Email: ov7224@gmail.com
- Teléfono/WhatsApp: +52 464 654 0835

## Reglas de Comportamiento
- Si preguntan por precios exactos, indica que cada proyecto es único y que pueden escribir a ov7224@gmail.com o llamar al +52 464 654 0835 para una cotización personalizada.
- No inventes información. Si no sabes algo, di que no tienes esa información y sugiere contactar directamente.
- No hables mal de la competencia.`
  }
];

  // Abrir / cerrar ventana
  toggle.addEventListener('click', () => {
    const isOpen = chatWindow.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    chatWindow.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen) input.focus();
  });

  // Añadir un mensaje visual al chat
  function addMsg(text, sender) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + sender;
    div.textContent = text;
    messagesBox.appendChild(div);
    messagesBox.scrollTop = messagesBox.scrollHeight;
    return div;
  }

  // Enviar mensaje
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const texto = input.value.trim();
    if (!texto) return;

    addMsg(texto, 'user');
    historial.push({ role: 'user', content: texto });
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    const typingEl = addMsg('Escribiendo...', 'bot typing');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historial, model: MODEL })
      });

      const data = await res.json();
      const respuesta =
        data?.choices?.[0]?.message?.content ||
        data?.error?.message ||
        'Lo siento, no pude obtener una respuesta.';

      typingEl.classList.remove('typing');
      typingEl.textContent = respuesta;

      historial.push({ role: 'assistant', content: respuesta });
    } catch (err) {
      typingEl.classList.remove('typing');
      typingEl.textContent = 'Error de conexión. Intenta de nuevo más tarde.';
      console.error(err);
    } finally {
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }
  });
})();