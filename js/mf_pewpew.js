
var P = (function () {

    // distance formula
    var d = function (x1, y1, x2, y2) {

        return Math.sqrt(Math.abs(Math.pow(x1 - x2, 2)) + Math.abs(Math.pow(y1 - y2, 2)));

    },

    // BA is for Base Unit Class
    BA = function (o) {

        o = o || {};

        this.n = o.n || 'p'; // n if for owner
        this.x = o.x || 0; // x pos
        this.y = o.y || 0; // y pos

        //this.a = o.a || 0; // delta x
        //this.b = o.b || 0; // delta y

        this.a = o.a || 0; // heading
        this.b = o.b || 0; // speed

        this.s = o.s || 8; // width
        //this.h = o.h || 8; // height

    },

    // SH is for Shot Class
    SH = function (o) {

        BA.call(this, o);

        this.l = o.l || 100; // life span
        this.dam = 1; // damage

    },

    // VE is for vessel
    VE = function (o) {

        BA.call(this, o);

        this.lf = new Date();
        this.fr = 100;
        this.H = 1; // max HP
        this.i = this.H; // HP

    };

    // PL is for Planet
    PL = function (o) {

        BA.call(this, o);

        this.sp = false;

        this.lp = new Date();
        this.ore = 0;

        this.d = d(0, 0, this.x, this.y);

    },

    // prototypes are lower down

    // the section map
    map = {

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

            // stretch view port to section size
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

    };

    map.set();
    vp.set();

    // unit protypes

    // U.a(unitObj) - The angle to the given unit object
    BA.prototype.u = function (u) {

        return this.p(u.x, u.y);

    };

    // angle to given Point
    BA.prototype.p = function (x, y) {

        return Math.atan2(this.y - y, this.x - x);

    };

    // distance collision detection
    BA.prototype.c = function (u) {

        if (d(this.x, this.y, u.x, u.y) < u.s) {

            return true;

        }

        return false;

    };

    // shot inherits from Unit
    SH.prototype = new BA();

    VE.prototype = new BA();

    // shoot
    VE.prototype.shoot = function () {

        var now = new Date();

        if (now - this.lf >= this.fr) {

            var s = new S({

                    x : this.x,
                    y : this.y,
                    a : this.a,
                    s : 3,
                    b : 3

                });

            a.s.u.push(s);

            this.lf = new Date();

        }

    };

    PL.prototype = new BA();

    // cost to buy start port
    PL.prototype.cost = function () {

        // cost based on distance
        return Math.floor(10 + this.d / 100 * 5);

    };

    // buy a planet, by building a start port with the given money balance
    PL.buy = function (bal, cb) {

        if (!this.sp) {

            if (bal >= this.cost()) {

                // we now have a space port
                this.sp = true;

                // production will now start
                this.lp = new Date();

                cb('b'); // b for built

            } else {

                cb('m'); // m for not enough money

            }

        } else {

            cb('h'); // h for have it to begin with

        }

    };

    // production
    PL.prototype.pro = function () {

        if (this.sp) {}

    };

    return {

        map : map,
        vp : vp,

        set : function (opt) {

            opt = opt || {};
            opt.map = opt.map || {};
            opt.vp = opt.vp || {};

            // map
            map.sw = opt.map.sw || 320;
            map.sh = opt.map.sh || 240;
            map.W = opt.map.W || 4;
            map.H = opt.map.H || 4;

            map.set();

            // vp
            vp.w = opt.vp.w || 320;
            vp.h = opt.vp.h || 240;
            vp.set();
            vp.ls();

        },

        // make a planet ring
        PLRing : function (points, d) {

            var p = points;
            while (p--) {

                var r = Math.PI * 2 / points * p,
                a = Math.floor(Math.cos(r) * d),
                b = Math.floor(Math.sin(r) * d),
                sec = P.map.getPos(a, b);

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
                    /*
                    sec.pl.push({

                    x : a,
                    y : b,
                    s : 5

                    });
                     */

                    sec.pl.push(new PL({

                            x : a,
                            y : b,
                            s : 5

                        }))

                }

            }

        },

        // return an adjusted object with the given width and height values
        ajust : function (obj, width, height) {

            width = width || 640;
            height = height || 480;

            return {

                x : (obj.x - vp.x) / map.sw * width / vp.mw,
                y : (obj.y - vp.y) / map.sh * height / vp.mh,
                w : obj.s === undefined ? width / vp.mw : obj.s * (11 - vp.mh),
                h : obj.s === undefined ? height / vp.mh : obj.s * (11 - vp.mh)

            };

        }
    }
}
    ());
