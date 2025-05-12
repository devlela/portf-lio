document.addEventListener('DOMContentLoaded', function () {
  // Gerenciamento dos botões de "Ver no GitHub" (fora do modal)
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      const url = this.getAttribute('data-url');
      if (url) {
        window.open(url, '_blank');
      }
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

  // Animação de aparição via Scroll (IntersectionObserver)
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('appear');
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // Botão "Voltar ao Topo"
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
  });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Modal - Abrir, preencher e fechar
  const modal = document.getElementById('modal');
  const modalClose = document.querySelector('.modal-close');
  const modalTitle = document.querySelector('.modal-title');
  const modalDescription = document.querySelector('.modal-description');
  const modalBtn = document.getElementById('modal-github');
  const moreDetailsButtons = document.querySelectorAll('.more-details-btn');

  moreDetailsButtons.forEach(function(button) {
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

  // Fechar o modal ao clicar no "X"
  modalClose.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  // Fechar o modal ao clicar fora da área de conteúdo
  window.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Botão no modal para "Ver no GitHub"
  modalBtn.addEventListener('click', function () {
    const url = modalBtn.getAttribute('data-url');
    if (url) {
      window.open(url, '_blank');
    }
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

  // Registro do Service Worker (PWA)
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