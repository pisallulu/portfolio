document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinksContainer = document.querySelector('.site-nav .nav-links');
    const navLinks = document.querySelectorAll('.site-nav .nav-links a');
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('form-toast');

    function setTheme(name){
        htmlEl.setAttribute('data-theme', name);
        localStorage.setItem('theme', name);
        // update icon
        if(themeToggle){
            themeToggle.innerHTML = name === 'dark' ? '<i class="fa-regular fa-sun"></i>' : '<i class="fa-regular fa-moon"></i>';
        }
    }

    // initialize theme from localStorage or prefers-color-scheme
    const stored = localStorage.getItem('theme');
    if(stored) setTheme(stored);
    else setTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light');

    if(themeToggle){
        themeToggle.addEventListener('click', () => {
            const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setTheme(next);
        });
    }

    // Smooth scroll with header offset
    navLinks.forEach(link => {
        link.addEventListener('click', (e)=>{
            e.preventDefault();
            const href = link.getAttribute('href');
            if(!href || !href.startsWith('#')) return;
            const id = href.slice(1);
            const target = document.getElementById(id);
            if(target){
                const headerHeight = header ? header.getBoundingClientRect().height : 0;
                const top = window.pageYOffset + target.getBoundingClientRect().top - headerHeight - 12;
                window.scrollTo({top,behavior:'smooth'});
            }
            // close mobile nav
            if(navLinksContainer && navLinksContainer.classList.contains('open')){
                navLinksContainer.classList.remove('open');
                navToggle.setAttribute('aria-expanded','false');
            }
        });
    });

    // Nav toggle open/close
    if(navToggle && navLinksContainer){
        navToggle.addEventListener('click', (e)=>{
            const open = navLinksContainer.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        // close on outside click
        document.addEventListener('click', (evt)=>{
            if(!evt.target.closest('.site-nav') && !evt.target.closest('.nav-toggle') && navLinksContainer.classList.contains('open')){
                navLinksContainer.classList.remove('open');
                navToggle.setAttribute('aria-expanded','false');
            }
        });

        // close on Escape
        document.addEventListener('keydown', (evt)=>{
            if(evt.key === 'Escape' && navLinksContainer.classList.contains('open')){
                navLinksContainer.classList.remove('open');
                navToggle.setAttribute('aria-expanded','false');
            }
        });
    }

    // Small UX: hover/touch effects for project cards and icons (keep CSS-driven where possible)
    document.querySelectorAll('.project-card').forEach(card=>{
        card.addEventListener('mouseenter', ()=> card.classList.add('hover'));
        card.addEventListener('mouseleave', ()=> card.classList.remove('hover'));
    });

    // Contact form — send real email via backend
    if(contactForm && toast){
        contactForm.addEventListener('submit', async (e)=>{
            e.preventDefault();
            const name = contactForm.querySelector('input[name="name"]').value;
            const email = contactForm.querySelector('input[name="email"]').value;
            const message = contactForm.querySelector('textarea[name="message"]').value;
            
            try{
                const res = await fetch('/send-email', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({name, email, message})
                });
                if(res.ok){
                    toast.hidden = false;
                    toast.textContent = '✓ Message sent — thank you!';
                    toast.style.color = '#4ade80';
                    contactForm.reset();
                }else{
                    toast.hidden = false;
                    toast.textContent = '✗ Error sending message. Try again.';
                    toast.style.color = '#ef4444';
                }
            }catch(err){
                console.error(err);
                toast.hidden = false;
                toast.textContent = '✗ Error. Make sure backend is running.';
                toast.style.color = '#ef4444';
            }
            setTimeout(()=>{toast.hidden = true},4000);
        });
    }

    console.log('Portfolio interactivity loaded successfully!');
});