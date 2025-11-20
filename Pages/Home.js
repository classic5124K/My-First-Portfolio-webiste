// --- Navigation and Hero Animation (from original file) ---
        const navbar = document.getElementById('navbar');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.querySelector('.nav-links'); // Get desktop links for cloning

        // GSAP Registration for ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        document.addEventListener('DOMContentLoaded', () => {
            
            // --- Navbar / Mobile Toggle ---
            mobileMenuButton.addEventListener('click', () => {
                mobileMenuButton.classList.toggle('active');
                // Use classList.toggle for better CSS control
                if (mobileMenu.style.display === 'block') {
                    mobileMenu.style.display = 'none';
                } else {
                    mobileMenu.style.display = 'block';
                }
            });

            // Close mobile menu on link click
            document.querySelectorAll('#mobile-menu a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.style.display = 'none';
                    mobileMenuButton.classList.remove('active');
                });
            });

            // Navbar scroll effect
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            // --- Home Section GSAP Animation ---
            gsap.from(".hero-title, .animated-text-fill, .hero-subtitle", {
                y: 20,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "power3.out",
                delay: 0.3
            });
            
            // --- ABOUT Section GSAP ScrollTrigger Animation ---
            gsap.to("#about .glass-container, #about .dots-menu, #about .pull-focus-container", {
                scrollTrigger: {
                    trigger: "#about",
                    start: "top center+=100", 
                    toggleActions: "play none none none",
                    // markers: true // Uncomment for debugging
                },
                y: 0, 
                opacity: 1, 
                duration: 1.2,
                stagger: 0.2,
                ease: "power2.out"
            });
            
            // --- Multi-Page Navigation Logic ---
            const wrapper = document.querySelector('.content-wrapper');
            const pageNumberSpan = document.getElementById('page-number');
            const prevArrow = document.getElementById('prev-page');
            const nextArrow = document.getElementById('next-page');
            const totalPages = 7; // Total number of pages
            const control = document.querySelector('.control');
            const marquees = document.querySelectorAll('.marquee');
            let currentPage = 1;

            function updateSlider() {
                const offset = (currentPage - 1) * -100;
                if (wrapper) {
                     wrapper.style.transform = `translateX(${offset}%)`;
                }
               
                if (pageNumberSpan) {
                     pageNumberSpan.textContent = `${currentPage} of ${totalPages}`;
                }

                if (prevArrow && nextArrow) {
                     // Update arrow states
                    prevArrow.classList.toggle('disabled', currentPage === 1);
                    nextArrow.classList.toggle('disabled', currentPage === totalPages);
                }
            }

            function navigate(direction) {
                let newPage = currentPage + direction;
                if (newPage >= 1 && newPage <= totalPages) {
                    currentPage = newPage;
                    updateSlider();
                }
            }

            // Event listeners for navigation
            if (prevArrow) {
                prevArrow.addEventListener('click', () => {
                    if (currentPage > 1) {
                        navigate(-1);
                    }
                });
            }

            if (nextArrow) {
                 nextArrow.addEventListener('click', () => {
                    if (currentPage < totalPages) {
                        navigate(1);
                    }
                });
            }

            // Initialize slider state
            updateSlider();

            // --- Particle animation script ---
            (function() {
                var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

                initHeader();
                initAnimation();
                addListeners();

                function initHeader() {
                    width = window.innerWidth;
                    height = window.innerHeight;
                    target = {x: width/2, y: height/2};

                    largeHeader = document.getElementById('large-header');
                    largeHeader.style.height = height+'px';

                    canvas = document.getElementById('demo-canvas');
                    canvas.width = width;
                    canvas.height = height;
                    ctx = canvas.getContext('2d');

                    points = [];
                    for(var x = 0; x < width; x = x + width/20) {
                        for(var y = 0; y < height; y = y + height/20) {
                            var px = x + Math.random()*width/20;
                            var py = y + Math.random()*height/20;
                            var p = {x: px, originX: px, y: py, originY: py };
                            points.push(p);
                        }
                    }

                    for(var i = 0; i < points.length; i++) {
                        var closest = [];
                        var p1 = points[i];
                        for(var j = 0; j < points.length; j++) {
                            var p2 = points[j]
                            if(!(p1 == p2)) {
                                var placed = false;
                                for(var k = 0; k < 5; k++) {
                                    if(!placed) {
                                        if(closest[k] == undefined) {
                                            closest[k] = p2;
                                            placed = true;
                                        }
                                    }
                                }

                                for(var k = 0; k < 5; k++) {
                                    if(!placed) {
                                        if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                            closest[k] = p2;
                                            placed = true;
                                        }
                                    }
                                }
                            }
                        }
                        p1.closest = closest;
                    }

                    for(var i in points) {
                        var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
                        points[i].circle = c;
                    }
                }

                function addListeners() {
                    if(!('ontouchstart' in window)) {
                        window.addEventListener('mousemove', mouseMove);
                    }
                    window.addEventListener('scroll', scrollCheck);
                    window.addEventListener('resize', resize);
                }

                function mouseMove(e) {
                    var posx = posy = 0;
                    if (e.pageX || e.pageY) {
                        posx = e.pageX;
                        posy = e.pageY;
                    }
                    else if (e.clientX || e.clientY)    {
                        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                    }
                    target.x = posx;
                    target.y = posy;
                }

                function scrollCheck() {
                    // Check if window is below the fold of the hero section
                    if(window.scrollY > height - 100) animateHeader = false;
                    else animateHeader = true;
                }

                function resize() {
                    width = window.innerWidth;
                    height = window.innerHeight;
                    largeHeader.style.height = height+'px';
                    canvas.width = width;
                    canvas.height = height;
                }

                function initAnimation() {
                    animate();
                    for(var i in points) {
                        shiftPoint(points[i]);
                    }
                }

                function animate() {
                    if(animateHeader) {
                        ctx.clearRect(0,0,width,height);
                        for(var i in points) {
                            if(Math.abs(getDistance(target, points[i])) < 4000) {
                                points[i].active = 0.3;
                                points[i].circle.active = 0.6;
                            } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                                points[i].active = 0.1;
                                points[i].circle.active = 0.3;
                            } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                                points[i].active = 0.02;
                                points[i].circle.active = 0.1;
                            } else {
                                points[i].active = 0;
                                points[i].circle.active = 0;
                            }

                            drawLines(points[i]);
                            points[i].circle.draw();
                        }
                    }
                    requestAnimationFrame(animate);
                }

                function shiftPoint(p) {
                    gsap.to(p, {
                        duration: 1+1*Math.random(), 
                        x: p.originX-50+Math.random()*100,
                        y: p.originY-50+Math.random()*100, 
                        ease: "power2.inOut",
                        onComplete: function() {
                            shiftPoint(p);
                        }});
                }

                function drawLines(p) {
                    if(!p.active) return;
                    for(var i in p.closest) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p.closest[i].x, p.closest[i].y);
                        ctx.strokeStyle = 'rgba(157, 195, 247,'+ p.active+')';
                        ctx.stroke();
                    }
                }

                function Circle(pos,rad,color) {
                    var _this = this;

                    (function() {
                        _this.pos = pos || null;
                        _this.radius = rad || null;
                        _this.color = color || null;
                    })();

                    this.draw = function() {
                        if(!_this.active) return;
                        ctx.beginPath();
                        ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
                        ctx.fillStyle = 'rgba(157, 195, 247,'+ _this.active+')';
                        ctx.fill();
                    };
                }

                function getDistance(p1, p2) {
                    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
                }
            })(); 

            // --- Vanilla Tilt Initialization (NEW) ---
            if (typeof VanillaTilt !== 'undefined') {
                VanillaTilt.init(document.querySelectorAll(".container-portfolio .card"), {
                    max: 25,
                    speed: 400,
                    glare: true,
                    "max-glare": 0.5,
                });
            }

            // --- Marquee Toggle Logic ---
            if (control && wrapper) {
                control.addEventListener("click", () => {
                    control.classList.toggle("toggle--vertical");
                    wrapper.classList.toggle("wrapper--vertical");
                    [...marquees].forEach((marquee) =>
                        marquee.classList.toggle("marquee--vertical")
                    );
                });
            }
            
            // --- Contact Detail Copy Logic (NEW) ---
            document.getElementById('contact-email').addEventListener('click', function(e) {
                e.preventDefault();
                const email = this.textContent;
                // Use document.execCommand('copy') for better compatibility in iframe environments
                const tempTextarea = document.createElement('textarea');
                tempTextarea.value = email;
                document.body.appendChild(tempTextarea);
                tempTextarea.select();
                document.execCommand('copy');
                document.body.removeChild(tempTextarea);
                alert('Email copied to clipboard!'); // Used as temporary, visible feedback
            });
            
            document.getElementById('contact-phone').addEventListener('click', function(e) {
                // Keep default behavior (tel: link) but add visible feedback
                alert('Phone number ready to dial or copy!'); 
            });
            
            // --- FEATURED CONTENT SLIDER LOGIC (REBUILT FOR SCROLL & CLICK) ---
            const sliderContainer = document.querySelector('#featured-slider-section .slider-container');
            if (sliderContainer) {
                const slider = sliderContainer.querySelector(".slider");
                const sections = gsap.utils.toArray("#featured-slider-section .box");
                const trail = sliderContainer.querySelector(".trail");
                const navButtons = sliderContainer.querySelectorAll(".prev, .next");

                // Create the main horizontal scroll animation
                let scrollTween = gsap.to(sections, {
                    xPercent: -100 * (sections.length - 1),
                    ease: "none",
                    scrollTrigger: {
                        trigger: "#featured-slider-section",
                        pin: true,
                        scrub: 0.5,
                        snap: 1 / (sections.length - 1),
                        start: "top top",
                        end: () => "+=" + (slider.offsetWidth - innerWidth)
                    }
                });

                // Animate the trail indicators based on scroll progress
                gsap.to(trail, {
                    scrollTrigger: {
                        trigger: "#featured-slider-section",
                        start: "top top",
                        end: () => "+=" + (slider.offsetWidth - innerWidth),
                        scrub: true,
                        onUpdate: self => {
                            const progress = self.progress;
                            const activeIndex = Math.round(progress * (sections.length - 1));
                            trail.querySelectorAll('div').forEach((dot, index) => {
                                dot.classList.toggle('active', index === activeIndex);
                            });
                        }
                    }
                });

                // Add click events to trail indicators
                trail.querySelectorAll('div').forEach((dot, index) => {
                    dot.addEventListener('click', () => {
                        const targetProgress = index / (sections.length - 1);
                        const targetScroll = scrollTween.scrollTrigger.start + (scrollTween.scrollTrigger.end - scrollTween.scrollTrigger.start) * targetProgress;
                        gsap.to(window, {
                            scrollTo: targetScroll,
                            duration: 1,
                            ease: 'power2.inOut'
                        });
                    });
                });

                // Add click events to next/prev buttons
                navButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const direction = button.classList.contains('next') ? 1 : -1;
                        const currentProgress = scrollTween.scrollTrigger.progress;
                        const currentIndex = Math.round(currentProgress * (sections.length - 1));
                        const nextIndex = gsap.utils.clamp(0, sections.length - 1, currentIndex + direction);
                        
                        const targetProgress = nextIndex / (sections.length - 1);
                        const targetScroll = scrollTween.scrollTrigger.start + (scrollTween.scrollTrigger.end - scrollTween.scrollTrigger.start) * targetProgress;
                        
                        gsap.to(window, {
                            scrollTo: targetScroll,
                            duration: 1,
                            ease: 'power2.inOut'
                        });
                    });
                });
            }

            // --- Hero Flip Card Logic (using Flippy.js) ---
            const heroFlipCard = document.querySelector('.hero-flip-card');
            if (heroFlipCard) {
                flippy.bind(heroFlipCard, {
                    flip: 'hover', // Flip on hover
                    duration: 800, // Corresponds to your CSS transition time
                    direction: 'horizontal' // Flips along the Y-axis
                });
            }

        });
