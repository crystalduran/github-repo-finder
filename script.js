document.addEventListener("DOMContentLoaded", () => {
    const languageSelector = document.getElementById('language-selector'); 
    languageSelector.value = '';


    const resultContainerDefault = document.querySelector('.default');
    const loadingContainer = document.querySelector('.loading');
    const errorContainer = document.querySelector('.error');
    const buttonRetry = document.querySelector('.retry-btn');
    const repoContainer = document.querySelector('.repo');

    // Función para mostrar solo el div adecuado
    function showContainer(containerToShow) {
        // Ocultar todos los contenedores
        resultContainerDefault.classList.add('hidden');
        loadingContainer.classList.add('hidden');
        errorContainer.classList.add('hidden');
        repoContainer.classList.add('hidden');
        buttonRetry.classList.add('hidden');

        // Mostrar solo el contenedor seleccionado
        containerToShow.classList.remove('hidden');

        if (containerToShow === errorContainer) {
            buttonRetry.classList.remove('hidden');
        }
    }

    function truncateDescription(description, maxLength) {
        return description.length > maxLength 
            ? description.substring(0, maxLength) + "..." 
            : description;
    }

    function updateDOMWithRepoData(repo) {
        // Accede a los elementos del DOM
        const repoName = document.getElementById("repo-name");
        const repoDescription = document.getElementById("repo-description");
        const repoLink = document.getElementById("repo-link");
        const repoLanguage = document.getElementById("repo-language");
        const repoStars = document.getElementById("repo-stars");
        const repoForks = document.getElementById("repo-forks");
        const repoIssues = document.getElementById("repo-issues");

        // Asigna los datos del JSON a los elementos HTML
        repoName.textContent = repo.name;
        repoDescription.textContent = truncateDescription(repo.description, 100);
        repoLink.href = repo.html_url;
        repoLanguage.textContent = repo.language;
        repoStars.textContent = repo.stargazers_count || 0;
        repoForks.textContent = repo.forks_count || 0;
        repoIssues.textContent = repo.open_issues_count || 0;
    }


    // Función que realizará la petición en base a la opción seleccionada
    async function fetchData(option) {
        try {
            // Hacer la petición a la API usando el valor seleccionado
            showContainer(loadingContainer);

            // Simular un tiempo de carga de 1 segundo (1000 ms)
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await fetch(`https://api.github.com/search/repositories?q=language:${option}`);

            // Parsear la respuesta en formato JSON
            const data = await response.json();

            if (data.items && data.items.length > 0) {

                setTimeout(() => {

                })
                // Elegir un elemento aleatorio del array items
                const randomIndex = Math.floor(Math.random() * data.items.length);
                const randomItem = data.items[randomIndex];
                console.log(randomItem);
                showContainer(repoContainer);
                updateDOMWithRepoData(randomItem);
            }

        } catch (error) {
            console.log(error);
            showContainer(errorContainer);
        }
    }

    // Función que se ejecuta cuando cambia la selección
    document.getElementById('language-selector').addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        
        // Solo llama a fetchData si no se seleccionó la opción por defecto
        if (selectedValue) {
            fetchData(selectedValue);
        }
    });

    buttonRetry.addEventListener('click', () => {
        const selectedOption = document.getElementById('language-selector').value; // Obtener valor actual
        fetchData(selectedOption);  // Intentar de nuevo la carga de datos
    });
});


