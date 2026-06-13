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
// --- 2. LÓGICA DE EXTRAÇÃO AUTOMÁTICA DE THUMBNAILS (YOUTUBE) ---
    const materialCards = document.querySelectorAll('.material-card');

    // Função de Regex mais robusta (retirada do seu segundo código)
    function getYouTubeId(url) {
        if (!url) return null;
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(regExp);
        return (match && match[1].length === 11) ? match[1] : null;
    }

    materialCards.forEach(card => {
        // CORREÇÃO 1: Busca a tag 'a' dentro do card para conseguir ler o 'href'
        const linkElement = card.querySelector('a.material-title') || card.querySelector('a');
        const link = linkElement ? linkElement.getAttribute('href') : null;
        
        // Verifica se o link é do YouTube
        if (link && (link.includes('youtube.com') || link.includes('youtu.be'))) {
            const videoId = getYouTubeId(link);
            
            // Se encontrou o ID do vídeo, busca a capa em alta qualidade
            if (videoId) {
                // CORREÇÃO 2: URL corrigida com o domínio do YouTube e o ID correspondente
                const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                
                // CORREÇÃO 3: Ajustado o seletor de '.card-thumb' para '.thumb-container'
                const thumbContainer = card.querySelector('.thumb-container') || card.querySelector('.card-thumb');
                
                if (thumbContainer) {
                    thumbContainer.innerHTML = ''; 
                    thumbContainer.style.backgroundImage = `url('${thumbUrl}')`;
                    thumbContainer.style.backgroundSize = 'cover';
                    thumbContainer.style.backgroundPosition = 'center';
                    thumbContainer.style.backgroundColor = '#000'; // Fundo preto de segurança
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