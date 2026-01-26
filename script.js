// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Theme Switcher
const themeBtn = document.getElementById('theme-btn');
const themeMenu = document.getElementById('theme-menu');
const themeOptions = document.querySelectorAll('.theme-option');

// Load saved theme
const savedTheme = localStorage.getItem('portfolio-theme') || 'iot-dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// Mark active theme
themeOptions.forEach(option => {
    if (option.getAttribute('data-theme') === savedTheme) {
        option.classList.add('active');
    }
});

// Toggle theme menu
themeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeMenu.classList.toggle('active');
});

// Close theme menu when clicking outside
document.addEventListener('click', (e) => {
    if (!themeMenu.contains(e.target) && !themeBtn.contains(e.target)) {
        themeMenu.classList.remove('active');
    }
});

// Change theme
themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        const theme = option.getAttribute('data-theme');
        
        // Update theme
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        
        // Update active state
        themeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        // Close menu
        themeMenu.classList.remove('active');
        
        // Update circuit canvas color
        updateCircuitColor(theme);
    });
});

// Update circuit canvas color based on theme
function updateCircuitColor(theme) {
    const themeColors = {
        'iot-dark': '#00d9ff',
        'purple-haze': '#b19cd9',
        'ocean-blue': '#4dd0e1',
        'forest-green': '#66bb6a',
        'sunset-orange': '#ff9800'
    };
    
    if (window.circuit) {
        window.circuit.color = themeColors[theme] || '#00d9ff';
    }
}

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger to X
    hamburger.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Active Navigation Link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Typing Effect
const typedTextSpan = document.querySelector('.typed-text');
const textArray = ['IoT Developer','Cloud Integrator'];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, newTextDelay + 250);
});

// Circuit Canvas Animation
const canvas = document.getElementById('circuit-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Circuit {
    constructor() {
        this.nodes = [];
        this.connections = [];
        this.nodeCount = 50;
        this.color = '#00d9ff';
        this.init();
    }

    init() {
        // Create nodes
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: 2
            });
        }
    }

    update() {
        // Update node positions
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        });

        // Clear connections
        this.connections = [];

        // Find connections
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.connections.push({
                        from: this.nodes[i],
                        to: this.nodes[j],
                        opacity: 1 - distance / 150
                    });
                }
            }
        }
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Convert hex color to RGB for dynamic opacity
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 0, g: 217, b: 255 };
        };

        const rgb = hexToRgb(this.color);

        // Draw connections
        this.connections.forEach(conn => {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${conn.opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.moveTo(conn.from.x, conn.from.y);
            ctx.lineTo(conn.to.x, conn.to.y);
            ctx.stroke();
        });

        // Draw nodes
        this.nodes.forEach(node => {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

const circuit = new Circuit();
window.circuit = circuit; // Make it globally accessible for theme changes
circuit.animate();

// Initialize circuit color based on saved theme
const initialTheme = localStorage.getItem('portfolio-theme') || 'iot-dark';
updateCircuitColor(initialTheme);

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    circuit.nodes = [];
    circuit.init();
});

// Counter Animation for Stats
function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    const isDecimal = target % 1 !== 0;
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = isDecimal ? target.toFixed(2) : target;
        }
    };

    updateCounter();
}

// Skill Bar Animation
function animateSkillBar(element) {
    const progress = element.getAttribute('data-progress');
    element.style.width = progress + '%';
}

// Scroll Reveal
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate counters
            if (entry.target.classList.contains('stat-number')) {
                animateCounter(entry.target);
            }
            
            // Animate skill bars
            if (entry.target.classList.contains('skill-progress')) {
                animateSkillBar(entry.target);
            }

            // Add reveal animation
            entry.target.classList.add('active');
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
    // Observe stat numbers
    document.querySelectorAll('.stat-number').forEach(stat => {
        observer.observe(stat);
    });

    // Observe skill bars
    document.querySelectorAll('.skill-progress').forEach(skill => {
        observer.observe(skill);
    });

    // Observe cards for reveal animation
    document.querySelectorAll('.education-card, .project-card, .contact-item, .skill-card, .timeline-item').forEach(card => {
        card.classList.add('reveal');
        observer.observe(card);
    });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add Loading Animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Contact Form Submission using Gmail Compose
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Compose email body with all details
        const emailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        
        // Create Gmail compose URL
        const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&to=prakashkumarg0821@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Open Gmail compose in new tab
        window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
        
        // Show success message
        showMessage('Opening Gmail compose window. Please click send to complete your message.', 'success');
        
        // Reset form after a short delay
        setTimeout(() => {
            contactForm.reset();
        }, 1000);
    });
}

// Show message function
function showMessage(message, type) {
    // Remove any existing messages
    const existingMsg = document.querySelector('.form-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;
    
    // Insert after form
    contactForm.parentNode.insertBefore(messageDiv, contactForm.nextSibling);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Cursor Trail Effect (Optional - IoT theme)
const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll('.circle');

if (circles.length > 0) {
    circles.forEach(function (circle) {
        circle.x = 0;
        circle.y = 0;
    });

    window.addEventListener('mousemove', function (e) {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });

    function animateCircles() {
        let x = coords.x;
        let y = coords.y;

        circles.forEach(function (circle, index) {
            circle.style.left = x - 12 + 'px';
            circle.style.top = y - 12 + 'px';
            circle.style.scale = (circles.length - index) / circles.length;

            circle.x = x;
            circle.y = y;

            const nextCircle = circles[index + 1] || circles[0];
            x += (nextCircle.x - x) * 0.3;
            y += (nextCircle.y - y) * 0.3;
        });

        requestAnimationFrame(animateCircles);
    }

    animateCircles();
}

// Console Easter Egg
console.log('%c👋 Hello, Fellow Developer!', 'color: #00d9ff; font-size: 20px; font-weight: bold;');
console.log('%cLooking for something? Feel free to reach out!', 'color: #7b2ff7; font-size: 14px;');
console.log('%cEmail: prakashkumarg0821@gmail.com', 'color: #b8b8b8; font-size: 12px;');

