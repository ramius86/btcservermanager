import { useState, useEffect, useRef } from 'react';

type FoxState =
  | 'walking'
  | 'waiting'
  | 'running'
  | 'sleeping'
  | 'happy'
  | 'hiding'
  | 'peeking'
  | 'chasing_tail'
  | 'pouncing_wiggle'
  | 'pouncing_jump'
  | 'running_away_tactical'
  | 'tactical_intro'
  | 'tactical_shooting'
  | 'tactical_exit';

function secureRandom() {
  return Math.random();
}

const createRemoveImpact = (bulletId: string) => {
  return (prev: { id: string; x: number; y: number }[]) => {
    return prev.filter(imp => imp.id !== bulletId);
  };
};

export function FoxEasterEgg() {
  const [position, setPosition] = useState({ x: 10, y: 50 });
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [foxState, setFoxState] = useState<FoxState>('walking');
  const [food, setFood] = useState<{ x: number, y: number } | null>(null);
  const [impacts, setImpacts] = useState<{ id: string; x: number; y: number }[]>([]);
  const [tacticalText, setTacticalText] = useState<string | null>(null);
  const mousePos = useRef({ x: -9999, y: -9999 });
  const stateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pounceStart = useRef<number>(0);
  const tacticalPhaseTimer = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const isInteractiveElement = (el: HTMLElement | null): boolean => {
      let current = el;
      while (current) {
        const tagName = current.tagName;
        if (
          tagName === 'BUTTON' ||
          tagName === 'A' ||
          tagName === 'INPUT' ||
          tagName === 'SELECT' ||
          tagName === 'TEXTAREA'
        ) {
          return true;
        }

        const role = current.getAttribute('role');
        if (role && ['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio', 'switch'].includes(role)) {
          return true;
        }

        if (current.classList?.contains('cursor-pointer')) {
          return true;
        }

        try {
          const style = globalThis.getComputedStyle(current);
          if (style?.cursor === 'pointer') {
            return true;
          }
        } catch {
          // Ignore
        }

        current = current.parentElement;
      }
      return false;
    };

    const handleWindowClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (isInteractiveElement(target)) return;

      const clickX = (e.clientX / globalThis.innerWidth) * 100;
      const clickY = (e.clientY / globalThis.innerHeight) * 100;

      // Constrain within walking boundary
      const constrainedY = Math.max(15, Math.min(clickY, 85));
      const constrainedX = Math.max(10, Math.min(clickX, 90));

      setFood({ x: constrainedX, y: constrainedY });
    };

    const handleTacticalTrigger = () => {
      setFoxState((current) => {
        const isAlreadyTactical = [
          'running_away_tactical',
          'tactical_intro',
          'tactical_shooting',
          'tactical_exit'
        ].includes(current);
        if (isAlreadyTactical) return current;
        return 'running_away_tactical';
      });
    };

    globalThis.addEventListener('mousemove', handleMouseMove);
    globalThis.addEventListener('click', handleWindowClick);
    globalThis.addEventListener('trigger-fox-tactical', handleTacticalTrigger);
    return () => {
      globalThis.removeEventListener('mousemove', handleMouseMove);
      globalThis.removeEventListener('click', handleWindowClick);
      globalThis.removeEventListener('trigger-fox-tactical', handleTacticalTrigger);
    };
  }, []);

  useEffect(() => {
    if (foxState === 'tactical_shooting') {
      document.body.classList.add('screen-shaking');
    } else {
      document.body.classList.remove('screen-shaking');
    }
    return () => {
      document.body.classList.remove('screen-shaking');
    };
  }, [foxState]);

  useEffect(() => {
    const resumeWalking = () => setFoxState('walking');

    const handleRunningAwayTactical = () => {
      const step = 4.5;
      const targetX = -15;
      const targetY = -15;

      const dx = targetX - position.x;
      const dy = targetY - position.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 4) {
        setDirection('right');
        setPosition({ x: -12, y: 40 });
        setFoxState('tactical_intro');
        return;
      }

      const newX = position.x + (dx / dist) * step;
      const newY = position.y + (dy / dist) * step;
      setDirection(dx > 0 ? 'right' : 'left');
      setPosition({ x: newX, y: newY });
    };

    const handleTacticalIntro = () => {
      const step = 3;
      const targetX = 35;
      const targetY = 40;

      const dx = targetX - position.x;
      const dy = targetY - position.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 4) {
        tacticalPhaseTimer.current = Date.now();
        setFoxState('tactical_shooting');
        setTacticalText('GO GO GO!');
        return;
      }

      const newX = position.x + (dx / dist) * step;
      const newY = position.y + (dy / dist) * step;
      setDirection('right');
      setPosition({ x: newX, y: newY });
    };

    const handleTacticalShooting = () => {
      const elapsed = Date.now() - tacticalPhaseTimer.current;
      if (elapsed > 6000) {
        setTacticalText('MISSION ACCOMPLISHED!');
        setTimeout(() => setTacticalText(null), 1500);
        setFoxState('tactical_exit');
        return;
      }

      if (secureRandom() < 0.15) {
        const texts = [
          'Enemy, man, 100 meters, front!',
          'Oh no, 2, is down!',
          '1, target that rifleman!',
          'Be, advised, hostile, tank, North!',
          '4, report, status!',
          'Taking, fire, need, assistance!',
          'Hostile, soldier, 300, East!',
          'Where, are, you?',
          'Fast, mover, 500, South!',
          'Grid, 0, 4, 2, 0, 6, 9'
        ];
        setTacticalText(texts[Math.floor(secureRandom() * texts.length)]);
      }

      const isShootingTick = secureRandom() < 0.7;
      setPosition({ x: 35, y: 40 });

      if (isShootingTick) {
        const id = `bullet-${globalThis.crypto.randomUUID()}`;
        const randomX = 15 + secureRandom() * 75;
        const randomY = 10 + secureRandom() * 80;
        setImpacts((prev) => [...prev, { id, x: randomX, y: randomY }]);
        const removeImpact = createRemoveImpact(id);
        setTimeout(() => setImpacts(removeImpact), 1500);
      }
    };

    const handleTacticalExit = () => {
      const step = 4.5;
      const targetX = 115;
      const targetY = 50;

      const dx = targetX - position.x;
      const dy = targetY - position.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 4) {
        setDirection('left');
        setPosition({ x: 95, y: 50 });
        setFoxState('walking');
        return;
      }

      const newX = position.x + (dx / dist) * step;
      const newY = position.y + (dy / dist) * step;
      setDirection('right');
      setPosition({ x: newX, y: newY });
    };
    const resumePeeking = () => {
      stateTimeoutRef.current = null;
      setFoxState('peeking');
    };

    const handleRunning = () => {
      const step = 4;
      const targetX = 55;
      const targetY = 33; // Slightly lower to be fully hidden behind tabs

      const dx = targetX - position.x;
      const dy = targetY - position.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 4) {
        setFoxState('hiding');
        if (stateTimeoutRef.current) clearTimeout(stateTimeoutRef.current);
        stateTimeoutRef.current = setTimeout(resumePeeking, 3000 + secureRandom() * 3000);
        return;
      }

      const newX = position.x + (dx / dist) * step;
      const newY = position.y + (dy / dist) * step;

      setDirection(dx > 0 ? 'right' : 'left');
      setPosition({ x: newX, y: newY });
    };

    const handlePeeking = () => {
      if (stateTimeoutRef.current) return;

      setPosition({ x: position.x, y: 31 });

      const finishPeeking = () => {
        stateTimeoutRef.current = null;

        // Recalculate distance dynamically using pixel values
        const currentFoxPixelX = (position.x / 100) * globalThis.innerWidth;
        const currentFoxPixelY = (31 / 100) * globalThis.innerHeight;
        const currentDx = currentFoxPixelX - mousePos.current.x;
        const currentDy = currentFoxPixelY - mousePos.current.y;
        const currentDist = Math.hypot(currentDx, currentDy);

        if (currentDist > 250) {
          setFoxState('walking');
          return;
        }
        setFoxState('hiding');
        stateTimeoutRef.current = setTimeout(resumePeeking, 3000 + secureRandom() * 2000);
      };

      stateTimeoutRef.current = setTimeout(finishPeeking, 3000);
    };

    const handleWalking = () => {
      const random = secureRandom();
      if (random < 0.02) {
        setFoxState('waiting');
        stateTimeoutRef.current = setTimeout(resumeWalking, 2000 + secureRandom() * 3000);
        return;
      } else if (random < 0.01) {
        setFoxState('sleeping');
        stateTimeoutRef.current = setTimeout(resumeWalking, 8000 + secureRandom() * 10000);
        return;
      } else if (random < 0.015) {
        setFoxState('happy');
        stateTimeoutRef.current = setTimeout(resumeWalking, 2000);
        return;
      } else if (random < 0.022) {
        setFoxState('chasing_tail');
        stateTimeoutRef.current = setTimeout(resumeWalking, 3000 + secureRandom() * 2000);
        return;
      } else if (random < 0.028) {
        setFoxState('pouncing_wiggle');
        pounceStart.current = Date.now();
        return;
      }

      const step = 0.4 + secureRandom() * 0.8;
      const moveDir = direction === 'right' ? 1 : -1;
      let newX = position.x + (moveDir * step);
      const verticalStep = (secureRandom() - 0.5) * 1.5;
      let newY = position.y + verticalStep;

      if (newX > 90) {
        setDirection('left');
        newX = 90;
      } else if (newX < 10) {
        setDirection('right');
        newX = 10;
      }

      if (newY < 15) newY = 15;
      if (newY > 85) newY = 85;

      setPosition({ x: newX, y: newY });
    };

    const handleFood = (currentFood: { x: number, y: number }) => {
      // Clear normal timeouts if targeting food
      if (foxState !== 'walking' && foxState !== 'pouncing_jump') {
        if (stateTimeoutRef.current) {
          clearTimeout(stateTimeoutRef.current);
          stateTimeoutRef.current = null;
        }
      }

      const dxFood = currentFood.x - position.x;
      const dyFood = currentFood.y - position.y;
      const distToFood = Math.hypot(dxFood, dyFood);

      if (distToFood < 4) {
        setFood(null);
        setFoxState('happy');
        if (stateTimeoutRef.current) clearTimeout(stateTimeoutRef.current);
        stateTimeoutRef.current = setTimeout(resumeWalking, 2500);
        return;
      }

      const step = 2.2;
      const moveX = position.x + (dxFood / distToFood) * step;
      const moveY = position.y + (dyFood / distToFood) * step;
      setDirection(dxFood > 0 ? 'right' : 'left');
      setPosition({ x: moveX, y: moveY });
      setFoxState('walking');
    };

    const handlePouncingWiggle = () => {
      if (Date.now() - pounceStart.current >= 1500) {
        setFoxState('pouncing_jump');
      }
    };

    const handlePouncingJump = () => {
      const step = direction === 'right' ? 1.5 : -1.5;
      let newX = position.x + step;
      if (newX > 90) newX = 90;
      if (newX < 10) newX = 10;
      setPosition({ x: newX, y: position.y });

      if (Date.now() - pounceStart.current >= 2300) {
        setFoxState('walking');
      }
    };

    const tick = () => {
      const foxPixelX = (position.x / 100) * globalThis.innerWidth;
      const foxPixelY = (position.y / 100) * globalThis.innerHeight;
      const dx = foxPixelX - mousePos.current.x;
      const dy = foxPixelY - mousePos.current.y;
      const distToMouse = Math.hypot(dx, dy);

      const isTactical = [
        'running_away_tactical',
        'tactical_intro',
        'tactical_shooting',
        'tactical_exit'
      ].includes(foxState);

      // Trigger fleeing if mouse gets too close (within 100px), but only if not already hiding or tactical
      if (distToMouse < 100 && foxState !== 'hiding' && foxState !== 'peeking' && !isTactical) {
        if (stateTimeoutRef.current) clearTimeout(stateTimeoutRef.current);
        setFoxState('running');
        return;
      }

      if (food) {
        handleFood(food);
        return;
      }

      switch (foxState) {
        case 'running_away_tactical':
          handleRunningAwayTactical();
          break;
        case 'tactical_intro':
          handleTacticalIntro();
          break;
        case 'tactical_shooting':
          handleTacticalShooting();
          break;
        case 'tactical_exit':
          handleTacticalExit();
          break;
        case 'running':
          handleRunning();
          break;
        case 'peeking':
          handlePeeking();
          break;
        case 'pouncing_wiggle':
          handlePouncingWiggle();
          break;
        case 'pouncing_jump':
          handlePouncingJump();
          break;
        case 'walking':
          handleWalking();
          break;
        case 'hiding':
        case 'chasing_tail':
        default:
          break;
      }
    };

    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
  }, [position, direction, foxState, food]);

  return (
    <>
      <style>
        {`
          @keyframes cookie-fall {
            0% { transform: translate(-50%, -150%) scale(0.5); opacity: 0; }
            50% { transform: translate(-50%, -30%) scale(1.1); }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          }
          @keyframes recoil {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-3px, -0.5px) rotate(-1deg); }
          }
          @keyframes shell-eject {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            100% { transform: translate(-25px, 20px) rotate(360deg); opacity: 0; }
          }
          @keyframes bullet-impact {
            0% { transform: translate(-50%, -50%) scale(2); opacity: 1; }
            10% { transform: translate(-50%, -50%) scale(1); }
            80% { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes screen-shake {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            20% { transform: translate(-2px, 2px) rotate(-0.3deg); }
            40% { transform: translate(2px, -1px) rotate(0.3deg); }
            60% { transform: translate(-2px, -2px) rotate(-0.1deg); }
            80% { transform: translate(2px, 2px) rotate(0.1deg); }
          }
          .screen-shaking main > div > div:not(.pointer-events-none) {
            animation: screen-shake 0.12s infinite;
          }
          .bullet-hole {
            position: fixed;
            width: 14px;
            height: 14px;
            background: radial-gradient(circle, #2e2e2e 30%, #111111 80%, transparent 100%);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 0 4px rgba(0,0,0,0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            animation: bullet-impact 1.2s forwards;
          }
          .shell-casing {
            animation: shell-eject 0.25s infinite linear;
            transform-origin: center;
          }
          .fox-recoil {
            animation: recoil 0.08s infinite alternate;
          }
        `}
      </style>
      {food && (
        <div
          className="fixed z-[9998] select-none text-3xl pointer-events-none"
          style={{
            left: `${food.x}%`,
            top: `${food.y}%`,
            transform: 'translate(-50%, -50%)',
            animation: 'cookie-fall 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          🍪
        </div>
      )}
      {impacts.map((imp) => (
        <div
          key={imp.id}
          className="bullet-hole"
          style={{
            left: `${imp.x}%`,
            top: `${imp.y}%`
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full blur-[2px] animate-ping opacity-60" />
        </div>
      ))}
      <div
        className="fixed pointer-events-none select-none"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: `translate(-50%, -50%) ${direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
          filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.3))',
          opacity: foxState === 'sleeping' ? 0.7 : 1,
          zIndex: foxState === 'hiding' ? 0 : 9999,
          clipPath: foxState === 'peeking' ? 'inset(5% 0 46% 0)' : 'none',
          transition: 'left 0.1s linear, top 0.1s linear, opacity 0.3s ease, filter 0.3s ease',
        }}
      >
        <div className="relative w-24 h-24">
          {tacticalText && (
            <div
              className="absolute -top-12 left-1/2 bg-red-600 border border-red-500 text-white font-black text-[9px] px-2 py-1 rounded shadow-md tracking-wider whitespace-nowrap animate-bounce z-[10001]"
              style={{
                transform: `translateX(-50%) ${direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`
              }}
            >
              {tacticalText}
              <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-red-600 rotate-45 border-r border-b border-red-500" />
            </div>
          )}
          <FoxSVG state={foxState === 'peeking' ? 'waiting' : foxState} />
          {foxState === 'happy' && (
            <div className="absolute -top-2 -right-2 flex space-x-1">
              <span className="text-xl animate-bounce">✨</span>
              <span className="text-xl animate-pulse delay-75">💖</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function FoxSVG({ state }: Readonly<{ state: FoxState }>) {
  const isSleeping = state === 'sleeping';
  const isRunning = state === 'running';
  const isHappy = state === 'happy';
  const showMilitaryGear = ['tactical_intro', 'tactical_shooting', 'tactical_exit'].includes(state);

  let bodyAnimationClass = '';
  if (state === 'walking') {
    bodyAnimationClass = 'fox-walking';
  } else if (isRunning || state === 'running_away_tactical' || state === 'tactical_intro' || state === 'tactical_exit') {
    bodyAnimationClass = 'fox-running';
  } else if (state === 'chasing_tail') {
    bodyAnimationClass = 'fox-chasing-tail';
  } else if (state === 'pouncing_wiggle') {
    bodyAnimationClass = 'fox-pouncing-wiggle';
  } else if (state === 'pouncing_jump') {
    bodyAnimationClass = 'fox-pouncing-jump';
  }

  return (
    <svg
      viewBox="0 0 200 200"
      className={`w-full h-full transform-gpu transition-transform duration-500 ${isHappy ? 'animate-bounce' : ''}`}
    >
      <style>
        {`
          @keyframes wag {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(15deg); }
          }
          @keyframes blink {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
          }
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.03); }
          }
          @keyframes walk {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          @keyframes leg-swing {
            0%, 100% { transform: rotate(-8deg); }
            50% { transform: rotate(8deg); }
          }
          @keyframes jump {
            0%, 100% { transform: translateY(0) scale(1); }
            40% { transform: translateY(-30px) scale(1.05, 0.95); }
            100% { transform: translateY(0) scale(1); }
          }
          @keyframes chase-tail {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes wiggle-butt {
            0%, 100% { transform: rotate(0deg) translateY(0); }
            50% { transform: rotate(-8deg) translateY(3px) scaleY(0.95); }
          }
          @keyframes pounce-jump {
            0% { transform: translate(0, 0) scale(1); }
            20% { transform: translate(0, 6px) scale(1.15, 0.85); }
            45% { transform: translate(10px, -30px) scale(0.85, 1.15); }
            75% { transform: translate(25px, 0) scale(1); }
            100% { transform: translate(0, 0); }
          }
          .fox-tail {
            animation: wag ${isRunning ? '0.2s' : '1.5s'} infinite ease-in-out;
            transform-origin: 80px 125px;
          }
          .fox-eye {
            animation: blink 4s infinite;
            transform-origin: center;
          }
          .fox-body-group {
            animation: breathe 3s infinite ease-in-out;
            transform-origin: center;
            transition: all 0.5s ease-in-out;
          }
          .fox-is-sleeping .fox-body-group {
            transform: translateY(15px) scaleY(0.75);
            transform-origin: bottom center;
          }
          .fox-is-happy .fox-body-group {
            animation: jump 0.5s ease-out;
          }
          .fox-walking {
            animation: walk 0.5s infinite ease-in-out;
          }
          .fox-chasing-tail {
            animation: chase-tail 0.35s infinite linear;
            transform-origin: 130px 110px;
          }
          .fox-pouncing-wiggle {
            animation: wiggle-butt 0.25s infinite ease-in-out;
            transform-origin: 120px 150px;
          }
          .fox-pouncing-jump {
            animation: pounce-jump 0.8s ease-out;
            transform-origin: 120px 150px;
          }
          .fox-leg {
            transform-origin: top center;
            transform-box: fill-box;
            transition: opacity 0.5s;
          }
          .fox-is-sleeping .fox-leg {
            opacity: 0;
          }
          .fox-walking .fox-leg-front-1 { animation: leg-swing 0.5s infinite; }
          .fox-walking .fox-leg-front-2 { animation: leg-swing 0.5s infinite 0.25s; }
          .fox-walking .fox-leg-back-1 { animation: leg-swing 0.5s infinite 0.1s; }
          .fox-walking .fox-leg-back-2 { animation: leg-swing 0.5s infinite 0.35s; }

          .fox-running .fox-leg-front-1 { animation: leg-swing 0.2s infinite; }
          .fox-running .fox-leg-front-2 { animation: leg-swing 0.2s infinite 0.1s; }
          .fox-running .fox-leg-back-1 { animation: leg-swing 0.2s infinite 0.05s; }
          .fox-running .fox-leg-back-2 { animation: leg-swing 0.2s infinite 0.15s; }
        `}
      </style>

      <g className={`${isSleeping ? 'fox-is-sleeping' : ''} ${isHappy ? 'fox-is-happy' : ''}`}>
        <g className={`fox-body-group ${bodyAnimationClass}`}>
        {/* Tail */}
        <path
          className="fox-tail"
          d="M80,125 C70,125 50,110 52,85 C55,55 85,55 95,95 C100,125 85,125 80,125 Z"
          fill="#F27121"
        />
        <path
          className="fox-tail"
          d="M60,85 C55,75 68,70 72,82 C75,95 65,95 60,85 Z"
          fill="white"
          opacity="0.8"
        />

        {/* Legs */}
        <rect className="fox-leg fox-leg-back-1" x="95" y="140" width="8" height="20" rx="4" fill="#D35400" />
        <rect className="fox-leg fox-leg-back-2" x="120" y="140" width="8" height="20" rx="4" fill="#D35400" />
        <rect className="fox-leg fox-leg-front-1" x="105" y="145" width="10" height="22" rx="5" fill="#E67E22" />
        <rect className="fox-leg fox-leg-front-2" x="135" y="145" width="10" height="22" rx="5" fill="#E67E22" />

        {/* Body */}
        <path
          d="M80,110 Q80,160 120,160 Q160,160 160,110 Q160,80 120,80 Q80,80 80,110 Z"
          fill="#F27121"
        />
        <path
          d="M100,120 Q100,150 125,150 Q150,150 150,120 Q150,100 125,100 Q100,100 100,120 Z"
          fill="white"
          opacity="0.3"
        />

        {/* Head Group */}
        <g transform={`translate(${state === 'waiting' ? '-5' : '0'}, ${state === 'waiting' ? '5' : '0'}) rotate(${state === 'waiting' ? '-10' : '0'}, 140, 80)`}>
          {/* Head Base */}
          <path
            d="M100,80 Q100,45 140,45 Q180,45 180,80 Q180,115 140,115 Q100,115 100,80 Z"
            fill="#F27121"
          />

          {/* Ears */}
          <path d="M110,55 L100,20 L135,50 Z" fill="#D35400" />
          <path d="M113,53 L108,35 L128,50 Z" fill="#E67E22" />
          <path d="M170,55 L180,20 L145,50 Z" fill="#D35400" />
          <path d="M167,53 L172,35 L152,50 Z" fill="#E67E22" />

          {/* Military Cap */}
          {showMilitaryGear && (
            <g>
              {/* Cap Dome */}
              <path d="M 105,53 C 105,25 175,25 175,53 Z" fill="#4B5320" />
              {/* Visor */}
              <path d="M 160,53 C 175,53 188,58 193,63 C 183,63 168,58 160,53 Z" fill="#2B2F10" />
              {/* Camo Spots */}
              <path d="M 115,40 Q 125,35 130,45 Q 120,48 115,40 Z" fill="#3B3F15" opacity="0.7" />
              <path d="M 145,35 Q 155,30 160,40 Q 150,45 145,35 Z" fill="#5F6325" opacity="0.6" />
              <path d="M 130,48 Q 140,42 145,50 Q 135,52 130,48 Z" fill="#1C2005" opacity="0.8" />
              {/* Red Star */}
              <polygon points="140,36 142,41 147,41 143,44 145,49 140,46 135,49 137,44 133,41 138,41" fill="#E74C3C" />
            </g>
          )}

          {/* Cheeks */}
          <path d="M100,85 Q110,115 140,115 Q130,85 100,85 Z" fill="white" />
          <path d="M180,85 Q170,115 140,115 Q150,85 180,85 Z" fill="white" />

          {/* Eyes */}
          {isSleeping ? (
            <>
              <path d="M125,85 Q132,90 139,85" fill="none" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" />
              <path d="M151,85 Q158,90 165,85" fill="none" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <ellipse className="fox-eye" cx="132" cy="85" rx="4" ry="3" transform="rotate(-10, 132, 85)" fill="#2E2E2E" />
              <ellipse className="fox-eye" cx="158" cy="85" rx="4" ry="3" transform="rotate(10, 158, 85)" fill="#2E2E2E" />
            </>
          )}

          {/* Nose */}
          <path d="M137,112 Q140,118 143,112 Z" fill="#2E2E2E" />
        </g>

        {/* M4 Rifle */}
        {showMilitaryGear && (
          <g className={state === 'tactical_shooting' ? 'fox-recoil' : ''} transform="translate(25, 20)">
            {/* Stock */}
            <rect x="75" y="100" width="18" height="8" rx="2" fill="#2E2E2E" />
            <path d="M75,100 L70,112 L75,112 Z" fill="#2E2E2E" />
            {/* Receiver */}
            <rect x="93" y="100" width="28" height="10" rx="1" fill="#1C1C1C" />
            {/* Pistol Grip */}
            <rect x="96" y="108" width="6" height="12" rx="1" transform="rotate(20, 96, 108)" fill="#1C1C1C" />
            {/* Magazine */}
            <path d="M108,108 L111,123 L117,123 L114,108 Z" fill="#111111" />
            {/* Handguard */}
            <rect x="121" y="101" width="25" height="8" rx="1" fill="#4B5320" />
            {/* Barrel */}
            <rect x="146" y="103" width="20" height="4" fill="#5E5E5E" />
            {/* Muzzle Brake */}
            <rect x="166" y="102" width="4" height="6" rx="1" fill="#2E2E2E" />
            {/* Scope */}
            <rect x="100" y="94" width="12" height="6" rx="1" fill="#2E2E2E" />
            <rect x="103" y="96" width="6" height="2" fill="#5E5E5E" />

            {/* Muzzle Flash & Shells */}
            {state === 'tactical_shooting' && (
              <>
                <polygon
                  points="174,105 186,100 178,105 194,105 178,106 188,111 174,106 182,105"
                  fill="#FFD700"
                  opacity="0.9"
                />
                <circle cx="174" cy="105" r="8" fill="#FF8C00" opacity="0.6" className="animate-ping" />
                <rect
                  className="shell-casing"
                  x="102" y="101" width="2.5" height="4" rx="0.5" fill="#DAA520"
                />
              </>
            )}
          </g>
        )}
        </g>
      </g>
    </svg>
  );
}
