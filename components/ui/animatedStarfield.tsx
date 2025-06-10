'use client';

import React, { useEffect } from 'react';
import { useTheme } from './theme-provider';

interface Props {
    speedFactor?: number;
    starCount?: number;
    sectionH?: number;
    sectionW?: number;
    backgroundColor?: string;
    starColor?: [number, number, number];
}

export default function Starfield(props: Props) {
    const context = useTheme();
    const theme = context?.theme || 'dark';
    // Dynamic star colors based on theme
    const getStarColor = (): [number, number, number] => {
        if (props.starColor) return props.starColor;
        return theme === 'dark' ? [255, 255, 255] : [80, 80, 80]; // White stars in dark mode, dark gray in light mode
    };

    // Dynamic background color based on theme
    const getBackgroundColor = (): string => {
        if (props.backgroundColor) return props.backgroundColor;
        return theme === 'dark' ? 'black' : 'white'; // Use transparent so the page background shows through
    };

    const { 
        speedFactor = 0.02, 
        starCount = 5, 
        sectionW = typeof window !== 'undefined' ? window.innerWidth : 800, 
        sectionH = typeof window !== 'undefined' ? window.innerHeight : 600
    } = props;
    
    const starColor = getStarColor();
    const backgroundColor = getBackgroundColor();

    useEffect(() => {
        const canvas = document.getElementById('starfield') as HTMLCanvasElement;

        if (canvas) {
            const c = canvas.getContext('2d');

            if (c) {
                let w = sectionW//window.innerWidth;
                let h = sectionH//window.innerHeight;

                const setCanvasExtents = () => {
                    canvas.width = w;
                    canvas.height = h;
                };

                setCanvasExtents();

                window.onresize = () => {
                    setCanvasExtents();
                };

                const makeAntibodies = (count: number) => {
                    const out = [];
                    for (let i = 0; i < count; i++) {
                        const s = {
                            x: Math.random() * 1600 - 800,
                            y: Math.random() * 900 - 450,
                            z: Math.random() * 1000,
                        };
                        out.push(s);
                    }
                    return out;
                };

                let antibodies = makeAntibodies(starCount);

                const clear = () => {
                    c.fillStyle = backgroundColor;
                    c.fillRect(0, 0, canvas.width, canvas.height);
                };

                const drawAntibody = (x: number, y: number, brightness: number) => {
                    // Adjust brightness based on theme for better visibility
                    const adjustedBrightness = theme === 'dark' ? brightness * 0.8 : brightness ;//* 0.6;
                    c.strokeStyle = `rgba(${starColor[0]}, ${starColor[1]}, ${starColor[2]}, ${adjustedBrightness})`;
                    c.lineWidth = 2;  // Adjust line width to make the lines thicker
                    const size = 5;  // Adjust size to make the antibodies larger

                    // Draw Y-shaped antibody
                    c.beginPath();
                    // Left arm
                    c.moveTo(x, y);
                    c.lineTo(x - size, y - size);
                    // Right arm
                    c.moveTo(x, y);
                    c.lineTo(x + size, y - size);
                    // Stem
                    c.moveTo(x, y);
                    c.lineTo(x, y + size*1.5);
                    c.stroke();
                };

                const moveAntibodies = (distance: number) => {
                    const count = antibodies.length;
                    for (let i = 0; i < count; i++) {
                        const s = antibodies[i];
                        s.z -= distance;
                        while (s.z <= 1) {
                            s.z += 1000;
                        }
                    }
                };

                let prevTime: number;
                const init = (time: number) => {
                    prevTime = time;
                    requestAnimationFrame(tick);
                };

                const tick = (time: number) => {
                    let elapsed = time - prevTime;
                    prevTime = time;

                    moveAntibodies(elapsed * speedFactor);

                    clear();

                    const cx = w / 2;
                    const cy = h / 2;

                    const count = antibodies.length;
                    for (var i = 0; i < count; i++) {
                        const antibody = antibodies[i];

                        const x = cx + antibody.x / (antibody.z * 0.001);
                        const y = cy + antibody.y / (antibody.z * 0.001);

                        if (x < 0 || x >= w || y < 0 || y >= h) {
                            continue;
                        }

                        const d = antibody.z / 1000.0;
                        const b = 1 - d * d;

                        drawAntibody(x, y, b*0.3);
                    }

                    requestAnimationFrame(tick);
                };

                requestAnimationFrame(init);

                // add window resize listener:
                // window.addEventListener('resize', function () {
                //     w = window.innerWidth;
                //     h = window.innerHeight;
                //     setCanvasExtents();
                // });
            } else {
                console.error('Could not get 2d context from canvas element');
            }
        } else {
            console.error('Could not find canvas element with id "starfield"');
        }

        return () => {
            window.onresize = null;
        };
    }, [starColor, backgroundColor, speedFactor, starCount, theme]);

    return (
        <canvas
            id="starfield"
            style={{
                padding: 0,
                margin: 0,
                position: 'relative',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 10,
                opacity: theme === 'dark' ? 0.9 : 0.7,
                pointerEvents: 'none',
                mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
            }}
        ></canvas>
    );
}
