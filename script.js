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

    // Scroll reveal for sections
    sections.forEach(section => {
        section.classList.add('reveal');
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        },
        {
            threshold: 0.2,
        }
    );

    sections.forEach(section => observer.observe(section));

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

