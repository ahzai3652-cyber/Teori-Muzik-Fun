@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Outfit", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Playfair Display", ui-serif, Georgia, serif;
}

@layer base {
  body {
    @apply antialiased overflow-x-hidden;
  }
}

@layer components {
  .glass {
    @apply bg-white/10 backdrop-blur-md border border-white/20;
  }
}

/* Custom print styles for the certificate */
@media print {
  body * {
    visibility: hidden;
  }
  .bg-white, .bg-white * {
    visibility: visible;
  }
  .bg-white {
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
  }
  button {
    display: none !important;
  }
}
