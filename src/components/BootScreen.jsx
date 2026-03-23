import { useState, useEffect, useRef } from 'react';

const fullBasketballAsciiArray = [
    "       ___________      ",
    "   _-''           ''-_   ",
    " /`                   `\\ ",
    "|      \\   |  |   /      |",
    "|       \\  |  |  /       |",
    "|--------\\ |  | /--------|",
    "|         \\|  |/         |",
    "|         /|  |\\         |",
    "|--------/ |  | \\--------|",
    "|       /  |  |  \\       |",
    "|      /   |  |   \\      |",
    " \\,                     / ",
    "   `--_______________--'   "
];

const bootSequence = [
    "BIOS check successful. Booting MihaiArisanuOS (v1.0.0-wasm)...",
    "Loading custom C++ kernel via Emscripten... [ OK ]",
    "Allocating WebAssembly memory pages... [ OK ]",
    "Mounting Virtual File System (VFS)...",
    "Establishing secure pipeline to Headless CMS...",
    "Hydrating file tree from remote nodes... [ OK ]",
    "Initializing WebAssembly runtime environment... [ OK ]",
    "Starting UI rendering engine (React)... [ OK ]",
    "Scanning input devices... [ OK ]",
    "WARNING: Touch input is secondary. Keyboard strictly recommended.",
    "NOTICE: Use ARROW KEYS to navigate. Press ENTER to execute.",
    "System boot sequence complete. Welcome."
];

const fullBallString = fullBasketballAsciiArray.join('\n');
const totalBallChars = fullBallString.length;

export default function BootScreen({ onComplete }) {
    const [lines, setLines] = useState([]);
    const [ballChars, setBallChars] = useState(0);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        let currentLine = 0;
        let currentCharCount = 0;

        const textInterval = setInterval(() => {
            if (currentLine < bootSequence.length) {
                setLines(prev => [...prev, bootSequence[currentLine]]);
                currentLine++;
            } else {
                clearInterval(textInterval);
                setTimeout(() => onCompleteRef.current(), 400);
            }
        }, 800);

        const drawSpeed = (bootSequence.length * 800) / totalBallChars;

        const ballInterval = setInterval(() => {
            currentCharCount++;
            setBallChars(currentCharCount);
            if (currentCharCount >= totalBallChars) {
                clearInterval(ballInterval);
            }
        }, drawSpeed);

        return () => {
            clearInterval(textInterval);
            clearInterval(ballInterval);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                onCompleteRef.current();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const partialString = fullBallString.substring(0, ballChars);

    return (
        <div style={{ color: '#00ff00', fontFamily: 'monospace', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh', boxSizing: 'border-box' }}>
            <div>
                <pre style={{ margin: 0, color: '#00ff00' }}>
                    {`
  __  __        ___      
 |  \\/  |__ _  / _ \\ ___ 
 | |\\/| / _\` || (_) (_-< 
 |_|  |_\\__,_| \\___//__/ 
`}
                </pre>
                <br />
                {lines.map((line, idx) => (
                    <div key={idx}>{line}</div>
                ))}
                <span className="blink-cursor">_</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                <pre style={{
                    margin: 0,
                    color: '#ff8800',
                    fontFamily: 'monospace',
                    lineHeight: '1.1',
                    fontSize: '11px'
                }}>
                    {partialString}
                    {ballChars < totalBallChars && <span className="blink-cursor-orange">█</span>}
                </pre>
            </div>
        </div>
    );
}