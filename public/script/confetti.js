function shootConfetti() {
    var duration = 2 * 200;
    var end = Date.now() + duration;

    (function frame() {
        confetti({
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            gravity: 1,
            origin: {
                x: Math.random(),
                y: Math.random() - 0.2
            }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

window.onload = function() {
    shootConfetti();
};