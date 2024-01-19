    document.addEventListener("DOMContentLoaded", function () {
        const username = "codERSunny812";
        const userProfileElement = document.getElementById("userProfile");
        const repositoriesElement = document.getElementById("repositories");
        const nextButton = document.getElementById("nextButton");
        const prevButton = document.getElementById("prevButton");
        const pagination = document.getElementById("pagination");
        let currentPage = 1;
        const reposPerPage = 6;

        const showLoader = () => {
            loader.style.display = 'block';
        };

        const hideLoader = () => {
            loader.style.display = 'none';
        };

        fetch(`https://api.github.com/users/${username}`)
            .then(response => response.json())
            .then(user => {
                hideLoader();
                userProfileElement.innerHTML = `
                    <div class="headContainer">
                        <div class="profilePic">
                            <img src="${user.avatar_url}" alt="Profile Picture">
                            <div>
                                <a href="${user.html_url}" target="_blank">${user.html_url}</a>
                            </div>
                        </div>
                        <div class="profileData">
                            <h2 class="user">${user.login}</h2>
                            <p class="userBio">${user.bio}</p>
                            <h5>${user.location || 'Location not specified'}</h5>
                            <h5>${user.twitter_username ? `<a href="https://twitter.com/${user.twitter_username}" target="_blank">Twitter : https://twitter.com/${user.twitter_username} </a>` : ''}</h5>
                        </div>
                    </div>
                `;
            });

        // Fetch and display user repositories
        const displayRepositories = (page) => {
            showLoader();
            fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=${reposPerPage}`)
                .then(response => response.json())
                .then(repositories => {
                    hideLoader();
                    repositoriesElement.innerHTML = repositories.map((repo, index) => `
                        <div class="repo">
                            <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                            <p>${repo.description || 'No description available'}</p>
                            ${repo.language ? `<p><strong>${repo.language}</strong></p>` : ''}
                        </div>
                    `).join('');

                });
        };
        displayRepositories(currentPage);

        const displayPagination = ()=>{
            fetch(`https://api.github.com/users/${username}`)
            .then(response => response.json())
            .then(totalPage => {
                let array=[]
                for(let j=1;j<=(parseInt(totalPage?.public_repos/6))+1;j++){
                    array[j-1]=j
                }
                pagination.innerHTML= array.map((item,index)=> 
                    `
                    <span class="pageNum" id="page-${item}">${item}</span>
                    `
                ).join('')
                array.forEach(item => {
                    const pageNumber = document.getElementById(`page-${item}`);
                    pageNumber.addEventListener('click', () => handlePaginationClick(item));
                });
            });
        }
        displayPagination(pagination);

        const handlePaginationClick = (selectedPage) => {
            // Add logic here to handle the selected page
            // For example, you can change the background color to blue
            // and update the content based on the selected page.
            resetPaginationStyles();  // Reset styles for all pages
            const selectedPageElement = document.getElementById(`page-${selectedPage}`);
            selectedPageElement.style.backgroundColor = 'blue';
        
            // Add logic to update content based on the selected page
            currentPage = selectedPage;
            displayRepositories(currentPage);
        };
        
        const resetPaginationStyles = () => {
            // Reset styles for all pages
            const allPages = document.querySelectorAll('.pageNum');
            allPages.forEach(page => {
                page.style.backgroundColor = '';  // Reset background color
            });
        };

        

        // Event listener for next button
        nextButton.addEventListener('click', () => {
            currentPage++;
            handlePaginationClick(currentPage)
            displayRepositories(currentPage);
        });

        // Event listener for prev button
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                handlePaginationClick(currentPage)
                displayRepositories(currentPage);
            }
        });
    });


