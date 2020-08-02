const gol = import("../pkg/index.js");
const mem = import("../pkg/index_bg.wasm");
let firstRun = true;

function getScrollbarWidth(windowHeight) {
    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    function scrollbarVisible(element) {
        // canvas is not initialized, but should be accounted for in calculations
        if (firstRun) {
            return (element.scrollHeight + windowHeight) > element.clientHeight;
        }
        return element.scrollHeight > element.clientHeight;
    }

    if (!scrollbarVisible(document.body)) {
        return 0;
    }

    return scrollbarWidth;
}

const run = (wasm, module, windowWidth, windowHeight, DESIRED_CELLS) => {
    const adjustedCellSizeWidth = windowWidth / DESIRED_CELLS;
    const adjustedCellSizeHeight = windowHeight / DESIRED_CELLS;
    const universe = wasm.Universe.new(DESIRED_CELLS, DESIRED_CELLS);
    const memory = module.memory;
    const width = universe.width();
    const height = universe.height();

    const GAIA_COLOR = "#251D34";
    const AERIE_COLOR = "#26a69a";
    const OMEGA_COLOR = "#d81b60";
    const NOVA_COLOR = "#0288d1";
    const TERRA_COLOR = "#9575cd";

    const canvas = document.getElementById("game-of-life-canvas");
    canvas.height = windowHeight;
    canvas.width = windowWidth;
    const ctx = canvas.getContext('2d');

    const getIndex = (row, column) => {
        return row * width + column;
    };

    const drawCells = (bottomLayerNoise, secondBottomLayerNoise, randomPatternAtThirdMostLayer) => {
        const cellsPtr = universe.cells();
        // every cell is a byte long, can't be bits because more information than 0 or 1 is needed (colony IDs)
        // bits would increase efficiency greatly
        const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

        ctx.beginPath();

        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                const idx = getIndex(row, col);

                ctx.fillStyle = (() => {
                    switch (cells[idx]) {
                        case wasm.ColonyNames.Gaia:
                            return GAIA_COLOR;
                        case wasm.ColonyNames.Omega:
                            return OMEGA_COLOR;
                        case wasm.ColonyNames.Nova:
                            return NOVA_COLOR;
                        case wasm.ColonyNames.Terra:
                            return TERRA_COLOR;
                        case wasm.ColonyNames.Aerie:
                            return AERIE_COLOR;
                    }
                })();

                // last
                if (row === height - 1) {
                    if (bottomLayerNoise[col] === true) ctx.fillStyle = GAIA_COLOR;
                } else if (row === height - 2) {
                    if (secondBottomLayerNoise[col] === true) ctx.fillStyle = GAIA_COLOR;
                } else if (row === height - 3) {
                    if (randomPatternAtThirdMostLayer[col] === true) ctx.fillStyle = GAIA_COLOR;
                }

                ctx.fillRect(
                    col * (adjustedCellSizeWidth),
                    row * (adjustedCellSizeHeight),
                    adjustedCellSizeWidth,
                    adjustedCellSizeHeight
                );
            }
        }

        ctx.stroke();
    };
    return {
        universe,
        drawCells,
    }
};

gol
    .then(wasm => {
        mem.then(module => {
            let windowHeight = window.innerHeight;
            let windowWidth = window.innerWidth - getScrollbarWidth(windowHeight);
            let drawCells, universe;
            let DESIRED_CELLS;
            let randomPatternAtTheBottomLayer, randomPatternAtSecondMostBottomLayer, randomPatternAtThirdMostLayer;
            const setDesiredCells = (windowWidthCells) => {
                if (windowWidthCells < 350) {
                    DESIRED_CELLS = 16;
                } else if (windowWidthCells < 577) {
                    DESIRED_CELLS = 24;
                } else if (windowWidthCells < 992) {
                    DESIRED_CELLS = 48;
                } else {
                    DESIRED_CELLS = 64;
                }
                randomPatternAtTheBottomLayer = Array(DESIRED_CELLS)
                    .fill(null)
                    .map(x => DESIRED_CELLS <= 24
                        ? Math.random() <= 0.90
                        : Math.random() <= 0.75);
                randomPatternAtSecondMostBottomLayer = Array(DESIRED_CELLS)
                    .fill(null)
                    .map(x => DESIRED_CELLS <= 24
                        ? Math.random() <= 0.80
                        : Math.random() <= 0.55);
                randomPatternAtThirdMostLayer = Array(DESIRED_CELLS)
                    .fill(null)
                    .map(x => DESIRED_CELLS <= 24
                        ? Math.random() <= 0.75
                        : Math.random() <= 0.35);
            };
            setDesiredCells(windowWidth);
            window.addEventListener('resize', () => {
                // only update if the width changes, not the height (causes the universe to be reset on phones when scrolling etc).
                if (window.innerWidth - getScrollbarWidth(windowHeight) !== windowWidth) {
                    windowHeight = window.innerHeight;
                    windowWidth = window.innerWidth - getScrollbarWidth(windowHeight);
                    const r = run(wasm, module, windowWidth, windowHeight, DESIRED_CELLS);
                    drawCells = r.drawCells;
                    universe = r.universe;
                    setDesiredCells(windowWidth);
                }
            });
            const r = run(wasm, module, windowWidth, windowHeight, DESIRED_CELLS);
            drawCells = r.drawCells;
            universe = r.universe;

            // TODO stop tick loop after grid has been filled in with one color
            // TODO with a timer and then checking or similar

            const renderLoop = () => {
                universe.tick();
                drawCells(randomPatternAtTheBottomLayer, randomPatternAtSecondMostBottomLayer, randomPatternAtThirdMostLayer);
                setTimeout(() => {
                    requestAnimationFrame(renderLoop);
                }, 17);
            }

            drawCells(randomPatternAtTheBottomLayer, randomPatternAtSecondMostBottomLayer, randomPatternAtThirdMostLayer);
            requestAnimationFrame(renderLoop);
        });
    })
    .catch(err => console.error(err));

