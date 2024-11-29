document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Zamknij wszystkie aktywne elementy
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('p').classList.remove('active');
            });

            // Jeśli kliknięty element nie był aktywny, otwórz go
            if (!isActive) {
                item.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
}); 