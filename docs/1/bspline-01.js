/**
 * started by Wiley Corning, February 2021
 * updated by gleicher over the years...
 */
// @ts-check
/* jshint -W069, esversion:6 */

import { runCanvas } from "../../libs/CS559/runCanvas.js";
import { draggablePoints } from "../../libs/CS559/dragPoints.js";

/* no need for onload - we use defer */


const twoPi = 2*Math.PI;

// include the cardinal function for debugging, since I know what it looks like
// adapted to not loop
function cardinal(u,pts, start) {
    let p0 = pts[0 + start];
    let p1 = pts[1 + start];
    let p2 = pts[2 + start];
    let p3 = pts[3 + start];

    // cardinal basis functions
    const s=0.5;
    let u2 = u*u;
    let u3 = u*u*u;
    let b0 =     -s*u +     2*s*u2 -    s  * u3;
    let b1 = 1 +          (s-3)*u2 + (2-s) * u3;
    let b2 =      s*u + (3-2*s)*u2 + (s-2) * u3;
    let b3 =                 -s*u2 +    s  * u3;

    let x = b0*p0[0] + b1*p1[0] + b2*p2[0] + b3*p3[0];
    let y = b0*p0[1] + b1*p1[1] + b2*p2[1] + b3*p3[1];

    // derivative of cardinal basis functions
    let d0 = -s + 2 * u * (2*s)   + 3 * u2 * (-s);
    let d1 =      2 * u * (s-3)   + 3 * u2 * (2-s);
    let d2 =  s + 2 * u * (3-2*s) + 3 * u2 * (s-2);
    let d3 =      2 * u * (-s)    + 3 * u2 * s;

    let dx = d0 * p0[0] + d1*p1[0] + d2*p2[0] + d3*p3[0];
    let dy = d0 * p0[1] + d1*p1[1] + d2*p2[1] + d3*p3[1];

    return [x,y,dx,dy];
}

function bspline(u,pts, start=0) {

    const p0 = pts[0 + start];
    const p1 = pts[1 + start];
    const p2 = pts[2 + start];
    const p3 = pts[3 + start];

    // B-Spline Basis functions from Section 15.6 of the FCG book
    const s=0.5;
    let u2 = u*u;
    let u3 = u*u*u;
    let b0 = 1/6 * (-u3+3*u2-3*u+1);
    let b1 = 1/6 * (3*u3-6*u2+4);
    let b2 = 1/6 * (-3*u3+3*u2+3*u+1);
    let b3 = 1/6 * u3;

    let x = b0*p0[0] + b1*p1[0] + b2*p2[0] + b3*p3[0];
    let y = b0*p0[1] + b1*p1[1] + b2*p2[1] + b3*p3[1];

    // derivative of B-Spline basis functions
    let d0 = 1/6 * (-3*u2 + 6*u -3);
    let d1 = 1/6 * (9*u2-12*u);
    let d2 = 1/6 * (-9*u2+6*u+3);
    let d3 = 1/6 * (3*u2);

    let dx = d0 * p0[0] + d1*p1[0] + d2*p2[0] + d3*p3[0];
    let dy = d0 * p0[1] + d1*p1[1] + d2*p2[1] + d3*p3[1];

    return [x,y,dx,dy];
}

const segcolors = ["blue","red","forestgreen","darkorange","purple","magenta","goldenrod","darkcyan",]

function bsplineDemo(canvasname, thePoints) {
    let canvas = document.getElementById(canvasname);
    if (!(canvas instanceof HTMLCanvasElement))
    throw new Error("Canvas is not HTML Element");
    const context = canvas.getContext("2d")

    function update() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw each segment
        for(let seg=0; seg < thePoints.length-3; seg++) {

            const cid = seg % segcolors.length;

            // compute the beginning and end of the B-Spline Segment
            const begin = bspline(0,thePoints, seg);
            const end = bspline(1,thePoints,seg);
    
            // compute Bezier control points from the B-Spline Segment
            let p0 = [begin[0], begin[1]];
            let p1 = [begin[0] + begin[2] / 3, begin[1] + begin[3] / 3 ];
            let p2 = [end[0] - end[2] / 3, end[1] - end[3] / 3 ];
            let p3 = [end[0], end[1]];

            context.save();
            context.lineWidth = 3;
            context.strokeStyle = segcolors[cid];
            context.beginPath();
            context.moveTo(p0[0],p0[1]);
            context.bezierCurveTo(p1[0],p1[1], p2[0],p2[1], p3[0],p3[1]);
            context.stroke();
            context.restore();
        }

        // draw black dots
        for(let pt of thePoints) {
            context.fillStyle = "black";
            context.beginPath();
            context.arc(pt[0], pt[1], 3, 0, twoPi);
            context.fill();
        }
    }

    draggablePoints(canvas, thePoints, update);

    update();
}

bsplineDemo("canvas1", [ [100, 200], [100, 100], [300, 100], [300, 200] ]);

