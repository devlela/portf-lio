document.addEventListener('DOMContentLoaded', function () {
  // Botões "Ver no GitHub" fora do modal
  document.querySelectorAll('.btn').forEach(function (button) {
    button.addEventListener('click', function () {
      const url = this.getAttribute('data-url');
      if (url) window.open(url, '_blank');
    });
  });

  // Configuração do tema com localStorage
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'light') {
    document.documentElement.classList.add('light-theme');
    themeToggle.textContent = 'Tema Escuro';
  } else {
    themeToggle.textContent = 'Tema Claro';
  }
  themeToggle.addEventListener('click', function () {
    document.documentElement.classList.toggle('light-theme');
    if (document.documentElement.classList.contains('light-theme')) {
      localStorage.setItem('theme', 'light');
      themeToggle.textContent = 'Tema Escuro';
    } else {
      localStorage.setItem('theme', 'dark');
      themeToggle.textContent = 'Tema Claro';
    }
  });

  // Animação de aparição via Scroll com IntersectionObserver
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('appear');
      observer.unobserve(entry.target);
    });
  }, appearOptions).observe(faders[0]);  // Observe o primeiro elemento
  faders.forEach(fader => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          obs.unobserve(entry.target);
        }
      });
    }, appearOptions);
    observer.observe(fader);
  });

  // Botão "Voltar ao Topo"
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', function () {
    backToTop.style.display = (window.scrollY > 300) ? 'flex' : 'none';
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Modal: Abrir, preencher e fechar
  const modal = document.getElementById('modal'),
        modalClose = document.querySelector('.modal-close'),
        modalTitle = document.querySelector('.modal-title'),
        modalDescription = document.querySelector('.modal-description'),
        modalBtn = document.getElementById('modal-github');
  document.querySelectorAll('.more-details-btn').forEach(function (button) {
    button.addEventListener('click', function (e) {
      const card = e.target.closest('.card');
      const title = card.getAttribute('data-title') || '';
      const description = card.getAttribute('data-description') || '';
      const url = card.getAttribute('data-url') || '';
      modalTitle.textContent = title;
      modalDescription.textContent = description;
      modalBtn.setAttribute('data-url', url);
      modal.style.display = 'flex';
    });
  });
  modalClose.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
  modalBtn.addEventListener('click', function () {
    const url = this.getAttribute('data-url');
    if (url) window.open(url, '_blank');
  });

  // Filtro para projetos
  const projectSearch = document.getElementById('project-search');
  projectSearch.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.projects .card').forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const desc = card.querySelector('p').textContent.toLowerCase();
      card.style.display = (title.includes(query) || desc.includes(query)) ? '' : 'none';
    });
  });

  // Filtro para repositórios
  const repoSearch = document.getElementById('repo-search');
  repoSearch.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll('#repo-container .repo-card').forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const desc = card.querySelector('p').textContent.toLowerCase();
      card.style.display = (title.includes(query) || desc.includes(query)) ? '' : 'none';
    });
  });

  // Fetch dos repositórios do GitHub (últimos 5 atualizados)
  fetch('https://api.github.com/users/devlela/repos?sort=updated&per_page=5')
    .then(response => response.json())
    .then(data => {
      const repoContainer = document.getElementById('repo-container');
      data.forEach(repo => {
        const repoCard = document.createElement('div');
        repoCard.classList.add('repo-card');
        repoCard.innerHTML = `
          <h3>${repo.name}</h3>
          <p>${repo.description || 'Sem descrição'}</p>
          <a href="${repo.html_url}" target="_blank" aria-label="Ver ${repo.name} no GitHub">Ver no GitHub</a>
        `;
        repoContainer.appendChild(repoCard);
      });
    })
    .catch(error => console.error('Erro ao buscar repositórios:', error));

  // Manipulação do formulário de contato
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // Exemplo simples: alerta e reset do formulário
    alert('Mensagem enviada! Em breve entrarei em contato.');
    contactForm.reset();
  });

  // Registro do Service Worker (para PWA)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registrado com sucesso com escopo:', registration.scope);
        })
        .catch(error => {
          console.log('Falha no registro do ServiceWorker:', error);
        });
    });
  }
});