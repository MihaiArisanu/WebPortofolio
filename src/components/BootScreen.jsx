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
    "Initializing MihaiArisanuOS...",
    "Loading kernel modules...",
    "Initializing WebAssembly runtime... [ OK ]",
    "Starting UI engine (React)... [ OK ]",
    "WARNING: Limited input detected (keyboard recommended).",
    "NOTICE: Use arrow keys to navigate system interface.",
    "Boot sequence complete."
];

const fullBallString = fullBasketballAsciiArray.join('\n');
const totalBallChars = fullBallString.length;

export default function BootScreen({ onComplete }) {
    const [lines, setLines] = useState([]);
    const [ballChars, setBallChars] = useState(0);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

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

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
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