

(function () {

    // create and inject a canvas
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    mapH,
    mapW,
    offX,
    offY,
    //mw,
    //mh,
    keys = [],

    rnd = function () {

        if (sec.pl === undefined) {

            sec.pl = [];

        }

        sec.pl.push({

            x : a,
            y : b,
            s : 5

        });

    },

    ring = function (points, d) {

        var p = points;
        while (p--) {

            var r = Math.PI * 2 / points * p;
            var a = Math.floor(Math.cos(r) * d);
            var b = Math.floor(Math.sin(r) * d);

            //console.log(x + ',' + y)

            //console.log();
            var sec = P.map.getPos(a, b);

            //console.log(sec);

            if (sec === undefined) {

                console.log('undefined sec');
                console.log(a);
                console.log(b);

            } else {

                // no planet array? make one
                if (sec.pl === undefined) {

                    sec.pl = [];

                }

                // push new planet
                sec.pl.push({

                    x : a,
                    y : b,
                    s : 5

                });

            }

        }

    },

    setup = function () {

        // append to body
        document.body.appendChild(canvas);

        // set actual matrix size of the canvas
        canvas.width = 800;
        canvas.height = 600;

        // setup map
        /*
        P.map.sw = 32;
        P.map.sh = 32;
        P.map.W = 20;
        P.map.H = 12;

        P.vp.w = 32;
        P.vp.h = 32;

        P.vp.set();
        P.map.set();

         */
        P.set({

            // setup the section map
            map : {

                sw : 320, // the size of a section
                sh : 240,
                W : 4,
                H : 4

            },

            // set up the view port (or camera)
            vp : {

                w : 640, // set width and height of the view port
                h : 480

            }

        });

        mapW = P.map.sw * P.map.W;
        mapH = P.map.sh * P.map.H;

        offX = mapW / 2 + 10; //mapW / 2 + (canvas.width / 2 - mapW / 2);
        offY = mapH / 2 + 10; //mapH / 2 + (canvas.height / 2 - mapH / 2);


        // start at center
        P.vp.x = -P.vp.w / 2;
        P.vp.y = -P.vp.h / 2;

        // rings
        ring(10, 200);

        /*
        ring(10000, 190);
        ring(5000, 150);
        ring(100, 100);
        ring(20, 50);
        ring(10, 20);

         */

        // load sections for first time
        P.vp.ls();

        cls();
        draw();

        loop();

    },

    // draw all sections
    drawSections = function () {

        var s = P.map.secs;

        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';

        ctx.textBaseline = 'top';
        s.forEach(function (sec, index) {

            ctx.strokeRect(

                sec.x + offX,

                sec.y + offY,

                P.map.sw, P.map.sh);

        });

    },

    drawLoaded = function () {

        ctx.strokeStyle = '#00ffff';
        ctx.fillStyle = '#00ffff';

        ctx.textBaseline = 'top';
        P.map.load.forEach(function (sec, index) {

            ctx.strokeRect(

                sec.x + offX,

                sec.y + offY,

                P.map.sw, P.map.sh);

            ctx.fillText(sec.x - P.vp.x, sec.x + 5 + offX, sec.y + 5 + offY);

        });
    },

    //draw planets
    drawPlanets = function () {

        P.map.load.forEach(function (sec, index) {

            if (sec.pl) {

                sec.pl.forEach(function (pl) {

                    ctx.fillStyle = '#ff0000';
                    ctx.fillRect(pl.x + offX, pl.y + offY, pl.s, pl.s);

                });

            }

        });

    },

    //
    drawViewport = function () {

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#00ff00';

        // draw viewport marker
        ctx.strokeRect(P.vp.x + offX, P.vp.y + offY, P.vp.w, P.vp.h);

        // draw scaled view

        ctx.strokeStyle = '#ffffff';
        //var sx = S.map.load[0].X * S.map.sw;

    },

    drawSceen = function () {

        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;

        var sx = P.vp.sx / P.map.sw * 800,
        sy = P.vp.sy / P.map.sh * 600;

        P.map.load.forEach(function (sec) {

            var box = P.ajust(sec, 800, 600);

            ctx.strokeRect(

                box.x,
                box.y,
                box.w,
                box.h);

            if (sec.pl) {

                sec.pl.forEach(function (pl) {

                    var box = P.ajust(pl, 800, 600);

                    ctx.fillStyle = '#ff0000';
                    ctx.fillRect(box.x, box.y, box.w, box.h);

                });

            }

        });

        ctx.fillStyle = '#ffff00';
        ctx.fillText('sx ' + sx, 10, 300);

    },

    drawInfo = function () {

        var x = 400,
        y = 10,
        dy = 20;

        ctx.fillStyle = '#00ff00';
        ctx.fillText('mw: ' + P.vp.mw, x, y + dy * 1);
        ctx.fillText('mh: ' + P.vp.mh, x, y + dy * 2);
        ctx.fillText('vp pos (px) (' + P.vp.x + ',' + P.vp.y + ')', x, y + dy * 3);
        ctx.fillText('vp pos (sec) (' + P.vp.X + ',' + P.vp.Y + ')', x, y + dy * 4);
        ctx.fillText('vp sec index: ' + P.vp.secIndex, x, y + dy * 5);
        ctx.fillText('vp sec XY offset: (' + P.vp.secXOff + ',' + P.vp.secYOff + ')', x, y + dy * 6);
        ctx.fillText('look ahead: ' + P.vp.la, x, y + dy * 7);
        ctx.fillText('sx: ' + P.vp.sx, x, y + dy * 8);
        ctx.fillText('ajustX: ' + P.vp.ajustX, x, y + dy * 9);

    },

    // the single draw function
    draw = function () {

        drawSceen();

        //drawSections();
        //drawLoaded();
        //drawPlanets();
        //drawViewport();

        drawInfo();
    },

    // clear screen
    cls = function () {

        // default the canvas to a solid back background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

    },

    // the loop
    loop = function () {

        requestAnimationFrame(loop);

        if (keys[87]) {

            P.vp.y -= 1;

        }

        if (keys[83]) {

            P.vp.y += 1;

        }

        if (keys[65]) {

            P.vp.x -= 1;

        }

        if (keys[68]) {

            P.vp.x += 1;

        }

        if (keys[49]) {

            //if (P.vp.w < 1280) {

            P.vp.w += 2;
            P.vp.x -= 1;

            P.vp.h += 2;
            P.vp.y -= 1;

            //}

        }

        if (keys[50]) {

            //if (P.vp.h > 32) {

            P.vp.w -= 2;
            P.vp.x += 1;

            P.vp.h -= 2;
            P.vp.y += 1;

            //}

        }

        if (keys[51]) {

            console.log(P.map.load);

        }

        // multi
        //mw = P.map.sw / P.vp.w;
        //mh = P.map.sh / P.vp.h;

        P.vp.update();
        P.vp.ls();

        cls();
        draw();

    };

    window.onkeydown = function (e) {

        console.log(e.keyCode);

        keys[e.keyCode] = true;

    };

    window.onkeyup = function (e) {

        keys[e.keyCode] = false;

    };

    setup();

}
    ());
