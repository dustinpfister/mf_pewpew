/* sections with zoom feature */

var S = (function () {

    // the section map
    var map = {

        sw : 32, // the pixel width and height of a section
        sh : 16,
        W : 23, // the section matrix width and height
        H : 17,

        secs : [], // the sections array
        load : [], // currently loaded sections

        // get a section by x, and y pixel location
        getPos : function (x, y, debug) {

            return this.get(Math.floor(x / this.sw), Math.floor(y / this.sh), debug);

        },

        // get a section by X & Y sec pos
        get : function (X, Y, debug) {

            var hw = Math.ceil(map.W / 2),
            hh = Math.ceil(map.H / 2);

            if (X >= -hw && X < hw && Y >= -hh && Y < hh) {

                return this.secs[map.W * (Y + hh) + X + hw];

            };

            return {};

        },

        // setup sections
        set : function () {

            var X,
            s = this,
            Y = Math.floor(-s.H / 2),
            x,
            y;

            s.secs = [];
            while (Y < s.H / 2) {

                X = Math.floor(-s.W / 2);
                while (X < s.W / 2) {

                    x = X * s.sw;
                    y = Y * s.sh;

                    // push new section object
                    s.secs.push({

                        i : (Y + Math.floor(s.H / 2)) * s.W + X + Math.floor(s.W / 2),
                        X : X, // cell pos
                        Y : Y,
                        x : x, // px pos
                        y : y

                    });

                    X += 1;

                }

                Y += 1;
            }

        }

    },

    // the view port
    vp = {

        w : 160,
        h : 120,

        // set up
        set : function () {

            var s = this;

            s.x = -s.w / 2;
            s.y = -s.h / 2;
            s.la = 1;

            s.update();

        },

        update : function () {

            var s = this,
            l = map.load[0];

            s.X = Math.floor(s.x / map.sw);
            s.Y = Math.floor(s.y / map.sh);

            s.mw = s.w / map.sw;
            s.mh = s.h / map.sh;

            s.secIndex = Math.floor((s.Y + map.H / 2) * map.W + s.X + map.W / 2);

            s.secXOff = s.x % map.sw;
            s.secXOff = s.secXOff < 0 ? map.sw + s.secXOff : s.secXOff;
            s.secYOff = s.y % map.sh;
            s.secYOff = s.secYOff < 0 ? map.sh + s.secYOff : s.secYOff;

            // start x when rendering
            s.sx = 0;
            if (l) {

                s.sx = l.x - s.x;
                s.sy = l.y - s.y;

                s.ajustX = l.X * map.sw * s.mw;
                s.ajustY = l.Y * map.sh * s.mh;

            }

        },

        // load sections based on current view port position
        ls : function () {

            var s = this;

            map.load = [];

            var SX = Math.round(s.x / map.sw),
            SY = Math.round(s.y / map.sh),
            EX = Math.round((s.x + s.w) / map.sw),
            EY = Math.round((s.y + s.h) / map.sh),

            Y,
            X,
            i;

            Y = SY - s.la;
            while (Y < EY + s.la) {

                X = SX - s.la;
                while (X < EX + s.la) {

                    var sec = map.get(X, Y);

                    if (sec.X != undefined) {

                        map.load.push(sec);
                    }

                    X += 1;

                }

                Y += 1;

            }

        }

    },

    // the public api
    api = {

        // ref to map
        map : map,

        // ref to vp
        vp : vp,

        ajust : function (obj, width, height) {

            width = width || 640;
            height = height || 480;

            return {

                x : (obj.x - vp.x) / map.sw * width / vp.mw,
                y : (obj.y - vp.y) / map.sh * height / vp.mh,
                w : obj.s === undefined ? width / vp.mw : obj.s * (11 - S.vp.mh),
                h : obj.s === undefined ? height / vp.mh : obj.s * (11 - S.vp.mh)

            };

        }

    };

    vp.set();
    map.set();

    return api;

}
    ());
