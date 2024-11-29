document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = this.querySelector('input[type="email"]').value;
            const preferences = Array.from(this.querySelectorAll('input[name="preferences"]:checked'))
                .map(checkbox => checkbox.value);
            const consent = this.querySelector('input[name="consent"]').checked;

            if (consent) {
                // Tutaj możesz dodać kod do wysłania danych do backend'u
                console.log('Newsletter signup:', {
                    email,
                    preferences,
                    consent
                });

                // Przykładowe potwierdzenie
                alert('Dziękujemy za zapisanie się do newslettera!');
                this.reset();
            }
        });
    }
}); 