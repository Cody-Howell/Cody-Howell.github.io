document.addEventListener('DOMContentLoaded', function() {
    let navbar = document.querySelector("body header");
    navbar.innerHTML = `
    <nav class="navbar">
    <a href="/newConcerts/Testindex.html"><img src="/images/Treble clef.svg" alt="Treble Logo" class="logo"></a>
    <ul class="nav-options">
        <li><a href="/newConcerts/Testindex.html">Concerts</a></li>
        <li><a href="/newConcerts/Testcalendar.html">Calendar</a></li>
        <li><a href="/newConcerts/Testabout.html">About</a></li>
    </ul>
    </nav>`;
});