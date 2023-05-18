let navbar = document.querySelector("body header");
navbar.innerHTML = `
<nav>
    <a href="/index.html"><img src="/images/ProfilePictureDiscord.png"></a>
    <div class="NavList">
        <img src="/images/Hamburger Menu.svg" class="NavButton show">
        <ul>
            <a href="/concerts/index.html"><li>Concerts</li></a> 
            <a href="/copywriting/index.html"><li>Copywriting</li></a>
            <a href="/blog/index.html"><li>Blog</li></a> 
        </ul>
    </div>
</nav>`;

let button = document.querySelector(".NavButton");
button.addEventListener('click', function() {
    let list = document.querySelector(".NavList ul");
    list.classList.toggle('show');
    button.classList.toggle('show');
});
