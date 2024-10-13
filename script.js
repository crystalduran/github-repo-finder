document.addEventListener("DOMContentLoaded", () => {
    const languageSelector = document.getElementById('language-selector');
    languageSelector.value = '';


    const resultContainerDefault = document.querySelector('.default');
    const loadingContainer = document.querySelector('.loading');
    const errorContainer = document.querySelector('.error');
    const buttonRetry = document.querySelector('.retry-btn');
    const repoContainer = document.querySelector('.repo');

    // function to display only the desired div
    function showContainer(containerToShow) {
        // Ocultar todos los contenedores
        resultContainerDefault.classList.add('hidden');
        loadingContainer.classList.add('hidden');
        errorContainer.classList.add('hidden');
        repoContainer.classList.add('hidden');
        buttonRetry.classList.add('hidden');

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

    async function getLanguages() {
        try {
            const response = await fetch("https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json");

            const languages = await response.json();
            return languages; 

        } catch (error) {
            console.error('Error fetching languages:', error);
            return [];
        }
    }

    async function populateSelect() {
        const languageSelector = document.getElementById('language-selector'); 
        const languages = await getLanguages();

        languages.forEach(language => {
          const option = document.createElement('option');
          option.value = language.value; 
          option.text = language.title;   
          languageSelector.appendChild(option);  
        });
    }

    async function fetchData(option) {
        try {

            showContainer(loadingContainer);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await fetch(`https://api.github.com/search/repositories?q=language:${option}`);
            const data = await response.json();

            if (data.items && data.items.length > 0) {

                setTimeout(() => {

                })
                // to pick a random element from the array items
                const randomIndex = Math.floor(Math.random() * data.items.length);
                const randomItem = data.items[randomIndex];
                showContainer(repoContainer);
                updateDOMWithRepoData(randomItem);
            } else {
                showContainer(errorContainer);
            }

        } catch (error) {
            showContainer(errorContainer);
            console.log(error);
        }
    }

    function updateDOMWithRepoData(repo) {
        const repoName = document.getElementById("repo-name");
        const repoDescription = document.getElementById("repo-description");
        const repoLink = document.getElementById("repo-link");
        const repoLanguage = document.getElementById("repo-language");
        const repoStars = document.getElementById("repo-stars");
        const repoForks = document.getElementById("repo-forks");
        const repoIssues = document.getElementById("repo-issues");

        repoName.textContent = repo.name;
        repoDescription.textContent = truncateDescription(repo.description, 100);
        repoLink.href = repo.html_url;
        repoLanguage.textContent = repo.language;
        repoStars.textContent = repo.stargazers_count || 0;
        repoForks.textContent = repo.forks_count || 0;
        repoIssues.textContent = repo.open_issues_count || 0;
    }

    document.getElementById('language-selector').addEventListener('change', (event) => {
        const selectedValue = event.target.value;

        if (selectedValue) {
            fetchData(selectedValue);
        }
    });

    buttonRetry.addEventListener('click', () => {
        const selectedOption = document.getElementById('language-selector').value;
        fetchData(selectedOption);
    });

    populateSelect();
});


