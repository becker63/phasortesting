import React, { useRef, useEffect } from 'react';
import { useListener } from 'react-bus';
import { start } from 'repl';

interface CanvasProps {
    width: number;
    height: number;
}

const generateline = (start:any, angle:number, ctx:any, color?:string, text?:string) => {
    const dx2 = (start:any, mod:number) => {return (start.x + mod) + Math.cos(Math.PI * angle / 180) * start.y}

    const dy2 = (start:any, mod:number) => {return (start.y + mod) + Math.sin(Math.PI * angle / 180) * start.y}

    const x2 = dx2(start, 0)
    const y2 = dy2(start, 0)

    ctx.moveTo(x2,y2)
    ctx.lineTo(start.x,start.y)
    ctx.strokeStyle = color
    ctx.stroke()
    if(text?.length !== 0){
        ctx.fillText(text,dx2(start, 10),dy2(start, 10))
    }
}

const drawcirclelines = (canvasRef:any) => {
    if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');  
        if (ctx) {
        ctx.beginPath();

        const start = {
            x:500,
            y:200
        }
        ctx.strokeStyle = "black"
        ctx.arc(start.x, start.y, 200, 0, 2 * Math.PI);

        for(let i = 0; i != 360; i++){
            if(i % 30 === 0){
                generateline(start, i, ctx, "black", i.toString())
            }
        }

        

        ctx.stroke();
        } 
    }
}

const Circle = ({ width, height }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        drawcirclelines(canvasRef)       
    },[]);

    const updatedata = (payload: any) => {
        let angle = payload.selectedAnnotation.xMax
        const start = {
            x:500,
            y:200
        }

        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');  
            if (ctx) {
                ctx.clearRect(300,0,400,400)
                generateline(start, angle, ctx, "grey")
            drawcirclelines(canvasRef)       
                
            } 
        }
    }
    useListener("drag", (payload) => updatedata(payload))

    return <canvas ref={canvasRef} height={height} width={width} />;
};

Circle.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight
};

export default Circle;