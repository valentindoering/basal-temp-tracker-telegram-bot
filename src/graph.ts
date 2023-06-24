import { createCanvas } from 'canvas';
import fs from 'fs';

/*
// Define data points
const x = [1, 2, 4, 7, 8, 9, 11, 15, 20, 21];
const y = [33.4, 33.5, 33.7, 33.9, 33.2, 33.1, 33.53, 33.3, 33.63, 33.28];
*/


export function drawGraph(x: number[], y: number[], outPath: string) {


    // Set up canvas
    const canvasWidth = 800;
    const canvasHeight = 600;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Define chart area
    const chartLeft = 100;
    const chartTop = 50;
    const chartWidth = canvasWidth - 2 * chartLeft;
    const chartHeight = canvasHeight - 2 * chartTop;

    // Calculate data range
    const xMin = Math.min(...x);
    const xMax = Math.max(...x);
    const yMin = Math.min(...y);
    const yMax = Math.max(...y);
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;

    // Draw chart background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw x-axis and labels
    ctx.beginPath();
    ctx.moveTo(chartLeft, chartTop + chartHeight);
    ctx.lineTo(chartLeft + chartWidth, chartTop + chartHeight);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    const xStep = xRange <= 10 ? 1 : Math.ceil(xRange / 10);
    for (let i = xMin; i <= xMax; i += xStep) {
    const xPos = chartLeft + ((i - xMin) / xRange) * chartWidth;
    ctx.beginPath();
    ctx.moveTo(xPos, chartTop + chartHeight);
    ctx.lineTo(xPos, chartTop + chartHeight + 10);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(i.toString(), xPos, chartTop + chartHeight + 25);
    }


    // Draw y-axis and labels
    ctx.beginPath();
    ctx.moveTo(chartLeft, chartTop);
    ctx.lineTo(chartLeft, chartTop + chartHeight);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    // const yStep = yRange <= 5 ? 0.1 : Math.ceil(yRange / 5);
    const yStep = yRange <= 5 ? yRange / 10 : Math.ceil(yRange / 10);
    for (let i = yMin; i <= yMax; i += yStep) {
    const yPos = chartTop + chartHeight - ((i - yMin) / yRange) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(chartLeft, yPos);
    ctx.lineTo(chartLeft - 10, yPos);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.textAlign = 'right';
    ctx.fillText(i.toFixed(2).toString(), chartLeft - 15, yPos + 5);
    }


    // Draw data line
    ctx.beginPath();
    ctx.moveTo(chartLeft + ((x[0] - xMin) / xRange) * chartWidth, chartTop + chartHeight - ((y[0] - yMin) / yRange) * chartHeight);
    for (let i = 1; i < x.length; i++) {
    const xPos = chartLeft + ((x[i] - xMin) / xRange) * chartWidth;
    const yPos = chartTop + chartHeight - ((y[i] - yMin) / yRange) * chartHeight;
    ctx.lineTo(xPos, yPos);
    }
    ctx.strokeStyle
    // Draw data line
    ctx.beginPath();
    ctx.moveTo(chartLeft + ((x[0] - xMin) / xRange) * chartWidth, chartTop + chartHeight - ((y[0] - yMin) / yRange) * chartHeight);
    for (let i = 1; i < x.length; i++) {
    const xPos = chartLeft + ((x[i] - xMin) / xRange) * chartWidth;
    const yPos = chartTop + chartHeight - ((y[i] - yMin) / yRange) * chartHeight;
    ctx.lineTo(xPos, yPos);
    }
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Export as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outPath, buffer);

}
