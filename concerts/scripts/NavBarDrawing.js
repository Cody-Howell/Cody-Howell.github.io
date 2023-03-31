document.addEventListener('DOMContentLoaded', function() {
    let navbar = document.querySelector("body header");
    navbar.innerHTML = `
    <nav class="navbar">
    <a href="/concerts/index.html"><img src="/images/Treble clef.svg" alt="Treble Logo" class="logo"></a>
    <ul class="nav-options">
        <li><a href="/concerts/index.html">Concerts</a></li>
        <li><a href="/concerts/calendar.html">Calendar</a></li>
        <li><a href="/concerts/about.html">About</a></li>
    </ul>
    </nav>`;
});