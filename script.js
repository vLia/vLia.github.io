document.addEventListener("DOMContentLoaded", function () {
    fetch("projects.json")
        .then(response => response.json())
        .then(data => {
            const projectList = document.getElementById("project-list");
            data.forEach(project => {
                const projectDiv = document.createElement("div");
                projectDiv.classList.add("project");
                projectDiv.innerHTML = `
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <a href="${project.link}" target="_blank">View Project</a>
                `;
                projectList.appendChild(projectDiv);
            });
        });

    const sections = document.querySelectorAll('section');
    const scrollButton = document.createElement('div');
    scrollButton.className = 'scroll-down';
    scrollButton.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
    `;
    document.body.appendChild(scrollButton);

    let currentSectionIndex = 0;

    // Hide button when at the bottom of the page
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
            scrollButton.style.opacity = '0';
        } else {
            scrollButton.style.opacity = '1';
        }
    });

    // Function to scroll to a specific section
    const scrollToSection = (index) => {
        currentSectionIndex = index;
        sections[currentSectionIndex].scrollIntoView({ behavior: 'smooth' });
        
        // Update button appearance
        if (currentSectionIndex === sections.length - 1) {
            scrollButton.style.transform = 'rotate(180deg)';
        } else {
            scrollButton.style.transform = 'rotate(0deg)';
        }
    };

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (currentSectionIndex < sections.length - 1) {
                scrollToSection(currentSectionIndex + 1);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentSectionIndex > 0) {
                scrollToSection(currentSectionIndex - 1);
            }
        }
    });

    // Click handler for the scroll button
    scrollButton.addEventListener('click', () => {
        const nextIndex = (currentSectionIndex + 1) % sections.length;
        scrollToSection(nextIndex);
    });

    // Add header hide/show functionality
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    // Hide header initially
    header.style.transform = 'translateY(-100%)';
    
    // Add a small delay before allowing the header to show
    setTimeout(() => {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Show header when scrolling up or at the top
            if (currentScroll <= 0) {
                header.style.transform = 'translateY(0)';
            } else if (currentScroll > lastScroll) {
                // Scrolling down - hide header
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show header
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }, 500); // Half second delay

    // Add form submission handler
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const subject = document.getElementById('subjectInput').value;
        const message = document.getElementById('messageInput').value;
        
        // Create mailto link
        const mailtoLink = `mailto:v.lilla@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        window.location.href = mailtoLink;
    });
});

