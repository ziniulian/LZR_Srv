function getWindLayer () {
    return {
        windy: {},
        rowNo: 60,
        columnNo: 30,
        windData:[],
        particles: [],
        buckets:[],
        windStyles: [],
        start_color: {
            r: 67, g: 110, b: 238
        },
        end_color: {
            r: 28, g: 134, b: 238
        },
        extent:{},
        MAX_WIND_INTENSITY: 20,
        MAX_PARTICLE_AGE: 100,
        WIND_SPEED_SCALE:1000,
        _isStop: false,
        DRAW_COMPLETED: 'draw_completed',
        name: 'WindLayer',
        constructor: function (_map, _context, options) {
            this.map = _map;
            this._context = _context;
            this.opacity = options.opacity;
            this._init();
        },

        _init: function () {
            var rdiff = this.end_color.r - this.start_color.r;
            var gdiff = this.end_color.g - this.start_color.g;
            var bdiff = this.end_color.b - this.start_color.b;
            for (var i = 0; i < this.MAX_WIND_INTENSITY; i++) {
                var r =Math.round(this.start_color.r + rdiff * i / this.MAX_WIND_INTENSITY);
                var g = Math.round(this.start_color.g + gdiff * i / this.MAX_WIND_INTENSITY);
                var b = Math.round(this.start_color.b + bdiff * i / this.MAX_WIND_INTENSITY);
                var color = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + this.opacity + ')';
                var lineWidth=1*(i+1)/this.MAX_WIND_INTENSITY+0.8;
                this.windStyles.push({ color: color, lineWidth: lineWidth});
            }
            this.buckets = this.windStyles.map(function () { return []; }); // ------ map -------------
        },
        _indexFor:function(m) {
            return Math.floor(Math.min(m, this.MAX_WIND_INTENSITY) / this.MAX_WIND_INTENSITY * (this.windStyles.length - 1));
        },

        addWinds: function (data,rowNo, columnNo) {
            this.windData = data;
            this.rowNo = rowNo;
            this.columnNo = columnNo;

            var len = data.length;
            var xmin = data[0][0];
            var ymin = data[0][1];
            var xmax = data[len - 1][0];
            var ymax = data[len - 1][1];
            this.extent = { xmin: xmin, ymin: ymin, xmax: xmax, ymax: ymax };

            this.particles = [];
            for (var i = 0; i < len; i++) {
                this.particles.push({
                    idf:i,
                    x: data[i][0], y: data[i][1],
                    u: data[i][2] * this.WIND_SPEED_SCALE, v: data[i][3] * this.WIND_SPEED_SCALE,
                    age: Math.floor(Math.random() * this.MAX_PARTICLE_AGE) + 0,
                    inGrid:true
                });
            }

            this._isStop = false;
            this._animate();
            // this.emit(this.DRAW_COMPLETED, {    // ------ emit -------------
            //     bubbles: true,
            //     cancelable: true
            // });
        },
        changeWindData: function (data) {
            this.windData = data;
            var len = this.particles.length;
            for (var i = 0; i < len; i++) {
                var index = this._D42(this.particles[i].x, this.particles[i].y, this.particles[i].u, this.particles[i].v);
                if (index) {
                    this.particles[i].u = data[index][2] * this.WIND_SPEED_SCALE;
                    this.particles[i].v = data[index][3] * this.WIND_SPEED_SCALE;
                }

            }
            // this.emit(this.DRAW_COMPLETED, {    // ------ emit -------------
            //     bubbles: true,
            //     cancelable: true
            // });
        },
        _evolve: function () {
            var that = this;
            this.buckets.forEach(function (bucket) { bucket.length = 0; }); // ------ forEach -------------
            this.particles.forEach(function (particle) {    // ------ forEach -------------
                if (particle.u != 0 && particle.v!=0) {
                    if (particle.age > that.MAX_PARTICLE_AGE) {
                        particle.age = 0;
                        particle.x = that.windData[particle.idf][0];
                        particle.y = that.windData[particle.idf][1];
                        particle.u = that.windData[particle.idf][2] * that.WIND_SPEED_SCALE;
                        particle.v = that.windData[particle.idf][3] * that.WIND_SPEED_SCALE;
                    }

                    var x = particle.x;
                    var y = particle.y;

                    var flag0 = that._isInGrid(x, y);
                    if (!flag0) {
                        particle.age = that.MAX_PARTICLE_AGE;
                        particle.inGrid = false;
                    } else {
                        var xt = x + particle.u;
                        var yt = y + particle.v;
                        var flag1 = that._isInGrid(xt, yt);
                        if (flag1) {
                            particle.xt = xt;
                            particle.yt = yt;

                            var particle_t = that._D4(particle);
                            if (particle_t) {
                                //particle.xt = particle_t.xt;
                                //particle.yt = particle_t.yt;
                                particle.u = particle_t.u;
                                particle.v = particle_t.v;
                                //particle.age = that.MAX_PARTICLE_AGE;
                            }
                            var l = Math.sqrt(Math.pow(particle.u / that.WIND_SPEED_SCALE, 2) + Math.pow(particle.v / that.WIND_SPEED_SCALE, 2))
                            //if (particle.inGrid) {
                                that.buckets[that._indexFor(l)].push(particle);
                            //}


                        } else {
// console.log(x + " , " + y + " . " + flag0 + " ; " + xt + " , " + yt + " . " + flag1);
                            particle.x = xt;
                            particle.y = yt;
                            particle.inGrid = false;
                        }
                    }
                    particle.age++;
                }

            });
        },

        _drawWinds: function () {
            var prev = this._context.globalCompositeOperation;
            this._context.globalCompositeOperation = 'destination-in';
            this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);
            this._context.globalCompositeOperation = prev;

            for (var i = 0; i < this.buckets.length; i++) {
                this._context.beginPath();
                this._context.strokeStyle = this.windStyles[i].color;
                this._context.lineWidth = this.windStyles[i].lineWidth;

                for (var j = 0; j < this.buckets[i].length; j++) {
                    var startPoint = this.map.getPixelFromCoordinate([this.buckets[i][j].x, this.buckets[i][j].y]);
                    var endPoint = this.map.getPixelFromCoordinate([this.buckets[i][j].xt, this.buckets[i][j].yt]);
                    this._context.moveTo(startPoint[0], startPoint[1]);
                    this._context.lineTo(endPoint[0], endPoint[1]);
                    this.buckets[i][j].x = this.buckets[i][j].xt;
                    this.buckets[i][j].y = this.buckets[i][j].yt;
                }
                this._context.stroke();
            }
        },

        _D4: function (particle) {
            var xstep = (this.extent.xmax - this.extent.xmin) / (this.rowNo - 1);
            var ystep = (this.extent.ymax - this.extent.ymin) / (this.columnNo - 1);
            var xoffset = particle.x - this.extent.xmin;
            var yoffset = particle.y - this.extent.ymin;
            var index_o = Math.floor(yoffset/ ystep) * this.rowNo + Math.floor(xoffset/xstep);

            var xtoffset = particle.xt - this.extent.xmin;
            var ytoffset = particle.yt - this.extent.ymin;
            var index_n = Math.floor(ytoffset / ystep) * this.rowNo + Math.floor(xtoffset / xstep);
            var len=this.windData.length;
            if ((index_o != index_n) && index_n >= 0 && index_n < len) {

                var index_result = index_o;
                var radians = Math.atan2(particle.v,particle.u);
                if(radians<0){radians = 2*Math.PI + radians; }
                var angle = radians * 180 / Math.PI;
                if (angle <= 90) {
                    index_result = index_o + this.rowNo + 1;
                } else if (angle <= 180) {
                    index_result = index_o + this.rowNo;
                } else if (angle <= 270) {
                    index_result = index_o;
                } else {
                    index_result = index_o + 1;
                }
                if (index_result >= 0 && index_result < len) {
                    //var dis = Math.sqrt(Math.pow(this.windData[index_result][0] - particle.x, 2) + Math.pow(this.windData[index_result][1] - particle.y, 2));
                    //var sp = Math.sqrt(Math.pow(particle.u, 2) + Math.pow(particle.v, 2));
                    //if (sp > dis) {
                        return {
                           // xt: this.windData[index_result][0],
                           // yt: this.windData[index_result][1],
                            u: this.windData[index_result][2] * this.WIND_SPEED_SCALE,
                            v: this.windData[index_result][3] * this.WIND_SPEED_SCALE
                        };
                    //}
                }
            }
            return null;
        },

        _D42: function (x, y,u,v) {
            var xstep = (this.extent.xmax - this.extent.xmin) / (this.rowNo - 1);
            var ystep = (this.extent.ymax - this.extent.ymin) / (this.columnNo - 1);
            var xoffset = x - this.extent.xmin;
            var yoffset = y - this.extent.ymin;
            var index_o = Math.floor(yoffset/ ystep) * this.rowNo + Math.floor(xoffset/xstep);
            var len=this.particles.length;
            if (index_o >= 0 && index_o < len) {

                var index_result = index_o;
                var radians = Math.atan2(v, u);
                if (radians < 0) { radians = 2 * Math.PI + radians; }
                var angle = radians * 180 / Math.PI;
                if (angle <= 90) {
                    index_result = index_o + this.rowNo + 1;
                } else if (angle <= 180) {
                    index_result = index_o + this.rowNo;
                } else if (angle <= 270) {
                    index_result = index_o;
                } else {
                    index_result = index_o + 1;
                }
                if (index_result >= 0 && index_result < len) {
                    return index_result;
                }
            }
            return null;
        },

        _isInGrid: function (x, y) {
            var cond1 = (x >= this.extent.xmin && x <= this.extent.xmax);
            var cond2 = (y >= this.extent.ymin && y <= this.extent.ymax);
            if (cond1 && cond2) {
                return true;
            } else {
                return false;
            }

        },

        _animate: function () {
            var that = this;
            (function frame() {
                try {
                    // that.windy.timer = setTimeout(lang.hitch(that, function () {
                    that.windy.timer = setTimeout(LZR.bind(that, function () {
                        if (that._isStop) {
                            return;
                        }
                        that._requestAnimationFrame(frame);
                        that._evolve();
                        that._drawWinds();
                    }), 1000 / 20);
                }
                catch (e) {
                    console.error(e);
                }
            })();
        },
        _requestAnimationFrame: function (callback) {
            return window.setTimeout(callback, 1000 / 20);
        },
        clear: function () {
            this.stop();
            // this.inherited(arguments);  // ------ inherited -------------
        },

        stop: function () {
            if (this.windy.timer) {
                this._isStop = true;
                clearTimeout(this.windy.timer);
            }
        }
    };
}
