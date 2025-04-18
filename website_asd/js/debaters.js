document.addEventListener('DOMContentLoaded', function() {
    let websiteData = null;

    // Load website data which includes debater information
    fetch('data/website.json')
        .then(response => response.json())
        .then(data => {
            websiteData = data;
            // Set 2nd edition as the default active edition
            showEdition('2nd');
            
            // Load 2023 data from JSON file into the 2nd edition section
            if (data.debaters && data.debaters['2023']) {
                loadEditionData('2nd', data.debaters['2023']);
            }
        })
        .catch(error => {
            console.error('Error loading website data:', error);
            showErrorMessage();
        });

    // Initialize all carousels
    const carousels = document.querySelectorAll('.debaters-carousel');
    carousels.forEach(initCarousel);

    // Initialize edition buttons
    const editionButtons = document.querySelectorAll('.edition-btn');
    editionButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            editionButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Handle edition change
            showEdition(button.dataset.edition);
        });
    });

    // Function to show only the selected edition content
    function showEdition(edition) {
        // Hide all edition contents
        document.querySelectorAll('.edition-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show the selected edition content
        const selectedContent = document.getElementById(`${edition}-edition`);
        if (selectedContent) {
            selectedContent.style.display = 'block';
        }
        
        // Load appropriate data for the edition
        if (websiteData) {
            if (edition === '2nd' && websiteData.debaters && websiteData.debaters['2023']) {
                loadEditionData(edition, websiteData.debaters['2023']);
            } else if (edition === '1st' && websiteData.debaters && websiteData.debaters['2022']) {
                loadEditionData(edition, websiteData.debaters['2022']);
            } else if (edition === '3rd' && websiteData.debaters && websiteData.debaters['2024']) {
                loadEditionData(edition, websiteData.debaters['2024']);
            }
            // If no data exists for this edition, leave the sample data that's in the HTML
        }
    }

    // Function to load data for a specific edition
    function loadEditionData(edition, editionData) {
        // Load French section if available
        if (editionData.french) {
            loadTeamSection(`french-section-${edition}`, editionData.french);
        }
        
        // Load English section if available
        if (editionData.english) {
            loadTeamSection(`english-section-${edition}`, editionData.english);
        }
        
        // Load Arabic section if available
        if (editionData.arabic) {
            loadTeamSection(`arabic-section-${edition}`, editionData.arabic);
        }
        
        // Reinitialize all carousels after loading new content
        const editionContent = document.getElementById(`${edition}-edition`);
        if (editionContent) {
            const carousels = editionContent.querySelectorAll('.debaters-carousel');
            carousels.forEach(initCarousel);
        }
    }

    // Function to load team data into a section
    function loadTeamSection(sectionId, sectionData) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const grid = section.querySelector('.debaters-grid');
        if (!grid) return;

        // Only clear and update if there's actual data to show
        if (sectionData && (sectionData.government || sectionData.opposition || 
                          sectionData.team1 || sectionData.team2)) {
            // Clear existing content
            grid.innerHTML = '';
            
            // Load government team if it exists
            if (sectionData.government && sectionData.government.length > 0) {
                const teamTitle = document.createElement('div');
                teamTitle.className = 'team-title';
                teamTitle.innerHTML = `<h3 data-en="Government Team" data-fr="Équipe Gouvernementale">Government Team</h3>`;
                grid.appendChild(teamTitle);
                
                sectionData.government.forEach(debater => {
                    grid.appendChild(createDebaterCard(debater));
                });
                
                // Add spacing between teams
                const spacer = document.createElement('div');
                spacer.className = 'team-spacer';
                grid.appendChild(spacer);
            }

            // Load opposition team if it exists
            if (sectionData.opposition && sectionData.opposition.length > 0) {
                const teamTitle = document.createElement('div');
                teamTitle.className = 'team-title';
                teamTitle.innerHTML = `<h3 data-en="Opposition Team" data-fr="Équipe d'Opposition">Opposition Team</h3>`;
                grid.appendChild(teamTitle);
                
                sectionData.opposition.forEach(debater => {
                    grid.appendChild(createDebaterCard(debater));
                });
            }

            // Alternative structure: team1 and team2
            if (sectionData.team1 && sectionData.team1.length > 0) {
                const teamTitle = document.createElement('div');
                teamTitle.className = 'team-title';
                teamTitle.innerHTML = `<h3>Team 1</h3>`;
                grid.appendChild(teamTitle);
                
                sectionData.team1.forEach(debater => {
                    grid.appendChild(createDebaterCard(debater));
                });
                
                // Add spacing between teams
                const spacer = document.createElement('div');
                spacer.className = 'team-spacer';
                grid.appendChild(spacer);
                
                if (sectionData.team2 && sectionData.team2.length > 0) {
                    const team2Title = document.createElement('div');
                    team2Title.className = 'team-title';
                    team2Title.innerHTML = `<h3>Team 2</h3>`;
                    grid.appendChild(team2Title);
                    
                    sectionData.team2.forEach(debater => {
                        grid.appendChild(createDebaterCard(debater));
                    });
                }
            }
        }
    }

    function showErrorMessage() {
        const sections = document.querySelectorAll('.debaters-section');
        sections.forEach(section => {
            section.innerHTML = `
                <div class="error-message">
                    <h3>Error Loading Debaters</h3>
                    <p>Sorry, there was an error loading the debaters information. Please try again later.</p>
                </div>
            `;
        });
    }

    function createDebaterCard(debater) {
        const card = document.createElement('div');
        card.className = 'debater-card';
        
        // Get the role in the correct language
        const currentLang = localStorage.getItem('language') || 'en';
        const role = debater.role && debater.role[currentLang] ? debater.role[currentLang] : 
                    (debater.role && debater.role.en ? debater.role.en : '');

        card.innerHTML = `
            <div class="debater-image">
                <img src="${debater.image}" alt="${debater.name}">
            </div>
            <div class="debater-info">
                <h3>${debater.name}</h3>
                <p class="debater-role">${role}</p>
                <p class="debater-affiliation">${debater.affiliation || ''}</p>
                ${debater.bio ? `<p class="debater-bio">${debater.bio}</p>` : ''}
                ${debater.achievements ? 
                    `<div class="debater-achievements">
                        ${debater.achievements.map(achievement => 
                            `<span class="achievement">${achievement}</span>`
                        ).join('')}
                    </div>` : ''
                }
            </div>
        `;
        return card;
    }

    // Listen for language changes
    window.addEventListener('languageChanged', (e) => {
        // Reload the active edition to update text
        const activeButton = document.querySelector('.edition-btn.active');
        if (activeButton) {
            showEdition(activeButton.dataset.edition);
        }
    });
});

function initCarousel(carousel) {
    if (!carousel) return;
    
    const grid = carousel.querySelector('.debaters-grid');
    if (!grid) return;
    
    const prevBtn = carousel.parentElement.querySelector('.prev-btn');
    const nextBtn = carousel.parentElement.querySelector('.next-btn');
    const cards = grid.querySelectorAll('.debater-card');
    
    if (cards.length === 0) return;
    
    const cardWidth = cards[0].offsetWidth + 32; // Width + gap
    let currentPosition = 0;
    const maxPosition = Math.min(0, -((cards.length * cardWidth) - carousel.offsetWidth));

    // Update button states
    function updateButtons() {
        prevBtn.style.opacity = currentPosition >= 0 ? '0.3' : '1';
        nextBtn.style.opacity = currentPosition <= maxPosition ? '0.3' : '1';
        prevBtn.disabled = currentPosition >= 0;
        nextBtn.disabled = currentPosition <= maxPosition;
    }

    // Move carousel
    function moveCarousel(direction) {
        if (direction === 'next' && currentPosition > maxPosition) {
            currentPosition -= cardWidth;
        } else if (direction === 'prev' && currentPosition < 0) {
            currentPosition += cardWidth;
        }
        grid.style.transform = `translateX(${currentPosition}px)`;
        updateButtons();
    }

    // Add event listeners
    prevBtn.addEventListener('click', () => moveCarousel('prev'));
    nextBtn.addEventListener('click', () => moveCarousel('next'));

    // Add touch support
    let touchStartX = 0;
    let touchEndX = 0;

    grid.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    grid.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchStartX - touchEndX > 50) {
            // Swipe left
            moveCarousel('next');
        } else if (touchEndX - touchStartX > 50) {
            // Swipe right
            moveCarousel('prev');
        }
    }

    // Initialize button states
    updateButtons();
} 