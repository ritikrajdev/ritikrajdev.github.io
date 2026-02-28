import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedLogo } from './components/AnimatedLogo';
import { ProjectCard } from './components/ProjectCard';
import { ArrowDown, Github, Linkedin, Mail, FileDown, X, Menu } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Chrono } from 'react-chrono';
import 'swiper/css';
import resumePdf from '@/assets/resume_ritik_rajdev.pdf';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allowSwipe, setAllowSwipe] = useState(true);
  const swiperRef = useRef<SwiperType | null>(null);
  const touchStartY = useRef(0);

  // Handle touch start to record initial position
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  // Handle touch move to determine swipe vs scroll
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const slideElement = e.currentTarget as HTMLElement;
    const touchCurrentY = e.touches[0].clientY;
    const deltaY = touchStartY.current - touchCurrentY;
    const isScrollingDown = deltaY > 0;
    const isScrollingUp = deltaY < 0;

    const { scrollTop, scrollHeight, clientHeight } = slideElement;
    const isScrollable = scrollHeight > clientHeight;

    if (!isScrollable) {
      // Content fits in viewport, allow swipe
      setAllowSwipe(true);
      return;
    }

    const atTop = scrollTop <= 5;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 5;

    // Only allow swipe when at edge and trying to go beyond
    if ((isScrollingUp && atTop) || (isScrollingDown && atBottom)) {
      setAllowSwipe(true);
    } else {
      setAllowSwipe(false);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    // Reset to allow swipe after touch ends
    setTimeout(() => setAllowSwipe(true), 100);
  }, []);

  // Debounce ref to prevent rapid slide changes
  const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSliding = useRef(false);

  // Handle wheel event at container level - manually control slide navigation
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!swiperRef.current || isSliding.current) return;

    const swiper = swiperRef.current;
    const activeSlide = swiper.slides[swiper.activeIndex] as HTMLElement;
    if (!activeSlide) return;

    const { scrollTop, scrollHeight, clientHeight } = activeSlide;
    const isScrollable = scrollHeight > clientHeight + 10;
    const atTop = scrollTop <= 5;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 5;
    const isScrollingDown = e.deltaY > 0;
    const isScrollingUp = e.deltaY < 0;

    // If content is scrollable and not at edge, let native scroll happen
    if (isScrollable && !((isScrollingUp && atTop) || (isScrollingDown && atBottom))) {
      return;
    }

    // Debounce slide transitions
    if (wheelTimeout.current) {
      clearTimeout(wheelTimeout.current);
    }

    // At edge or no scrollable content - navigate slides
    if (isScrollingDown && swiper.activeIndex < swiper.slides.length - 1) {
      isSliding.current = true;
      swiper.slideNext();
      wheelTimeout.current = setTimeout(() => {
        isSliding.current = false;
      }, 700);
    } else if (isScrollingUp && swiper.activeIndex > 0) {
      isSliding.current = true;
      swiper.slidePrev();
      wheelTimeout.current = setTimeout(() => {
        isSliding.current = false;
      }, 700);
    }
  }, []);

  // Update swiper allowTouchMove when allowSwipe changes
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.allowTouchMove = allowSwipe;
    }
  }, [allowSwipe]);

  const scrollToSection = (sectionId: string) => {
    const sectionIndex = navItems.findIndex((item) => item.id === sectionId);
    if (sectionIndex >= 0) {
      swiperRef.current?.slideTo(sectionIndex);
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects & Open Source' },
    { id: 'contact', label: 'Contact' }
  ];

  const experienceItems = [
    {
      title: 'May 2025 \n-\n Current',
      cardTitle: 'Software Engineer',
      cardSubtitle: 'HashiCorp (IBM) · Remote',
      cardDetailedText: 'Owned CLA-Assistant (5K+ repos, 10K+ weekly requests). Led incident response, DB migrations, and throughput optimizations. Go, Python, AWS, Terraform.'
    },
    {
      title: 'Jan 2024 \n-\n Apr 2025',
      cardTitle: 'Junior Software Engineer',
      cardSubtitle: 'McKinsey & Company · Bangalore',
      cardDetailedText: 'Built scalable apps for 17 countries. Reduced bugs by 20%. Developed GenAI design-to-code tooling. React Native, Next.js, FastAPI, Azure.'
    },
    {
      title: 'Jul 2023 \n-\n Nov 2023',
      cardTitle: 'Software Engineer',
      cardSubtitle: 'Timestream Technologies · Noida',
      cardDetailedText: 'Built supply-chain platform for 500+ pharmacies. Improved search latency from 4s to 200ms. Node.js, Express, MySQL, Elasticsearch.'
    },
    {
      title: 'Jan 2023 \n-\n Jul 2023',
      cardTitle: 'Software Engineer Intern',
      cardSubtitle: 'McKinsey & Company · Bangalore',
      cardDetailedText: 'Built Figma-to-code platform reducing POC time by 80%. Top 5% performer. React, Node.js, TypeScript, PostgreSQL, Docker, AWS.'
    }
  ];

  const isScrolled = activeSection !== 'home';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0e27', color: '#f3f4f6' }}>
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: isScrolled ? 'rgba(17, 24, 39, 0.95)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(75, 85, 99, 0.3)' : 'none',
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <AnimatedLogo />

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="transition-colors duration-300 hover:text-teal-500"
                style={{ color: activeSection === item.id ? '#14b8a6' : '#9ca3af' }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-400 hover:text-teal-500 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(10, 14, 39, 0.95)', backdropFilter: 'blur(10px)' }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="relative h-full flex flex-col items-center justify-center gap-8"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: -50 }}
              transition={{ duration: 0.3 }}
            >
              {navItems.map((item, idx) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-2xl transition-colors duration-300"
                  style={{ color: activeSection === item.id ? '#14b8a6' : '#9ca3af' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div onWheel={handleWheel} className="h-screen">
        <Swiper
          direction="vertical"
          modules={[Keyboard, A11y]}
          slidesPerView={1}
          speed={700}
          allowTouchMove={allowSwipe}
          keyboard={{ enabled: true }}
          className="h-screen"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setActiveSection(navItems[swiper.activeIndex]?.id ?? 'home');
          }}
          onSlideChange={(swiper) => {
            setActiveSection(navItems[swiper.activeIndex]?.id ?? 'home');
          }}
        >
          <SwiperSlide className="h-screen overflow-y-auto" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            {/* Hero Section */}
            <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-20">
              <div className="max-w-4xl mx-auto text-center">
                <motion.h1
                  className="mb-6"
                  style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    lineHeight: '1.2',
                    color: '#f3f4f6'
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Systems that <span className="text-teal-500">scale</span>.
                  <br />
                  <span className="text-teal-500">Reliability</span> that matters.
                </motion.h1>

                <motion.p
                  className="text-xl mb-12"
                  style={{ color: '#9ca3af', lineHeight: '1.7' }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  3+ years building production systems at scale
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <a
                    href="mailto:ritikrajdev761@gmail.com"
                    className="px-8 py-4 rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#14b8a6', color: '#0a0e27' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0d9488';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(20, 184, 166, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#14b8a6';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Mail size={20} />
                    Email Me
                  </a>

                  <a
                    href={resumePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-lg border transition-all duration-300 inline-flex items-center justify-center gap-2"
                    style={{ borderColor: '#14b8a6', color: '#14b8a6' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(20, 184, 166, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <FileDown size={20} />
                    Resume
                  </a>
                </motion.div>

                <motion.div
                  className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowDown size={24} style={{ color: '#4b5563' }} />
                </motion.div>
              </div>
            </section>
          </SwiperSlide>

          <SwiperSlide className="h-screen overflow-y-auto" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            {/* About Section */}
            <section id="about" className="py-32 px-6">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-4xl mb-16 text-center" style={{ color: '#f3f4f6' }}>
                    About
                  </h2>
                </motion.div>

                {/* About Me */}
                <motion.div
                  className="mb-20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-2xl mb-6" style={{ color: '#14b8a6' }}>About Me</h3>
                  <div className="space-y-6" style={{ color: '#9ca3af', lineHeight: '1.8' }}>
                    <p>
                      I'm a software engineer who finds joy in solving complex distributed systems challenges. My journey into technology started with a curiosity about how large-scale systems handle millions of requests without breaking a sweat. That curiosity turned into a career building exactly those kinds of systems.
                    </p>
                    <p>
                      Over the past three years at HashiCorp and McKinsey, I've had the privilege of working on systems that millions of developers rely on. From building merge-blocking services that protect code quality to creating tools that accelerate product development, I've learned that great engineering is as much about reliability and observability as it is about writing code.
                    </p>
                    <p>
                      When I'm not debugging production issues or optimizing system performance, you'll find me contributing to open source, exploring new distributed systems patterns, or mentoring junior engineers. I believe the best way to grow as an engineer is to share knowledge and learn from others.
                    </p>
                  </div>
                </motion.div>

                {/* The Craft */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h3 className="text-2xl mb-6" style={{ color: '#14b8a6' }}>The Craft</h3>
                  <div className="space-y-6" style={{ color: '#9ca3af', lineHeight: '1.8' }}>
                    <p>
                      My technical focus centers on building scalable systems that maintain reliability under pressure. I specialize in distributed systems architecture, microservices design, and implementing robust observability solutions that give teams the insights they need to maintain system health.
                    </p>
                    <p>
                      At HashiCorp, I architected and maintained a merge-blocking CLA service handling over 10,000 weekly requests across 5,000+ repositories. This work required deep expertise in Node js, AWS infrastructure, and comprehensive monitoring with Datadog. The system's reliability directly impacts developer productivity across the entire HashiCorp ecosystem.
                    </p>
                    <p>
                      I'm particularly passionate about incident response and system reliability. I believe that building resilient systems isn't just about preventing failures; it's about designing systems that fail gracefully, provide clear diagnostic information, and recover quickly. Every system will face issues; the question is whether you've built it to handle them effectively.
                    </p>
                  </div>
                </motion.div>
              </div>
            </section>
          </SwiperSlide>

          <SwiperSlide className="h-screen overflow-y-auto" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            {/* Experience Section */}
            <section id="experience" className="px-6 pt-24 pb-10">
              <div className="max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-4xl mb-10 text-center" style={{ color: '#f3f4f6' }}>
                    Experience
                  </h2>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Chrono
                    items={experienceItems}
                    mode="VERTICAL"
                    disableToolbar
                    hideControls
                    useReadMore={false}
                    cardHeight={100}
                    scrollable={false}
                    theme={{
                      primary: '#14b8a6',
                      secondary: '#111827',
                      cardBgColor: '#111827',
                      cardForeColor: '#f3f4f6',
                      titleColor: '#14b8a6',
                      titleColorActive: '#14b8a6',
                      cardTitleColor: '#f3f4f6',
                      cardSubtitleColor: '#9ca3af',
                      cardDetailsColor: '#d1d5db'
                    }}
                    classNames={{
                      card: 'border border-gray-700 rounded-lg',
                      cardMedia: 'rounded-lg',
                      cardSubTitle: 'text-sm',
                      cardText: 'text-base leading-relaxed',
                      cardTitle: 'text-xl font-semibold',
                      title: 'font-mono text-sm'
                    }}
                  />
                </motion.div>
              </div>
            </section>
          </SwiperSlide>

          <SwiperSlide className="h-screen overflow-y-auto" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            {/* Projects Section */}
            <section id="projects" className="py-32 px-6">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-4xl mb-16 text-center" style={{ color: '#f3f4f6' }}>
                    Featured Projects
                  </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                  <ProjectCard
                    title="CLA-Assistant"
                    description="Architected and maintained a critical merge-blocking service at HashiCorp that ensures contributor compliance across the entire repository ecosystem. Handles 10,000+ weekly requests with 99.9% uptime, serving as a gatekeeper for code contributions across 5,000+ repositories."
                    tech={['Go', 'Python', 'AWS', 'Datadog', 'Nomad', 'GitHub APIs']}
                    impact="🎯 10K+ weekly requests • 5K+ repositories protected"
                  />

                  <ProjectCard
                    title="Figma-to-Code"
                    description="Built an innovative design-to-code automation tool at McKinsey that bridges the gap between design and development. The platform automatically generates production-ready code from Figma designs, dramatically accelerating the proof-of-concept development cycle."
                    tech={['React', 'Node.js', 'TypeScript', 'AWS', 'Figma API']}
                    impact="⚡ 80% reduction in POC development time"
                  />
                </div>

                <motion.div
                  className="mt-24"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-4xl mb-16 text-center" style={{ color: '#f3f4f6' }}>
                    Open Source Contributions
                  </h2>
                </motion.div>

                <motion.div
                  className="mb-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <a
                    href="https://github.com/ritikrajdev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-lg transition-colors duration-300"
                    style={{ color: '#14b8a6' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#0d9488'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#14b8a6'}
                  >
                    <Github size={24} />
                    View GitHub Profile
                  </a>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                  <ProjectCard
                    title="hashicorp/go-multierror"
                    description="A Go library for representing a list of errors as a single error. Widely used across HashiCorp's ecosystem and the broader Go community for elegant error aggregation and management in concurrent systems."
                    tech={['Go', 'Error Handling', 'Concurrency']}
                  />

                  <ProjectCard
                    title="hashicorp/copywrite"
                    description="A command-line tool for managing copyright headers and license files in repositories. Automates compliance requirements and ensures consistent copyright information across large codebases."
                    tech={['Go', 'CLI', 'Automation', 'License Management']}
                  />
                </div>
              </div>
            </section>
          </SwiperSlide>

          <SwiperSlide className="h-screen" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            <div className="h-full flex flex-col">
              {/* Contact Section */}
              <section id="contact" className="flex-1 flex items-center justify-center px-6 pt-20">
                <div className="max-w-4xl mx-auto text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-4xl mb-8" style={{ color: '#f3f4f6' }}>
                      Let's Connect
                    </h2>
                    <p className="text-xl mb-12" style={{ color: '#9ca3af', lineHeight: '1.7' }}>
                      Always interested in discussing scalable systems and reliability challenges.
                      <br />
                      Whether you're hiring or just want to talk tech, I'd love to hear from you.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                      <a
                        href="mailto:ritikrajdev761@gmail.com"
                        className="px-8 py-4 rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#14b8a6', color: '#0a0e27' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#0d9488';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#14b8a6';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <Mail size={20} />
                        Email Me
                      </a>

                      <a
                        href={resumePdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 rounded-lg border transition-all duration-300 inline-flex items-center justify-center gap-2"
                        style={{ borderColor: '#14b8a6', color: '#14b8a6' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(20, 184, 166, 0.1)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <FileDown size={20} />
                        Resume
                      </a>
                    </div>

                    <div className="flex gap-6 justify-center">
                      <a
                        href="https://github.com/ritikrajdev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-300"
                        style={{ color: '#9ca3af' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                      >
                        <Github size={28} />
                      </a>
                      <a
                        href="https://linkedin.com/in/ritikrajdev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-300"
                        style={{ color: '#9ca3af' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                      >
                        <Linkedin size={28} />
                      </a>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Footer */}
              <footer className="py-8 px-6 border-t" style={{ borderColor: '#1f2937' }}>
                <div className="max-w-6xl mx-auto text-center">
                  <div className="flex justify-center mb-4">
                    <AnimatedLogo />
                  </div>
                  <p style={{ color: '#6b7280' }}>
                    © 2026 Ritik Rajdev. Built with React, Motion, and Tailwind CSS.
                  </p>
                </div>
              </footer>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}
