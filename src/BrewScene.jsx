import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';

export default function BrewScene({ paused }) {
  const host = useRef(null);
  const engine = useRef(null);
  const latest = useRef({ paused, localPaused: false, kind: 'coffee' });
  const [kind, setKind] = useState('coffee');
  const [localPaused, setLocalPaused] = useState(false);
  const [status, setStatus] = useState('loading');
  latest.current = { paused, localPaused, kind };
  useEffect(() => {
    let disposed = false;
    let started = false;
    const observer = new IntersectionObserver(async ([entry]) => {
      engine.current?.setVisible(entry.isIntersecting);
      if (!entry.isIntersecting || started) return;
      started = true;
      try {
        const { createBrewScene } = await import('./brew-scene.js');
        if (disposed) return;
        engine.current = createBrewScene(host.current, latest, () => setStatus('fallback'));
        setStatus('ready');
      } catch {
        if (!disposed) setStatus('fallback');
      }
    }, { rootMargin: '160px' });
    observer.observe(host.current);
    return () => { disposed = true; observer.disconnect(); engine.current?.dispose(); engine.current = null; };
  }, []);
  useEffect(() => { engine.current?.refresh(); }, [paused, localPaused, kind]);
  const stopped = paused || localPaused;
  return <section className="brew-section" id="ritual" aria-labelledby="brew-heading">
    <div className="brew-copy">
      <span className="eyebrow">A LITTLE THEATRE. A LOT OF FLAVOUR.</span>
      <h2 id="brew-heading">The metre<br/><em>pour.</em></h2>
      <p>Lift. Pour. Let it froth. A familiar little ritual, with a whole lot of love in every drop.</p>
      <div className="brew-switch" aria-label="Choose your 3D brew">
        <button aria-pressed={kind === 'coffee'} onClick={() => setKind('coffee')}>Filter kaapi</button>
        <button aria-pressed={kind === 'tea'} onClick={() => setKind('tea')}>Masala chai</button>
      </div>
      <span className="brew-tamil" lang="ta">சுடச் சுட, அன்புடன்.</span>
      <a className="brew-menu-link" href="#menu">Find your favourite <ArrowRight size={18}/></a>
    </div>
    <div className="brew-experience">
      <div className="brew-stage" ref={host} data-state={status} role="img" aria-label={`Interactive 3D ${kind === 'coffee' ? 'brass dabara set pouring filter coffee' : 'clay cups pouring chai'}. Use the rotation buttons below or drag horizontally to turn.`}>
        {status !== 'ready' && <div className="brew-fallback"><img src="/images/dabara-kaapi.webp" alt="Frothy filter coffee in traditional tumblers"/><span role="status">{status === 'loading' ? 'Warming up your cup…' : 'A familiar ritual, a perfect cup.'}</span></div>}
        <span className="brew-stage-note" aria-hidden="true">{kind === 'coffee' ? 'THE GOLDEN POUR' : 'A LITTLE CHAI MAGIC'}</span>
      </div>
      <div className="brew-controls">
        <span>{status === 'ready' ? 'DRAG TO TURN · TAKE A CLOSER LOOK' : 'THE BHOOMI RITUAL'}</span>
        <div>
          <button aria-label="Rotate brew left" disabled={status !== 'ready'} onClick={() => engine.current?.rotate(-.35)}><ArrowLeft size={18}/></button>
          <button aria-label="Rotate brew right" disabled={status !== 'ready'} onClick={() => engine.current?.rotate(.35)}><ArrowRight size={18}/></button>
          <button aria-label="Reset brew view" disabled={status !== 'ready'} onClick={() => engine.current?.reset()}><RotateCcw size={17}/></button>
          <button aria-label={stopped ? 'Play 3D animation' : 'Pause 3D animation'} disabled={paused || status !== 'ready'} onClick={() => setLocalPaused(!localPaused)}>{stopped ? <Play size={17}/> : <Pause size={17}/>}</button>
        </div>
      </div>
      {paused && <p className="brew-motion-note">Motion is paused. Use “Resume motion” at the top of the page to enable animation.</p>}
    </div>
  </section>;
}
