// This is a micro framework for space shooter type games with added stuff for "Planets"

var U = (function () {

    // distance formula
    var d = function (x1, y1, x2, y2) {

        return Math.sqrt(Math.abs(Math.pow(x1 - x2, 2)) + Math.abs(Math.pow(y1 - y2, 2)));

    },

    // B is for Base Unit Class
    B = function (o) {

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

    // S is for Shot Class
    S = function (o) {

        B.call(this, o);

        this.l = o.l || 100; // life span
        this.dam = 1; // damage

    },

    // V is for vessel
    V = function (o) {

        B.call(this, o);

        this.lf = new Date();
        this.fr = 100;
        this.H = 1; // max HP
        this.i = this.H; // HP

    };

    // P is for Planet
    P = function (o) {

        B.call(this, o);

        this.sp = false;

        this.lp = new Date();
        this.ore = 0;

        this.d = d(0, 0, this.x, this.y);

    };

    // a if for API
    a = {

        // s id for state object
        s : {

            u : [], // the units array

        },

        // ref to distance formula
        d : d,

        // add a new vessel
        a : function (o) {

            var v = new V(o);

            this.s.u.push(v);

            // return a reference
            return v;

        },

        // add new planet
        p : function (o) {

            this.s.u.push(new P(o))

        },

        // update all units
        u : function () {

            var un = this.s.u;

            un.forEach(function (u) {

                // move by heading and speed
                u.x += Math.cos(u.a) * u.b;
                u.y += Math.sin(u.a) * u.b;

                // if lifespan (l) then we have a shot unit
                if (u.l != undefined) {

                    // check all units to see if we hit something
                    un.forEach(function (cu) {

                        if (u.c(cu)) {

                            // if unit has hp (i) and the owner (n) does not belong to the shot
                            if (cu.i && cu.n != u.n) {

                                // apply damage
                                cu.i -= u.dam;

                                // shot is now spent
                                u.l = 0;

                            }

                        }

                    });

                    // shot looses 1 lifespan point per tick
                    u.l -= 1;

                }

            });

            // purge dead units
            var i = un.length;
            while (i--) {

                // if lifespan is out
                if (un[i].l <= 0 || un[i].i <= 0) {

                    un.splice(i, 1);

                }

            }

        }

    };

    // U.a(unitObj) - The angle to the given unit object
    B.prototype.u = function (u) {

        return this.p(u.x, u.y);

    };

    // angle to given Point
    B.prototype.p = function (x, y) {

        return Math.atan2(this.y - y, this.x - x);

    };

    // distance collision detection
    B.prototype.c = function (u) {

        if (d(this.x, this.y, u.x, u.y) < u.s) {

            return true;

        }

        return false;

    };

    // shot inherits from Unit
    S.prototype = new B();

    V.prototype = new B();

    // shoot
    V.prototype.shoot = function () {

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

    P.prototype = new B();

    // cost to buy start port
    P.prototype.cost = function () {

        // cost based on distance
        return Math.floor(10 + this.d / 100 * 5);

    };

    // buy a planet, by building a start port with the given money balance
    P.buy = function (bal, cb) {

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
    P.prototype.pro = function () {

        if (this.sp) {}

    };

    return a;

}
    ());
