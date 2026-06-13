document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÓGICA DO BOTÃO DE COPIAR COMANDO ---
    const copyBtn = document.getElementById('copyBtn');
    const cloneCommand = document.getElementById('cloneCommand');

    if (copyBtn && cloneCommand) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(cloneCommand.innerText);
                
                // Feedback visual imediato
                const originalText = copyBtn.innerText;
                copyBtn.innerText = 'Copiado!';
                copyBtn.style.color = '#3fb950'; // Verde de sucesso
                
                setTimeout(() => {
                    copyBtn.innerText = originalText;
                    copyBtn.style.color = '#c9d1d9'; // Cor original
                }, 2000);
                
            } catch (err) {
                console.error('Falha ao copiar texto: ', err);
            }
        });
    }

    // --- 2. LÓGICA DE EXTRAÇÃO AUTOMÁTICA DE THUMBNAILS (YOUTUBE) ---
    const materialCards = document.querySelectorAll('.material-card');

    // Função com Regex para isolar o ID do vídeo em qualquer formato de link do YouTube
    function getYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    materialCards.forEach(card => {
        const link = card.getAttribute('href');
        
        // Verifica se o link é do YouTube
        if (link && (link.includes('youtube.com') || link.includes('youtu.be'))) {
            const videoId = getYouTubeId(link);
            
            // Se encontrou o ID do vídeo, busca a capa em alta qualidade
            if (videoId) {
                const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                const thumbContainer = card.querySelector('.card-thumb');
                
                if (thumbContainer) {
                    // Remove o ícone SVG e aplica a capa como background
                    thumbContainer.innerHTML = ''; 
                    thumbContainer.style.backgroundImage = `url('${thumbUrl}')`;
                    thumbContainer.style.backgroundSize = 'cover';
                    thumbContainer.style.backgroundPosition = 'center';
                    thumbContainer.style.backgroundColor = '#000'; // Fundo preto caso demore a carregar
                }
            }
        }
    });

    // --- 3. LÓGICA DO CARROSSEL DE MATERIAIS ---
    const track = document.getElementById('js-materials-grid');
    const prevBtn = document.getElementById('js-prev-btn');
    const nextBtn = document.getElementById('js-next-btn');

    if (track && prevBtn && nextBtn) {
        // Quantidade de pixels que vai rolar a cada clique
        const scrollAmount = 320; 

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }
    
});