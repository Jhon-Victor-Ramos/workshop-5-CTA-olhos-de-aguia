document.addEventListener('DOMContentLoaded', () => {
    const copyBtn = document.getElementById('copyBtn');
    const cloneCommand = document.getElementById('cloneCommand');

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(cloneCommand.innerText);
            
            // Feedback visual imediato
            const originalText = copyBtn.innerText;
            copyBtn.innerText = 'Copiado!';
            copyBtn.style.color = '#3fb950'; // Verde de sucesso
            
            setTimeout(() => {
                copyBtn.innerText = originalText;
                copyBtn.style.color = 'var(--accent)';
            }, 2000);
            
        } catch (err) {
            console.error('Falha ao copiar texto: ', err);
        }
    });
});