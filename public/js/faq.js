document.addEventListener('DOMContentLoaded', function() {
    // Obsługa pytań FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

    // Obsługa kategorii
    const categoryButtons = document.querySelectorAll('.category-btn');
    const faqContainer = document.querySelector('.faq-container');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Usuń klasę active ze wszystkich przycisków
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Dodaj klasę active do klikniętego przycisku
            button.classList.add('active');

            const category = button.dataset.category;
            const items = faqContainer.querySelectorAll('.faq-item');

            items.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}); 