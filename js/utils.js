export function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
export function randomWithPercentage(prt) {
    const randNum = Math.floor(randomNumber(0, 100));
    for (const i in prt) {
        if (randNum > 100 - prt[i]) {
            return +i;
        }
    }
    return 0;
}
export function resizeScreen(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
export function collision(e1, e2) {
    const e1_xs = e1.x;
    const e1_xe = e1.x + e1.width;
    const e2_xs = e2.x;
    const e2_xe = e2.x + e2.width;
    const e1_ys = e1.y;
    const e1_ye = e1.y + e1.height;
    const e2_ys = e2.y;
    const e2_ye = e2.y + e2.height;
    if (e1_xs <= e2_xe && e2_xs <= e1_xe && e1_ys <= e2_ye && e2_ys <= e1_ye) {
        return true;
    }
    return false;
}
export function newImage(source) {
    const img = new Image();
    img.src = source;
    return img;
}
//# sourceMappingURL=utils.js.map