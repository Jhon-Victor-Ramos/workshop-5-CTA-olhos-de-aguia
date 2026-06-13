document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÓGICA DO BOTÃO DE COPIAR COMANDO ---
    const copyBtn = document.getElementById('copyBtn');
    const cloneCommand = document.getElementById('cloneCommand');

    if (copyBtn && cloneCommand) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(cloneCommand.innerText.trim());
                
                // Feedback visual imediato
                const originalText = copyBtn.innerText;
                copyBtn.innerText = 'COPIADO!';
                copyBtn.style.color = '#3fb950'; // Verde de sucesso
                
                setTimeout(() => {
                    copyBtn.innerText = originalText;
                    copyBtn.style.color = ''; // Retorna à cor original
                }, 2000);
                
            } catch (err) {
                console.error('Falha ao copiar texto: ', err);
            }
        });
    }

    // --- 2. LÓGICA DE EXTRAÇÃO AUTOMÁTICA DE THUMBNAILS (YOUTUBE) ---
    const materialCards = document.querySelectorAll('.material-card');

    function getYouTubeId(url) {
        if (!url) return null;
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(regExp);
        return (match && match[1].length === 11) ? match[1] : null;
    }

    materialCards.forEach(card => {
        const link = card.getAttribute('href');
        
        if (link && (link.includes('youtube.com') || link.includes('youtu.be'))) {
            const videoId = getYouTubeId(link);
            
            if (videoId) {
                const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                
                // Busca tanto 'thumb-container' quanto 'card-thumb' para segurança
                const thumbContainer = card.querySelector('.thumb-container') || card.querySelector('.card-thumb');
                
                if (thumbContainer) {
                    thumbContainer.innerHTML = ''; // Limpa ícones internos
                    thumbContainer.style.backgroundImage = `url('${thumbUrl}')`;
                    thumbContainer.style.backgroundSize = 'cover';
                    thumbContainer.style.backgroundPosition = 'center';
                    thumbContainer.style.backgroundColor = '#000';
                }
            }
        }
    });

    // --- 3. LÓGICA DO CARROSSEL DE MATERIAIS COM OBSERVADOR (ACTIVE-CARD) ---
    const track = document.getElementById('js-materials-grid');
    const prevBtn = document.getElementById('js-prev-btn');
    const nextBtn = document.getElementById('js-next-btn');

    if (track) {
        const cards = track.querySelectorAll('.material-card');

        // Configuração do Observador para dar destaque (opacidade 100%) ao card ativo no centro
        const observerOptions = { root: track, threshold: 0.6 };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    cards.forEach(c => c.classList.remove('active-card'));
                    entry.target.classList.add('active-card');

                    const index = Array.from(cards).indexOf(entry.target);
                    if (prevBtn) prevBtn.disabled = index === 0;
                    if (nextBtn) nextBtn.disabled = index === cards.length - 1;
                }
            });
        }, observerOptions);

        cards.forEach(card => observer.observe(card));
        
        // Rolagem com as setas
        const scrollAmount = 320; 

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }
    }
});