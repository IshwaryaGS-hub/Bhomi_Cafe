import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowDown, ArrowRight, ArrowLeft, Play, Pause, X, Menu, Plus, Leaf, Coffee } from 'lucide-react';
import { drinks, chapters } from './content.js';
import BrewScene from './BrewScene.jsx';
import './style.css';
import './theme.css';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
function Brand() {
  return <a className="brand" href="#home" aria-label="Bhoomi — Tea and Kaapi"><span lang="ta">பூமி</span><small>TEA & KAAPI</small></a>;
}
function CupMark({ glass = false }) {
  return <svg className="cup-mark" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M23 12c-5-5 5-5 0-10M33 12c-5-5 5-5 0-10"/>
    {glass ? <><ellipse cx="28" cy="19" rx="13" ry="4"/><path d="m15 19 4 28q9 5 18 0l4-28M22 27l2 15m10-15-2 15"/><path d="M19 47q9 4 18 0"/></> : <><ellipse cx="28" cy="21" rx="13" ry="4"/><path d="m15 21 3 19q10 5 20 0l3-19"/><path d="M16 36c-15 1-15 8 12 8s27-7 12-8M7 41l4 8q17 8 34 0l4-8"/></>}
  </svg>;
}
function Film({ src, poster, paused = false, className = '', label, onEnded, loop = true }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);
  // A fresh URL also bypasses partial responses cached before the server fix.
  const mediaSrc = `${src}${src.includes('?') ? '&' : '?'}v=2`;
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !paused) video.play().catch(() => {});
      else video.pause();
    }, { threshold: .05 });
    observer.observe(video);
    if (paused) video.pause();
    return () => observer.disconnect();
  }, [src, paused]);
  useEffect(() => setFailed(false), [src]);
  return failed ? <img className={className} src={poster} alt={label} /> : <video ref={ref} className={className} src={mediaSrc} poster={poster} autoPlay={!paused} muted playsInline loop={loop} preload="metadata" aria-label={label} onError={() => setFailed(true)} onEnded={onEnded} />;
}
function Dialog({ children, onClose, title, className = '' }) {
  const box = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    box.current.querySelector('button')?.focus();
    const keydown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const controls = [...box.current.querySelectorAll('button, a[href], input')].filter(el => !el.disabled);
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', keydown); previous?.focus(); };
  }, [onClose]);
  return <div className="dialog-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><div ref={box} role="dialog" aria-modal="true" aria-label={title} className={`dialog ${className}`}><button className="dialog-close icon-button" onClick={onClose} aria-label="Close dialog"><X size={22}/></button>{children}</div></div>;
}
function App() {
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [category, setCategory] = useState('tea');
  const [chapter, setChapter] = useState(0);
  const [modal, setModal] = useState(null);
  const [filmChapter, setFilmChapter] = useState(0);
  const [filmPaused, setFilmPaused] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(true);
  const journey = useRef(null);
  const motionRef = useRef(paused);
  useEffect(() => { motionRef.current = paused; }, [paused]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 60);
        const element = journey.current;
        if (element && !motionRef.current) {
          const { top, height } = element.getBoundingClientRect();
          const distance = height - window.innerHeight;
          if (distance > 0 && top <= 0 && -top <= distance) setChapter(Math.min(chapters.length - 1, Math.floor(-top / distance * chapters.length)));
        }
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener('scroll', update); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    if (modal !== 'film' || filmPaused || chapters[filmChapter].video) return;
    const timeout = setTimeout(() => setFilmChapter(c => (c + 1) % chapters.length), 6000);
    return () => clearTimeout(timeout);
  }, [modal, filmChapter, filmPaused]);
  const closeModal = React.useCallback(() => setModal(null), []);
  const openFilm = () => { setFilmChapter(0); setFilmPaused(false); setModal('film'); };
  const changeCategory = value => { setCategory(value); setExpandedMenu(true); };
  const visibleDrinks = drinks.filter(drink => drink.category === category).slice(0, expandedMenu ? 8 : 4);
  const activeChapter = chapters[chapter];
  const currentFilm = chapters[filmChapter];
  return <div className={paused ? 'site motion-paused' : 'site'}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={scrolled ? 'site-header scrolled' : 'site-header'}><Brand/><nav aria-label="Main navigation" className={mobileNav ? 'nav-open' : ''}>{[['Our story', '#story'], ['The journey', '#journey'], ['Our menu', '#menu']].map(([label, href]) => <a key={href} href={href} onClick={() => setMobileNav(false)}>{label}</a>)}</nav><a className="nav-cta" href="#menu">Find your cup <ArrowUpRight size={16}/></a><button className="nav-toggle icon-button" aria-label={mobileNav ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileNav} onClick={() => setMobileNav(!mobileNav)}>{mobileNav ? <X/> : <Menu/>}</button></header>
    <main id="main">
      <section id="home" className="hero">
        <div className="hero-content"><div className="eyebrow"><span className="welcome-dot"/> COME IN. THERE’S A CUP FOR YOU.</div><h1>Tea first.<br/><em>Everything</em><br/>else later.</h1><p>Strong chai. Proper kaapi. Good company.<br/>Pull up a chair — we’ll put the kettle on.</p><div className="hero-actions"><a className="button copper" href="#menu">What’s brewing? <ArrowUpRight size={20}/></a><button className="film-link" onClick={openFilm}><span className="play-ring"><Play size={14} fill="currentColor"/></span> Watch the journey</button></div><div className="hero-tamil" lang="ta">ஒரு டீ குடிக்கலாமா?</div></div>
        <div className="hero-visual"><div className="hero-sticker"><span>LESS HURRY.</span><strong>MORE<br/>KAAPI.</strong><span>THE BHOOMI WAY</span></div><div className="hero-frame"><Film src="/video/pour.mp4" poster="/images/pour-poster.jpg" paused={paused || !!modal} className="hero-film" label="Fresh coffee pouring into a cup in real close-up footage"/><div className="hero-film-caption"><span>FRESHLY POURED.</span><span lang="ta">அன்புடன், பூமி.</span></div></div><span className="hand-note">a proper little pick-me-up ↗</span></div>
        <div className="hero-bottom"><a href="#story" className="scroll-hint"><ArrowDown size={16}/><span>THERE’S MORE DOWN HERE</span></a><button className="motion-control" aria-label={paused ? 'Resume motion' : 'Pause motion'} onClick={() => setPaused(!paused)}>{paused ? <Play size={14}/> : <Pause size={14}/>}<span>{paused ? 'PLAY MOTION' : 'PAUSE MOTION'}</span></button></div>
      </section>
      <div className="brand-strip"><span>CHAI PEOPLE</span><CupMark glass/><span>KAAPI PEOPLE</span><CupMark/><span>YOUR KIND OF PEOPLE</span><CupMark glass/><span lang="ta">வாங்க, பேசலாம்!</span></div>
      <BrewScene paused={paused || !!modal}/>
      <section className="intro section-shell" id="story"><div className="intro-top reveal"><span className="eyebrow">A LITTLE ABOUT US</span><div className="intro-statement"><h2>A quick tea.<br/><em>A long catch-up.</em></h2><p>You know how it goes. “Just one tea” turns into another round, an old story, and a conversation you didn’t know you needed.</p><p>That’s the idea behind பூமி. Familiar brews, a little room to linger, and no need for a special occasion. Come as you are.</p></div><span className="intro-symbol" lang="ta">வாங்க!</span></div><div className="story-grid"><div className="story-image reveal"><img src="/images/hands.jpg" alt="Hands carefully picking fresh green tea leaves" loading="lazy"/><span className="image-caption">GOOD TEA STARTS WITH GOOD HANDS.</span></div><div className="story-film reveal"><Film src="/video/pour.mp4" poster="/images/pour-poster.jpg" paused={paused || !!modal} label="Real footage of freshly brewed coffee being poured into a ceramic cup"/><div className="story-film-caption"><span lang="ta">அன்புடன், பூமி.</span><span>WITH LOVE, BHOOMI.</span></div><button className="story-play icon-button" onClick={openFilm} aria-label="Watch the Bhoomi film"><Play fill="currentColor" size={17}/></button></div></div></section>
      <section id="journey" className="journey-section" ref={journey}><div className="journey-sticky"><div className="journey-head"><span className="eyebrow">BEFORE IT REACHES YOUR TABLE</span><span className="journey-instruction">SCROLL TO FOLLOW THE STORY <ArrowDown size={13}/></span></div><div className="chapter-layout"><div className="chapter-copy"><span className="chapter-kicker">THE JOURNEY</span><h2>There’s a lot<br/>in <em>that cup.</em></h2><div className="chapter-description" key={chapter}><span className="chapter-index">0{chapter + 1} <span>/ 0{chapters.length}</span></span><h3>{activeChapter.title}</h3><p>{activeChapter.description}</p></div><button className="text-button" onClick={openFilm}>Let the story play <Play size={14}/></button></div><div className="chapter-frame" key={activeChapter.name}>{activeChapter.video ? <Film src={activeChapter.video} poster={activeChapter.poster} paused={paused || !!modal} label={activeChapter.alt}/> : <img src={activeChapter.poster} alt={activeChapter.alt}/>}<div className="chapter-frame-shade"/><span className="chapter-frame-label">{activeChapter.caption}</span><div className="frame-corner top-left"/><div className="frame-corner bottom-right"/></div></div><div className="chapter-tabs" aria-label="Journey chapters">{chapters.map((item, index) => <button key={item.name} aria-pressed={chapter === index} className={chapter === index ? 'active' : ''} onClick={() => setChapter(index)}><span>0{index + 1}</span>{item.name}<span className="tab-dot"/></button>)}</div></div></section>
      <section id="menu" className="menu-section section-shell"><div className="menu-heading reveal"><div><span className="eyebrow">THE BHOOMI MENU</span><h2>Tea? Coffee?<br/><em>Good question.</em></h2></div><p>Go with your usual.<br/>Or find a new one.</p></div><div className="menu-toolbar"><div className="menu-filters" aria-label="Drink categories"><button className={category === 'tea' ? 'active' : ''} aria-pressed={category === 'tea'} onClick={() => changeCategory('tea')}><Leaf size={18}/> Tea & chai <span>08</span></button><button className={category === 'coffee' ? 'active' : ''} aria-pressed={category === 'coffee'} onClick={() => changeCategory('coffee')}><Coffee size={18}/> Coffee & kaapi <span>08</span></button></div><span className="menu-side-label">PICK A CUP. PULL UP A CHAIR.</span></div><div className="drink-grid" id="drink-list" key={category}>{visibleDrinks.map((drink, index) => <button className="drink-card" key={drink.name} onClick={() => setModal(drink)} style={{ '--card-delay': `${index * 70}ms` }}><div className="drink-photo"><img src={drink.image} alt={drink.alt} loading="lazy" style={{ objectPosition: drink.position || 'center' }}/><span className="drink-tag">{drink.tag}</span><span className="drink-open"><Plus size={20}/></span></div><div className="drink-info"><span className="drink-note">{drink.notes}</span><div className="drink-title"><h3>{drink.name}</h3><span>{money.format(drink.price)}</span></div><p>{drink.description}</p></div></button>)}</div><div className="menu-bottom"><span>Can’t choose? There’s always a second round.</span><button className="text-button" aria-expanded={expandedMenu} aria-controls="drink-list" onClick={() => setExpandedMenu(!expandedMenu)}>{expandedMenu ? 'Show favourites' : `Explore all ${category === 'tea' ? 'teas' : 'coffees'}`}<ArrowRight size={17}/></button></div></section>
      <section className="pause-section"><Film src="/video/sip.mp4" poster="/images/sip-poster.jpg" paused={paused || !!modal} label="A hand lifts a freshly brewed steaming cup of tea"/><div className="pause-scrim"/><div className="pause-copy reveal"><span className="eyebrow light">NO RUSH. REALLY.</span><h2>Stay for<br/><em>another cup.</em></h2><p>The best conversations never fit into one cup.<br/>We’re happy to keep pouring.</p><a className="button cream" href="#menu">Choose your next cup <ArrowUpRight size={18}/></a></div><span className="pause-tamil" lang="ta">கொஞ்சம் தேநீர்.<br/>கொஞ்சம் நிம்மதி.</span></section>
      <section className="closing section-shell"><div className="closing-top"><span className="eyebrow">YOUR TEA BREAK HAS A NAME.</span><a href="#menu" className="closing-link">See you over<br/>a cup? <ArrowUpRight/></a></div><div className="closing-brand" aria-label="பூமி" lang="ta">பூமி<span>.</span></div><div className="closing-bottom"><span>CHAI, KAAPI & THE USUAL CONVERSATIONS.</span><span lang="ta">மண்ணிலிருந்து மனதிற்கு.</span></div></section>
    </main>
    <footer className="footer"><span>© {new Date().getFullYear()} Bhoomi. Tea & kaapi. Come as you are.</span><a href="#story">Our story</a><button onClick={() => setModal('credits')}>Film & photo credits</button><a href="#home">Back to top <ArrowUpRight size={13}/></a></footer>
    {modal === 'film' && <Dialog title="Bhoomi: from earth to cup" onClose={closeModal} className="film-dialog"><div className="film-screen" key={filmChapter}>{currentFilm.video ? <Film src={currentFilm.video} poster={currentFilm.poster} paused={filmPaused} label={currentFilm.alt} loop={false} onEnded={() => setFilmChapter(value => (value + 1) % chapters.length)}/> : <img src={currentFilm.poster} alt={currentFilm.alt}/>}<div className="film-gradient"/><div className="film-caption"><span className="eyebrow light">BHOOMI / CHAPTER 0{filmChapter + 1}</span><h2>{currentFilm.title}</h2><p>{currentFilm.description}</p></div></div><div className="film-controls"><button className="icon-button" aria-label="Previous chapter" onClick={() => setFilmChapter(value => (value - 1 + chapters.length) % chapters.length)}><ArrowLeft/></button><button className="icon-button" aria-label={filmPaused ? 'Play film' : 'Pause film'} onClick={() => setFilmPaused(!filmPaused)}>{filmPaused ? <Play/> : <Pause/>}</button><div className="film-dots">{chapters.map((item, i) => <button key={item.name} className={i === filmChapter ? 'active' : ''} aria-label={`Play ${item.name} chapter`} aria-pressed={i === filmChapter} onClick={() => setFilmChapter(i)}/>)}</div><button className="icon-button" aria-label="Next chapter" onClick={() => setFilmChapter(value => (value + 1) % chapters.length)}><ArrowRight/></button></div></Dialog>}
    {modal && typeof modal === 'object' && <Dialog title={modal.name} onClose={closeModal} className="drink-dialog"><img src={modal.image} alt={modal.alt}/><div className="drink-dialog-copy"><span className="eyebrow">{modal.tag}</span><h2>{modal.name}</h2><p>{modal.description}</p><div className="tasting-notes"><span>TASTING NOTES</span><p>{modal.notes}</p></div><div className="drink-detail-price"><strong>{money.format(modal.price)}</strong><span>per cup</span></div><p className="concept-note">A preview of the Bhoomi menu. Prices are illustrative; online ordering is not available.</p><button className="button dark" onClick={closeModal}>Find another favourite <ArrowRight size={17}/></button></div></Dialog>}
    {modal === 'credits' && <Dialog title="Film and photography credits" onClose={closeModal} className="credits-dialog"><span className="eyebrow">THE PEOPLE BEHIND THE PICTURES</span><h2>Every frame,<br/><em>a real moment.</em></h2><p>Plantation, tea processing, roasted beans, coffee pouring, and tea-drinking stock footage sourced through Magnific’s Freepik catalogue. Harvesting is represented by a still photograph.</p><p>Photography: <a href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a> and <a href="https://www.kiambethufarm.com/new-gallery" target="_blank" rel="noreferrer">Kiambethu Farm</a>. Additional menu photographs: Freepik, via Magnific. These visuals tell the story of tea and coffee; they do not identify Bhoomi’s suppliers.</p><p>Filter kaapi: <a href="https://commons.wikimedia.org/wiki/File:Foaming_filter_coffee.jpg" target="_blank" rel="noreferrer">Foaming filter coffee by Charles Haynes</a>, <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank" rel="noreferrer">CC BY-SA 2.0</a>. Displayed with a responsive crop.</p></Dialog>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
