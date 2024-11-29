document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Dezaktywuj przycisk podczas wysyłania
        submitButton.disabled = true;
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || 'Wiadomość została wysłana. Dziękujemy za kontakt!');
                contactForm.reset();
            } else {
                throw new Error(result.error || 'Błąd podczas wysyłania wiadomości');
            }
        } catch (error) {
            console.error('Błąd:', error);
            alert(error.message || 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później.');
        } finally {
            // Aktywuj przycisk po zakończeniu
            submitButton.disabled = false;
        }
    });
}); 