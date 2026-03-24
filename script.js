const config = {
    animationDelay: 100,
    scrollThreshold: 100,
};

document.addEventListener('DOMContentLoaded', function () {
    initializePageAnimations();
    setupScrollAnimations();
    setupPortfolioCards();
    setupSmoothScroll();
    controlarModal();
});

function initializePageAnimations() {
    const sections = document.querySelectorAll(
        '.apresentacao, .nota, .descricao, .habilidades .experiencias-profissionais, .portifolio,  .modal-imagens'
    );

    sections.forEach((section, index) => {
        // Reset animation
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';

        // Trigger animation with staggered delay
        setTimeout(() => {
            section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * config.animationDelay);
    });
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.8s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    const experiences = document.querySelectorAll('.experiencia');
    experiences.forEach((exp, index) => {
        exp.style.animation = 'none';
        exp.style.opacity = index === 0 ? '1' : '0.8';
        observer.observe(exp);
    });
}

function setupPortfolioCards() {
    const portfolioItems = document.querySelectorAll('.exemplo-portifolio');

    portfolioItems.forEach((item) => {
        // Add hover effects
        item.addEventListener('mouseenter', function () {
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        // Add subtle glow effect
        item.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Optional: Add subtle lighting effect
            const distance = Math.sqrt(Math.pow(x - rect.width / 2, 2) + Math.pow(y - rect.height / 2, 2));
            const intensity = Math.max(0, 1 - distance / (rect.width / 2));

            this.style.boxShadow = `
                0 12px 40px rgba(0, 212, 255, ${0.1 + intensity * 0.15}),
                inset 0 0 40px rgba(0, 212, 255, ${intensity * 0.05})
            `;
        });

        item.addEventListener('mouseleave', function () {
            this.style.boxShadow = '0 12px 40px rgba(0, 212, 255, 0.2)';
        });
    });

    const portfolioSection = document.querySelector('.portifolio');
    if (portfolioSection && !portfolioSection.querySelector('.portfolio-grid')) {
        reorganizePortfolioLayout();
    }
}

function reorganizePortfolioLayout() {
    const portfolioSection = document.querySelector('.portifolio');
    if (!portfolioSection) return;

    const h2 = portfolioSection.querySelector('h2');
    const items = Array.from(portfolioSection.querySelectorAll('.exemplo-portifolio'));

    // Create grid container
    const grid = document.createElement('div');
    grid.className = 'portfolio-grid';

    // Move items to grid
    items.forEach((item) => {
        // Enhance portfolio items with video containers and tech tags
        enhancePortfolioCard(item);
        grid.appendChild(item);
    });

    // Insert grid after heading
    if (h2) {
        h2.parentNode.insertBefore(grid, h2.nextSibling);
    }
}

function enhancePortfolioCard(card) {

    // Create content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'portfolio-content';

    // Move existing content to wrapper
    const paragraphs = Array.from(card.querySelectorAll('p'));
    paragraphs.forEach((p) => {
        contentWrapper.appendChild(p.cloneNode(true));
    });

    // Extract technologies and create tags
    const techTags = extractAndCreateTechTags(card);

    const imgsPortifolio = card.querySelector('.imagens-portifolio');
    const imgPortifolio = imgsPortifolio.querySelectorAll('.imagem-portifolio');
        if (imgPortifolio.length > 0) {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'portfolio-imagens';
            
            imgPortifolio.forEach((img) => {
                imgContainer.appendChild(img.cloneNode(true));
            });
            contentWrapper.appendChild(imgContainer);
        }

    // Move existing content to wrapper
    const links = Array.from(card.querySelectorAll('a'));
    links.forEach((a) => {
        contentWrapper.appendChild(a.cloneNode(true));
    });

    // Clear card and rebuild
    card.innerHTML = '';
    card.appendChild(contentWrapper);

    // Add tech tags if found
    if (techTags.length > 0) {
        const tagContainer = document.createElement('div');
        tagContainer.className = 'portfolio-tech';
        techTags.forEach((tag) => {
            tagContainer.appendChild(tag);
        });
        card.appendChild(tagContainer);
    }
}

function extractAndCreateTechTags(card) {
    const cardText = card.innerText.toLowerCase();
    const technologies = {
        'React': ['react', 'react.js'],
        'Java': ['java'],
        'Spring Boot': ['spring boot'],
        'TypeScript': ['typescript'],
        'JavaScript': ['javascript', 'js', 'es6'],
        'PostgreSQL': ['postgresql'],
        'MySQL': ['mysql'],
        'Oracle': ['oracle'],
        'HTML5': ['html5', 'html'],
        'CSS3': ['css3', 'css'],
        'Vite': ['vite'],
        'Next.js': ['next.js'],
        'Angular': ['angular'],
        'Redux': ['redux'],
        'Javax': ['javax'],
        'Tailwind': ['tailwind'],
        'Swagger': ['swagger'],
        'Axios': ['axios'],
        'Bootstramp': ['bootstramp'],
    };

    const foundTechs = new Set();

    Object.entries(technologies).forEach(([tech, keywords]) => {
        keywords.forEach((keyword) => {
            if (cardText.includes(keyword)) {
                foundTechs.add(tech);
            }
        });
    });

    return Array.from(foundTechs).map((tech) => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = tech;
        return tag;
    });
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });
}

function addClass(element, className, delay = 0) {
    if (delay > 0) {
        setTimeout(() => {
            element.classList.add(className);
        }, delay);
    } else {
        element.classList.add(className);
    }
}

function removeClass(element, className, delay = 0) {
    if (delay > 0) {
        setTimeout(() => {
            element.classList.remove(className);
        }, delay);
    } else {
        element.classList.remove(className);
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener(
    'resize',
    debounce(() => {
        const isMobile = window.innerWidth <= 768;
        // Responsive adjustments can be added here if needed
    }, 250)
);

function controlarModal() {
    const modal = document.getElementById('modalImagens');
    const imagemEmDestaque = document.getElementById('imagemEmDestaque');
    const btnFechar = document.querySelector('.fechar-modal');
    const btnAnterior = document.querySelector('.anterior'); 
    const btnProxima = document.querySelector('.proxima');

    let indexAtual = 0;
    let fontesImagensAtuais = [];
    
    const todasAsImagens = document.querySelectorAll('.imagem-portifolio');

    todasAsImagens.forEach((img) => {
        img.addEventListener('click', function() {
            
            const containerProjetoAtual = img.parentElement;
            
            const imagensDoProjeto = containerProjetoAtual.querySelectorAll('.imagem-portifolio');
            
            fontesImagensAtuais = Array.from(imagensDoProjeto).map(imagem => imagem.src);
            
            indexAtual = fontesImagensAtuais.indexOf(this.src);

            modal.style.display = 'flex';
            imagemEmDestaque.src = fontesImagensAtuais[indexAtual];
        });
    });

    const fecharModal = () => {
        modal.style.display = 'none';
    };

    btnFechar.addEventListener('click', fecharModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    const mudarImagem = (direcao) => {
        indexAtual += direcao;
        
        if (indexAtual >= fontesImagensAtuais.length) indexAtual = 0;
        if (indexAtual < 0) indexAtual = fontesImagensAtuais.length - 1;
        
        imagemEmDestaque.src = fontesImagensAtuais[indexAtual];
    };

    btnAnterior.addEventListener('click', () => mudarImagem(-1));
    btnProxima.addEventListener('click', () => mudarImagem(1));

    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') mudarImagem(-1);
            if (e.key === 'ArrowRight') mudarImagem(1);
            if (e.key === 'Escape') fecharModal();
        }
    });
};