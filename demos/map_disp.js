

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

    setup = function () {

        // append to body
        document.body.appendChild(canvas);

        // set actual matrix size of the canvas
        canvas.width = 800;
        canvas.height = 600;

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
        P.PLRing(10, 200);

        // load sections for first time
        P.vp.ls();

        cls();
        draw();

        loop();

    },

    drawScreen = function () {

        ctx.lineWidth = 3;

        var sx = P.vp.sx / P.map.sw * 800,
        sy = P.vp.sy / P.map.sh * 600;

        P.map.load.forEach(function (sec) {

            var box = P.ajust(sec, 800, 600);

            ctx.strokeStyle = '#ffff00';

            ctx.strokeRect(

                box.x,
                box.y,
                box.w,
                box.h);

            if (sec.pl) {

                sec.pl.forEach(function (pl) {

                    var box = P.ajust(pl, 800, 600);

                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 3;
                    ctx.fillStyle = '#007a7a';

                    ctx.beginPath();
                    ctx.arc(box.x, box.y, box.w, 0, Math.PI * 2);
                    ctx.closePath();

                    ctx.fill();
                    ctx.stroke();

                });

            }

        });

    },

    drawShip = function () {

        var sx = P.vp.sx / P.map.sw * 800,
        sy = P.vp.sy / P.map.sh * 600,

        // player ship
        ps = P.map.pShip,

        box = P.ajust(ps, 800, 600);

        ctx.strokeStyle = 'rgba(0,255,0,.2)';

        ctx.strokeRect(

            box.x,
            box.y,
            ps.s,
            ps.s);

        ctx.strokeStyle = '#00ff00';

        ctx.save();

        ctx.translate(box.x + ps.s / 2, box.y + ps.s / 2);
        ctx.rotate(ps.a);

        ctx.beginPath();
        ctx.moveTo(-ps.s / 2, -ps.s / 2);
        ctx.lineTo(ps.s / 2, 0);
        ctx.lineTo(-ps.s / 2, ps.s / 2)
        ctx.stroke();
        ctx.restore();

    },

    drawShots = function () {

        var sx = P.vp.sx / P.map.sw * 800,
        sy = P.vp.sy / P.map.sh * 600;

        ctx.strokeStyle = '#ffffff';

        P.map.shots.forEach(function (sh) {

            var box = P.ajust(sh, 800, 600);

            ctx.strokeStyle = '#ff0000';
            if (sh.owner === 'p') {

                ctx.strokeStyle = '#00ff00';
            }

            ctx.strokeRect(

                box.x,
                box.y,
                sh.s,
                sh.s);

            //ctx.fillText(sh.l, box.x, box.y);

        });
    },

    drawEnemeys = function () {

        var sx = P.vp.sx / P.map.sw * 800,
        sy = P.vp.sy / P.map.sh * 600;

        P.map.enemys.forEach(function (e) {

            var box = P.ajust(e, 800, 600);

			ctx.strokeStyle = '#ff0000';
            ctx.strokeRect(

                box.x,
                box.y,
                e.s,
                e.s);

        });

    },

    drawInfo = function () {

        var x = 10,
        y = 10,
        dy = 20;

        ctx.fillStyle = '#00ff00';
        ctx.textBaseline = 'top';
        var infos = [

            'vp pos (px) (' + P.vp.x + ',' + P.vp.y + ')',
            'player speed: ' + P.map.pShip.b,
            'e count: ' + P.map.enemys.length

        ];

        infos.forEach(function (fo, i) {

            ctx.fillText(fo, x, y + dy * i)

        });

    },

    /*
    drawInfo = function () {

    var x = 10,
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
     */

    // the single draw function
    draw = function () {

        drawScreen();

        drawEnemeys();
        drawShip();
        drawShots();
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

        P.keyState(keys);

        P.map.update();
        P.vp.update();
        P.vp.ls();

        cls();
        draw();

    };

    window.onkeydown = function (e) {

        keys[e.keyCode] = true;

    };

    window.onkeyup = function (e) {

        keys[e.keyCode] = false;

    };

    setup();

}
    ());
