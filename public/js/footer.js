document.addEventListener('DOMContentLoaded', function() {
    const footerHeadings = document.querySelectorAll('.footer-heading');
    
    footerHeadings.forEach(heading => {
        heading.addEventListener('click', function() {
            // Znajdź najbliższą listę ul
            const ul = this.nextElementSibling;
            // Przełącz klasę active dla listy
            ul.classList.toggle('active');
            // Przełącz klasę dla ikony
            const icon = this.querySelector('.footer-toggle');
            icon.classList.toggle('rotate');
        });
    });
}); 