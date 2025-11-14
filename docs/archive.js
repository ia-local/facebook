document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE = '';
    const container = document.getElementById('blog-posts-container');
    const modal = document.getElementById('article-modal');
    const closeBtn = document.querySelector('.close-btn');
    const btnPublish = document.getElementById('btn-publish-linkedin');
    const publicationOutput = document.getElementById('publication-output');
    const postClipboard = document.getElementById('post-clipboard');

    // --- Fonction de Publication (Copier/Coller) ---
    const publishArticle = async (post) => {
        // 1. Formater le contenu pour LinkedIn (nettoyage HTML simple)
        const formattedContent = `${post.title.trim()}\n\n${post.content.replace(/<\/?(ul|li|p|h[1-6]|div)>/g, '\n').trim()}`;
        
        postClipboard.textContent = formattedContent;
        publicationOutput.style.display = 'block';
        btnPublish.textContent = 'Déjà Publié (Copier à nouveau)';
        
        // 2. Mettre à jour le statut sur le serveur (pour le journal quotidien)
        try {
            const response = await fetch(`${API_BASE}/publish_status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Nous utilisons le nom de fichier complet comme identifiant
                body: JSON.stringify({ filename: post.filename, published: true }), 
            });
            if (!response.ok) {
                console.error("Échec de la mise à jour du statut de publication.");
            }
        } catch (error) {
            console.error('Erreur réseau lors de la mise à jour du statut :', error);
        }
    };
    
    // --- Chargement des Articles ---
    try {
        container.innerHTML = 'Chargement des articles...';
        const response = await fetch(`${API_BASE}/blog`);
        if (!response.ok) throw new Error('Erreur de chargement des articles.');
        
        // Le serveur doit retourner un tableau d'objets (post)
        const posts = await response.json(); 

        container.innerHTML = ''; // Efface le message de chargement

        if (posts.length === 0) {
            container.innerHTML = '<p>Aucun article n\'a encore été enregistré.</p>';
            return;
        }

        posts.forEach(post => {
            const card = document.createElement('article');
            card.className = 'blog-card';

            const title = document.createElement('h3');
            title.textContent = post.title;

            const image = document.createElement('img');
            image.alt = post.title;
            image.src = post.image;
            
            // Ajout du statut de publication pour le journal quotidien
            const statusIndicator = document.createElement('p');
            statusIndicator.className = 'status-indicator';
            // Supposons que 'post.published' est fourni par le serveur
            statusIndicator.textContent = post.published ? '✅ Publié' : '📝 Brouillon'; 
            statusIndicator.style.color = post.published ? 'green' : 'orange';

            card.appendChild(title);
            card.appendChild(image);
            card.appendChild(statusIndicator);

            // Gérer l'ouverture de la modale au clic
            card.addEventListener('click', () => {
                document.getElementById('modal-image').src = post.image;
                document.getElementById('modal-title').textContent = post.title;
                document.getElementById('modal-article-content').innerHTML = post.content;
                
                // Réinitialiser la section publication
                publicationOutput.style.display = 'none';
                btnPublish.textContent = 'Publier sur LinkedIn';
                btnPublish.onclick = () => publishArticle(post); // Attacher l'action
                
                modal.style.display = 'block';
            });

            container.appendChild(card);
        });

    } catch (error) {
        console.error('Erreur :', error);
        container.innerHTML = `<p>Impossible de charger les articles : ${error.message}</p>`;
    }
    
    // Gérer la fermeture de la modale
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});