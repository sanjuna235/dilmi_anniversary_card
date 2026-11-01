import { useEffect, useRef } from 'react';

/**
 * One lightweight canvas that paints the "little world": golden dust,
 * twinkling stars and the occasional drifting petal.
 * Pauses when off-screen or when the tab is hidden; goes still for reduced motion.
 */
const PETALS = {
  night: ['#e8c9de', '#d8b4fe', '#f3d7c4'],
  day: ['#e7b9c6', '#cdb1ef', '#efcfb6'],
};

export default function Ambient({ density = 1, petals = true, stars: starsProp, tone = 'night', className = '' }) {
  const stars = starsProp ?? tone === 'night';
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let particles = [];

    const rand = (a, b) => a + Math.random() * (b - a);

    const make = (kind, anywhere = true) => {
      if (kind === 'dust') {
        return { kind, x: rand(0, w), y: anywhere ? rand(0, h) : h + 10, r: rand(0.6, 1.9), vx: rand(-0.08, 0.08), vy: rand(-0.32, -0.08), a: rand(0.25, 0.85), t: rand(0, 6.28), tw: rand(0.006, 0.02) };
      }
      if (kind === 'star') {
        return { kind, x: rand(0, w), y: rand(0, h), r: rand(0.4, 1.2), a: rand(0.2, 0.9), t: rand(0, 6.28), tw: rand(0.008, 0.03) };
      }
      const pal = PETALS[tone] || PETALS.night;
      return { kind, x: rand(-40, w), y: anywhere ? rand(0, h) : -20, s: rand(5, 10), vx: rand(0.12, 0.42), vy: rand(0.28, 0.6), rot: rand(0, 6.28), vr: rand(-0.012, 0.012), sw: rand(0, 6.28), a: rand(0.35, 0.75), c: pal[Math.floor(Math.random() * pal.length)] };
    };

    const seed = () => {
      const area = (w * h) / (1440 * 900);
      const scale = Math.max(0.35, Math.min(area, 1.6)) * density;
      particles = [];
      for (let i = 0; i < Math.round((tone === 'day' ? 34 : 70) * scale); i++) particles.push(make('dust'));
      if (stars) for (let i = 0; i < Math.round(60 * scale); i++) particles.push(make('star'));
      if (petals) for (let i = 0; i < Math.round((tone === 'day' ? 14 : 9) * scale); i++) particles.push(make('petal'));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const drawPetal = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.moveTo(0, -p.s);
      ctx.bezierCurveTo(p.s * 0.9, -p.s * 0.6, p.s * 0.7, p.s * 0.7, 0, p.s);
      ctx.bezierCurveTo(-p.s * 0.7, p.s * 0.7, -p.s * 0.9, -p.s * 0.6, 0, -p.s);
      ctx.fill();
      ctx.restore();
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.kind === 'dust') {
          if (!reduce) {
            p.t += p.tw;
            p.x += p.vx + Math.sin(p.t) * 0.12;
            p.y += p.vy;
            if (p.y < -10) particles[i] = make('dust', false);
          }
          const a = p.a * (0.6 + 0.4 * Math.sin(p.t * 2));
          ctx.globalAlpha = a;
          ctx.fillStyle = tone === 'day' ? '#d2a94f' : '#f0d58f';
          ctx.shadowColor = tone === 'day' ? 'rgba(214,180,106,0.5)' : 'rgba(214,180,106,0.9)';
          ctx.shadowBlur = p.r * 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (p.kind === 'star') {
          if (!reduce) p.t += p.tw;
          ctx.globalAlpha = p.a * (0.35 + 0.65 * Math.abs(Math.sin(p.t)));
          ctx.fillStyle = '#f3ecff';
          ctx.fillRect(p.x, p.y, p.r * 1.4, p.r * 1.4);
        } else {
          if (!reduce) {
            p.sw += 0.012;
            p.x += p.vx + Math.sin(p.sw) * 0.35;
            p.y += p.vy;
            p.rot += p.vr;
            if (p.y > h + 20 || p.x > w + 40) particles[i] = make('petal', false);
          }
          drawPetal(p);
        }
      }
      ctx.globalAlpha = 1;
      if (!reduce && visible) raf = requestAnimationFrame(frame);
    };

    resize();
    frame();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) frame();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting && !document.hidden;
      if (visible && !was && !reduce) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    const onVis = () => {
      const was = visible;
      visible = !document.hidden;
      if (visible && !was && !reduce) raf = requestAnimationFrame(frame);
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [density, petals, stars, tone]);

  return <canvas ref={ref} className={`ambient ${className}`} aria-hidden="true" />;
}
