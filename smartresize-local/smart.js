(function(a) {
    var b = a.Uint8Array,
        d = a.HTMLCanvasElement,
        c = d && d.prototype,
        e = /\s*;\s*base64\s*(?:;|$)/i,
        f = "toDataURL",
        h, g = function(p) {
            var q = p.length,
                m = new b(q / 4 * 3 | 0),
                o = 0,
                s = 0,
                t = [0, 0],
                j = 0,
                r = 0,
                n, k, l;
            while (q--) {
                k = p.charCodeAt(o++);
                n = h[k - 43];
                if (n !== 255 && n !== l) {
                    t[1] = t[0];
                    t[0] = k;
                    r = (r << 6) | n;
                    j++;
                    if (j === 4) {
                        m[s++] = r >>> 16;
                        if (t[1] !== 61) {
                            m[s++] = r >>> 8
                        }
                        if (t[0] !== 61) {
                            m[s++] = r
                        }
                        j = 0
                    }
                }
            }
            return m
        };
    if (b) {
        h = new b([62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51])
    }
    if (d && !c.toBlob) {
        c.toBlob = function(p, n) {
            if (!n) {
                n = "image/png"
            }
            if (this.mozGetAsFile) {
                p(this.mozGetAsFile("canvas", n));
                return
            }
            if (this.msToBlob && /^\s*image\/png\s*(?:$|;)/i.test(n)) {
                p(this.msToBlob());
                return
            }
            var m = Array.prototype.slice.call(arguments, 1),
                k = this[f].apply(this, m),
                j = k.indexOf(","),
                o = k.substring(j + 1),
                i = e.test(k.substring(0, j)),
                l;
            if (Blob.fake) {
                l = new Blob;
                if (i) {
                    l.encoding = "base64"
                } else {
                    l.encoding = "URI"
                }
                l.data = o;
                l.size = o.length
            } else {
                if (b) {
                    if (i) {
                        l = new Blob([g(o)], {
                            type: n
                        })
                    } else {
                        l = new Blob([decodeURIComponent(o)], {
                            type: n
                        })
                    }
                }
            }
            p(l)
        };
        if (c.toDataURLHD) {
            c.toBlobHD = function() {
                f = "toDataURLHD";
                var i = this.toBlob();
                f = "toDataURL";
                return i
            }
        } else {
            c.toBlobHD = c.toBlob
        }
    }
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content || this));
var saveAs = saveAs || function(e) {
    "use strict";
    if (typeof e === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
        return
    }
    var t = e.document,
        n = function() {
            return e.URL || e.webkitURL || e
        },
        r = t.createElementNS("http://www.w3.org/1999/xhtml", "a"),
        o = "download" in r,
        a = function(e) {
            var t = new MouseEvent("click");
            e.dispatchEvent(t)
        },
        i = /constructor/i.test(e.HTMLElement) || e.safari,
        f = /CriOS\/[\d]+/.test(navigator.userAgent),
        u = function(t) {
            (e.setImmediate || e.setTimeout)(function() {
                throw t
            }, 0)
        },
        s = "application/octet-stream",
        d = 1e3 * 40,
        c = function(e) {
            var t = function() {
                if (typeof e === "string") {
                    n().revokeObjectURL(e)
                } else {
                    e.remove()
                }
            };
            setTimeout(t, d)
        },
        l = function(e, t, n) {
            t = [].concat(t);
            var r = t.length;
            while (r--) {
                var o = e["on" + t[r]];
                if (typeof o === "function") {
                    try {
                        o.call(e, n || e)
                    } catch (a) {
                        u(a)
                    }
                }
            }
        },
        p = function(e) {
            if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)) {
                return new Blob([String.fromCharCode(65279), e], {
                    type: e.type
                })
            }
            return e
        },
        v = function(t, u, d) {
            if (!d) {
                t = p(t)
            }
            var v = this,
                w = t.type,
                m = w === s,
                y, h = function() {
                    l(v, "writestart progress write writeend".split(" "))
                },
                S = function() {
                    if ((f || m && i) && e.FileReader) {
                        var r = new FileReader;
                        r.onloadend = function() {
                            var t = f ? r.result : r.result.replace(/^data:[^;]*;/, "data:attachment/file;");
                            var n = e.open(t, "_blank");
                            if (!n)
                                e.location.href = t;
                            t = undefined;
                            v.readyState = v.DONE;
                            h()
                        };
                        r.readAsDataURL(t);
                        v.readyState = v.INIT;
                        return
                    }
                    if (!y) {
                        y = n().createObjectURL(t)
                    }
                    if (m) {
                        e.location.href = y
                    } else {
                        var o = e.open(y, "_blank");
                        if (!o) {
                            e.location.href = y
                        }
                    }
                    v.readyState = v.DONE;
                    h();
                    c(y)
                };
            v.readyState = v.INIT;
            if (o) {
                y = n().createObjectURL(t);
                setTimeout(function() {
                    r.href = y;
                    r.download = u;
                    a(r);
                    h();
                    c(y);
                    v.readyState = v.DONE
                });
                return
            }
            S()
        },
        w = v.prototype,
        m = function(e, t, n) {
            return new v(e, t || e.name || "download", n)
        };
    if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
        return function(e, t, n) {
            t = t || e.name || "download";
            if (!n) {
                e = p(e)
            }
            return navigator.msSaveOrOpenBlob(e, t)
        }
    }
    w.abort = function() {};
    w.readyState = w.INIT = 0;
    w.WRITING = 1;
    w.DONE = 2;
    w.error = w.onwritestart = w.onprogress = w.onwrite = w.onabort = w.onerror = w.onwriteend = null;
    return m
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content);
if (typeof module !== "undefined" && module.exports) {
    module.exports.saveAs = saveAs
} else if (typeof define !== "undefined" && define !== null && define.amd !== null) {
    define("FileSaver.js", function() {
        return saveAs
    })
}! function(a) {
    if ("object" == typeof exports && "undefined" != typeof module)
        module.exports = a();
    else if ("function" == typeof define && define.amd)
        define([], a);
    else {
        var b;
        b = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this,
            b.JSZip = a()
    }
}(function() {
    return function a(b, c, d) {
        function e(g, h) {
            if (!c[g]) {
                if (!b[g]) {
                    var i = "function" == typeof require && require;
                    if (!h && i)
                        return i(g, !0);
                    if (f)
                        return f(g, !0);
                    var j = new Error("Cannot find module '" + g + "'");
                    throw j.code = "MODULE_NOT_FOUND",
                        j
                }
                var k = c[g] = {
                    exports: {}
                };
                b[g][0].call(k.exports, function(a) {
                    var c = b[g][1][a];
                    return e(c ? c : a)
                }, k, k.exports, a, b, c, d)
            }
            return c[g].exports
        }
        for (var f = "function" == typeof require && require, g = 0; g < d.length; g++)
            e(d[g]);
        return e
    }({
        1: [function(a, b, c) {
            "use strict";
            var d = a("./utils"),
                e = a("./support"),
                f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            c.encode = function(a) {
                    for (var b, c, e, g, h, i, j, k = [], l = 0, m = a.length, n = m, o = "string" !== d.getTypeOf(a); l < a.length;)
                        n = m - l,
                        o ? (b = a[l++],
                            c = l < m ? a[l++] : 0,
                            e = l < m ? a[l++] : 0) : (b = a.charCodeAt(l++),
                            c = l < m ? a.charCodeAt(l++) : 0,
                            e = l < m ? a.charCodeAt(l++) : 0),
                        g = b >> 2,
                        h = (3 & b) << 4 | c >> 4,
                        i = n > 1 ? (15 & c) << 2 | e >> 6 : 64,
                        j = n > 2 ? 63 & e : 64,
                        k.push(f.charAt(g) + f.charAt(h) + f.charAt(i) + f.charAt(j));
                    return k.join("")
                },
                c.decode = function(a) {
                    var b, c, d, g, h, i, j, k = 0,
                        l = 0,
                        m = "data:";
                    if (a.substr(0, m.length) === m)
                        throw new Error("Invalid base64 input, it looks like a data url.");
                    a = a.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                    var n = 3 * a.length / 4;
                    if (a.charAt(a.length - 1) === f.charAt(64) && n--,
                        a.charAt(a.length - 2) === f.charAt(64) && n--,
                        n % 1 !== 0)
                        throw new Error("Invalid base64 input, bad content length.");
                    var o;
                    for (o = e.uint8array ? new Uint8Array(0 | n) : new Array(0 | n); k < a.length;)
                        g = f.indexOf(a.charAt(k++)),
                        h = f.indexOf(a.charAt(k++)),
                        i = f.indexOf(a.charAt(k++)),
                        j = f.indexOf(a.charAt(k++)),
                        b = g << 2 | h >> 4,
                        c = (15 & h) << 4 | i >> 2,
                        d = (3 & i) << 6 | j,
                        o[l++] = b,
                        64 !== i && (o[l++] = c),
                        64 !== j && (o[l++] = d);
                    return o
                }
        }, {
            "./support": 30,
            "./utils": 32
        }],
        2: [function(a, b, c) {
            "use strict";

            function d(a, b, c, d, e) {
                this.compressedSize = a,
                    this.uncompressedSize = b,
                    this.crc32 = c,
                    this.compression = d,
                    this.compressedContent = e
            }
            var e = a("./external"),
                f = a("./stream/DataWorker"),
                g = a("./stream/DataLengthProbe"),
                h = a("./stream/Crc32Probe"),
                g = a("./stream/DataLengthProbe");
            d.prototype = {
                    getContentWorker: function() {
                        var a = new f(e.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new g("data_length")),
                            b = this;
                        return a.on("end", function() {
                                if (this.streamInfo.data_length !== b.uncompressedSize)
                                    throw new Error("Bug : uncompressed data size mismatch")
                            }),
                            a
                    },
                    getCompressedWorker: function() {
                        return new f(e.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression)
                    }
                },
                d.createWorkerFrom = function(a, b, c) {
                    return a.pipe(new h).pipe(new g("uncompressedSize")).pipe(b.compressWorker(c)).pipe(new g("compressedSize")).withStreamInfo("compression", b)
                },
                b.exports = d
        }, {
            "./external": 6,
            "./stream/Crc32Probe": 25,
            "./stream/DataLengthProbe": 26,
            "./stream/DataWorker": 27
        }],
        3: [function(a, b, c) {
            "use strict";
            var d = a("./stream/GenericWorker");
            c.STORE = {
                    magic: "\0\0",
                    compressWorker: function(a) {
                        return new d("STORE compression")
                    },
                    uncompressWorker: function() {
                        return new d("STORE decompression")
                    }
                },
                c.DEFLATE = a("./flate")
        }, {
            "./flate": 7,
            "./stream/GenericWorker": 28
        }],
        4: [function(a, b, c) {
            "use strict";

            function d() {
                for (var a, b = [], c = 0; c < 256; c++) {
                    a = c;
                    for (var d = 0; d < 8; d++)
                        a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
                    b[c] = a
                }
                return b
            }

            function e(a, b, c, d) {
                var e = h,
                    f = d + c;
                a ^= -1;
                for (var g = d; g < f; g++)
                    a = a >>> 8 ^ e[255 & (a ^ b[g])];
                return a ^ -1
            }

            function f(a, b, c, d) {
                var e = h,
                    f = d + c;
                a ^= -1;
                for (var g = d; g < f; g++)
                    a = a >>> 8 ^ e[255 & (a ^ b.charCodeAt(g))];
                return a ^ -1
            }
            var g = a("./utils"),
                h = d();
            b.exports = function(a, b) {
                if ("undefined" == typeof a || !a.length)
                    return 0;
                var c = "string" !== g.getTypeOf(a);
                return c ? e(0 | b, a, a.length, 0) : f(0 | b, a, a.length, 0)
            }
        }, {
            "./utils": 32
        }],
        5: [function(a, b, c) {
            "use strict";
            c.base64 = !1,
                c.binary = !1,
                c.dir = !1,
                c.createFolders = !0,
                c.date = null,
                c.compression = null,
                c.compressionOptions = null,
                c.comment = null,
                c.unixPermissions = null,
                c.dosPermissions = null
        }, {}],
        6: [function(a, b, c) {
            "use strict";
            var d = null;
            d = "undefined" != typeof Promise ? Promise : a("lie"),
                b.exports = {
                    Promise: d
                }
        }, {
            lie: 58
        }],
        7: [function(a, b, c) {
            "use strict";

            function d(a, b) {
                h.call(this, "FlateWorker/" + a),
                    this._pako = null,
                    this._pakoAction = a,
                    this._pakoOptions = b,
                    this.meta = {}
            }
            var e = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array,
                f = a("pako"),
                g = a("./utils"),
                h = a("./stream/GenericWorker"),
                i = e ? "uint8array" : "array";
            c.magic = "\b\0",
                g.inherits(d, h),
                d.prototype.processChunk = function(a) {
                    this.meta = a.meta,
                        null === this._pako && this._createPako(),
                        this._pako.push(g.transformTo(i, a.data), !1)
                },
                d.prototype.flush = function() {
                    h.prototype.flush.call(this),
                        null === this._pako && this._createPako(),
                        this._pako.push([], !0)
                },
                d.prototype.cleanUp = function() {
                    h.prototype.cleanUp.call(this),
                        this._pako = null
                },
                d.prototype._createPako = function() {
                    this._pako = new f[this._pakoAction]({
                        raw: !0,
                        level: this._pakoOptions.level || -1
                    });
                    var a = this;
                    this._pako.onData = function(b) {
                        a.push({
                            data: b,
                            meta: a.meta
                        })
                    }
                },
                c.compressWorker = function(a) {
                    return new d("Deflate", a)
                },
                c.uncompressWorker = function() {
                    return new d("Inflate", {})
                }
        }, {
            "./stream/GenericWorker": 28,
            "./utils": 32,
            pako: 59
        }],
        8: [function(a, b, c) {
            "use strict";

            function d(a, b, c, d) {
                f.call(this, "ZipFileWorker"),
                    this.bytesWritten = 0,
                    this.zipComment = b,
                    this.zipPlatform = c,
                    this.encodeFileName = d,
                    this.streamFiles = a,
                    this.accumulate = !1,
                    this.contentBuffer = [],
                    this.dirRecords = [],
                    this.currentSourceOffset = 0,
                    this.entriesCount = 0,
                    this.currentFile = null,
                    this._sources = []
            }
            var e = a("../utils"),
                f = a("../stream/GenericWorker"),
                g = a("../utf8"),
                h = a("../crc32"),
                i = a("../signature"),
                j = function(a, b) {
                    var c, d = "";
                    for (c = 0; c < b; c++)
                        d += String.fromCharCode(255 & a),
                        a >>>= 8;
                    return d
                },
                k = function(a, b) {
                    var c = a;
                    return a || (c = b ? 16893 : 33204),
                        (65535 & c) << 16
                },
                l = function(a, b) {
                    return 63 & (a || 0)
                },
                m = function(a, b, c, d, f, m) {
                    var n, o, p = a.file,
                        q = a.compression,
                        r = m !== g.utf8encode,
                        s = e.transformTo("string", m(p.name)),
                        t = e.transformTo("string", g.utf8encode(p.name)),
                        u = p.comment,
                        v = e.transformTo("string", m(u)),
                        w = e.transformTo("string", g.utf8encode(u)),
                        x = t.length !== p.name.length,
                        y = w.length !== u.length,
                        z = "",
                        A = "",
                        B = "",
                        C = p.dir,
                        D = p.date,
                        E = {
                            crc32: 0,
                            compressedSize: 0,
                            uncompressedSize: 0
                        };
                    b && !c || (E.crc32 = a.crc32,
                        E.compressedSize = a.compressedSize,
                        E.uncompressedSize = a.uncompressedSize);
                    var F = 0;
                    b && (F |= 8),
                        r || !x && !y || (F |= 2048);
                    var G = 0,
                        H = 0;
                    C && (G |= 16),
                        "UNIX" === f ? (H = 798,
                            G |= k(p.unixPermissions, C)) : (H = 20,
                            G |= l(p.dosPermissions, C)),
                        n = D.getUTCHours(),
                        n <<= 6,
                        n |= D.getUTCMinutes(),
                        n <<= 5,
                        n |= D.getUTCSeconds() / 2,
                        o = D.getUTCFullYear() - 1980,
                        o <<= 4,
                        o |= D.getUTCMonth() + 1,
                        o <<= 5,
                        o |= D.getUTCDate(),
                        x && (A = j(1, 1) + j(h(s), 4) + t,
                            z += "up" + j(A.length, 2) + A),
                        y && (B = j(1, 1) + j(h(v), 4) + w,
                            z += "uc" + j(B.length, 2) + B);
                    var I = "";
                    I += "\n\0",
                        I += j(F, 2),
                        I += q.magic,
                        I += j(n, 2),
                        I += j(o, 2),
                        I += j(E.crc32, 4),
                        I += j(E.compressedSize, 4),
                        I += j(E.uncompressedSize, 4),
                        I += j(s.length, 2),
                        I += j(z.length, 2);
                    var J = i.LOCAL_FILE_HEADER + I + s + z,
                        K = i.CENTRAL_FILE_HEADER + j(H, 2) + I + j(v.length, 2) + "\0\0\0\0" + j(G, 4) + j(d, 4) + s + z + v;
                    return {
                        fileRecord: J,
                        dirRecord: K
                    }
                },
                n = function(a, b, c, d, f) {
                    var g = "",
                        h = e.transformTo("string", f(d));
                    return g = i.CENTRAL_DIRECTORY_END + "\0\0\0\0" + j(a, 2) + j(a, 2) + j(b, 4) + j(c, 4) + j(h.length, 2) + h
                },
                o = function(a) {
                    var b = "";
                    return b = i.DATA_DESCRIPTOR + j(a.crc32, 4) + j(a.compressedSize, 4) + j(a.uncompressedSize, 4)
                };
            e.inherits(d, f),
                d.prototype.push = function(a) {
                    var b = a.meta.percent || 0,
                        c = this.entriesCount,
                        d = this._sources.length;
                    this.accumulate ? this.contentBuffer.push(a) : (this.bytesWritten += a.data.length,
                        f.prototype.push.call(this, {
                            data: a.data,
                            meta: {
                                currentFile: this.currentFile,
                                percent: c ? (b + 100 * (c - d - 1)) / c : 100
                            }
                        }))
                },
                d.prototype.openedSource = function(a) {
                    this.currentSourceOffset = this.bytesWritten,
                        this.currentFile = a.file.name;
                    var b = this.streamFiles && !a.file.dir;
                    if (b) {
                        var c = m(a, b, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
                        this.push({
                            data: c.fileRecord,
                            meta: {
                                percent: 0
                            }
                        })
                    } else
                        this.accumulate = !0
                },
                d.prototype.closedSource = function(a) {
                    this.accumulate = !1;
                    var b = this.streamFiles && !a.file.dir,
                        c = m(a, b, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
                    if (this.dirRecords.push(c.dirRecord),
                        b)
                        this.push({
                            data: o(a),
                            meta: {
                                percent: 100
                            }
                        });
                    else
                        for (this.push({
                                data: c.fileRecord,
                                meta: {
                                    percent: 0
                                }
                            }); this.contentBuffer.length;)
                            this.push(this.contentBuffer.shift());
                    this.currentFile = null
                },
                d.prototype.flush = function() {
                    for (var a = this.bytesWritten, b = 0; b < this.dirRecords.length; b++)
                        this.push({
                            data: this.dirRecords[b],
                            meta: {
                                percent: 100
                            }
                        });
                    var c = this.bytesWritten - a,
                        d = n(this.dirRecords.length, c, a, this.zipComment, this.encodeFileName);
                    this.push({
                        data: d,
                        meta: {
                            percent: 100
                        }
                    })
                },
                d.prototype.prepareNextSource = function() {
                    this.previous = this._sources.shift(),
                        this.openedSource(this.previous.streamInfo),
                        this.isPaused ? this.previous.pause() : this.previous.resume()
                },
                d.prototype.registerPrevious = function(a) {
                    this._sources.push(a);
                    var b = this;
                    return a.on("data", function(a) {
                            b.processChunk(a)
                        }),
                        a.on("end", function() {
                            b.closedSource(b.previous.streamInfo),
                                b._sources.length ? b.prepareNextSource() : b.end()
                        }),
                        a.on("error", function(a) {
                            b.error(a)
                        }),
                        this
                },
                d.prototype.resume = function() {
                    return !!f.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0))
                },
                d.prototype.error = function(a) {
                    var b = this._sources;
                    if (!f.prototype.error.call(this, a))
                        return !1;
                    for (var c = 0; c < b.length; c++)
                        try {
                            b[c].error(a)
                        } catch (a) {}
                    return !0
                },
                d.prototype.lock = function() {
                    f.prototype.lock.call(this);
                    for (var a = this._sources, b = 0; b < a.length; b++)
                        a[b].lock()
                },
                b.exports = d
        }, {
            "../crc32": 4,
            "../signature": 23,
            "../stream/GenericWorker": 28,
            "../utf8": 31,
            "../utils": 32
        }],
        9: [function(a, b, c) {
            "use strict";
            var d = a("../compressions"),
                e = a("./ZipFileWorker"),
                f = function(a, b) {
                    var c = a || b,
                        e = d[c];
                    if (!e)
                        throw new Error(c + " is not a valid compression method !");
                    return e
                };
            c.generateWorker = function(a, b, c) {
                var d = new e(b.streamFiles, c, b.platform, b.encodeFileName),
                    g = 0;
                try {
                    a.forEach(function(a, c) {
                            g++;
                            var e = f(c.options.compression, b.compression),
                                h = c.options.compressionOptions || b.compressionOptions || {},
                                i = c.dir,
                                j = c.date;
                            c._compressWorker(e, h).withStreamInfo("file", {
                                name: a,
                                dir: i,
                                date: j,
                                comment: c.comment || "",
                                unixPermissions: c.unixPermissions,
                                dosPermissions: c.dosPermissions
                            }).pipe(d)
                        }),
                        d.entriesCount = g
                } catch (h) {
                    d.error(h)
                }
                return d
            }
        }, {
            "../compressions": 3,
            "./ZipFileWorker": 8
        }],
        10: [function(a, b, c) {
            "use strict";

            function d() {
                if (!(this instanceof d))
                    return new d;
                if (arguments.length)
                    throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
                this.files = {},
                    this.comment = null,
                    this.root = "",
                    this.clone = function() {
                        var a = new d;
                        for (var b in this)
                            "function" != typeof this[b] && (a[b] = this[b]);
                        return a
                    }
            }
            d.prototype = a("./object"),
                d.prototype.loadAsync = a("./load"),
                d.support = a("./support"),
                d.defaults = a("./defaults"),
                d.version = "3.1.3",
                d.loadAsync = function(a, b) {
                    return (new d).loadAsync(a, b)
                },
                d.external = a("./external"),
                b.exports = d
        }, {
            "./defaults": 5,
            "./external": 6,
            "./load": 11,
            "./object": 15,
            "./support": 30
        }],
        11: [function(a, b, c) {
            "use strict";

            function d(a) {
                return new f.Promise(function(b, c) {
                    var d = a.decompressed.getContentWorker().pipe(new i);
                    d.on("error", function(a) {
                        c(a)
                    }).on("end", function() {
                        d.streamInfo.crc32 !== a.decompressed.crc32 ? c(new Error("Corrupted zip : CRC32 mismatch")) : b()
                    }).resume()
                })
            }
            var e = a("./utils"),
                f = a("./external"),
                g = a("./utf8"),
                e = a("./utils"),
                h = a("./zipEntries"),
                i = a("./stream/Crc32Probe"),
                j = a("./nodejsUtils");
            b.exports = function(a, b) {
                var c = this;
                return b = e.extend(b || {}, {
                        base64: !1,
                        checkCRC32: !1,
                        optimizedBinaryString: !1,
                        createFolders: !1,
                        decodeFileName: g.utf8decode
                    }),
                    j.isNode && j.isStream(a) ? f.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : e.prepareContent("the loaded zip file", a, !0, b.optimizedBinaryString, b.base64).then(function(a) {
                        var c = new h(b);
                        return c.load(a),
                            c
                    }).then(function(a) {
                        var c = [f.Promise.resolve(a)],
                            e = a.files;
                        if (b.checkCRC32)
                            for (var g = 0; g < e.length; g++)
                                c.push(d(e[g]));
                        return f.Promise.all(c)
                    }).then(function(a) {
                        for (var d = a.shift(), e = d.files, f = 0; f < e.length; f++) {
                            var g = e[f];
                            c.file(g.fileNameStr, g.decompressed, {
                                binary: !0,
                                optimizedBinaryString: !0,
                                date: g.date,
                                dir: g.dir,
                                comment: g.fileCommentStr.length ? g.fileCommentStr : null,
                                unixPermissions: g.unixPermissions,
                                dosPermissions: g.dosPermissions,
                                createFolders: b.createFolders
                            })
                        }
                        return d.zipComment.length && (c.comment = d.zipComment),
                            c
                    })
            }
        }, {
            "./external": 6,
            "./nodejsUtils": 14,
            "./stream/Crc32Probe": 25,
            "./utf8": 31,
            "./utils": 32,
            "./zipEntries": 33
        }],
        12: [function(a, b, c) {
            "use strict";

            function d(a, b) {
                f.call(this, "Nodejs stream input adapter for " + a),
                    this._upstreamEnded = !1,
                    this._bindStream(b)
            }
            var e = a("../utils"),
                f = a("../stream/GenericWorker");
            e.inherits(d, f),
                d.prototype._bindStream = function(a) {
                    var b = this;
                    this._stream = a,
                        a.pause(),
                        a.on("data", function(a) {
                            b.push({
                                data: a,
                                meta: {
                                    percent: 0
                                }
                            })
                        }).on("error", function(a) {
                            b.isPaused ? this.generatedError = a : b.error(a)
                        }).on("end", function() {
                            b.isPaused ? b._upstreamEnded = !0 : b.end()
                        })
                },
                d.prototype.pause = function() {
                    return !!f.prototype.pause.call(this) && (this._stream.pause(), !0)
                },
                d.prototype.resume = function() {
                    return !!f.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0)
                },
                b.exports = d
        }, {
            "../stream/GenericWorker": 28,
            "../utils": 32
        }],
        13: [function(a, b, c) {
            "use strict";

            function d(a, b, c) {
                e.call(this, b),
                    this._helper = a;
                var d = this;
                a.on("data", function(a, b) {
                    d.push(a) || d._helper.pause(),
                        c && c(b)
                }).on("error", function(a) {
                    d.emit("error", a)
                }).on("end", function() {
                    d.push(null)
                })
            }
            var e = a("readable-stream").Readable,
                f = a("../utils");
            f.inherits(d, e),
                d.prototype._read = function() {
                    this._helper.resume()
                },
                b.exports = d
        }, {
            "../utils": 32,
            "readable-stream": 16
        }],
        14: [function(a, b, c) {
            "use strict";
            b.exports = {
                isNode: "undefined" != typeof Buffer,
                newBuffer: function(a, b) {
                    return new Buffer(a, b)
                },
                isBuffer: function(a) {
                    return Buffer.isBuffer(a)
                },
                isStream: function(a) {
                    return a && "function" == typeof a.on && "function" == typeof a.pause && "function" == typeof a.resume
                }
            }
        }, {}],
        15: [function(a, b, c) {
            "use strict";

            function d(a) {
                return "[object RegExp]" === Object.prototype.toString.call(a)
            }
            var e = a("./utf8"),
                f = a("./utils"),
                g = a("./stream/GenericWorker"),
                h = a("./stream/StreamHelper"),
                i = a("./defaults"),
                j = a("./compressedObject"),
                k = a("./zipObject"),
                l = a("./generate"),
                m = a("./nodejsUtils"),
                n = a("./nodejs/NodejsStreamInputAdapter"),
                o = function(a, b, c) {
                    var d, e = f.getTypeOf(b),
                        h = f.extend(c || {}, i);
                    h.date = h.date || new Date,
                        null !== h.compression && (h.compression = h.compression.toUpperCase()),
                        "string" == typeof h.unixPermissions && (h.unixPermissions = parseInt(h.unixPermissions, 8)),
                        h.unixPermissions && 16384 & h.unixPermissions && (h.dir = !0),
                        h.dosPermissions && 16 & h.dosPermissions && (h.dir = !0),
                        h.dir && (a = q(a)),
                        h.createFolders && (d = p(a)) && r.call(this, d, !0);
                    var l = "string" === e && h.binary === !1 && h.base64 === !1;
                    c && "undefined" != typeof c.binary || (h.binary = !l);
                    var o = b instanceof j && 0 === b.uncompressedSize;
                    (o || h.dir || !b || 0 === b.length) && (h.base64 = !1,
                        h.binary = !0,
                        b = "",
                        h.compression = "STORE",
                        e = "string");
                    var s = null;
                    s = b instanceof j || b instanceof g ? b : m.isNode && m.isStream(b) ? new n(a, b) : f.prepareContent(a, b, h.binary, h.optimizedBinaryString, h.base64);
                    var t = new k(a, s, h);
                    this.files[a] = t
                },
                p = function(a) {
                    "/" === a.slice(-1) && (a = a.substring(0, a.length - 1));
                    var b = a.lastIndexOf("/");
                    return b > 0 ? a.substring(0, b) : ""
                },
                q = function(a) {
                    return "/" !== a.slice(-1) && (a += "/"),
                        a
                },
                r = function(a, b) {
                    return b = "undefined" != typeof b ? b : i.createFolders,
                        a = q(a),
                        this.files[a] || o.call(this, a, null, {
                            dir: !0,
                            createFolders: b
                        }),
                        this.files[a]
                },
                s = {
                    load: function() {
                        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")
                    },
                    forEach: function(a) {
                        var b, c, d;
                        for (b in this.files)
                            this.files.hasOwnProperty(b) && (d = this.files[b],
                                c = b.slice(this.root.length, b.length),
                                c && b.slice(0, this.root.length) === this.root && a(c, d))
                    },
                    filter: function(a) {
                        var b = [];
                        return this.forEach(function(c, d) {
                                a(c, d) && b.push(d)
                            }),
                            b
                    },
                    file: function(a, b, c) {
                        if (1 === arguments.length) {
                            if (d(a)) {
                                var e = a;
                                return this.filter(function(a, b) {
                                    return !b.dir && e.test(a)
                                })
                            }
                            var f = this.files[this.root + a];
                            return f && !f.dir ? f : null
                        }
                        return a = this.root + a,
                            o.call(this, a, b, c),
                            this
                    },
                    folder: function(a) {
                        if (!a)
                            return this;
                        if (d(a))
                            return this.filter(function(b, c) {
                                return c.dir && a.test(b)
                            });
                        var b = this.root + a,
                            c = r.call(this, b),
                            e = this.clone();
                        return e.root = c.name,
                            e
                    },
                    remove: function(a) {
                        a = this.root + a;
                        var b = this.files[a];
                        if (b || ("/" !== a.slice(-1) && (a += "/"),
                                b = this.files[a]),
                            b && !b.dir)
                            delete this.files[a];
                        else
                            for (var c = this.filter(function(b, c) {
                                    return c.name.slice(0, a.length) === a
                                }), d = 0; d < c.length; d++)
                                delete this.files[c[d].name];
                        return this
                    },
                    generate: function(a) {
                        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")
                    },
                    generateInternalStream: function(a) {
                        var b, c = {};
                        try {
                            if (c = f.extend(a || {}, {
                                    streamFiles: !1,
                                    compression: "STORE",
                                    compressionOptions: null,
                                    type: "",
                                    platform: "DOS",
                                    comment: null,
                                    mimeType: "application/zip",
                                    encodeFileName: e.utf8encode
                                }),
                                c.type = c.type.toLowerCase(),
                                c.compression = c.compression.toUpperCase(),
                                "binarystring" === c.type && (c.type = "string"), !c.type)
                                throw new Error("No output type specified.");
                            f.checkSupport(c.type),
                                "darwin" !== c.platform && "freebsd" !== c.platform && "linux" !== c.platform && "sunos" !== c.platform || (c.platform = "UNIX"),
                                "win32" === c.platform && (c.platform = "DOS");
                            var d = c.comment || this.comment || "";
                            b = l.generateWorker(this, c, d)
                        } catch (i) {
                            b = new g("error"),
                                b.error(i)
                        }
                        return new h(b, c.type || "string", c.mimeType)
                    },
                    generateAsync: function(a, b) {
                        return this.generateInternalStream(a).accumulate(b)
                    },
                    generateNodeStream: function(a, b) {
                        return a = a || {},
                            a.type || (a.type = "nodebuffer"),
                            this.generateInternalStream(a).toNodejsStream(b)
                    }
                };
            b.exports = s
        }, {
            "./compressedObject": 2,
            "./defaults": 5,
            "./generate": 9,
            "./nodejs/NodejsStreamInputAdapter": 12,
            "./nodejsUtils": 14,
            "./stream/GenericWorker": 28,
            "./stream/StreamHelper": 29,
            "./utf8": 31,
            "./utils": 32,
            "./zipObject": 35
        }],
        16: [function(a, b, c) {
            b.exports = a("stream")
        }, {
            stream: void 0
        }],
        17: [function(a, b, c) {
            "use strict";

            function d(a) {
                e.call(this, a);
                for (var b = 0; b < this.data.length; b++)
                    a[b] = 255 & a[b]
            }
            var e = a("./DataReader"),
                f = a("../utils");
            f.inherits(d, e),
                d.prototype.byteAt = function(a) {
                    return this.data[this.zero + a]
                },
                d.prototype.lastIndexOfSignature = function(a) {
                    for (var b = a.charCodeAt(0), c = a.charCodeAt(1), d = a.charCodeAt(2), e = a.charCodeAt(3), f = this.length - 4; f >= 0; --f)
                        if (this.data[f] === b && this.data[f + 1] === c && this.data[f + 2] === d && this.data[f + 3] === e)
                            return f - this.zero;
                    return -1
                },
                d.prototype.readAndCheckSignature = function(a) {
                    var b = a.charCodeAt(0),
                        c = a.charCodeAt(1),
                        d = a.charCodeAt(2),
                        e = a.charCodeAt(3),
                        f = this.readData(4);
                    return b === f[0] && c === f[1] && d === f[2] && e === f[3]
                },
                d.prototype.readData = function(a) {
                    if (this.checkOffset(a),
                        0 === a)
                        return [];
                    var b = this.data.slice(this.zero + this.index, this.zero + this.index + a);
                    return this.index += a,
                        b
                },
                b.exports = d
        }, {
            "../utils": 32,
            "./DataReader": 18
        }],
        18: [function(a, b, c) {
            "use strict";

            function d(a) {
                this.data = a,
                    this.length = a.length,
                    this.index = 0,
                    this.zero = 0
            }
            var e = a("../utils");
            d.prototype = {
                    checkOffset: function(a) {
                        this.checkIndex(this.index + a)
                    },
                    checkIndex: function(a) {
                        if (this.length < this.zero + a || a < 0)
                            throw new Error("End of data reached (data length = " + this.length + ", asked index = " + a + "). Corrupted zip ?")
                    },
                    setIndex: function(a) {
                        this.checkIndex(a),
                            this.index = a
                    },
                    skip: function(a) {
                        this.setIndex(this.index + a)
                    },
                    byteAt: function(a) {},
                    readInt: function(a) {
                        var b, c = 0;
                        for (this.checkOffset(a),
                            b = this.index + a - 1; b >= this.index; b--)
                            c = (c << 8) + this.byteAt(b);
                        return this.index += a,
                            c
                    },
                    readString: function(a) {
                        return e.transformTo("string", this.readData(a))
                    },
                    readData: function(a) {},
                    lastIndexOfSignature: function(a) {},
                    readAndCheckSignature: function(a) {},
                    readDate: function() {
                        var a = this.readInt(4);
                        return new Date(Date.UTC((a >> 25 & 127) + 1980, (a >> 21 & 15) - 1, a >> 16 & 31, a >> 11 & 31, a >> 5 & 63, (31 & a) << 1))
                    }
                },
                b.exports = d
        }, {
            "../utils": 32
        }],
        19: [function(a, b, c) {
            "use strict";

            function d(a) {
                e.call(this, a)
            }
            var e = a("./Uint8ArrayReader"),
                f = a("../utils");
            f.inherits(d, e),
                d.prototype.readData = function(a) {
                    this.checkOffset(a);
                    var b = this.data.slice(this.zero + this.index, this.zero + this.index + a);
                    return this.index += a,
                        b
                },
                b.exports = d
        }, {
            "../utils": 32,
            "./Uint8ArrayReader": 21
        }],
        20: [function(a, b, c) {
            "use strict";

            function d(a) {
                e.call(this, a)
            }
            var e = a("./DataReader"),
                f = a("../utils");
            f.inherits(d, e),
                d.prototype.byteAt = function(a) {
                    return this.data.charCodeAt(this.zero + a)
                },
                d.prototype.lastIndexOfSignature = function(a) {
                    return this.data.lastIndexOf(a) - this.zero
                },
                d.prototype.readAndCheckSignature = function(a) {
                    var b = this.readData(4);
                    return a === b
                },
                d.prototype.readData = function(a) {
                    this.checkOffset(a);
                    var b = this.data.slice(this.zero + this.index, this.zero + this.index + a);
                    return this.index += a,
                        b
                },
                b.exports = d
        }, {
            "../utils": 32,
            "./DataReader": 18
        }],
        21: [function(a, b, c) {
            "use strict";

            function d(a) {
                e.call(this, a)
            }
            var e = a("./ArrayReader"),
                f = a("../utils");
            f.inherits(d, e),
                d.prototype.readData = function(a) {
                    if (this.checkOffset(a),
                        0 === a)
                        return new Uint8Array(0);
                    var b = this.data.subarray(this.zero + this.index, this.zero + this.index + a);
                    return this.index += a,
                        b
                },
                b.exports = d
        }, {
            "../utils": 32,
            "./ArrayReader": 17
        }],
        22: [function(a, b, c) {
            "use strict";
            var d = a("../utils"),
                e = a("../support"),
                f = a("./ArrayReader"),
                g = a("./StringReader"),
                h = a("./NodeBufferReader"),
                i = a("./Uint8ArrayReader");
            b.exports = function(a) {
                var b = d.getTypeOf(a);
                return d.checkSupport(b),
                    "string" !== b || e.uint8array ? "nodebuffer" === b ? new h(a) : e.uint8array ? new i(d.transformTo("uint8array", a)) : new f(d.transformTo("array", a)) : new g(a)
            }
        }, {
            "../support": 30,
            "../utils": 32,
            "./ArrayReader": 17,
            "./NodeBufferReader": 19,
            "./StringReader": 20,
            "./Uint8ArrayReader": 21
        }],
        23: [function(a, b, c) {
            "use strict";
            c.LOCAL_FILE_HEADER = "PK",
                c.CENTRAL_FILE_HEADER = "PK",
                c.CENTRAL_DIRECTORY_END = "PK",
                c.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK",
                c.ZIP64_CENTRAL_DIRECTORY_END = "PK",
                c.DATA_DESCRIPTOR = "PK\b"
        }, {}],
        24: [function(a, b, c) {
            "use strict";

            function d(a) {
                e.call(this, "ConvertWorker to " + a),
                    this.destType = a
            }
            var e = a("./GenericWorker"),
                f = a("../utils");
            f.inherits(d, e),
                d.prototype.processChunk = function(a) {
                    this.push({
                        data: f.transformTo(this.destType, a.data),
                        meta: a.meta
                    })
                },
                b.exports = d
        }, {
            "../utils": 32,
            "./GenericWorker": 28
        }],
        25: [function(a, b, c) {
            "use strict";

            function d() {
                e.call(this, "Crc32Probe"),
                    this.withStreamInfo("crc32", 0)
            }
            var e = a("./GenericWorker"),
                f = a("../crc32"),
                g = a("../utils");
            g.inherits(d, e),
                d.prototype.processChunk = function(a) {
                    this.streamInfo.crc32 = f(a.data, this.streamInfo.crc32 || 0),
                        this.push(a)
                },
                b.exports = d
        }, {
            "../crc32": 4,
            "../utils": 32,
            "./GenericWorker": 28
        }],
        26: [function(a, b, c) {
            "use strict";

            function d(a) {
                f.call(this, "DataLengthProbe for " + a),
                    this.propName = a,
                    this.withStreamInfo(a, 0)
            }
            var e = a("../utils"),
                f = a("./GenericWorker");
            e.inherits(d, f),
                d.prototype.processChunk = function(a) {
                    if (a) {
                        var b = this.streamInfo[this.propName] || 0;
                        this.streamInfo[this.propName] = b + a.data.length
                    }
                    f.prototype.processChunk.call(this, a)
                },
                b.exports = d
        }, {
            "../utils": 32,
            "./GenericWorker": 28
        }],
        27: [function(a, b, c) {
            "use strict";

            function d(a) {
                f.call(this, "DataWorker");
                var b = this;
                this.dataIsReady = !1,
                    this.index = 0,
                    this.max = 0,
                    this.data = null,
                    this.type = "",
                    this._tickScheduled = !1,
                    a.then(function(a) {
                        b.dataIsReady = !0,
                            b.data = a,
                            b.max = a && a.length || 0,
                            b.type = e.getTypeOf(a),
                            b.isPaused || b._tickAndRepeat()
                    }, function(a) {
                        b.error(a)
                    })
            }
            var e = a("../utils"),
                f = a("./GenericWorker"),
                g = 16384;
            e.inherits(d, f),
                d.prototype.cleanUp = function() {
                    f.prototype.cleanUp.call(this),
                        this.data = null
                },
                d.prototype.resume = function() {
                    return !!f.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0,
                        e.delay(this._tickAndRepeat, [], this)), !0)
                },
                d.prototype._tickAndRepeat = function() {
                    this._tickScheduled = !1,
                        this.isPaused || this.isFinished || (this._tick(),
                            this.isFinished || (e.delay(this._tickAndRepeat, [], this),
                                this._tickScheduled = !0))
                },
                d.prototype._tick = function() {
                    if (this.isPaused || this.isFinished)
                        return !1;
                    var a = g,
                        b = null,
                        c = Math.min(this.max, this.index + a);
                    if (this.index >= this.max)
                        return this.end();
                    switch (this.type) {
                        case "string":
                            b = this.data.substring(this.index, c);
                            break;
                        case "uint8array":
                            b = this.data.subarray(this.index, c);
                            break;
                        case "array":
                        case "nodebuffer":
                            b = this.data.slice(this.index, c)
                    }
                    return this.index = c,
                        this.push({
                            data: b,
                            meta: {
                                percent: this.max ? this.index / this.max * 100 : 0
                            }
                        })
                },
                b.exports = d
        }, {
            "../utils": 32,
            "./GenericWorker": 28
        }],
        28: [function(a, b, c) {
            "use strict";

            function d(a) {
                this.name = a || "default",
                    this.streamInfo = {},
                    this.generatedError = null,
                    this.extraStreamInfo = {},
                    this.isPaused = !0,
                    this.isFinished = !1,
                    this.isLocked = !1,
                    this._listeners = {
                        data: [],
                        end: [],
                        error: []
                    },
                    this.previous = null
            }
            d.prototype = {
                    push: function(a) {
                        this.emit("data", a)
                    },
                    end: function() {
                        if (this.isFinished)
                            return !1;
                        this.flush();
                        try {
                            this.emit("end"),
                                this.cleanUp(),
                                this.isFinished = !0
                        } catch (a) {
                            this.emit("error", a)
                        }
                        return !0
                    },
                    error: function(a) {
                        return !this.isFinished && (this.isPaused ? this.generatedError = a : (this.isFinished = !0,
                            this.emit("error", a),
                            this.previous && this.previous.error(a),
                            this.cleanUp()), !0)
                    },
                    on: function(a, b) {
                        return this._listeners[a].push(b),
                            this
                    },
                    cleanUp: function() {
                        this.streamInfo = this.generatedError = this.extraStreamInfo = null,
                            this._listeners = []
                    },
                    emit: function(a, b) {
                        if (this._listeners[a])
                            for (var c = 0; c < this._listeners[a].length; c++)
                                this._listeners[a][c].call(this, b)
                    },
                    pipe: function(a) {
                        return a.registerPrevious(this)
                    },
                    registerPrevious: function(a) {
                        if (this.isLocked)
                            throw new Error("The stream '" + this + "' has already been used.");
                        this.streamInfo = a.streamInfo,
                            this.mergeStreamInfo(),
                            this.previous = a;
                        var b = this;
                        return a.on("data", function(a) {
                                b.processChunk(a)
                            }),
                            a.on("end", function() {
                                b.end()
                            }),
                            a.on("error", function(a) {
                                b.error(a)
                            }),
                            this
                    },
                    pause: function() {
                        return !this.isPaused && !this.isFinished && (this.isPaused = !0,
                            this.previous && this.previous.pause(), !0)
                    },
                    resume: function() {
                        if (!this.isPaused || this.isFinished)
                            return !1;
                        this.isPaused = !1;
                        var a = !1;
                        return this.generatedError && (this.error(this.generatedError),
                                a = !0),
                            this.previous && this.previous.resume(), !a
                    },
                    flush: function() {},
                    processChunk: function(a) {
                        this.push(a)
                    },
                    withStreamInfo: function(a, b) {
                        return this.extraStreamInfo[a] = b,
                            this.mergeStreamInfo(),
                            this
                    },
                    mergeStreamInfo: function() {
                        for (var a in this.extraStreamInfo)
                            this.extraStreamInfo.hasOwnProperty(a) && (this.streamInfo[a] = this.extraStreamInfo[a])
                    },
                    lock: function() {
                        if (this.isLocked)
                            throw new Error("The stream '" + this + "' has already been used.");
                        this.isLocked = !0,
                            this.previous && this.previous.lock()
                    },
                    toString: function() {
                        var a = "Worker " + this.name;
                        return this.previous ? this.previous + " -> " + a : a
                    }
                },
                b.exports = d
        }, {}],
        29: [function(a, b, c) {
            "use strict";

            function d(a, b, c, d) {
                var f = null;
                switch (a) {
                    case "blob":
                        return h.newBlob(c, d);
                    case "base64":
                        return f = e(b, c),
                            k.encode(f);
                    default:
                        return f = e(b, c),
                            h.transformTo(a, f)
                }
            }

            function e(a, b) {
                var c, d = 0,
                    e = null,
                    f = 0;
                for (c = 0; c < b.length; c++)
                    f += b[c].length;
                switch (a) {
                    case "string":
                        return b.join("");
                    case "array":
                        return Array.prototype.concat.apply([], b);
                    case "uint8array":
                        for (e = new Uint8Array(f),
                            c = 0; c < b.length; c++)
                            e.set(b[c], d),
                            d += b[c].length;
                        return e;
                    case "nodebuffer":
                        return Buffer.concat(b);
                    default:
                        throw new Error("concat : unsupported type '" + a + "'")
                }
            }

            function f(a, b) {
                return new m.Promise(function(c, e) {
                    var f = [],
                        g = a._internalType,
                        h = a._outputType,
                        i = a._mimeType;
                    a.on("data", function(a, c) {
                        f.push(a),
                            b && b(c)
                    }).on("error", function(a) {
                        f = [],
                            e(a)
                    }).on("end", function() {
                        try {
                            var a = d(h, g, f, i);
                            c(a)
                        } catch (b) {
                            e(b)
                        }
                        f = []
                    }).resume()
                })
            }

            function g(a, b, c) {
                var d = b;
                switch (b) {
                    case "blob":
                        d = "arraybuffer";
                        break;
                    case "arraybuffer":
                        d = "uint8array";
                        break;
                    case "base64":
                        d = "string"
                }
                try {
                    this._internalType = d,
                        this._outputType = b,
                        this._mimeType = c,
                        h.checkSupport(d),
                        this._worker = a.pipe(new i(d)),
                        a.lock()
                } catch (e) {
                    this._worker = new j("error"),
                        this._worker.error(e)
                }
            }
            var h = a("../utils"),
                i = a("./ConvertWorker"),
                j = a("./GenericWorker"),
                k = a("../base64"),
                l = a("../support"),
                m = a("../external"),
                n = null;
            if (l.nodestream)
                try {
                    n = a("../nodejs/NodejsStreamOutputAdapter")
                } catch (o) {}
            g.prototype = {
                    accumulate: function(a) {
                        return f(this, a)
                    },
                    on: function(a, b) {
                        var c = this;
                        return "data" === a ? this._worker.on(a, function(a) {
                                b.call(c, a.data, a.meta)
                            }) : this._worker.on(a, function() {
                                h.delay(b, arguments, c)
                            }),
                            this
                    },
                    resume: function() {
                        return h.delay(this._worker.resume, [], this._worker),
                            this
                    },
                    pause: function() {
                        return this._worker.pause(),
                            this
                    },
                    toNodejsStream: function(a) {
                        if (h.checkSupport("nodestream"),
                            "nodebuffer" !== this._outputType)
                            throw new Error(this._outputType + " is not supported by this method");
                        return new n(this, {
                            objectMode: "nodebuffer" !== this._outputType
                        }, a)
                    }
                },
                b.exports = g
        }, {
            "../base64": 1,
            "../external": 6,
            "../nodejs/NodejsStreamOutputAdapter": 13,
            "../support": 30,
            "../utils": 32,
            "./ConvertWorker": 24,
            "./GenericWorker": 28
        }],
        30: [function(a, b, c) {
            "use strict";
            if (c.base64 = !0,
                c.array = !0,
                c.string = !0,
                c.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array,
                c.nodebuffer = "undefined" != typeof Buffer,
                c.uint8array = "undefined" != typeof Uint8Array,
                "undefined" == typeof ArrayBuffer)
                c.blob = !1;
            else {
                var d = new ArrayBuffer(0);
                try {
                    c.blob = 0 === new Blob([d], {
                        type: "application/zip"
                    }).size
                } catch (e) {
                    try {
                        var f = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder,
                            g = new f;
                        g.append(d),
                            c.blob = 0 === g.getBlob("application/zip").size
                    } catch (e) {
                        c.blob = !1
                    }
                }
            }
            try {
                c.nodestream = !!a("readable-stream").Readable
            } catch (e) {
                c.nodestream = !1
            }
        }, {
            "readable-stream": 16
        }],
        31: [function(a, b, c) {
            "use strict";

            function d() {
                i.call(this, "utf-8 decode"),
                    this.leftOver = null
            }

            function e() {
                i.call(this, "utf-8 encode")
            }
            for (var f = a("./utils"), g = a("./support"), h = a("./nodejsUtils"), i = a("./stream/GenericWorker"), j = new Array(256), k = 0; k < 256; k++)
                j[k] = k >= 252 ? 6 : k >= 248 ? 5 : k >= 240 ? 4 : k >= 224 ? 3 : k >= 192 ? 2 : 1;
            j[254] = j[254] = 1;
            var l = function(a) {
                    var b, c, d, e, f, h = a.length,
                        i = 0;
                    for (e = 0; e < h; e++)
                        c = a.charCodeAt(e),
                        55296 === (64512 & c) && e + 1 < h && (d = a.charCodeAt(e + 1),
                            56320 === (64512 & d) && (c = 65536 + (c - 55296 << 10) + (d - 56320),
                                e++)),
                        i += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
                    for (b = g.uint8array ? new Uint8Array(i) : new Array(i),
                        f = 0,
                        e = 0; f < i; e++)
                        c = a.charCodeAt(e),
                        55296 === (64512 & c) && e + 1 < h && (d = a.charCodeAt(e + 1),
                            56320 === (64512 & d) && (c = 65536 + (c - 55296 << 10) + (d - 56320),
                                e++)),
                        c < 128 ? b[f++] = c : c < 2048 ? (b[f++] = 192 | c >>> 6,
                            b[f++] = 128 | 63 & c) : c < 65536 ? (b[f++] = 224 | c >>> 12,
                            b[f++] = 128 | c >>> 6 & 63,
                            b[f++] = 128 | 63 & c) : (b[f++] = 240 | c >>> 18,
                            b[f++] = 128 | c >>> 12 & 63,
                            b[f++] = 128 | c >>> 6 & 63,
                            b[f++] = 128 | 63 & c);
                    return b
                },
                m = function(a, b) {
                    var c;
                    for (b = b || a.length,
                        b > a.length && (b = a.length),
                        c = b - 1; c >= 0 && 128 === (192 & a[c]);)
                        c--;
                    return c < 0 ? b : 0 === c ? b : c + j[a[c]] > b ? c : b
                },
                n = function(a) {
                    var b, c, d, e, g = a.length,
                        h = new Array(2 * g);
                    for (c = 0,
                        b = 0; b < g;)
                        if (d = a[b++],
                            d < 128)
                            h[c++] = d;
                        else if (e = j[d],
                        e > 4)
                        h[c++] = 65533,
                        b += e - 1;
                    else {
                        for (d &= 2 === e ? 31 : 3 === e ? 15 : 7; e > 1 && b < g;)
                            d = d << 6 | 63 & a[b++],
                            e--;
                        e > 1 ? h[c++] = 65533 : d < 65536 ? h[c++] = d : (d -= 65536,
                            h[c++] = 55296 | d >> 10 & 1023,
                            h[c++] = 56320 | 1023 & d)
                    }
                    return h.length !== c && (h.subarray ? h = h.subarray(0, c) : h.length = c),
                        f.applyFromCharCode(h)
                };
            c.utf8encode = function(a) {
                    return g.nodebuffer ? h.newBuffer(a, "utf-8") : l(a)
                },
                c.utf8decode = function(a) {
                    return g.nodebuffer ? f.transformTo("nodebuffer", a).toString("utf-8") : (a = f.transformTo(g.uint8array ? "uint8array" : "array", a),
                        n(a))
                },
                f.inherits(d, i),
                d.prototype.processChunk = function(a) {
                    var b = f.transformTo(g.uint8array ? "uint8array" : "array", a.data);
                    if (this.leftOver && this.leftOver.length) {
                        if (g.uint8array) {
                            var d = b;
                            b = new Uint8Array(d.length + this.leftOver.length),
                                b.set(this.leftOver, 0),
                                b.set(d, this.leftOver.length)
                        } else
                            b = this.leftOver.concat(b);
                        this.leftOver = null
                    }
                    var e = m(b),
                        h = b;
                    e !== b.length && (g.uint8array ? (h = b.subarray(0, e),
                            this.leftOver = b.subarray(e, b.length)) : (h = b.slice(0, e),
                            this.leftOver = b.slice(e, b.length))),
                        this.push({
                            data: c.utf8decode(h),
                            meta: a.meta
                        })
                },
                d.prototype.flush = function() {
                    this.leftOver && this.leftOver.length && (this.push({
                            data: c.utf8decode(this.leftOver),
                            meta: {}
                        }),
                        this.leftOver = null)
                },
                c.Utf8DecodeWorker = d,
                f.inherits(e, i),
                e.prototype.processChunk = function(a) {
                    this.push({
                        data: c.utf8encode(a.data),
                        meta: a.meta
                    })
                },
                c.Utf8EncodeWorker = e
        }, {
            "./nodejsUtils": 14,
            "./stream/GenericWorker": 28,
            "./support": 30,
            "./utils": 32
        }],
        32: [function(a, b, c) {
            "use strict";

            function d(a) {
                var b = null;
                return b = i.uint8array ? new Uint8Array(a.length) : new Array(a.length),
                    f(a, b)
            }

            function e(a) {
                return a
            }

            function f(a, b) {
                for (var c = 0; c < a.length; ++c)
                    b[c] = 255 & a.charCodeAt(c);
                return b
            }

            function g(a) {
                var b = 65536,
                    d = c.getTypeOf(a),
                    e = !0;
                if ("uint8array" === d ? e = n.applyCanBeUsed.uint8array : "nodebuffer" === d && (e = n.applyCanBeUsed.nodebuffer),
                    e)
                    for (; b > 1;)
                        try {
                            return n.stringifyByChunk(a, d, b)
                        } catch (f) {
                            b = Math.floor(b / 2)
                        }
                return n.stringifyByChar(a)
            }

            function h(a, b) {
                for (var c = 0; c < a.length; c++)
                    b[c] = a[c];
                return b
            }
            var i = a("./support"),
                j = a("./base64"),
                k = a("./nodejsUtils"),
                l = a("core-js/library/fn/set-immediate"),
                m = a("./external");
            c.newBlob = function(a, b) {
                c.checkSupport("blob");
                try {
                    return new Blob(a, {
                        type: b
                    })
                } catch (d) {
                    try {
                        for (var e = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder, f = new e, g = 0; g < a.length; g++)
                            f.append(a[g]);
                        return f.getBlob(b)
                    } catch (d) {
                        throw new Error("Bug : can't construct the Blob.")
                    }
                }
            };
            var n = {
                stringifyByChunk: function(a, b, c) {
                    var d = [],
                        e = 0,
                        f = a.length;
                    if (f <= c)
                        return String.fromCharCode.apply(null, a);
                    for (; e < f;)
                        "array" === b || "nodebuffer" === b ? d.push(String.fromCharCode.apply(null, a.slice(e, Math.min(e + c, f)))) : d.push(String.fromCharCode.apply(null, a.subarray(e, Math.min(e + c, f)))),
                        e += c;
                    return d.join("")
                },
                stringifyByChar: function(a) {
                    for (var b = "", c = 0; c < a.length; c++)
                        b += String.fromCharCode(a[c]);
                    return b
                },
                applyCanBeUsed: {
                    uint8array: function() {
                        try {
                            return i.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length
                        } catch (a) {
                            return !1
                        }
                    }(),
                    nodebuffer: function() {
                        try {
                            return i.nodebuffer && 1 === String.fromCharCode.apply(null, k.newBuffer(1)).length
                        } catch (a) {
                            return !1
                        }
                    }()
                }
            };
            c.applyFromCharCode = g;
            var o = {};
            o.string = {
                    string: e,
                    array: function(a) {
                        return f(a, new Array(a.length))
                    },
                    arraybuffer: function(a) {
                        return o.string.uint8array(a).buffer
                    },
                    uint8array: function(a) {
                        return f(a, new Uint8Array(a.length))
                    },
                    nodebuffer: function(a) {
                        return f(a, k.newBuffer(a.length))
                    }
                },
                o.array = {
                    string: g,
                    array: e,
                    arraybuffer: function(a) {
                        return new Uint8Array(a).buffer
                    },
                    uint8array: function(a) {
                        return new Uint8Array(a)
                    },
                    nodebuffer: function(a) {
                        return k.newBuffer(a)
                    }
                },
                o.arraybuffer = {
                    string: function(a) {
                        return g(new Uint8Array(a))
                    },
                    array: function(a) {
                        return h(new Uint8Array(a), new Array(a.byteLength))
                    },
                    arraybuffer: e,
                    uint8array: function(a) {
                        return new Uint8Array(a)
                    },
                    nodebuffer: function(a) {
                        return k.newBuffer(new Uint8Array(a))
                    }
                },
                o.uint8array = {
                    string: g,
                    array: function(a) {
                        return h(a, new Array(a.length))
                    },
                    arraybuffer: function(a) {
                        var b = new Uint8Array(a.length);
                        return a.length && b.set(a, 0),
                            b.buffer
                    },
                    uint8array: e,
                    nodebuffer: function(a) {
                        return k.newBuffer(a)
                    }
                },
                o.nodebuffer = {
                    string: g,
                    array: function(a) {
                        return h(a, new Array(a.length))
                    },
                    arraybuffer: function(a) {
                        return o.nodebuffer.uint8array(a).buffer
                    },
                    uint8array: function(a) {
                        return h(a, new Uint8Array(a.length))
                    },
                    nodebuffer: e
                },
                c.transformTo = function(a, b) {
                    if (b || (b = ""), !a)
                        return b;
                    c.checkSupport(a);
                    var d = c.getTypeOf(b),
                        e = o[d][a](b);
                    return e
                },
                c.getTypeOf = function(a) {
                    return "string" == typeof a ? "string" : "[object Array]" === Object.prototype.toString.call(a) ? "array" : i.nodebuffer && k.isBuffer(a) ? "nodebuffer" : i.uint8array && a instanceof Uint8Array ? "uint8array" : i.arraybuffer && a instanceof ArrayBuffer ? "arraybuffer" : void 0
                },
                c.checkSupport = function(a) {
                    var b = i[a.toLowerCase()];
                    if (!b)
                        throw new Error(a + " is not supported by this platform")
                },
                c.MAX_VALUE_16BITS = 65535,
                c.MAX_VALUE_32BITS = -1,
                c.pretty = function(a) {
                    var b, c, d = "";
                    for (c = 0; c < (a || "").length; c++)
                        b = a.charCodeAt(c),
                        d += "\\x" + (b < 16 ? "0" : "") + b.toString(16).toUpperCase();
                    return d
                },
                c.delay = function(a, b, c) {
                    l(function() {
                        a.apply(c || null, b || [])
                    })
                },
                c.inherits = function(a, b) {
                    var c = function() {};
                    c.prototype = b.prototype,
                        a.prototype = new c
                },
                c.extend = function() {
                    var a, b, c = {};
                    for (a = 0; a < arguments.length; a++)
                        for (b in arguments[a])
                            arguments[a].hasOwnProperty(b) && "undefined" == typeof c[b] && (c[b] = arguments[a][b]);
                    return c
                },
                c.prepareContent = function(a, b, e, f, g) {
                    var h = m.Promise.resolve(b).then(function(a) {
                        var b = i.blob && (a instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(a)) !== -1);
                        return b && "undefined" != typeof FileReader ? new m.Promise(function(b, c) {
                            var d = new FileReader;
                            d.onload = function(a) {
                                    b(a.target.result)
                                },
                                d.onerror = function(a) {
                                    c(a.target.error)
                                },
                                d.readAsArrayBuffer(a)
                        }) : a
                    });
                    return h.then(function(b) {
                        var h = c.getTypeOf(b);
                        return h ? ("arraybuffer" === h ? b = c.transformTo("uint8array", b) : "string" === h && (g ? b = j.decode(b) : e && f !== !0 && (b = d(b))),
                            b) : m.Promise.reject(new Error("The data of '" + a + "' is in an unsupported format !"))
                    })
                }
        }, {
            "./base64": 1,
            "./external": 6,
            "./nodejsUtils": 14,
            "./support": 30,
            "core-js/library/fn/set-immediate": 36
        }],
        33: [function(a, b, c) {
            "use strict";

            function d(a) {
                this.files = [],
                    this.loadOptions = a
            }
            var e = a("./reader/readerFor"),
                f = a("./utils"),
                g = a("./signature"),
                h = a("./zipEntry"),
                i = (a("./utf8"),
                    a("./support"));
            d.prototype = {
                    checkSignature: function(a) {
                        if (!this.reader.readAndCheckSignature(a)) {
                            this.reader.index -= 4;
                            var b = this.reader.readString(4);
                            throw new Error("Corrupted zip or bug: unexpected signature (" + f.pretty(b) + ", expected " + f.pretty(a) + ")")
                        }
                    },
                    isSignature: function(a, b) {
                        var c = this.reader.index;
                        this.reader.setIndex(a);
                        var d = this.reader.readString(4),
                            e = d === b;
                        return this.reader.setIndex(c),
                            e
                    },
                    readBlockEndOfCentral: function() {
                        this.diskNumber = this.reader.readInt(2),
                            this.diskWithCentralDirStart = this.reader.readInt(2),
                            this.centralDirRecordsOnThisDisk = this.reader.readInt(2),
                            this.centralDirRecords = this.reader.readInt(2),
                            this.centralDirSize = this.reader.readInt(4),
                            this.centralDirOffset = this.reader.readInt(4),
                            this.zipCommentLength = this.reader.readInt(2);
                        var a = this.reader.readData(this.zipCommentLength),
                            b = i.uint8array ? "uint8array" : "array",
                            c = f.transformTo(b, a);
                        this.zipComment = this.loadOptions.decodeFileName(c)
                    },
                    readBlockZip64EndOfCentral: function() {
                        this.zip64EndOfCentralSize = this.reader.readInt(8),
                            this.reader.skip(4),
                            this.diskNumber = this.reader.readInt(4),
                            this.diskWithCentralDirStart = this.reader.readInt(4),
                            this.centralDirRecordsOnThisDisk = this.reader.readInt(8),
                            this.centralDirRecords = this.reader.readInt(8),
                            this.centralDirSize = this.reader.readInt(8),
                            this.centralDirOffset = this.reader.readInt(8),
                            this.zip64ExtensibleData = {};
                        for (var a, b, c, d = this.zip64EndOfCentralSize - 44, e = 0; e < d;)
                            a = this.reader.readInt(2),
                            b = this.reader.readInt(4),
                            c = this.reader.readData(b),
                            this.zip64ExtensibleData[a] = {
                                id: a,
                                length: b,
                                value: c
                            }
                    },
                    readBlockZip64EndOfCentralLocator: function() {
                        if (this.diskWithZip64CentralDirStart = this.reader.readInt(4),
                            this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8),
                            this.disksCount = this.reader.readInt(4),
                            this.disksCount > 1)
                            throw new Error("Multi-volumes zip are not supported")
                    },
                    readLocalFiles: function() {
                        var a, b;
                        for (a = 0; a < this.files.length; a++)
                            b = this.files[a],
                            this.reader.setIndex(b.localHeaderOffset),
                            this.checkSignature(g.LOCAL_FILE_HEADER),
                            b.readLocalPart(this.reader),
                            b.handleUTF8(),
                            b.processAttributes()
                    },
                    readCentralDir: function() {
                        var a;
                        for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(g.CENTRAL_FILE_HEADER);)
                            a = new h({
                                zip64: this.zip64
                            }, this.loadOptions),
                            a.readCentralPart(this.reader),
                            this.files.push(a);
                        if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length)
                            throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length)
                    },
                    readEndOfCentral: function() {
                        var a = this.reader.lastIndexOfSignature(g.CENTRAL_DIRECTORY_END);
                        if (a < 0) {
                            var b = !this.isSignature(0, g.LOCAL_FILE_HEADER);
                            throw b ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory")
                        }
                        this.reader.setIndex(a);
                        var c = a;
                        if (this.checkSignature(g.CENTRAL_DIRECTORY_END),
                            this.readBlockEndOfCentral(),
                            this.diskNumber === f.MAX_VALUE_16BITS || this.diskWithCentralDirStart === f.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === f.MAX_VALUE_16BITS || this.centralDirRecords === f.MAX_VALUE_16BITS || this.centralDirSize === f.MAX_VALUE_32BITS || this.centralDirOffset === f.MAX_VALUE_32BITS) {
                            if (this.zip64 = !0,
                                a = this.reader.lastIndexOfSignature(g.ZIP64_CENTRAL_DIRECTORY_LOCATOR),
                                a < 0)
                                throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
                            if (this.reader.setIndex(a),
                                this.checkSignature(g.ZIP64_CENTRAL_DIRECTORY_LOCATOR),
                                this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, g.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(g.ZIP64_CENTRAL_DIRECTORY_END),
                                    this.relativeOffsetEndOfZip64CentralDir < 0))
                                throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
                            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),
                                this.checkSignature(g.ZIP64_CENTRAL_DIRECTORY_END),
                                this.readBlockZip64EndOfCentral()
                        }
                        var d = this.centralDirOffset + this.centralDirSize;
                        this.zip64 && (d += 20,
                            d += 12 + this.zip64EndOfCentralSize);
                        var e = c - d;
                        if (e > 0)
                            this.isSignature(c, g.CENTRAL_FILE_HEADER) || (this.reader.zero = e);
                        else if (e < 0)
                            throw new Error("Corrupted zip: missing " + Math.abs(e) + " bytes.")
                    },
                    prepareReader: function(a) {
                        this.reader = e(a)
                    },
                    load: function(a) {
                        this.prepareReader(a),
                            this.readEndOfCentral(),
                            this.readCentralDir(),
                            this.readLocalFiles()
                    }
                },
                b.exports = d
        }, {
            "./reader/readerFor": 22,
            "./signature": 23,
            "./support": 30,
            "./utf8": 31,
            "./utils": 32,
            "./zipEntry": 34
        }],
        34: [function(a, b, c) {
            "use strict";

            function d(a, b) {
                this.options = a,
                    this.loadOptions = b
            }
            var e = a("./reader/readerFor"),
                f = a("./utils"),
                g = a("./compressedObject"),
                h = a("./crc32"),
                i = a("./utf8"),
                j = a("./compressions"),
                k = a("./support"),
                l = 0,
                m = 3,
                n = function(a) {
                    for (var b in j)
                        if (j.hasOwnProperty(b) && j[b].magic === a)
                            return j[b];
                    return null
                };
            d.prototype = {
                    isEncrypted: function() {
                        return 1 === (1 & this.bitFlag)
                    },
                    useUTF8: function() {
                        return 2048 === (2048 & this.bitFlag)
                    },
                    readLocalPart: function(a) {
                        var b, c;
                        if (a.skip(22),
                            this.fileNameLength = a.readInt(2),
                            c = a.readInt(2),
                            this.fileName = a.readData(this.fileNameLength),
                            a.skip(c),
                            this.compressedSize === -1 || this.uncompressedSize === -1)
                            throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize === -1 || uncompressedSize === -1)");
                        if (b = n(this.compressionMethod),
                            null === b)
                            throw new Error("Corrupted zip : compression " + f.pretty(this.compressionMethod) + " unknown (inner file : " + f.transformTo("string", this.fileName) + ")");
                        this.decompressed = new g(this.compressedSize, this.uncompressedSize, this.crc32, b, a.readData(this.compressedSize))
                    },
                    readCentralPart: function(a) {
                        this.versionMadeBy = a.readInt(2),
                            a.skip(2),
                            this.bitFlag = a.readInt(2),
                            this.compressionMethod = a.readString(2),
                            this.date = a.readDate(),
                            this.crc32 = a.readInt(4),
                            this.compressedSize = a.readInt(4),
                            this.uncompressedSize = a.readInt(4);
                        var b = a.readInt(2);
                        if (this.extraFieldsLength = a.readInt(2),
                            this.fileCommentLength = a.readInt(2),
                            this.diskNumberStart = a.readInt(2),
                            this.internalFileAttributes = a.readInt(2),
                            this.externalFileAttributes = a.readInt(4),
                            this.localHeaderOffset = a.readInt(4),
                            this.isEncrypted())
                            throw new Error("Encrypted zip are not supported");
                        a.skip(b),
                            this.readExtraFields(a),
                            this.parseZIP64ExtraField(a),
                            this.fileComment = a.readData(this.fileCommentLength)
                    },
                    processAttributes: function() {
                        this.unixPermissions = null,
                            this.dosPermissions = null;
                        var a = this.versionMadeBy >> 8;
                        this.dir = !!(16 & this.externalFileAttributes),
                            a === l && (this.dosPermissions = 63 & this.externalFileAttributes),
                            a === m && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535),
                            this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = !0)
                    },
                    parseZIP64ExtraField: function(a) {
                        if (this.extraFields[1]) {
                            var b = e(this.extraFields[1].value);
                            this.uncompressedSize === f.MAX_VALUE_32BITS && (this.uncompressedSize = b.readInt(8)),
                                this.compressedSize === f.MAX_VALUE_32BITS && (this.compressedSize = b.readInt(8)),
                                this.localHeaderOffset === f.MAX_VALUE_32BITS && (this.localHeaderOffset = b.readInt(8)),
                                this.diskNumberStart === f.MAX_VALUE_32BITS && (this.diskNumberStart = b.readInt(4))
                        }
                    },
                    readExtraFields: function(a) {
                        var b, c, d, e = a.index + this.extraFieldsLength;
                        for (this.extraFields || (this.extraFields = {}); a.index < e;)
                            b = a.readInt(2),
                            c = a.readInt(2),
                            d = a.readData(c),
                            this.extraFields[b] = {
                                id: b,
                                length: c,
                                value: d
                            }
                    },
                    handleUTF8: function() {
                        var a = k.uint8array ? "uint8array" : "array";
                        if (this.useUTF8())
                            this.fileNameStr = i.utf8decode(this.fileName),
                            this.fileCommentStr = i.utf8decode(this.fileComment);
                        else {
                            var b = this.findExtraFieldUnicodePath();
                            if (null !== b)
                                this.fileNameStr = b;
                            else {
                                var c = f.transformTo(a, this.fileName);
                                this.fileNameStr = this.loadOptions.decodeFileName(c)
                            }
                            var d = this.findExtraFieldUnicodeComment();
                            if (null !== d)
                                this.fileCommentStr = d;
                            else {
                                var e = f.transformTo(a, this.fileComment);
                                this.fileCommentStr = this.loadOptions.decodeFileName(e)
                            }
                        }
                    },
                    findExtraFieldUnicodePath: function() {
                        var a = this.extraFields[28789];
                        if (a) {
                            var b = e(a.value);
                            return 1 !== b.readInt(1) ? null : h(this.fileName) !== b.readInt(4) ? null : i.utf8decode(b.readData(a.length - 5))
                        }
                        return null
                    },
                    findExtraFieldUnicodeComment: function() {
                        var a = this.extraFields[25461];
                        if (a) {
                            var b = e(a.value);
                            return 1 !== b.readInt(1) ? null : h(this.fileComment) !== b.readInt(4) ? null : i.utf8decode(b.readData(a.length - 5))
                        }
                        return null
                    }
                },
                b.exports = d
        }, {
            "./compressedObject": 2,
            "./compressions": 3,
            "./crc32": 4,
            "./reader/readerFor": 22,
            "./support": 30,
            "./utf8": 31,
            "./utils": 32
        }],
        35: [function(a, b, c) {
            "use strict";
            var d = a("./stream/StreamHelper"),
                e = a("./stream/DataWorker"),
                f = a("./utf8"),
                g = a("./compressedObject"),
                h = a("./stream/GenericWorker"),
                i = function(a, b, c) {
                    this.name = a,
                        this.dir = c.dir,
                        this.date = c.date,
                        this.comment = c.comment,
                        this.unixPermissions = c.unixPermissions,
                        this.dosPermissions = c.dosPermissions,
                        this._data = b,
                        this._dataBinary = c.binary,
                        this.options = {
                            compression: c.compression,
                            compressionOptions: c.compressionOptions
                        }
                };
            i.prototype = {
                internalStream: function(a) {
                    var b = a.toLowerCase(),
                        c = "string" === b || "text" === b;
                    "binarystring" !== b && "text" !== b || (b = "string");
                    var e = this._decompressWorker(),
                        g = !this._dataBinary;
                    return g && !c && (e = e.pipe(new f.Utf8EncodeWorker)), !g && c && (e = e.pipe(new f.Utf8DecodeWorker)),
                        new d(e, b, "")
                },
                async: function(a, b) {
                    return this.internalStream(a).accumulate(b)
                },
                nodeStream: function(a, b) {
                    return this.internalStream(a || "nodebuffer").toNodejsStream(b)
                },
                _compressWorker: function(a, b) {
                    if (this._data instanceof g && this._data.compression.magic === a.magic)
                        return this._data.getCompressedWorker();
                    var c = this._decompressWorker();
                    return this._dataBinary || (c = c.pipe(new f.Utf8EncodeWorker)),
                        g.createWorkerFrom(c, a, b)
                },
                _decompressWorker: function() {
                    return this._data instanceof g ? this._data.getContentWorker() : this._data instanceof h ? this._data : new e(this._data)
                }
            };
            for (var j = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], k = function() {
                    throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")
                }, l = 0; l < j.length; l++)
                i.prototype[j[l]] = k;
            b.exports = i
        }, {
            "./compressedObject": 2,
            "./stream/DataWorker": 27,
            "./stream/GenericWorker": 28,
            "./stream/StreamHelper": 29,
            "./utf8": 31
        }],
        36: [function(a, b, c) {
            a("../modules/web.immediate"),
                b.exports = a("../modules/_core").setImmediate
        }, {
            "../modules/_core": 40,
            "../modules/web.immediate": 56
        }],
        37: [function(a, b, c) {
            b.exports = function(a) {
                if ("function" != typeof a)
                    throw TypeError(a + " is not a function!");
                return a
            }
        }, {}],
        38: [function(a, b, c) {
            var d = a("./_is-object");
            b.exports = function(a) {
                if (!d(a))
                    throw TypeError(a + " is not an object!");
                return a
            }
        }, {
            "./_is-object": 51
        }],
        39: [function(a, b, c) {
            var d = {}.toString;
            b.exports = function(a) {
                return d.call(a).slice(8, -1)
            }
        }, {}],
        40: [function(a, b, c) {
            var d = b.exports = {
                version: "2.3.0"
            };
            "number" == typeof __e && (__e = d)
        }, {}],
        41: [function(a, b, c) {
            var d = a("./_a-function");
            b.exports = function(a, b, c) {
                if (d(a),
                    void 0 === b)
                    return a;
                switch (c) {
                    case 1:
                        return function(c) {
                            return a.call(b, c)
                        };
                    case 2:
                        return function(c, d) {
                            return a.call(b, c, d)
                        };
                    case 3:
                        return function(c, d, e) {
                            return a.call(b, c, d, e)
                        }
                }
                return function() {
                    return a.apply(b, arguments)
                }
            }
        }, {
            "./_a-function": 37
        }],
        42: [function(a, b, c) {
            b.exports = !a("./_fails")(function() {
                return 7 != Object.defineProperty({}, "a", {
                    get: function() {
                        return 7
                    }
                }).a
            })
        }, {
            "./_fails": 45
        }],
        43: [function(a, b, c) {
            var d = a("./_is-object"),
                e = a("./_global").document,
                f = d(e) && d(e.createElement);
            b.exports = function(a) {
                return f ? e.createElement(a) : {}
            }
        }, {
            "./_global": 46,
            "./_is-object": 51
        }],
        44: [function(a, b, c) {
            var d = a("./_global"),
                e = a("./_core"),
                f = a("./_ctx"),
                g = a("./_hide"),
                h = "prototype",
                i = function(a, b, c) {
                    var j, k, l, m = a & i.F,
                        n = a & i.G,
                        o = a & i.S,
                        p = a & i.P,
                        q = a & i.B,
                        r = a & i.W,
                        s = n ? e : e[b] || (e[b] = {}),
                        t = s[h],
                        u = n ? d : o ? d[b] : (d[b] || {})[h];
                    n && (c = b);
                    for (j in c)
                        k = !m && u && void 0 !== u[j],
                        k && j in s || (l = k ? u[j] : c[j],
                            s[j] = n && "function" != typeof u[j] ? c[j] : q && k ? f(l, d) : r && u[j] == l ? function(a) {
                                var b = function(b, c, d) {
                                    if (this instanceof a) {
                                        switch (arguments.length) {
                                            case 0:
                                                return new a;
                                            case 1:
                                                return new a(b);
                                            case 2:
                                                return new a(b, c)
                                        }
                                        return new a(b, c, d)
                                    }
                                    return a.apply(this, arguments)
                                };
                                return b[h] = a[h],
                                    b
                            }(l) : p && "function" == typeof l ? f(Function.call, l) : l,
                            p && ((s.virtual || (s.virtual = {}))[j] = l,
                                a & i.R && t && !t[j] && g(t, j, l)))
                };
            i.F = 1,
                i.G = 2,
                i.S = 4,
                i.P = 8,
                i.B = 16,
                i.W = 32,
                i.U = 64,
                i.R = 128,
                b.exports = i
        }, {
            "./_core": 40,
            "./_ctx": 41,
            "./_global": 46,
            "./_hide": 47
        }],
        45: [function(a, b, c) {
            b.exports = function(a) {
                try {
                    return !!a()
                } catch (b) {
                    return !0
                }
            }
        }, {}],
        46: [function(a, b, c) {
            var d = b.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
            "number" == typeof __g && (__g = d)
        }, {}],
        47: [function(a, b, c) {
            var d = a("./_object-dp"),
                e = a("./_property-desc");
            b.exports = a("./_descriptors") ? function(a, b, c) {
                    return d.f(a, b, e(1, c))
                } :
                function(a, b, c) {
                    return a[b] = c,
                        a
                }
        }, {
            "./_descriptors": 42,
            "./_object-dp": 52,
            "./_property-desc": 53
        }],
        48: [function(a, b, c) {
            b.exports = a("./_global").document && document.documentElement
        }, {
            "./_global": 46
        }],
        49: [function(a, b, c) {
            b.exports = !a("./_descriptors") && !a("./_fails")(function() {
                return 7 != Object.defineProperty(a("./_dom-create")("div"), "a", {
                    get: function() {
                        return 7
                    }
                }).a
            })
        }, {
            "./_descriptors": 42,
            "./_dom-create": 43,
            "./_fails": 45
        }],
        50: [function(a, b, c) {
            b.exports = function(a, b, c) {
                var d = void 0 === c;
                switch (b.length) {
                    case 0:
                        return d ? a() : a.call(c);
                    case 1:
                        return d ? a(b[0]) : a.call(c, b[0]);
                    case 2:
                        return d ? a(b[0], b[1]) : a.call(c, b[0], b[1]);
                    case 3:
                        return d ? a(b[0], b[1], b[2]) : a.call(c, b[0], b[1], b[2]);
                    case 4:
                        return d ? a(b[0], b[1], b[2], b[3]) : a.call(c, b[0], b[1], b[2], b[3])
                }
                return a.apply(c, b)
            }
        }, {}],
        51: [function(a, b, c) {
            b.exports = function(a) {
                return "object" == typeof a ? null !== a : "function" == typeof a
            }
        }, {}],
        52: [function(a, b, c) {
            var d = a("./_an-object"),
                e = a("./_ie8-dom-define"),
                f = a("./_to-primitive"),
                g = Object.defineProperty;
            c.f = a("./_descriptors") ? Object.defineProperty : function(a, b, c) {
                if (d(a),
                    b = f(b, !0),
                    d(c),
                    e)
                    try {
                        return g(a, b, c)
                    } catch (h) {}
                if ("get" in c || "set" in c)
                    throw TypeError("Accessors not supported!");
                return "value" in c && (a[b] = c.value),
                    a
            }
        }, {
            "./_an-object": 38,
            "./_descriptors": 42,
            "./_ie8-dom-define": 49,
            "./_to-primitive": 55
        }],
        53: [function(a, b, c) {
            b.exports = function(a, b) {
                return {
                    enumerable: !(1 & a),
                    configurable: !(2 & a),
                    writable: !(4 & a),
                    value: b
                }
            }
        }, {}],
        54: [function(a, b, c) {
            var d, e, f, g = a("./_ctx"),
                h = a("./_invoke"),
                i = a("./_html"),
                j = a("./_dom-create"),
                k = a("./_global"),
                l = k.process,
                m = k.setImmediate,
                n = k.clearImmediate,
                o = k.MessageChannel,
                p = 0,
                q = {},
                r = "onreadystatechange",
                s = function() {
                    var a = +this;
                    if (q.hasOwnProperty(a)) {
                        var b = q[a];
                        delete q[a],
                            b()
                    }
                },
                t = function(a) {
                    s.call(a.data)
                };
            m && n || (m = function(a) {
                        for (var b = [], c = 1; arguments.length > c;)
                            b.push(arguments[c++]);
                        return q[++p] = function() {
                                h("function" == typeof a ? a : Function(a), b)
                            },
                            d(p),
                            p
                    },
                    n = function(a) {
                        delete q[a]
                    },
                    "process" == a("./_cof")(l) ? d = function(a) {
                        l.nextTick(g(s, a, 1))
                    } :
                    o ? (e = new o,
                        f = e.port2,
                        e.port1.onmessage = t,
                        d = g(f.postMessage, f, 1)) : k.addEventListener && "function" == typeof postMessage && !k.importScripts ? (d = function(a) {
                            k.postMessage(a + "", "*")
                        },
                        k.addEventListener("message", t, !1)) : d = r in j("script") ? function(a) {
                        i.appendChild(j("script"))[r] = function() {
                            i.removeChild(this),
                                s.call(a)
                        }
                    } :
                    function(a) {
                        setTimeout(g(s, a, 1), 0)
                    }
                ),
                b.exports = {
                    set: m,
                    clear: n
                }
        }, {
            "./_cof": 39,
            "./_ctx": 41,
            "./_dom-create": 43,
            "./_global": 46,
            "./_html": 48,
            "./_invoke": 50
        }],
        55: [function(a, b, c) {
            var d = a("./_is-object");
            b.exports = function(a, b) {
                if (!d(a))
                    return a;
                var c, e;
                if (b && "function" == typeof(c = a.toString) && !d(e = c.call(a)))
                    return e;
                if ("function" == typeof(c = a.valueOf) && !d(e = c.call(a)))
                    return e;
                if (!b && "function" == typeof(c = a.toString) && !d(e = c.call(a)))
                    return e;
                throw TypeError("Can't convert object to primitive value")
            }
        }, {
            "./_is-object": 51
        }],
        56: [function(a, b, c) {
            var d = a("./_export"),
                e = a("./_task");
            d(d.G + d.B, {
                setImmediate: e.set,
                clearImmediate: e.clear
            })
        }, {
            "./_export": 44,
            "./_task": 54
        }],
        57: [function(a, b, c) {
            (function(a) {
                "use strict";

                function c() {
                    k = !0;
                    for (var a, b, c = l.length; c;) {
                        for (b = l,
                            l = [],
                            a = -1; ++a < c;)
                            b[a]();
                        c = l.length
                    }
                    k = !1
                }

                function d(a) {
                    1 !== l.push(a) || k || e()
                }
                var e, f = a.MutationObserver || a.WebKitMutationObserver;
                if (f) {
                    var g = 0,
                        h = new f(c),
                        i = a.document.createTextNode("");
                    h.observe(i, {
                            characterData: !0
                        }),
                        e = function() {
                            i.data = g = ++g % 2
                        }
                } else if (a.setImmediate || "undefined" == typeof a.MessageChannel)
                    e = "document" in a && "onreadystatechange" in a.document.createElement("script") ? function() {
                        var b = a.document.createElement("script");
                        b.onreadystatechange = function() {
                                c(),
                                    b.onreadystatechange = null,
                                    b.parentNode.removeChild(b),
                                    b = null
                            },
                            a.document.documentElement.appendChild(b)
                    } :
                    function() {
                        setTimeout(c, 0)
                    };
                else {
                    var j = new a.MessageChannel;
                    j.port1.onmessage = c,
                        e = function() {
                            j.port2.postMessage(0)
                        }
                }
                var k, l = [];
                b.exports = d
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}],
        58: [function(a, b, c) {
            "use strict";

            function d() {}

            function e(a) {
                if ("function" != typeof a)
                    throw new TypeError("resolver must be a function");
                this.state = s,
                    this.queue = [],
                    this.outcome = void 0,
                    a !== d && i(this, a)
            }

            function f(a, b, c) {
                this.promise = a,
                    "function" == typeof b && (this.onFulfilled = b,
                        this.callFulfilled = this.otherCallFulfilled),
                    "function" == typeof c && (this.onRejected = c,
                        this.callRejected = this.otherCallRejected)
            }

            function g(a, b, c) {
                o(function() {
                    var d;
                    try {
                        d = b(c)
                    } catch (e) {
                        return p.reject(a, e)
                    }
                    d === a ? p.reject(a, new TypeError("Cannot resolve promise with itself")) : p.resolve(a, d)
                })
            }

            function h(a) {
                var b = a && a.then;
                if (a && ("object" == typeof a || "function" == typeof a) && "function" == typeof b)
                    return function() {
                        b.apply(a, arguments)
                    }
            }

            function i(a, b) {
                function c(b) {
                    f || (f = !0,
                        p.reject(a, b))
                }

                function d(b) {
                    f || (f = !0,
                        p.resolve(a, b))
                }

                function e() {
                    b(d, c)
                }
                var f = !1,
                    g = j(e);
                "error" === g.status && c(g.value)
            }

            function j(a, b) {
                var c = {};
                try {
                    c.value = a(b),
                        c.status = "success"
                } catch (d) {
                    c.status = "error",
                        c.value = d
                }
                return c
            }

            function k(a) {
                return a instanceof this ? a : p.resolve(new this(d), a)
            }

            function l(a) {
                var b = new this(d);
                return p.reject(b, a)
            }

            function m(a) {
                function b(a, b) {
                    function d(a) {
                        g[b] = a,
                            ++h !== e || f || (f = !0,
                                p.resolve(j, g))
                    }
                    c.resolve(a).then(d, function(a) {
                        f || (f = !0,
                            p.reject(j, a))
                    })
                }
                var c = this;
                if ("[object Array]" !== Object.prototype.toString.call(a))
                    return this.reject(new TypeError("must be an array"));
                var e = a.length,
                    f = !1;
                if (!e)
                    return this.resolve([]);
                for (var g = new Array(e), h = 0, i = -1, j = new this(d); ++i < e;)
                    b(a[i], i);
                return j
            }

            function n(a) {
                function b(a) {
                    c.resolve(a).then(function(a) {
                        f || (f = !0,
                            p.resolve(h, a))
                    }, function(a) {
                        f || (f = !0,
                            p.reject(h, a))
                    })
                }
                var c = this;
                if ("[object Array]" !== Object.prototype.toString.call(a))
                    return this.reject(new TypeError("must be an array"));
                var e = a.length,
                    f = !1;
                if (!e)
                    return this.resolve([]);
                for (var g = -1, h = new this(d); ++g < e;)
                    b(a[g]);
                return h
            }
            var o = a("immediate"),
                p = {},
                q = ["REJECTED"],
                r = ["FULFILLED"],
                s = ["PENDING"];
            b.exports = e,
                e.prototype["catch"] = function(a) {
                    return this.then(null, a)
                },
                e.prototype.then = function(a, b) {
                    if ("function" != typeof a && this.state === r || "function" != typeof b && this.state === q)
                        return this;
                    var c = new this.constructor(d);
                    if (this.state !== s) {
                        var e = this.state === r ? a : b;
                        g(c, e, this.outcome)
                    } else
                        this.queue.push(new f(c, a, b));
                    return c
                },
                f.prototype.callFulfilled = function(a) {
                    p.resolve(this.promise, a)
                },
                f.prototype.otherCallFulfilled = function(a) {
                    g(this.promise, this.onFulfilled, a)
                },
                f.prototype.callRejected = function(a) {
                    p.reject(this.promise, a)
                },
                f.prototype.otherCallRejected = function(a) {
                    g(this.promise, this.onRejected, a)
                },
                p.resolve = function(a, b) {
                    var c = j(h, b);
                    if ("error" === c.status)
                        return p.reject(a, c.value);
                    var d = c.value;
                    if (d)
                        i(a, d);
                    else {
                        a.state = r,
                            a.outcome = b;
                        for (var e = -1, f = a.queue.length; ++e < f;)
                            a.queue[e].callFulfilled(b)
                    }
                    return a
                },
                p.reject = function(a, b) {
                    a.state = q,
                        a.outcome = b;
                    for (var c = -1, d = a.queue.length; ++c < d;)
                        a.queue[c].callRejected(b);
                    return a
                },
                e.resolve = k,
                e.reject = l,
                e.all = m,
                e.race = n
        }, {
            immediate: 57
        }],
        59: [function(a, b, c) {
            "use strict";
            var d = a("./lib/utils/common").assign,
                e = a("./lib/deflate"),
                f = a("./lib/inflate"),
                g = a("./lib/zlib/constants"),
                h = {};
            d(h, e, f, g),
                b.exports = h
        }, {
            "./lib/deflate": 60,
            "./lib/inflate": 61,
            "./lib/utils/common": 62,
            "./lib/zlib/constants": 65
        }],
        60: [function(a, b, c) {
            "use strict";

            function d(a) {
                if (!(this instanceof d))
                    return new d(a);
                this.options = i.assign({
                    level: s,
                    method: u,
                    chunkSize: 16384,
                    windowBits: 15,
                    memLevel: 8,
                    strategy: t,
                    to: ""
                }, a || {});
                var b = this.options;
                b.raw && b.windowBits > 0 ? b.windowBits = -b.windowBits : b.gzip && b.windowBits > 0 && b.windowBits < 16 && (b.windowBits += 16),
                    this.err = 0,
                    this.msg = "",
                    this.ended = !1,
                    this.chunks = [],
                    this.strm = new l,
                    this.strm.avail_out = 0;
                var c = h.deflateInit2(this.strm, b.level, b.method, b.windowBits, b.memLevel, b.strategy);
                if (c !== p)
                    throw new Error(k[c]);
                if (b.header && h.deflateSetHeader(this.strm, b.header),
                    b.dictionary) {
                    var e;
                    if (e = "string" == typeof b.dictionary ? j.string2buf(b.dictionary) : "[object ArrayBuffer]" === m.call(b.dictionary) ? new Uint8Array(b.dictionary) : b.dictionary,
                        c = h.deflateSetDictionary(this.strm, e),
                        c !== p)
                        throw new Error(k[c]);
                    this._dict_set = !0
                }
            }

            function e(a, b) {
                var c = new d(b);
                if (c.push(a, !0),
                    c.err)
                    throw c.msg || k[c.err];
                return c.result
            }

            function f(a, b) {
                return b = b || {},
                    b.raw = !0,
                    e(a, b)
            }

            function g(a, b) {
                return b = b || {},
                    b.gzip = !0,
                    e(a, b)
            }
            var h = a("./zlib/deflate"),
                i = a("./utils/common"),
                j = a("./utils/strings"),
                k = a("./zlib/messages"),
                l = a("./zlib/zstream"),
                m = Object.prototype.toString,
                n = 0,
                o = 4,
                p = 0,
                q = 1,
                r = 2,
                s = -1,
                t = 0,
                u = 8;
            d.prototype.push = function(a, b) {
                    var c, d, e = this.strm,
                        f = this.options.chunkSize;
                    if (this.ended)
                        return !1;
                    d = b === ~~b ? b : b === !0 ? o : n,
                        "string" == typeof a ? e.input = j.string2buf(a) : "[object ArrayBuffer]" === m.call(a) ? e.input = new Uint8Array(a) : e.input = a,
                        e.next_in = 0,
                        e.avail_in = e.input.length;
                    do {
                        if (0 === e.avail_out && (e.output = new i.Buf8(f),
                                e.next_out = 0,
                                e.avail_out = f),
                            c = h.deflate(e, d),
                            c !== q && c !== p)
                            return this.onEnd(c),
                                this.ended = !0, !1;
                        0 !== e.avail_out && (0 !== e.avail_in || d !== o && d !== r) || ("string" === this.options.to ? this.onData(j.buf2binstring(i.shrinkBuf(e.output, e.next_out))) : this.onData(i.shrinkBuf(e.output, e.next_out)))
                    } while ((e.avail_in > 0 || 0 === e.avail_out) && c !== q);
                    return d === o ? (c = h.deflateEnd(this.strm),
                        this.onEnd(c),
                        this.ended = !0,
                        c === p) : d !== r || (this.onEnd(p),
                        e.avail_out = 0, !0)
                },
                d.prototype.onData = function(a) {
                    this.chunks.push(a)
                },
                d.prototype.onEnd = function(a) {
                    a === p && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)),
                        this.chunks = [],
                        this.err = a,
                        this.msg = this.strm.msg
                },
                c.Deflate = d,
                c.deflate = e,
                c.deflateRaw = f,
                c.gzip = g
        }, {
            "./utils/common": 62,
            "./utils/strings": 63,
            "./zlib/deflate": 67,
            "./zlib/messages": 72,
            "./zlib/zstream": 74
        }],
        61: [function(a, b, c) {
            "use strict";

            function d(a) {
                if (!(this instanceof d))
                    return new d(a);
                this.options = h.assign({
                    chunkSize: 16384,
                    windowBits: 0,
                    to: ""
                }, a || {});
                var b = this.options;
                b.raw && b.windowBits >= 0 && b.windowBits < 16 && (b.windowBits = -b.windowBits,
                        0 === b.windowBits && (b.windowBits = -15)), !(b.windowBits >= 0 && b.windowBits < 16) || a && a.windowBits || (b.windowBits += 32),
                    b.windowBits > 15 && b.windowBits < 48 && 0 === (15 & b.windowBits) && (b.windowBits |= 15),
                    this.err = 0,
                    this.msg = "",
                    this.ended = !1,
                    this.chunks = [],
                    this.strm = new l,
                    this.strm.avail_out = 0;
                var c = g.inflateInit2(this.strm, b.windowBits);
                if (c !== j.Z_OK)
                    throw new Error(k[c]);
                this.header = new m,
                    g.inflateGetHeader(this.strm, this.header)
            }

            function e(a, b) {
                var c = new d(b);
                if (c.push(a, !0),
                    c.err)
                    throw c.msg || k[c.err];
                return c.result
            }

            function f(a, b) {
                return b = b || {},
                    b.raw = !0,
                    e(a, b)
            }
            var g = a("./zlib/inflate"),
                h = a("./utils/common"),
                i = a("./utils/strings"),
                j = a("./zlib/constants"),
                k = a("./zlib/messages"),
                l = a("./zlib/zstream"),
                m = a("./zlib/gzheader"),
                n = Object.prototype.toString;
            d.prototype.push = function(a, b) {
                    var c, d, e, f, k, l, m = this.strm,
                        o = this.options.chunkSize,
                        p = this.options.dictionary,
                        q = !1;
                    if (this.ended)
                        return !1;
                    d = b === ~~b ? b : b === !0 ? j.Z_FINISH : j.Z_NO_FLUSH,
                        "string" == typeof a ? m.input = i.binstring2buf(a) : "[object ArrayBuffer]" === n.call(a) ? m.input = new Uint8Array(a) : m.input = a,
                        m.next_in = 0,
                        m.avail_in = m.input.length;
                    do {
                        if (0 === m.avail_out && (m.output = new h.Buf8(o),
                                m.next_out = 0,
                                m.avail_out = o),
                            c = g.inflate(m, j.Z_NO_FLUSH),
                            c === j.Z_NEED_DICT && p && (l = "string" == typeof p ? i.string2buf(p) : "[object ArrayBuffer]" === n.call(p) ? new Uint8Array(p) : p,
                                c = g.inflateSetDictionary(this.strm, l)),
                            c === j.Z_BUF_ERROR && q === !0 && (c = j.Z_OK,
                                q = !1),
                            c !== j.Z_STREAM_END && c !== j.Z_OK)
                            return this.onEnd(c),
                                this.ended = !0, !1;
                        m.next_out && (0 !== m.avail_out && c !== j.Z_STREAM_END && (0 !== m.avail_in || d !== j.Z_FINISH && d !== j.Z_SYNC_FLUSH) || ("string" === this.options.to ? (e = i.utf8border(m.output, m.next_out),
                                f = m.next_out - e,
                                k = i.buf2string(m.output, e),
                                m.next_out = f,
                                m.avail_out = o - f,
                                f && h.arraySet(m.output, m.output, e, f, 0),
                                this.onData(k)) : this.onData(h.shrinkBuf(m.output, m.next_out)))),
                            0 === m.avail_in && 0 === m.avail_out && (q = !0)
                    } while ((m.avail_in > 0 || 0 === m.avail_out) && c !== j.Z_STREAM_END);
                    return c === j.Z_STREAM_END && (d = j.Z_FINISH),
                        d === j.Z_FINISH ? (c = g.inflateEnd(this.strm),
                            this.onEnd(c),
                            this.ended = !0,
                            c === j.Z_OK) : d !== j.Z_SYNC_FLUSH || (this.onEnd(j.Z_OK),
                            m.avail_out = 0, !0)
                },
                d.prototype.onData = function(a) {
                    this.chunks.push(a)
                },
                d.prototype.onEnd = function(a) {
                    a === j.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = h.flattenChunks(this.chunks)),
                        this.chunks = [],
                        this.err = a,
                        this.msg = this.strm.msg
                },
                c.Inflate = d,
                c.inflate = e,
                c.inflateRaw = f,
                c.ungzip = e
        }, {
            "./utils/common": 62,
            "./utils/strings": 63,
            "./zlib/constants": 65,
            "./zlib/gzheader": 68,
            "./zlib/inflate": 70,
            "./zlib/messages": 72,
            "./zlib/zstream": 74
        }],
        62: [function(a, b, c) {
            "use strict";
            var d = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
            c.assign = function(a) {
                    for (var b = Array.prototype.slice.call(arguments, 1); b.length;) {
                        var c = b.shift();
                        if (c) {
                            if ("object" != typeof c)
                                throw new TypeError(c + "must be non-object");
                            for (var d in c)
                                c.hasOwnProperty(d) && (a[d] = c[d])
                        }
                    }
                    return a
                },
                c.shrinkBuf = function(a, b) {
                    return a.length === b ? a : a.subarray ? a.subarray(0, b) : (a.length = b,
                        a)
                };
            var e = {
                    arraySet: function(a, b, c, d, e) {
                        if (b.subarray && a.subarray)
                            return void a.set(b.subarray(c, c + d), e);
                        for (var f = 0; f < d; f++)
                            a[e + f] = b[c + f]
                    },
                    flattenChunks: function(a) {
                        var b, c, d, e, f, g;
                        for (d = 0,
                            b = 0,
                            c = a.length; b < c; b++)
                            d += a[b].length;
                        for (g = new Uint8Array(d),
                            e = 0,
                            b = 0,
                            c = a.length; b < c; b++)
                            f = a[b],
                            g.set(f, e),
                            e += f.length;
                        return g
                    }
                },
                f = {
                    arraySet: function(a, b, c, d, e) {
                        for (var f = 0; f < d; f++)
                            a[e + f] = b[c + f]
                    },
                    flattenChunks: function(a) {
                        return [].concat.apply([], a)
                    }
                };
            c.setTyped = function(a) {
                    a ? (c.Buf8 = Uint8Array,
                        c.Buf16 = Uint16Array,
                        c.Buf32 = Int32Array,
                        c.assign(c, e)) : (c.Buf8 = Array,
                        c.Buf16 = Array,
                        c.Buf32 = Array,
                        c.assign(c, f))
                },
                c.setTyped(d)
        }, {}],
        63: [function(a, b, c) {
            "use strict";

            function d(a, b) {
                if (b < 65537 && (a.subarray && g || !a.subarray && f))
                    return String.fromCharCode.apply(null, e.shrinkBuf(a, b));
                for (var c = "", d = 0; d < b; d++)
                    c += String.fromCharCode(a[d]);
                return c
            }
            var e = a("./common"),
                f = !0,
                g = !0;
            try {
                String.fromCharCode.apply(null, [0])
            } catch (h) {
                f = !1
            }
            try {
                String.fromCharCode.apply(null, new Uint8Array(1))
            } catch (h) {
                g = !1
            }
            for (var i = new e.Buf8(256), j = 0; j < 256; j++)
                i[j] = j >= 252 ? 6 : j >= 248 ? 5 : j >= 240 ? 4 : j >= 224 ? 3 : j >= 192 ? 2 : 1;
            i[254] = i[254] = 1,
                c.string2buf = function(a) {
                    var b, c, d, f, g, h = a.length,
                        i = 0;
                    for (f = 0; f < h; f++)
                        c = a.charCodeAt(f),
                        55296 === (64512 & c) && f + 1 < h && (d = a.charCodeAt(f + 1),
                            56320 === (64512 & d) && (c = 65536 + (c - 55296 << 10) + (d - 56320),
                                f++)),
                        i += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
                    for (b = new e.Buf8(i),
                        g = 0,
                        f = 0; g < i; f++)
                        c = a.charCodeAt(f),
                        55296 === (64512 & c) && f + 1 < h && (d = a.charCodeAt(f + 1),
                            56320 === (64512 & d) && (c = 65536 + (c - 55296 << 10) + (d - 56320),
                                f++)),
                        c < 128 ? b[g++] = c : c < 2048 ? (b[g++] = 192 | c >>> 6,
                            b[g++] = 128 | 63 & c) : c < 65536 ? (b[g++] = 224 | c >>> 12,
                            b[g++] = 128 | c >>> 6 & 63,
                            b[g++] = 128 | 63 & c) : (b[g++] = 240 | c >>> 18,
                            b[g++] = 128 | c >>> 12 & 63,
                            b[g++] = 128 | c >>> 6 & 63,
                            b[g++] = 128 | 63 & c);
                    return b
                },
                c.buf2binstring = function(a) {
                    return d(a, a.length)
                },
                c.binstring2buf = function(a) {
                    for (var b = new e.Buf8(a.length), c = 0, d = b.length; c < d; c++)
                        b[c] = a.charCodeAt(c);
                    return b
                },
                c.buf2string = function(a, b) {
                    var c, e, f, g, h = b || a.length,
                        j = new Array(2 * h);
                    for (e = 0,
                        c = 0; c < h;)
                        if (f = a[c++],
                            f < 128)
                            j[e++] = f;
                        else if (g = i[f],
                        g > 4)
                        j[e++] = 65533,
                        c += g - 1;
                    else {
                        for (f &= 2 === g ? 31 : 3 === g ? 15 : 7; g > 1 && c < h;)
                            f = f << 6 | 63 & a[c++],
                            g--;
                        g > 1 ? j[e++] = 65533 : f < 65536 ? j[e++] = f : (f -= 65536,
                            j[e++] = 55296 | f >> 10 & 1023,
                            j[e++] = 56320 | 1023 & f)
                    }
                    return d(j, e)
                },
                c.utf8border = function(a, b) {
                    var c;
                    for (b = b || a.length,
                        b > a.length && (b = a.length),
                        c = b - 1; c >= 0 && 128 === (192 & a[c]);)
                        c--;
                    return c < 0 ? b : 0 === c ? b : c + i[a[c]] > b ? c : b
                }
        }, {
            "./common": 62
        }],
        64: [function(a, b, c) {
            "use strict";

            function d(a, b, c, d) {
                for (var e = 65535 & a | 0, f = a >>> 16 & 65535 | 0, g = 0; 0 !== c;) {
                    g = c > 2e3 ? 2e3 : c,
                        c -= g;
                    do
                        e = e + b[d++] | 0,
                        f = f + e | 0;
                    while (--g);
                    e %= 65521,
                        f %= 65521
                }
                return e | f << 16 | 0
            }
            b.exports = d
        }, {}],
        65: [function(a, b, c) {
            "use strict";
            b.exports = {
                Z_NO_FLUSH: 0,
                Z_PARTIAL_FLUSH: 1,
                Z_SYNC_FLUSH: 2,
                Z_FULL_FLUSH: 3,
                Z_FINISH: 4,
                Z_BLOCK: 5,
                Z_TREES: 6,
                Z_OK: 0,
                Z_STREAM_END: 1,
                Z_NEED_DICT: 2,
                Z_ERRNO: -1,
                Z_STREAM_ERROR: -2,
                Z_DATA_ERROR: -3,
                Z_BUF_ERROR: -5,
                Z_NO_COMPRESSION: 0,
                Z_BEST_SPEED: 1,
                Z_BEST_COMPRESSION: 9,
                Z_DEFAULT_COMPRESSION: -1,
                Z_FILTERED: 1,
                Z_HUFFMAN_ONLY: 2,
                Z_RLE: 3,
                Z_FIXED: 4,
                Z_DEFAULT_STRATEGY: 0,
                Z_BINARY: 0,
                Z_TEXT: 1,
                Z_UNKNOWN: 2,
                Z_DEFLATED: 8
            }
        }, {}],
        66: [function(a, b, c) {
            "use strict";

            function d() {
                for (var a, b = [], c = 0; c < 256; c++) {
                    a = c;
                    for (var d = 0; d < 8; d++)
                        a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
                    b[c] = a
                }
                return b
            }

            function e(a, b, c, d) {
                var e = f,
                    g = d + c;
                a ^= -1;
                for (var h = d; h < g; h++)
                    a = a >>> 8 ^ e[255 & (a ^ b[h])];
                return a ^ -1
            }
            var f = d();
            b.exports = e
        }, {}],
        67: [function(a, b, c) {
            "use strict";

            function d(a, b) {
                return a.msg = I[b],
                    b
            }

            function e(a) {
                return (a << 1) - (a > 4 ? 9 : 0)
            }

            function f(a) {
                for (var b = a.length; --b >= 0;)
                    a[b] = 0
            }

            function g(a) {
                var b = a.state,
                    c = b.pending;
                c > a.avail_out && (c = a.avail_out),
                    0 !== c && (E.arraySet(a.output, b.pending_buf, b.pending_out, c, a.next_out),
                        a.next_out += c,
                        b.pending_out += c,
                        a.total_out += c,
                        a.avail_out -= c,
                        b.pending -= c,
                        0 === b.pending && (b.pending_out = 0))
            }

            function h(a, b) {
                F._tr_flush_block(a, a.block_start >= 0 ? a.block_start : -1, a.strstart - a.block_start, b),
                    a.block_start = a.strstart,
                    g(a.strm)
            }

            function i(a, b) {
                a.pending_buf[a.pending++] = b
            }

            function j(a, b) {
                a.pending_buf[a.pending++] = b >>> 8 & 255,
                    a.pending_buf[a.pending++] = 255 & b
            }

            function k(a, b, c, d) {
                var e = a.avail_in;
                return e > d && (e = d),
                    0 === e ? 0 : (a.avail_in -= e,
                        E.arraySet(b, a.input, a.next_in, e, c),
                        1 === a.state.wrap ? a.adler = G(a.adler, b, e, c) : 2 === a.state.wrap && (a.adler = H(a.adler, b, e, c)),
                        a.next_in += e,
                        a.total_in += e,
                        e)
            }

            function l(a, b) {
                var c, d, e = a.max_chain_length,
                    f = a.strstart,
                    g = a.prev_length,
                    h = a.nice_match,
                    i = a.strstart > a.w_size - la ? a.strstart - (a.w_size - la) : 0,
                    j = a.window,
                    k = a.w_mask,
                    l = a.prev,
                    m = a.strstart + ka,
                    n = j[f + g - 1],
                    o = j[f + g];
                a.prev_length >= a.good_match && (e >>= 2),
                    h > a.lookahead && (h = a.lookahead);
                do
                    if (c = b,
                        j[c + g] === o && j[c + g - 1] === n && j[c] === j[f] && j[++c] === j[f + 1]) {
                        f += 2,
                            c++;
                        do
                        ;
                        while (j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && f < m);
                        if (d = ka - (m - f),
                            f = m - ka,
                            d > g) {
                            if (a.match_start = b,
                                g = d,
                                d >= h)
                                break;
                            n = j[f + g - 1],
                                o = j[f + g]
                        }
                    }
                while ((b = l[b & k]) > i && 0 !== --e);
                return g <= a.lookahead ? g : a.lookahead
            }

            function m(a) {
                var b, c, d, e, f, g = a.w_size;
                do {
                    if (e = a.window_size - a.lookahead - a.strstart,
                        a.strstart >= g + (g - la)) {
                        E.arraySet(a.window, a.window, g, g, 0),
                            a.match_start -= g,
                            a.strstart -= g,
                            a.block_start -= g,
                            c = a.hash_size,
                            b = c;
                        do
                            d = a.head[--b],
                            a.head[b] = d >= g ? d - g : 0;
                        while (--c);
                        c = g,
                            b = c;
                        do
                            d = a.prev[--b],
                            a.prev[b] = d >= g ? d - g : 0;
                        while (--c);
                        e += g
                    }
                    if (0 === a.strm.avail_in)
                        break;
                    if (c = k(a.strm, a.window, a.strstart + a.lookahead, e),
                        a.lookahead += c,
                        a.lookahead + a.insert >= ja)
                        for (f = a.strstart - a.insert,
                            a.ins_h = a.window[f],
                            a.ins_h = (a.ins_h << a.hash_shift ^ a.window[f + 1]) & a.hash_mask; a.insert && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[f + ja - 1]) & a.hash_mask,
                                a.prev[f & a.w_mask] = a.head[a.ins_h],
                                a.head[a.ins_h] = f,
                                f++,
                                a.insert--, !(a.lookahead + a.insert < ja));)
                    ;
                } while (a.lookahead < la && 0 !== a.strm.avail_in)
            }

            function n(a, b) {
                var c = 65535;
                for (c > a.pending_buf_size - 5 && (c = a.pending_buf_size - 5);;) {
                    if (a.lookahead <= 1) {
                        if (m(a),
                            0 === a.lookahead && b === J)
                            return ua;
                        if (0 === a.lookahead)
                            break
                    }
                    a.strstart += a.lookahead,
                        a.lookahead = 0;
                    var d = a.block_start + c;
                    if ((0 === a.strstart || a.strstart >= d) && (a.lookahead = a.strstart - d,
                            a.strstart = d,
                            h(a, !1),
                            0 === a.strm.avail_out))
                        return ua;
                    if (a.strstart - a.block_start >= a.w_size - la && (h(a, !1),
                            0 === a.strm.avail_out))
                        return ua
                }
                return a.insert = 0,
                    b === M ? (h(a, !0),
                        0 === a.strm.avail_out ? wa : xa) : a.strstart > a.block_start && (h(a, !1),
                        0 === a.strm.avail_out) ? ua : ua
            }

            function o(a, b) {
                for (var c, d;;) {
                    if (a.lookahead < la) {
                        if (m(a),
                            a.lookahead < la && b === J)
                            return ua;
                        if (0 === a.lookahead)
                            break
                    }
                    if (c = 0,
                        a.lookahead >= ja && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + ja - 1]) & a.hash_mask,
                            c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h],
                            a.head[a.ins_h] = a.strstart),
                        0 !== c && a.strstart - c <= a.w_size - la && (a.match_length = l(a, c)),
                        a.match_length >= ja)
                        if (d = F._tr_tally(a, a.strstart - a.match_start, a.match_length - ja),
                            a.lookahead -= a.match_length,
                            a.match_length <= a.max_lazy_match && a.lookahead >= ja) {
                            a.match_length--;
                            do
                                a.strstart++,
                                a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + ja - 1]) & a.hash_mask,
                                c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h],
                                a.head[a.ins_h] = a.strstart;
                            while (0 !== --a.match_length);
                            a.strstart++
                        } else
                            a.strstart += a.match_length,
                            a.match_length = 0,
                            a.ins_h = a.window[a.strstart],
                            a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + 1]) & a.hash_mask;
                    else
                        d = F._tr_tally(a, 0, a.window[a.strstart]),
                        a.lookahead--,
                        a.strstart++;
                    if (d && (h(a, !1),
                            0 === a.strm.avail_out))
                        return ua
                }
                return a.insert = a.strstart < ja - 1 ? a.strstart : ja - 1,
                    b === M ? (h(a, !0),
                        0 === a.strm.avail_out ? wa : xa) : a.last_lit && (h(a, !1),
                        0 === a.strm.avail_out) ? ua : va
            }

            function p(a, b) {
                for (var c, d, e;;) {
                    if (a.lookahead < la) {
                        if (m(a),
                            a.lookahead < la && b === J)
                            return ua;
                        if (0 === a.lookahead)
                            break
                    }
                    if (c = 0,
                        a.lookahead >= ja && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + ja - 1]) & a.hash_mask,
                            c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h],
                            a.head[a.ins_h] = a.strstart),
                        a.prev_length = a.match_length,
                        a.prev_match = a.match_start,
                        a.match_length = ja - 1,
                        0 !== c && a.prev_length < a.max_lazy_match && a.strstart - c <= a.w_size - la && (a.match_length = l(a, c),
                            a.match_length <= 5 && (a.strategy === U || a.match_length === ja && a.strstart - a.match_start > 4096) && (a.match_length = ja - 1)),
                        a.prev_length >= ja && a.match_length <= a.prev_length) {
                        e = a.strstart + a.lookahead - ja,
                            d = F._tr_tally(a, a.strstart - 1 - a.prev_match, a.prev_length - ja),
                            a.lookahead -= a.prev_length - 1,
                            a.prev_length -= 2;
                        do
                            ++a.strstart <= e && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + ja - 1]) & a.hash_mask,
                                c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h],
                                a.head[a.ins_h] = a.strstart);
                        while (0 !== --a.prev_length);
                        if (a.match_available = 0,
                            a.match_length = ja - 1,
                            a.strstart++,
                            d && (h(a, !1),
                                0 === a.strm.avail_out))
                            return ua
                    } else if (a.match_available) {
                        if (d = F._tr_tally(a, 0, a.window[a.strstart - 1]),
                            d && h(a, !1),
                            a.strstart++,
                            a.lookahead--,
                            0 === a.strm.avail_out)
                            return ua
                    } else
                        a.match_available = 1,
                        a.strstart++,
                        a.lookahead--
                }
                return a.match_available && (d = F._tr_tally(a, 0, a.window[a.strstart - 1]),
                        a.match_available = 0),
                    a.insert = a.strstart < ja - 1 ? a.strstart : ja - 1,
                    b === M ? (h(a, !0),
                        0 === a.strm.avail_out ? wa : xa) : a.last_lit && (h(a, !1),
                        0 === a.strm.avail_out) ? ua : va
            }

            function q(a, b) {
                for (var c, d, e, f, g = a.window;;) {
                    if (a.lookahead <= ka) {
                        if (m(a),
                            a.lookahead <= ka && b === J)
                            return ua;
                        if (0 === a.lookahead)
                            break
                    }
                    if (a.match_length = 0,
                        a.lookahead >= ja && a.strstart > 0 && (e = a.strstart - 1,
                            d = g[e],
                            d === g[++e] && d === g[++e] && d === g[++e])) {
                        f = a.strstart + ka;
                        do
                        ;
                        while (d === g[++e] && d === g[++e] && d === g[++e] && d === g[++e] && d === g[++e] && d === g[++e] && d === g[++e] && d === g[++e] && e < f);
                        a.match_length = ka - (f - e),
                            a.match_length > a.lookahead && (a.match_length = a.lookahead)
                    }
                    if (a.match_length >= ja ? (c = F._tr_tally(a, 1, a.match_length - ja),
                            a.lookahead -= a.match_length,
                            a.strstart += a.match_length,
                            a.match_length = 0) : (c = F._tr_tally(a, 0, a.window[a.strstart]),
                            a.lookahead--,
                            a.strstart++),
                        c && (h(a, !1),
                            0 === a.strm.avail_out))
                        return ua
                }
                return a.insert = 0,
                    b === M ? (h(a, !0),
                        0 === a.strm.avail_out ? wa : xa) : a.last_lit && (h(a, !1),
                        0 === a.strm.avail_out) ? ua : va
            }

            function r(a, b) {
                for (var c;;) {
                    if (0 === a.lookahead && (m(a),
                            0 === a.lookahead)) {
                        if (b === J)
                            return ua;
                        break
                    }
                    if (a.match_length = 0,
                        c = F._tr_tally(a, 0, a.window[a.strstart]),
                        a.lookahead--,
                        a.strstart++,
                        c && (h(a, !1),
                            0 === a.strm.avail_out))
                        return ua
                }
                return a.insert = 0,
                    b === M ? (h(a, !0),
                        0 === a.strm.avail_out ? wa : xa) : a.last_lit && (h(a, !1),
                        0 === a.strm.avail_out) ? ua : va
            }

            function s(a, b, c, d, e) {
                this.good_length = a,
                    this.max_lazy = b,
                    this.nice_length = c,
                    this.max_chain = d,
                    this.func = e
            }

            function t(a) {
                a.window_size = 2 * a.w_size,
                    f(a.head),
                    a.max_lazy_match = D[a.level].max_lazy,
                    a.good_match = D[a.level].good_length,
                    a.nice_match = D[a.level].nice_length,
                    a.max_chain_length = D[a.level].max_chain,
                    a.strstart = 0,
                    a.block_start = 0,
                    a.lookahead = 0,
                    a.insert = 0,
                    a.match_length = a.prev_length = ja - 1,
                    a.match_available = 0,
                    a.ins_h = 0
            }

            function u() {
                this.strm = null,
                    this.status = 0,
                    this.pending_buf = null,
                    this.pending_buf_size = 0,
                    this.pending_out = 0,
                    this.pending = 0,
                    this.wrap = 0,
                    this.gzhead = null,
                    this.gzindex = 0,
                    this.method = $,
                    this.last_flush = -1,
                    this.w_size = 0,
                    this.w_bits = 0,
                    this.w_mask = 0,
                    this.window = null,
                    this.window_size = 0,
                    this.prev = null,
                    this.head = null,
                    this.ins_h = 0,
                    this.hash_size = 0,
                    this.hash_bits = 0,
                    this.hash_mask = 0,
                    this.hash_shift = 0,
                    this.block_start = 0,
                    this.match_length = 0,
                    this.prev_match = 0,
                    this.match_available = 0,
                    this.strstart = 0,
                    this.match_start = 0,
                    this.lookahead = 0,
                    this.prev_length = 0,
                    this.max_chain_length = 0,
                    this.max_lazy_match = 0,
                    this.level = 0,
                    this.strategy = 0,
                    this.good_match = 0,
                    this.nice_match = 0,
                    this.dyn_ltree = new E.Buf16(2 * ha),
                    this.dyn_dtree = new E.Buf16(2 * (2 * fa + 1)),
                    this.bl_tree = new E.Buf16(2 * (2 * ga + 1)),
                    f(this.dyn_ltree),
                    f(this.dyn_dtree),
                    f(this.bl_tree),
                    this.l_desc = null,
                    this.d_desc = null,
                    this.bl_desc = null,
                    this.bl_count = new E.Buf16(ia + 1),
                    this.heap = new E.Buf16(2 * ea + 1),
                    f(this.heap),
                    this.heap_len = 0,
                    this.heap_max = 0,
                    this.depth = new E.Buf16(2 * ea + 1),
                    f(this.depth),
                    this.l_buf = 0,
                    this.lit_bufsize = 0,
                    this.last_lit = 0,
                    this.d_buf = 0,
                    this.opt_len = 0,
                    this.static_len = 0,
                    this.matches = 0,
                    this.insert = 0,
                    this.bi_buf = 0,
                    this.bi_valid = 0
            }

            function v(a) {
                var b;
                return a && a.state ? (a.total_in = a.total_out = 0,
                    a.data_type = Z,
                    b = a.state,
                    b.pending = 0,
                    b.pending_out = 0,
                    b.wrap < 0 && (b.wrap = -b.wrap),
                    b.status = b.wrap ? na : sa,
                    a.adler = 2 === b.wrap ? 0 : 1,
                    b.last_flush = J,
                    F._tr_init(b),
                    O) : d(a, Q)
            }

            function w(a) {
                var b = v(a);
                return b === O && t(a.state),
                    b
            }

            function x(a, b) {
                return a && a.state ? 2 !== a.state.wrap ? Q : (a.state.gzhead = b,
                    O) : Q
            }

            function y(a, b, c, e, f, g) {
                if (!a)
                    return Q;
                var h = 1;
                if (b === T && (b = 6),
                    e < 0 ? (h = 0,
                        e = -e) : e > 15 && (h = 2,
                        e -= 16),
                    f < 1 || f > _ || c !== $ || e < 8 || e > 15 || b < 0 || b > 9 || g < 0 || g > X)
                    return d(a, Q);
                8 === e && (e = 9);
                var i = new u;
                return a.state = i,
                    i.strm = a,
                    i.wrap = h,
                    i.gzhead = null,
                    i.w_bits = e,
                    i.w_size = 1 << i.w_bits,
                    i.w_mask = i.w_size - 1,
                    i.hash_bits = f + 7,
                    i.hash_size = 1 << i.hash_bits,
                    i.hash_mask = i.hash_size - 1,
                    i.hash_shift = ~~((i.hash_bits + ja - 1) / ja),
                    i.window = new E.Buf8(2 * i.w_size),
                    i.head = new E.Buf16(i.hash_size),
                    i.prev = new E.Buf16(i.w_size),
                    i.lit_bufsize = 1 << f + 6,
                    i.pending_buf_size = 4 * i.lit_bufsize,
                    i.pending_buf = new E.Buf8(i.pending_buf_size),
                    i.d_buf = 1 * i.lit_bufsize,
                    i.l_buf = 3 * i.lit_bufsize,
                    i.level = b,
                    i.strategy = g,
                    i.method = c,
                    w(a)
            }

            function z(a, b) {
                return y(a, b, $, aa, ba, Y)
            }

            function A(a, b) {
                var c, h, k, l;
                if (!a || !a.state || b > N || b < 0)
                    return a ? d(a, Q) : Q;
                if (h = a.state, !a.output || !a.input && 0 !== a.avail_in || h.status === ta && b !== M)
                    return d(a, 0 === a.avail_out ? S : Q);
                if (h.strm = a,
                    c = h.last_flush,
                    h.last_flush = b,
                    h.status === na)
                    if (2 === h.wrap)
                        a.adler = 0,
                        i(h, 31),
                        i(h, 139),
                        i(h, 8),
                        h.gzhead ? (i(h, (h.gzhead.text ? 1 : 0) + (h.gzhead.hcrc ? 2 : 0) + (h.gzhead.extra ? 4 : 0) + (h.gzhead.name ? 8 : 0) + (h.gzhead.comment ? 16 : 0)),
                            i(h, 255 & h.gzhead.time),
                            i(h, h.gzhead.time >> 8 & 255),
                            i(h, h.gzhead.time >> 16 & 255),
                            i(h, h.gzhead.time >> 24 & 255),
                            i(h, 9 === h.level ? 2 : h.strategy >= V || h.level < 2 ? 4 : 0),
                            i(h, 255 & h.gzhead.os),
                            h.gzhead.extra && h.gzhead.extra.length && (i(h, 255 & h.gzhead.extra.length),
                                i(h, h.gzhead.extra.length >> 8 & 255)),
                            h.gzhead.hcrc && (a.adler = H(a.adler, h.pending_buf, h.pending, 0)),
                            h.gzindex = 0,
                            h.status = oa) : (i(h, 0),
                            i(h, 0),
                            i(h, 0),
                            i(h, 0),
                            i(h, 0),
                            i(h, 9 === h.level ? 2 : h.strategy >= V || h.level < 2 ? 4 : 0),
                            i(h, ya),
                            h.status = sa);
                    else {
                        var m = $ + (h.w_bits - 8 << 4) << 8,
                            n = -1;
                        n = h.strategy >= V || h.level < 2 ? 0 : h.level < 6 ? 1 : 6 === h.level ? 2 : 3,
                            m |= n << 6,
                            0 !== h.strstart && (m |= ma),
                            m += 31 - m % 31,
                            h.status = sa,
                            j(h, m),
                            0 !== h.strstart && (j(h, a.adler >>> 16),
                                j(h, 65535 & a.adler)),
                            a.adler = 1
                    }
                if (h.status === oa)
                    if (h.gzhead.extra) {
                        for (k = h.pending; h.gzindex < (65535 & h.gzhead.extra.length) && (h.pending !== h.pending_buf_size || (h.gzhead.hcrc && h.pending > k && (a.adler = H(a.adler, h.pending_buf, h.pending - k, k)),
                                g(a),
                                k = h.pending,
                                h.pending !== h.pending_buf_size));)
                            i(h, 255 & h.gzhead.extra[h.gzindex]),
                            h.gzindex++;
                        h.gzhead.hcrc && h.pending > k && (a.adler = H(a.adler, h.pending_buf, h.pending - k, k)),
                            h.gzindex === h.gzhead.extra.length && (h.gzindex = 0,
                                h.status = pa)
                    } else
                        h.status = pa;
                if (h.status === pa)
                    if (h.gzhead.name) {
                        k = h.pending;
                        do {
                            if (h.pending === h.pending_buf_size && (h.gzhead.hcrc && h.pending > k && (a.adler = H(a.adler, h.pending_buf, h.pending - k, k)),
                                    g(a),
                                    k = h.pending,
                                    h.pending === h.pending_buf_size)) {
                                l = 1;
                                break
                            }
                            l = h.gzindex < h.gzhead.name.length ? 255 & h.gzhead.name.charCodeAt(h.gzindex++) : 0,
                                i(h, l)
                        } while (0 !== l);
                        h.gzhead.hcrc && h.pending > k && (a.adler = H(a.adler, h.pending_buf, h.pending - k, k)),
                            0 === l && (h.gzindex = 0,
                                h.status = qa)
                    } else
                        h.status = qa;
                if (h.status === qa)
                    if (h.gzhead.comment) {
                        k = h.pending;
                        do {
                            if (h.pending === h.pending_buf_size && (h.gzhead.hcrc && h.pending > k && (a.adler = H(a.adler, h.pending_buf, h.pending - k, k)),
                                    g(a),
                                    k = h.pending,
                                    h.pending === h.pending_buf_size)) {
                                l = 1;
                                break
                            }
                            l = h.gzindex < h.gzhead.comment.length ? 255 & h.gzhead.comment.charCodeAt(h.gzindex++) : 0,
                                i(h, l)
                        } while (0 !== l);
                        h.gzhead.hcrc && h.pending > k && (a.adler = H(a.adler, h.pending_buf, h.pending - k, k)),
                            0 === l && (h.status = ra)
                    } else
                        h.status = ra;
                if (h.status === ra && (h.gzhead.hcrc ? (h.pending + 2 > h.pending_buf_size && g(a),
                        h.pending + 2 <= h.pending_buf_size && (i(h, 255 & a.adler),
                            i(h, a.adler >> 8 & 255),
                            a.adler = 0,
                            h.status = sa)) : h.status = sa),
                    0 !== h.pending) {
                    if (g(a),
                        0 === a.avail_out)
                        return h.last_flush = -1,
                            O
                } else if (0 === a.avail_in && e(b) <= e(c) && b !== M)
                    return d(a, S);
                if (h.status === ta && 0 !== a.avail_in)
                    return d(a, S);
                if (0 !== a.avail_in || 0 !== h.lookahead || b !== J && h.status !== ta) {
                    var o = h.strategy === V ? r(h, b) : h.strategy === W ? q(h, b) : D[h.level].func(h, b);
                    if (o !== wa && o !== xa || (h.status = ta),
                        o === ua || o === wa)
                        return 0 === a.avail_out && (h.last_flush = -1),
                            O;
                    if (o === va && (b === K ? F._tr_align(h) : b !== N && (F._tr_stored_block(h, 0, 0, !1),
                                b === L && (f(h.head),
                                    0 === h.lookahead && (h.strstart = 0,
                                        h.block_start = 0,
                                        h.insert = 0))),
                            g(a),
                            0 === a.avail_out))
                        return h.last_flush = -1,
                            O
                }
                return b !== M ? O : h.wrap <= 0 ? P : (2 === h.wrap ? (i(h, 255 & a.adler),
                        i(h, a.adler >> 8 & 255),
                        i(h, a.adler >> 16 & 255),
                        i(h, a.adler >> 24 & 255),
                        i(h, 255 & a.total_in),
                        i(h, a.total_in >> 8 & 255),
                        i(h, a.total_in >> 16 & 255),
                        i(h, a.total_in >> 24 & 255)) : (j(h, a.adler >>> 16),
                        j(h, 65535 & a.adler)),
                    g(a),
                    h.wrap > 0 && (h.wrap = -h.wrap),
                    0 !== h.pending ? O : P)
            }

            function B(a) {
                var b;
                return a && a.state ? (b = a.state.status,
                    b !== na && b !== oa && b !== pa && b !== qa && b !== ra && b !== sa && b !== ta ? d(a, Q) : (a.state = null,
                        b === sa ? d(a, R) : O)) : Q
            }

            function C(a, b) {
                var c, d, e, g, h, i, j, k, l = b.length;
                if (!a || !a.state)
                    return Q;
                if (c = a.state,
                    g = c.wrap,
                    2 === g || 1 === g && c.status !== na || c.lookahead)
                    return Q;
                for (1 === g && (a.adler = G(a.adler, b, l, 0)),
                    c.wrap = 0,
                    l >= c.w_size && (0 === g && (f(c.head),
                            c.strstart = 0,
                            c.block_start = 0,
                            c.insert = 0),
                        k = new E.Buf8(c.w_size),
                        E.arraySet(k, b, l - c.w_size, c.w_size, 0),
                        b = k,
                        l = c.w_size),
                    h = a.avail_in,
                    i = a.next_in,
                    j = a.input,
                    a.avail_in = l,
                    a.next_in = 0,
                    a.input = b,
                    m(c); c.lookahead >= ja;) {
                    d = c.strstart,
                        e = c.lookahead - (ja - 1);
                    do
                        c.ins_h = (c.ins_h << c.hash_shift ^ c.window[d + ja - 1]) & c.hash_mask,
                        c.prev[d & c.w_mask] = c.head[c.ins_h],
                        c.head[c.ins_h] = d,
                        d++;
                    while (--e);
                    c.strstart = d,
                        c.lookahead = ja - 1,
                        m(c)
                }
                return c.strstart += c.lookahead,
                    c.block_start = c.strstart,
                    c.insert = c.lookahead,
                    c.lookahead = 0,
                    c.match_length = c.prev_length = ja - 1,
                    c.match_available = 0,
                    a.next_in = i,
                    a.input = j,
                    a.avail_in = h,
                    c.wrap = g,
                    O
            }
            var D, E = a("../utils/common"),
                F = a("./trees"),
                G = a("./adler32"),
                H = a("./crc32"),
                I = a("./messages"),
                J = 0,
                K = 1,
                L = 3,
                M = 4,
                N = 5,
                O = 0,
                P = 1,
                Q = -2,
                R = -3,
                S = -5,
                T = -1,
                U = 1,
                V = 2,
                W = 3,
                X = 4,
                Y = 0,
                Z = 2,
                $ = 8,
                _ = 9,
                aa = 15,
                ba = 8,
                ca = 29,
                da = 256,
                ea = da + 1 + ca,
                fa = 30,
                ga = 19,
                ha = 2 * ea + 1,
                ia = 15,
                ja = 3,
                ka = 258,
                la = ka + ja + 1,
                ma = 32,
                na = 42,
                oa = 69,
                pa = 73,
                qa = 91,
                ra = 103,
                sa = 113,
                ta = 666,
                ua = 1,
                va = 2,
                wa = 3,
                xa = 4,
                ya = 3;
            D = [new s(0, 0, 0, 0, n), new s(4, 4, 8, 4, o), new s(4, 5, 16, 8, o), new s(4, 6, 32, 32, o), new s(4, 4, 16, 16, p), new s(8, 16, 32, 32, p), new s(8, 16, 128, 128, p), new s(8, 32, 128, 256, p), new s(32, 128, 258, 1024, p), new s(32, 258, 258, 4096, p)],
                c.deflateInit = z,
                c.deflateInit2 = y,
                c.deflateReset = w,
                c.deflateResetKeep = v,
                c.deflateSetHeader = x,
                c.deflate = A,
                c.deflateEnd = B,
                c.deflateSetDictionary = C,
                c.deflateInfo = "pako deflate (from Nodeca project)"
        }, {
            "../utils/common": 62,
            "./adler32": 64,
            "./crc32": 66,
            "./messages": 72,
            "./trees": 73
        }],
        68: [function(a, b, c) {
            "use strict";

            function d() {
                this.text = 0,
                    this.time = 0,
                    this.xflags = 0,
                    this.os = 0,
                    this.extra = null,
                    this.extra_len = 0,
                    this.name = "",
                    this.comment = "",
                    this.hcrc = 0,
                    this.done = !1
            }
            b.exports = d
        }, {}],
        69: [function(a, b, c) {
            "use strict";
            var d = 30,
                e = 12;
            b.exports = function(a, b) {
                var c, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C;
                c = a.state,
                    f = a.next_in,
                    B = a.input,
                    g = f + (a.avail_in - 5),
                    h = a.next_out,
                    C = a.output,
                    i = h - (b - a.avail_out),
                    j = h + (a.avail_out - 257),
                    k = c.dmax,
                    l = c.wsize,
                    m = c.whave,
                    n = c.wnext,
                    o = c.window,
                    p = c.hold,
                    q = c.bits,
                    r = c.lencode,
                    s = c.distcode,
                    t = (1 << c.lenbits) - 1,
                    u = (1 << c.distbits) - 1;
                a: do {
                    q < 15 && (p += B[f++] << q,
                            q += 8,
                            p += B[f++] << q,
                            q += 8),
                        v = r[p & t];
                    b: for (;;) {
                        if (w = v >>> 24,
                            p >>>= w,
                            q -= w,
                            w = v >>> 16 & 255,
                            0 === w)
                            C[h++] = 65535 & v;
                        else {
                            if (!(16 & w)) {
                                if (0 === (64 & w)) {
                                    v = r[(65535 & v) + (p & (1 << w) - 1)];
                                    continue b
                                }
                                if (32 & w) {
                                    c.mode = e;
                                    break a
                                }
                                a.msg = "invalid literal/length code",
                                    c.mode = d;
                                break a
                            }
                            x = 65535 & v,
                                w &= 15,
                                w && (q < w && (p += B[f++] << q,
                                        q += 8),
                                    x += p & (1 << w) - 1,
                                    p >>>= w,
                                    q -= w),
                                q < 15 && (p += B[f++] << q,
                                    q += 8,
                                    p += B[f++] << q,
                                    q += 8),
                                v = s[p & u];
                            c: for (;;) {
                                if (w = v >>> 24,
                                    p >>>= w,
                                    q -= w,
                                    w = v >>> 16 & 255, !(16 & w)) {
                                    if (0 === (64 & w)) {
                                        v = s[(65535 & v) + (p & (1 << w) - 1)];
                                        continue c
                                    }
                                    a.msg = "invalid distance code",
                                        c.mode = d;
                                    break a
                                }
                                if (y = 65535 & v,
                                    w &= 15,
                                    q < w && (p += B[f++] << q,
                                        q += 8,
                                        q < w && (p += B[f++] << q,
                                            q += 8)),
                                    y += p & (1 << w) - 1,
                                    y > k) {
                                    a.msg = "invalid distance too far back",
                                        c.mode = d;
                                    break a
                                }
                                if (p >>>= w,
                                    q -= w,
                                    w = h - i,
                                    y > w) {
                                    if (w = y - w,
                                        w > m && c.sane) {
                                        a.msg = "invalid distance too far back",
                                            c.mode = d;
                                        break a
                                    }
                                    if (z = 0,
                                        A = o,
                                        0 === n) {
                                        if (z += l - w,
                                            w < x) {
                                            x -= w;
                                            do
                                                C[h++] = o[z++];
                                            while (--w);
                                            z = h - y,
                                                A = C
                                        }
                                    } else if (n < w) {
                                        if (z += l + n - w,
                                            w -= n,
                                            w < x) {
                                            x -= w;
                                            do
                                                C[h++] = o[z++];
                                            while (--w);
                                            if (z = 0,
                                                n < x) {
                                                w = n,
                                                    x -= w;
                                                do
                                                    C[h++] = o[z++];
                                                while (--w);
                                                z = h - y,
                                                    A = C
                                            }
                                        }
                                    } else if (z += n - w,
                                        w < x) {
                                        x -= w;
                                        do
                                            C[h++] = o[z++];
                                        while (--w);
                                        z = h - y,
                                            A = C
                                    }
                                    for (; x > 2;)
                                        C[h++] = A[z++],
                                        C[h++] = A[z++],
                                        C[h++] = A[z++],
                                        x -= 3;
                                    x && (C[h++] = A[z++],
                                        x > 1 && (C[h++] = A[z++]))
                                } else {
                                    z = h - y;
                                    do
                                        C[h++] = C[z++],
                                        C[h++] = C[z++],
                                        C[h++] = C[z++],
                                        x -= 3;
                                    while (x > 2);
                                    x && (C[h++] = C[z++],
                                        x > 1 && (C[h++] = C[z++]))
                                }
                                break
                            }
                        }
                        break
                    }
                } while (f < g && h < j);
                x = q >> 3,
                    f -= x,
                    q -= x << 3,
                    p &= (1 << q) - 1,
                    a.next_in = f,
                    a.next_out = h,
                    a.avail_in = f < g ? 5 + (g - f) : 5 - (f - g),
                    a.avail_out = h < j ? 257 + (j - h) : 257 - (h - j),
                    c.hold = p,
                    c.bits = q
            }
        }, {}],
        70: [function(a, b, c) {
            "use strict";

            function d(a) {
                return (a >>> 24 & 255) + (a >>> 8 & 65280) + ((65280 & a) << 8) + ((255 & a) << 24)
            }

            function e() {
                this.mode = 0,
                    this.last = !1,
                    this.wrap = 0,
                    this.havedict = !1,
                    this.flags = 0,
                    this.dmax = 0,
                    this.check = 0,
                    this.total = 0,
                    this.head = null,
                    this.wbits = 0,
                    this.wsize = 0,
                    this.whave = 0,
                    this.wnext = 0,
                    this.window = null,
                    this.hold = 0,
                    this.bits = 0,
                    this.length = 0,
                    this.offset = 0,
                    this.extra = 0,
                    this.lencode = null,
                    this.distcode = null,
                    this.lenbits = 0,
                    this.distbits = 0,
                    this.ncode = 0,
                    this.nlen = 0,
                    this.ndist = 0,
                    this.have = 0,
                    this.next = null,
                    this.lens = new s.Buf16(320),
                    this.work = new s.Buf16(288),
                    this.lendyn = null,
                    this.distdyn = null,
                    this.sane = 0,
                    this.back = 0,
                    this.was = 0
            }

            function f(a) {
                var b;
                return a && a.state ? (b = a.state,
                    a.total_in = a.total_out = b.total = 0,
                    a.msg = "",
                    b.wrap && (a.adler = 1 & b.wrap),
                    b.mode = L,
                    b.last = 0,
                    b.havedict = 0,
                    b.dmax = 32768,
                    b.head = null,
                    b.hold = 0,
                    b.bits = 0,
                    b.lencode = b.lendyn = new s.Buf32(pa),
                    b.distcode = b.distdyn = new s.Buf32(qa),
                    b.sane = 1,
                    b.back = -1,
                    D) : G
            }

            function g(a) {
                var b;
                return a && a.state ? (b = a.state,
                    b.wsize = 0,
                    b.whave = 0,
                    b.wnext = 0,
                    f(a)) : G
            }

            function h(a, b) {
                var c, d;
                return a && a.state ? (d = a.state,
                    b < 0 ? (c = 0,
                        b = -b) : (c = (b >> 4) + 1,
                        b < 48 && (b &= 15)),
                    b && (b < 8 || b > 15) ? G : (null !== d.window && d.wbits !== b && (d.window = null),
                        d.wrap = c,
                        d.wbits = b,
                        g(a))) : G
            }

            function i(a, b) {
                var c, d;
                return a ? (d = new e,
                    a.state = d,
                    d.window = null,
                    c = h(a, b),
                    c !== D && (a.state = null),
                    c) : G
            }

            function j(a) {
                return i(a, sa)
            }

            function k(a) {
                if (ta) {
                    var b;
                    for (q = new s.Buf32(512),
                        r = new s.Buf32(32),
                        b = 0; b < 144;)
                        a.lens[b++] = 8;
                    for (; b < 256;)
                        a.lens[b++] = 9;
                    for (; b < 280;)
                        a.lens[b++] = 7;
                    for (; b < 288;)
                        a.lens[b++] = 8;
                    for (w(y, a.lens, 0, 288, q, 0, a.work, {
                            bits: 9
                        }),
                        b = 0; b < 32;)
                        a.lens[b++] = 5;
                    w(z, a.lens, 0, 32, r, 0, a.work, {
                            bits: 5
                        }),
                        ta = !1
                }
                a.lencode = q,
                    a.lenbits = 9,
                    a.distcode = r,
                    a.distbits = 5
            }

            function l(a, b, c, d) {
                var e, f = a.state;
                return null === f.window && (f.wsize = 1 << f.wbits,
                        f.wnext = 0,
                        f.whave = 0,
                        f.window = new s.Buf8(f.wsize)),
                    d >= f.wsize ? (s.arraySet(f.window, b, c - f.wsize, f.wsize, 0),
                        f.wnext = 0,
                        f.whave = f.wsize) : (e = f.wsize - f.wnext,
                        e > d && (e = d),
                        s.arraySet(f.window, b, c - d, e, f.wnext),
                        d -= e,
                        d ? (s.arraySet(f.window, b, c - d, d, 0),
                            f.wnext = d,
                            f.whave = f.wsize) : (f.wnext += e,
                            f.wnext === f.wsize && (f.wnext = 0),
                            f.whave < f.wsize && (f.whave += e))),
                    0
            }

            function m(a, b) {
                var c, e, f, g, h, i, j, m, n, o, p, q, r, pa, qa, ra, sa, ta, ua, va, wa, xa, ya, za, Aa = 0,
                    Ba = new s.Buf8(4),
                    Ca = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
                if (!a || !a.state || !a.output || !a.input && 0 !== a.avail_in)
                    return G;
                c = a.state,
                    c.mode === W && (c.mode = X),
                    h = a.next_out,
                    f = a.output,
                    j = a.avail_out,
                    g = a.next_in,
                    e = a.input,
                    i = a.avail_in,
                    m = c.hold,
                    n = c.bits,
                    o = i,
                    p = j,
                    xa = D;
                a: for (;;)
                    switch (c.mode) {
                        case L:
                            if (0 === c.wrap) {
                                c.mode = X;
                                break
                            }
                            for (; n < 16;) {
                                if (0 === i)
                                    break a;
                                i--,
                                m += e[g++] << n,
                                    n += 8
                            }
                            if (2 & c.wrap && 35615 === m) {
                                c.check = 0,
                                    Ba[0] = 255 & m,
                                    Ba[1] = m >>> 8 & 255,
                                    c.check = u(c.check, Ba, 2, 0),
                                    m = 0,
                                    n = 0,
                                    c.mode = M;
                                break
                            }
                            if (c.flags = 0,
                                c.head && (c.head.done = !1), !(1 & c.wrap) || (((255 & m) << 8) + (m >> 8)) % 31) {
                                a.msg = "incorrect header check",
                                    c.mode = ma;
                                break
                            }
                            if ((15 & m) !== K) {
                                a.msg = "unknown compression method",
                                    c.mode = ma;
                                break
                            }
                            if (m >>>= 4,
                                n -= 4,
                                wa = (15 & m) + 8,
                                0 === c.wbits)
                                c.wbits = wa;
                            else if (wa > c.wbits) {
                                a.msg = "invalid window size",
                                    c.mode = ma;
                                break
                            }
                            c.dmax = 1 << wa,
                                a.adler = c.check = 1,
                                c.mode = 512 & m ? U : W,
                                m = 0,
                                n = 0;
                            break;
                        case M:
                            for (; n < 16;) {
                                if (0 === i)
                                    break a;
                                i--,
                                m += e[g++] << n,
                                    n += 8
                            }
                            if (c.flags = m,
                                (255 & c.flags) !== K) {
                                a.msg = "unknown compression method",
                                    c.mode = ma;
                                break
                            }
                            if (57344 & c.flags) {
                                a.msg = "unknown header flags set",
                                    c.mode = ma;
                                break
                            }
                            c.head && (c.head.text = m >> 8 & 1),
                                512 & c.flags && (Ba[0] = 255 & m,
                                    Ba[1] = m >>> 8 & 255,
                                    c.check = u(c.check, Ba, 2, 0)),
                                m = 0,
                                n = 0,
                                c.mode = N;
                        case N:
                            for (; n < 32;) {
                                if (0 === i)
                                    break a;
                                i--,
                                m += e[g++] << n,
                                    n += 8
                            }
                            c.head && (c.head.time = m),
                                512 & c.flags && (Ba[0] = 255 & m,
                                    Ba[1] = m >>> 8 & 255,
                                    Ba[2] = m >>> 16 & 255,
                                    Ba[3] = m >>> 24 & 255,
                                    c.check = u(c.check, Ba, 4, 0)),
                                m = 0,
                                n = 0,
                                c.mode = O;
                        case O:
                            for (; n < 16;) {
                                if (0 === i)
                                    break a;
                                i--,
                                m += e[g++] << n,
                                    n += 8
                            }
                            c.head && (c.head.xflags = 255 & m,
                                    c.head.os = m >> 8),
                                512 & c.flags && (Ba[0] = 255 & m,
                                    Ba[1] = m >>> 8 & 255,
                                    c.check = u(c.check, Ba, 2, 0)),
                                m = 0,
                                n = 0,
                                c.mode = P;
                        case P:
                            if (1024 & c.flags) {
                                for (; n < 16;) {
                                    if (0 === i)
                                        break a;
                                    i--,
                                    m += e[g++] << n,
                                        n += 8
                                }
                                c.length = m,
                                    c.head && (c.head.extra_len = m),
                                    512 & c.flags && (Ba[0] = 255 & m,
                                        Ba[1] = m >>> 8 & 255,
                                        c.check = u(c.check, Ba, 2, 0)),
                                    m = 0,
                                    n = 0
                            } else
                                c.head && (c.head.extra = null);
                            c.mode = Q;
                        case Q:
                            if (1024 & c.flags && (q = c.length,
                                    q > i && (q = i),
                                    q && (c.head && (wa = c.head.extra_len - c.length,
                                            c.head.extra || (c.head.extra = new Array(c.head.extra_len)),
                                            s.arraySet(c.head.extra, e, g, q, wa)),
                                        512 & c.flags && (c.check = u(c.check, e, q, g)),
                                        i -= q,
                                        g += q,
                                        c.length -= q),
                                    c.length))
                                break a;
                            c.length = 0,
                                c.mode = R;
                        case R:
                            if (2048 & c.flags) {
                                if (0 === i)
                                    break a;
                                q = 0;
                                do
                                    wa = e[g + q++],
                                    c.head && wa && c.length < 65536 && (c.head.name += String.fromCharCode(wa));
                                while (wa && q < i);
                                if (512 & c.flags && (c.check = u(c.check, e, q, g)),
                                    i -= q,
                                    g += q,
                                    wa)
                                    break a
                            } else
                                c.head && (c.head.name = null);
                            c.length = 0,
                                c.mode = S;
                        case S:
                            if (4096 & c.flags) {
                                if (0 === i)
                                    break a;
                                q = 0;
                                do
                                    wa = e[g + q++],
                                    c.head && wa && c.length < 65536 && (c.head.comment += String.fromCharCode(wa));
                                while (wa && q < i);
                                if (512 & c.flags && (c.check = u(c.check, e, q, g)),
                                    i -= q,
                                    g += q,
                                    wa)
                                    break a
                            } else
                                c.head && (c.head.comment = null);
                            c.mode = T;
                        case T:
                            if (512 & c.flags) {
                                for (; n < 16;) {
                                    if (0 === i)
                                        break a;
                                    i--,
                                    m += e[g++] << n,
                                        n += 8
                                }
                                if (m !== (65535 & c.check)) {
                                    a.msg = "header crc mismatch",
                                        c.mode = ma;
                                    break
                                }
                                m = 0,
                                    n = 0
                            }
                            c.head && (c.head.hcrc = c.flags >> 9 & 1,
                                    c.head.done = !0),
                                a.adler = c.check = 0,
                                c.mode = W;
                            break;
                        case U:
                            for (; n < 32;) {
                                if (0 === i)
                                    break a;
                                i--,
                                m += e[g++] << n,
                                    n += 8
                            }
                            a.adler = c.check = d(m),
                                m = 0,
                                n = 0,
                                c.mode = V;
                        case V:
                            if (0 === c.havedict)
                                return a.next_out = h,
                                    a.avail_out = j,
                                    a.next_in = g,
                                    a.avail_in = i,
                                    c.hold = m,
                                    c.bits = n,
                                    F;
                            a.adler = c.check = 1,
                                c.mode = W;
                        case W:
                            if (b === B || b === C)
                                break a;
                        case X:
                            if (c.last) {
                                m >>>= 7 & n,
                                    n -= 7 & n,
                                    c.mode = ja;
                                break
                            }
                            for (; n < 3;) {
                                if (0 === i)
                                    break a;
                                i--,
                                m += e[g++] << n,
                                    n += 8
                            }
                            switch (c.last = 1 & m,
                                m >>>= 1,
                                n -= 1,
                                3 & m) {
                                case 0:
                                    c.mode = Y;
                                    break;
                                case 1:
                                    if (k(c),
                                        c.mode = ca,
                                        b === C) {
                                        m >>>= 2,
                                            n -= 2;
                                        break a
                                    }
                                    break;
                                case 2:
                                    c.mode = _;
                                    break;
                                case 3:
                                    a.msg = "invalid block type",
                                        c.mode = ma
                            }
                            m >>>= 2,
                                n -= 2;
                            break;
                        case Y:
                            for (m >>>= 7 & n,
                                n -= 7 & n; n < 32;) {
                                if (0 === i)
                                    break a;
                                i--,
                                m += e[g++] << n,
                                    n += 8
                            }
                            if ((65535 & m) !== (m >>> 16 ^ 65535)) {
                                a.msg = "invalid stored block lengths",
                                    c.mode = ma;
                                break
                            }
                            if (c.length = 65535 & m,
                                m = 0,
                                n = 0,
                                c.mode = Z,
                                b === C)
                                break a;
                        case Z:
                            c.mode = $;
                        case $:
                            if (q = c.length) {
                                if (q > i && (q = i),
                                    q > j && (q = j),
                                    0 === q)
                                    break a;
                                s.arraySet(f, e, g, q, h),
                                    i -= q,
                                    g += q,
                                    j -= q,
                                    h += q,
                                    c.length -= q;
                                break
                            }
                            c.mode = W;
                            break;
                        case _:
                            for (; n < 14;) {
                                if (0 === i)
                                    break a;
                                i--,
                                m += e[g++] << n,
                                    n += 8
                            }
                            if (c.nlen = (31 & m) + 257,
                                m >>>= 5,
                                n -= 5,
                                c.ndist = (31 & m) + 1,
                                m >>>= 5,
                                n -= 5,
                                c.ncode = (15 & m) + 4,
                                m >>>= 4,
                                n -= 4,
                                c.nlen > 286 || c.ndist > 30) {
                                a.msg = "too many length or distance symbols",
                                    c.mode = ma;
                                break
                            }
                            c.have = 0,
                                c.mode = aa;
                        case aa:
                            for (; c.have < c.ncode;) {
                                for (; n < 3;) {
                                    if (0 === i)
                                        break a;
                                    i--,
                                    m += e[g++] << n,
                                        n += 8
                                }
                                c.lens[Ca[c.have++]] = 7 & m,
                                    m >>>= 3,
                                    n -= 3
                            }
                            for (; c.have < 19;)
                                c.lens[Ca[c.have++]] = 0;
                            if (c.lencode = c.lendyn,
                                c.lenbits = 7,
                                ya = {
                                    bits: c.lenbits
                                },
                                xa = w(x, c.lens, 0, 19, c.lencode, 0, c.work, ya),
                                c.lenbits = ya.bits,
                                xa) {
                                a.msg = "invalid code lengths set",
                                    c.mode = ma;
                                break
                            }
                            c.have = 0,
                                c.mode = ba;
                        case ba:
                            for (; c.have < c.nlen + c.ndist;) {
                                for (; Aa = c.lencode[m & (1 << c.lenbits) - 1],
                                    qa = Aa >>> 24,
                                    ra = Aa >>> 16 & 255,
                                    sa = 65535 & Aa, !(qa <= n);) {
                                    if (0 === i)
                                        break a;
                                    i--,
                                    m += e[g++] << n,
                                        n += 8
                                }
                                if (sa < 16)
                                    m >>>= qa,
                                    n -= qa,
                                    c.lens[c.have++] = sa;
                                else {
                                    if (16 === sa) {
                                        for (za = qa + 2; n < za;) {
                                            if (0 === i)
                                                break a;
                                            i--,
                                            m += e[g++] << n,
                                                n += 8
                                        }
                                        if (m >>>= qa,
                                            n -= qa,
                                            0 === c.have) {
                                            a.msg = "invalid bit length repeat",
                                                c.mode = ma;
                                            break
                                        }
                                        wa = c.lens[c.have - 1],
                                            q = 3 + (3 & m),
                                            m >>>= 2,
                                            n -= 2
                                    } else if (17 === sa) {
                                        for (za = qa + 3; n < za;) {
                                            if (0 === i)
                                                break a;
                                            i--,
                                            m += e[g++] << n,
                                                n += 8
                                        }
                                        m >>>= qa,
                                            n -= qa,
                                            wa = 0,
                                            q = 3 + (7 & m),
                                            m >>>= 3,
                                            n -= 3
                                    } else {
                                        for (za = qa + 7; n < za;) {
                                            if (0 === i)
                                                break a;
                                            i--,
                                            m += e[g++] << n,
                                                n += 8
                                        }
                                        m >>>= qa,
                                            n -= qa,
                                            wa = 0,
                                            q = 11 + (127 & m),
                                            m >>>= 7,
                                            n -= 7
                                    }
                                    if (c.have + q > c.nlen + c.ndist) {
                                        a.msg = "invalid bit length repeat",
                                            c.mode = ma;
                                        break
                                    }
                                    for (; q--;)
                                        c.lens[c.have++] = wa
                                }
                            }
                            if (c.mode === ma)
                                break;
                            if (0 === c.lens[256]) {
                                a.msg = "invalid code -- missing end-of-block",
                                    c.mode = ma;
                                break
                            }
                            if (c.lenbits = 9,
                                ya = {
                                    bits: c.lenbits
                                },
                                xa = w(y, c.lens, 0, c.nlen, c.lencode, 0, c.work, ya),
                                c.lenbits = ya.bits,
                                xa) {
                                a.msg = "invalid literal/lengths set",
                                    c.mode = ma;
                                break
                            }
                            if (c.distbits = 6,
                                c.distcode = c.distdyn,
                                ya = {
                                    bits: c.distbits
                                },
                                xa = w(z, c.lens, c.nlen, c.ndist, c.distcode, 0, c.work, ya),
                                c.distbits = ya.bits,
                                xa) {
                                a.msg = "invalid distances set",
                                    c.mode = ma;
                                break
                            }
                            if (c.mode = ca,
                                b === C)
                                break a;
                        case ca:
                            c.mode = da;
                        case da:
                            if (i >= 6 && j >= 258) {
                                a.next_out = h,
                                    a.avail_out = j,
                                    a.next_in = g,
                                    a.avail_in = i,
                                    c.hold = m,
                                    c.bits = n,
                                    v(a, p),
                                    h = a.next_out,
                                    f = a.output,
                                    j = a.avail_out,
                                    g = a.next_in,
                                    e = a.input,
                                    i = a.avail_in,
                                    m = c.hold,
                                    n = c.bits,
                                    c.mode === W && (c.back = -1);
                                break
                            }
                            for (c.back = 0; Aa = c.lencode[m & (1 << c.lenbits) - 1],
                                qa = Aa >>> 24,
                                ra = Aa >>> 16 & 255,
                                sa = 65535 & Aa, !(qa <= n);) {
                                if (0 === i)
                                    break a;
                                i--,
                                m += e[g++] << n,
                                    n += 8
                            }
                            if (ra && 0 === (240 & ra)) {
                                for (ta = qa,
                                    ua = ra,
                                    va = sa; Aa = c.lencode[va + ((m & (1 << ta + ua) - 1) >> ta)],
                                    qa = Aa >>> 24,
                                    ra = Aa >>> 16 & 255,
                                    sa = 65535 & Aa, !(ta + qa <= n);) {
                                    if (0 === i)
                                        break a;
                                    i--,
                                    m += e[g++] << n,
                                        n += 8
                                }
                                m >>>= ta,
                                    n -= ta,
                                    c.back += ta
                            }
                            if (m >>>= qa,
                                n -= qa,
                                c.back += qa,
                                c.length = sa,
                                0 === ra) {
                                c.mode = ia;
                                break
                            }
                            if (32 & ra) {
                                c.back = -1,
                                    c.mode = W;
                                break
                            }
                            if (64 & ra) {
                                a.msg = "invalid literal/length code",
                                    c.mode = ma;
                                break
                            }
                            c.extra = 15 & ra,
                                c.mode = ea;
                        case ea:
                            if (c.extra) {
                                for (za = c.extra; n < za;) {
                                    if (0 === i)
                                        break a;
                                    i--,
                                    m += e[g++] << n,
                                        n += 8
                                }
                                c.length += m & (1 << c.extra) - 1,
                                    m >>>= c.extra,
                                    n -= c.extra,
                                    c.back += c.extra
                            }
                            c.was = c.length,
                                c.mode = fa;
                        case fa:
                            for (; Aa = c.distcode[m & (1 << c.distbits) - 1],
                                qa = Aa >>> 24,
                                ra = Aa >>> 16 & 255,
                                sa = 65535 & Aa, !(qa <= n);) {
                                if (0 === i)
                                    break a;
                                i--,
                                m += e[g++] << n,
                                    n += 8
                            }
                            if (0 === (240 & ra)) {
                                for (ta = qa,
                                    ua = ra,
                                    va = sa; Aa = c.distcode[va + ((m & (1 << ta + ua) - 1) >> ta)],
                                    qa = Aa >>> 24,
                                    ra = Aa >>> 16 & 255,
                                    sa = 65535 & Aa, !(ta + qa <= n);) {
                                    if (0 === i)
                                        break a;
                                    i--,
                                    m += e[g++] << n,
                                        n += 8
                                }
                                m >>>= ta,
                                    n -= ta,
                                    c.back += ta
                            }
                            if (m >>>= qa,
                                n -= qa,
                                c.back += qa,
                                64 & ra) {
                                a.msg = "invalid distance code",
                                    c.mode = ma;
                                break
                            }
                            c.offset = sa,
                                c.extra = 15 & ra,
                                c.mode = ga;
                        case ga:
                            if (c.extra) {
                                for (za = c.extra; n < za;) {
                                    if (0 === i)
                                        break a;
                                    i--,
                                    m += e[g++] << n,
                                        n += 8
                                }
                                c.offset += m & (1 << c.extra) - 1,
                                    m >>>= c.extra,
                                    n -= c.extra,
                                    c.back += c.extra
                            }
                            if (c.offset > c.dmax) {
                                a.msg = "invalid distance too far back",
                                    c.mode = ma;
                                break
                            }
                            c.mode = ha;
                        case ha:
                            if (0 === j)
                                break a;
                            if (q = p - j,
                                c.offset > q) {
                                if (q = c.offset - q,
                                    q > c.whave && c.sane) {
                                    a.msg = "invalid distance too far back",
                                        c.mode = ma;
                                    break
                                }
                                q > c.wnext ? (q -= c.wnext,
                                        r = c.wsize - q) : r = c.wnext - q,
                                    q > c.length && (q = c.length),
                                    pa = c.window
                            } else
                                pa = f,
                                r = h - c.offset,
                                q = c.length;
                            q > j && (q = j),
                                j -= q,
                                c.length -= q;
                            do
                                f[h++] = pa[r++];
                            while (--q);
                            0 === c.length && (c.mode = da);
                            break;
                        case ia:
                            if (0 === j)
                                break a;
                            f[h++] = c.length,
                                j--,
                                c.mode = da;
                            break;
                        case ja:
                            if (c.wrap) {
                                for (; n < 32;) {
                                    if (0 === i)
                                        break a;
                                    i--,
                                    m |= e[g++] << n,
                                        n += 8
                                }
                                if (p -= j,
                                    a.total_out += p,
                                    c.total += p,
                                    p && (a.adler = c.check = c.flags ? u(c.check, f, p, h - p) : t(c.check, f, p, h - p)),
                                    p = j,
                                    (c.flags ? m : d(m)) !== c.check) {
                                    a.msg = "incorrect data check",
                                        c.mode = ma;
                                    break
                                }
                                m = 0,
                                    n = 0
                            }
                            c.mode = ka;
                        case ka:
                            if (c.wrap && c.flags) {
                                for (; n < 32;) {
                                    if (0 === i)
                                        break a;
                                    i--,
                                    m += e[g++] << n,
                                        n += 8
                                }
                                if (m !== (4294967295 & c.total)) {
                                    a.msg = "incorrect length check",
                                        c.mode = ma;
                                    break
                                }
                                m = 0,
                                    n = 0
                            }
                            c.mode = la;
                        case la:
                            xa = E;
                            break a;
                        case ma:
                            xa = H;
                            break a;
                        case na:
                            return I;
                        case oa:
                        default:
                            return G
                    }
                return a.next_out = h,
                    a.avail_out = j,
                    a.next_in = g,
                    a.avail_in = i,
                    c.hold = m,
                    c.bits = n,
                    (c.wsize || p !== a.avail_out && c.mode < ma && (c.mode < ja || b !== A)) && l(a, a.output, a.next_out, p - a.avail_out) ? (c.mode = na,
                        I) : (o -= a.avail_in,
                        p -= a.avail_out,
                        a.total_in += o,
                        a.total_out += p,
                        c.total += p,
                        c.wrap && p && (a.adler = c.check = c.flags ? u(c.check, f, p, a.next_out - p) : t(c.check, f, p, a.next_out - p)),
                        a.data_type = c.bits + (c.last ? 64 : 0) + (c.mode === W ? 128 : 0) + (c.mode === ca || c.mode === Z ? 256 : 0),
                        (0 === o && 0 === p || b === A) && xa === D && (xa = J),
                        xa)
            }

            function n(a) {
                if (!a || !a.state)
                    return G;
                var b = a.state;
                return b.window && (b.window = null),
                    a.state = null,
                    D
            }

            function o(a, b) {
                var c;
                return a && a.state ? (c = a.state,
                    0 === (2 & c.wrap) ? G : (c.head = b,
                        b.done = !1,
                        D)) : G
            }

            function p(a, b) {
                var c, d, e, f = b.length;
                return a && a.state ? (c = a.state,
                    0 !== c.wrap && c.mode !== V ? G : c.mode === V && (d = 1,
                        d = t(d, b, f, 0),
                        d !== c.check) ? H : (e = l(a, b, f, f)) ? (c.mode = na,
                        I) : (c.havedict = 1,
                        D)) : G
            }
            var q, r, s = a("../utils/common"),
                t = a("./adler32"),
                u = a("./crc32"),
                v = a("./inffast"),
                w = a("./inftrees"),
                x = 0,
                y = 1,
                z = 2,
                A = 4,
                B = 5,
                C = 6,
                D = 0,
                E = 1,
                F = 2,
                G = -2,
                H = -3,
                I = -4,
                J = -5,
                K = 8,
                L = 1,
                M = 2,
                N = 3,
                O = 4,
                P = 5,
                Q = 6,
                R = 7,
                S = 8,
                T = 9,
                U = 10,
                V = 11,
                W = 12,
                X = 13,
                Y = 14,
                Z = 15,
                $ = 16,
                _ = 17,
                aa = 18,
                ba = 19,
                ca = 20,
                da = 21,
                ea = 22,
                fa = 23,
                ga = 24,
                ha = 25,
                ia = 26,
                ja = 27,
                ka = 28,
                la = 29,
                ma = 30,
                na = 31,
                oa = 32,
                pa = 852,
                qa = 592,
                ra = 15,
                sa = ra,
                ta = !0;
            c.inflateReset = g,
                c.inflateReset2 = h,
                c.inflateResetKeep = f,
                c.inflateInit = j,
                c.inflateInit2 = i,
                c.inflate = m,
                c.inflateEnd = n,
                c.inflateGetHeader = o,
                c.inflateSetDictionary = p,
                c.inflateInfo = "pako inflate (from Nodeca project)"
        }, {
            "../utils/common": 62,
            "./adler32": 64,
            "./crc32": 66,
            "./inffast": 69,
            "./inftrees": 71
        }],
        71: [function(a, b, c) {
            "use strict";
            var d = a("../utils/common"),
                e = 15,
                f = 852,
                g = 592,
                h = 0,
                i = 1,
                j = 2,
                k = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
                l = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
                m = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
                n = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
            b.exports = function(a, b, c, o, p, q, r, s) {
                var t, u, v, w, x, y, z, A, B, C = s.bits,
                    D = 0,
                    E = 0,
                    F = 0,
                    G = 0,
                    H = 0,
                    I = 0,
                    J = 0,
                    K = 0,
                    L = 0,
                    M = 0,
                    N = null,
                    O = 0,
                    P = new d.Buf16(e + 1),
                    Q = new d.Buf16(e + 1),
                    R = null,
                    S = 0;
                for (D = 0; D <= e; D++)
                    P[D] = 0;
                for (E = 0; E < o; E++)
                    P[b[c + E]]++;
                for (H = C,
                    G = e; G >= 1 && 0 === P[G]; G--)
                ;
                if (H > G && (H = G),
                    0 === G)
                    return p[q++] = 20971520,
                        p[q++] = 20971520,
                        s.bits = 1,
                        0;
                for (F = 1; F < G && 0 === P[F]; F++)
                ;
                for (H < F && (H = F),
                    K = 1,
                    D = 1; D <= e; D++)
                    if (K <<= 1,
                        K -= P[D],
                        K < 0)
                        return -1;
                if (K > 0 && (a === h || 1 !== G))
                    return -1;
                for (Q[1] = 0,
                    D = 1; D < e; D++)
                    Q[D + 1] = Q[D] + P[D];
                for (E = 0; E < o; E++)
                    0 !== b[c + E] && (r[Q[b[c + E]]++] = E);
                if (a === h ? (N = R = r,
                        y = 19) : a === i ? (N = k,
                        O -= 257,
                        R = l,
                        S -= 257,
                        y = 256) : (N = m,
                        R = n,
                        y = -1),
                    M = 0,
                    E = 0,
                    D = F,
                    x = q,
                    I = H,
                    J = 0,
                    v = -1,
                    L = 1 << H,
                    w = L - 1,
                    a === i && L > f || a === j && L > g)
                    return 1;
                for (;;) {
                    z = D - J,
                        r[E] < y ? (A = 0,
                            B = r[E]) : r[E] > y ? (A = R[S + r[E]],
                            B = N[O + r[E]]) : (A = 96,
                            B = 0),
                        t = 1 << D - J,
                        u = 1 << I,
                        F = u;
                    do
                        u -= t,
                        p[x + (M >> J) + u] = z << 24 | A << 16 | B | 0;
                    while (0 !== u);
                    for (t = 1 << D - 1; M & t;)
                        t >>= 1;
                    if (0 !== t ? (M &= t - 1,
                            M += t) : M = 0,
                        E++,
                        0 === --P[D]) {
                        if (D === G)
                            break;
                        D = b[c + r[E]]
                    }
                    if (D > H && (M & w) !== v) {
                        for (0 === J && (J = H),
                            x += F,
                            I = D - J,
                            K = 1 << I; I + J < G && (K -= P[I + J], !(K <= 0));)
                            I++,
                            K <<= 1;
                        if (L += 1 << I,
                            a === i && L > f || a === j && L > g)
                            return 1;
                        v = M & w,
                            p[v] = H << 24 | I << 16 | x - q | 0
                    }
                }
                return 0 !== M && (p[x + M] = D - J << 24 | 64 << 16 | 0),
                    s.bits = H,
                    0
            }
        }, {
            "../utils/common": 62
        }],
        72: [function(a, b, c) {
            "use strict";
            b.exports = {
                2: "need dictionary",
                1: "stream end",
                0: "",
                "-1": "file error",
                "-2": "stream error",
                "-3": "data error",
                "-4": "insufficient memory",
                "-5": "buffer error",
                "-6": "incompatible version"
            }
        }, {}],
        73: [function(a, b, c) {
            "use strict";

            function d(a) {
                for (var b = a.length; --b >= 0;)
                    a[b] = 0
            }

            function e(a, b, c, d, e) {
                this.static_tree = a,
                    this.extra_bits = b,
                    this.extra_base = c,
                    this.elems = d,
                    this.max_length = e,
                    this.has_stree = a && a.length
            }

            function f(a, b) {
                this.dyn_tree = a,
                    this.max_code = 0,
                    this.stat_desc = b
            }

            function g(a) {
                return a < 256 ? ia[a] : ia[256 + (a >>> 7)]
            }

            function h(a, b) {
                a.pending_buf[a.pending++] = 255 & b,
                    a.pending_buf[a.pending++] = b >>> 8 & 255
            }

            function i(a, b, c) {
                a.bi_valid > X - c ? (a.bi_buf |= b << a.bi_valid & 65535,
                    h(a, a.bi_buf),
                    a.bi_buf = b >> X - a.bi_valid,
                    a.bi_valid += c - X) : (a.bi_buf |= b << a.bi_valid & 65535,
                    a.bi_valid += c)
            }

            function j(a, b, c) {
                i(a, c[2 * b], c[2 * b + 1])
            }

            function k(a, b) {
                var c = 0;
                do
                    c |= 1 & a,
                    a >>>= 1,
                    c <<= 1;
                while (--b > 0);
                return c >>> 1
            }

            function l(a) {
                16 === a.bi_valid ? (h(a, a.bi_buf),
                    a.bi_buf = 0,
                    a.bi_valid = 0) : a.bi_valid >= 8 && (a.pending_buf[a.pending++] = 255 & a.bi_buf,
                    a.bi_buf >>= 8,
                    a.bi_valid -= 8)
            }

            function m(a, b) {
                var c, d, e, f, g, h, i = b.dyn_tree,
                    j = b.max_code,
                    k = b.stat_desc.static_tree,
                    l = b.stat_desc.has_stree,
                    m = b.stat_desc.extra_bits,
                    n = b.stat_desc.extra_base,
                    o = b.stat_desc.max_length,
                    p = 0;
                for (f = 0; f <= W; f++)
                    a.bl_count[f] = 0;
                for (i[2 * a.heap[a.heap_max] + 1] = 0,
                    c = a.heap_max + 1; c < V; c++)
                    d = a.heap[c],
                    f = i[2 * i[2 * d + 1] + 1] + 1,
                    f > o && (f = o,
                        p++),
                    i[2 * d + 1] = f,
                    d > j || (a.bl_count[f]++,
                        g = 0,
                        d >= n && (g = m[d - n]),
                        h = i[2 * d],
                        a.opt_len += h * (f + g),
                        l && (a.static_len += h * (k[2 * d + 1] + g)));
                if (0 !== p) {
                    do {
                        for (f = o - 1; 0 === a.bl_count[f];)
                            f--;
                        a.bl_count[f]--,
                            a.bl_count[f + 1] += 2,
                            a.bl_count[o]--,
                            p -= 2
                    } while (p > 0);
                    for (f = o; 0 !== f; f--)
                        for (d = a.bl_count[f]; 0 !== d;)
                            e = a.heap[--c],
                            e > j || (i[2 * e + 1] !== f && (a.opt_len += (f - i[2 * e + 1]) * i[2 * e],
                                    i[2 * e + 1] = f),
                                d--)
                }
            }

            function n(a, b, c) {
                var d, e, f = new Array(W + 1),
                    g = 0;
                for (d = 1; d <= W; d++)
                    f[d] = g = g + c[d - 1] << 1;
                for (e = 0; e <= b; e++) {
                    var h = a[2 * e + 1];
                    0 !== h && (a[2 * e] = k(f[h]++, h))
                }
            }

            function o() {
                var a, b, c, d, f, g = new Array(W + 1);
                for (c = 0,
                    d = 0; d < Q - 1; d++)
                    for (ka[d] = c,
                        a = 0; a < 1 << ba[d]; a++)
                        ja[c++] = d;
                for (ja[c - 1] = d,
                    f = 0,
                    d = 0; d < 16; d++)
                    for (la[d] = f,
                        a = 0; a < 1 << ca[d]; a++)
                        ia[f++] = d;
                for (f >>= 7; d < T; d++)
                    for (la[d] = f << 7,
                        a = 0; a < 1 << ca[d] - 7; a++)
                        ia[256 + f++] = d;
                for (b = 0; b <= W; b++)
                    g[b] = 0;
                for (a = 0; a <= 143;)
                    ga[2 * a + 1] = 8,
                    a++,
                    g[8]++;
                for (; a <= 255;)
                    ga[2 * a + 1] = 9,
                    a++,
                    g[9]++;
                for (; a <= 279;)
                    ga[2 * a + 1] = 7,
                    a++,
                    g[7]++;
                for (; a <= 287;)
                    ga[2 * a + 1] = 8,
                    a++,
                    g[8]++;
                for (n(ga, S + 1, g),
                    a = 0; a < T; a++)
                    ha[2 * a + 1] = 5,
                    ha[2 * a] = k(a, 5);
                ma = new e(ga, ba, R + 1, S, W),
                    na = new e(ha, ca, 0, T, W),
                    oa = new e(new Array(0), da, 0, U, Y)
            }

            function p(a) {
                var b;
                for (b = 0; b < S; b++)
                    a.dyn_ltree[2 * b] = 0;
                for (b = 0; b < T; b++)
                    a.dyn_dtree[2 * b] = 0;
                for (b = 0; b < U; b++)
                    a.bl_tree[2 * b] = 0;
                a.dyn_ltree[2 * Z] = 1,
                    a.opt_len = a.static_len = 0,
                    a.last_lit = a.matches = 0
            }

            function q(a) {
                a.bi_valid > 8 ? h(a, a.bi_buf) : a.bi_valid > 0 && (a.pending_buf[a.pending++] = a.bi_buf),
                    a.bi_buf = 0,
                    a.bi_valid = 0
            }

            function r(a, b, c, d) {
                q(a),
                    d && (h(a, c),
                        h(a, ~c)),
                    G.arraySet(a.pending_buf, a.window, b, c, a.pending),
                    a.pending += c
            }

            function s(a, b, c, d) {
                var e = 2 * b,
                    f = 2 * c;
                return a[e] < a[f] || a[e] === a[f] && d[b] <= d[c]
            }

            function t(a, b, c) {
                for (var d = a.heap[c], e = c << 1; e <= a.heap_len && (e < a.heap_len && s(b, a.heap[e + 1], a.heap[e], a.depth) && e++, !s(b, d, a.heap[e], a.depth));)
                    a.heap[c] = a.heap[e],
                    c = e,
                    e <<= 1;
                a.heap[c] = d
            }

            function u(a, b, c) {
                var d, e, f, h, k = 0;
                if (0 !== a.last_lit)
                    do
                        d = a.pending_buf[a.d_buf + 2 * k] << 8 | a.pending_buf[a.d_buf + 2 * k + 1],
                        e = a.pending_buf[a.l_buf + k],
                        k++,
                        0 === d ? j(a, e, b) : (f = ja[e],
                            j(a, f + R + 1, b),
                            h = ba[f],
                            0 !== h && (e -= ka[f],
                                i(a, e, h)),
                            d--,
                            f = g(d),
                            j(a, f, c),
                            h = ca[f],
                            0 !== h && (d -= la[f],
                                i(a, d, h)));
                    while (k < a.last_lit);
                j(a, Z, b)
            }

            function v(a, b) {
                var c, d, e, f = b.dyn_tree,
                    g = b.stat_desc.static_tree,
                    h = b.stat_desc.has_stree,
                    i = b.stat_desc.elems,
                    j = -1;
                for (a.heap_len = 0,
                    a.heap_max = V,
                    c = 0; c < i; c++)
                    0 !== f[2 * c] ? (a.heap[++a.heap_len] = j = c,
                        a.depth[c] = 0) : f[2 * c + 1] = 0;
                for (; a.heap_len < 2;)
                    e = a.heap[++a.heap_len] = j < 2 ? ++j : 0,
                    f[2 * e] = 1,
                    a.depth[e] = 0,
                    a.opt_len--,
                    h && (a.static_len -= g[2 * e + 1]);
                for (b.max_code = j,
                    c = a.heap_len >> 1; c >= 1; c--)
                    t(a, f, c);
                e = i;
                do
                    c = a.heap[1],
                    a.heap[1] = a.heap[a.heap_len--],
                    t(a, f, 1),
                    d = a.heap[1],
                    a.heap[--a.heap_max] = c,
                    a.heap[--a.heap_max] = d,
                    f[2 * e] = f[2 * c] + f[2 * d],
                    a.depth[e] = (a.depth[c] >= a.depth[d] ? a.depth[c] : a.depth[d]) + 1,
                    f[2 * c + 1] = f[2 * d + 1] = e,
                    a.heap[1] = e++,
                    t(a, f, 1);
                while (a.heap_len >= 2);
                a.heap[--a.heap_max] = a.heap[1],
                    m(a, b),
                    n(f, j, a.bl_count)
            }

            function w(a, b, c) {
                var d, e, f = -1,
                    g = b[1],
                    h = 0,
                    i = 7,
                    j = 4;
                for (0 === g && (i = 138,
                        j = 3),
                    b[2 * (c + 1) + 1] = 65535,
                    d = 0; d <= c; d++)
                    e = g,
                    g = b[2 * (d + 1) + 1],
                    ++h < i && e === g || (h < j ? a.bl_tree[2 * e] += h : 0 !== e ? (e !== f && a.bl_tree[2 * e]++,
                            a.bl_tree[2 * $]++) : h <= 10 ? a.bl_tree[2 * _]++ : a.bl_tree[2 * aa]++,
                        h = 0,
                        f = e,
                        0 === g ? (i = 138,
                            j = 3) : e === g ? (i = 6,
                            j = 3) : (i = 7,
                            j = 4))
            }

            function x(a, b, c) {
                var d, e, f = -1,
                    g = b[1],
                    h = 0,
                    k = 7,
                    l = 4;
                for (0 === g && (k = 138,
                        l = 3),
                    d = 0; d <= c; d++)
                    if (e = g,
                        g = b[2 * (d + 1) + 1], !(++h < k && e === g)) {
                        if (h < l) {
                            do
                                j(a, e, a.bl_tree);
                            while (0 !== --h)
                        } else
                            0 !== e ? (e !== f && (j(a, e, a.bl_tree),
                                    h--),
                                j(a, $, a.bl_tree),
                                i(a, h - 3, 2)) : h <= 10 ? (j(a, _, a.bl_tree),
                                i(a, h - 3, 3)) : (j(a, aa, a.bl_tree),
                                i(a, h - 11, 7));
                        h = 0,
                            f = e,
                            0 === g ? (k = 138,
                                l = 3) : e === g ? (k = 6,
                                l = 3) : (k = 7,
                                l = 4)
                    }
            }

            function y(a) {
                var b;
                for (w(a, a.dyn_ltree, a.l_desc.max_code),
                    w(a, a.dyn_dtree, a.d_desc.max_code),
                    v(a, a.bl_desc),
                    b = U - 1; b >= 3 && 0 === a.bl_tree[2 * ea[b] + 1]; b--)
                ;
                return a.opt_len += 3 * (b + 1) + 5 + 5 + 4,
                    b
            }

            function z(a, b, c, d) {
                var e;
                for (i(a, b - 257, 5),
                    i(a, c - 1, 5),
                    i(a, d - 4, 4),
                    e = 0; e < d; e++)
                    i(a, a.bl_tree[2 * ea[e] + 1], 3);
                x(a, a.dyn_ltree, b - 1),
                    x(a, a.dyn_dtree, c - 1)
            }

            function A(a) {
                var b, c = 4093624447;
                for (b = 0; b <= 31; b++,
                    c >>>= 1)
                    if (1 & c && 0 !== a.dyn_ltree[2 * b])
                        return I;
                if (0 !== a.dyn_ltree[18] || 0 !== a.dyn_ltree[20] || 0 !== a.dyn_ltree[26])
                    return J;
                for (b = 32; b < R; b++)
                    if (0 !== a.dyn_ltree[2 * b])
                        return J;
                return I
            }

            function B(a) {
                pa || (o(),
                        pa = !0),
                    a.l_desc = new f(a.dyn_ltree, ma),
                    a.d_desc = new f(a.dyn_dtree, na),
                    a.bl_desc = new f(a.bl_tree, oa),
                    a.bi_buf = 0,
                    a.bi_valid = 0,
                    p(a)
            }

            function C(a, b, c, d) {
                i(a, (L << 1) + (d ? 1 : 0), 3),
                    r(a, b, c, !0)
            }

            function D(a) {
                i(a, M << 1, 3),
                    j(a, Z, ga),
                    l(a)
            }

            function E(a, b, c, d) {
                var e, f, g = 0;
                a.level > 0 ? (a.strm.data_type === K && (a.strm.data_type = A(a)),
                        v(a, a.l_desc),
                        v(a, a.d_desc),
                        g = y(a),
                        e = a.opt_len + 3 + 7 >>> 3,
                        f = a.static_len + 3 + 7 >>> 3,
                        f <= e && (e = f)) : e = f = c + 5,
                    c + 4 <= e && b !== -1 ? C(a, b, c, d) : a.strategy === H || f === e ? (i(a, (M << 1) + (d ? 1 : 0), 3),
                        u(a, ga, ha)) : (i(a, (N << 1) + (d ? 1 : 0), 3),
                        z(a, a.l_desc.max_code + 1, a.d_desc.max_code + 1, g + 1),
                        u(a, a.dyn_ltree, a.dyn_dtree)),
                    p(a),
                    d && q(a)
            }

            function F(a, b, c) {
                return a.pending_buf[a.d_buf + 2 * a.last_lit] = b >>> 8 & 255,
                    a.pending_buf[a.d_buf + 2 * a.last_lit + 1] = 255 & b,
                    a.pending_buf[a.l_buf + a.last_lit] = 255 & c,
                    a.last_lit++,
                    0 === b ? a.dyn_ltree[2 * c]++ : (a.matches++,
                        b--,
                        a.dyn_ltree[2 * (ja[c] + R + 1)]++,
                        a.dyn_dtree[2 * g(b)]++),
                    a.last_lit === a.lit_bufsize - 1
            }
            var G = a("../utils/common"),
                H = 4,
                I = 0,
                J = 1,
                K = 2,
                L = 0,
                M = 1,
                N = 2,
                O = 3,
                P = 258,
                Q = 29,
                R = 256,
                S = R + 1 + Q,
                T = 30,
                U = 19,
                V = 2 * S + 1,
                W = 15,
                X = 16,
                Y = 7,
                Z = 256,
                $ = 16,
                _ = 17,
                aa = 18,
                ba = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
                ca = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
                da = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
                ea = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
                fa = 512,
                ga = new Array(2 * (S + 2));
            d(ga);
            var ha = new Array(2 * T);
            d(ha);
            var ia = new Array(fa);
            d(ia);
            var ja = new Array(P - O + 1);
            d(ja);
            var ka = new Array(Q);
            d(ka);
            var la = new Array(T);
            d(la);
            var ma, na, oa, pa = !1;
            c._tr_init = B,
                c._tr_stored_block = C,
                c._tr_flush_block = E,
                c._tr_tally = F,
                c._tr_align = D
        }, {
            "../utils/common": 62
        }],
        74: [function(a, b, c) {
            "use strict";

            function d() {
                this.input = null,
                    this.next_in = 0,
                    this.avail_in = 0,
                    this.total_in = 0,
                    this.output = null,
                    this.next_out = 0,
                    this.avail_out = 0,
                    this.total_out = 0,
                    this.msg = "",
                    this.state = null,
                    this.data_type = 2,
                    this.adler = 0
            }
            b.exports = d
        }, {}]
    }, {}, [10])(10)
});
! function(t, r) {
    t.tracking = t.tracking || {},
        tracking.inherits = function(t, r) {
            function n() {}
            n.prototype = r.prototype,
                t.superClass_ = r.prototype,
                t.prototype = new n,
                t.prototype.constructor = t,
                t.base = function(t, n) {
                    var e = Array.prototype.slice.call(arguments, 2);
                    return r.prototype[n].apply(t, e)
                }
        },
        tracking.initUserMedia_ = function(r, n) {
            t.navigator.getUserMedia({
                video: !0,
                audio: !(!n || !n.audio)
            }, function(n) {
                try {
                    r.src = t.URL.createObjectURL(n)
                } catch (e) {
                    r.src = n
                }
            }, function() {
                throw Error("Cannot capture user camera.")
            })
        },
        tracking.isNode = function(t) {
            return t.nodeType || this.isWindow(t)
        },
        tracking.isWindow = function(t) {
            return !!(t && t.alert && t.document)
        },
        tracking.one = function(t, r) {
            return this.isNode(t) ? t : (r || document).querySelector(t)
        },
        tracking.track = function(t, r, n) {
            if (t = tracking.one(t), !t)
                throw new Error("Element not found, try a different element or selector.");
            if (!r)
                throw new Error("Tracker not specified, try `tracking.track(element, new tracking.FaceTracker())`.");
            switch (t.nodeName.toLowerCase()) {
                case "canvas":
                    return this.trackCanvas_(t, r, n);
                case "img":
                    return this.trackImg_(t, r, n);
                case "video":
                    return n && n.camera && this.initUserMedia_(t, n),
                        this.trackVideo_(t, r, n);
                default:
                    throw new Error("Element not supported, try in a canvas, img, or video.")
            }
        },
        tracking.trackCanvas_ = function(t, r) {
            var n = this,
                e = new tracking.TrackerTask(r);
            return e.on("run", function() {
                    n.trackCanvasInternal_(t, r)
                }),
                e.run()
        },
        tracking.trackCanvasInternal_ = function(t, r) {
            var n = t.width,
                e = t.height,
                i = t.getContext("2d"),
                a = i.getImageData(0, 0, n, e);
            r.track(a.data, n, e)
        },
        tracking.trackImg_ = function(t, r) {
            var n = t.width,
                e = t.height,
                i = document.createElement("canvas");
            i.width = n,
                i.height = e;
            var a = new tracking.TrackerTask(r);
            return a.on("run", function() {
                    tracking.Canvas.loadImage(i, t.src, 0, 0, n, e, function() {
                        tracking.trackCanvasInternal_(i, r)
                    })
                }),
                a.run()
        },
        tracking.trackVideo_ = function(r, n) {
            var e, i, a = document.createElement("canvas"),
                o = a.getContext("2d"),
                c = function() {
                    e = r.offsetWidth,
                        i = r.offsetHeight,
                        a.width = e,
                        a.height = i
                };
            c(),
                r.addEventListener("resize", c);
            var s, g = function() {
                    s = t.requestAnimationFrame(function() {
                        if (r.readyState === r.HAVE_ENOUGH_DATA) {
                            try {
                                o.drawImage(r, 0, 0, e, i)
                            } catch (t) {}
                            tracking.trackCanvasInternal_(a, n)
                        }
                        g()
                    })
                },
                h = new tracking.TrackerTask(n);
            return h.on("stop", function() {
                    t.cancelAnimationFrame(s)
                }),
                h.on("run", function() {
                    g()
                }),
                h.run()
        },
        t.URL || (t.URL = t.URL || t.webkitURL || t.msURL || t.oURL),
        navigator.getUserMedia || (navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
}(window),
function() {
    tracking.EventEmitter = function() {},
        tracking.EventEmitter.prototype.events_ = null,
        tracking.EventEmitter.prototype.addListener = function(t, r) {
            if ("function" != typeof r)
                throw new TypeError("Listener must be a function");
            return this.events_ || (this.events_ = {}),
                this.emit("newListener", t, r),
                this.events_[t] || (this.events_[t] = []),
                this.events_[t].push(r),
                this
        },
        tracking.EventEmitter.prototype.listeners = function(t) {
            return this.events_ && this.events_[t]
        },
        tracking.EventEmitter.prototype.emit = function(t) {
            var r = this.listeners(t);
            if (r) {
                for (var n = Array.prototype.slice.call(arguments, 1), e = 0; e < r.length; e++)
                    r[e] && r[e].apply(this, n);
                return !0
            }
            return !1
        },
        tracking.EventEmitter.prototype.on = tracking.EventEmitter.prototype.addListener,
        tracking.EventEmitter.prototype.once = function(t, r) {
            var n = this;
            n.on(t, function e() {
                n.removeListener(t, e),
                    r.apply(this, arguments)
            })
        },
        tracking.EventEmitter.prototype.removeAllListeners = function(t) {
            return this.events_ ? (t ? delete this.events_[t] : delete this.events_,
                this) : this
        },
        tracking.EventEmitter.prototype.removeListener = function(t, r) {
            if ("function" != typeof r)
                throw new TypeError("Listener must be a function");
            if (!this.events_)
                return this;
            var n = this.listeners(t);
            if (Array.isArray(n)) {
                var e = n.indexOf(r);
                if (0 > e)
                    return this;
                n.splice(e, 1)
            }
            return this
        },
        tracking.EventEmitter.prototype.setMaxListeners = function() {
            throw new Error("Not implemented")
        }
}(),
function() {
    tracking.Canvas = {},
        tracking.Canvas.loadImage = function(t, r, n, e, i, a, o) {
            var c = this,
                s = new window.Image;
            s.crossOrigin = "*",
                s.onload = function() {
                    var r = t.getContext("2d");
                    t.width = i,
                        t.height = a,
                        r.drawImage(s, n, e, i, a),
                        o && o.call(c),
                        s = null
                },
                s.src = r
        }
}(),
function() {
    tracking.DisjointSet = function(t) {
            if (void 0 === t)
                throw new Error("DisjointSet length not specified.");
            this.length = t,
                this.parent = new Uint32Array(t);
            for (var r = 0; t > r; r++)
                this.parent[r] = r
        },
        tracking.DisjointSet.prototype.length = null,
        tracking.DisjointSet.prototype.parent = null,
        tracking.DisjointSet.prototype.find = function(t) {
            return this.parent[t] === t ? t : this.parent[t] = this.find(this.parent[t])
        },
        tracking.DisjointSet.prototype.union = function(t, r) {
            var n = this.find(t),
                e = this.find(r);
            this.parent[n] = e
        }
}(),
function() {
    tracking.Image = {},
        tracking.Image.blur = function(t, r, n, e) {
            if (e = Math.abs(e),
                1 >= e)
                throw new Error("Diameter should be greater than 1.");
            for (var i = e / 2, a = Math.ceil(e) + (1 - Math.ceil(e) % 2), o = new Float32Array(a), c = (i + .5) / 3, s = c * c, g = 1 / Math.sqrt(2 * Math.PI * s), h = -1 / (2 * c * c), k = 0, u = Math.floor(a / 2), f = 0; a > f; f++) {
                var l = f - u,
                    p = g * Math.exp(l * l * h);
                o[f] = p,
                    k += p
            }
            for (var v = 0; v < o.length; v++)
                o[v] /= k;
            return this.separableConvolve(t, r, n, o, o, !1)
        },
        tracking.Image.computeIntegralImage = function(t, r, n, e, i, a, o) {
            if (arguments.length < 4)
                throw new Error("You should specify at least one output array in the order: sum, square, tilted, sobel.");
            var c;
            o && (c = tracking.Image.sobel(t, r, n));
            for (var s = 0; n > s; s++)
                for (var g = 0; r > g; g++) {
                    var h = s * r * 4 + 4 * g,
                        k = ~~(.299 * t[h] + .587 * t[h + 1] + .114 * t[h + 2]);
                    if (e && this.computePixelValueSAT_(e, r, s, g, k),
                        i && this.computePixelValueSAT_(i, r, s, g, k * k),
                        a) {
                        var u = h - 4 * r,
                            f = ~~(.299 * t[u] + .587 * t[u + 1] + .114 * t[u + 2]);
                        this.computePixelValueRSAT_(a, r, s, g, k, f || 0)
                    }
                    o && this.computePixelValueSAT_(o, r, s, g, c[h])
                }
        },
        tracking.Image.computePixelValueRSAT_ = function(t, r, n, e, i, a) {
            var o = n * r + e;
            t[o] = (t[o - r - 1] || 0) + (t[o - r + 1] || 0) - (t[o - r - r] || 0) + i + a
        },
        tracking.Image.computePixelValueSAT_ = function(t, r, n, e, i) {
            var a = n * r + e;
            t[a] = (t[a - r] || 0) + (t[a - 1] || 0) + i - (t[a - r - 1] || 0)
        },
        tracking.Image.grayscale = function(t, r, n, e) {
            for (var i = new Uint8ClampedArray(e ? t.length : t.length >> 2), a = 0, o = 0, c = 0; n > c; c++)
                for (var s = 0; r > s; s++) {
                    var g = .299 * t[o] + .587 * t[o + 1] + .114 * t[o + 2];
                    i[a++] = g,
                        e && (i[a++] = g,
                            i[a++] = g,
                            i[a++] = t[o + 3]),
                        o += 4
                }
            return i
        },
        tracking.Image.horizontalConvolve = function(t, r, n, e, i) {
            for (var a = e.length, o = Math.floor(a / 2), c = new Float32Array(r * n * 4), s = i ? 1 : 0, g = 0; n > g; g++)
                for (var h = 0; r > h; h++) {
                    for (var k = g, u = h, f = 4 * (g * r + h), l = 0, p = 0, v = 0, m = 0, y = 0; a > y; y++) {
                        var d = k,
                            w = Math.min(r - 1, Math.max(0, u + y - o)),
                            T = 4 * (d * r + w),
                            C = e[y];
                        l += t[T] * C,
                            p += t[T + 1] * C,
                            v += t[T + 2] * C,
                            m += t[T + 3] * C
                    }
                    c[f] = l,
                        c[f + 1] = p,
                        c[f + 2] = v,
                        c[f + 3] = m + s * (255 - m)
                }
            return c
        },
        tracking.Image.verticalConvolve = function(t, r, n, e, i) {
            for (var a = e.length, o = Math.floor(a / 2), c = new Float32Array(r * n * 4), s = i ? 1 : 0, g = 0; n > g; g++)
                for (var h = 0; r > h; h++) {
                    for (var k = g, u = h, f = 4 * (g * r + h), l = 0, p = 0, v = 0, m = 0, y = 0; a > y; y++) {
                        var d = Math.min(n - 1, Math.max(0, k + y - o)),
                            w = u,
                            T = 4 * (d * r + w),
                            C = e[y];
                        l += t[T] * C,
                            p += t[T + 1] * C,
                            v += t[T + 2] * C,
                            m += t[T + 3] * C
                    }
                    c[f] = l,
                        c[f + 1] = p,
                        c[f + 2] = v,
                        c[f + 3] = m + s * (255 - m)
                }
            return c
        },
        tracking.Image.separableConvolve = function(t, r, n, e, i, a) {
            var o = this.verticalConvolve(t, r, n, i, a);
            return this.horizontalConvolve(o, r, n, e, a)
        },
        tracking.Image.sobel = function(t, r, n) {
            t = this.grayscale(t, r, n, !0);
            for (var e = new Float32Array(r * n * 4), i = new Float32Array([-1, 0, 1]), a = new Float32Array([1, 2, 1]), o = this.separableConvolve(t, r, n, i, a), c = this.separableConvolve(t, r, n, a, i), s = 0; s < e.length; s += 4) {
                var g = o[s],
                    h = c[s],
                    k = Math.sqrt(h * h + g * g);
                e[s] = k,
                    e[s + 1] = k,
                    e[s + 2] = k,
                    e[s + 3] = 255
            }
            return e
        }
}(),
function() {
    tracking.ViolaJones = {},
        tracking.ViolaJones.REGIONS_OVERLAP = .5,
        tracking.ViolaJones.classifiers = {},
        tracking.ViolaJones.detect = function(t, r, n, e, i, a, o, c) {
            var s, g = 0,
                h = [],
                k = new Int32Array(r * n),
                u = new Int32Array(r * n),
                f = new Int32Array(r * n);
            o > 0 && (s = new Int32Array(r * n)),
                tracking.Image.computeIntegralImage(t, r, n, k, u, f, s);
            for (var l = c[0], p = c[1], v = e * i, m = v * l | 0, y = v * p | 0; r > m && n > y;) {
                for (var d = v * a + .5 | 0, w = 0; n - y > w; w += d)
                    for (var T = 0; r - m > T; T += d)
                        o > 0 && this.isTriviallyExcluded(o, s, w, T, r, m, y) || this.evalStages_(c, k, u, f, w, T, r, m, y, v) && (h[g++] = {
                            width: m,
                            height: y,
                            x: T,
                            y: w
                        });
                v *= i,
                    m = v * l | 0,
                    y = v * p | 0
            }
            return this.mergeRectangles_(h)
        },
        tracking.ViolaJones.isTriviallyExcluded = function(t, r, n, e, i, a, o) {
            var c = n * i + e,
                s = c + a,
                g = c + o * i,
                h = g + a,
                k = (r[c] - r[s] - r[g] + r[h]) / (a * o * 255);
            return t > k ? !0 : !1
        },
        tracking.ViolaJones.evalStages_ = function(t, r, n, e, i, a, o, c, s, g) {
            var h = 1 / (c * s),
                k = i * o + a,
                u = k + c,
                f = k + s * o,
                l = f + c,
                p = (r[k] - r[u] - r[f] + r[l]) * h,
                v = (n[k] - n[u] - n[f] + n[l]) * h - p * p,
                m = 1;
            v > 0 && (m = Math.sqrt(v));
            for (var y = t.length, d = 2; y > d;) {
                for (var w = 0, T = t[d++], C = t[d++]; C--;) {
                    for (var _ = 0, E = t[d++], M = t[d++], x = 0; M > x; x++) {
                        var I, b, O, A, S = a + t[d++] * g + .5 | 0,
                            D = i + t[d++] * g + .5 | 0,
                            R = t[d++] * g + .5 | 0,
                            j = t[d++] * g + .5 | 0,
                            F = t[d++];
                        E ? (I = S - j + R + (D + R + j - 1) * o,
                            b = S + (D - 1) * o,
                            O = S - j + (D + j - 1) * o,
                            A = S + R + (D + R - 1) * o,
                            _ += (e[I] + e[b] - e[O] - e[A]) * F) : (I = D * o + S,
                            b = I + R,
                            O = I + j * o,
                            A = O + R,
                            _ += (r[I] - r[b] - r[O] + r[A]) * F)
                    }
                    var L = t[d++],
                        V = t[d++],
                        U = t[d++];
                    w += L * m > _ * h ? V : U
                }
                if (T > w)
                    return !1
            }
            return !0
        },
        tracking.ViolaJones.mergeRectangles_ = function(t) {
            for (var r = new tracking.DisjointSet(t.length), n = 0; n < t.length; n++)
                for (var e = t[n], i = 0; i < t.length; i++) {
                    var a = t[i];
                    if (tracking.Math.intersectRect(e.x, e.y, e.x + e.width, e.y + e.height, a.x, a.y, a.x + a.width, a.y + a.height)) {
                        var o = Math.max(e.x, a.x),
                            c = Math.max(e.y, a.y),
                            s = Math.min(e.x + e.width, a.x + a.width),
                            g = Math.min(e.y + e.height, a.y + a.height),
                            h = (o - s) * (c - g),
                            k = e.width * e.height,
                            u = a.width * a.height;
                        h / (k * (k / u)) >= this.REGIONS_OVERLAP && h / (u * (k / u)) >= this.REGIONS_OVERLAP && r.union(n, i)
                    }
                }
            for (var f = {}, l = 0; l < r.length; l++) {
                var p = r.find(l);
                f[p] ? (f[p].total++,
                    f[p].width += t[l].width,
                    f[p].height += t[l].height,
                    f[p].x += t[l].x,
                    f[p].y += t[l].y) : f[p] = {
                    total: 1,
                    width: t[l].width,
                    height: t[l].height,
                    x: t[l].x,
                    y: t[l].y
                }
            }
            var v = [];
            return Object.keys(f).forEach(function(t) {
                    var r = f[t];
                    v.push({
                        total: r.total,
                        width: r.width / r.total + .5 | 0,
                        height: r.height / r.total + .5 | 0,
                        x: r.x / r.total + .5 | 0,
                        y: r.y / r.total + .5 | 0
                    })
                }),
                v
        }
}(),
function() {
    tracking.Brief = {},
        tracking.Brief.N = 512,
        tracking.Brief.randomImageOffsets_ = {},
        tracking.Brief.randomWindowOffsets_ = null,
        tracking.Brief.getDescriptors = function(t, r, n) {
            for (var e = new Int32Array((n.length >> 1) * (this.N >> 5)), i = 0, a = this.getRandomOffsets_(r), o = 0, c = 0; c < n.length; c += 2)
                for (var s = r * n[c + 1] + n[c], g = 0, h = 0, k = this.N; k > h; h++)
                    t[a[g++] + s] < t[a[g++] + s] && (i |= 1 << (31 & h)),
                    h + 1 & 31 || (e[o++] = i,
                        i = 0);
            return e
        },
        tracking.Brief.match = function(t, r, n, e) {
            for (var i = t.length >> 1, a = n.length >> 1, o = new Array(i), c = 0; i > c; c++) {
                for (var s = 1 / 0, g = 0, h = 0; a > h; h++) {
                    for (var k = 0, u = 0, f = this.N >> 5; f > u; u++)
                        k += tracking.Math.hammingWeight(r[c * f + u] ^ e[h * f + u]);
                    s > k && (s = k,
                        g = h)
                }
                o[c] = {
                    index1: c,
                    index2: g,
                    keypoint1: [t[2 * c], t[2 * c + 1]],
                    keypoint2: [n[2 * g], n[2 * g + 1]],
                    confidence: 1 - s / this.N
                }
            }
            return o
        },
        tracking.Brief.reciprocalMatch = function(t, r, n, e) {
            var i = [];
            if (0 === t.length || 0 === n.length)
                return i;
            for (var a = tracking.Brief.match(t, r, n, e), o = tracking.Brief.match(n, e, t, r), c = 0; c < a.length; c++)
                o[a[c].index2].index2 === c && i.push(a[c]);
            return i
        },
        tracking.Brief.getRandomOffsets_ = function(t) {
            if (!this.randomWindowOffsets_) {
                for (var r = 0, n = new Int32Array(4 * this.N), e = 0; e < this.N; e++)
                    n[r++] = Math.round(tracking.Math.uniformRandom(-15, 16)),
                    n[r++] = Math.round(tracking.Math.uniformRandom(-15, 16)),
                    n[r++] = Math.round(tracking.Math.uniformRandom(-15, 16)),
                    n[r++] = Math.round(tracking.Math.uniformRandom(-15, 16));
                this.randomWindowOffsets_ = n
            }
            if (!this.randomImageOffsets_[t]) {
                for (var i = 0, a = new Int32Array(2 * this.N), o = 0; o < this.N; o++)
                    a[i++] = this.randomWindowOffsets_[4 * o] * t + this.randomWindowOffsets_[4 * o + 1],
                    a[i++] = this.randomWindowOffsets_[4 * o + 2] * t + this.randomWindowOffsets_[4 * o + 3];
                this.randomImageOffsets_[t] = a
            }
            return this.randomImageOffsets_[t]
        }
}(),
function() {
    tracking.Fast = {},
        tracking.Fast.THRESHOLD = 40,
        tracking.Fast.circles_ = {},
        tracking.Fast.findCorners = function(t, r, n, e) {
            var i = this.getCircleOffsets_(r),
                a = new Int32Array(16),
                o = [];
            void 0 === e && (e = this.THRESHOLD);
            for (var c = 3; n - 3 > c; c++)
                for (var s = 3; r - 3 > s; s++) {
                    for (var g = c * r + s, h = t[g], k = 0; 16 > k; k++)
                        a[k] = t[g + i[k]];
                    this.isCorner(h, a, e) && (o.push(s, c),
                        s += 3)
                }
            return o
        },
        tracking.Fast.isBrighter = function(t, r, n) {
            return t - r > n
        },
        tracking.Fast.isCorner = function(t, r, n) {
            if (this.isTriviallyExcluded(r, t, n))
                return !1;
            for (var e = 0; 16 > e; e++) {
                for (var i = !0, a = !0, o = 0; 9 > o; o++) {
                    var c = r[e + o & 15];
                    if (!this.isBrighter(t, c, n) && (a = !1,
                            i === !1))
                        break;
                    if (!this.isDarker(t, c, n) && (i = !1,
                            a === !1))
                        break
                }
                if (a || i)
                    return !0
            }
            return !1
        },
        tracking.Fast.isDarker = function(t, r, n) {
            return r - t > n
        },
        tracking.Fast.isTriviallyExcluded = function(t, r, n) {
            var e = 0,
                i = t[8],
                a = t[12],
                o = t[4],
                c = t[0];
            return this.isBrighter(c, r, n) && e++,
                this.isBrighter(o, r, n) && e++,
                this.isBrighter(i, r, n) && e++,
                this.isBrighter(a, r, n) && e++,
                3 > e && (e = 0,
                    this.isDarker(c, r, n) && e++,
                    this.isDarker(o, r, n) && e++,
                    this.isDarker(i, r, n) && e++,
                    this.isDarker(a, r, n) && e++,
                    3 > e) ? !0 : !1
        },
        tracking.Fast.getCircleOffsets_ = function(t) {
            if (this.circles_[t])
                return this.circles_[t];
            var r = new Int32Array(16);
            return r[0] = -t - t - t,
                r[1] = r[0] + 1,
                r[2] = r[1] + t + 1,
                r[3] = r[2] + t + 1,
                r[4] = r[3] + t,
                r[5] = r[4] + t,
                r[6] = r[5] + t - 1,
                r[7] = r[6] + t - 1,
                r[8] = r[7] - 1,
                r[9] = r[8] - 1,
                r[10] = r[9] - t - 1,
                r[11] = r[10] - t - 1,
                r[12] = r[11] - t,
                r[13] = r[12] - t,
                r[14] = r[13] - t + 1,
                r[15] = r[14] - t + 1,
                this.circles_[t] = r,
                r
        }
}(),
function() {
    tracking.Math = {},
        tracking.Math.distance = function(t, r, n, e) {
            var i = n - t,
                a = e - r;
            return Math.sqrt(i * i + a * a)
        },
        tracking.Math.hammingWeight = function(t) {
            return t -= t >> 1 & 1431655765,
                t = (858993459 & t) + (t >> 2 & 858993459),
                16843009 * (t + (t >> 4) & 252645135) >> 24
        },
        tracking.Math.uniformRandom = function(t, r) {
            return t + Math.random() * (r - t)
        },
        tracking.Math.intersectRect = function(t, r, n, e, i, a, o, c) {
            return !(i > n || t > o || a > e || r > c)
        }
}(),
function() {
    tracking.Matrix = {},
        tracking.Matrix.forEach = function(t, r, n, e, i) {
            i = i || 1;
            for (var a = 0; n > a; a += i)
                for (var o = 0; r > o; o += i) {
                    var c = a * r * 4 + 4 * o;
                    e.call(this, t[c], t[c + 1], t[c + 2], t[c + 3], c, a, o)
                }
        }
}(),
function() {
    tracking.EPnP = {},
        tracking.EPnP.solve = function(t, r, n) {}
}(),
function() {
    tracking.Tracker = function() {
            tracking.Tracker.base(this, "constructor")
        },
        tracking.inherits(tracking.Tracker, tracking.EventEmitter),
        tracking.Tracker.prototype.track = function() {}
}(),
function() {
    tracking.TrackerTask = function(t) {
            if (tracking.TrackerTask.base(this, "constructor"), !t)
                throw new Error("Tracker instance not specified.");
            this.setTracker(t)
        },
        tracking.inherits(tracking.TrackerTask, tracking.EventEmitter),
        tracking.TrackerTask.prototype.tracker_ = null,
        tracking.TrackerTask.prototype.running_ = !1,
        tracking.TrackerTask.prototype.getTracker = function() {
            return this.tracker_
        },
        tracking.TrackerTask.prototype.inRunning = function() {
            return this.running_
        },
        tracking.TrackerTask.prototype.setRunning = function(t) {
            this.running_ = t
        },
        tracking.TrackerTask.prototype.setTracker = function(t) {
            this.tracker_ = t
        },
        tracking.TrackerTask.prototype.run = function() {
            var t = this;
            if (!this.inRunning())
                return this.setRunning(!0),
                    this.reemitTrackEvent_ = function(r) {
                        t.emit("track", r)
                    },
                    this.tracker_.on("track", this.reemitTrackEvent_),
                    this.emit("run"),
                    this
        },
        tracking.TrackerTask.prototype.stop = function() {
            return this.inRunning() ? (this.setRunning(!1),
                this.emit("stop"),
                this.tracker_.removeListener("track", this.reemitTrackEvent_),
                this) : void 0
        }
}(),
function() {
    tracking.ColorTracker = function(t) {
            tracking.ColorTracker.base(this, "constructor"),
                "string" == typeof t && (t = [t]),
                t && (t.forEach(function(t) {
                        if (!tracking.ColorTracker.getColor(t))
                            throw new Error('Color not valid, try `new tracking.ColorTracker("magenta")`.')
                    }),
                    this.setColors(t))
        },
        tracking.inherits(tracking.ColorTracker, tracking.Tracker),
        tracking.ColorTracker.knownColors_ = {},
        tracking.ColorTracker.neighbours_ = {},
        tracking.ColorTracker.registerColor = function(t, r) {
            tracking.ColorTracker.knownColors_[t] = r
        },
        tracking.ColorTracker.getColor = function(t) {
            return tracking.ColorTracker.knownColors_[t]
        },
        tracking.ColorTracker.prototype.colors = ["magenta"],
        tracking.ColorTracker.prototype.minDimension = 20,
        tracking.ColorTracker.prototype.maxDimension = 1 / 0,
        tracking.ColorTracker.prototype.minGroupSize = 30,
        tracking.ColorTracker.prototype.calculateDimensions_ = function(t, r) {
            for (var n = -1, e = -1, i = 1 / 0, a = 1 / 0, o = 0; r > o; o += 2) {
                var c = t[o],
                    s = t[o + 1];
                i > c && (i = c),
                    c > n && (n = c),
                    a > s && (a = s),
                    s > e && (e = s)
            }
            return {
                width: n - i,
                height: e - a,
                x: i,
                y: a
            }
        },
        tracking.ColorTracker.prototype.getColors = function() {
            return this.colors
        },
        tracking.ColorTracker.prototype.getMinDimension = function() {
            return this.minDimension
        },
        tracking.ColorTracker.prototype.getMaxDimension = function() {
            return this.maxDimension
        },
        tracking.ColorTracker.prototype.getMinGroupSize = function() {
            return this.minGroupSize
        },
        tracking.ColorTracker.prototype.getNeighboursForWidth_ = function(t) {
            if (tracking.ColorTracker.neighbours_[t])
                return tracking.ColorTracker.neighbours_[t];
            var r = new Int32Array(8);
            return r[0] = 4 * -t,
                r[1] = 4 * -t + 4,
                r[2] = 4,
                r[3] = 4 * t + 4,
                r[4] = 4 * t,
                r[5] = 4 * t - 4,
                r[6] = -4,
                r[7] = 4 * -t - 4,
                tracking.ColorTracker.neighbours_[t] = r,
                r
        },
        tracking.ColorTracker.prototype.mergeRectangles_ = function(t) {
            for (var r, n = [], e = this.getMinDimension(), i = this.getMaxDimension(), a = 0; a < t.length; a++) {
                var o = t[a];
                r = !0;
                for (var c = a + 1; c < t.length; c++) {
                    var s = t[c];
                    if (tracking.Math.intersectRect(o.x, o.y, o.x + o.width, o.y + o.height, s.x, s.y, s.x + s.width, s.y + s.height)) {
                        r = !1;
                        var g = Math.min(o.x, s.x),
                            h = Math.min(o.y, s.y),
                            k = Math.max(o.x + o.width, s.x + s.width),
                            u = Math.max(o.y + o.height, s.y + s.height);
                        s.height = u - h,
                            s.width = k - g,
                            s.x = g,
                            s.y = h;
                        break
                    }
                }
                r && o.width >= e && o.height >= e && o.width <= i && o.height <= i && n.push(o)
            }
            return n
        },
        tracking.ColorTracker.prototype.setColors = function(t) {
            this.colors = t
        },
        tracking.ColorTracker.prototype.setMinDimension = function(t) {
            this.minDimension = t
        },
        tracking.ColorTracker.prototype.setMaxDimension = function(t) {
            this.maxDimension = t
        },
        tracking.ColorTracker.prototype.setMinGroupSize = function(t) {
            this.minGroupSize = t
        },
        tracking.ColorTracker.prototype.track = function(t, r, n) {
            var e = this,
                i = this.getColors();
            if (!i)
                throw new Error('Colors not specified, try `new tracking.ColorTracker("magenta")`.');
            var a = [];
            i.forEach(function(i) {
                    a = a.concat(e.trackColor_(t, r, n, i))
                }),
                this.emit("track", {
                    data: a
                })
        },
        tracking.ColorTracker.prototype.trackColor_ = function(n, e, i, a) {
            var o, c, s, g, h, k = tracking.ColorTracker.knownColors_[a],
                u = new Int32Array(n.length >> 2),
                f = new Int8Array(n.length),
                l = this.getMinGroupSize(),
                p = this.getNeighboursForWidth_(e),
                v = new Int32Array(n.length),
                m = [],
                y = -4;
            if (!k)
                return m;
            for (var d = 0; i > d; d++)
                for (var w = 0; e > w; w++)
                    if (y += 4, !f[y]) {
                        for (o = 0,
                            h = -1,
                            v[++h] = y,
                            v[++h] = d,
                            v[++h] = w,
                            f[y] = 1; h >= 0;)
                            if (s = v[h--],
                                c = v[h--],
                                g = v[h--],
                                k(n[g], n[g + 1], n[g + 2], n[g + 3], g, c, s)) {
                                u[o++] = s,
                                    u[o++] = c;
                                for (var T = 0; T < p.length; T++) {
                                    var C = g + p[T],
                                        _ = c + t[T],
                                        E = s + r[T];
                                    !f[C] && _ >= 0 && i > _ && E >= 0 && e > E && (v[++h] = C,
                                        v[++h] = _,
                                        v[++h] = E,
                                        f[C] = 1)
                                }
                            }
                        if (o >= l) {
                            var M = this.calculateDimensions_(u, o);
                            M && (M.color = a,
                                m.push(M))
                        }
                    }
            return this.mergeRectangles_(m)
        },
        tracking.ColorTracker.registerColor("cyan", function(t, r, n) {
            var e = 50,
                i = 70,
                a = t - 0,
                o = r - 255,
                c = n - 255;
            return r - t >= e && n - t >= i ? !0 : 6400 > a * a + o * o + c * c
        }),
        tracking.ColorTracker.registerColor("magenta", function(t, r, n) {
            var e = 50,
                i = t - 255,
                a = r - 0,
                o = n - 255;
            return t - r >= e && n - r >= e ? !0 : 19600 > i * i + a * a + o * o
        }),
        tracking.ColorTracker.registerColor("yellow", function(t, r, n) {
            var e = 50,
                i = t - 255,
                a = r - 255,
                o = n - 0;
            return t - n >= e && r - n >= e ? !0 : 1e4 > i * i + a * a + o * o
        });
    var t = new Int32Array([-1, -1, 0, 1, 1, 1, 0, -1]),
        r = new Int32Array([0, 1, 1, 1, 0, -1, -1, -1])
}(),
function() {
    tracking.ObjectTracker = function(t) {
            tracking.ObjectTracker.base(this, "constructor"),
                t && (Array.isArray(t) || (t = [t]),
                    Array.isArray(t) && t.forEach(function(r, n) {
                        if ("string" == typeof r && (t[n] = tracking.ViolaJones.classifiers[r]), !t[n])
                            throw new Error('Object classifier not valid, try `new tracking.ObjectTracker("face")`.')
                    })),
                this.setClassifiers(t)
        },
        tracking.inherits(tracking.ObjectTracker, tracking.Tracker),
        tracking.ObjectTracker.prototype.edgesDensity = .2,
        tracking.ObjectTracker.prototype.initialScale = 1,
        tracking.ObjectTracker.prototype.scaleFactor = 1.25,
        tracking.ObjectTracker.prototype.stepSize = 1.5,
        tracking.ObjectTracker.prototype.getClassifiers = function() {
            return this.classifiers
        },
        tracking.ObjectTracker.prototype.getEdgesDensity = function() {
            return this.edgesDensity
        },
        tracking.ObjectTracker.prototype.getInitialScale = function() {
            return this.initialScale
        },
        tracking.ObjectTracker.prototype.getScaleFactor = function() {
            return this.scaleFactor
        },
        tracking.ObjectTracker.prototype.getStepSize = function() {
            return this.stepSize
        },
        tracking.ObjectTracker.prototype.track = function(t, r, n) {
            var e = this,
                i = this.getClassifiers();
            if (!i)
                throw new Error('Object classifier not specified, try `new tracking.ObjectTracker("face")`.');
            var a = [];
            i.forEach(function(i) {
                    a = a.concat(tracking.ViolaJones.detect(t, r, n, e.getInitialScale(), e.getScaleFactor(), e.getStepSize(), e.getEdgesDensity(), i))
                }),
                this.emit("track", {
                    data: a
                })
        },
        tracking.ObjectTracker.prototype.setClassifiers = function(t) {
            this.classifiers = t
        },
        tracking.ObjectTracker.prototype.setEdgesDensity = function(t) {
            this.edgesDensity = t
        },
        tracking.ObjectTracker.prototype.setInitialScale = function(t) {
            this.initialScale = t
        },
        tracking.ObjectTracker.prototype.setScaleFactor = function(t) {
            this.scaleFactor = t
        },
        tracking.ObjectTracker.prototype.setStepSize = function(t) {
            this.stepSize = t
        }
}();
tracking.ViolaJones.classifiers.face = new Float64Array([20, 20, .822689414024353, 3, 0, 2, 3, 7, 14, 4, -1, 3, 9, 14, 2, 2, .004014195874333382, .0337941907346249, .8378106951713562, 0, 2, 1, 2, 18, 4, -1, 7, 2, 6, 4, 3, .0151513395830989, .1514132022857666, .7488812208175659, 0, 2, 1, 7, 15, 9, -1, 1, 10, 15, 3, 3, .004210993181914091, .0900492817163467, .6374819874763489, 6.956608772277832, 16, 0, 2, 5, 6, 2, 6, -1, 5, 9, 2, 3, 2, .0016227109590545297, .0693085864186287, .7110946178436279, 0, 2, 7, 5, 6, 3, -1, 9, 5, 2, 3, 3, .002290664939209819, .1795803010463715, .6668692231178284, 0, 2, 4, 0, 12, 9, -1, 4, 3, 12, 3, 3, .005002570804208517, .1693672984838486, .6554006934165955, 0, 2, 6, 9, 10, 8, -1, 6, 13, 10, 4, 2, .007965989410877228, .5866332054138184, .0914145186543465, 0, 2, 3, 6, 14, 8, -1, 3, 10, 14, 4, 2, -.003522701095789671, .1413166970014572, .6031895875930786, 0, 2, 14, 1, 6, 10, -1, 14, 1, 3, 10, 2, .0366676896810532, .3675672113895416, .7920318245887756, 0, 2, 7, 8, 5, 12, -1, 7, 12, 5, 4, 3, .009336147457361221, .6161385774612427, .2088509947061539, 0, 2, 1, 1, 18, 3, -1, 7, 1, 6, 3, 3, .008696131408214569, .2836230993270874, .6360273957252502, 0, 2, 1, 8, 17, 2, -1, 1, 9, 17, 1, 2, .0011488880263641477, .2223580926656723, .5800700783729553, 0, 2, 16, 6, 4, 2, -1, 16, 7, 4, 1, 2, -.002148468978703022, .2406464070081711, .5787054896354675, 0, 2, 5, 17, 2, 2, -1, 5, 18, 2, 1, 2, .002121906029060483, .5559654831886292, .136223703622818, 0, 2, 14, 2, 6, 12, -1, 14, 2, 3, 12, 2, -.0939491465687752, .8502737283706665, .4717740118503571, 0, 3, 4, 0, 4, 12, -1, 4, 0, 2, 6, 2, 6, 6, 2, 6, 2, .0013777789426967502, .5993673801422119, .2834529876708984, 0, 2, 2, 11, 18, 8, -1, 8, 11, 6, 8, 3, .0730631574988365, .4341886043548584, .7060034275054932, 0, 2, 5, 7, 10, 2, -1, 5, 8, 10, 1, 2, .00036767389974556863, .3027887940406799, .6051574945449829, 0, 2, 15, 11, 5, 3, -1, 15, 12, 5, 1, 3, -.0060479710809886456, .17984339594841, .5675256848335266, 9.498542785644531, 21, 0, 2, 5, 3, 10, 9, -1, 5, 6, 10, 3, 3, -.0165106896311045, .6644225120544434, .1424857974052429, 0, 2, 9, 4, 2, 14, -1, 9, 11, 2, 7, 2, .002705249935388565, .6325352191925049, .1288477033376694, 0, 2, 3, 5, 4, 12, -1, 3, 9, 4, 4, 3, .002806986914947629, .1240288019180298, .6193193197250366, 0, 2, 4, 5, 12, 5, -1, 8, 5, 4, 5, 3, -.0015402400167658925, .1432143002748489, .5670015811920166, 0, 2, 5, 6, 10, 8, -1, 5, 10, 10, 4, 2, -.0005638627917505801, .1657433062791824, .5905207991600037, 0, 2, 8, 0, 6, 9, -1, 8, 3, 6, 3, 3, .0019253729842603207, .2695507109165192, .5738824009895325, 0, 2, 9, 12, 1, 8, -1, 9, 16, 1, 4, 2, -.005021484103053808, .1893538981676102, .5782774090766907, 0, 2, 0, 7, 20, 6, -1, 0, 9, 20, 2, 3, .0026365420781075954, .2309329062700272, .5695425868034363, 0, 2, 7, 0, 6, 17, -1, 9, 0, 2, 17, 3, -.0015127769438549876, .2759602069854736, .5956642031669617, 0, 2, 9, 0, 6, 4, -1, 11, 0, 2, 4, 3, -.0101574398577213, .1732538044452667, .5522047281265259, 0, 2, 5, 1, 6, 4, -1, 7, 1, 2, 4, 3, -.011953660286963, .1339409947395325, .5559014081954956, 0, 2, 12, 1, 6, 16, -1, 14, 1, 2, 16, 3, .004885949194431305, .3628703951835632, .6188849210739136, 0, 3, 0, 5, 18, 8, -1, 0, 5, 9, 4, 2, 9, 9, 9, 4, 2, -.0801329165697098, .0912110507488251, .5475944876670837, 0, 3, 8, 15, 10, 4, -1, 13, 15, 5, 2, 2, 8, 17, 5, 2, 2, .0010643280111253262, .3715142905712128, .5711399912834167, 0, 3, 3, 1, 4, 8, -1, 3, 1, 2, 4, 2, 5, 5, 2, 4, 2, -.0013419450260698795, .5953313708305359, .331809788942337, 0, 3, 3, 6, 14, 10, -1, 10, 6, 7, 5, 2, 3, 11, 7, 5, 2, -.0546011403203011, .1844065934419632, .5602846145629883, 0, 2, 2, 1, 6, 16, -1, 4, 1, 2, 16, 3, .0029071690514683723, .3594244122505188, .6131715178489685, 0, 2, 0, 18, 20, 2, -1, 0, 19, 20, 1, 2, .0007471871795132756, .5994353294372559, .3459562957286835, 0, 2, 8, 13, 4, 3, -1, 8, 14, 4, 1, 3, .004301380831748247, .4172652065753937, .6990845203399658, 0, 2, 9, 14, 2, 3, -1, 9, 15, 2, 1, 3, .004501757211983204, .4509715139865875, .7801457047462463, 0, 2, 0, 12, 9, 6, -1, 0, 14, 9, 2, 3, .0241385009139776, .5438212752342224, .1319826990365982, 18.4129695892334, 39, 0, 2, 5, 7, 3, 4, -1, 5, 9, 3, 2, 2, .001921223010867834, .1415266990661621, .6199870705604553, 0, 2, 9, 3, 2, 16, -1, 9, 11, 2, 8, 2, -.00012748669541906565, .6191074252128601, .1884928941726685, 0, 2, 3, 6, 13, 8, -1, 3, 10, 13, 4, 2, .0005140993162058294, .1487396955490112, .5857927799224854, 0, 2, 12, 3, 8, 2, -1, 12, 3, 4, 2, 2, .004187860991805792, .2746909856796265, .6359239816665649, 0, 2, 8, 8, 4, 12, -1, 8, 12, 4, 4, 3, .005101571790874004, .5870851278305054, .2175628989934921, 0, 3, 11, 3, 8, 6, -1, 15, 3, 4, 3, 2, 11, 6, 4, 3, 2, -.002144844038411975, .5880944728851318, .2979590892791748, 0, 2, 7, 1, 6, 19, -1, 9, 1, 2, 19, 3, -.0028977119363844395, .2373327016830444, .5876647233963013, 0, 2, 9, 0, 6, 4, -1, 11, 0, 2, 4, 3, -.0216106791049242, .1220654994249344, .5194202065467834, 0, 2, 3, 1, 9, 3, -1, 6, 1, 3, 3, 3, -.004629931878298521, .263123095035553, .5817409157752991, 0, 3, 8, 15, 10, 4, -1, 13, 15, 5, 2, 2, 8, 17, 5, 2, 2, .000593937118537724, .363862007856369, .5698544979095459, 0, 2, 0, 3, 6, 10, -1, 3, 3, 3, 10, 2, .0538786612451077, .4303531050682068, .7559366226196289, 0, 2, 3, 4, 15, 15, -1, 3, 9, 15, 5, 3, .0018887349870055914, .2122603058815002, .561342716217041, 0, 2, 6, 5, 8, 6, -1, 6, 7, 8, 2, 3, -.0023635339457541704, .563184916973114, .2642767131328583, 0, 3, 4, 4, 12, 10, -1, 10, 4, 6, 5, 2, 4, 9, 6, 5, 2, .0240177996456623, .5797107815742493, .2751705944538117, 0, 2, 6, 4, 4, 4, -1, 8, 4, 2, 4, 2, .00020543030404951423, .2705242037773132, .575256884098053, 0, 2, 15, 11, 1, 2, -1, 15, 12, 1, 1, 2, .0008479019743390381, .5435624718666077, .2334876954555512, 0, 2, 3, 11, 2, 2, -1, 3, 12, 2, 1, 2, .0014091329649090767, .5319424867630005, .2063155025243759, 0, 2, 16, 11, 1, 3, -1, 16, 12, 1, 1, 3, .0014642629539594054, .5418980717658997, .3068861067295075, 0, 3, 3, 15, 6, 4, -1, 3, 15, 3, 2, 2, 6, 17, 3, 2, 2, .0016352549428120255, .3695372939109802, .6112868189811707, 0, 2, 6, 7, 8, 2, -1, 6, 8, 8, 1, 2, .0008317275205627084, .3565036952495575, .6025236248970032, 0, 2, 3, 11, 1, 3, -1, 3, 12, 1, 1, 3, -.0020998890977352858, .1913982033729553, .5362827181816101, 0, 2, 6, 0, 12, 2, -1, 6, 1, 12, 1, 2, -.0007421398186124861, .3835555016994476, .552931010723114, 0, 2, 9, 14, 2, 3, -1, 9, 15, 2, 1, 3, .0032655049581080675, .4312896132469177, .7101895809173584, 0, 2, 7, 15, 6, 2, -1, 7, 16, 6, 1, 2, .0008913499186746776, .3984830975532532, .6391963958740234, 0, 2, 0, 5, 4, 6, -1, 0, 7, 4, 2, 3, -.0152841797098517, .2366732954978943, .5433713793754578, 0, 2, 4, 12, 12, 2, -1, 8, 12, 4, 2, 3, .004838141147047281, .5817500948905945, .3239189088344574, 0, 2, 6, 3, 1, 9, -1, 6, 6, 1, 3, 3, -.0009109317907132208, .5540593862533569, .2911868989467621, 0, 2, 10, 17, 3, 2, -1, 11, 17, 1, 2, 3, -.006127506028860807, .1775255054235458, .5196629166603088, 0, 2, 9, 9, 2, 2, -1, 9, 10, 2, 1, 2, -.00044576259097084403, .3024170100688934, .5533593893051147, 0, 2, 7, 6, 6, 4, -1, 9, 6, 2, 4, 3, .0226465407758951, .4414930939674377, .6975377202033997, 0, 2, 7, 17, 3, 2, -1, 8, 17, 1, 2, 3, -.0018804960418492556, .2791394889354706, .5497952103614807, 0, 2, 10, 17, 3, 3, -1, 11, 17, 1, 3, 3, .007088910788297653, .5263199210166931, .2385547012090683, 0, 2, 8, 12, 3, 2, -1, 8, 13, 3, 1, 2, .0017318050377070904, .4319379031658173, .6983600854873657, 0, 2, 9, 3, 6, 2, -1, 11, 3, 2, 2, 3, -.006848270073533058, .3082042932510376, .5390920042991638, 0, 2, 3, 11, 14, 4, -1, 3, 13, 14, 2, 2, -15062530110299122e-21, .552192211151123, .3120366036891937, 0, 3, 1, 10, 18, 4, -1, 10, 10, 9, 2, 2, 1, 12, 9, 2, 2, .0294755697250366, .5401322841644287, .1770603060722351, 0, 2, 0, 10, 3, 3, -1, 0, 11, 3, 1, 3, .008138732984662056, .5178617835044861, .121101900935173, 0, 2, 9, 1, 6, 6, -1, 11, 1, 2, 6, 3, .0209429506212473, .5290294289588928, .3311221897602081, 0, 2, 8, 7, 3, 6, -1, 9, 7, 1, 6, 3, -.009566552937030792, .7471994161605835, .4451968967914581, 15.324139595031738, 33, 0, 2, 1, 0, 18, 9, -1, 1, 3, 18, 3, 3, -.00028206960996612906, .2064086049795151, .6076732277870178, 0, 2, 12, 10, 2, 6, -1, 12, 13, 2, 3, 2, .00167906004935503, .5851997137069702, .1255383938550949, 0, 2, 0, 5, 19, 8, -1, 0, 9, 19, 4, 2, .0006982791237533092, .094018429517746, .5728961229324341, 0, 2, 7, 0, 6, 9, -1, 9, 0, 2, 9, 3, .0007895901217125356, .1781987994909287, .5694308876991272, 0, 2, 5, 3, 6, 1, -1, 7, 3, 2, 1, 3, -.002856049919500947, .1638399064540863, .5788664817810059, 0, 2, 11, 3, 6, 1, -1, 13, 3, 2, 1, 3, -.0038122469559311867, .2085440009832382, .5508564710617065, 0, 2, 5, 10, 4, 6, -1, 5, 13, 4, 3, 2, .0015896620461717248, .5702760815620422, .1857215017080307, 0, 2, 11, 3, 6, 1, -1, 13, 3, 2, 1, 3, .0100783398374915, .5116943120956421, .2189770042896271, 0, 2, 4, 4, 12, 6, -1, 4, 6, 12, 2, 3, -.0635263025760651, .7131379842758179, .4043813049793243, 0, 2, 15, 12, 2, 6, -1, 15, 14, 2, 2, 3, -.009103149175643921, .2567181885242462, .54639732837677, 0, 2, 9, 3, 2, 2, -1, 10, 3, 1, 2, 2, -.002403500024229288, .1700665950775147, .559097409248352, 0, 2, 9, 3, 3, 1, -1, 10, 3, 1, 1, 3, .001522636041045189, .5410556793212891, .2619054019451141, 0, 2, 1, 1, 4, 14, -1, 3, 1, 2, 14, 2, .0179974399507046, .3732436895370483, .6535220742225647, 0, 3, 9, 0, 4, 4, -1, 11, 0, 2, 2, 2, 9, 2, 2, 2, 2, -.00645381910726428, .2626481950283051, .5537446141242981, 0, 2, 7, 5, 1, 14, -1, 7, 12, 1, 7, 2, -.0118807600811124, .2003753930330277, .5544745922088623, 0, 2, 19, 0, 1, 4, -1, 19, 2, 1, 2, 2, .0012713660253211856, .5591902732849121, .303197592496872, 0, 2, 5, 5, 6, 4, -1, 8, 5, 3, 4, 2, .0011376109905540943, .2730407118797302, .5646508932113647, 0, 2, 9, 18, 3, 2, -1, 10, 18, 1, 2, 3, -.00426519988104701, .1405909061431885, .5461820960044861, 0, 2, 8, 18, 3, 2, -1, 9, 18, 1, 2, 3, -.0029602861031889915, .1795035004615784, .5459290146827698, 0, 2, 4, 5, 12, 6, -1, 4, 7, 12, 2, 3, -.008844822645187378, .5736783146858215, .280921995639801, 0, 2, 3, 12, 2, 6, -1, 3, 14, 2, 2, 3, -.006643068976700306, .2370675951242447, .5503826141357422, 0, 2, 10, 8, 2, 12, -1, 10, 12, 2, 4, 3, .003999780863523483, .5608199834823608, .3304282128810883, 0, 2, 7, 18, 3, 2, -1, 8, 18, 1, 2, 3, -.004122172016650438, .1640105992555618, .5378993153572083, 0, 2, 9, 0, 6, 2, -1, 11, 0, 2, 2, 3, .0156249096617103, .5227649211883545, .2288603931665421, 0, 2, 5, 11, 9, 3, -1, 5, 12, 9, 1, 3, -.0103564197197557, .7016193866729736, .4252927899360657, 0, 2, 9, 0, 6, 2, -1, 11, 0, 2, 2, 3, -.008796080946922302, .2767347097396851, .5355830192565918, 0, 2, 1, 1, 18, 5, -1, 7, 1, 6, 5, 3, .1622693985700607, .434224009513855, .744257926940918, 0, 3, 8, 0, 4, 4, -1, 10, 0, 2, 2, 2, 8, 2, 2, 2, 2, .0045542530715465546, .5726485848426819, .2582125067710877, 0, 2, 3, 12, 1, 3, -1, 3, 13, 1, 1, 3, -.002130920998752117, .2106848061084747, .5361018776893616, 0, 2, 8, 14, 5, 3, -1, 8, 15, 5, 1, 3, -.0132084200158715, .7593790888786316, .4552468061447144, 0, 3, 5, 4, 10, 12, -1, 5, 4, 5, 6, 2, 10, 10, 5, 6, 2, -.0659966766834259, .125247597694397, .5344039797782898, 0, 2, 9, 6, 9, 12, -1, 9, 10, 9, 4, 3, .007914265617728233, .3315384089946747, .5601043105125427, 0, 3, 2, 2, 12, 14, -1, 2, 2, 6, 7, 2, 8, 9, 6, 7, 2, .0208942797034979, .5506049990653992, .2768838107585907, 21.010639190673828, 44, 0, 2, 4, 7, 12, 2, -1, 8, 7, 4, 2, 3, .0011961159761995077, .1762690991163254, .6156241297721863, 0, 2, 7, 4, 6, 4, -1, 7, 6, 6, 2, 2, -.0018679830245673656, .6118106842041016, .1832399964332581, 0, 2, 4, 5, 11, 8, -1, 4, 9, 11, 4, 2, -.00019579799845814705, .0990442633628845, .5723816156387329, 0, 2, 3, 10, 16, 4, -1, 3, 12, 16, 2, 2, -.0008025565766729414, .5579879879951477, .2377282977104187, 0, 2, 0, 0, 16, 2, -1, 0, 1, 16, 1, 2, -.0024510810617357492, .2231457978487015, .5858935117721558, 0, 2, 7, 5, 6, 2, -1, 9, 5, 2, 2, 3, .0005036185029894114, .2653993964195252, .5794103741645813, 0, 3, 3, 2, 6, 10, -1, 3, 2, 3, 5, 2, 6, 7, 3, 5, 2, .0040293349884450436, .5803827047348022, .2484865039587021, 0, 2, 10, 5, 8, 15, -1, 10, 10, 8, 5, 3, -.0144517095759511, .1830351948738098, .5484204888343811, 0, 3, 3, 14, 8, 6, -1, 3, 14, 4, 3, 2, 7, 17, 4, 3, 2, .0020380979403853416, .3363558948040009, .6051092743873596, 0, 2, 14, 2, 2, 2, -1, 14, 3, 2, 1, 2, -.0016155190533027053, .2286642044782639, .5441246032714844, 0, 2, 1, 10, 7, 6, -1, 1, 13, 7, 3, 2, .0033458340913057327, .5625913143157959, .2392338067293167, 0, 2, 15, 4, 4, 3, -1, 15, 4, 2, 3, 2, .0016379579901695251, .3906993865966797, .5964621901512146, 0, 3, 2, 9, 14, 6, -1, 2, 9, 7, 3, 2, 9, 12, 7, 3, 2, .0302512105554342, .524848222732544, .1575746983289719, 0, 2, 5, 7, 10, 4, -1, 5, 9, 10, 2, 2, .037251990288496, .4194310903549194, .6748418807983398, 0, 3, 6, 9, 8, 8, -1, 6, 9, 4, 4, 2, 10, 13, 4, 4, 2, -.0251097902655602, .1882549971342087, .5473451018333435, 0, 2, 14, 1, 3, 2, -1, 14, 2, 3, 1, 2, -.005309905856847763, .133997306227684, .5227110981941223, 0, 2, 1, 4, 4, 2, -1, 3, 4, 2, 2, 2, .0012086479691788554, .3762088119983673, .6109635829925537, 0, 2, 11, 10, 2, 8, -1, 11, 14, 2, 4, 2, -.0219076797366142, .266314297914505, .5404006838798523, 0, 2, 0, 0, 5, 3, -1, 0, 1, 5, 1, 3, .0054116579703986645, .5363578796386719, .2232273072004318, 0, 3, 2, 5, 18, 8, -1, 11, 5, 9, 4, 2, 2, 9, 9, 4, 2, .069946326315403, .5358232855796814, .2453698068857193, 0, 2, 6, 6, 1, 6, -1, 6, 9, 1, 3, 2, .00034520021290518343, .2409671992063522, .5376930236816406, 0, 2, 19, 1, 1, 3, -1, 19, 2, 1, 1, 3, .0012627709656953812, .5425856709480286, .3155693113803864, 0, 2, 7, 6, 6, 6, -1, 9, 6, 2, 6, 3, .0227195098996162, .4158405959606171, .6597865223884583, 0, 2, 19, 1, 1, 3, -1, 19, 2, 1, 1, 3, -.001811100053600967, .2811253070831299, .5505244731903076, 0, 2, 3, 13, 2, 3, -1, 3, 14, 2, 1, 3, .0033469670452177525, .526002824306488, .1891465038061142, 0, 3, 8, 4, 8, 12, -1, 12, 4, 4, 6, 2, 8, 10, 4, 6, 2, .00040791751234792173, .5673509240150452, .3344210088253021, 0, 2, 5, 2, 6, 3, -1, 7, 2, 2, 3, 3, .0127347996458411, .5343592166900635, .2395612001419067, 0, 2, 6, 1, 9, 10, -1, 6, 6, 9, 5, 2, -.007311972789466381, .6010890007019043, .4022207856178284, 0, 2, 0, 4, 6, 12, -1, 2, 4, 2, 12, 3, -.0569487512111664, .8199151158332825, .4543190896511078, 0, 2, 15, 13, 2, 3, -1, 15, 14, 2, 1, 3, -.005011659115552902, .2200281023979187, .5357710719108582, 0, 2, 7, 14, 5, 3, -1, 7, 15, 5, 1, 3, .006033436860889196, .4413081109523773, .7181751132011414, 0, 2, 15, 13, 3, 3, -1, 15, 14, 3, 1, 3, .0039437441155314445, .547886073589325, .2791733145713806, 0, 2, 6, 14, 8, 3, -1, 6, 15, 8, 1, 3, -.0036591119132936, .635786771774292, .3989723920822144, 0, 2, 15, 13, 3, 3, -1, 15, 14, 3, 1, 3, -.0038456181064248085, .3493686020374298, .5300664901733398, 0, 2, 2, 13, 3, 3, -1, 2, 14, 3, 1, 3, -.007192626129835844, .1119614988565445, .5229672789573669, 0, 3, 4, 7, 12, 12, -1, 10, 7, 6, 6, 2, 4, 13, 6, 6, 2, -.0527989417314529, .2387102991342545, .54534512758255, 0, 2, 9, 7, 2, 6, -1, 10, 7, 1, 6, 2, -.007953766733407974, .7586917877197266, .4439376890659332, 0, 2, 8, 9, 5, 2, -1, 8, 10, 5, 1, 2, -.0027344180271029472, .2565476894378662, .5489321947097778, 0, 2, 8, 6, 3, 4, -1, 9, 6, 1, 4, 3, -.0018507939530536532, .6734347939491272, .4252474904060364, 0, 2, 9, 6, 2, 8, -1, 9, 10, 2, 4, 2, .0159189198166132, .548835277557373, .2292661964893341, 0, 2, 7, 7, 3, 6, -1, 8, 7, 1, 6, 3, -.0012687679845839739, .6104331016540527, .4022389948368073, 0, 2, 11, 3, 3, 3, -1, 12, 3, 1, 3, 3, .006288391072303057, .5310853123664856, .1536193042993546, 0, 2, 5, 4, 6, 1, -1, 7, 4, 2, 1, 3, -.0062259892001748085, .1729111969470978, .524160623550415, 0, 2, 5, 6, 10, 3, -1, 5, 7, 10, 1, 3, -.0121325999498367, .659775972366333, .4325182139873505, 23.918790817260742, 50, 0, 2, 7, 3, 6, 9, -1, 7, 6, 6, 3, 3, -.0039184908382594585, .6103435158729553, .1469330936670303, 0, 2, 6, 7, 9, 1, -1, 9, 7, 3, 1, 3, .0015971299726516008, .2632363140583038, .5896466970443726, 0, 2, 2, 8, 16, 8, -1, 2, 12, 16, 4, 2, .0177801102399826, .587287425994873, .1760361939668655, 0, 2, 14, 6, 2, 6, -1, 14, 9, 2, 3, 2, .0006533476989716291, .1567801982164383, .5596066117286682, 0, 2, 1, 5, 6, 15, -1, 1, 10, 6, 5, 3, -.00028353091329336166, .1913153976202011, .5732036232948303, 0, 2, 10, 0, 6, 9, -1, 10, 3, 6, 3, 3, .0016104689566418529, .2914913892745972, .5623080730438232, 0, 2, 6, 6, 7, 14, -1, 6, 13, 7, 7, 2, -.0977506190538406, .194347694516182, .5648233294487, 0, 2, 13, 7, 3, 6, -1, 13, 9, 3, 2, 3, .0005518235848285258, .3134616911411285, .5504639744758606, 0, 2, 1, 8, 15, 4, -1, 6, 8, 5, 4, 3, -.0128582203760743, .253648191690445, .5760142803192139, 0, 2, 11, 2, 3, 10, -1, 11, 7, 3, 5, 2, .004153023939579725, .5767722129821777, .36597740650177, 0, 2, 3, 7, 4, 6, -1, 3, 9, 4, 2, 3, .0017092459602281451, .2843191027641296, .5918939113616943, 0, 2, 13, 3, 6, 10, -1, 15, 3, 2, 10, 3, .007521735969930887, .4052427113056183, .6183109283447266, 0, 3, 5, 7, 8, 10, -1, 5, 7, 4, 5, 2, 9, 12, 4, 5, 2, .0022479810286313295, .578375518321991, .3135401010513306, 0, 3, 4, 4, 12, 12, -1, 10, 4, 6, 6, 2, 4, 10, 6, 6, 2, .0520062111318111, .5541312098503113, .1916636973619461, 0, 2, 1, 4, 6, 9, -1, 3, 4, 2, 9, 3, .0120855299755931, .4032655954360962, .6644591093063354, 0, 2, 11, 3, 2, 5, -1, 11, 3, 1, 5, 2, 14687820112158079e-21, .3535977900028229, .5709382891654968, 0, 2, 7, 3, 2, 5, -1, 8, 3, 1, 5, 2, 7139518857002258e-21, .3037444949150085, .5610269904136658, 0, 2, 10, 14, 2, 3, -1, 10, 15, 2, 1, 3, -.0046001640148460865, .7181087136268616, .4580326080322266, 0, 2, 5, 12, 6, 2, -1, 8, 12, 3, 2, 2, .0020058949012309313, .5621951818466187, .2953684031963348, 0, 2, 9, 14, 2, 3, -1, 9, 15, 2, 1, 3, .004505027085542679, .4615387916564941, .7619017958641052, 0, 2, 4, 11, 12, 6, -1, 4, 14, 12, 3, 2, .0117468303069472, .5343837141990662, .1772529035806656, 0, 2, 11, 11, 5, 9, -1, 11, 14, 5, 3, 3, -.0583163388073444, .1686245948076248, .5340772271156311, 0, 2, 6, 15, 3, 2, -1, 6, 16, 3, 1, 2, .00023629379575140774, .3792056143283844, .6026803851127625, 0, 2, 11, 0, 3, 5, -1, 12, 0, 1, 5, 3, -.007815618067979813, .151286706328392, .5324323773384094, 0, 2, 5, 5, 6, 7, -1, 8, 5, 3, 7, 2, -.0108761601150036, .2081822007894516, .5319945216178894, 0, 2, 13, 0, 1, 9, -1, 13, 3, 1, 3, 3, -.0027745519764721394, .4098246991634369, .5210328102111816, 0, 3, 3, 2, 4, 8, -1, 3, 2, 2, 4, 2, 5, 6, 2, 4, 2, -.0007827638182789087, .5693274140357971, .3478842079639435, 0, 2, 13, 12, 4, 6, -1, 13, 14, 4, 2, 3, .0138704096898437, .5326750874519348, .2257698029279709, 0, 2, 3, 12, 4, 6, -1, 3, 14, 4, 2, 3, -.0236749108880758, .1551305055618286, .5200707912445068, 0, 2, 13, 11, 3, 4, -1, 13, 13, 3, 2, 2, -14879409718560055e-21, .5500566959381104, .3820176124572754, 0, 2, 4, 4, 4, 3, -1, 4, 5, 4, 1, 3, .00361906411126256, .4238683879375458, .6639748215675354, 0, 2, 7, 5, 11, 8, -1, 7, 9, 11, 4, 2, -.0198171101510525, .2150038033723831, .5382357835769653, 0, 2, 7, 8, 3, 4, -1, 8, 8, 1, 4, 3, -.0038154039066284895, .6675711274147034, .4215297102928162, 0, 2, 9, 1, 6, 1, -1, 11, 1, 2, 1, 3, -.0049775829538702965, .2267289012670517, .5386328101158142, 0, 2, 5, 5, 3, 3, -1, 5, 6, 3, 1, 3, .002244102070108056, .4308691024780273, .6855735778808594, 0, 3, 0, 9, 20, 6, -1, 10, 9, 10, 3, 2, 0, 12, 10, 3, 2, .0122824599966407, .5836614966392517, .3467479050159454, 0, 2, 8, 6, 3, 5, -1, 9, 6, 1, 5, 3, -.002854869933798909, .7016944885253906, .4311453998088837, 0, 2, 11, 0, 1, 3, -1, 11, 1, 1, 1, 3, -.0037875669077038765, .2895345091819763, .5224946141242981, 0, 2, 4, 2, 4, 2, -1, 4, 3, 4, 1, 2, -.0012201230274513364, .2975570857524872, .5481644868850708, 0, 2, 12, 6, 4, 3, -1, 12, 7, 4, 1, 3, .010160599835217, .4888817965984345, .8182697892189026, 0, 2, 5, 0, 6, 4, -1, 7, 0, 2, 4, 3, -.0161745697259903, .1481492966413498, .5239992737770081, 0, 2, 9, 7, 3, 8, -1, 10, 7, 1, 8, 3, .0192924607545137, .4786309897899628, .7378190755844116, 0, 2, 9, 7, 2, 2, -1, 10, 7, 1, 2, 2, -.003247953951358795, .7374222874641418, .4470643997192383, 0, 3, 6, 7, 14, 4, -1, 13, 7, 7, 2, 2, 6, 9, 7, 2, 2, -.009380348026752472, .3489154875278473, .5537996292114258, 0, 2, 0, 5, 3, 6, -1, 0, 7, 3, 2, 3, -.0126061299815774, .2379686981439591, .5315443277359009, 0, 2, 13, 11, 3, 4, -1, 13, 13, 3, 2, 2, -.0256219301372766, .1964688003063202, .5138769745826721, 0, 2, 4, 11, 3, 4, -1, 4, 13, 3, 2, 2, -7574149640277028e-20, .5590522885322571, .3365853130817413, 0, 3, 5, 9, 12, 8, -1, 11, 9, 6, 4, 2, 5, 13, 6, 4, 2, -.0892108827829361, .0634046569466591, .516263484954834, 0, 2, 9, 12, 1, 3, -1, 9, 13, 1, 1, 3, -.002767048077657819, .732346773147583, .4490706026554108, 0, 2, 10, 15, 2, 4, -1, 10, 17, 2, 2, 2, .0002715257869567722, .411483496427536, .5985518097877502, 24.52787971496582, 51, 0, 2, 7, 7, 6, 1, -1, 9, 7, 2, 1, 3, .001478621968999505, .266354501247406, .6643316745758057, 0, 3, 12, 3, 6, 6, -1, 15, 3, 3, 3, 2, 12, 6, 3, 3, 2, -.001874165958724916, .6143848896026611, .2518512904644013, 0, 2, 0, 4, 10, 6, -1, 0, 6, 10, 2, 3, -.001715100952424109, .5766341090202332, .2397463023662567, 0, 3, 8, 3, 8, 14, -1, 12, 3, 4, 7, 2, 8, 10, 4, 7, 2, -.0018939269939437509, .5682045817375183, .2529144883155823, 0, 2, 4, 4, 7, 15, -1, 4, 9, 7, 5, 3, -.005300605203956366, .1640675961971283, .5556079745292664, 0, 3, 12, 2, 6, 8, -1, 15, 2, 3, 4, 2, 12, 6, 3, 4, 2, -.0466625317931175, .6123154163360596, .4762830138206482, 0, 3, 2, 2, 6, 8, -1, 2, 2, 3, 4, 2, 5, 6, 3, 4, 2, -.000794313324149698, .5707858800888062, .2839404046535492, 0, 2, 2, 13, 18, 7, -1, 8, 13, 6, 7, 3, .0148916700854898, .4089672863483429, .6006367206573486, 0, 3, 4, 3, 8, 14, -1, 4, 3, 4, 7, 2, 8, 10, 4, 7, 2, -.0012046529445797205, .5712450742721558, .2705289125442505, 0, 2, 18, 1, 2, 6, -1, 18, 3, 2, 2, 3, .006061938125640154, .526250422000885, .3262225985527039, 0, 2, 9, 11, 2, 3, -1, 9, 12, 2, 1, 3, -.0025286648888140917, .6853830814361572, .4199256896972656, 0, 2, 18, 1, 2, 6, -1, 18, 3, 2, 2, 3, -.005901021882891655, .3266282081604004, .5434812903404236, 0, 2, 0, 1, 2, 6, -1, 0, 3, 2, 2, 3, .005670276004821062, .5468410849571228, .2319003939628601, 0, 2, 1, 5, 18, 6, -1, 1, 7, 18, 2, 3, -.003030410036444664, .557066798210144, .2708238065242767, 0, 2, 0, 2, 6, 7, -1, 3, 2, 3, 7, 2, .002980364952236414, .3700568974018097, .5890625715255737, 0, 2, 7, 3, 6, 14, -1, 7, 10, 6, 7, 2, -.0758405104279518, .2140070050954819, .5419948101043701, 0, 2, 3, 7, 13, 10, -1, 3, 12, 13, 5, 2, .0192625392228365, .5526772141456604, .2726590037345886, 0, 2, 11, 15, 2, 2, -1, 11, 16, 2, 1, 2, .00018888259364757687, .3958011865615845, .6017209887504578, 0, 3, 2, 11, 16, 4, -1, 2, 11, 8, 2, 2, 10, 13, 8, 2, 2, .0293695498257875, .5241373777389526, .1435758024454117, 0, 3, 13, 7, 6, 4, -1, 16, 7, 3, 2, 2, 13, 9, 3, 2, 2, .0010417619487270713, .3385409116744995, .5929983258247375, 0, 2, 6, 10, 3, 9, -1, 6, 13, 3, 3, 3, .0026125640142709017, .5485377907752991, .3021597862243652, 0, 2, 14, 6, 1, 6, -1, 14, 9, 1, 3, 2, .0009697746718302369, .3375276029109955, .553203284740448, 0, 2, 5, 10, 4, 1, -1, 7, 10, 2, 1, 2, .0005951265920884907, .563174307346344, .3359399139881134, 0, 2, 3, 8, 15, 5, -1, 8, 8, 5, 5, 3, -.1015655994415283, .0637350380420685, .5230425000190735, 0, 2, 1, 6, 5, 4, -1, 1, 8, 5, 2, 2, .0361566990613937, .5136963129043579, .1029528975486755, 0, 2, 3, 1, 17, 6, -1, 3, 3, 17, 2, 3, .003462414024397731, .3879320025444031, .5558289289474487, 0, 2, 6, 7, 8, 2, -1, 10, 7, 4, 2, 2, .0195549800992012, .5250086784362793, .1875859946012497, 0, 2, 9, 7, 3, 2, -1, 10, 7, 1, 2, 3, -.0023121440317481756, .667202889919281, .4679641127586365, 0, 2, 8, 7, 3, 2, -1, 9, 7, 1, 2, 3, -.001860528951510787, .7163379192352295, .4334670901298523, 0, 2, 8, 9, 4, 2, -1, 8, 10, 4, 1, 2, -.0009402636205777526, .302136093378067, .5650203227996826, 0, 2, 8, 8, 4, 3, -1, 8, 9, 4, 1, 3, -.005241833161562681, .1820009052753449, .5250256061553955, 0, 2, 9, 5, 6, 4, -1, 9, 5, 3, 4, 2, .00011729019752237946, .3389188051223755, .544597327709198, 0, 2, 8, 13, 4, 3, -1, 8, 14, 4, 1, 3, .0011878840159624815, .4085349142551422, .6253563165664673, 0, 3, 4, 7, 12, 6, -1, 10, 7, 6, 3, 2, 4, 10, 6, 3, 2, -.0108813596889377, .3378399014472961, .5700082778930664, 0, 2, 8, 14, 4, 3, -1, 8, 15, 4, 1, 3, .0017354859737679362, .4204635918140411, .6523038744926453, 0, 2, 9, 7, 3, 3, -1, 9, 8, 3, 1, 3, -.00651190523058176, .2595216035842896, .5428143739700317, 0, 2, 7, 4, 3, 8, -1, 8, 4, 1, 8, 3, -.0012136430013924837, .6165143847465515, .3977893888950348, 0, 2, 10, 0, 3, 6, -1, 11, 0, 1, 6, 3, -.010354240424931, .1628028005361557, .5219504833221436, 0, 2, 6, 3, 4, 8, -1, 8, 3, 2, 8, 2, .0005585883045569062, .3199650943279266, .5503574013710022, 0, 2, 14, 3, 6, 13, -1, 14, 3, 3, 13, 2, .0152996499091387, .4103994071483612, .6122388243675232, 0, 2, 8, 13, 3, 6, -1, 8, 16, 3, 3, 2, -.021588210016489, .103491298854351, .519738495349884, 0, 2, 14, 3, 6, 13, -1, 14, 3, 3, 13, 2, -.1283462941646576, .8493865132331848, .4893102943897247, 0, 3, 0, 7, 10, 4, -1, 0, 7, 5, 2, 2, 5, 9, 5, 2, 2, -.0022927189711481333, .3130157887935638, .5471575260162354, 0, 2, 14, 3, 6, 13, -1, 14, 3, 3, 13, 2, .0799151062965393, .4856320917606354, .6073989272117615, 0, 2, 0, 3, 6, 13, -1, 3, 3, 3, 13, 2, -.0794410929083824, .8394674062728882, .462453305721283, 0, 2, 9, 1, 4, 1, -1, 9, 1, 2, 1, 2, -.00528000108897686, .1881695985794067, .5306698083877563, 0, 2, 8, 0, 2, 1, -1, 9, 0, 1, 1, 2, .0010463109938427806, .5271229147911072, .2583065927028656, 0, 3, 10, 16, 4, 4, -1, 12, 16, 2, 2, 2, 10, 18, 2, 2, 2, .00026317298761568964, .4235304892063141, .5735440850257874, 0, 2, 9, 6, 2, 3, -1, 10, 6, 1, 3, 2, -.0036173160187900066, .6934396028518677, .4495444893836975, 0, 2, 4, 5, 12, 2, -1, 8, 5, 4, 2, 3, .0114218797534704, .590092122554779, .4138193130493164, 0, 2, 8, 7, 3, 5, -1, 9, 7, 1, 5, 3, -.0019963278900831938, .6466382741928101, .4327239990234375, 27.153350830078125, 56, 0, 2, 6, 4, 8, 6, -1, 6, 6, 8, 2, 3, -.00996912457048893, .6142324209213257, .2482212036848068, 0, 2, 9, 5, 2, 12, -1, 9, 11, 2, 6, 2, .0007307305932044983, .5704951882362366, .2321965992450714, 0, 2, 4, 6, 6, 8, -1, 4, 10, 6, 4, 2, .0006404530140571296, .2112251967191696, .5814933180809021, 0, 2, 12, 2, 8, 5, -1, 12, 2, 4, 5, 2, .004542401991784573, .2950482070446014, .586631178855896, 0, 2, 0, 8, 18, 3, -1, 0, 9, 18, 1, 3, 9247744310414419e-20, .2990990877151489, .5791326761245728, 0, 2, 8, 12, 4, 8, -1, 8, 16, 4, 4, 2, -.008660314604640007, .2813029885292053, .5635542273521423, 0, 2, 0, 2, 8, 5, -1, 4, 2, 4, 5, 2, .008051581680774689, .3535369038581848, .6054757237434387, 0, 2, 13, 11, 3, 4, -1, 13, 13, 3, 2, 2, .00043835240649059415, .5596532225608826, .2731510996818543, 0, 2, 5, 11, 6, 1, -1, 7, 11, 2, 1, 3, -981689736363478e-19, .5978031754493713, .3638561069965363, 0, 2, 11, 3, 3, 1, -1, 12, 3, 1, 1, 3, -.0011298790341243148, .2755252122879028, .5432729125022888, 0, 2, 7, 13, 5, 3, -1, 7, 14, 5, 1, 3, .006435615010559559, .4305641949176788, .7069833278656006, 0, 2, 11, 11, 7, 6, -1, 11, 14, 7, 3, 2, -.0568293295800686, .2495242953300476, .5294997096061707, 0, 2, 2, 11, 7, 6, -1, 2, 14, 7, 3, 2, .004066816996783018, .5478553175926208, .2497723996639252, 0, 2, 12, 14, 2, 6, -1, 12, 16, 2, 2, 3, 481647984997835e-19, .3938601016998291, .5706356167793274, 0, 2, 8, 14, 3, 3, -1, 8, 15, 3, 1, 3, .00617950176820159, .440760612487793, .7394766807556152, 0, 2, 11, 0, 3, 5, -1, 12, 0, 1, 5, 3, .006498575210571289, .5445243120193481, .2479152977466583, 0, 2, 6, 1, 4, 9, -1, 8, 1, 2, 9, 2, -.0010211090557277203, .2544766962528229, .5338971018791199, 0, 2, 10, 3, 6, 1, -1, 12, 3, 2, 1, 3, -.005424752831459045, .2718858122825623, .5324069261550903, 0, 2, 8, 8, 3, 4, -1, 8, 10, 3, 2, 2, -.0010559899965301156, .3178288042545319, .553450882434845, 0, 2, 8, 12, 4, 2, -1, 8, 13, 4, 1, 2, .0006646580877713859, .4284219145774841, .6558194160461426, 0, 2, 5, 18, 4, 2, -1, 5, 19, 4, 1, 2, -.00027524109464138746, .5902860760688782, .3810262978076935, 0, 2, 2, 1, 18, 6, -1, 2, 3, 18, 2, 3, .004229320213198662, .381648987531662, .5709385871887207, 0, 2, 6, 0, 3, 2, -1, 7, 0, 1, 2, 3, -.0032868210691958666, .1747743934392929, .5259544253349304, 0, 3, 13, 8, 6, 2, -1, 16, 8, 3, 1, 2, 13, 9, 3, 1, 2, .0001561187964398414, .3601722121238709, .5725612044334412, 0, 2, 6, 10, 3, 6, -1, 6, 13, 3, 3, 2, -7362138148891972e-21, .540185809135437, .3044497072696686, 0, 3, 0, 13, 20, 4, -1, 10, 13, 10, 2, 2, 0, 15, 10, 2, 2, -.014767250046134, .3220770061016083, .5573434829711914, 0, 2, 7, 7, 6, 5, -1, 9, 7, 2, 5, 3, .0244895908981562, .4301528036594391, .6518812775611877, 0, 2, 11, 0, 2, 2, -1, 11, 1, 2, 1, 2, -.000376520911231637, .356458306312561, .5598236918449402, 0, 3, 1, 8, 6, 2, -1, 1, 8, 3, 1, 2, 4, 9, 3, 1, 2, 736576885174145e-20, .3490782976150513, .556189775466919, 0, 3, 0, 2, 20, 2, -1, 10, 2, 10, 1, 2, 0, 3, 10, 1, 2, -.0150999398902059, .1776272058486939, .5335299968719482, 0, 2, 7, 14, 5, 3, -1, 7, 15, 5, 1, 3, -.0038316650316119194, .6149687767028809, .4221394062042236, 0, 3, 7, 13, 6, 6, -1, 10, 13, 3, 3, 2, 7, 16, 3, 3, 2, .0169254001230001, .5413014888763428, .2166585028171539, 0, 2, 9, 12, 2, 3, -1, 9, 13, 2, 1, 3, -.003047785023227334, .6449490785598755, .4354617893695831, 0, 2, 16, 11, 1, 6, -1, 16, 13, 1, 2, 3, .003214058931916952, .5400155186653137, .3523217141628265, 0, 2, 3, 11, 1, 6, -1, 3, 13, 1, 2, 3, -.004002320114523172, .2774524092674255, .5338417291641235, 0, 3, 4, 4, 14, 12, -1, 11, 4, 7, 6, 2, 4, 10, 7, 6, 2, .0074182129465043545, .567673921585083, .3702817857265472, 0, 2, 5, 4, 3, 3, -1, 5, 5, 3, 1, 3, -.008876458741724491, .7749221920967102, .4583688974380493, 0, 2, 12, 3, 3, 3, -1, 13, 3, 1, 3, 3, .002731173997744918, .5338721871376038, .3996661007404327, 0, 2, 6, 6, 8, 3, -1, 6, 7, 8, 1, 3, -.0025082379579544067, .5611963272094727, .377749890089035, 0, 2, 12, 3, 3, 3, -1, 13, 3, 1, 3, 3, -.008054107427597046, .291522890329361, .5179182887077332, 0, 3, 3, 1, 4, 10, -1, 3, 1, 2, 5, 2, 5, 6, 2, 5, 2, -.0009793881326913834, .5536432862281799, .3700192868709564, 0, 2, 5, 7, 10, 2, -1, 5, 7, 5, 2, 2, -.005874590948224068, .3754391074180603, .5679376125335693, 0, 2, 8, 7, 3, 3, -1, 9, 7, 1, 3, 3, -.00449367193505168, .7019699215888977, .4480949938297272, 0, 2, 15, 12, 2, 3, -1, 15, 13, 2, 1, 3, -.00543892290443182, .2310364991426468, .5313386917114258, 0, 2, 7, 8, 3, 4, -1, 8, 8, 1, 4, 3, -.0007509464048780501, .5864868760108948, .4129343032836914, 0, 2, 13, 4, 1, 12, -1, 13, 10, 1, 6, 2, 14528800420521293e-21, .3732407093048096, .5619621276855469, 0, 3, 4, 5, 12, 12, -1, 4, 5, 6, 6, 2, 10, 11, 6, 6, 2, .0407580696046352, .5312091112136841, .2720521986484528, 0, 2, 7, 14, 7, 3, -1, 7, 15, 7, 1, 3, .006650593131780624, .4710015952587128, .6693493723869324, 0, 2, 3, 12, 2, 3, -1, 3, 13, 2, 1, 3, .0045759351924061775, .5167819261550903, .1637275964021683, 0, 3, 3, 2, 14, 2, -1, 10, 2, 7, 1, 2, 3, 3, 7, 1, 2, .0065269311890006065, .5397608876228333, .2938531935214996, 0, 2, 0, 1, 3, 10, -1, 1, 1, 1, 10, 3, -.0136603796854615, .7086488008499146, .453220009803772, 0, 2, 9, 0, 6, 5, -1, 11, 0, 2, 5, 3, .0273588690906763, .5206481218338013, .3589231967926025, 0, 2, 5, 7, 6, 2, -1, 8, 7, 3, 2, 2, .0006219755159690976, .3507075905799866, .5441123247146606, 0, 2, 7, 1, 6, 10, -1, 7, 6, 6, 5, 2, -.0033077080734074116, .5859522819519043, .402489185333252, 0, 2, 1, 1, 18, 3, -1, 7, 1, 6, 3, 3, -.0106311095878482, .6743267178535461, .4422602951526642, 0, 2, 16, 3, 3, 6, -1, 16, 5, 3, 2, 3, .0194416493177414, .5282716155052185, .1797904968261719, 34.55411148071289, 71, 0, 2, 6, 3, 7, 6, -1, 6, 6, 7, 3, 2, -.005505216773599386, .5914731025695801, .2626559138298035, 0, 2, 4, 7, 12, 2, -1, 8, 7, 4, 2, 3, .001956227933987975, .2312581986188889, .5741627216339111, 0, 2, 0, 4, 17, 10, -1, 0, 9, 17, 5, 2, -.008892478421330452, .1656530052423477, .5626654028892517, 0, 2, 3, 4, 15, 16, -1, 3, 12, 15, 8, 2, .0836383774876595, .5423449873924255, .1957294940948486, 0, 2, 7, 15, 6, 4, -1, 7, 17, 6, 2, 2, .0012282270472496748, .3417904078960419, .5992503762245178, 0, 2, 15, 2, 4, 9, -1, 15, 2, 2, 9, 2, .0057629169896245, .3719581961631775, .6079903841018677, 0, 2, 2, 3, 3, 2, -1, 2, 4, 3, 1, 2, -.0016417410224676132, .2577486038208008, .5576915740966797, 0, 2, 13, 6, 7, 9, -1, 13, 9, 7, 3, 3, .0034113149158656597, .2950749099254608, .5514171719551086, 0, 2, 8, 11, 4, 3, -1, 8, 12, 4, 1, 3, -.0110693201422691, .7569358944892883, .4477078914642334, 0, 3, 0, 2, 20, 6, -1, 10, 2, 10, 3, 2, 0, 5, 10, 3, 2, .0348659716546535, .5583708882331848, .2669621109962463, 0, 3, 3, 2, 6, 10, -1, 3, 2, 3, 5, 2, 6, 7, 3, 5, 2, .0006570109981112182, .5627313256263733, .2988890111446381, 0, 2, 13, 10, 3, 4, -1, 13, 12, 3, 2, 2, -.0243391301482916, .2771185040473938, .5108863115310669, 0, 2, 4, 10, 3, 4, -1, 4, 12, 3, 2, 2, .0005943520227447152, .5580651760101318, .3120341897010803, 0, 2, 7, 5, 6, 3, -1, 9, 5, 2, 3, 3, .0022971509024500847, .3330250084400177, .5679075717926025, 0, 2, 7, 6, 6, 8, -1, 7, 10, 6, 4, 2, -.0037801829166710377, .2990534901618958, .5344808101654053, 0, 2, 0, 11, 20, 6, -1, 0, 14, 20, 3, 2, -.13420669734478, .1463858932256699, .5392568111419678, 0, 3, 4, 13, 4, 6, -1, 4, 13, 2, 3, 2, 6, 16, 2, 3, 2, .0007522454834543169, .3746953904628754, .5692734718322754, 0, 3, 6, 0, 8, 12, -1, 10, 0, 4, 6, 2, 6, 6, 4, 6, 2, -.040545541793108, .2754747867584229, .5484297871589661, 0, 2, 2, 0, 15, 2, -1, 2, 1, 15, 1, 2, .0012572970008477569, .3744584023952484, .5756075978279114, 0, 2, 9, 12, 2, 3, -1, 9, 13, 2, 1, 3, -.007424994837492704, .7513859272003174, .4728231132030487, 0, 2, 3, 12, 1, 2, -1, 3, 13, 1, 1, 2, .0005090812919661403, .540489673614502, .2932321131229401, 0, 2, 9, 11, 2, 3, -1, 9, 12, 2, 1, 3, -.001280845026485622, .6169779896736145, .4273349046707153, 0, 2, 7, 3, 3, 1, -1, 8, 3, 1, 1, 3, -.0018348860321566463, .2048496007919312, .5206472277641296, 0, 2, 17, 7, 3, 6, -1, 17, 9, 3, 2, 3, .0274848695844412, .5252984762191772, .1675522029399872, 0, 2, 7, 2, 3, 2, -1, 8, 2, 1, 2, 3, .0022372419480234385, .5267782807350159, .2777658104896545, 0, 2, 11, 4, 5, 3, -1, 11, 5, 5, 1, 3, -.008863529190421104, .69545578956604, .4812048971652985, 0, 2, 4, 4, 5, 3, -1, 4, 5, 5, 1, 3, .004175397101789713, .4291887879371643, .6349195837974548, 0, 2, 19, 3, 1, 2, -1, 19, 4, 1, 1, 2, -.0017098189564421773, .2930536866188049, .5361248850822449, 0, 2, 5, 5, 4, 3, -1, 5, 6, 4, 1, 3, .006532854866236448, .4495325088500977, .7409694194793701, 0, 2, 17, 7, 3, 6, -1, 17, 9, 3, 2, 3, -.009537290781736374, .3149119913578033, .5416501760482788, 0, 2, 0, 7, 3, 6, -1, 0, 9, 3, 2, 3, .0253109894692898, .5121892094612122, .1311707943677902, 0, 2, 14, 2, 6, 9, -1, 14, 5, 6, 3, 3, .0364609695971012, .5175911784172058, .2591339945793152, 0, 2, 0, 4, 5, 6, -1, 0, 6, 5, 2, 3, .0208543296903372, .5137140154838562, .1582316011190414, 0, 2, 10, 5, 6, 2, -1, 12, 5, 2, 2, 3, -.0008720774785615504, .5574309825897217, .439897894859314, 0, 2, 4, 5, 6, 2, -1, 6, 5, 2, 2, 3, -15227000403683633e-21, .5548940896987915, .3708069920539856, 0, 2, 8, 1, 4, 6, -1, 8, 3, 4, 2, 3, -.0008431650931015611, .3387419879436493, .5554211139678955, 0, 2, 0, 2, 3, 6, -1, 0, 4, 3, 2, 3, .0036037859972566366, .5358061790466309, .3411171138286591, 0, 2, 6, 6, 8, 3, -1, 6, 7, 8, 1, 3, -.006805789191275835, .6125202775001526, .4345862865447998, 0, 2, 0, 1, 5, 9, -1, 0, 4, 5, 3, 3, -.0470216609537601, .2358165979385376, .519373893737793, 0, 2, 16, 0, 4, 15, -1, 16, 0, 2, 15, 2, -.0369541086256504, .7323111295700073, .4760943949222565, 0, 2, 1, 10, 3, 2, -1, 1, 11, 3, 1, 2, .0010439479956403375, .5419455170631409, .3411330878734589, 0, 2, 14, 4, 1, 10, -1, 14, 9, 1, 5, 2, -.00021050689974799752, .2821694016456604, .5554947257041931, 0, 2, 0, 1, 4, 12, -1, 2, 1, 2, 12, 2, -.0808315873146057, .9129930138587952, .4697434902191162, 0, 2, 11, 11, 4, 2, -1, 11, 11, 2, 2, 2, -.0003657905908767134, .6022670269012451, .3978292942047119, 0, 2, 5, 11, 4, 2, -1, 7, 11, 2, 2, 2, -.00012545920617412776, .5613213181495667, .384553998708725, 0, 2, 3, 8, 15, 5, -1, 8, 8, 5, 5, 3, -.0687864869832993, .2261611968278885, .5300496816635132, 0, 2, 0, 0, 6, 10, -1, 3, 0, 3, 10, 2, .0124157899990678, .4075691998004913, .5828812122344971, 0, 2, 11, 4, 3, 2, -1, 12, 4, 1, 2, 3, -.004717481788247824, .2827253937721252, .5267757773399353, 0, 2, 8, 12, 3, 8, -1, 8, 16, 3, 4, 2, .0381368584930897, .5074741244316101, .1023615971207619, 0, 2, 8, 14, 5, 3, -1, 8, 15, 5, 1, 3, -.0028168049175292253, .6169006824493408, .4359692931175232, 0, 2, 7, 14, 4, 3, -1, 7, 15, 4, 1, 3, .008130360394716263, .4524433016777039, .76060950756073, 0, 2, 11, 4, 3, 2, -1, 12, 4, 1, 2, 3, .006005601957440376, .5240408778190613, .185971200466156, 0, 3, 3, 15, 14, 4, -1, 3, 15, 7, 2, 2, 10, 17, 7, 2, 2, .0191393196582794, .5209379196166992, .2332071959972382, 0, 3, 2, 2, 16, 4, -1, 10, 2, 8, 2, 2, 2, 4, 8, 2, 2, .0164457596838474, .5450702905654907, .3264234960079193, 0, 2, 0, 8, 6, 12, -1, 3, 8, 3, 12, 2, -.0373568907380104, .6999046802520752, .4533241987228394, 0, 2, 5, 7, 10, 2, -1, 5, 7, 5, 2, 2, -.0197279006242752, .2653664946556091, .54128098487854, 0, 2, 9, 7, 2, 5, -1, 10, 7, 1, 5, 2, .0066972579807043076, .4480566084384918, .7138652205467224, 0, 3, 13, 7, 6, 4, -1, 16, 7, 3, 2, 2, 13, 9, 3, 2, 2, .0007445752853527665, .4231350123882294, .5471320152282715, 0, 2, 0, 13, 8, 2, -1, 0, 14, 8, 1, 2, .0011790640419349074, .5341702103614807, .3130455017089844, 0, 3, 13, 7, 6, 4, -1, 16, 7, 3, 2, 2, 13, 9, 3, 2, 2, .0349806100130081, .5118659734725952, .343053013086319, 0, 3, 1, 7, 6, 4, -1, 1, 7, 3, 2, 2, 4, 9, 3, 2, 2, .0005685979267582297, .3532187044620514, .5468639731407166, 0, 2, 12, 6, 1, 12, -1, 12, 12, 1, 6, 2, -.0113406497985125, .2842353880405426, .5348700881004333, 0, 2, 9, 5, 2, 6, -1, 10, 5, 1, 6, 2, -.00662281084805727, .6883640289306641, .4492664933204651, 0, 2, 14, 12, 2, 3, -1, 14, 13, 2, 1, 3, -.008016033098101616, .1709893941879273, .5224308967590332, 0, 2, 4, 12, 2, 3, -1, 4, 13, 2, 1, 3, .0014206819469109178, .5290846228599548, .299338310956955, 0, 2, 8, 12, 4, 3, -1, 8, 13, 4, 1, 3, -.002780171111226082, .6498854160308838, .4460499882698059, 0, 3, 5, 2, 2, 4, -1, 5, 2, 1, 2, 2, 6, 4, 1, 2, 2, -.0014747589593753219, .3260438144207001, .5388113260269165, 0, 2, 5, 5, 11, 3, -1, 5, 6, 11, 1, 3, -.0238303393125534, .7528941035270691, .4801219999790192, 0, 2, 7, 6, 4, 12, -1, 7, 12, 4, 6, 2, .00693697901442647, .5335165858268738, .3261427879333496, 0, 2, 12, 13, 8, 5, -1, 12, 13, 4, 5, 2, .008280625566840172, .458039402961731, .5737829804420471, 0, 2, 7, 6, 1, 12, -1, 7, 12, 1, 6, 2, -.0104395002126694, .2592320144176483, .5233827829360962, 39.1072883605957, 80, 0, 2, 1, 2, 6, 3, -1, 4, 2, 3, 3, 2, .0072006587870419025, .325888603925705, .6849808096885681, 0, 3, 9, 5, 6, 10, -1, 12, 5, 3, 5, 2, 9, 10, 3, 5, 2, -.002859358908608556, .5838881134986877, .2537829875946045, 0, 3, 5, 5, 8, 12, -1, 5, 5, 4, 6, 2, 9, 11, 4, 6, 2, .0006858052802272141, .5708081722259521, .2812424004077911, 0, 2, 0, 7, 20, 6, -1, 0, 9, 20, 2, 3, .007958019152283669, .2501051127910614, .5544260740280151, 0, 2, 4, 2, 2, 2, -1, 4, 3, 2, 1, 2, -.0012124150525778532, .2385368049144745, .5433350205421448, 0, 2, 4, 18, 12, 2, -1, 8, 18, 4, 2, 3, .00794261321425438, .3955070972442627, .6220757961273193, 0, 2, 7, 4, 4, 16, -1, 7, 12, 4, 8, 2, .0024630590341985226, .5639708042144775, .2992357909679413, 0, 2, 7, 6, 7, 8, -1, 7, 10, 7, 4, 2, -.006039659958332777, .218651294708252, .541167676448822, 0, 2, 6, 3, 3, 1, -1, 7, 3, 1, 1, 3, -.0012988339876756072, .23507060110569, .5364584922790527, 0, 2, 11, 15, 2, 4, -1, 11, 17, 2, 2, 2, .00022299369447864592, .380411297082901, .572960615158081, 0, 2, 3, 5, 4, 8, -1, 3, 9, 4, 4, 2, .0014654280385002494, .2510167956352234, .5258268713951111, 0, 2, 7, 1, 6, 12, -1, 7, 7, 6, 6, 2, -.0008121004211716354, .5992823839187622, .3851158916950226, 0, 2, 4, 6, 6, 2, -1, 6, 6, 2, 2, 3, -.0013836020370945334, .5681396126747131, .3636586964130402, 0, 2, 16, 4, 4, 6, -1, 16, 6, 4, 2, 3, -.0279364492744207, .1491317003965378, .5377560257911682, 0, 2, 3, 3, 5, 2, -1, 3, 4, 5, 1, 2, -.0004691955109592527, .3692429959774017, .5572484731674194, 0, 2, 9, 11, 2, 3, -1, 9, 12, 2, 1, 3, -.004982965998351574, .6758509278297424, .4532504081726074, 0, 2, 2, 16, 4, 2, -1, 2, 17, 4, 1, 2, .001881530974060297, .5368022918701172, .2932539880275726, 0, 3, 7, 13, 6, 6, -1, 10, 13, 3, 3, 2, 7, 16, 3, 3, 2, -.0190675500780344, .1649377048015595, .5330067276954651, 0, 2, 7, 0, 3, 4, -1, 8, 0, 1, 4, 3, -.0046906559728085995, .1963925957679749, .5119361877441406, 0, 2, 8, 15, 4, 3, -1, 8, 16, 4, 1, 3, .005977713968604803, .467117190361023, .7008398175239563, 0, 2, 0, 4, 4, 6, -1, 0, 6, 4, 2, 3, -.0333031304180622, .1155416965484619, .5104162096977234, 0, 2, 5, 6, 12, 3, -1, 9, 6, 4, 3, 3, .0907441079616547, .5149660110473633, .1306173056364059, 0, 2, 7, 6, 6, 14, -1, 9, 6, 2, 14, 3, .0009355589863844216, .3605481088161469, .543985903263092, 0, 2, 9, 7, 3, 3, -1, 10, 7, 1, 3, 3, .0149016501381993, .4886212050914764, .7687569856643677, 0, 2, 6, 12, 2, 4, -1, 6, 14, 2, 2, 2, .0006159411859698594, .5356813073158264, .3240939080715179, 0, 2, 10, 12, 7, 6, -1, 10, 14, 7, 2, 3, -.0506709888577461, .1848621964454651, .5230404138565063, 0, 2, 1, 0, 15, 2, -1, 1, 1, 15, 1, 2, .0006866574985906482, .3840579986572266, .5517945885658264, 0, 2, 14, 0, 6, 6, -1, 14, 0, 3, 6, 2, .008371243253350258, .4288564026355743, .6131753921508789, 0, 2, 5, 3, 3, 1, -1, 6, 3, 1, 1, 3, -.0012953069526702166, .2913674116134644, .528073787689209, 0, 2, 14, 0, 6, 6, -1, 14, 0, 3, 6, 2, -.0419416800141335, .7554799914360046, .4856030941009522, 0, 2, 0, 3, 20, 10, -1, 0, 8, 20, 5, 2, -.0235293805599213, .2838279902935028, .5256081223487854, 0, 2, 14, 0, 6, 6, -1, 14, 0, 3, 6, 2, .0408574491739273, .4870935082435608, .6277297139167786, 0, 2, 0, 0, 6, 6, -1, 3, 0, 3, 6, 2, -.0254068691283464, .7099707722663879, .4575029015541077, 0, 2, 19, 15, 1, 2, -1, 19, 16, 1, 1, 2, -.00041415440500713885, .4030886888504028, .5469412207603455, 0, 2, 0, 2, 4, 8, -1, 2, 2, 2, 8, 2, .0218241196125746, .4502024054527283, .6768701076507568, 0, 3, 2, 1, 18, 4, -1, 11, 1, 9, 2, 2, 2, 3, 9, 2, 2, .0141140399500728, .5442860722541809, .3791700005531311, 0, 2, 8, 12, 1, 2, -1, 8, 13, 1, 1, 2, 6721459067193791e-20, .4200463891029358, .5873476266860962, 0, 3, 5, 2, 10, 6, -1, 10, 2, 5, 3, 2, 5, 5, 5, 3, 2, -.00794176384806633, .3792561888694763, .5585265755653381, 0, 2, 9, 7, 2, 4, -1, 10, 7, 1, 4, 2, -.00721444096416235, .7253103852272034, .4603548943996429, 0, 2, 9, 7, 3, 3, -1, 10, 7, 1, 3, 3, .002581733977422118, .4693301916122437, .5900238752365112, 0, 2, 4, 5, 12, 8, -1, 8, 5, 4, 8, 3, .1340931951999664, .5149213075637817, .1808844953775406, 0, 2, 15, 15, 4, 3, -1, 15, 16, 4, 1, 3, .0022962710354477167, .5399743914604187, .3717867136001587, 0, 2, 8, 18, 3, 1, -1, 9, 18, 1, 1, 3, -.002157584996894002, .2408495992422104, .5148863792419434, 0, 2, 9, 13, 4, 3, -1, 9, 14, 4, 1, 3, -.004919618833810091, .6573588252067566, .4738740026950836, 0, 2, 7, 13, 4, 3, -1, 7, 14, 4, 1, 3, .0016267469618469477, .4192821979522705, .6303114295005798, 0, 2, 19, 15, 1, 2, -1, 19, 16, 1, 1, 2, .00033413388882763684, .5540298223495483, .3702101111412048, 0, 2, 0, 15, 8, 4, -1, 0, 17, 8, 2, 2, -.0266980808228254, .1710917949676514, .5101410746574402, 0, 2, 9, 3, 6, 4, -1, 11, 3, 2, 4, 3, -.0305618792772293, .1904218047857285, .5168793797492981, 0, 2, 8, 14, 4, 3, -1, 8, 15, 4, 1, 3, .002851154888048768, .4447506964206696, .6313853859901428, 0, 2, 3, 14, 14, 6, -1, 3, 16, 14, 2, 3, -.0362114794552326, .2490727007389069, .5377349257469177, 0, 2, 6, 3, 6, 6, -1, 6, 6, 6, 3, 2, -.002411518944427371, .5381243228912354, .3664236962795258, 0, 2, 5, 11, 10, 6, -1, 5, 14, 10, 3, 2, -.0007725320174358785, .5530232191085815, .3541550040245056, 0, 2, 3, 10, 3, 4, -1, 4, 10, 1, 4, 3, .0002948172914329916, .4132699072360992, .5667243003845215, 0, 2, 13, 9, 2, 2, -1, 13, 9, 1, 2, 2, -.006233456078916788, .0987872332334518, .5198668837547302, 0, 2, 5, 3, 6, 4, -1, 7, 3, 2, 4, 3, -.0262747295200825, .0911274924874306, .5028107166290283, 0, 2, 9, 7, 3, 3, -1, 10, 7, 1, 3, 3, .005321226082742214, .4726648926734924, .6222720742225647, 0, 2, 2, 12, 2, 3, -1, 2, 13, 2, 1, 3, -.004112905822694302, .2157457023859024, .5137804746627808, 0, 2, 9, 8, 3, 12, -1, 9, 12, 3, 4, 3, .0032457809429615736, .5410770773887634, .3721776902675629, 0, 3, 3, 14, 4, 6, -1, 3, 14, 2, 3, 2, 5, 17, 2, 3, 2, -.0163597092032433, .7787874937057495, .4685291945934296, 0, 2, 16, 15, 2, 2, -1, 16, 16, 2, 1, 2, .00032166109303943813, .5478987097740173, .4240373969078064, 0, 2, 2, 15, 2, 2, -1, 2, 16, 2, 1, 2, .000644524407107383, .5330560803413391, .3501324951648712, 0, 2, 8, 12, 4, 3, -1, 8, 13, 4, 1, 3, -.0078909732401371, .6923521161079407, .4726569056510925, 0, 2, 0, 7, 20, 1, -1, 10, 7, 10, 1, 2, .048336211591959, .50559002161026, .0757492035627365, 0, 2, 7, 6, 8, 3, -1, 7, 6, 4, 3, 2, -.000751781277358532, .3783741891384125, .5538573861122131, 0, 2, 5, 7, 8, 2, -1, 9, 7, 4, 2, 2, -.002495391061529517, .3081651031970978, .5359612107276917, 0, 2, 9, 7, 3, 5, -1, 10, 7, 1, 5, 3, -.0022385010961443186, .663395881652832, .4649342894554138, 0, 2, 8, 7, 3, 5, -1, 9, 7, 1, 5, 3, -.0017988430336117744, .6596844792366028, .4347187876701355, 0, 2, 11, 1, 3, 5, -1, 12, 1, 1, 5, 3, .008786091580986977, .523183286190033, .2315579950809479, 0, 2, 6, 2, 3, 6, -1, 7, 2, 1, 6, 3, .003671538084745407, .520425021648407, .2977376878261566, 0, 2, 14, 14, 6, 5, -1, 14, 14, 3, 5, 2, -.0353364497423172, .7238878011703491, .4861505031585693, 0, 2, 9, 8, 2, 2, -1, 9, 9, 2, 1, 2, -.0006918924045749009, .3105022013187408, .5229824781417847, 0, 2, 10, 7, 1, 3, -1, 10, 8, 1, 1, 3, -.003394610946998, .3138968050479889, .5210173726081848, 0, 3, 6, 6, 2, 2, -1, 6, 6, 1, 1, 2, 7, 7, 1, 1, 2, .0009856928372755647, .4536580145359039, .6585097908973694, 0, 3, 2, 11, 18, 4, -1, 11, 11, 9, 2, 2, 2, 13, 9, 2, 2, -.0501631014049053, .1804454028606415, .5198916792869568, 0, 3, 6, 6, 2, 2, -1, 6, 6, 1, 1, 2, 7, 7, 1, 1, 2, -.0022367259953171015, .7255702018737793, .4651359021663666, 0, 2, 0, 15, 20, 2, -1, 0, 16, 20, 1, 2, .0007432628772221506, .4412921071052551, .5898545980453491, 0, 2, 4, 14, 2, 3, -1, 4, 15, 2, 1, 3, -.0009348518215119839, .3500052988529205, .5366017818450928, 0, 2, 8, 14, 4, 3, -1, 8, 15, 4, 1, 3, .0174979399889708, .4912194907665253, .8315284848213196, 0, 2, 8, 7, 2, 3, -1, 8, 8, 2, 1, 3, -.0015200000489130616, .3570275902748108, .537056028842926, 0, 2, 9, 10, 2, 3, -1, 9, 11, 2, 1, 3, .0007800394087098539, .4353772103786469, .5967335104942322, 50.61048126220703, 103, 0, 2, 5, 4, 10, 4, -1, 5, 6, 10, 2, 2, -.00999455526471138, .6162583231925964, .3054533004760742, 0, 3, 9, 7, 6, 4, -1, 12, 7, 3, 2, 2, 9, 9, 3, 2, 2, -.001108522992581129, .5818294882774353, .3155578076839447, 0, 2, 4, 7, 3, 6, -1, 4, 9, 3, 2, 3, .001036438043229282, .2552052140235901, .5692911744117737, 0, 3, 11, 15, 4, 4, -1, 13, 15, 2, 2, 2, 11, 17, 2, 2, 2, .000682113110087812, .3685089945793152, .5934931039810181, 0, 2, 7, 8, 4, 2, -1, 7, 9, 4, 1, 2, -.0006805734010413289, .2332392036914825, .5474792122840881, 0, 2, 13, 1, 4, 3, -1, 13, 1, 2, 3, 2, .0002606878988444805, .325745701789856, .5667545795440674, 0, 3, 5, 15, 4, 4, -1, 5, 15, 2, 2, 2, 7, 17, 2, 2, 2, .0005160737200640142, .3744716942310333, .5845472812652588, 0, 2, 9, 5, 4, 7, -1, 9, 5, 2, 7, 2, .0008500752155669034, .3420371115207672, .5522807240486145, 0, 2, 5, 6, 8, 3, -1, 9, 6, 4, 3, 2, -.0018607829697430134, .2804419994354248, .5375424027442932, 0, 2, 9, 9, 2, 2, -1, 9, 10, 2, 1, 2, -.001503397012129426, .2579050958156586, .5498952269554138, 0, 2, 7, 15, 5, 3, -1, 7, 16, 5, 1, 3, .0023478909861296415, .4175156056880951, .6313710808753967, 0, 2, 11, 10, 4, 3, -1, 11, 10, 2, 3, 2, -.00028880240279249847, .5865169763565063, .4052666127681732, 0, 2, 6, 9, 8, 10, -1, 6, 14, 8, 5, 2, .008940547704696655, .5211141109466553, .231865406036377, 0, 2, 10, 11, 6, 2, -1, 10, 11, 3, 2, 2, -.0193277392536402, .2753432989120483, .5241525769233704, 0, 2, 4, 11, 6, 2, -1, 7, 11, 3, 2, 2, -.0002020206011366099, .5722978711128235, .3677195906639099, 0, 2, 11, 3, 8, 1, -1, 11, 3, 4, 1, 2, .002117906929925084, .4466108083724976, .5542430877685547, 0, 2, 6, 3, 3, 2, -1, 7, 3, 1, 2, 3, -.0017743760254234076, .2813253104686737, .5300959944725037, 0, 2, 14, 5, 6, 5, -1, 14, 5, 3, 5, 2, .004223445896059275, .439970999956131, .5795428156852722, 0, 2, 7, 5, 2, 12, -1, 7, 11, 2, 6, 2, -.0143752200528979, .2981117963790894, .5292059183120728, 0, 2, 8, 11, 4, 3, -1, 8, 12, 4, 1, 3, -.0153491804376245, .7705215215682983, .4748171865940094, 0, 2, 4, 1, 2, 3, -1, 5, 1, 1, 3, 2, 15152279956964776e-21, .3718844056129456, .5576897263526917, 0, 2, 18, 3, 2, 6, -1, 18, 5, 2, 2, 3, -.009129391983151436, .3615196049213409, .5286766886711121, 0, 2, 0, 3, 2, 6, -1, 0, 5, 2, 2, 3, .0022512159775942564, .5364704728126526, .3486298024654388, 0, 2, 9, 12, 2, 3, -1, 9, 13, 2, 1, 3, -.0049696918576955795, .6927651762962341, .4676836133003235, 0, 2, 7, 13, 4, 3, -1, 7, 14, 4, 1, 3, -.0128290103748441, .7712153792381287, .4660735130310059, 0, 2, 18, 0, 2, 6, -1, 18, 2, 2, 2, 3, -.009366006590425968, .3374983966350555, .5351287722587585, 0, 2, 0, 0, 2, 6, -1, 0, 2, 2, 2, 3, .0032452319283038378, .5325189828872681, .3289610147476196, 0, 2, 8, 14, 6, 3, -1, 8, 15, 6, 1, 3, -.0117235602810979, .6837652921676636, .4754300117492676, 0, 2, 7, 4, 2, 4, -1, 8, 4, 1, 4, 2, 2925794069597032e-20, .357208788394928, .5360502004623413, 0, 2, 8, 5, 4, 6, -1, 8, 7, 4, 2, 3, -22244219508138485e-21, .5541427135467529, .3552064001560211, 0, 2, 6, 4, 2, 2, -1, 7, 4, 1, 2, 2, .005088150966912508, .5070844292640686, .1256462037563324, 0, 3, 3, 14, 14, 4, -1, 10, 14, 7, 2, 2, 3, 16, 7, 2, 2, .0274296794086695, .5269560217857361, .1625818014144898, 0, 3, 6, 15, 6, 2, -1, 6, 15, 3, 1, 2, 9, 16, 3, 1, 2, -.00641428679227829, .7145588994026184, .4584197103977203, 0, 2, 14, 15, 6, 2, -1, 14, 16, 6, 1, 2, .003347995923832059, .5398612022399902, .3494696915149689, 0, 2, 2, 12, 12, 8, -1, 2, 16, 12, 4, 2, -.0826354920864105, .2439192980527878, .5160226225852966, 0, 2, 7, 7, 7, 2, -1, 7, 8, 7, 1, 2, .0010261740535497665, .3886891901493073, .5767908096313477, 0, 2, 0, 2, 18, 2, -1, 0, 3, 18, 1, 2, -.0016307090409100056, .3389458060264587, .5347700715065002, 0, 2, 9, 6, 2, 5, -1, 9, 6, 1, 5, 2, .0024546680506318808, .4601413905620575, .638724684715271, 0, 2, 7, 5, 3, 8, -1, 8, 5, 1, 8, 3, -.0009947651997208595, .5769879221916199, .4120396077632904, 0, 2, 9, 6, 3, 4, -1, 10, 6, 1, 4, 3, .0154091902077198, .4878709018230438, .7089822292327881, 0, 2, 4, 13, 3, 2, -1, 4, 14, 3, 1, 2, .001178440055809915, .5263553261756897, .2895244956016541, 0, 2, 9, 4, 6, 3, -1, 11, 4, 2, 3, 3, -.0277019198983908, .149882897734642, .5219606757164001, 0, 2, 5, 4, 6, 3, -1, 7, 4, 2, 3, 3, -.0295053999871016, .024893319234252, .4999816119670868, 0, 2, 14, 11, 5, 2, -1, 14, 12, 5, 1, 2, .0004515943001024425, .5464622974395752, .4029662907123566, 0, 2, 1, 2, 6, 9, -1, 3, 2, 2, 9, 3, .007177263963967562, .4271056950092316, .5866296887397766, 0, 2, 14, 6, 6, 13, -1, 14, 6, 3, 13, 2, -.0741820484399796, .6874179244041443, .4919027984142304, 0, 3, 3, 6, 14, 8, -1, 3, 6, 7, 4, 2, 10, 10, 7, 4, 2, -.0172541607171297, .3370676040649414, .534873902797699, 0, 2, 16, 0, 4, 11, -1, 16, 0, 2, 11, 2, .0148515598848462, .4626792967319489, .6129904985427856, 0, 3, 3, 4, 12, 12, -1, 3, 4, 6, 6, 2, 9, 10, 6, 6, 2, .0100020002573729, .5346122980117798, .3423453867435455, 0, 2, 11, 4, 5, 3, -1, 11, 5, 5, 1, 3, .0020138120744377375, .4643830060958862, .5824304223060608, 0, 2, 4, 11, 4, 2, -1, 4, 12, 4, 1, 2, .0015135470312088728, .5196396112442017, .2856149971485138, 0, 2, 10, 7, 2, 2, -1, 10, 7, 1, 2, 2, .003138143103569746, .4838162958621979, .5958529710769653, 0, 2, 8, 7, 2, 2, -1, 9, 7, 1, 2, 2, -.005145044066011906, .8920302987098694, .4741412103176117, 0, 2, 9, 17, 3, 2, -1, 10, 17, 1, 2, 3, -.004473670851439238, .2033942937850952, .5337278842926025, 0, 2, 5, 6, 3, 3, -1, 5, 7, 3, 1, 3, .001962847076356411, .457163393497467, .6725863218307495, 0, 2, 10, 0, 3, 3, -1, 11, 0, 1, 3, 3, .005426045041531324, .5271108150482178, .2845670878887177, 0, 3, 5, 6, 6, 2, -1, 5, 6, 3, 1, 2, 8, 7, 3, 1, 2, .0004961146041750908, .4138312935829163, .5718597769737244, 0, 2, 12, 16, 4, 3, -1, 12, 17, 4, 1, 3, .009372878819704056, .5225151181221008, .2804847061634064, 0, 2, 3, 12, 3, 2, -1, 3, 13, 3, 1, 2, .0006050089723430574, .523676872253418, .3314523994922638, 0, 2, 9, 12, 3, 2, -1, 9, 13, 3, 1, 2, .0005679255118593574, .4531059861183167, .6276971101760864, 0, 3, 1, 11, 16, 4, -1, 1, 11, 8, 2, 2, 9, 13, 8, 2, 2, .0246443394571543, .5130851864814758, .2017143964767456, 0, 2, 12, 4, 3, 3, -1, 12, 5, 3, 1, 3, -.0102904504165053, .7786595225334167, .4876641035079956, 0, 2, 4, 4, 5, 3, -1, 4, 5, 5, 1, 3, .002062941901385784, .4288598895072937, .5881264209747314, 0, 2, 12, 16, 4, 3, -1, 12, 17, 4, 1, 3, -.005051948130130768, .3523977994918823, .5286008715629578, 0, 2, 5, 4, 3, 3, -1, 5, 5, 3, 1, 3, -.0057692620903253555, .6841086149215698, .4588094055652618, 0, 2, 9, 0, 2, 2, -1, 9, 1, 2, 1, 2, -.0004578994121402502, .356552004814148, .5485978126525879, 0, 2, 8, 9, 4, 2, -1, 8, 10, 4, 1, 2, -.0007591883768327534, .336879312992096, .5254197120666504, 0, 2, 8, 8, 4, 3, -1, 8, 9, 4, 1, 3, -.001773725962266326, .3422161042690277, .5454015135765076, 0, 2, 0, 13, 6, 3, -1, 2, 13, 2, 3, 3, -.008561046794056892, .6533612012863159, .4485856890678406, 0, 2, 16, 14, 3, 2, -1, 16, 15, 3, 1, 2, .0017277270089834929, .5307580232620239, .3925352990627289, 0, 2, 1, 18, 18, 2, -1, 7, 18, 6, 2, 3, -.0281996093690395, .685745894908905, .4588584005832672, 0, 2, 16, 14, 3, 2, -1, 16, 15, 3, 1, 2, -.001778110978193581, .4037851095199585, .5369856953620911, 0, 2, 1, 14, 3, 2, -1, 1, 15, 3, 1, 2, .00033177141449414194, .539979875087738, .3705750107765198, 0, 2, 7, 14, 6, 3, -1, 7, 15, 6, 1, 3, .0026385399978607893, .4665437042713165, .6452730894088745, 0, 2, 5, 14, 8, 3, -1, 5, 15, 8, 1, 3, -.0021183069329708815, .5914781093597412, .4064677059650421, 0, 2, 10, 6, 4, 14, -1, 10, 6, 2, 14, 2, -.0147732896730304, .3642038106918335, .5294762849807739, 0, 2, 6, 6, 4, 14, -1, 8, 6, 2, 14, 2, -.0168154407292604, .2664231956005096, .5144972801208496, 0, 2, 13, 5, 2, 3, -1, 13, 6, 2, 1, 3, -.006337014026939869, .6779531240463257, .4852097928524017, 0, 2, 7, 16, 6, 1, -1, 9, 16, 2, 1, 3, -44560048991115764e-21, .5613964796066284, .4153054058551788, 0, 2, 9, 12, 3, 3, -1, 9, 13, 3, 1, 3, -.0010240620467811823, .5964478254318237, .4566304087638855, 0, 2, 7, 0, 3, 3, -1, 8, 0, 1, 3, 3, -.00231616897508502, .2976115047931671, .5188159942626953, 0, 2, 4, 0, 16, 18, -1, 4, 9, 16, 9, 2, .5321757197380066, .5187839269638062, .220263198018074, 0, 2, 1, 1, 16, 14, -1, 1, 8, 16, 7, 2, -.1664305031299591, .1866022944450378, .5060343146324158, 0, 2, 3, 9, 15, 4, -1, 8, 9, 5, 4, 3, .112535297870636, .5212125182151794, .1185022965073586, 0, 2, 6, 12, 7, 3, -1, 6, 13, 7, 1, 3, .009304686449468136, .4589937031269074, .6826149225234985, 0, 2, 14, 15, 2, 3, -1, 14, 16, 2, 1, 3, -.004625509958714247, .3079940974712372, .5225008726119995, 0, 3, 2, 3, 16, 14, -1, 2, 3, 8, 7, 2, 10, 10, 8, 7, 2, -.1111646965146065, .2101044058799744, .5080801844596863, 0, 3, 16, 2, 4, 18, -1, 18, 2, 2, 9, 2, 16, 11, 2, 9, 2, -.0108884396031499, .5765355229377747, .4790464043617249, 0, 2, 4, 15, 2, 3, -1, 4, 16, 2, 1, 3, .005856430158019066, .5065100193023682, .1563598960638046, 0, 3, 16, 2, 4, 18, -1, 18, 2, 2, 9, 2, 16, 11, 2, 9, 2, .0548543892800808, .49669149518013, .7230510711669922, 0, 2, 1, 1, 8, 3, -1, 1, 2, 8, 1, 3, -.0111973397433758, .2194979041814804, .5098798274993896, 0, 2, 8, 11, 4, 3, -1, 8, 12, 4, 1, 3, .004406907130032778, .4778401851654053, .6770902872085571, 0, 2, 5, 11, 5, 9, -1, 5, 14, 5, 3, 3, -.0636652931571007, .1936362981796265, .5081024169921875, 0, 2, 16, 0, 4, 11, -1, 16, 0, 2, 11, 2, -.009808149188756943, .599906325340271, .4810341000556946, 0, 2, 7, 0, 6, 1, -1, 9, 0, 2, 1, 3, -.0021717099007219076, .3338333964347839, .5235472917556763, 0, 2, 16, 3, 3, 7, -1, 17, 3, 1, 7, 3, -.0133155202493072, .6617069840431213, .4919213056564331, 0, 2, 1, 3, 3, 7, -1, 2, 3, 1, 7, 3, .002544207964092493, .4488744139671326, .6082184910774231, 0, 2, 7, 8, 6, 12, -1, 7, 12, 6, 4, 3, .0120378397405148, .540939211845398, .3292432129383087, 0, 2, 0, 0, 4, 11, -1, 2, 0, 2, 11, 2, -.0207010507583618, .6819120049476624, .4594995975494385, 0, 2, 14, 0, 6, 20, -1, 14, 0, 3, 20, 2, .0276082791388035, .4630792140960693, .5767282843589783, 0, 2, 0, 3, 1, 2, -1, 0, 4, 1, 1, 2, .0012370620388537645, .5165379047393799, .2635016143321991, 0, 3, 5, 5, 10, 8, -1, 10, 5, 5, 4, 2, 5, 9, 5, 4, 2, -.037669338285923, .2536393105983734, .5278980135917664, 0, 3, 4, 7, 12, 4, -1, 4, 7, 6, 2, 2, 10, 9, 6, 2, 2, -.0018057259730994701, .3985156118869782, .5517500042915344, 54.62007141113281, 111, 0, 2, 2, 1, 6, 4, -1, 5, 1, 3, 4, 2, .004429902881383896, .2891018092632294, .633522629737854, 0, 3, 9, 7, 6, 4, -1, 12, 7, 3, 2, 2, 9, 9, 3, 2, 2, -.0023813319858163595, .621178925037384, .3477487862110138, 0, 2, 5, 6, 2, 6, -1, 5, 9, 2, 3, 2, .0022915711160749197, .2254412025213242, .5582118034362793, 0, 3, 9, 16, 6, 4, -1, 12, 16, 3, 2, 2, 9, 18, 3, 2, 2, .0009945794008672237, .3711710870265961, .5930070877075195, 0, 2, 9, 4, 2, 12, -1, 9, 10, 2, 6, 2, .0007716466789133847, .565172016620636, .334799587726593, 0, 2, 7, 1, 6, 18, -1, 9, 1, 2, 18, 3, -.001138641033321619, .3069126009941101, .5508630871772766, 0, 2, 4, 12, 12, 2, -1, 8, 12, 4, 2, 3, -.0001640303962631151, .576282799243927, .3699047863483429, 0, 2, 8, 8, 6, 2, -1, 8, 9, 6, 1, 2, 29793529392918572e-21, .2644244134426117, .5437911152839661, 0, 2, 8, 0, 3, 6, -1, 9, 0, 1, 6, 3, .008577490225434303, .5051138997077942, .1795724928379059, 0, 2, 11, 18, 3, 2, -1, 11, 19, 3, 1, 2, -.0002603268949314952, .5826969146728516, .4446826875209808, 0, 2, 1, 1, 17, 4, -1, 1, 3, 17, 2, 2, -.006140463054180145, .3113852143287659, .5346971750259399, 0, 2, 11, 8, 4, 12, -1, 11, 8, 2, 12, 2, -.0230869501829147, .32779461145401, .533119797706604, 0, 2, 8, 14, 4, 3, -1, 8, 15, 4, 1, 3, -.0142436502501369, .7381709814071655, .4588063061237335, 0, 2, 12, 3, 2, 17, -1, 12, 3, 1, 17, 2, .0194871295243502, .5256630778312683, .2274471968412399, 0, 2, 4, 7, 6, 1, -1, 6, 7, 2, 1, 3, -.0009668110869824886, .5511230826377869, .3815006911754608, 0, 2, 18, 3, 2, 3, -1, 18, 4, 2, 1, 3, .003147470997646451, .5425636768341064, .2543726861476898, 0, 2, 8, 4, 3, 4, -1, 8, 6, 3, 2, 2, -.00018026070029009134, .5380191802978516, .3406304121017456, 0, 2, 4, 5, 12, 10, -1, 4, 10, 12, 5, 2, -.006026626098901033, .3035801947116852, .54205721616745, 0, 2, 5, 18, 4, 2, -1, 7, 18, 2, 2, 2, .00044462960795499384, .3990997076034546, .5660110116004944, 0, 2, 17, 2, 3, 6, -1, 17, 4, 3, 2, 3, .002260976005345583, .5562806725502014, .3940688073635101, 0, 2, 7, 7, 6, 6, -1, 9, 7, 2, 6, 3, .0511330589652061, .4609653949737549, .7118561863899231, 0, 2, 17, 2, 3, 6, -1, 17, 4, 3, 2, 3, -.0177863091230392, .2316166013479233, .5322144031524658, 0, 2, 8, 0, 3, 4, -1, 9, 0, 1, 4, 3, -.004967962857335806, .233077198266983, .5122029185295105, 0, 2, 9, 14, 2, 3, -1, 9, 15, 2, 1, 3, .002066768938675523, .4657444059848785, .6455488204956055, 0, 2, 0, 12, 6, 3, -1, 0, 13, 6, 1, 3, .007441376801580191, .5154392123222351, .236163392663002, 0, 2, 8, 14, 4, 3, -1, 8, 15, 4, 1, 3, -.003627727972343564, .6219773292541504, .4476661086082459, 0, 2, 3, 12, 2, 3, -1, 3, 13, 2, 1, 3, -.005353075917810202, .1837355047464371, .5102208256721497, 0, 2, 5, 6, 12, 7, -1, 9, 6, 4, 7, 3, .1453091949224472, .5145987272262573, .1535930931568146, 0, 2, 0, 2, 3, 6, -1, 0, 4, 3, 2, 3, .0024394490756094456, .5343660116195679, .3624661862850189, 0, 2, 14, 6, 1, 3, -1, 14, 7, 1, 1, 3, -.003128339070826769, .6215007901191711, .4845592081546783, 0, 2, 2, 0, 3, 14, -1, 3, 0, 1, 14, 3, .0017940260004252195, .4299261868000031, .5824198126792908, 0, 2, 12, 14, 5, 6, -1, 12, 16, 5, 2, 3, .0362538211047649, .5260334014892578, .1439467966556549, 0, 2, 4, 14, 5, 6, -1, 4, 16, 5, 2, 3, -.005174672231078148, .350653886795044, .5287045240402222, 0, 3, 11, 10, 2, 2, -1, 12, 10, 1, 1, 2, 11, 11, 1, 1, 2, .0006538329762406647, .4809640944004059, .6122040152549744, 0, 2, 5, 0, 3, 14, -1, 6, 0, 1, 14, 3, -.0264802295714617, .1139362007379532, .5045586228370667, 0, 2, 10, 15, 2, 3, -1, 10, 16, 2, 1, 3, -.0030440660193562508, .6352095007896423, .4794734120368958, 0, 2, 0, 2, 2, 3, -1, 0, 3, 2, 1, 3, .0036993520334362984, .5131118297576904, .2498510926961899, 0, 2, 5, 11, 12, 6, -1, 5, 14, 12, 3, 2, -.0003676293126773089, .54213947057724, .3709532022476196, 0, 2, 6, 11, 3, 9, -1, 6, 14, 3, 3, 3, -.041382260620594, .1894959956407547, .5081691741943359, 0, 3, 11, 10, 2, 2, -1, 12, 10, 1, 1, 2, 11, 11, 1, 1, 2, -.0010532729793339968, .645436704158783, .4783608913421631, 0, 2, 5, 6, 1, 3, -1, 5, 7, 1, 1, 3, -.0021648600231856108, .6215031147003174, .449982613325119, 0, 2, 4, 9, 13, 3, -1, 4, 10, 13, 1, 3, -.0005674774874933064, .3712610900402069, .5419334769248962, 0, 2, 1, 7, 15, 6, -1, 6, 7, 5, 6, 3, .173758402466774, .5023643970489502, .1215742006897926, 0, 2, 4, 5, 12, 6, -1, 8, 5, 4, 6, 3, -.0029049699660390615, .3240267932415009, .5381883978843689, 0, 2, 8, 10, 4, 3, -1, 8, 11, 4, 1, 3, .0012299539521336555, .4165507853031158, .5703486204147339, 0, 2, 15, 14, 1, 3, -1, 15, 15, 1, 1, 3, -.0005432923790067434, .3854042887687683, .554754912853241, 0, 2, 1, 11, 5, 3, -1, 1, 12, 5, 1, 3, -.008329725824296474, .2204494029283524, .5097082853317261, 0, 2, 7, 1, 7, 12, -1, 7, 7, 7, 6, 2, -.00010417630255687982, .560706615447998, .4303036034107208, 0, 3, 0, 1, 6, 10, -1, 0, 1, 3, 5, 2, 3, 6, 3, 5, 2, .0312047004699707, .4621657133102417, .6982004046440125, 0, 2, 16, 1, 4, 3, -1, 16, 2, 4, 1, 3, .007894350215792656, .5269594192504883, .226906806230545, 0, 2, 5, 5, 2, 3, -1, 5, 6, 2, 1, 3, -.004364531021565199, .6359223127365112, .4537956118583679, 0, 2, 12, 2, 3, 5, -1, 13, 2, 1, 5, 3, .007679305970668793, .5274767875671387, .274048388004303, 0, 2, 0, 3, 4, 6, -1, 0, 5, 4, 2, 3, -.0254311393946409, .2038519978523254, .5071732997894287, 0, 2, 8, 12, 4, 2, -1, 8, 13, 4, 1, 2, .0008200060110539198, .4587455093860626, .6119868159294128, 0, 2, 8, 18, 3, 1, -1, 9, 18, 1, 1, 3, .002928460016846657, .5071274042129517, .2028204947710037, 0, 3, 11, 10, 2, 2, -1, 12, 10, 1, 1, 2, 11, 11, 1, 1, 2, 4525647091213614e-20, .4812104105949402, .5430821776390076, 0, 3, 7, 10, 2, 2, -1, 7, 10, 1, 1, 2, 8, 11, 1, 1, 2, .0013158309739083052, .4625813961029053, .6779323220252991, 0, 2, 11, 11, 4, 4, -1, 11, 13, 4, 2, 2, .0015870389761403203, .5386291742324829, .3431465029716492, 0, 2, 8, 12, 3, 8, -1, 9, 12, 1, 8, 3, -.0215396601706743, .025942500680685, .5003222823143005, 0, 2, 13, 0, 6, 3, -1, 13, 1, 6, 1, 3, .014334480278194, .5202844738960266, .1590632945299149, 0, 2, 8, 8, 3, 4, -1, 9, 8, 1, 4, 3, -.008388138376176357, .728248119354248, .4648044109344482, 0, 3, 5, 7, 10, 10, -1, 10, 7, 5, 5, 2, 5, 12, 5, 5, 2, .00919068418443203, .556235671043396, .3923191130161285, 0, 3, 3, 18, 8, 2, -1, 3, 18, 4, 1, 2, 7, 19, 4, 1, 2, -.005845305975526571, .6803392767906189, .4629127979278565, 0, 2, 10, 2, 6, 8, -1, 12, 2, 2, 8, 3, -.0547077991068363, .2561671137809753, .5206125974655151, 0, 2, 4, 2, 6, 8, -1, 6, 2, 2, 8, 3, .009114277549088001, .518962025642395, .3053877055644989, 0, 2, 11, 0, 3, 7, -1, 12, 0, 1, 7, 3, -.0155750000849366, .1295074969530106, .5169094800949097, 0, 2, 7, 11, 2, 1, -1, 8, 11, 1, 1, 2, -.0001205060034408234, .5735098123550415, .4230825006961823, 0, 2, 15, 14, 1, 3, -1, 15, 15, 1, 1, 3, .0012273970060050488, .5289878249168396, .4079791903495789, 0, 3, 7, 15, 2, 2, -1, 7, 15, 1, 1, 2, 8, 16, 1, 1, 2, -.0012186600361019373, .6575639843940735, .4574409127235413, 0, 2, 15, 14, 1, 3, -1, 15, 15, 1, 1, 3, -.0033256649039685726, .3628047108650208, .5195019841194153, 0, 2, 6, 0, 3, 7, -1, 7, 0, 1, 7, 3, -.0132883097976446, .1284265965223312, .504348874092102, 0, 2, 18, 1, 2, 7, -1, 18, 1, 1, 7, 2, -.0033839771058410406, .6292240023612976, .475750595331192, 0, 2, 2, 0, 8, 20, -1, 2, 10, 8, 10, 2, -.2195422053337097, .148773193359375, .5065013766288757, 0, 2, 3, 0, 15, 6, -1, 3, 2, 15, 2, 3, .004911170806735754, .425610214471817, .5665838718414307, 0, 2, 4, 3, 12, 2, -1, 4, 4, 12, 1, 2, -.00018744950648397207, .4004144072532654, .5586857199668884, 0, 2, 16, 0, 4, 5, -1, 16, 0, 2, 5, 2, -.00521786417812109, .6009116172790527, .4812706112861633, 0, 2, 7, 0, 3, 4, -1, 8, 0, 1, 4, 3, -.0011111519997939467, .3514933884143829, .5287089943885803, 0, 2, 16, 0, 4, 5, -1, 16, 0, 2, 5, 2, .004403640050441027, .4642275869846344, .5924085974693298, 0, 2, 1, 7, 6, 13, -1, 3, 7, 2, 13, 3, .1229949966073036, .5025529265403748, .0691524818539619, 0, 2, 16, 0, 4, 5, -1, 16, 0, 2, 5, 2, -.0123135102912784, .5884591937065125, .4934012889862061, 0, 2, 0, 0, 4, 5, -1, 2, 0, 2, 5, 2, .004147103987634182, .4372239112854004, .589347779750824, 0, 2, 14, 12, 3, 6, -1, 14, 14, 3, 2, 3, -.003550264984369278, .4327551126480103, .5396270155906677, 0, 2, 3, 12, 3, 6, -1, 3, 14, 3, 2, 3, -.0192242693156004, .1913134008646011, .5068330764770508, 0, 2, 16, 1, 4, 3, -1, 16, 2, 4, 1, 3, .0014395059552043676, .5308178067207336, .424353301525116, 0, 3, 8, 7, 2, 10, -1, 8, 7, 1, 5, 2, 9, 12, 1, 5, 2, -.00677519990131259, .6365395784378052, .4540086090564728, 0, 2, 11, 11, 4, 4, -1, 11, 13, 4, 2, 2, .007011963054537773, .5189834237098694, .302619993686676, 0, 2, 0, 1, 4, 3, -1, 0, 2, 4, 1, 3, .005401465110480785, .5105062127113342, .2557682991027832, 0, 2, 13, 4, 1, 3, -1, 13, 5, 1, 1, 3, .0009027498890645802, .4696914851665497, .5861827731132507, 0, 2, 7, 15, 3, 5, -1, 8, 15, 1, 5, 3, .0114744501188397, .5053645968437195, .152717798948288, 0, 2, 9, 7, 3, 5, -1, 10, 7, 1, 5, 3, -.006702343001961708, .6508980989456177, .4890604019165039, 0, 2, 8, 7, 3, 5, -1, 9, 7, 1, 5, 3, -.0020462959073483944, .6241816878318787, .4514600038528442, 0, 2, 10, 6, 4, 14, -1, 10, 6, 2, 14, 2, -.009995156899094582, .3432781100273132, .5400953888893127, 0, 2, 0, 5, 5, 6, -1, 0, 7, 5, 2, 3, -.0357007086277008, .1878059059381485, .5074077844619751, 0, 2, 9, 5, 6, 4, -1, 9, 5, 3, 4, 2, .0004558456130325794, .3805277049541473, .5402569770812988, 0, 2, 0, 0, 18, 10, -1, 6, 0, 6, 10, 3, -.0542606003582478, .6843714714050293, .4595097005367279, 0, 2, 10, 6, 4, 14, -1, 10, 6, 2, 14, 2, .0060600461438298225, .5502905249595642, .450052797794342, 0, 2, 6, 6, 4, 14, -1, 8, 6, 2, 14, 2, -.006479183211922646, .3368858098983765, .5310757160186768, 0, 2, 13, 4, 1, 3, -1, 13, 5, 1, 1, 3, -.0014939469983801246, .6487640142440796, .4756175875663757, 0, 2, 5, 1, 2, 3, -1, 6, 1, 1, 3, 2, 14610530342906713e-21, .403457909822464, .5451064109802246, 0, 3, 18, 1, 2, 18, -1, 19, 1, 1, 9, 2, 18, 10, 1, 9, 2, -.00723219383507967, .6386873722076416, .4824739992618561, 0, 2, 2, 1, 4, 3, -1, 2, 2, 4, 1, 3, -.004064581822603941, .2986421883106232, .5157335996627808, 0, 3, 18, 1, 2, 18, -1, 19, 1, 1, 9, 2, 18, 10, 1, 9, 2, .0304630808532238, .5022199749946594, .7159956097602844, 0, 3, 1, 14, 4, 6, -1, 1, 14, 2, 3, 2, 3, 17, 2, 3, 2, -.008054491132497787, .6492452025413513, .4619275033473969, 0, 2, 10, 11, 7, 6, -1, 10, 13, 7, 2, 3, .0395051389932632, .5150570869445801, .2450613975524902, 0, 3, 0, 10, 6, 10, -1, 0, 10, 3, 5, 2, 3, 15, 3, 5, 2, .008453020825982094, .4573669135570526, .6394037008285522, 0, 2, 11, 0, 3, 4, -1, 12, 0, 1, 4, 3, -.0011688120430335402, .3865512013435364, .548366129398346, 0, 2, 5, 10, 5, 6, -1, 5, 13, 5, 3, 2, .002807067008689046, .5128579139709473, .2701480090618134, 0, 2, 14, 6, 1, 8, -1, 14, 10, 1, 4, 2, .000473652093205601, .4051581919193268, .5387461185455322, 0, 3, 1, 7, 18, 6, -1, 1, 7, 9, 3, 2, 10, 10, 9, 3, 2, .0117410803213716, .5295950174331665, .3719413876533508, 0, 2, 9, 7, 2, 2, -1, 9, 7, 1, 2, 2, .0031833238899707794, .4789406955242157, .6895126104354858, 0, 2, 5, 9, 4, 5, -1, 7, 9, 2, 5, 2, .0007024150108918548, .5384489297866821, .3918080925941467, 50.16973114013672, 102, 0, 2, 7, 6, 6, 3, -1, 9, 6, 2, 3, 3, .0170599296689034, .3948527872562408, .7142534852027893, 0, 2, 1, 0, 18, 4, -1, 7, 0, 6, 4, 3, .0218408405780792, .3370316028594971, .6090016961097717, 0, 2, 7, 15, 2, 4, -1, 7, 17, 2, 2, 2, .00024520049919374287, .3500576019287109, .5987902283668518, 0, 2, 1, 0, 19, 9, -1, 1, 3, 19, 3, 3, .008327260613441467, .3267528116703033, .5697240829467773, 0, 2, 3, 7, 3, 6, -1, 3, 9, 3, 2, 3, .0005714829894714057, .3044599890708923, .5531656742095947, 0, 3, 13, 7, 4, 4, -1, 15, 7, 2, 2, 2, 13, 9, 2, 2, 2, .0006737398798577487, .3650012016296387, .567263126373291, 0, 3, 3, 7, 4, 4, -1, 3, 7, 2, 2, 2, 5, 9, 2, 2, 2, 3468159047770314e-20, .3313541114330292, .5388727188110352, 0, 2, 9, 6, 10, 8, -1, 9, 10, 10, 4, 2, -.005856339819729328, .2697942852973938, .5498778820037842, 0, 2, 3, 8, 14, 12, -1, 3, 14, 14, 6, 2, .00851022731512785, .5269358158111572, .2762879133224487, 0, 3, 6, 5, 10, 12, -1, 11, 5, 5, 6, 2, 6, 11, 5, 6, 2, -.0698172077536583, .2909603118896484, .5259246826171875, 0, 2, 9, 11, 2, 3, -1, 9, 12, 2, 1, 3, -.0008611367084085941, .5892577171325684, .4073697924613953, 0, 2, 9, 5, 6, 5, -1, 9, 5, 3, 5, 2, .0009714924963191152, .3523564040660858, .5415862202644348, 0, 2, 9, 4, 2, 4, -1, 9, 6, 2, 2, 2, -1472749045206001e-20, .5423017740249634, .3503156006336212, 0, 2, 9, 5, 6, 5, -1, 9, 5, 3, 5, 2, .0484202913939953, .51939457654953, .3411195874214172, 0, 2, 5, 5, 6, 5, -1, 8, 5, 3, 5, 2, .0013257140526548028, .315776914358139, .5335376262664795, 0, 2, 11, 2, 6, 1, -1, 13, 2, 2, 1, 3, 1492214960308047e-20, .4451299905776978, .5536553859710693, 0, 2, 3, 2, 6, 1, -1, 5, 2, 2, 1, 3, -.002717339899390936, .3031741976737976, .5248088836669922, 0, 2, 13, 5, 2, 3, -1, 13, 6, 2, 1, 3, .0029219500720500946, .4781453013420105, .6606041789054871, 0, 2, 0, 10, 1, 4, -1, 0, 12, 1, 2, 2, -.0019804988987743855, .3186308145523071, .5287625193595886, 0, 2, 13, 5, 2, 3, -1, 13, 6, 2, 1, 3, -.004001210909336805, .6413596868515015, .4749928116798401, 0, 2, 8, 18, 3, 2, -1, 9, 18, 1, 2, 3, -.004349199123680592, .1507498025894165, .5098996758460999, 0, 2, 6, 15, 9, 2, -1, 6, 16, 9, 1, 2, .0013490889687091112, .4316158890724182, .5881167054176331, 0, 2, 8, 14, 4, 3, -1, 8, 15, 4, 1, 3, .0185970701277256, .4735553860664368, .9089794158935547, 0, 2, 18, 4, 2, 4, -1, 18, 6, 2, 2, 2, -.001856237999163568, .3553189039230347, .5577837228775024, 0, 2, 5, 5, 2, 3, -1, 5, 6, 2, 1, 3, .002294043079018593, .4500094950199127, .6580877900123596, 0, 2, 15, 16, 3, 2, -1, 15, 17, 3, 1, 2, .00029982850537635386, .5629242062568665, .3975878953933716, 0, 2, 0, 0, 3, 9, -1, 0, 3, 3, 3, 3, .0035455459728837013, .5381547212600708, .3605485856533051, 0, 2, 9, 7, 3, 3, -1, 9, 8, 3, 1, 3, .009610472247004509, .5255997180938721, .1796745955944061, 0, 2, 8, 7, 3, 3, -1, 8, 8, 3, 1, 3, -.0062783220782876015, .227285698056221, .5114030241966248, 0, 2, 9, 5, 2, 6, -1, 9, 5, 1, 6, 2, .0034598479978740215, .4626308083534241, .6608219146728516, 0, 2, 8, 6, 3, 4, -1, 9, 6, 1, 4, 3, -.0013112019514665008, .6317539811134338, .4436857998371124, 0, 3, 7, 6, 8, 12, -1, 11, 6, 4, 6, 2, 7, 12, 4, 6, 2, .002687617903575301, .5421109795570374, .4054022133350372, 0, 3, 5, 6, 8, 12, -1, 5, 6, 4, 6, 2, 9, 12, 4, 6, 2, .003911816980689764, .5358477830886841, .3273454904556274, 0, 2, 12, 4, 3, 3, -1, 12, 5, 3, 1, 3, -.014206450432539, .7793576717376709, .4975781142711639, 0, 2, 2, 16, 3, 2, -1, 2, 17, 3, 1, 2, .0007170552853494883, .5297319889068604, .3560903966426849, 0, 2, 12, 4, 3, 3, -1, 12, 5, 3, 1, 3, .001663501956500113, .467809408903122, .5816481709480286, 0, 2, 2, 12, 6, 6, -1, 2, 14, 6, 2, 3, .0033686188980937004, .5276734232902527, .3446420133113861, 0, 2, 7, 13, 6, 3, -1, 7, 14, 6, 1, 3, .0127995302900672, .4834679961204529, .7472159266471863, 0, 2, 6, 14, 6, 3, -1, 6, 15, 6, 1, 3, .0033901201095432043, .4511859118938446, .6401721239089966, 0, 2, 14, 15, 5, 3, -1, 14, 16, 5, 1, 3, .004707077983766794, .533565878868103, .355522096157074, 0, 2, 5, 4, 3, 3, -1, 5, 5, 3, 1, 3, .0014819339849054813, .4250707030296326, .5772724151611328, 0, 2, 14, 15, 5, 3, -1, 14, 16, 5, 1, 3, -.0069995759986341, .3003320097923279, .5292900204658508, 0, 2, 5, 3, 6, 2, -1, 7, 3, 2, 2, 3, .0159390103071928, .5067319273948669, .1675581932067871, 0, 2, 8, 15, 4, 3, -1, 8, 16, 4, 1, 3, .007637734990566969, .4795069992542267, .7085601091384888, 0, 2, 1, 15, 5, 3, -1, 1, 16, 5, 1, 3, .006733404006808996, .5133113265037537, .2162470072507858, 0, 3, 8, 13, 4, 6, -1, 10, 13, 2, 3, 2, 8, 16, 2, 3, 2, -.012858809903264, .1938841938972473, .525137186050415, 0, 2, 7, 8, 3, 3, -1, 8, 8, 1, 3, 3, -.0006227080011740327, .5686538219451904, .419786810874939, 0, 2, 12, 0, 5, 4, -1, 12, 2, 5, 2, 2, -.0005265168147161603, .4224168956279755, .5429695844650269, 0, 3, 0, 2, 20, 2, -1, 0, 2, 10, 1, 2, 10, 3, 10, 1, 2, .0110750999301672, .5113775134086609, .2514517903327942, 0, 2, 1, 0, 18, 4, -1, 7, 0, 6, 4, 3, -.0367282517254353, .7194662094116211, .4849618971347809, 0, 2, 4, 3, 6, 1, -1, 6, 3, 2, 1, 3, -.00028207109426148236, .3840261995792389, .539444625377655, 0, 2, 4, 18, 13, 2, -1, 4, 19, 13, 1, 2, -.0027489690110087395, .593708872795105, .4569182097911835, 0, 2, 2, 10, 3, 6, -1, 2, 12, 3, 2, 3, .0100475195795298, .5138576030731201, .2802298069000244, 0, 3, 14, 12, 6, 8, -1, 17, 12, 3, 4, 2, 14, 16, 3, 4, 2, -.008149784058332443, .6090037226676941, .4636121094226837, 0, 3, 4, 13, 10, 6, -1, 4, 13, 5, 3, 2, 9, 16, 5, 3, 2, -.006883388850837946, .3458611071109772, .5254660248756409, 0, 2, 14, 12, 1, 2, -1, 14, 13, 1, 1, 2, -140393603942357e-19, .5693104267120361, .4082083106040955, 0, 2, 8, 13, 4, 3, -1, 8, 14, 4, 1, 3, .001549841952510178, .4350537061691284, .5806517004966736, 0, 2, 14, 12, 2, 2, -1, 14, 13, 2, 1, 2, -.006784149911254644, .1468873023986816, .5182775259017944, 0, 2, 4, 12, 2, 2, -1, 4, 13, 2, 1, 2, .00021705629478674382, .5293524265289307, .345617413520813, 0, 2, 8, 12, 9, 2, -1, 8, 13, 9, 1, 2, .00031198898795992136, .4652450978755951, .5942413806915283, 0, 2, 9, 14, 2, 3, -1, 9, 15, 2, 1, 3, .005450753029435873, .4653508961200714, .7024846076965332, 0, 2, 11, 10, 3, 6, -1, 11, 13, 3, 3, 2, -.00025818689027801156, .5497295260429382, .3768967092037201, 0, 2, 5, 6, 9, 12, -1, 5, 12, 9, 6, 2, -.0174425393342972, .3919087946414948, .5457497835159302, 0, 2, 11, 10, 3, 6, -1, 11, 13, 3, 3, 2, -.045343529433012, .1631357073783875, .5154908895492554, 0, 2, 6, 10, 3, 6, -1, 6, 13, 3, 3, 2, .0019190689781680703, .514589786529541, .2791895866394043, 0, 2, 5, 4, 11, 3, -1, 5, 5, 11, 1, 3, -.006017786916345358, .6517636179924011, .4756332933902741, 0, 2, 7, 1, 5, 10, -1, 7, 6, 5, 5, 2, -.004072073847055435, .5514652729034424, .4092685878276825, 0, 2, 2, 8, 18, 2, -1, 2, 9, 18, 1, 2, .00039855059003457427, .316524088382721, .5285550951957703, 0, 2, 7, 17, 5, 3, -1, 7, 18, 5, 1, 3, -.0065418570302426815, .6853377819061279, .4652808904647827, 0, 2, 5, 9, 12, 1, -1, 9, 9, 4, 1, 3, .003484508953988552, .5484588146209717, .4502759873867035, 0, 3, 0, 14, 6, 6, -1, 0, 14, 3, 3, 2, 3, 17, 3, 3, 2, -.0136967804282904, .6395779848098755, .4572555124759674, 0, 2, 5, 9, 12, 1, -1, 9, 9, 4, 1, 3, -.017347140237689, .2751072943210602, .5181614756584167, 0, 2, 3, 9, 12, 1, -1, 7, 9, 4, 1, 3, -.004088542889803648, .3325636088848114, .5194984078407288, 0, 2, 14, 10, 6, 7, -1, 14, 10, 3, 7, 2, -.009468790143728256, .5942280888557434, .485181987285614, 0, 2, 1, 0, 16, 2, -1, 1, 1, 16, 1, 2, .0017084840219467878, .4167110919952393, .5519806146621704, 0, 2, 10, 9, 10, 9, -1, 10, 12, 10, 3, 3, .009480909444391727, .5433894991874695, .4208514988422394, 0, 2, 0, 1, 10, 2, -1, 5, 1, 5, 2, 2, -.004738965071737766, .6407189965248108, .4560655057430267, 0, 2, 17, 3, 2, 3, -1, 17, 4, 2, 1, 3, .006576105020940304, .5214555263519287, .2258227020502091, 0, 2, 1, 3, 2, 3, -1, 1, 4, 2, 1, 3, -.0021690549328923225, .3151527941226959, .5156704783439636, 0, 2, 9, 7, 3, 6, -1, 10, 7, 1, 6, 3, .014660170301795, .4870837032794952, .668994128704071, 0, 2, 6, 5, 4, 3, -1, 8, 5, 2, 3, 2, .00017231999663636088, .3569748997688294, .5251078009605408, 0, 2, 7, 5, 6, 6, -1, 9, 5, 2, 6, 3, -.0218037609010935, .8825920820236206, .496632993221283, 0, 3, 3, 4, 12, 12, -1, 3, 4, 6, 6, 2, 9, 10, 6, 6, 2, -.0947361066937447, .1446162015199661, .5061113834381104, 0, 2, 9, 2, 6, 15, -1, 11, 2, 2, 15, 3, .0055825551971793175, .5396478772163391, .4238066077232361, 0, 2, 2, 2, 6, 17, -1, 4, 2, 2, 17, 3, .001951709040440619, .4170410931110382, .5497786998748779, 0, 2, 14, 10, 6, 7, -1, 14, 10, 3, 7, 2, .0121499001979828, .4698367118835449, .5664274096488953, 0, 2, 0, 10, 6, 7, -1, 3, 10, 3, 7, 2, -.007516962010413408, .6267772912979126, .4463135898113251, 0, 2, 9, 2, 6, 15, -1, 11, 2, 2, 15, 3, -.0716679096221924, .3097011148929596, .5221003293991089, 0, 2, 5, 2, 6, 15, -1, 7, 2, 2, 15, 3, -.0882924199104309, .0811238884925842, .5006365180015564, 0, 2, 17, 9, 3, 6, -1, 17, 11, 3, 2, 3, .0310630798339844, .5155503749847412, .1282255947589874, 0, 2, 6, 7, 6, 6, -1, 8, 7, 2, 6, 3, .0466218404471874, .4699777960777283, .736396074295044, 0, 3, 1, 10, 18, 6, -1, 10, 10, 9, 3, 2, 1, 13, 9, 3, 2, -.0121894897893071, .3920530080795288, .5518996715545654, 0, 2, 0, 9, 10, 9, -1, 0, 12, 10, 3, 3, .0130161102861166, .5260658264160156, .3685136139392853, 0, 2, 8, 15, 4, 3, -1, 8, 16, 4, 1, 3, -.003495289944112301, .6339294910430908, .4716280996799469, 0, 2, 5, 12, 3, 4, -1, 5, 14, 3, 2, 2, -4401503974804655e-20, .5333027243614197, .3776184916496277, 0, 2, 3, 3, 16, 12, -1, 3, 9, 16, 6, 2, -.1096649020910263, .1765342056751251, .5198346972465515, 0, 3, 1, 1, 12, 12, -1, 1, 1, 6, 6, 2, 7, 7, 6, 6, 2, -.0009027955820783973, .5324159860610962, .3838908076286316, 0, 3, 10, 4, 2, 4, -1, 11, 4, 1, 2, 2, 10, 6, 1, 2, 2, .0007112664170563221, .4647929966449738, .5755224227905273, 0, 3, 0, 9, 10, 2, -1, 0, 9, 5, 1, 2, 5, 10, 5, 1, 2, -.003125027986243367, .323670893907547, .5166770815849304, 0, 2, 9, 11, 3, 3, -1, 9, 12, 3, 1, 3, .002414467977359891, .4787439107894898, .6459717750549316, 0, 2, 3, 12, 9, 2, -1, 3, 13, 9, 1, 2, .00044391240226104856, .4409308135509491, .6010255813598633, 0, 2, 9, 9, 2, 2, -1, 9, 10, 2, 1, 2, -.0002261118934256956, .4038113951683044, .5493255853652954, 66.66912078857422, 135, 0, 2, 3, 4, 13, 6, -1, 3, 6, 13, 2, 3, -.0469012893736362, .660017192363739, .3743801116943359, 0, 3, 9, 7, 6, 4, -1, 12, 7, 3, 2, 2, 9, 9, 3, 2, 2, -.001456834957934916, .578399121761322, .3437797129154205, 0, 2, 1, 0, 6, 8, -1, 4, 0, 3, 8, 2, .005559836979955435, .3622266948223114, .5908216238021851, 0, 2, 9, 5, 2, 12, -1, 9, 11, 2, 6, 2, .0007317048730328679, .550041913986206, .2873558104038239, 0, 2, 4, 4, 3, 10, -1, 4, 9, 3, 5, 2, .001331800944171846, .267316997051239, .5431019067764282, 0, 2, 6, 17, 8, 3, -1, 6, 18, 8, 1, 3, .00024347059661522508, .3855027854442596, .574138879776001, 0, 2, 0, 5, 10, 6, -1, 0, 7, 10, 2, 3, -.0030512469820678234, .5503209829330444, .3462845087051392, 0, 2, 13, 2, 3, 2, -1, 13, 3, 3, 1, 2, -.0006865719915367663, .3291221857070923, .5429509282112122, 0, 2, 7, 5, 4, 5, -1, 9, 5, 2, 5, 2, .001466820016503334, .3588382005691528, .5351811051368713, 0, 2, 12, 14, 3, 6, -1, 12, 16, 3, 2, 3, .0003202187072020024, .429684191942215, .5700234174728394, 0, 2, 1, 11, 8, 2, -1, 1, 12, 8, 1, 2, .0007412218837998807, .5282164812088013, .3366870880126953, 0, 2, 7, 13, 6, 3, -1, 7, 14, 6, 1, 3, .0038330298848450184, .4559567868709564, .6257336139678955, 0, 2, 0, 5, 3, 6, -1, 0, 7, 3, 2, 3, -.0154564399272203, .2350116968154907, .512945294380188, 0, 2, 13, 2, 3, 2, -1, 13, 3, 3, 1, 2, .002679677912965417, .5329415202140808, .4155062139034271, 0, 3, 4, 14, 4, 6, -1, 4, 14, 2, 3, 2, 6, 17, 2, 3, 2, .0028296569362282753, .4273087978363037, .5804538130760193, 0, 2, 13, 2, 3, 2, -1, 13, 3, 3, 1, 2, -.0039444249123334885, .2912611961364746, .5202686190605164, 0, 2, 8, 2, 4, 12, -1, 8, 6, 4, 4, 3, .002717955969274044, .5307688117027283, .3585677146911621, 0, 3, 14, 0, 6, 8, -1, 17, 0, 3, 4, 2, 14, 4, 3, 4, 2, .005907762795686722, .470377504825592, .5941585898399353, 0, 2, 7, 17, 3, 2, -1, 8, 17, 1, 2, 3, -.004224034957587719, .2141567021608353, .5088796019554138, 0, 2, 8, 12, 4, 2, -1, 8, 13, 4, 1, 2, .0040725888684391975, .4766413867473602, .6841061115264893, 0, 3, 6, 0, 8, 12, -1, 6, 0, 4, 6, 2, 10, 6, 4, 6, 2, .0101495301350951, .5360798835754395, .3748497068881989, 0, 3, 14, 0, 2, 10, -1, 15, 0, 1, 5, 2, 14, 5, 1, 5, 2, -.00018864999583456665, .5720130205154419, .3853805065155029, 0, 3, 5, 3, 8, 6, -1, 5, 3, 4, 3, 2, 9, 6, 4, 3, 2, -.0048864358104765415, .3693122863769531, .5340958833694458, 0, 3, 14, 0, 6, 10, -1, 17, 0, 3, 5, 2, 14, 5, 3, 5, 2, .0261584799736738, .4962374866008759, .6059989929199219, 0, 2, 9, 14, 1, 2, -1, 9, 15, 1, 1, 2, .0004856075975112617, .4438945949077606, .6012468934059143, 0, 2, 15, 10, 4, 3, -1, 15, 11, 4, 1, 3, .0112687097862363, .5244250297546387, .1840388029813767, 0, 2, 8, 14, 2, 3, -1, 8, 15, 2, 1, 3, -.0028114619199186563, .6060283780097961, .4409897029399872, 0, 3, 3, 13, 14, 4, -1, 10, 13, 7, 2, 2, 3, 15, 7, 2, 2, -.005611272994428873, .3891170918941498, .5589237213134766, 0, 2, 1, 10, 4, 3, -1, 1, 11, 4, 1, 3, .008568009361624718, .5069345831871033, .2062619030475617, 0, 2, 9, 11, 6, 1, -1, 11, 11, 2, 1, 3, -.00038172779022715986, .5882201790809631, .41926109790802, 0, 2, 5, 11, 6, 1, -1, 7, 11, 2, 1, 3, -.00017680290329735726, .5533605813980103, .400336891412735, 0, 2, 3, 5, 16, 15, -1, 3, 10, 16, 5, 3, .006511253770440817, .3310146927833557, .5444191098213196, 0, 2, 6, 12, 4, 2, -1, 8, 12, 2, 2, 2, -6594868318643421e-20, .5433831810951233, .3944905996322632, 0, 3, 4, 4, 12, 10, -1, 10, 4, 6, 5, 2, 4, 9, 6, 5, 2, .006993905175477266, .5600358247756958, .4192714095115662, 0, 2, 8, 6, 3, 4, -1, 9, 6, 1, 4, 3, -.0046744439750909805, .6685466766357422, .4604960978031158, 0, 3, 8, 12, 4, 8, -1, 10, 12, 2, 4, 2, 8, 16, 2, 4, 2, .0115898502990603, .5357121229171753, .2926830053329468, 0, 2, 8, 14, 4, 3, -1, 8, 15, 4, 1, 3, .013007840141654, .4679817855358124, .730746328830719, 0, 2, 12, 2, 3, 2, -1, 13, 2, 1, 2, 3, -.0011008579749614, .3937501013278961, .5415065288543701, 0, 2, 8, 15, 3, 2, -1, 8, 16, 3, 1, 2, .0006047264905646443, .4242376089096069, .5604041218757629, 0, 2, 6, 0, 9, 14, -1, 9, 0, 3, 14, 3, -.0144948400557041, .3631210029125214, .5293182730674744, 0, 2, 9, 6, 2, 3, -1, 10, 6, 1, 3, 2, -.005305694881826639, .686045229434967, .4621821045875549, 0, 2, 10, 8, 2, 3, -1, 10, 9, 2, 1, 3, -.00081829127157107, .3944096863269806, .542043924331665, 0, 2, 0, 9, 4, 6, -1, 0, 11, 4, 2, 3, -.0190775208175182, .1962621957063675, .5037891864776611, 0, 2, 6, 0, 8, 2, -1, 6, 1, 8, 1, 2, .00035549470339901745, .4086259007453919, .5613973140716553, 0, 2, 6, 14, 7, 3, -1, 6, 15, 7, 1, 3, .0019679730758070946, .448912113904953, .5926123261451721, 0, 2, 8, 10, 8, 9, -1, 8, 13, 8, 3, 3, .006918914150446653, .5335925817489624, .3728385865688324, 0, 2, 5, 2, 3, 2, -1, 6, 2, 1, 2, 3, .002987277926877141, .5111321210861206, .2975643873214722, 0, 3, 14, 1, 6, 8, -1, 17, 1, 3, 4, 2, 14, 5, 3, 4, 2, -.006226461846381426, .5541489720344543, .4824537932872772, 0, 3, 0, 1, 6, 8, -1, 0, 1, 3, 4, 2, 3, 5, 3, 4, 2, .013353300280869, .4586423933506012, .6414797902107239, 0, 3, 1, 2, 18, 6, -1, 10, 2, 9, 3, 2, 1, 5, 9, 3, 2, .0335052385926247, .5392425060272217, .3429994881153107, 0, 2, 9, 3, 2, 1, -1, 10, 3, 1, 1, 2, -.0025294460356235504, .1703713983297348, .5013315081596375, 0, 3, 13, 2, 4, 6, -1, 15, 2, 2, 3, 2, 13, 5, 2, 3, 2, -.001280162949115038, .5305461883544922, .4697405099868774, 0, 2, 5, 4, 3, 3, -1, 5, 5, 3, 1, 3, .007068738806992769, .4615545868873596, .643650472164154, 0, 2, 13, 5, 1, 3, -1, 13, 6, 1, 1, 3, .0009688049904070795, .4833599030971527, .6043894290924072, 0, 2, 2, 16, 5, 3, -1, 2, 17, 5, 1, 3, .003964765928685665, .5187637209892273, .323181688785553, 0, 3, 13, 2, 4, 6, -1, 15, 2, 2, 3, 2, 13, 5, 2, 3, 2, -.022057730704546, .4079256951808929, .520098090171814, 0, 3, 3, 2, 4, 6, -1, 3, 2, 2, 3, 2, 5, 5, 2, 3, 2, -.0006690631271339953, .533160924911499, .3815600872039795, 0, 2, 13, 5, 1, 2, -1, 13, 6, 1, 1, 2, -.0006700932863168418, .5655422210693359, .4688901901245117, 0, 2, 5, 5, 2, 2, -1, 5, 6, 2, 1, 2, .000742845528293401, .4534381031990051, .6287400126457214, 0, 2, 13, 9, 2, 2, -1, 13, 9, 1, 2, 2, .0022227810695767403, .5350633263587952, .3303655982017517, 0, 2, 5, 9, 2, 2, -1, 6, 9, 1, 2, 2, -.005413052160292864, .1113687008619309, .500543475151062, 0, 2, 13, 17, 3, 2, -1, 13, 18, 3, 1, 2, -14520040167553816e-21, .5628737807273865, .4325133860111237, 0, 3, 6, 16, 4, 4, -1, 6, 16, 2, 2, 2, 8, 18, 2, 2, 2, .00023369169502984732, .4165835082530975, .5447791218757629, 0, 2, 9, 16, 2, 3, -1, 9, 17, 2, 1, 3, .004289454780519009, .4860391020774841, .6778649091720581, 0, 2, 0, 13, 9, 6, -1, 0, 15, 9, 2, 3, .0059103150852024555, .52623051404953, .3612113893032074, 0, 2, 9, 14, 2, 6, -1, 9, 17, 2, 3, 2, .0129005396738648, .5319377183914185, .32502880692482, 0, 2, 9, 15, 2, 3, -1, 9, 16, 2, 1, 3, .004698297940194607, .461824506521225, .6665925979614258, 0, 2, 1, 10, 18, 6, -1, 1, 12, 18, 2, 3, .0104398597031832, .550567090511322, .3883604109287262, 0, 2, 8, 11, 4, 2, -1, 8, 12, 4, 1, 2, .0030443191062659025, .4697853028774262, .7301844954490662, 0, 2, 7, 9, 6, 2, -1, 7, 10, 6, 1, 2, -.0006159375188872218, .3830839097499847, .5464984178543091, 0, 2, 8, 8, 2, 3, -1, 8, 9, 2, 1, 3, -.0034247159492224455, .256630003452301, .5089530944824219, 0, 2, 17, 5, 3, 4, -1, 18, 5, 1, 4, 3, -.009353856556117535, .6469966173171997, .49407958984375, 0, 2, 1, 19, 18, 1, -1, 7, 19, 6, 1, 3, .0523389987647533, .4745982885360718, .787877082824707, 0, 2, 9, 0, 3, 2, -1, 10, 0, 1, 2, 3, .0035765620414167643, .5306664705276489, .2748498022556305, 0, 2, 1, 8, 1, 6, -1, 1, 10, 1, 2, 3, .0007155531784519553, .541312575340271, .4041908979415894, 0, 2, 12, 17, 8, 3, -1, 12, 17, 4, 3, 2, -.0105166798457503, .6158512234687805, .4815283119678497, 0, 2, 0, 5, 3, 4, -1, 1, 5, 1, 4, 3, .007734792772680521, .4695805907249451, .7028980851173401, 0, 2, 9, 7, 2, 3, -1, 9, 8, 2, 1, 3, -.004322677850723267, .2849566042423248, .5304684042930603, 0, 3, 7, 11, 2, 2, -1, 7, 11, 1, 1, 2, 8, 12, 1, 1, 2, -.0025534399319440126, .7056984901428223, .4688892066478729, 0, 2, 11, 3, 2, 5, -1, 11, 3, 1, 5, 2, .00010268510231981054, .3902932107448578, .5573464035987854, 0, 2, 7, 3, 2, 5, -1, 8, 3, 1, 5, 2, 7139518857002258e-21, .368423193693161, .526398777961731, 0, 2, 15, 13, 2, 3, -1, 15, 14, 2, 1, 3, -.0016711989883333445, .3849175870418549, .5387271046638489, 0, 2, 5, 6, 2, 3, -1, 5, 7, 2, 1, 3, .004926044959574938, .4729771912097931, .7447251081466675, 0, 2, 4, 19, 15, 1, -1, 9, 19, 5, 1, 3, .0043908702209591866, .4809181094169617, .5591921806335449, 0, 2, 1, 19, 15, 1, -1, 6, 19, 5, 1, 3, -.0177936293184757, .6903678178787231, .4676927030086517, 0, 2, 15, 13, 2, 3, -1, 15, 14, 2, 1, 3, .002046966925263405, .5370690226554871, .3308162093162537, 0, 2, 5, 0, 4, 15, -1, 7, 0, 2, 15, 2, .0298914890736341, .5139865279197693, .3309059143066406, 0, 2, 9, 6, 2, 5, -1, 9, 6, 1, 5, 2, .0015494900289922953, .466023713350296, .6078342795372009, 0, 2, 9, 5, 2, 7, -1, 10, 5, 1, 7, 2, .001495696953497827, .4404835999011993, .5863919854164124, 0, 2, 16, 11, 3, 3, -1, 16, 12, 3, 1, 3, .0009588592802174389, .5435971021652222, .4208523035049439, 0, 2, 1, 11, 3, 3, -1, 1, 12, 3, 1, 3, .0004964370164088905, .5370578169822693, .4000622034072876, 0, 2, 6, 6, 8, 3, -1, 6, 7, 8, 1, 3, -.00272808107547462, .5659412741661072, .4259642958641052, 0, 2, 0, 15, 6, 2, -1, 0, 16, 6, 1, 2, .0023026480339467525, .5161657929420471, .3350869119167328, 0, 2, 1, 0, 18, 6, -1, 7, 0, 6, 6, 3, .2515163123607636, .4869661927223206, .714730978012085, 0, 2, 6, 0, 3, 4, -1, 7, 0, 1, 4, 3, -.004632802214473486, .27274489402771, .5083789825439453, 0, 3, 14, 10, 4, 10, -1, 16, 10, 2, 5, 2, 14, 15, 2, 5, 2, -.0404344908893108, .6851438879966736, .5021767020225525, 0, 2, 3, 2, 3, 2, -1, 4, 2, 1, 2, 3, 14972220014897175e-21, .428446501493454, .5522555112838745, 0, 2, 11, 2, 2, 2, -1, 11, 3, 2, 1, 2, -.00024050309730228037, .4226118922233582, .5390074849128723, 0, 3, 2, 10, 4, 10, -1, 2, 10, 2, 5, 2, 4, 15, 2, 5, 2, .0236578397452831, .4744631946086884, .7504366040229797, 0, 3, 0, 13, 20, 6, -1, 10, 13, 10, 3, 2, 0, 16, 10, 3, 2, -.00814491044729948, .424505889415741, .5538362860679626, 0, 2, 0, 5, 2, 15, -1, 1, 5, 1, 15, 2, -.003699213033542037, .5952357053756714, .4529713094234467, 0, 3, 1, 7, 18, 4, -1, 10, 7, 9, 2, 2, 1, 9, 9, 2, 2, -.0067718601785600185, .4137794077396393, .5473399758338928, 0, 2, 0, 0, 2, 17, -1, 1, 0, 1, 17, 2, .004266953095793724, .4484114944934845, .5797994136810303, 0, 3, 2, 6, 16, 6, -1, 10, 6, 8, 3, 2, 2, 9, 8, 3, 2, .0017791989957913756, .5624858736991882, .4432444870471954, 0, 2, 8, 14, 1, 3, -1, 8, 15, 1, 1, 3, .0016774770338088274, .4637751877307892, .63642418384552, 0, 2, 8, 15, 4, 2, -1, 8, 16, 4, 1, 2, .0011732629500329494, .4544503092765808, .5914415717124939, 0, 3, 5, 2, 8, 2, -1, 5, 2, 4, 1, 2, 9, 3, 4, 1, 2, .000869981711730361, .5334752798080444, .3885917961597443, 0, 2, 6, 11, 8, 6, -1, 6, 14, 8, 3, 2, .0007637834060005844, .5398585200309753, .374494194984436, 0, 2, 9, 13, 2, 2, -1, 9, 14, 2, 1, 2, .00015684569370932877, .4317873120307922, .5614616274833679, 0, 2, 18, 4, 2, 6, -1, 18, 6, 2, 2, 3, -.0215113703161478, .1785925030708313, .5185542702674866, 0, 2, 9, 12, 2, 2, -1, 9, 13, 2, 1, 2, .00013081369979772717, .4342499077320099, .5682849884033203, 0, 2, 18, 4, 2, 6, -1, 18, 6, 2, 2, 3, .021992040798068, .5161716938018799, .2379394024610519, 0, 2, 9, 13, 1, 3, -1, 9, 14, 1, 1, 3, -.0008013650076463819, .598676323890686, .4466426968574524, 0, 2, 18, 4, 2, 6, -1, 18, 6, 2, 2, 3, -.008273609913885593, .410821795463562, .5251057147979736, 0, 2, 0, 4, 2, 6, -1, 0, 6, 2, 2, 3, .0036831789184361696, .5173814296722412, .339751809835434, 0, 2, 9, 12, 3, 3, -1, 9, 13, 3, 1, 3, -.007952568121254444, .6888983249664307, .4845924079418182, 0, 2, 3, 13, 2, 3, -1, 3, 14, 2, 1, 3, .0015382299898192286, .5178567171096802, .3454113900661469, 0, 2, 13, 13, 4, 3, -1, 13, 14, 4, 1, 3, -.0140435304492712, .1678421050310135, .518866777420044, 0, 2, 5, 4, 3, 3, -1, 5, 5, 3, 1, 3, .0014315890148282051, .436825692653656, .5655773878097534, 0, 2, 5, 2, 10, 6, -1, 5, 4, 10, 2, 3, -.0340142287313938, .7802296280860901, .4959217011928558, 0, 2, 3, 13, 4, 3, -1, 3, 14, 4, 1, 3, -.0120272999629378, .1585101038217545, .503223180770874, 0, 2, 3, 7, 15, 5, -1, 8, 7, 5, 5, 3, .1331661939620972, .5163304805755615, .2755128145217896, 0, 2, 3, 7, 12, 2, -1, 7, 7, 4, 2, 3, -.0015221949433907866, .372831791639328, .5214552283287048, 0, 2, 10, 3, 3, 9, -1, 11, 3, 1, 9, 3, -.000939292716793716, .5838379263877869, .4511165022850037, 0, 2, 8, 6, 4, 6, -1, 10, 6, 2, 6, 2, .0277197398245335, .4728286862373352, .7331544756889343, 0, 2, 9, 7, 4, 3, -1, 9, 8, 4, 1, 3, .003103015013039112, .5302202105522156, .4101563096046448, 0, 2, 0, 9, 4, 9, -1, 2, 9, 2, 9, 2, .0778612196445465, .4998334050178528, .127296194434166, 0, 2, 9, 13, 3, 5, -1, 10, 13, 1, 5, 3, -.0158549398183823, .0508333593606949, .5165656208992004, 0, 2, 7, 7, 6, 3, -1, 9, 7, 2, 3, 3, -.00497253006324172, .6798133850097656, .4684231877326965, 0, 2, 9, 7, 3, 5, -1, 10, 7, 1, 5, 3, -.0009767650626599789, .6010771989822388, .4788931906223297, 0, 2, 5, 7, 8, 2, -1, 9, 7, 4, 2, 2, -.0024647710379213095, .3393397927284241, .5220503807067871, 0, 2, 5, 9, 12, 2, -1, 9, 9, 4, 2, 3, -.006793770007789135, .4365136921405792, .5239663124084473, 0, 2, 5, 6, 10, 3, -1, 10, 6, 5, 3, 2, .0326080210506916, .505272388458252, .2425214946269989, 0, 2, 10, 12, 3, 1, -1, 11, 12, 1, 1, 3, -.0005851442110724747, .5733973979949951, .4758574068546295, 0, 2, 0, 1, 11, 15, -1, 0, 6, 11, 5, 3, -.0296326000243425, .3892289102077484, .5263597965240479, 67.69892120361328, 137, 0, 2, 1, 0, 18, 6, -1, 7, 0, 6, 6, 3, .0465508513152599, .3276950120925903, .6240522861480713, 0, 2, 7, 7, 6, 1, -1, 9, 7, 2, 1, 3, .007953712716698647, .4256485104560852, .6942939162254333, 0, 3, 5, 16, 6, 4, -1, 5, 16, 3, 2, 2, 8, 18, 3, 2, 2, .0006822156137786806, .3711487054824829, .59007328748703, 0, 2, 6, 5, 9, 8, -1, 6, 9, 9, 4, 2, -.00019348249770700932, .2041133940219879, .53005450963974, 0, 2, 5, 10, 2, 6, -1, 5, 13, 2, 3, 2, -.0002671050897333771, .5416126251220703, .3103179037570953, 0, 3, 7, 6, 8, 10, -1, 11, 6, 4, 5, 2, 7, 11, 4, 5, 2, .0027818060480058193, .5277832746505737, .3467069864273071, 0, 3, 5, 6, 8, 10, -1, 5, 6, 4, 5, 2, 9, 11, 4, 5, 2, -.000467790785478428, .5308231115341187, .3294492065906525, 0, 2, 9, 5, 2, 2, -1, 9, 6, 2, 1, 2, -30335160772665404e-21, .577387273311615, .3852097094058991, 0, 2, 5, 12, 8, 2, -1, 5, 13, 8, 1, 2, .0007803800981491804, .4317438900470734, .6150057911872864, 0, 2, 10, 2, 8, 2, -1, 10, 3, 8, 1, 2, -.004255385138094425, .2933903932571411, .5324292778968811, 0, 3, 4, 0, 2, 10, -1, 4, 0, 1, 5, 2, 5, 5, 1, 5, 2, -.0002473561035003513, .5468844771385193, .3843030035495758, 0, 2, 9, 10, 2, 2, -1, 9, 11, 2, 1, 2, -.00014724259381182492, .4281542897224426, .5755587220191956, 0, 2, 2, 8, 15, 3, -1, 2, 9, 15, 1, 3, .0011864770203828812, .374730110168457, .5471466183662415, 0, 2, 8, 13, 4, 3, -1, 8, 14, 4, 1, 3, .0023936580400913954, .4537783861160278, .6111528873443604, 0, 2, 7, 2, 3, 2, -1, 8, 2, 1, 2, 3, -.0015390539774671197, .2971341907978058, .518953800201416, 0, 2, 7, 13, 6, 3, -1, 7, 14, 6, 1, 3, -.007196879014372826, .6699066758155823, .4726476967334747, 0, 2, 9, 9, 2, 2, -1, 9, 10, 2, 1, 2, -.0004149978922214359, .3384954035282135, .5260317921638489, 0, 2, 17, 2, 3, 6, -1, 17, 4, 3, 2, 3, .004435983020812273, .539912223815918, .3920140862464905, 0, 2, 1, 5, 3, 4, -1, 2, 5, 1, 4, 3, .0026606200262904167, .4482578039169312, .6119617819786072, 0, 2, 14, 8, 4, 6, -1, 14, 10, 4, 2, 3, -.0015287200221791863, .3711237907409668, .5340266227722168, 0, 2, 1, 4, 3, 8, -1, 2, 4, 1, 8, 3, -.0047397250309586525, .603108823299408, .4455145001411438, 0, 2, 8, 13, 4, 6, -1, 8, 16, 4, 3, 2, -.0148291299119592, .2838754057884216, .5341861844062805, 0, 2, 3, 14, 2, 2, -1, 3, 15, 2, 1, 2, .0009227555710822344, .5209547281265259, .3361653983592987, 0, 2, 14, 8, 4, 6, -1, 14, 10, 4, 2, 3, .0835298076272011, .5119969844818115, .0811644494533539, 0, 2, 2, 8, 4, 6, -1, 2, 10, 4, 2, 3, -.0007563314866274595, .331712007522583, .5189831256866455, 0, 2, 10, 14, 1, 6, -1, 10, 17, 1, 3, 2, .009840385988354683, .524759829044342, .233495905995369, 0, 2, 7, 5, 3, 6, -1, 8, 5, 1, 6, 3, -.0015953830443322659, .5750094056129456, .4295622110366821, 0, 3, 11, 2, 2, 6, -1, 12, 2, 1, 3, 2, 11, 5, 1, 3, 2, 34766020689858124e-21, .4342445135116577, .5564029216766357, 0, 2, 6, 6, 6, 5, -1, 8, 6, 2, 5, 3, .0298629105091095, .4579147100448608, .6579188108444214, 0, 2, 17, 1, 3, 6, -1, 17, 3, 3, 2, 3, .0113255903124809, .5274311900138855, .3673888146877289, 0, 2, 8, 7, 3, 5, -1, 9, 7, 1, 5, 3, -.008782864548265934, .7100368738174438, .4642167091369629, 0, 2, 9, 18, 3, 2, -1, 10, 18, 1, 2, 3, .004363995976746082, .5279216170310974, .2705877125263214, 0, 2, 8, 18, 3, 2, -1, 9, 18, 1, 2, 3, .004180472809821367, .5072525143623352, .2449083030223846, 0, 2, 12, 3, 5, 2, -1, 12, 4, 5, 1, 2, -.0004566851130221039, .4283105134963989, .5548691153526306, 0, 2, 7, 1, 5, 12, -1, 7, 7, 5, 6, 2, -.0037140368949621916, .5519387722015381, .4103653132915497, 0, 2, 1, 0, 18, 4, -1, 7, 0, 6, 4, 3, -.025304289534688, .6867002248764038, .48698890209198, 0, 2, 4, 2, 2, 2, -1, 4, 3, 2, 1, 2, -.0003445408074185252, .3728874027729034, .528769314289093, 0, 3, 11, 14, 4, 2, -1, 13, 14, 2, 1, 2, 11, 15, 2, 1, 2, -.0008393523166887462, .6060152053833008, .4616062045097351, 0, 2, 0, 2, 3, 6, -1, 0, 4, 3, 2, 3, .0172800496220589, .5049635767936707, .1819823980331421, 0, 2, 9, 7, 2, 3, -1, 9, 8, 2, 1, 3, -.006359507795423269, .1631239950656891, .5232778787612915, 0, 2, 5, 5, 1, 3, -1, 5, 6, 1, 1, 3, .0010298109846189618, .446327805519104, .6176549196243286, 0, 2, 10, 10, 6, 1, -1, 10, 10, 3, 1, 2, .0010117109632119536, .5473384857177734, .4300698935985565, 0, 2, 4, 10, 6, 1, -1, 7, 10, 3, 1, 2, -.010308800265193, .1166985034942627, .5000867247581482, 0, 2, 9, 17, 3, 3, -1, 9, 18, 3, 1, 3, .005468201823532581, .4769287109375, .6719213724136353, 0, 2, 4, 14, 1, 3, -1, 4, 15, 1, 1, 3, -.0009169646073132753, .3471089899539948, .5178164839744568, 0, 2, 12, 5, 3, 3, -1, 12, 6, 3, 1, 3, .002392282010987401, .4785236120223999, .6216310858726501, 0, 2, 4, 5, 12, 3, -1, 4, 6, 12, 1, 3, -.007557381875813007, .5814796090126038, .4410085082054138, 0, 2, 9, 8, 2, 3, -1, 9, 9, 2, 1, 3, -.0007702403236180544, .387800008058548, .546572208404541, 0, 2, 4, 9, 3, 3, -1, 5, 9, 1, 3, 3, -.00871259905397892, .1660051047801971, .4995836019515991, 0, 2, 6, 0, 9, 17, -1, 9, 0, 3, 17, 3, -.0103063201531768, .4093391001224518, .5274233818054199, 0, 2, 9, 12, 1, 3, -1, 9, 13, 1, 1, 3, -.002094097901135683, .6206194758415222, .4572280049324036, 0, 2, 9, 5, 2, 15, -1, 9, 10, 2, 5, 3, .006809905171394348, .5567759275436401, .4155600070953369, 0, 2, 8, 14, 2, 3, -1, 8, 15, 2, 1, 3, -.0010746059706434608, .5638927817344666, .4353024959564209, 0, 2, 10, 14, 1, 3, -1, 10, 15, 1, 1, 3, .0021550289820879698, .4826265871524811, .6749758124351501, 0, 2, 7, 1, 6, 5, -1, 9, 1, 2, 5, 3, .0317423194646835, .5048379898071289, .188324898481369, 0, 2, 0, 0, 20, 2, -1, 0, 0, 10, 2, 2, -.0783827230334282, .2369548976421356, .5260158181190491, 0, 2, 2, 13, 5, 3, -1, 2, 14, 5, 1, 3, .005741511937230825, .5048828721046448, .2776469886302948, 0, 2, 9, 11, 2, 3, -1, 9, 12, 2, 1, 3, -.0029014600440859795, .6238604784011841, .4693317115306854, 0, 2, 2, 5, 9, 15, -1, 2, 10, 9, 5, 3, -.0026427931152284145, .3314141929149628, .5169777274131775, 0, 3, 5, 0, 12, 10, -1, 11, 0, 6, 5, 2, 5, 5, 6, 5, 2, -.1094966009259224, .2380045056343079, .5183441042900085, 0, 2, 5, 1, 2, 3, -1, 6, 1, 1, 3, 2, 7407591328956187e-20, .406963586807251, .5362150073051453, 0, 2, 10, 7, 6, 1, -1, 12, 7, 2, 1, 3, -.0005059380200691521, .5506706237792969, .437459409236908, 0, 3, 3, 1, 2, 10, -1, 3, 1, 1, 5, 2, 4, 6, 1, 5, 2, -.0008213177789002657, .5525709986686707, .4209375977516174, 0, 2, 13, 7, 2, 1, -1, 13, 7, 1, 1, 2, -60276539443293586e-21, .5455474853515625, .4748266041278839, 0, 2, 4, 13, 4, 6, -1, 4, 15, 4, 2, 3, .006806514225900173, .5157995820045471, .3424577116966248, 0, 2, 13, 7, 2, 1, -1, 13, 7, 1, 1, 2, .0017202789895236492, .5013207793235779, .6331263780593872, 0, 2, 5, 7, 2, 1, -1, 6, 7, 1, 1, 2, -.0001301692973356694, .5539718270301819, .4226869940757752, 0, 3, 2, 12, 18, 4, -1, 11, 12, 9, 2, 2, 2, 14, 9, 2, 2, -.004801638890057802, .4425095021724701, .5430780053138733, 0, 3, 5, 7, 2, 2, -1, 5, 7, 1, 1, 2, 6, 8, 1, 1, 2, -.002539931097999215, .7145782113075256, .4697605073451996, 0, 2, 16, 3, 4, 2, -1, 16, 4, 4, 1, 2, -.0014278929447755218, .4070445001125336, .539960503578186, 0, 3, 0, 2, 2, 18, -1, 0, 2, 1, 9, 2, 1, 11, 1, 9, 2, -.0251425504684448, .7884690761566162, .4747352004051209, 0, 3, 1, 2, 18, 4, -1, 10, 2, 9, 2, 2, 1, 4, 9, 2, 2, -.0038899609353393316, .4296191930770874, .5577110052108765, 0, 2, 9, 14, 1, 3, -1, 9, 15, 1, 1, 3, .004394745919853449, .4693162143230438, .702394425868988, 0, 3, 2, 12, 18, 4, -1, 11, 12, 9, 2, 2, 2, 14, 9, 2, 2, .0246784202754498, .5242322087287903, .3812510073184967, 0, 3, 0, 12, 18, 4, -1, 0, 12, 9, 2, 2, 9, 14, 9, 2, 2, .0380476787686348, .5011739730834961, .1687828004360199, 0, 2, 11, 4, 5, 3, -1, 11, 5, 5, 1, 3, .007942486554384232, .4828582108020783, .6369568109512329, 0, 2, 6, 4, 7, 3, -1, 6, 5, 7, 1, 3, -.0015110049862414598, .5906485915184021, .4487667977809906, 0, 2, 13, 17, 3, 3, -1, 13, 18, 3, 1, 3, .0064201741479337215, .5241097807884216, .2990570068359375, 0, 2, 8, 1, 3, 4, -1, 9, 1, 1, 4, 3, -.0029802159406244755, .3041465878486633, .5078489780426025, 0, 2, 11, 4, 2, 4, -1, 11, 4, 1, 4, 2, -.0007458007894456387, .4128139019012451, .5256826281547546, 0, 2, 0, 17, 9, 3, -1, 3, 17, 3, 3, 3, -.0104709500446916, .5808395147323608, .4494296014308929, 0, 3, 11, 0, 2, 8, -1, 12, 0, 1, 4, 2, 11, 4, 1, 4, 2, .009336920455098152, .524655282497406, .265894889831543, 0, 3, 0, 8, 6, 12, -1, 0, 8, 3, 6, 2, 3, 14, 3, 6, 2, .0279369000345469, .4674955010414124, .7087256908416748, 0, 2, 10, 7, 4, 12, -1, 10, 13, 4, 6, 2, .007427767850458622, .5409486889839172, .3758518099784851, 0, 2, 5, 3, 8, 14, -1, 5, 10, 8, 7, 2, -.0235845092684031, .3758639991283417, .5238550901412964, 0, 2, 14, 10, 6, 1, -1, 14, 10, 3, 1, 2, .0011452640173956752, .4329578876495361, .5804247260093689, 0, 2, 0, 4, 10, 4, -1, 0, 6, 10, 2, 2, -.0004346866044215858, .5280618071556091, .3873069882392883, 0, 2, 10, 0, 5, 8, -1, 10, 4, 5, 4, 2, .0106485402211547, .4902113080024719, .5681251883506775, 0, 3, 8, 1, 4, 8, -1, 8, 1, 2, 4, 2, 10, 5, 2, 4, 2, -.0003941805043723434, .5570880174636841, .4318251013755798, 0, 2, 9, 11, 6, 1, -1, 11, 11, 2, 1, 3, -.00013270479394122958, .5658439993858337, .4343554973602295, 0, 2, 8, 9, 3, 4, -1, 9, 9, 1, 4, 3, -.002012551063671708, .6056739091873169, .4537523984909058, 0, 2, 18, 4, 2, 6, -1, 18, 6, 2, 2, 3, .0024854319635778666, .5390477180480957, .4138010144233704, 0, 2, 8, 8, 3, 4, -1, 9, 8, 1, 4, 3, .0018237880431115627, .4354828894138336, .5717188715934753, 0, 2, 7, 1, 13, 3, -1, 7, 2, 13, 1, 3, -.0166566595435143, .3010913133621216, .521612286567688, 0, 2, 7, 13, 6, 1, -1, 9, 13, 2, 1, 3, .0008034955826587975, .5300151109695435, .3818396925926209, 0, 2, 12, 11, 3, 6, -1, 12, 13, 3, 2, 3, .003417037893086672, .5328028798103333, .4241400063037872, 0, 2, 5, 11, 6, 1, -1, 7, 11, 2, 1, 3, -.00036222729249857366, .5491728186607361, .418697714805603, 0, 3, 1, 4, 18, 10, -1, 10, 4, 9, 5, 2, 1, 9, 9, 5, 2, -.1163002029061317, .1440722048282623, .522645115852356, 0, 2, 8, 6, 4, 9, -1, 8, 9, 4, 3, 3, -.0146950101479888, .7747725248336792, .4715717136859894, 0, 2, 8, 6, 4, 3, -1, 8, 7, 4, 1, 3, .0021972130052745342, .5355433821678162, .3315644860267639, 0, 2, 8, 7, 3, 3, -1, 9, 7, 1, 3, 3, -.00046965209185145795, .5767235159873962, .4458136856555939, 0, 2, 14, 15, 4, 3, -1, 14, 16, 4, 1, 3, .006514499895274639, .5215674042701721, .3647888898849487, 0, 2, 5, 10, 3, 10, -1, 6, 10, 1, 10, 3, .0213000606745481, .4994204938411713, .1567950993776321, 0, 2, 8, 15, 4, 3, -1, 8, 16, 4, 1, 3, .0031881409231573343, .4742200076580048, .6287270188331604, 0, 2, 0, 8, 1, 6, -1, 0, 10, 1, 2, 3, .0009001977741718292, .5347954034805298, .394375205039978, 0, 2, 10, 15, 1, 3, -1, 10, 16, 1, 1, 3, -.005177227780222893, .6727191805839539, .5013138055801392, 0, 2, 2, 15, 4, 3, -1, 2, 16, 4, 1, 3, -.004376464989036322, .3106675148010254, .5128793120384216, 0, 3, 18, 3, 2, 8, -1, 19, 3, 1, 4, 2, 18, 7, 1, 4, 2, .002629996044561267, .488631010055542, .5755215883255005, 0, 3, 0, 3, 2, 8, -1, 0, 3, 1, 4, 2, 1, 7, 1, 4, 2, -.002045868895947933, .6025794148445129, .4558076858520508, 0, 3, 3, 7, 14, 10, -1, 10, 7, 7, 5, 2, 3, 12, 7, 5, 2, .0694827064871788, .5240747928619385, .2185259014368057, 0, 2, 0, 7, 19, 3, -1, 0, 8, 19, 1, 3, .0240489393472672, .501186728477478, .2090622037649155, 0, 2, 12, 6, 3, 3, -1, 12, 7, 3, 1, 3, .003109534038230777, .4866712093353272, .7108548283576965, 0, 2, 0, 6, 1, 3, -1, 0, 7, 1, 1, 3, -.00125032605137676, .3407891094684601, .5156195163726807, 0, 2, 12, 6, 3, 3, -1, 12, 7, 3, 1, 3, -.0010281190043315291, .557557225227356, .443943202495575, 0, 2, 5, 6, 3, 3, -1, 5, 7, 3, 1, 3, -.008889362215995789, .6402000784873962, .4620442092418671, 0, 2, 8, 2, 4, 2, -1, 8, 3, 4, 1, 2, -.0006109480164013803, .3766441941261292, .5448899865150452, 0, 2, 6, 3, 4, 12, -1, 8, 3, 2, 12, 2, -.005768635775893927, .3318648934364319, .5133677124977112, 0, 2, 13, 6, 2, 3, -1, 13, 7, 2, 1, 3, .0018506490159779787, .4903570115566254, .6406934857368469, 0, 2, 0, 10, 20, 4, -1, 0, 12, 20, 2, 2, -.0997994691133499, .1536051034927368, .5015562176704407, 0, 2, 2, 0, 17, 14, -1, 2, 7, 17, 7, 2, -.3512834906578064, .0588231310248375, .5174378752708435, 0, 3, 0, 0, 6, 10, -1, 0, 0, 3, 5, 2, 3, 5, 3, 5, 2, -.0452445708215237, .6961488723754883, .4677872955799103, 0, 2, 14, 6, 6, 4, -1, 14, 6, 3, 4, 2, .0714815780520439, .5167986154556274, .1038092970848084, 0, 2, 0, 6, 6, 4, -1, 3, 6, 3, 4, 2, .0021895780228078365, .4273078143596649, .5532060861587524, 0, 2, 13, 2, 7, 2, -1, 13, 3, 7, 1, 2, -.0005924265133216977, .46389439702034, .5276389122009277, 0, 2, 0, 2, 7, 2, -1, 0, 3, 7, 1, 2, .0016788389766588807, .530164897441864, .3932034969329834, 0, 3, 6, 11, 14, 2, -1, 13, 11, 7, 1, 2, 6, 12, 7, 1, 2, -.0022163488902151585, .5630694031715393, .4757033884525299, 0, 3, 8, 5, 2, 2, -1, 8, 5, 1, 1, 2, 9, 6, 1, 1, 2, .00011568699846975505, .4307535886764526, .5535702705383301, 0, 2, 13, 9, 2, 3, -1, 13, 9, 1, 3, 2, -.007201728876680136, .144488200545311, .5193064212799072, 0, 2, 1, 1, 3, 12, -1, 2, 1, 1, 12, 3, .0008908127201721072, .4384432137012482, .5593621134757996, 0, 2, 17, 4, 1, 3, -1, 17, 5, 1, 1, 3, .00019605009583756328, .5340415835380554, .4705956876277924, 0, 2, 2, 4, 1, 3, -1, 2, 5, 1, 1, 3, .0005202214233577251, .5213856101036072, .3810079097747803, 0, 2, 14, 5, 1, 3, -1, 14, 6, 1, 1, 3, .0009458857239224017, .4769414961338043, .6130738854408264, 0, 2, 7, 16, 2, 3, -1, 7, 17, 2, 1, 3, 916984718060121e-19, .4245009124279022, .5429363250732422, 0, 3, 8, 13, 4, 6, -1, 10, 13, 2, 3, 2, 8, 16, 2, 3, 2, .002183320000767708, .5457730889320374, .419107586145401, 0, 2, 5, 5, 1, 3, -1, 5, 6, 1, 1, 3, -.0008603967144154012, .5764588713645935, .4471659958362579, 0, 2, 16, 0, 4, 20, -1, 16, 0, 2, 20, 2, -.0132362395524979, .6372823119163513, .4695009887218475, 0, 3, 5, 1, 2, 6, -1, 5, 1, 1, 3, 2, 6, 4, 1, 3, 2, .0004337670106906444, .5317873954772949, .394582986831665, 69.22987365722656, 140, 0, 2, 5, 4, 10, 4, -1, 5, 6, 10, 2, 2, -.024847149848938, .6555516719818115, .3873311877250671, 0, 2, 15, 2, 4, 12, -1, 15, 2, 2, 12, 2, .006134861148893833, .374807208776474, .5973997712135315, 0, 2, 7, 6, 4, 12, -1, 7, 12, 4, 6, 2, .006449849810451269, .542549192905426, .2548811137676239, 0, 2, 14, 5, 1, 8, -1, 14, 9, 1, 4, 2, .0006349121103994548, .2462442070245743, .5387253761291504, 0, 3, 1, 4, 14, 10, -1, 1, 4, 7, 5, 2, 8, 9, 7, 5, 2, .0014023890253156424, .5594322085380554, .3528657853603363, 0, 3, 11, 6, 6, 14, -1, 14, 6, 3, 7, 2, 11, 13, 3, 7, 2, .0003004400059580803, .3958503901958466, .576593816280365, 0, 3, 3, 6, 6, 14, -1, 3, 6, 3, 7, 2, 6, 13, 3, 7, 2, .00010042409849120304, .3698996901512146, .5534998178482056, 0, 2, 4, 9, 15, 2, -1, 9, 9, 5, 2, 3, -.005084149073809385, .3711090981960297, .5547800064086914, 0, 2, 7, 14, 6, 3, -1, 7, 15, 6, 1, 3, -.0195372607558966, .7492755055427551, .4579297006130219, 0, 3, 6, 3, 14, 4, -1, 13, 3, 7, 2, 2, 6, 5, 7, 2, 2, -7453274065483129e-21, .5649787187576294, .390406996011734, 0, 2, 1, 9, 15, 2, -1, 6, 9, 5, 2, 3, -.0036079459823668003, .3381088078022003, .5267801284790039, 0, 2, 6, 11, 8, 9, -1, 6, 14, 8, 3, 3, .002069750102236867, .5519291162490845, .3714388906955719, 0, 2, 7, 4, 3, 8, -1, 8, 4, 1, 8, 3, -.0004646384040825069, .5608214735984802, .4113566875457764, 0, 2, 14, 6, 2, 6, -1, 14, 9, 2, 3, 2, .0007549045258201659, .3559206128120422, .532935619354248, 0, 3, 5, 7, 6, 4, -1, 5, 7, 3, 2, 2, 8, 9, 3, 2, 2, -.0009832223877310753, .5414795875549316, .3763205111026764, 0, 2, 1, 1, 18, 19, -1, 7, 1, 6, 19, 3, -.0199406407773495, .634790301322937, .4705299139022827, 0, 2, 1, 2, 6, 5, -1, 4, 2, 3, 5, 2, .0037680300883948803, .3913489878177643, .5563716292381287, 0, 2, 12, 17, 6, 2, -1, 12, 18, 6, 1, 2, -.009452850557863712, .2554892897605896, .5215116739273071, 0, 2, 2, 17, 6, 2, -1, 2, 18, 6, 1, 2, .002956084907054901, .5174679160118103, .3063920140266419, 0, 2, 17, 3, 3, 6, -1, 17, 5, 3, 2, 3, .009107873775064945, .5388448238372803, .2885963022708893, 0, 2, 8, 17, 3, 3, -1, 8, 18, 3, 1, 3, .0018219229532405734, .4336043000221252, .58521968126297, 0, 2, 10, 13, 2, 6, -1, 10, 16, 2, 3, 2, .0146887395530939, .5287361741065979, .2870005965232849, 0, 2, 7, 13, 6, 3, -1, 7, 14, 6, 1, 3, -.0143879903480411, .701944887638092, .4647370874881744, 0, 2, 17, 3, 3, 6, -1, 17, 5, 3, 2, 3, -.0189866498112679, .2986552119255066, .5247011780738831, 0, 2, 8, 13, 2, 3, -1, 8, 14, 2, 1, 3, .0011527639580890536, .4323473870754242, .593166172504425, 0, 2, 9, 3, 6, 2, -1, 11, 3, 2, 2, 3, .0109336702153087, .5286864042282104, .3130319118499756, 0, 2, 0, 3, 3, 6, -1, 0, 5, 3, 2, 3, -.0149327302351594, .2658419013023377, .508407711982727, 0, 2, 8, 5, 4, 6, -1, 8, 7, 4, 2, 3, -.0002997053961735219, .5463526844978333, .374072402715683, 0, 2, 5, 5, 3, 2, -1, 5, 6, 3, 1, 2, .004167762119323015, .4703496992588043, .7435721755027771, 0, 2, 10, 1, 3, 4, -1, 11, 1, 1, 4, 3, -.00639053201302886, .2069258987903595, .5280538201332092, 0, 2, 1, 2, 5, 9, -1, 1, 5, 5, 3, 3, .004502960946410894, .518264889717102, .348354309797287, 0, 2, 13, 6, 2, 3, -1, 13, 7, 2, 1, 3, -.009204036556184292, .680377721786499, .4932360053062439, 0, 2, 0, 6, 14, 3, -1, 7, 6, 7, 3, 2, .0813272595405579, .5058398842811584, .2253051996231079, 0, 2, 2, 11, 18, 8, -1, 2, 15, 18, 4, 2, -.150792807340622, .2963424921035767, .5264679789543152, 0, 2, 5, 6, 2, 3, -1, 5, 7, 2, 1, 3, .0033179009333252907, .4655495882034302, .7072932124137878, 0, 3, 10, 6, 4, 2, -1, 12, 6, 2, 1, 2, 10, 7, 2, 1, 2, .0007740280125290155, .4780347943305969, .5668237805366516, 0, 3, 6, 6, 4, 2, -1, 6, 6, 2, 1, 2, 8, 7, 2, 1, 2, .0006819954141974449, .4286996126174927, .5722156763076782, 0, 2, 10, 1, 3, 4, -1, 11, 1, 1, 4, 3, .0053671570494771, .5299307107925415, .3114621937274933, 0, 2, 7, 1, 2, 7, -1, 8, 1, 1, 7, 2, 9701866656541824e-20, .3674638867378235, .5269461870193481, 0, 2, 4, 2, 15, 14, -1, 4, 9, 15, 7, 2, -.1253408938646317, .2351492047309876, .5245791077613831, 0, 2, 8, 7, 3, 2, -1, 9, 7, 1, 2, 3, -.005251626949757338, .7115936875343323, .4693767130374908, 0, 3, 2, 3, 18, 4, -1, 11, 3, 9, 2, 2, 2, 5, 9, 2, 2, -.007834210991859436, .4462651014328003, .5409085750579834, 0, 2, 9, 7, 2, 2, -1, 10, 7, 1, 2, 2, -.001131006982177496, .5945618748664856, .4417662024497986, 0, 2, 13, 9, 2, 3, -1, 13, 9, 1, 3, 2, .0017601120052859187, .5353249907493591, .3973453044891357, 0, 2, 5, 2, 6, 2, -1, 7, 2, 2, 2, 3, -.00081581249833107, .3760268092155457, .5264726877212524, 0, 2, 9, 5, 2, 7, -1, 9, 5, 1, 7, 2, -.003868758911266923, .6309912800788879, .4749819934368134, 0, 2, 5, 9, 2, 3, -1, 6, 9, 1, 3, 2, .0015207129763439298, .5230181813240051, .3361223936080933, 0, 2, 6, 0, 14, 18, -1, 6, 9, 14, 9, 2, .545867383480072, .5167139768600464, .1172635033726692, 0, 2, 2, 16, 6, 3, -1, 2, 17, 6, 1, 3, .0156501904129982, .4979439079761505, .1393294930458069, 0, 2, 9, 7, 3, 6, -1, 10, 7, 1, 6, 3, -.0117318602278829, .7129650712013245, .4921196103096008, 0, 2, 7, 8, 4, 3, -1, 7, 9, 4, 1, 3, -.006176512222737074, .2288102954626083, .5049701929092407, 0, 2, 7, 12, 6, 3, -1, 7, 13, 6, 1, 3, .0022457661107182503, .4632433950901032, .6048725843429565, 0, 2, 9, 12, 2, 3, -1, 9, 13, 2, 1, 3, -.005191586911678314, .6467421054840088, .4602192938327789, 0, 2, 7, 12, 6, 2, -1, 9, 12, 2, 2, 3, -.0238278806209564, .1482000946998596, .5226079225540161, 0, 2, 5, 11, 4, 6, -1, 5, 14, 4, 3, 2, .0010284580057486892, .5135489106178284, .3375957012176514, 0, 2, 11, 12, 7, 2, -1, 11, 13, 7, 1, 2, -.0100788502022624, .2740561068058014, .5303567051887512, 0, 3, 6, 10, 8, 6, -1, 6, 10, 4, 3, 2, 10, 13, 4, 3, 2, .002616893034428358, .533267080783844, .3972454071044922, 0, 2, 11, 10, 3, 4, -1, 11, 12, 3, 2, 2, .000543853675480932, .5365604162216187, .4063411951065064, 0, 2, 9, 16, 2, 3, -1, 9, 17, 2, 1, 3, .005351051222532988, .4653759002685547, .6889045834541321, 0, 2, 13, 3, 1, 9, -1, 13, 6, 1, 3, 3, -.0015274790348485112, .5449501276016235, .3624723851680756, 0, 2, 1, 13, 14, 6, -1, 1, 15, 14, 2, 3, -.0806244164705276, .1656087040901184, .5000287294387817, 0, 2, 13, 6, 1, 6, -1, 13, 9, 1, 3, 2, .0221920292824507, .5132731199264526, .2002808004617691, 0, 2, 0, 4, 3, 8, -1, 1, 4, 1, 8, 3, .007310063112527132, .4617947936058044, .6366536021232605, 0, 2, 18, 0, 2, 18, -1, 18, 0, 1, 18, 2, -.006406307220458984, .5916250944137573, .4867860972881317, 0, 2, 2, 3, 6, 2, -1, 2, 4, 6, 1, 2, -.0007641504053026438, .388840913772583, .5315797924995422, 0, 2, 9, 0, 8, 6, -1, 9, 2, 8, 2, 3, .0007673448999412358, .4159064888954163, .5605279803276062, 0, 2, 6, 6, 1, 6, -1, 6, 9, 1, 3, 2, .0006147450185380876, .3089022040367127, .5120148062705994, 0, 2, 14, 8, 6, 3, -1, 14, 9, 6, 1, 3, -.005010527092963457, .3972199857234955, .5207306146621704, 0, 2, 0, 0, 2, 18, -1, 1, 0, 1, 18, 2, -.008690913207828999, .6257408261299133, .4608575999736786, 0, 3, 1, 18, 18, 2, -1, 10, 18, 9, 1, 2, 1, 19, 9, 1, 2, -.016391459852457, .2085209935903549, .5242266058921814, 0, 2, 3, 15, 2, 2, -1, 3, 16, 2, 1, 2, .00040973909199237823, .5222427248954773, .3780320882797241, 0, 2, 8, 14, 5, 3, -1, 8, 15, 5, 1, 3, -.002524228999391198, .5803927183151245, .4611890017986298, 0, 2, 8, 14, 2, 3, -1, 8, 15, 2, 1, 3, .0005094531225040555, .4401271939277649, .5846015810966492, 0, 2, 12, 3, 3, 3, -1, 13, 3, 1, 3, 3, .001965641975402832, .5322325229644775, .4184590876102448, 0, 2, 7, 5, 6, 2, -1, 9, 5, 2, 2, 3, .0005629889783449471, .3741844892501831, .5234565734863281, 0, 2, 15, 5, 5, 2, -1, 15, 6, 5, 1, 2, -.0006794679793529212, .4631041884422302, .5356478095054626, 0, 2, 0, 5, 5, 2, -1, 0, 6, 5, 1, 2, .007285634987056255, .5044670104980469, .2377564013004303, 0, 2, 17, 14, 1, 6, -1, 17, 17, 1, 3, 2, -.0174594894051552, .7289121150970459, .5050435066223145, 0, 2, 2, 9, 9, 3, -1, 5, 9, 3, 3, 3, -.0254217498004436, .6667134761810303, .4678100049495697, 0, 2, 12, 3, 3, 3, -1, 13, 3, 1, 3, 3, -.0015647639520466328, .4391759037971497, .532362699508667, 0, 2, 0, 0, 4, 18, -1, 2, 0, 2, 18, 2, .0114443600177765, .4346440136432648, .5680012106895447, 0, 2, 17, 6, 1, 3, -1, 17, 7, 1, 1, 3, -.0006735255010426044, .44771409034729, .5296812057495117, 0, 2, 2, 14, 1, 6, -1, 2, 17, 1, 3, 2, .009319420903921127, .4740200042724609, .7462607026100159, 0, 2, 19, 8, 1, 2, -1, 19, 9, 1, 1, 2, .00013328490604180843, .536506175994873, .475213497877121, 0, 2, 5, 3, 3, 3, -1, 6, 3, 1, 3, 3, -.007881579920649529, .1752219051122665, .5015255212783813, 0, 2, 9, 16, 2, 3, -1, 9, 17, 2, 1, 3, -.005798568017780781, .7271236777305603, .4896200895309448, 0, 2, 2, 6, 1, 3, -1, 2, 7, 1, 1, 3, -.0003892249951604754, .4003908932209015, .5344941020011902, 0, 3, 12, 4, 8, 2, -1, 16, 4, 4, 1, 2, 12, 5, 4, 1, 2, -.0019288610201328993, .5605612993240356, .4803955852985382, 0, 3, 0, 4, 8, 2, -1, 0, 4, 4, 1, 2, 4, 5, 4, 1, 2, .008421415463089943, .4753246903419495, .7623608708381653, 0, 2, 2, 16, 18, 4, -1, 2, 18, 18, 2, 2, .008165587671101093, .5393261909484863, .419164389371872, 0, 2, 7, 15, 2, 4, -1, 7, 17, 2, 2, 2, .00048280550981871784, .4240800142288208, .5399821996688843, 0, 2, 4, 0, 14, 3, -1, 4, 1, 14, 1, 3, -.002718663075938821, .4244599938392639, .5424923896789551, 0, 2, 0, 0, 4, 20, -1, 2, 0, 2, 20, 2, -.0125072300434113, .5895841717720032, .4550411105155945, 0, 3, 12, 4, 4, 8, -1, 14, 4, 2, 4, 2, 12, 8, 2, 4, 2, -.0242865197360516, .2647134959697723, .518917977809906, 0, 3, 6, 7, 2, 2, -1, 6, 7, 1, 1, 2, 7, 8, 1, 1, 2, -.0029676330741494894, .734768271446228, .4749749898910523, 0, 2, 10, 6, 2, 3, -1, 10, 7, 2, 1, 3, -.0125289997085929, .2756049931049347, .5177599787712097, 0, 2, 8, 7, 3, 2, -1, 8, 8, 3, 1, 2, -.0010104000102728605, .3510560989379883, .5144724249839783, 0, 2, 8, 2, 6, 12, -1, 8, 8, 6, 6, 2, -.0021348530426621437, .5637925863265991, .466731995344162, 0, 2, 4, 0, 11, 12, -1, 4, 4, 11, 4, 3, .0195642597973347, .4614573121070862, .6137639880180359, 0, 2, 14, 9, 6, 11, -1, 16, 9, 2, 11, 3, -.0971463471651077, .2998378872871399, .5193555951118469, 0, 2, 0, 14, 4, 3, -1, 0, 15, 4, 1, 3, .00450145686045289, .5077884793281555, .3045755922794342, 0, 2, 9, 10, 2, 3, -1, 9, 11, 2, 1, 3, .006370697170495987, .486101895570755, .6887500882148743, 0, 2, 5, 11, 3, 2, -1, 5, 12, 3, 1, 2, -.009072152897715569, .1673395931720734, .5017563104629517, 0, 2, 9, 15, 3, 3, -1, 10, 15, 1, 3, 3, -.005353720858693123, .2692756950855255, .524263322353363, 0, 2, 8, 8, 3, 4, -1, 9, 8, 1, 4, 3, -.0109328404068947, .7183864116668701, .4736028909683228, 0, 2, 9, 15, 3, 3, -1, 10, 15, 1, 3, 3, .008235607296228409, .5223966836929321, .2389862984418869, 0, 2, 7, 7, 3, 2, -1, 8, 7, 1, 2, 3, -.0010038160253316164, .5719355940818787, .4433943033218384, 0, 3, 2, 10, 16, 4, -1, 10, 10, 8, 2, 2, 2, 12, 8, 2, 2, .004085912834852934, .5472841858863831, .4148836135864258, 0, 2, 2, 3, 4, 17, -1, 4, 3, 2, 17, 2, .1548541933298111, .4973812103271484, .0610615983605385, 0, 2, 15, 13, 2, 7, -1, 15, 13, 1, 7, 2, .00020897459762636572, .4709174036979675, .542388916015625, 0, 2, 2, 2, 6, 1, -1, 5, 2, 3, 1, 2, .0003331699117552489, .4089626967906952, .5300992131233215, 0, 2, 5, 2, 12, 4, -1, 9, 2, 4, 4, 3, -.0108134001493454, .6104369759559631, .4957334101200104, 0, 3, 6, 0, 8, 12, -1, 6, 0, 4, 6, 2, 10, 6, 4, 6, 2, .0456560105085373, .5069689154624939, .2866660058498383, 0, 3, 13, 7, 2, 2, -1, 14, 7, 1, 1, 2, 13, 8, 1, 1, 2, .0012569549726322293, .484691709280014, .631817102432251, 0, 2, 0, 12, 20, 6, -1, 0, 14, 20, 2, 3, -.120150700211525, .0605261400341988, .4980959892272949, 0, 2, 14, 7, 2, 3, -1, 14, 7, 1, 3, 2, -.00010533799650147557, .5363109707832336, .4708042144775391, 0, 2, 0, 8, 9, 12, -1, 3, 8, 3, 12, 3, -.2070319056510925, .059660330414772, .497909814119339, 0, 2, 3, 0, 16, 2, -1, 3, 0, 8, 2, 2, .00012909180077258497, .4712977111339569, .5377997756004333, 0, 2, 6, 15, 3, 3, -1, 6, 16, 3, 1, 3, .000388185289921239, .4363538026809692, .5534191131591797, 0, 2, 8, 15, 6, 3, -1, 8, 16, 6, 1, 3, -.0029243610333651304, .5811185836791992, .4825215935707092, 0, 2, 0, 10, 1, 6, -1, 0, 12, 1, 2, 3, .0008388233254663646, .5311700105667114, .403813898563385, 0, 2, 10, 9, 4, 3, -1, 10, 10, 4, 1, 3, -.0019061550265178084, .3770701885223389, .526001513004303, 0, 2, 9, 15, 2, 3, -1, 9, 16, 2, 1, 3, .00895143486559391, .4766167998313904, .7682183980941772, 0, 2, 5, 7, 10, 1, -1, 5, 7, 5, 1, 2, .0130834598094225, .5264462828636169, .3062222003936768, 0, 2, 4, 0, 12, 19, -1, 10, 0, 6, 19, 2, -.2115933001041412, .6737198233604431, .4695810079574585, 0, 3, 0, 6, 20, 6, -1, 10, 6, 10, 3, 2, 0, 9, 10, 3, 2, .0031493250280618668, .5644835233688354, .4386953115463257, 0, 3, 3, 6, 2, 2, -1, 3, 6, 1, 1, 2, 4, 7, 1, 1, 2, .00039754100725986063, .4526061117649078, .5895630121231079, 0, 3, 15, 6, 2, 2, -1, 16, 6, 1, 1, 2, 15, 7, 1, 1, 2, -.0013814480043947697, .6070582270622253, .4942413866519928, 0, 3, 3, 6, 2, 2, -1, 3, 6, 1, 1, 2, 4, 7, 1, 1, 2, -.0005812218878418207, .5998213291168213, .4508252143859863, 0, 2, 14, 4, 1, 12, -1, 14, 10, 1, 6, 2, -.002390532987192273, .420558899641037, .5223848223686218, 0, 3, 2, 5, 16, 10, -1, 2, 5, 8, 5, 2, 10, 10, 8, 5, 2, .0272689294070005, .5206447243690491, .3563301861286163, 0, 2, 9, 17, 3, 2, -1, 10, 17, 1, 2, 3, -.0037658358924090862, .3144704103469849, .5218814015388489, 0, 2, 1, 4, 2, 2, -1, 1, 5, 2, 1, 2, -.0014903489500284195, .338019609451294, .5124437212944031, 0, 2, 5, 0, 15, 5, -1, 10, 0, 5, 5, 3, -.0174282304942608, .5829960703849792, .4919725954532623, 0, 2, 0, 0, 15, 5, -1, 5, 0, 5, 5, 3, -.0152780301868916, .6163144707679749, .4617887139320374, 0, 2, 11, 2, 2, 17, -1, 11, 2, 1, 17, 2, .0319956094026566, .5166357159614563, .171276405453682, 0, 2, 7, 2, 2, 17, -1, 8, 2, 1, 17, 2, -.003825671039521694, .3408012092113495, .5131387710571289, 0, 2, 15, 11, 2, 9, -1, 15, 11, 1, 9, 2, -.00851864367723465, .6105518937110901, .4997941851615906, 0, 2, 3, 11, 2, 9, -1, 4, 11, 1, 9, 2, .0009064162150025368, .4327270984649658, .5582311153411865, 0, 2, 5, 16, 14, 4, -1, 5, 16, 7, 4, 2, .0103448498994112, .4855653047561646, .5452420115470886, 79.24907684326172, 160, 0, 2, 1, 4, 18, 1, -1, 7, 4, 6, 1, 3, .007898182608187199, .333252489566803, .5946462154388428, 0, 3, 13, 7, 6, 4, -1, 16, 7, 3, 2, 2, 13, 9, 3, 2, 2, .0016170160379260778, .3490641117095947, .5577868819236755, 0, 2, 9, 8, 2, 12, -1, 9, 12, 2, 4, 3, -.0005544974119402468, .5542566180229187, .3291530013084412, 0, 2, 12, 1, 6, 6, -1, 12, 3, 6, 2, 3, .001542898011393845, .3612579107284546, .5545979142189026, 0, 3, 5, 2, 6, 6, -1, 5, 2, 3, 3, 2, 8, 5, 3, 3, 2, -.0010329450014978647, .3530139029026032, .5576140284538269, 0, 3, 9, 16, 6, 4, -1, 12, 16, 3, 2, 2, 9, 18, 3, 2, 2, .0007769815856590867, .3916778862476349, .5645321011543274, 0, 2, 1, 2, 18, 3, -1, 7, 2, 6, 3, 3, .143203005194664, .4667482078075409, .7023633122444153, 0, 2, 7, 4, 9, 10, -1, 7, 9, 9, 5, 2, -.007386649027466774, .3073684871196747, .5289257764816284, 0, 2, 5, 9, 4, 4, -1, 7, 9, 2, 4, 2, -.0006293674232438207, .562211811542511, .4037049114704132, 0, 2, 11, 10, 3, 6, -1, 11, 13, 3, 3, 2, .0007889352855272591, .5267661213874817, .3557874858379364, 0, 2, 7, 11, 5, 3, -1, 7, 12, 5, 1, 3, -.0122280502691865, .6668320894241333, .4625549912452698, 0, 3, 7, 11, 6, 6, -1, 10, 11, 3, 3, 2, 7, 14, 3, 3, 2, .0035420239437371492, .5521438121795654, .3869673013687134, 0, 2, 0, 0, 10, 9, -1, 0, 3, 10, 3, 3, -.0010585320414975286, .3628678023815155, .5320926904678345, 0, 2, 13, 14, 1, 6, -1, 13, 16, 1, 2, 3, 14935660146875307e-21, .4632444977760315, .5363323092460632, 0, 2, 0, 2, 3, 6, -1, 0, 4, 3, 2, 3, .005253770854324102, .5132231712341309, .3265708982944489, 0, 2, 8, 14, 4, 3, -1, 8, 15, 4, 1, 3, -.008233802393078804, .6693689823150635, .4774140119552612, 0, 2, 6, 14, 1, 6, -1, 6, 16, 1, 2, 3, 2186681012972258e-20, .405386209487915, .5457931160926819, 0, 2, 9, 15, 2, 3, -1, 9, 16, 2, 1, 3, -.0038150229956954718, .645499587059021, .4793178141117096, 0, 2, 6, 4, 3, 3, -1, 7, 4, 1, 3, 3, .0011105879675596952, .5270407199859619, .3529678881168366, 0, 2, 9, 0, 11, 3, -1, 9, 1, 11, 1, 3, -.005770768970251083, .3803547024726868, .5352957844734192, 0, 2, 0, 6, 20, 3, -1, 0, 7, 20, 1, 3, -.003015833906829357, .533940315246582, .3887133002281189, 0, 2, 10, 1, 1, 2, -1, 10, 2, 1, 1, 2, -.0008545368909835815, .3564616143703461, .5273603796958923, 0, 2, 9, 6, 2, 6, -1, 10, 6, 1, 6, 2, .0110505102202296, .4671907126903534, .6849737763404846, 0, 2, 5, 8, 12, 1, -1, 9, 8, 4, 1, 3, .0426058396697044, .51514732837677, .0702200904488564, 0, 2, 3, 8, 12, 1, -1, 7, 8, 4, 1, 3, -.0030781750101596117, .3041661083698273, .5152602195739746, 0, 2, 9, 7, 3, 5, -1, 10, 7, 1, 5, 3, -.005481572821736336, .6430295705795288, .4897229969501495, 0, 2, 3, 9, 6, 2, -1, 6, 9, 3, 2, 2, .003188186092302203, .5307493209838867, .3826209902763367, 0, 2, 12, 9, 3, 3, -1, 12, 10, 3, 1, 3, .00035947180003859103, .4650047123432159, .5421904921531677, 0, 2, 7, 0, 6, 1, -1, 9, 0, 2, 1, 3, -.004070503171533346, .2849679887294769, .5079116225242615, 0, 2, 12, 9, 3, 3, -1, 12, 10, 3, 1, 3, -.0145941702648997, .2971645891666412, .5128461718559265, 0, 2, 7, 10, 2, 1, -1, 8, 10, 1, 1, 2, -.00011947689927183092, .563109815120697, .4343082010746002, 0, 2, 6, 4, 9, 13, -1, 9, 4, 3, 13, 3, -.0006934464909136295, .4403578042984009, .5359959006309509, 0, 2, 6, 8, 4, 2, -1, 6, 9, 4, 1, 2, 14834799912932795e-21, .3421008884906769, .5164697766304016, 0, 2, 16, 2, 4, 6, -1, 16, 2, 2, 6, 2, .009029698558151722, .4639343023300171, .6114075183868408, 0, 2, 0, 17, 6, 3, -1, 0, 18, 6, 1, 3, -.008064081892371178, .2820158898830414, .5075494050979614, 0, 2, 10, 10, 3, 10, -1, 10, 15, 3, 5, 2, .0260621197521687, .5208905935287476, .2688778042793274, 0, 2, 8, 7, 3, 5, -1, 9, 7, 1, 5, 3, .0173146594315767, .4663713872432709, .6738539934158325, 0, 2, 10, 4, 4, 3, -1, 10, 4, 2, 3, 2, .0226666405797005, .5209349989891052, .2212723940610886, 0, 2, 8, 4, 3, 8, -1, 9, 4, 1, 8, 3, -.002196592977270484, .6063101291656494, .4538190066814423, 0, 2, 6, 6, 9, 13, -1, 9, 6, 3, 13, 3, -.009528247639536858, .4635204970836639, .5247430801391602, 0, 3, 6, 0, 8, 12, -1, 6, 0, 4, 6, 2, 10, 6, 4, 6, 2, .00809436198323965, .5289440155029297, .3913882076740265, 0, 2, 14, 2, 6, 8, -1, 16, 2, 2, 8, 3, -.0728773325681686, .7752001881599426, .4990234971046448, 0, 2, 6, 0, 3, 6, -1, 7, 0, 1, 6, 3, -.006900952197611332, .2428039014339447, .5048090219497681, 0, 2, 14, 2, 6, 8, -1, 16, 2, 2, 8, 3, -.0113082397729158, .5734364986419678, .4842376112937927, 0, 2, 0, 5, 6, 6, -1, 0, 8, 6, 3, 2, .0596132017672062, .5029836297035217, .2524977028369904, 0, 3, 9, 12, 6, 2, -1, 12, 12, 3, 1, 2, 9, 13, 3, 1, 2, -.0028624620754271746, .6073045134544373, .4898459911346436, 0, 2, 8, 17, 3, 2, -1, 9, 17, 1, 2, 3, .00447814492508769, .5015289187431335, .2220316976308823, 0, 3, 11, 6, 2, 2, -1, 12, 6, 1, 1, 2, 11, 7, 1, 1, 2, -.001751324045471847, .6614428758621216, .4933868944644928, 0, 2, 1, 9, 18, 2, -1, 7, 9, 6, 2, 3, .0401634201407433, .5180878043174744, .3741044998168945, 0, 3, 11, 6, 2, 2, -1, 12, 6, 1, 1, 2, 11, 7, 1, 1, 2, .0003476894926279783, .4720416963100433, .5818032026290894, 0, 2, 3, 4, 12, 8, -1, 7, 4, 4, 8, 3, .00265516503714025, .3805010914802551, .5221335887908936, 0, 2, 13, 11, 5, 3, -1, 13, 12, 5, 1, 3, -.008770627900958061, .294416606426239, .5231295228004456, 0, 2, 9, 10, 2, 3, -1, 9, 11, 2, 1, 3, -.005512209143489599, .7346177101135254, .4722816944122315, 0, 2, 14, 7, 2, 3, -1, 14, 7, 1, 3, 2, .0006867204210720956, .5452876091003418, .424241304397583, 0, 2, 5, 4, 1, 3, -1, 5, 5, 1, 1, 3, .0005601966986432672, .439886212348938, .5601285099983215, 0, 2, 13, 4, 2, 3, -1, 13, 5, 2, 1, 3, .0024143769405782223, .4741686880588532, .6136621832847595, 0, 2, 5, 4, 2, 3, -1, 5, 5, 2, 1, 3, -.0015680900542065501, .604455292224884, .4516409933567047, 0, 2, 9, 8, 2, 3, -1, 9, 9, 2, 1, 3, -.0036827491130679846, .2452459037303925, .5294982194900513, 0, 2, 8, 9, 2, 2, -1, 8, 10, 2, 1, 2, -.000294091907562688, .3732838034629822, .5251451134681702, 0, 2, 15, 14, 1, 4, -1, 15, 16, 1, 2, 2, .00042847759323194623, .5498809814453125, .4065535068511963, 0, 2, 3, 12, 2, 2, -1, 3, 13, 2, 1, 2, -.004881707020103931, .2139908969402313, .4999957084655762, 0, 3, 12, 15, 2, 2, -1, 13, 15, 1, 1, 2, 12, 16, 1, 1, 2, .00027272020815871656, .465028703212738, .581342875957489, 0, 2, 9, 13, 2, 2, -1, 9, 14, 2, 1, 2, .00020947199664078653, .4387486875057221, .5572792887687683, 0, 2, 4, 11, 14, 9, -1, 4, 14, 14, 3, 3, .0485011897981167, .5244972705841064, .3212889134883881, 0, 2, 7, 13, 4, 3, -1, 7, 14, 4, 1, 3, -.004516641143709421, .605681300163269, .4545882046222687, 0, 2, 15, 14, 1, 4, -1, 15, 16, 1, 2, 2, -.0122916800901294, .2040929049253464, .5152214169502258, 0, 2, 4, 14, 1, 4, -1, 4, 16, 1, 2, 2, .0004854967992287129, .5237604975700378, .3739503026008606, 0, 2, 14, 0, 6, 13, -1, 16, 0, 2, 13, 3, .0305560491979122, .4960533976554871, .5938246250152588, 0, 3, 4, 1, 2, 12, -1, 4, 1, 1, 6, 2, 5, 7, 1, 6, 2, -.00015105320198927075, .5351303815841675, .4145204126834869, 0, 3, 11, 14, 6, 6, -1, 14, 14, 3, 3, 2, 11, 17, 3, 3, 2, .0024937440175563097, .4693366885185242, .5514941215515137, 0, 3, 3, 14, 6, 6, -1, 3, 14, 3, 3, 2, 6, 17, 3, 3, 2, -.012382130138576, .6791396737098694, .4681667983531952, 0, 2, 14, 17, 3, 2, -1, 14, 18, 3, 1, 2, -.005133346188813448, .3608739078044891, .5229160189628601, 0, 2, 3, 17, 3, 2, -1, 3, 18, 3, 1, 2, .0005191927775740623, .5300073027610779, .3633613884449005, 0, 2, 14, 0, 6, 13, -1, 16, 0, 2, 13, 3, .1506042033433914, .515731692314148, .2211782038211823, 0, 2, 0, 0, 6, 13, -1, 2, 0, 2, 13, 3, .007714414969086647, .4410496950149536, .5776609182357788, 0, 2, 10, 10, 7, 6, -1, 10, 12, 7, 2, 3, .009444352239370346, .5401855111122131, .375665009021759, 0, 3, 6, 15, 2, 2, -1, 6, 15, 1, 1, 2, 7, 16, 1, 1, 2, .00025006249779835343, .4368270933628082, .5607374906539917, 0, 3, 6, 11, 8, 6, -1, 10, 11, 4, 3, 2, 6, 14, 4, 3, 2, -.003307715058326721, .4244799017906189, .551823079586029, 0, 3, 7, 6, 2, 2, -1, 7, 6, 1, 1, 2, 8, 7, 1, 1, 2, .0007404891075566411, .4496962130069733, .5900576710700989, 0, 3, 2, 2, 16, 6, -1, 10, 2, 8, 3, 2, 2, 5, 8, 3, 2, .0440920516848564, .5293493270874023, .3156355023384094, 0, 2, 5, 4, 3, 3, -1, 5, 5, 3, 1, 3, .0033639909233897924, .4483296871185303, .5848662257194519, 0, 2, 11, 7, 3, 10, -1, 11, 12, 3, 5, 2, -.003976007923483849, .4559507071971893, .5483639240264893, 0, 2, 6, 7, 3, 10, -1, 6, 12, 3, 5, 2, .0027716930489987135, .534178614616394, .3792484104633331, 0, 2, 10, 7, 3, 2, -1, 11, 7, 1, 2, 3, -.00024123019829858094, .5667188763618469, .4576973021030426, 0, 2, 8, 12, 4, 2, -1, 8, 13, 4, 1, 2, .0004942566738463938, .4421244859695435, .5628787279129028, 0, 2, 10, 1, 1, 3, -1, 10, 2, 1, 1, 3, -.0003887646889779717, .4288370907306671, .5391063094139099, 0, 3, 1, 2, 4, 18, -1, 1, 2, 2, 9, 2, 3, 11, 2, 9, 2, -.0500488989055157, .6899513006210327, .4703742861747742, 0, 2, 12, 4, 4, 12, -1, 12, 10, 4, 6, 2, -.0366354808211327, .2217779010534287, .5191826224327087, 0, 2, 0, 0, 1, 6, -1, 0, 2, 1, 2, 3, .0024273579474538565, .5136224031448364, .3497397899627686, 0, 2, 9, 11, 2, 3, -1, 9, 12, 2, 1, 3, .001955803018063307, .4826192855834961, .640838086605072, 0, 2, 8, 7, 4, 3, -1, 8, 8, 4, 1, 3, -.0017494610510766506, .3922835886478424, .5272685289382935, 0, 2, 10, 7, 3, 2, -1, 11, 7, 1, 2, 3, .0139550799503922, .507820188999176, .8416504859924316, 0, 2, 7, 7, 3, 2, -1, 8, 7, 1, 2, 3, -.00021896739781368524, .5520489811897278, .4314234852790833, 0, 2, 9, 4, 6, 1, -1, 11, 4, 2, 1, 3, -.0015131309628486633, .3934605121612549, .5382571220397949, 0, 2, 8, 7, 2, 3, -1, 9, 7, 1, 3, 2, -.004362280014902353, .7370628714561462, .4736475944519043, 0, 3, 12, 7, 8, 6, -1, 16, 7, 4, 3, 2, 12, 10, 4, 3, 2, .0651605874300003, .5159279704093933, .328159511089325, 0, 3, 0, 7, 8, 6, -1, 0, 7, 4, 3, 2, 4, 10, 4, 3, 2, -.0023567399475723505, .3672826886177063, .5172886252403259, 0, 3, 18, 2, 2, 10, -1, 19, 2, 1, 5, 2, 18, 7, 1, 5, 2, .0151466596871614, .5031493902206421, .6687604188919067, 0, 2, 0, 2, 6, 4, -1, 3, 2, 3, 4, 2, -.0228509604930878, .676751971244812, .4709596931934357, 0, 2, 9, 4, 6, 1, -1, 11, 4, 2, 1, 3, .004886765033006668, .5257998108863831, .4059878885746002, 0, 3, 7, 15, 2, 2, -1, 7, 15, 1, 1, 2, 8, 16, 1, 1, 2, .0017619599821045995, .4696272909641266, .6688278913497925, 0, 2, 11, 13, 1, 6, -1, 11, 16, 1, 3, 2, -.0012942519970238209, .4320712983608246, .5344281792640686, 0, 2, 8, 13, 1, 6, -1, 8, 16, 1, 3, 2, .0109299495816231, .4997706115245819, .1637486070394516, 0, 2, 14, 3, 2, 1, -1, 14, 3, 1, 1, 2, 2995848990394734e-20, .4282417893409729, .5633224248886108, 0, 2, 8, 15, 2, 3, -1, 8, 16, 2, 1, 3, -.0065884361974895, .677212119102478, .4700526893138886, 0, 2, 12, 15, 7, 4, -1, 12, 17, 7, 2, 2, .0032527779694646597, .531339704990387, .4536148905754089, 0, 2, 4, 14, 12, 3, -1, 4, 15, 12, 1, 3, -.00404357397928834, .5660061836242676, .4413388967514038, 0, 2, 10, 3, 3, 2, -1, 11, 3, 1, 2, 3, -.0012523540062829852, .3731913864612579, .5356451869010925, 0, 2, 4, 12, 2, 2, -1, 4, 13, 2, 1, 2, .00019246719602961093, .5189986228942871, .3738811016082764, 0, 2, 10, 11, 4, 6, -1, 10, 14, 4, 3, 2, -.038589671254158, .2956373989582062, .51888108253479, 0, 3, 7, 13, 2, 2, -1, 7, 13, 1, 1, 2, 8, 14, 1, 1, 2, .0001548987056594342, .4347135126590729, .5509533286094666, 0, 3, 4, 11, 14, 4, -1, 11, 11, 7, 2, 2, 4, 13, 7, 2, 2, -.0337638482451439, .3230330049991608, .5195475816726685, 0, 2, 1, 18, 18, 2, -1, 7, 18, 6, 2, 3, -.008265706710517406, .5975489020347595, .4552114009857178, 0, 3, 11, 18, 2, 2, -1, 12, 18, 1, 1, 2, 11, 19, 1, 1, 2, 14481440302915871e-21, .4745678007602692, .5497426986694336, 0, 3, 7, 18, 2, 2, -1, 7, 18, 1, 1, 2, 8, 19, 1, 1, 2, 14951299817766994e-21, .4324473142623901, .5480644106864929, 0, 2, 12, 18, 8, 2, -1, 12, 19, 8, 1, 2, -.018741799518466, .1580052971839905, .517853319644928, 0, 2, 7, 14, 6, 2, -1, 7, 15, 6, 1, 2, .0017572239739820361, .4517636895179749, .5773764252662659, 0, 3, 8, 12, 4, 8, -1, 10, 12, 2, 4, 2, 8, 16, 2, 4, 2, -.0031391119118779898, .4149647951126099, .5460842251777649, 0, 2, 4, 9, 3, 3, -1, 4, 10, 3, 1, 3, 6665677938144654e-20, .4039090871810913, .5293084979057312, 0, 2, 7, 10, 6, 2, -1, 9, 10, 2, 2, 3, .006774342153221369, .4767651855945587, .612195611000061, 0, 2, 5, 0, 4, 15, -1, 7, 0, 2, 15, 2, -.0073868161998689175, .3586258888244629, .5187280774116516, 0, 2, 8, 6, 12, 14, -1, 12, 6, 4, 14, 3, .0140409301966429, .4712139964103699, .5576155781745911, 0, 2, 5, 16, 3, 3, -1, 5, 17, 3, 1, 3, -.005525832995772362, .2661027014255524, .5039281249046326, 0, 2, 8, 1, 12, 19, -1, 12, 1, 4, 19, 3, .3868423998355866, .5144339799880981, .2525899112224579, 0, 2, 3, 0, 3, 2, -1, 3, 1, 3, 1, 2, .0001145924034062773, .4284994900226593, .5423371195793152, 0, 2, 10, 12, 4, 5, -1, 10, 12, 2, 5, 2, -.0184675697237253, .3885835111141205, .5213062167167664, 0, 2, 6, 12, 4, 5, -1, 8, 12, 2, 5, 2, -.0004590701137203723, .541256308555603, .4235909879207611, 0, 3, 11, 11, 2, 2, -1, 12, 11, 1, 1, 2, 11, 12, 1, 1, 2, .0012527540093287826, .4899305105209351, .6624091267585754, 0, 2, 0, 2, 3, 6, -1, 0, 4, 3, 2, 3, .001491060946136713, .5286778211593628, .4040051996707916, 0, 3, 11, 11, 2, 2, -1, 12, 11, 1, 1, 2, 11, 12, 1, 1, 2, -.0007543556275777519, .6032990217208862, .4795120060443878, 0, 2, 7, 6, 4, 10, -1, 7, 11, 4, 5, 2, -.0069478838704526424, .408440113067627, .5373504161834717, 0, 3, 11, 11, 2, 2, -1, 12, 11, 1, 1, 2, 11, 12, 1, 1, 2, .0002809292054735124, .4846062958240509, .5759382247924805, 0, 2, 2, 13, 5, 2, -1, 2, 14, 5, 1, 2, .0009607371757738292, .5164741277694702, .3554979860782623, 0, 3, 11, 11, 2, 2, -1, 12, 11, 1, 1, 2, 11, 12, 1, 1, 2, -.0002688392996788025, .5677582025527954, .4731765985488892, 0, 3, 7, 11, 2, 2, -1, 7, 11, 1, 1, 2, 8, 12, 1, 1, 2, .0021599370520561934, .4731487035751343, .7070567011833191, 0, 2, 14, 13, 3, 3, -1, 14, 14, 3, 1, 3, .005623530130833387, .5240243077278137, .2781791985034943, 0, 2, 3, 13, 3, 3, -1, 3, 14, 3, 1, 3, -.005024399142712355, .2837013900279999, .5062304139137268, 0, 2, 9, 14, 2, 3, -1, 9, 15, 2, 1, 3, -.009761163964867592, .7400717735290527, .4934569001197815, 0, 2, 8, 7, 3, 3, -1, 8, 8, 3, 1, 3, .004151510074734688, .5119131207466125, .3407008051872253, 0, 2, 13, 5, 3, 3, -1, 13, 6, 3, 1, 3, .006246508099138737, .4923788011074066, .6579058766365051, 0, 2, 0, 9, 5, 3, -1, 0, 10, 5, 1, 3, -.007059747818857431, .2434711009263992, .503284215927124, 0, 2, 13, 5, 3, 3, -1, 13, 6, 3, 1, 3, -.0020587709732353687, .590031087398529, .469508707523346, 0, 3, 9, 12, 2, 8, -1, 9, 12, 1, 4, 2, 10, 16, 1, 4, 2, -.0024146060459315777, .3647317886352539, .5189201831817627, 0, 3, 11, 7, 2, 2, -1, 12, 7, 1, 1, 2, 11, 8, 1, 1, 2, -.0014817609917372465, .6034948229789734, .4940128028392792, 0, 2, 0, 16, 6, 4, -1, 3, 16, 3, 4, 2, -.0063016400672495365, .5818989872932434, .4560427963733673, 0, 2, 10, 6, 2, 3, -1, 10, 7, 2, 1, 3, .00347634288482368, .5217475891113281, .3483993113040924, 0, 2, 9, 5, 2, 6, -1, 9, 7, 2, 2, 3, -.0222508702427149, .2360700070858002, .5032082796096802, 0, 2, 12, 15, 8, 4, -1, 12, 15, 4, 4, 2, -.030612550675869, .6499186754226685, .4914919137954712, 0, 2, 0, 14, 8, 6, -1, 4, 14, 4, 6, 2, .013057479634881, .4413323104381561, .5683764219284058, 0, 2, 9, 0, 3, 2, -1, 10, 0, 1, 2, 3, -.0006009574281051755, .4359731078147888, .5333483219146729, 0, 2, 4, 15, 4, 2, -1, 6, 15, 2, 2, 2, -.0004151425091549754, .550406277179718, .4326060116291046, 0, 2, 12, 7, 3, 13, -1, 13, 7, 1, 13, 3, -.013776290230453, .4064112901687622, .5201548933982849, 0, 2, 5, 7, 3, 13, -1, 6, 7, 1, 13, 3, -.0322965085506439, .0473519712686539, .4977194964885712, 0, 2, 9, 6, 3, 9, -1, 9, 9, 3, 3, 3, .0535569787025452, .4881733059883118, .666693925857544, 0, 2, 4, 4, 7, 12, -1, 4, 10, 7, 6, 2, .008188954554498196, .5400037169456482, .4240820109844208, 0, 3, 12, 12, 2, 2, -1, 13, 12, 1, 1, 2, 12, 13, 1, 1, 2, .00021055320394225419, .4802047908306122, .5563852787017822, 0, 3, 6, 12, 2, 2, -1, 6, 12, 1, 1, 2, 7, 13, 1, 1, 2, -.00243827304802835, .7387793064117432, .4773685038089752, 0, 3, 8, 9, 4, 2, -1, 10, 9, 2, 1, 2, 8, 10, 2, 1, 2, .003283557016402483, .5288546085357666, .3171291947364807, 0, 3, 3, 6, 2, 2, -1, 3, 6, 1, 1, 2, 4, 7, 1, 1, 2, .00237295706756413, .4750812947750092, .7060170769691467, 0, 2, 16, 6, 3, 2, -1, 16, 7, 3, 1, 2, -.0014541699783876538, .3811730146408081, .533073902130127, 87.69602966308594, 177, 0, 2, 0, 7, 19, 4, -1, 0, 9, 19, 2, 2, .0557552389800549, .4019156992435455, .6806036829948425, 0, 2, 10, 2, 10, 1, -1, 10, 2, 5, 1, 2, .002473024884238839, .3351148962974548, .5965719819068909, 0, 2, 9, 4, 2, 12, -1, 9, 10, 2, 6, 2, -.00035031698644161224, .5557708144187927, .3482286930084229, 0, 2, 12, 18, 4, 1, -1, 12, 18, 2, 1, 2, .0005416763015091419, .426085889339447, .5693380832672119, 0, 3, 1, 7, 6, 4, -1, 1, 7, 3, 2, 2, 4, 9, 3, 2, 2, .0007719367858953774, .3494240045547485, .5433688759803772, 0, 2, 12, 0, 6, 13, -1, 14, 0, 2, 13, 3, -.0015999219613149762, .4028499126434326, .5484359264373779, 0, 2, 2, 0, 6, 13, -1, 4, 0, 2, 13, 3, -.00011832080053864047, .3806901872158051, .5425465106964111, 0, 2, 10, 5, 8, 8, -1, 10, 9, 8, 4, 2, .0003290903114248067, .262010008096695, .5429521799087524, 0, 2, 8, 3, 2, 5, -1, 9, 3, 1, 5, 2, .0002951810893137008, .379976898431778, .5399264097213745, 0, 2, 8, 4, 9, 1, -1, 11, 4, 3, 1, 3, 9046671038959175e-20, .4433645009994507, .5440226197242737, 0, 2, 3, 4, 9, 1, -1, 6, 4, 3, 1, 3, 15007190086180344e-21, .3719654977321625, .5409119725227356, 0, 2, 1, 0, 18, 10, -1, 7, 0, 6, 10, 3, .1393561065196991, .552539587020874, .4479042887687683, 0, 2, 7, 17, 5, 3, -1, 7, 18, 5, 1, 3, .0016461990308016539, .4264501035213471, .5772169828414917, 0, 2, 7, 11, 6, 1, -1, 9, 11, 2, 1, 3, .0004998443182557821, .4359526038169861, .5685871243476868, 0, 2, 2, 2, 3, 2, -1, 2, 3, 3, 1, 2, -.001097128028050065, .3390136957168579, .5205408930778503, 0, 2, 8, 12, 4, 2, -1, 8, 13, 4, 1, 2, .0006691989256069064, .4557456076145172, .598065972328186, 0, 2, 6, 10, 3, 6, -1, 6, 13, 3, 3, 2, .0008647104259580374, .5134841203689575, .2944033145904541, 0, 2, 11, 4, 2, 4, -1, 11, 4, 1, 4, 2, -.0002718259929679334, .3906578123569489, .5377181172370911, 0, 2, 7, 4, 2, 4, -1, 8, 4, 1, 4, 2, 3024949910468422e-20, .3679609894752502, .5225688815116882, 0, 2, 9, 6, 2, 4, -1, 9, 6, 1, 4, 2, -.008522589690983295, .7293102145195007, .4892365038394928, 0, 2, 6, 13, 8, 3, -1, 6, 14, 8, 1, 3, .0016705560265108943, .43453249335289, .5696138143539429, 0, 2, 9, 15, 3, 4, -1, 10, 15, 1, 4, 3, -.0071433838456869125, .2591280043125153, .5225623846054077, 0, 2, 9, 2, 2, 17, -1, 10, 2, 1, 17, 2, -.0163193698972464, .6922279000282288, .4651575982570648, 0, 2, 7, 0, 6, 1, -1, 9, 0, 2, 1, 3, .004803426098078489, .5352262854576111, .3286302983760834, 0, 2, 8, 15, 3, 4, -1, 9, 15, 1, 4, 3, -.0075421929359436035, .2040544003248215, .5034546256065369, 0, 2, 7, 13, 7, 3, -1, 7, 14, 7, 1, 3, -.0143631100654602, .6804888844490051, .4889059066772461, 0, 2, 8, 16, 3, 3, -1, 9, 16, 1, 3, 3, .0008906358852982521, .5310695767402649, .3895480930805206, 0, 2, 6, 2, 8, 10, -1, 6, 7, 8, 5, 2, -.004406019113957882, .5741562843322754, .4372426867485046, 0, 2, 2, 5, 8, 8, -1, 2, 9, 8, 4, 2, -.0001886254030978307, .2831785976886749, .5098205208778381, 0, 2, 14, 16, 2, 2, -1, 14, 17, 2, 1, 2, -.0037979281041771173, .3372507989406586, .5246580243110657, 0, 2, 4, 16, 2, 2, -1, 4, 17, 2, 1, 2, .00014627049677073956, .5306674242019653, .391171008348465, 0, 2, 10, 11, 4, 6, -1, 10, 14, 4, 3, 2, -49164638767251745e-21, .5462496280670166, .3942720890045166, 0, 2, 6, 11, 4, 6, -1, 6, 14, 4, 3, 2, -.0335825011134148, .2157824039459229, .5048211812973022, 0, 2, 10, 14, 1, 3, -1, 10, 15, 1, 1, 3, -.0035339309833943844, .6465312242507935, .4872696995735169, 0, 2, 8, 14, 4, 3, -1, 8, 15, 4, 1, 3, .005014411173760891, .4617668092250824, .6248074769973755, 0, 3, 10, 0, 4, 6, -1, 12, 0, 2, 3, 2, 10, 3, 2, 3, 2, .0188173707574606, .5220689177513123, .2000052034854889, 0, 2, 0, 3, 20, 2, -1, 0, 4, 20, 1, 2, -.001343433978036046, .4014537930488586, .53016197681427, 0, 3, 12, 0, 8, 2, -1, 16, 0, 4, 1, 2, 12, 1, 4, 1, 2, .001755796023644507, .4794039130210877, .5653169751167297, 0, 2, 2, 12, 10, 8, -1, 2, 16, 10, 4, 2, -.0956374630331993, .2034195065498352, .5006706714630127, 0, 3, 17, 7, 2, 10, -1, 18, 7, 1, 5, 2, 17, 12, 1, 5, 2, -.0222412291914225, .7672473192214966, .5046340227127075, 0, 3, 1, 7, 2, 10, -1, 1, 7, 1, 5, 2, 2, 12, 1, 5, 2, -.0155758196488023, .7490342259407043, .4755851030349731, 0, 2, 15, 10, 3, 6, -1, 15, 12, 3, 2, 3, .005359911825507879, .5365303754806519, .4004670977592468, 0, 2, 4, 4, 6, 2, -1, 6, 4, 2, 2, 3, -.0217634998261929, .0740154981613159, .4964174926280975, 0, 2, 0, 5, 20, 6, -1, 0, 7, 20, 2, 3, -.165615901350975, .2859103083610535, .5218086242675781, 0, 3, 0, 0, 8, 2, -1, 0, 0, 4, 1, 2, 4, 1, 4, 1, 2, .0001646132004680112, .4191615879535675, .5380793213844299, 0, 2, 1, 0, 18, 4, -1, 7, 0, 6, 4, 3, -.008907750248908997, .6273192763328552, .4877404868602753, 0, 2, 1, 13, 6, 2, -1, 1, 14, 6, 1, 2, .0008634644909761846, .5159940719604492, .3671025931835175, 0, 2, 10, 8, 3, 4, -1, 11, 8, 1, 4, 3, -.0013751760125160217, .5884376764297485, .4579083919525147, 0, 2, 6, 1, 6, 1, -1, 8, 1, 2, 1, 3, -.0014081239933148026, .3560509979724884, .5139945149421692, 0, 2, 8, 14, 4, 3, -1, 8, 15, 4, 1, 3, -.003934288863092661, .5994288921356201, .466427206993103, 0, 2, 1, 6, 18, 2, -1, 10, 6, 9, 2, 2, -.0319669283926487, .3345462083816528, .5144183039665222, 0, 2, 15, 11, 1, 2, -1, 15, 12, 1, 1, 2, -15089280168467667e-21, .5582656264305115, .441405713558197, 0, 2, 6, 5, 1, 2, -1, 6, 6, 1, 1, 2, .0005199447041377425, .4623680114746094, .6168993711471558, 0, 2, 13, 4, 1, 3, -1, 13, 5, 1, 1, 3, -.0034220460802316666, .6557074785232544, .4974805116653442, 0, 2, 2, 15, 1, 2, -1, 2, 16, 1, 1, 2, .00017723299970384687, .5269501805305481, .3901908099651337, 0, 2, 12, 4, 4, 3, -1, 12, 5, 4, 1, 3, .0015716759953647852, .4633373022079468, .5790457725524902, 0, 2, 0, 0, 7, 3, -1, 0, 1, 7, 1, 3, -.00890413299202919, .2689608037471771, .5053591132164001, 0, 2, 9, 12, 6, 2, -1, 9, 12, 3, 2, 2, .00040677518700249493, .5456603169441223, .4329898953437805, 0, 2, 5, 4, 2, 3, -1, 5, 5, 2, 1, 3, .0067604780197143555, .4648993909358978, .6689761877059937, 0, 2, 18, 4, 2, 3, -1, 18, 5, 2, 1, 3, .0029100088868290186, .5309703946113586, .3377839922904968, 0, 2, 3, 0, 8, 6, -1, 3, 2, 8, 2, 3, .0013885459629818797, .4074738919734955, .5349133014678955, 0, 3, 0, 2, 20, 6, -1, 10, 2, 10, 3, 2, 0, 5, 10, 3, 2, -.0767642632126808, .1992176026105881, .522824227809906, 0, 2, 4, 7, 2, 4, -1, 5, 7, 1, 4, 2, -.00022688310127705336, .5438501834869385, .4253072142601013, 0, 2, 3, 10, 15, 2, -1, 8, 10, 5, 2, 3, -.006309415213763714, .4259178936481476, .5378909707069397, 0, 2, 3, 0, 12, 11, -1, 9, 0, 6, 11, 2, -.1100727990269661, .6904156804084778, .4721749126911163, 0, 2, 13, 0, 2, 6, -1, 13, 0, 1, 6, 2, .0002861965913325548, .4524914920330048, .5548306107521057, 0, 2, 0, 19, 2, 1, -1, 1, 19, 1, 1, 2, 2942532955785282e-20, .5370373725891113, .4236463904380798, 0, 3, 16, 10, 4, 10, -1, 18, 10, 2, 5, 2, 16, 15, 2, 5, 2, -.0248865708708763, .6423557996749878, .4969303905963898, 0, 2, 4, 8, 10, 3, -1, 4, 9, 10, 1, 3, .0331488512456417, .4988475143909454, .1613811999559403, 0, 2, 14, 12, 3, 3, -1, 14, 13, 3, 1, 3, .0007849169196560979, .541602611541748, .4223009049892426, 0, 3, 0, 10, 4, 10, -1, 0, 10, 2, 5, 2, 2, 15, 2, 5, 2, .004708718974143267, .4576328992843628, .6027557849884033, 0, 2, 18, 3, 2, 6, -1, 18, 5, 2, 2, 3, .0024144479539245367, .530897319316864, .4422498941421509, 0, 2, 6, 6, 1, 3, -1, 6, 7, 1, 1, 3, .0019523180089890957, .4705634117126465, .666332483291626, 0, 2, 7, 7, 7, 2, -1, 7, 8, 7, 1, 2, .0013031980488449335, .4406126141548157, .5526962280273438, 0, 2, 0, 3, 2, 6, -1, 0, 5, 2, 2, 3, .004473549779504538, .5129023790359497, .3301498889923096, 0, 2, 11, 1, 3, 1, -1, 12, 1, 1, 1, 3, -.002665286883711815, .3135471045970917, .5175036191940308, 0, 2, 5, 0, 2, 6, -1, 6, 0, 1, 6, 2, .0001366677024634555, .4119370877742767, .530687689781189, 0, 2, 1, 1, 18, 14, -1, 7, 1, 6, 14, 3, -.0171264503151178, .6177806258201599, .4836578965187073, 0, 2, 4, 6, 8, 3, -1, 8, 6, 4, 3, 2, -.0002660143072716892, .3654330968856812, .5169736742973328, 0, 2, 9, 12, 6, 2, -1, 9, 12, 3, 2, 2, -.022932380437851, .349091500043869, .5163992047309875, 0, 2, 5, 12, 6, 2, -1, 8, 12, 3, 2, 2, .0023316550068557262, .5166299939155579, .3709389865398407, 0, 2, 10, 7, 3, 5, -1, 11, 7, 1, 5, 3, .016925660893321, .501473605632782, .8053988218307495, 0, 2, 7, 7, 3, 5, -1, 8, 7, 1, 5, 3, -.008985882624983788, .6470788717269897, .465702086687088, 0, 2, 13, 0, 3, 10, -1, 14, 0, 1, 10, 3, -.0118746999651194, .3246378898620606, .5258755087852478, 0, 2, 4, 11, 3, 2, -1, 4, 12, 3, 1, 2, .00019350569345988333, .5191941857337952, .3839643895626068, 0, 2, 17, 3, 3, 6, -1, 18, 3, 1, 6, 3, .005871349014341831, .4918133914470673, .6187043190002441, 0, 2, 1, 8, 18, 10, -1, 1, 13, 18, 5, 2, -.2483879029750824, .1836802959442139, .4988150000572205, 0, 2, 13, 0, 3, 10, -1, 14, 0, 1, 10, 3, .0122560001909733, .5227053761482239, .3632029891014099, 0, 2, 9, 14, 2, 3, -1, 9, 15, 2, 1, 3, .0008399017970077693, .4490250051021576, .5774148106575012, 0, 2, 16, 3, 3, 7, -1, 17, 3, 1, 7, 3, .002540736924856901, .4804787039756775, .5858299136161804, 0, 2, 4, 0, 3, 10, -1, 5, 0, 1, 10, 3, -.0148224299773574, .2521049976348877, .5023537278175354, 0, 2, 16, 3, 3, 7, -1, 17, 3, 1, 7, 3, -.005797395948320627, .5996695756912231, .4853715002536774, 0, 2, 0, 9, 1, 2, -1, 0, 10, 1, 1, 2, .000726621481589973, .5153716802597046, .3671779930591583, 0, 2, 18, 1, 2, 10, -1, 18, 1, 1, 10, 2, -.0172325801104307, .6621719002723694, .4994656145572662, 0, 2, 0, 1, 2, 10, -1, 1, 1, 1, 10, 2, .007862408645451069, .4633395075798035, .6256101727485657, 0, 2, 10, 16, 3, 4, -1, 11, 16, 1, 4, 3, -.004734362009912729, .3615573048591614, .5281885266304016, 0, 2, 2, 8, 3, 3, -1, 3, 8, 1, 3, 3, .0008304847870022058, .4442889094352722, .5550957918167114, 0, 3, 11, 0, 2, 6, -1, 12, 0, 1, 3, 2, 11, 3, 1, 3, 2, .00766021991148591, .5162935256958008, .2613354921340942, 0, 3, 7, 0, 2, 6, -1, 7, 0, 1, 3, 2, 8, 3, 1, 3, 2, -.004104837775230408, .2789632081985474, .5019031763076782, 0, 2, 16, 3, 3, 7, -1, 17, 3, 1, 7, 3, .004851257894188166, .4968984127044678, .5661668181419373, 0, 2, 1, 3, 3, 7, -1, 2, 3, 1, 7, 3, .0009989645332098007, .4445607960224152, .5551813244819641, 0, 2, 14, 1, 6, 16, -1, 16, 1, 2, 16, 3, -.2702363133430481, .0293882098048925, .515131413936615, 0, 2, 0, 1, 6, 16, -1, 2, 1, 2, 16, 3, -.0130906803533435, .5699399709701538, .4447459876537323, 0, 3, 2, 0, 16, 8, -1, 10, 0, 8, 4, 2, 2, 4, 8, 4, 2, -.009434279054403305, .4305466115474701, .5487895011901855, 0, 2, 6, 8, 5, 3, -1, 6, 9, 5, 1, 3, -.0015482039889320731, .3680317103862763, .512808084487915, 0, 2, 9, 7, 3, 3, -1, 10, 7, 1, 3, 3, .005374613218009472, .4838916957378388, .6101555824279785, 0, 2, 8, 8, 4, 3, -1, 8, 9, 4, 1, 3, .0015786769799888134, .5325223207473755, .4118548035621643, 0, 2, 9, 6, 2, 4, -1, 9, 6, 1, 4, 2, .003685605013743043, .4810948073863983, .6252303123474121, 0, 2, 0, 7, 15, 1, -1, 5, 7, 5, 1, 3, .009388701990246773, .520022988319397, .3629410862922669, 0, 2, 8, 2, 7, 9, -1, 8, 5, 7, 3, 3, .0127926301211119, .4961709976196289, .673801600933075, 0, 3, 1, 7, 16, 4, -1, 1, 7, 8, 2, 2, 9, 9, 8, 2, 2, -.003366104094311595, .4060279130935669, .5283598899841309, 0, 2, 6, 12, 8, 2, -1, 6, 13, 8, 1, 2, .00039771420415490866, .4674113988876343, .5900775194168091, 0, 2, 8, 11, 3, 3, -1, 8, 12, 3, 1, 3, .0014868030557408929, .4519116878509522, .6082053780555725, 0, 3, 4, 5, 14, 10, -1, 11, 5, 7, 5, 2, 4, 10, 7, 5, 2, -.0886867493391037, .2807899117469788, .5180991888046265, 0, 2, 4, 12, 3, 2, -1, 4, 13, 3, 1, 2, -7429611287079751e-20, .5295584201812744, .408762514591217, 0, 2, 9, 11, 6, 1, -1, 11, 11, 2, 1, 3, -14932939848222304e-21, .5461400151252747, .4538542926311493, 0, 2, 4, 9, 7, 6, -1, 4, 11, 7, 2, 3, .005916223861277103, .5329161286354065, .4192134141921997, 0, 2, 7, 10, 6, 3, -1, 7, 11, 6, 1, 3, .001114164013415575, .4512017965316773, .5706217288970947, 0, 2, 9, 11, 2, 2, -1, 9, 12, 2, 1, 2, 8924936264520511e-20, .4577805995941162, .5897638201713562, 0, 2, 0, 5, 20, 6, -1, 0, 7, 20, 2, 3, .0025319510605186224, .5299603939056396, .3357639014720917, 0, 2, 6, 4, 6, 1, -1, 8, 4, 2, 1, 3, .0124262003228068, .4959059059619904, .1346601992845535, 0, 2, 9, 11, 6, 1, -1, 11, 11, 2, 1, 3, .0283357501029968, .5117079019546509, .0006104363710619509, 0, 2, 5, 11, 6, 1, -1, 7, 11, 2, 1, 3, .006616588216274977, .4736349880695343, .7011628150939941, 0, 2, 10, 16, 3, 4, -1, 11, 16, 1, 4, 3, .008046876639127731, .5216417908668518, .3282819986343384, 0, 2, 8, 7, 3, 3, -1, 9, 7, 1, 3, 3, -.001119398046284914, .5809860825538635, .4563739001750946, 0, 2, 2, 12, 16, 8, -1, 2, 16, 16, 4, 2, .0132775902748108, .5398362278938293, .4103901088237763, 0, 2, 0, 15, 15, 2, -1, 0, 16, 15, 1, 2, .0004879473999608308, .424928605556488, .5410590767860413, 0, 2, 15, 4, 5, 6, -1, 15, 6, 5, 2, 3, .0112431701272726, .526996374130249, .3438215851783752, 0, 2, 9, 5, 2, 4, -1, 10, 5, 1, 4, 2, -.0008989666821435094, .5633075833320618, .4456613063812256, 0, 2, 8, 10, 9, 6, -1, 8, 12, 9, 2, 3, .006667715962976217, .5312889218330383, .4362679123878479, 0, 2, 2, 19, 15, 1, -1, 7, 19, 5, 1, 3, .0289472993463278, .4701794981956482, .657579779624939, 0, 2, 10, 16, 3, 4, -1, 11, 16, 1, 4, 3, -.0234000496566296, 0, .5137398838996887, 0, 2, 0, 15, 20, 4, -1, 0, 17, 20, 2, 2, -.0891170501708984, .0237452797591686, .4942430853843689, 0, 2, 10, 16, 3, 4, -1, 11, 16, 1, 4, 3, -.0140546001493931, .3127323091030121, .511751115322113, 0, 2, 7, 16, 3, 4, -1, 8, 16, 1, 4, 3, .008123939856886864, .50090491771698, .2520025968551636, 0, 2, 9, 16, 3, 3, -1, 9, 17, 3, 1, 3, -.004996465053409338, .6387143731117249, .4927811920642853, 0, 2, 8, 11, 4, 6, -1, 8, 14, 4, 3, 2, .0031253970228135586, .5136849880218506, .3680452108383179, 0, 2, 9, 6, 2, 12, -1, 9, 10, 2, 4, 3, .006766964215785265, .5509843826293945, .4363631904125214, 0, 2, 8, 17, 4, 3, -1, 8, 18, 4, 1, 3, -.002371144015341997, .6162335276603699, .4586946964263916, 0, 3, 9, 18, 8, 2, -1, 13, 18, 4, 1, 2, 9, 19, 4, 1, 2, -.005352279171347618, .6185457706451416, .4920490980148315, 0, 2, 1, 18, 8, 2, -1, 1, 19, 8, 1, 2, -.0159688591957092, .1382617950439453, .4983252882957459, 0, 2, 13, 5, 6, 15, -1, 15, 5, 2, 15, 3, .004767606034874916, .4688057899475098, .5490046143531799, 0, 2, 9, 8, 2, 2, -1, 9, 9, 2, 1, 2, -.002471469109877944, .2368514984846115, .5003952980041504, 0, 2, 9, 5, 2, 3, -1, 9, 5, 1, 3, 2, -.0007103378884494305, .5856394171714783, .4721533060073853, 0, 2, 1, 5, 6, 15, -1, 3, 5, 2, 15, 3, -.1411755979061127, .0869000628590584, .4961591064929962, 0, 3, 4, 1, 14, 8, -1, 11, 1, 7, 4, 2, 4, 5, 7, 4, 2, .1065180972218514, .5138837099075317, .1741005033254623, 0, 3, 2, 4, 4, 16, -1, 2, 4, 2, 8, 2, 4, 12, 2, 8, 2, -.0527447499334812, .7353636026382446, .4772881865501404, 0, 2, 12, 4, 3, 12, -1, 12, 10, 3, 6, 2, -.00474317604675889, .3884406089782715, .5292701721191406, 0, 3, 4, 5, 10, 12, -1, 4, 5, 5, 6, 2, 9, 11, 5, 6, 2, .0009967676596716046, .5223492980003357, .4003424048423767, 0, 2, 9, 14, 2, 3, -1, 9, 15, 2, 1, 3, .00802841316908598, .4959106147289276, .7212964296340942, 0, 2, 5, 4, 2, 3, -1, 5, 5, 2, 1, 3, .0008602585876360536, .4444884061813355, .55384761095047, 0, 3, 12, 2, 4, 10, -1, 14, 2, 2, 5, 2, 12, 7, 2, 5, 2, .0009319150121882558, .539837121963501, .4163244068622589, 0, 2, 6, 4, 7, 3, -1, 6, 5, 7, 1, 3, -.002508206060156226, .5854265093803406, .456250011920929, 0, 3, 2, 0, 18, 2, -1, 11, 0, 9, 1, 2, 2, 1, 9, 1, 2, -.0021378761157393456, .4608069062232971, .5280259251594543, 0, 3, 0, 0, 18, 2, -1, 0, 0, 9, 1, 2, 9, 1, 9, 1, 2, -.002154604997485876, .3791126906871796, .5255997180938721, 0, 3, 13, 13, 4, 6, -1, 15, 13, 2, 3, 2, 13, 16, 2, 3, 2, -.007621400989592075, .5998609066009521, .4952073991298676, 0, 3, 3, 13, 4, 6, -1, 3, 13, 2, 3, 2, 5, 16, 2, 3, 2, .002205536002293229, .4484206140041351, .5588530898094177, 0, 2, 10, 12, 2, 6, -1, 10, 15, 2, 3, 2, .0012586950324475765, .5450747013092041, .4423840939998627, 0, 3, 5, 9, 10, 10, -1, 5, 9, 5, 5, 2, 10, 14, 5, 5, 2, -.005092672072350979, .4118275046348572, .5263035893440247, 0, 3, 11, 4, 4, 2, -1, 13, 4, 2, 1, 2, 11, 5, 2, 1, 2, -.0025095739401876926, .5787907838821411, .4998494982719421, 0, 2, 7, 12, 6, 8, -1, 10, 12, 3, 8, 2, -.0773275569081306, .8397865891456604, .481112003326416, 0, 3, 12, 2, 4, 10, -1, 14, 2, 2, 5, 2, 12, 7, 2, 5, 2, -.041485819965601, .240861102938652, .5176993012428284, 0, 2, 8, 11, 2, 1, -1, 9, 11, 1, 1, 2, .00010355669655837119, .4355360865592957, .5417054295539856, 0, 2, 10, 5, 1, 12, -1, 10, 9, 1, 4, 3, .0013255809899419546, .5453971028327942, .4894095063209534, 0, 2, 0, 11, 6, 9, -1, 3, 11, 3, 9, 2, -.00805987324565649, .5771024227142334, .4577918946743012, 0, 3, 12, 2, 4, 10, -1, 14, 2, 2, 5, 2, 12, 7, 2, 5, 2, .019058620557189, .5169867873191833, .3400475084781647, 0, 3, 4, 2, 4, 10, -1, 4, 2, 2, 5, 2, 6, 7, 2, 5, 2, -.0350578911602497, .2203243970870972, .5000503063201904, 0, 3, 11, 4, 4, 2, -1, 13, 4, 2, 1, 2, 11, 5, 2, 1, 2, .005729605909436941, .5043408274650574, .6597570776939392, 0, 2, 0, 14, 6, 3, -1, 0, 15, 6, 1, 3, -.0116483299061656, .2186284959316254, .4996652901172638, 0, 3, 11, 4, 4, 2, -1, 13, 4, 2, 1, 2, 11, 5, 2, 1, 2, .0014544479781761765, .5007681846618652, .5503727793693542, 0, 2, 6, 1, 3, 2, -1, 7, 1, 1, 2, 3, -.00025030909455381334, .4129841029644013, .524167001247406, 0, 3, 11, 4, 4, 2, -1, 13, 4, 2, 1, 2, 11, 5, 2, 1, 2, -.000829072727356106, .541286826133728, .4974496066570282, 0, 3, 5, 4, 4, 2, -1, 5, 4, 2, 1, 2, 7, 5, 2, 1, 2, .0010862209601327777, .460552990436554, .5879228711128235, 0, 3, 13, 0, 2, 12, -1, 14, 0, 1, 6, 2, 13, 6, 1, 6, 2, .0002000050008064136, .5278854966163635, .4705209136009216, 0, 2, 6, 0, 3, 10, -1, 7, 0, 1, 10, 3, .0029212920926511288, .5129609704017639, .375553697347641, 0, 2, 3, 0, 17, 8, -1, 3, 4, 17, 4, 2, .0253874007612467, .4822691977024078, .5790768265724182, 0, 2, 0, 4, 20, 4, -1, 0, 6, 20, 2, 2, -.00319684692658484, .5248395204544067, .3962840139865875, 90.25334930419922, 182, 0, 2, 0, 3, 8, 2, -1, 4, 3, 4, 2, 2, .005803173873573542, .3498983979225159, .596198320388794, 0, 2, 8, 11, 4, 3, -1, 8, 12, 4, 1, 3, -.009000306949019432, .6816636919975281, .4478552043437958, 0, 3, 5, 7, 6, 4, -1, 5, 7, 3, 2, 2, 8, 9, 3, 2, 2, -.00115496595390141, .5585706233978271, .3578251004219055, 0, 2, 8, 3, 4, 9, -1, 8, 6, 4, 3, 3, -.0011069850297644734, .5365036129951477, .3050428032875061, 0, 2, 8, 15, 1, 4, -1, 8, 17, 1, 2, 2, .00010308309720130637, .363909512758255, .5344635844230652, 0, 2, 4, 5, 12, 7, -1, 8, 5, 4, 7, 3, -.005098483990877867, .2859157025814056, .5504264831542969, 0, 3, 4, 2, 4, 10, -1, 4, 2, 2, 5, 2, 6, 7, 2, 5, 2, .0008257220033556223, .5236523747444153, .3476041853427887, 0, 2, 3, 0, 17, 2, -1, 3, 1, 17, 1, 2, .009978332556784153, .4750322103500366, .621964693069458, 0, 2, 2, 2, 16, 15, -1, 2, 7, 16, 5, 3, -.0374025292694569, .334337592124939, .527806282043457, 0, 2, 15, 2, 5, 2, -1, 15, 3, 5, 1, 2, .0048548257909715176, .5192180871963501, .3700444102287293, 0, 2, 9, 3, 2, 2, -1, 10, 3, 1, 2, 2, -.001866447040811181, .2929843962192535, .5091944932937622, 0, 2, 4, 5, 16, 15, -1, 4, 10, 16, 5, 3, .0168888904154301, .3686845898628235, .5431225895881653, 0, 2, 7, 13, 5, 6, -1, 7, 16, 5, 3, 2, -.005837262142449617, .3632183969020844, .5221335887908936, 0, 2, 10, 7, 3, 2, -1, 11, 7, 1, 2, 3, -.00147137395106256, .5870683789253235, .4700650870800018, 0, 2, 8, 3, 3, 1, -1, 9, 3, 1, 1, 3, -.0011522950371727347, .3195894956588745, .5140954256057739, 0, 2, 9, 16, 3, 3, -1, 9, 17, 3, 1, 3, -.004256030078977346, .6301859021186829, .4814921021461487, 0, 2, 0, 2, 5, 2, -1, 0, 3, 5, 1, 2, -.006737829186022282, .1977048069238663, .5025808215141296, 0, 2, 12, 5, 4, 3, -1, 12, 6, 4, 1, 3, .0113826701417565, .495413213968277, .6867045760154724, 0, 2, 1, 7, 12, 1, -1, 5, 7, 4, 1, 3, .005179470870643854, .5164427757263184, .3350647985935211, 0, 2, 7, 5, 6, 14, -1, 7, 12, 6, 7, 2, -.1174378991127014, .2315246015787125, .5234413743019104, 0, 3, 0, 0, 8, 10, -1, 0, 0, 4, 5, 2, 4, 5, 4, 5, 2, .0287034492939711, .4664297103881836, .6722521185874939, 0, 2, 9, 1, 3, 2, -1, 10, 1, 1, 2, 3, .004823103081434965, .5220875144004822, .2723532915115356, 0, 2, 8, 1, 3, 2, -1, 9, 1, 1, 2, 3, .0026798530016094446, .5079277157783508, .2906948924064636, 0, 2, 12, 4, 3, 3, -1, 12, 5, 3, 1, 3, .008050408214330673, .4885950982570648, .6395021080970764, 0, 2, 7, 4, 6, 16, -1, 7, 12, 6, 8, 2, .004805495962500572, .5197256803512573, .365666389465332, 0, 2, 12, 4, 3, 3, -1, 12, 5, 3, 1, 3, -.0022420159075409174, .6153467893600464, .4763701856136322, 0, 2, 2, 3, 2, 6, -1, 2, 5, 2, 2, 3, -.0137577103450894, .2637344896793366, .5030903220176697, 0, 2, 14, 2, 6, 9, -1, 14, 5, 6, 3, 3, -.1033829972147942, .2287521958351135, .5182461142539978, 0, 2, 5, 4, 3, 3, -1, 5, 5, 3, 1, 3, -.009443208575248718, .6953303813934326, .4694949090480804, 0, 2, 9, 17, 3, 2, -1, 10, 17, 1, 2, 3, .0008027118165045977, .5450655221939087, .4268783926963806, 0, 2, 5, 5, 2, 3, -1, 5, 6, 2, 1, 3, -.004194566980004311, .6091387867927551, .4571642875671387, 0, 2, 13, 11, 3, 6, -1, 13, 13, 3, 2, 3, .0109422104433179, .5241063237190247, .3284547030925751, 0, 2, 3, 14, 2, 6, -1, 3, 17, 2, 3, 2, -.0005784106906503439, .5387929081916809, .4179368913173676, 0, 2, 14, 3, 6, 2, -1, 14, 4, 6, 1, 2, -.002088862005621195, .4292691051959992, .5301715731620789, 0, 2, 0, 8, 16, 2, -1, 0, 9, 16, 1, 2, .0032383969519287348, .379234790802002, .5220744013786316, 0, 2, 14, 3, 6, 2, -1, 14, 4, 6, 1, 2, .004907502792775631, .5237283110618591, .4126757979393005, 0, 2, 0, 0, 5, 6, -1, 0, 2, 5, 2, 3, -.0322779417037964, .1947655975818634, .4994502067565918, 0, 2, 12, 5, 4, 3, -1, 12, 6, 4, 1, 3, -.008971123024821281, .6011285185813904, .4929032027721405, 0, 2, 4, 11, 3, 6, -1, 4, 13, 3, 2, 3, .0153210898861289, .5009753704071045, .2039822041988373, 0, 2, 12, 5, 4, 3, -1, 12, 6, 4, 1, 3, .002085556974634528, .4862189888954163, .5721694827079773, 0, 2, 9, 5, 1, 3, -1, 9, 6, 1, 1, 3, .005061502102762461, .5000218749046326, .1801805943250656, 0, 2, 12, 5, 4, 3, -1, 12, 6, 4, 1, 3, -.0037174751050770283, .5530117154121399, .4897592961788178, 0, 2, 6, 6, 8, 12, -1, 6, 12, 8, 6, 2, -.0121705001220107, .4178605973720551, .5383723974227905, 0, 2, 12, 5, 4, 3, -1, 12, 6, 4, 1, 3, .004624839872121811, .4997169971466065, .5761327147483826, 0, 2, 5, 12, 9, 2, -1, 8, 12, 3, 2, 3, -.0002104042941937223, .5331807136535645, .4097681045532227, 0, 2, 12, 5, 4, 3, -1, 12, 6, 4, 1, 3, -.0146417804062366, .5755925178527832, .5051776170730591, 0, 2, 4, 5, 4, 3, -1, 4, 6, 4, 1, 3, .00331994891166687, .4576976895332336, .6031805872917175, 0, 2, 6, 6, 9, 2, -1, 9, 6, 3, 2, 3, .003723687957972288, .4380396902561188, .541588306427002, 0, 2, 4, 11, 1, 3, -1, 4, 12, 1, 1, 3, .0008295116131193936, .5163031816482544, .3702219128608704, 0, 2, 14, 12, 6, 6, -1, 14, 12, 3, 6, 2, -.0114084901288152, .6072946786880493, .4862565100193024, 0, 2, 7, 0, 3, 7, -1, 8, 0, 1, 7, 3, -.004532012157142162, .3292475938796997, .5088962912559509, 0, 2, 9, 8, 3, 3, -1, 10, 8, 1, 3, 3, .00512760179117322, .4829767942428589, .6122708916664124, 0, 2, 8, 8, 3, 3, -1, 9, 8, 1, 3, 3, .00985831581056118, .4660679996013641, .6556177139282227, 0, 2, 5, 10, 11, 3, -1, 5, 11, 11, 1, 3, .036985918879509, .5204849243164062, .1690472066402435, 0, 2, 5, 7, 10, 1, -1, 10, 7, 5, 1, 2, .004649116192013025, .5167322158813477, .3725225031375885, 0, 2, 9, 7, 3, 2, -1, 10, 7, 1, 2, 3, -.004266470205038786, .6406493186950684, .4987342953681946, 0, 2, 8, 7, 3, 2, -1, 9, 7, 1, 2, 3, -.0004795659042429179, .5897293090820312, .4464873969554901, 0, 2, 11, 9, 4, 2, -1, 11, 9, 2, 2, 2, .0036827160511165857, .5441560745239258, .347266286611557, 0, 2, 5, 9, 4, 2, -1, 7, 9, 2, 2, 2, -.0100598800927401, .2143162935972214, .500482976436615, 0, 2, 14, 10, 2, 4, -1, 14, 12, 2, 2, 2, -.0003036184061784297, .538642406463623, .4590323865413666, 0, 2, 7, 7, 3, 2, -1, 8, 7, 1, 2, 3, -.0014545479789376259, .5751184225082397, .4497095048427582, 0, 2, 14, 17, 6, 3, -1, 14, 18, 6, 1, 3, .0016515209572389722, .5421937704086304, .4238520860671997, 0, 3, 4, 5, 12, 12, -1, 4, 5, 6, 6, 2, 10, 11, 6, 6, 2, -.007846863940358162, .4077920913696289, .5258157253265381, 0, 3, 6, 9, 8, 8, -1, 10, 9, 4, 4, 2, 6, 13, 4, 4, 2, -.005125985015183687, .422927588224411, .5479453206062317, 0, 2, 0, 4, 15, 4, -1, 5, 4, 5, 4, 3, -.0368909612298012, .6596375703811646, .4674678146839142, 0, 2, 13, 2, 4, 1, -1, 13, 2, 2, 1, 2, .0002403563994448632, .4251135885715485, .5573202967643738, 0, 2, 4, 12, 2, 2, -1, 4, 13, 2, 1, 2, -15150169929256663e-21, .5259246826171875, .4074114859104157, 0, 2, 8, 13, 4, 3, -1, 8, 14, 4, 1, 3, .0022108471021056175, .4671722948551178, .5886352062225342, 0, 2, 9, 13, 2, 3, -1, 9, 14, 2, 1, 3, -.0011568620102480054, .5711066126823425, .4487161934375763, 0, 2, 13, 11, 2, 3, -1, 13, 12, 2, 1, 3, .004999629221856594, .5264198184013367, .2898327112197876, 0, 3, 7, 12, 4, 4, -1, 7, 12, 2, 2, 2, 9, 14, 2, 2, 2, -.0014656189596280456, .3891738057136536, .5197871923446655, 0, 3, 10, 11, 2, 2, -1, 11, 11, 1, 1, 2, 10, 12, 1, 1, 2, -.0011975039960816503, .5795872807502747, .4927955865859985, 0, 2, 8, 17, 3, 2, -1, 9, 17, 1, 2, 3, -.0044954330660402775, .2377603054046631, .5012555122375488, 0, 3, 10, 11, 2, 2, -1, 11, 11, 1, 1, 2, 10, 12, 1, 1, 2, .00014997160178609192, .4876626133918762, .5617607831954956, 0, 2, 0, 17, 6, 3, -1, 0, 18, 6, 1, 3, .002639150945469737, .516808807849884, .3765509128570557, 0, 3, 10, 11, 2, 2, -1, 11, 11, 1, 1, 2, 10, 12, 1, 1, 2, -.0002936813107226044, .5446649193763733, .4874630868434906, 0, 3, 8, 11, 2, 2, -1, 8, 11, 1, 1, 2, 9, 12, 1, 1, 2, .0014211760135367513, .4687897861003876, .669133186340332, 0, 2, 12, 5, 8, 4, -1, 12, 5, 4, 4, 2, .0794276371598244, .5193443894386292, .273294597864151, 0, 2, 0, 5, 8, 4, -1, 4, 5, 4, 4, 2, .0799375027418137, .4971731007099152, .1782083958387375, 0, 2, 13, 2, 4, 1, -1, 13, 2, 2, 1, 2, .0110892597585917, .5165994763374329, .3209475874900818, 0, 2, 3, 2, 4, 1, -1, 5, 2, 2, 1, 2, .00016560709627810866, .4058471918106079, .5307276248931885, 0, 3, 10, 0, 4, 2, -1, 12, 0, 2, 1, 2, 10, 1, 2, 1, 2, -.0053354292176663876, .3445056974887848, .5158129930496216, 0, 2, 7, 12, 3, 1, -1, 8, 12, 1, 1, 3, .0011287260567769408, .4594863057136536, .6075533032417297, 0, 3, 8, 11, 4, 8, -1, 10, 11, 2, 4, 2, 8, 15, 2, 4, 2, -.0219692196696997, .1680400967597961, .5228595733642578, 0, 2, 9, 9, 2, 2, -1, 9, 10, 2, 1, 2, -.00021775320055894554, .3861596882343292, .5215672850608826, 0, 2, 3, 18, 15, 2, -1, 3, 19, 15, 1, 2, .00020200149447191507, .5517979264259338, .4363039135932922, 0, 3, 2, 6, 2, 12, -1, 2, 6, 1, 6, 2, 3, 12, 1, 6, 2, -.0217331498861313, .7999460101127625, .4789851009845734, 0, 2, 9, 8, 2, 3, -1, 9, 9, 2, 1, 3, -.0008439993252977729, .4085975885391235, .5374773144721985, 0, 2, 7, 10, 3, 2, -1, 8, 10, 1, 2, 3, -.00043895249837078154, .5470405220985413, .4366143047809601, 0, 2, 11, 11, 3, 1, -1, 12, 11, 1, 1, 3, .0015092400135472417, .4988996982574463, .5842149257659912, 0, 2, 6, 11, 3, 1, -1, 7, 11, 1, 1, 3, -.003554783994331956, .6753690242767334, .4721005856990814, 0, 3, 9, 2, 4, 2, -1, 11, 2, 2, 1, 2, 9, 3, 2, 1, 2, .00048191400128416717, .541585385799408, .4357109069824219, 0, 2, 4, 12, 2, 3, -1, 4, 13, 2, 1, 3, -.00602643983438611, .2258509993553162, .499188095331192, 0, 2, 2, 1, 18, 3, -1, 8, 1, 6, 3, 3, -.0116681400686502, .625655472278595, .4927498996257782, 0, 2, 5, 1, 4, 14, -1, 7, 1, 2, 14, 2, -.0028718370012938976, .3947784900665283, .524580180644989, 0, 2, 8, 16, 12, 3, -1, 8, 16, 6, 3, 2, .0170511696487665, .4752511084079742, .5794224143028259, 0, 2, 1, 17, 18, 3, -1, 7, 17, 6, 3, 3, -.0133520802482963, .6041104793548584, .4544535875320435, 0, 2, 9, 14, 2, 6, -1, 9, 17, 2, 3, 2, -.0003930180100724101, .4258275926113129, .5544905066490173, 0, 2, 9, 12, 1, 8, -1, 9, 16, 1, 4, 2, .0030483349692076445, .5233420133590698, .3780272901058197, 0, 2, 9, 14, 2, 3, -1, 9, 15, 2, 1, 3, -.00435792887583375, .6371889114379883, .4838674068450928, 0, 2, 9, 6, 2, 12, -1, 9, 10, 2, 4, 3, .0056661018170416355, .5374705791473389, .4163666069507599, 0, 2, 12, 9, 3, 3, -1, 12, 10, 3, 1, 3, 6067733920644969e-20, .4638795852661133, .5311625003814697, 0, 2, 0, 1, 4, 8, -1, 2, 1, 2, 8, 2, .0367381609976292, .4688656032085419, .6466524004936218, 0, 3, 9, 1, 6, 2, -1, 12, 1, 3, 1, 2, 9, 2, 3, 1, 2, .008652813732624054, .5204318761825562, .2188657969236374, 0, 2, 1, 3, 12, 14, -1, 1, 10, 12, 7, 2, -.1537135988473892, .1630371958017349, .4958840012550354, 0, 3, 8, 12, 4, 2, -1, 10, 12, 2, 1, 2, 8, 13, 2, 1, 2, -.00041560421232134104, .577445924282074, .4696458876132965, 0, 3, 1, 9, 10, 2, -1, 1, 9, 5, 1, 2, 6, 10, 5, 1, 2, -.0012640169588848948, .3977175951004028, .5217198133468628, 0, 2, 8, 15, 4, 3, -1, 8, 16, 4, 1, 3, -.003547334112226963, .6046528220176697, .480831503868103, 0, 2, 6, 8, 8, 3, -1, 6, 9, 8, 1, 3, 3001906952704303e-20, .3996723890304565, .5228201150894165, 0, 2, 9, 15, 5, 3, -1, 9, 16, 5, 1, 3, .00131130195222795, .4712158143520355, .5765997767448425, 0, 2, 8, 7, 4, 3, -1, 8, 8, 4, 1, 3, -.0013374709524214268, .4109584987163544, .5253170132637024, 0, 2, 7, 7, 6, 2, -1, 7, 8, 6, 1, 2, .0208767093718052, .5202993750572205, .1757981926202774, 0, 3, 5, 7, 8, 2, -1, 5, 7, 4, 1, 2, 9, 8, 4, 1, 2, -.007549794856458902, .6566609740257263, .4694975018501282, 0, 2, 12, 9, 3, 3, -1, 12, 10, 3, 1, 3, .0241885501891375, .5128673911094666, .3370220959186554, 0, 2, 4, 7, 4, 2, -1, 4, 8, 4, 1, 2, -.002935882890596986, .658078670501709, .4694541096687317, 0, 2, 14, 2, 6, 9, -1, 14, 5, 6, 3, 3, .0575579293072224, .5146445035934448, .2775259912014008, 0, 2, 4, 9, 3, 3, -1, 5, 9, 1, 3, 3, -.0011343370424583554, .3836601972579956, .5192667245864868, 0, 2, 12, 9, 3, 3, -1, 12, 10, 3, 1, 3, .0168169997632504, .5085592865943909, .6177260875701904, 0, 2, 0, 2, 6, 9, -1, 0, 5, 6, 3, 3, .005053517874330282, .5138763189315796, .3684791922569275, 0, 2, 17, 3, 3, 6, -1, 18, 3, 1, 6, 3, -.004587471019476652, .5989655256271362, .4835202097892761, 0, 2, 0, 3, 3, 6, -1, 1, 3, 1, 6, 3, .001688246033154428, .4509486854076386, .5723056793212891, 0, 2, 17, 14, 1, 2, -1, 17, 15, 1, 1, 2, -.0016554000321775675, .3496770858764648, .5243319272994995, 0, 2, 4, 9, 4, 3, -1, 6, 9, 2, 3, 2, -.0193738006055355, .1120536997914314, .496871292591095, 0, 2, 12, 9, 3, 3, -1, 12, 10, 3, 1, 3, .0103744501248002, .5148196816444397, .4395213127136231, 0, 2, 5, 9, 3, 3, -1, 5, 10, 3, 1, 3, .00014973050565458834, .4084999859333038, .526988685131073, 0, 3, 9, 5, 6, 8, -1, 12, 5, 3, 4, 2, 9, 9, 3, 4, 2, -.042981930077076, .6394104957580566, .501850426197052, 0, 3, 5, 5, 6, 8, -1, 5, 5, 3, 4, 2, 8, 9, 3, 4, 2, .008306593634188175, .470755398273468, .6698353290557861, 0, 2, 16, 1, 4, 6, -1, 16, 4, 4, 3, 2, -.0041285790503025055, .4541369080543518, .5323647260665894, 0, 2, 1, 0, 6, 20, -1, 3, 0, 2, 20, 3, .0017399420030415058, .433396190404892, .5439866185188293, 0, 2, 12, 11, 3, 2, -1, 13, 11, 1, 2, 3, .00011739750334527344, .4579687118530273, .5543426275253296, 0, 2, 5, 11, 3, 2, -1, 6, 11, 1, 2, 3, .00018585780344437808, .4324643909931183, .5426754951477051, 0, 2, 9, 4, 6, 1, -1, 11, 4, 2, 1, 3, .005558769218623638, .525722086429596, .3550611138343811, 0, 2, 0, 0, 8, 3, -1, 4, 0, 4, 3, 2, -.007985156029462814, .6043018102645874, .4630635976791382, 0, 2, 15, 0, 2, 5, -1, 15, 0, 1, 5, 2, .0006059412262402475, .4598254859447479, .55331951379776, 0, 2, 4, 1, 3, 2, -1, 5, 1, 1, 2, 3, -.0002298304025316611, .4130752086639404, .5322461128234863, 0, 2, 7, 0, 6, 15, -1, 9, 0, 2, 15, 3, .0004374021082185209, .4043039977550507, .5409289002418518, 0, 2, 6, 11, 3, 1, -1, 7, 11, 1, 1, 3, .0002948202018160373, .4494963884353638, .5628852248191833, 0, 2, 12, 0, 3, 4, -1, 13, 0, 1, 4, 3, .0103126596659422, .5177510976791382, .2704316973686218, 0, 2, 5, 4, 6, 1, -1, 7, 4, 2, 1, 3, -.007724110968410969, .1988019049167633, .4980553984642029, 0, 2, 12, 7, 3, 2, -1, 12, 8, 3, 1, 2, -.004679720848798752, .6644750237464905, .5018296241760254, 0, 2, 0, 1, 4, 6, -1, 0, 4, 4, 3, 2, -.005075545981526375, .3898304998874664, .5185269117355347, 0, 2, 12, 7, 3, 2, -1, 12, 8, 3, 1, 2, .00224797404371202, .4801808893680573, .5660336017608643, 0, 2, 2, 16, 3, 3, -1, 2, 17, 3, 1, 3, .0008332700817845762, .5210919976234436, .3957188129425049, 0, 3, 13, 8, 6, 10, -1, 16, 8, 3, 5, 2, 13, 13, 3, 5, 2, -.0412793308496475, .6154541969299316, .5007054209709167, 0, 2, 0, 9, 5, 2, -1, 0, 10, 5, 1, 2, -.0005093018990010023, .3975942134857178, .5228403806686401, 0, 3, 12, 11, 2, 2, -1, 13, 11, 1, 1, 2, 12, 12, 1, 1, 2, .0012568780221045017, .4979138076305389, .5939183235168457, 0, 2, 3, 15, 3, 3, -1, 3, 16, 3, 1, 3, .008004849776625633, .4984497129917145, .1633366048336029, 0, 2, 12, 7, 3, 2, -1, 12, 8, 3, 1, 2, -.0011879300000146031, .5904964804649353, .4942624866962433, 0, 2, 5, 7, 3, 2, -1, 5, 8, 3, 1, 2, .0006194895249791443, .4199557900428772, .5328726172447205, 0, 2, 9, 5, 9, 9, -1, 9, 8, 9, 3, 3, .006682985927909613, .5418602824211121, .490588903427124, 0, 2, 5, 0, 3, 7, -1, 6, 0, 1, 7, 3, -.0037062340416014194, .3725939095020294, .5138000249862671, 0, 2, 5, 2, 12, 5, -1, 9, 2, 4, 5, 3, -.0397394113242626, .6478961110115051, .5050346851348877, 0, 3, 6, 11, 2, 2, -1, 6, 11, 1, 1, 2, 7, 12, 1, 1, 2, .0014085009461268783, .4682339131832123, .6377884149551392, 0, 2, 15, 15, 3, 2, -1, 15, 16, 3, 1, 2, .0003932268882635981, .5458530187606812, .415048211812973, 0, 2, 2, 15, 3, 2, -1, 2, 16, 3, 1, 2, -.0018979819724336267, .3690159916877747, .5149704217910767, 0, 3, 14, 12, 6, 8, -1, 17, 12, 3, 4, 2, 14, 16, 3, 4, 2, -.0139704402536154, .6050562858581543, .4811357855796814, 0, 2, 2, 8, 15, 6, -1, 7, 8, 5, 6, 3, -.1010081991553307, .2017080038785934, .4992361962795258, 0, 2, 2, 2, 18, 17, -1, 8, 2, 6, 17, 3, -.0173469204455614, .5713148713111877, .4899486005306244, 0, 2, 5, 1, 4, 1, -1, 7, 1, 2, 1, 2, .000156197595060803, .4215388894081116, .5392642021179199, 0, 2, 5, 2, 12, 5, -1, 9, 2, 4, 5, 3, .1343892961740494, .5136151909828186, .3767612874507904, 0, 2, 3, 2, 12, 5, -1, 7, 2, 4, 5, 3, -.0245822407305241, .7027357816696167, .4747906923294067, 0, 3, 4, 9, 12, 4, -1, 10, 9, 6, 2, 2, 4, 11, 6, 2, 2, -.0038553720805794, .4317409098148346, .5427716970443726, 0, 3, 5, 15, 6, 2, -1, 5, 15, 3, 1, 2, 8, 16, 3, 1, 2, -.002316524973139167, .594269871711731, .4618647992610931, 0, 2, 10, 14, 2, 3, -1, 10, 15, 2, 1, 3, -.004851812031120062, .6191568970680237, .4884895086288452, 0, 3, 0, 13, 20, 2, -1, 0, 13, 10, 1, 2, 10, 14, 10, 1, 2, .002469993894919753, .5256664752960205, .4017199873924255, 0, 3, 4, 9, 12, 8, -1, 10, 9, 6, 4, 2, 4, 13, 6, 4, 2, .0454969592392445, .5237867832183838, .2685773968696594, 0, 2, 8, 13, 3, 6, -1, 8, 16, 3, 3, 2, -.0203195996582508, .213044598698616, .4979738891124725, 0, 2, 10, 12, 2, 2, -1, 10, 13, 2, 1, 2, .0002699499891605228, .481404185295105, .5543122291564941, 0, 3, 9, 12, 2, 2, -1, 9, 12, 1, 1, 2, 10, 13, 1, 1, 2, -.0018232699949294329, .6482579708099365, .4709989130496979, 0, 3, 4, 11, 14, 4, -1, 11, 11, 7, 2, 2, 4, 13, 7, 2, 2, -.006301579065620899, .4581927955150604, .5306236147880554, 0, 2, 8, 5, 4, 2, -1, 8, 6, 4, 1, 2, -.0002413949987385422, .5232086777687073, .4051763117313385, 0, 2, 10, 10, 6, 3, -1, 12, 10, 2, 3, 3, -.001033036969602108, .5556201934814453, .4789193868637085, 0, 2, 2, 14, 1, 2, -1, 2, 15, 1, 1, 2, .0001804116036510095, .5229442715644836, .4011810123920441, 0, 3, 13, 8, 6, 12, -1, 16, 8, 3, 6, 2, 13, 14, 3, 6, 2, -.0614078603684902, .62986820936203, .5010703206062317, 0, 3, 1, 8, 6, 12, -1, 1, 8, 3, 6, 2, 4, 14, 3, 6, 2, -.0695439130067825, .7228280901908875, .4773184061050415, 0, 2, 10, 0, 6, 10, -1, 12, 0, 2, 10, 3, -.0705426633358002, .2269513010978699, .5182529091835022, 0, 3, 5, 11, 8, 4, -1, 5, 11, 4, 2, 2, 9, 13, 4, 2, 2, .0024423799477517605, .5237097144126892, .4098151028156281, 0, 3, 10, 16, 8, 4, -1, 14, 16, 4, 2, 2, 10, 18, 4, 2, 2, .0015494349645450711, .4773750901222229, .5468043088912964, 0, 2, 7, 7, 6, 6, -1, 9, 7, 2, 6, 3, -.0239142198115587, .7146975994110107, .4783824980258942, 0, 2, 10, 2, 4, 10, -1, 10, 2, 2, 10, 2, -.0124536901712418, .2635296881198883, .5241122841835022, 0, 2, 6, 1, 4, 9, -1, 8, 1, 2, 9, 2, -.00020760179904755205, .3623757064342499, .5113608837127686, 0, 2, 12, 19, 2, 1, -1, 12, 19, 1, 1, 2, 29781080229440704e-21, .4705932140350342, .5432801842689514, 104.74919891357422, 211, 0, 2, 1, 2, 4, 9, -1, 3, 2, 2, 9, 2, .0117727499455214, .3860518932342529, .6421167254447937, 0, 2, 7, 5, 6, 4, -1, 9, 5, 2, 4, 3, .0270375702530146, .4385654926300049, .675403892993927, 0, 2, 9, 4, 2, 4, -1, 9, 6, 2, 2, 2, -3641950024757534e-20, .5487101078033447, .34233158826828, 0, 2, 14, 5, 2, 8, -1, 14, 9, 2, 4, 2, .001999540952965617, .3230532109737396, .5400317907333374, 0, 2, 7, 6, 5, 12, -1, 7, 12, 5, 6, 2, .0045278300531208515, .5091639757156372, .2935043871402741, 0, 2, 14, 6, 2, 6, -1, 14, 9, 2, 3, 2, .00047890920541249216, .4178153872489929, .5344064235687256, 0, 2, 4, 6, 2, 6, -1, 4, 9, 2, 3, 2, .0011720920447260141, .2899182140827179, .5132070779800415, 0, 3, 8, 15, 10, 4, -1, 13, 15, 5, 2, 2, 8, 17, 5, 2, 2, .0009530570241622627, .428012490272522, .5560845136642456, 0, 2, 6, 18, 2, 2, -1, 7, 18, 1, 2, 2, 15099150004971307e-21, .4044871926307678, .5404760241508484, 0, 2, 11, 3, 6, 2, -1, 11, 4, 6, 1, 2, -.0006081790197640657, .4271768927574158, .5503466129302979, 0, 2, 2, 0, 16, 6, -1, 2, 2, 16, 2, 3, .003322452073916793, .3962723910808563, .5369734764099121, 0, 2, 11, 3, 6, 2, -1, 11, 4, 6, 1, 2, -.0011037490330636501, .4727177917957306, .5237749814987183, 0, 2, 4, 11, 10, 3, -1, 4, 12, 10, 1, 3, -.0014350269921123981, .5603008270263672, .4223509132862091, 0, 2, 11, 3, 6, 2, -1, 11, 4, 6, 1, 2, .0020767399109899998, .5225917100906372, .4732725918292999, 0, 2, 3, 3, 6, 2, -1, 3, 4, 6, 1, 2, -.00016412809782195836, .3999075889587402, .5432739853858948, 0, 2, 16, 0, 4, 7, -1, 16, 0, 2, 7, 2, .008830243721604347, .4678385853767395, .6027327179908752, 0, 2, 0, 14, 9, 6, -1, 0, 16, 9, 2, 3, -.0105520701035857, .3493967056274414, .5213974714279175, 0, 2, 9, 16, 3, 3, -1, 9, 17, 3, 1, 3, -.00227316003292799, .6185818910598755, .4749062955379486, 0, 2, 4, 6, 6, 2, -1, 6, 6, 2, 2, 3, -.0008478633244521916, .5285341143608093, .3843482136726379, 0, 2, 15, 11, 1, 3, -1, 15, 12, 1, 1, 3, .0012081359745934606, .536064088344574, .3447335958480835, 0, 2, 5, 5, 2, 3, -1, 5, 6, 2, 1, 3, .002651273040100932, .4558292031288147, .6193962097167969, 0, 2, 10, 9, 2, 2, -1, 10, 10, 2, 1, 2, -.0011012479662895203, .368023008108139, .5327628254890442, 0, 2, 3, 1, 4, 3, -1, 5, 1, 2, 3, 2, .0004956151824444532, .396059513092041, .5274940729141235, 0, 2, 16, 0, 4, 7, -1, 16, 0, 2, 7, 2, -.0439017713069916, .7020444869995117, .4992839097976685, 0, 2, 0, 0, 20, 1, -1, 10, 0, 10, 1, 2, .0346903502941132, .5049164295196533, .276660293340683, 0, 2, 15, 11, 1, 3, -1, 15, 12, 1, 1, 3, -.002744219033047557, .2672632932662964, .5274971127510071, 0, 2, 0, 4, 3, 4, -1, 1, 4, 1, 4, 3, .003331658896058798, .4579482972621918, .6001101732254028, 0, 2, 16, 3, 3, 6, -1, 16, 5, 3, 2, 3, -.0200445707887411, .3171594142913818, .523571789264679, 0, 2, 1, 3, 3, 6, -1, 1, 5, 3, 2, 3, .0013492030557245016, .5265362858772278, .4034324884414673, 0, 3, 6, 2, 12, 6, -1, 12, 2, 6, 3, 2, 6, 5, 6, 3, 2, .0029702018946409225, .5332456827163696, .4571984112262726, 0, 2, 8, 10, 4, 3, -1, 8, 11, 4, 1, 3, .006303998176008463, .4593310952186585, .6034635901451111, 0, 3, 4, 2, 14, 6, -1, 11, 2, 7, 3, 2, 4, 5, 7, 3, 2, -.0129365902394056, .4437963962554932, .5372971296310425, 0, 2, 9, 11, 2, 3, -1, 9, 12, 2, 1, 3, .004014872945845127, .4680323898792267, .6437833905220032, 0, 2, 15, 13, 2, 3, -1, 15, 14, 2, 1, 3, -.002640167949721217, .3709631860256195, .5314332842826843, 0, 2, 8, 12, 4, 3, -1, 8, 13, 4, 1, 3, .0139184398576617, .4723555147647858, .713080883026123, 0, 2, 15, 11, 1, 3, -1, 15, 12, 1, 1, 3, -.00045087869511917233, .4492394030094147, .5370404124259949, 0, 2, 7, 13, 5, 2, -1, 7, 14, 5, 1, 2, .00025384349282830954, .4406864047050476, .5514402985572815, 0, 2, 7, 12, 6, 3, -1, 7, 13, 6, 1, 3, .002271000063046813, .4682416915893555, .5967984199523926, 0, 2, 5, 11, 4, 4, -1, 5, 13, 4, 2, 2, .002412077970802784, .5079392194747925, .3018598854541779, 0, 2, 11, 4, 3, 3, -1, 12, 4, 1, 3, 3, -3602567085181363e-20, .560103714466095, .4471096992492676, 0, 2, 6, 4, 3, 3, -1, 7, 4, 1, 3, 3, -.0074905529618263245, .2207535058259964, .4989944100379944, 0, 2, 16, 5, 3, 6, -1, 17, 5, 1, 6, 3, -.017513120546937, .6531215906143188, .5017648935317993, 0, 2, 3, 6, 12, 7, -1, 7, 6, 4, 7, 3, .1428163051605225, .4967963099479675, .1482062041759491, 0, 2, 16, 5, 3, 6, -1, 17, 5, 1, 6, 3, .005534526892006397, .4898946881294251, .5954223871231079, 0, 2, 3, 13, 2, 3, -1, 3, 14, 2, 1, 3, -.0009632359142415226, .3927116990089417, .519607424736023, 0, 2, 16, 5, 3, 6, -1, 17, 5, 1, 6, 3, -.0020370010752230883, .5613325238227844, .4884858131408691, 0, 2, 1, 5, 3, 6, -1, 2, 5, 1, 6, 3, .0016614829655736685, .4472880065441132, .5578880906105042, 0, 2, 1, 9, 18, 1, -1, 7, 9, 6, 1, 3, -.0031188090797513723, .3840532898902893, .5397477746009827, 0, 2, 0, 9, 8, 7, -1, 4, 9, 4, 7, 2, -.006400061771273613, .5843983888626099, .4533218145370483, 0, 2, 12, 11, 8, 2, -1, 12, 12, 8, 1, 2, .0003131960111204535, .5439221858978271, .4234727919101715, 0, 2, 0, 11, 8, 2, -1, 0, 12, 8, 1, 2, -.0182220991700888, .1288464963436127, .4958404898643494, 0, 2, 9, 13, 2, 3, -1, 9, 14, 2, 1, 3, .008796924725174904, .49512979388237, .7153480052947998, 0, 3, 4, 10, 12, 4, -1, 4, 10, 6, 2, 2, 10, 12, 6, 2, 2, -.004239507019519806, .3946599960327148, .5194936990737915, 0, 2, 9, 3, 3, 7, -1, 10, 3, 1, 7, 3, .009708627127110958, .4897503852844238, .6064900159835815, 0, 2, 7, 2, 3, 5, -1, 8, 2, 1, 5, 3, -.003993417136371136, .3245440125465393, .5060828924179077, 0, 3, 9, 12, 4, 6, -1, 11, 12, 2, 3, 2, 9, 15, 2, 3, 2, -.0167850591242313, .1581953018903732, .5203778743743896, 0, 2, 8, 7, 3, 6, -1, 9, 7, 1, 6, 3, .018272090703249, .4680935144424439, .6626979112625122, 0, 2, 15, 4, 4, 2, -1, 15, 5, 4, 1, 2, .00568728381767869, .5211697816848755, .3512184917926788, 0, 2, 8, 7, 3, 3, -1, 9, 7, 1, 3, 3, -.0010739039862528443, .5768386125564575, .4529845118522644, 0, 2, 14, 2, 6, 4, -1, 14, 4, 6, 2, 2, -.00370938703417778, .4507763087749481, .5313581228256226, 0, 2, 7, 16, 6, 1, -1, 9, 16, 2, 1, 3, -.0002111070934915915, .5460820198059082, .4333376884460449, 0, 2, 15, 13, 2, 3, -1, 15, 14, 2, 1, 3, .0010670139454305172, .5371856093406677, .4078390896320343, 0, 2, 8, 7, 3, 10, -1, 9, 7, 1, 10, 3, .0035943021066486835, .4471287131309509, .5643836259841919, 0, 2, 11, 10, 2, 6, -1, 11, 12, 2, 2, 3, -.005177603103220463, .4499393105506897, .5280330181121826, 0, 2, 6, 10, 4, 1, -1, 8, 10, 2, 1, 2, -.00025414369883947074, .5516173243522644, .4407708048820496, 0, 2, 10, 9, 2, 2, -1, 10, 10, 2, 1, 2, .006352256052196026, .5194190144538879, .2465227991342545, 0, 2, 8, 9, 2, 2, -1, 8, 10, 2, 1, 2, -.00044205080484971404, .3830705881118774, .5139682292938232, 0, 3, 12, 7, 2, 2, -1, 13, 7, 1, 1, 2, 12, 8, 1, 1, 2, .0007448872784152627, .4891090989112854, .5974786877632141, 0, 3, 5, 7, 2, 2, -1, 5, 7, 1, 1, 2, 6, 8, 1, 1, 2, -.0035116379149258137, .7413681745529175, .4768764972686768, 0, 2, 13, 0, 3, 14, -1, 14, 0, 1, 14, 3, -.0125409103929996, .3648819029331207, .5252826809883118, 0, 2, 4, 0, 3, 14, -1, 5, 0, 1, 14, 3, .009493185207247734, .5100492835044861, .362958699464798, 0, 2, 13, 4, 3, 14, -1, 14, 4, 1, 14, 3, .0129611501470208, .5232442021369934, .4333561062812805, 0, 2, 9, 14, 2, 3, -1, 9, 15, 2, 1, 3, .004720944911241531, .4648149013519287, .6331052780151367, 0, 2, 8, 14, 4, 3, -1, 8, 15, 4, 1, 3, -.0023119079414755106, .5930309891700745, .4531058073043823, 0, 2, 4, 2, 3, 16, -1, 5, 2, 1, 16, 3, -.002826229901984334, .3870477974414825, .5257101058959961, 0, 2, 7, 2, 8, 10, -1, 7, 7, 8, 5, 2, -.0014311339473351836, .552250325679779, .4561854898929596, 0, 2, 6, 14, 7, 3, -1, 6, 15, 7, 1, 3, .0019378310535103083, .4546220898628235, .5736966729164124, 0, 3, 9, 2, 10, 12, -1, 14, 2, 5, 6, 2, 9, 8, 5, 6, 2, .00026343559147790074, .5345739126205444, .4571875035762787, 0, 2, 6, 7, 8, 2, -1, 6, 8, 8, 1, 2, .0007825752254575491, .3967815935611725, .5220187902450562, 0, 2, 8, 13, 4, 6, -1, 8, 16, 4, 3, 2, -.0195504408329725, .282964289188385, .5243508219718933, 0, 2, 6, 6, 1, 3, -1, 6, 7, 1, 1, 3, .00043914958951063454, .4590066969394684, .589909017086029, 0, 2, 16, 2, 4, 6, -1, 16, 4, 4, 2, 3, .0214520003646612, .523141086101532, .2855378985404968, 0, 3, 6, 6, 4, 2, -1, 6, 6, 2, 1, 2, 8, 7, 2, 1, 2, .0005897358059883118, .4397256970405579, .550642192363739, 0, 2, 16, 2, 4, 6, -1, 16, 4, 4, 2, 3, -.0261576101183891, .3135079145431519, .5189175009727478, 0, 2, 0, 2, 4, 6, -1, 0, 4, 4, 2, 3, -.0139598604291677, .3213272988796234, .5040717720985413, 0, 2, 9, 6, 2, 6, -1, 9, 6, 1, 6, 2, -.006369901821017265, .6387544870376587, .4849506914615631, 0, 2, 3, 4, 6, 10, -1, 3, 9, 6, 5, 2, -.008561382070183754, .2759132087230682, .5032019019126892, 0, 2, 9, 5, 2, 6, -1, 9, 5, 1, 6, 2, .000966229010373354, .4685640931129456, .5834879279136658, 0, 2, 3, 13, 2, 3, -1, 3, 14, 2, 1, 3, .0007655026856809855, .5175207257270813, .389642208814621, 0, 2, 13, 13, 3, 2, -1, 13, 14, 3, 1, 2, -.008183334022760391, .2069136947393417, .5208122134208679, 0, 3, 2, 16, 10, 4, -1, 2, 16, 5, 2, 2, 7, 18, 5, 2, 2, -.009397693909704685, .6134091019630432, .4641222953796387, 0, 3, 5, 6, 10, 6, -1, 10, 6, 5, 3, 2, 5, 9, 5, 3, 2, .004802898038178682, .5454108119010925, .439521998167038, 0, 2, 7, 14, 1, 3, -1, 7, 15, 1, 1, 3, -.003568056970834732, .6344485282897949, .4681093990802765, 0, 2, 14, 16, 6, 3, -1, 14, 17, 6, 1, 3, .0040733120404183865, .5292683243751526, .4015620052814484, 0, 2, 5, 4, 3, 3, -1, 5, 5, 3, 1, 3, .0012568129459396005, .4392988085746765, .5452824831008911, 0, 2, 7, 4, 10, 3, -1, 7, 5, 10, 1, 3, -.0029065010603517294, .5898832082748413, .4863379895687103, 0, 2, 0, 4, 5, 4, -1, 0, 6, 5, 2, 2, -.00244093406945467, .4069364964962006, .5247421860694885, 0, 2, 13, 11, 3, 9, -1, 13, 14, 3, 3, 3, .0248307008296251, .5182725787162781, .3682524859905243, 0, 2, 4, 11, 3, 9, -1, 4, 14, 3, 3, 3, -.0488540083169937, .1307577937841415, .496128112077713, 0, 2, 9, 7, 2, 1, -1, 9, 7, 1, 1, 2, -.001611037994734943, .6421005725860596, .4872662127017975, 0, 2, 5, 0, 6, 17, -1, 7, 0, 2, 17, 3, -.0970094799995422, .0477693490684032, .495098888874054, 0, 2, 10, 3, 6, 3, -1, 10, 3, 3, 3, 2, .0011209240183234215, .4616267085075378, .5354745984077454, 0, 2, 2, 2, 15, 4, -1, 7, 2, 5, 4, 3, -.001306409016251564, .626185417175293, .4638805985450745, 0, 3, 8, 2, 8, 2, -1, 12, 2, 4, 1, 2, 8, 3, 4, 1, 2, .00045771620352752507, .5384417772293091, .4646640121936798, 0, 2, 8, 1, 3, 6, -1, 8, 3, 3, 2, 3, -.0006314995116554201, .3804047107696533, .51302570104599, 0, 2, 9, 17, 2, 2, -1, 9, 18, 2, 1, 2, .0001450597046641633, .4554310142993927, .5664461851119995, 0, 2, 0, 0, 2, 14, -1, 1, 0, 1, 14, 2, -.0164745505899191, .6596958041191101, .4715859889984131, 0, 2, 12, 0, 7, 3, -1, 12, 1, 7, 1, 3, .0133695797994733, .519546627998352, .3035964965820313, 0, 2, 1, 14, 1, 2, -1, 1, 15, 1, 1, 2, .00010271780047332868, .522917628288269, .4107066094875336, 0, 3, 14, 12, 2, 8, -1, 15, 12, 1, 4, 2, 14, 16, 1, 4, 2, -.0055311559699475765, .6352887749671936, .4960907101631165, 0, 2, 1, 0, 7, 3, -1, 1, 1, 7, 1, 3, -.0026187049224972725, .3824546039104462, .5140984058380127, 0, 3, 14, 12, 2, 8, -1, 15, 12, 1, 4, 2, 14, 16, 1, 4, 2, .005083426833152771, .4950439929962158, .6220818758010864, 0, 3, 6, 0, 8, 12, -1, 6, 0, 4, 6, 2, 10, 6, 4, 6, 2, .0798181593418121, .4952335953712463, .1322475969791412, 0, 2, 6, 1, 8, 9, -1, 6, 4, 8, 3, 3, -.0992265865206718, .7542728781700134, .5008416771888733, 0, 2, 5, 2, 2, 2, -1, 5, 3, 2, 1, 2, -.0006517401780001819, .3699302971363068, .5130121111869812, 0, 3, 13, 14, 6, 6, -1, 16, 14, 3, 3, 2, 13, 17, 3, 3, 2, -.018996849656105, .6689178943634033, .4921202957630158, 0, 3, 0, 17, 20, 2, -1, 0, 17, 10, 1, 2, 10, 18, 10, 1, 2, .0173468999564648, .4983300864696503, .1859198063611984, 0, 3, 10, 3, 2, 6, -1, 11, 3, 1, 3, 2, 10, 6, 1, 3, 2, .0005508210160769522, .4574424028396606, .5522121787071228, 0, 2, 5, 12, 6, 2, -1, 8, 12, 3, 2, 2, .002005605027079582, .5131744742393494, .3856469988822937, 0, 2, 10, 7, 6, 13, -1, 10, 7, 3, 13, 2, -.007768819108605385, .4361700117588043, .5434309244155884, 0, 2, 5, 15, 10, 5, -1, 10, 15, 5, 5, 2, .0508782789111137, .4682720899581909, .6840639710426331, 0, 2, 10, 4, 4, 10, -1, 10, 4, 2, 10, 2, -.0022901780903339386, .4329245090484619, .5306099057197571, 0, 2, 5, 7, 2, 1, -1, 6, 7, 1, 1, 2, -.00015715380141045898, .5370057225227356, .4378164112567902, 0, 2, 10, 3, 6, 7, -1, 10, 3, 3, 7, 2, .1051924005150795, .5137274265289307, .0673614665865898, 0, 2, 4, 3, 6, 7, -1, 7, 3, 3, 7, 2, .002719891956076026, .4112060964107513, .5255665183067322, 0, 2, 1, 7, 18, 5, -1, 7, 7, 6, 5, 3, .0483377799391747, .5404623746871948, .4438967108726502, 0, 2, 3, 17, 4, 3, -1, 5, 17, 2, 3, 2, .0009570376132614911, .4355969130992889, .5399510860443115, 0, 3, 8, 14, 12, 6, -1, 14, 14, 6, 3, 2, 8, 17, 6, 3, 2, -.0253712590783834, .5995175242424011, .5031024813652039, 0, 3, 0, 13, 20, 4, -1, 0, 13, 10, 2, 2, 10, 15, 10, 2, 2, .0524579510092735, .4950287938117981, .1398351043462753, 0, 3, 4, 5, 14, 2, -1, 11, 5, 7, 1, 2, 4, 6, 7, 1, 2, -.0123656298965216, .639729917049408, .496410608291626, 0, 3, 1, 2, 10, 12, -1, 1, 2, 5, 6, 2, 6, 8, 5, 6, 2, -.1458971947431564, .1001669988036156, .494632214307785, 0, 2, 6, 1, 14, 3, -1, 6, 2, 14, 1, 3, -.0159086007624865, .3312329947948456, .5208340883255005, 0, 2, 8, 16, 2, 3, -1, 8, 17, 2, 1, 3, .00039486068999394774, .4406363964080811, .5426102876663208, 0, 2, 9, 17, 3, 2, -1, 10, 17, 1, 2, 3, -.0052454001270234585, .2799589931964874, .5189967155456543, 0, 3, 5, 15, 4, 2, -1, 5, 15, 2, 1, 2, 7, 16, 2, 1, 2, -.005042179953306913, .6987580060958862, .4752142131328583, 0, 2, 10, 15, 1, 3, -1, 10, 16, 1, 1, 3, .0029812189750373363, .4983288943767548, .6307479739189148, 0, 3, 8, 16, 4, 4, -1, 8, 16, 2, 2, 2, 10, 18, 2, 2, 2, -.007288430817425251, .298233300447464, .5026869773864746, 0, 2, 6, 11, 8, 6, -1, 6, 14, 8, 3, 2, .0015094350092113018, .5308442115783691, .3832970857620239, 0, 2, 2, 13, 5, 2, -1, 2, 14, 5, 1, 2, -.009334079921245575, .2037964016199112, .4969817101955414, 0, 3, 13, 14, 6, 6, -1, 16, 14, 3, 3, 2, 13, 17, 3, 3, 2, .0286671407520771, .5025696754455566, .6928027272224426, 0, 2, 1, 9, 18, 4, -1, 7, 9, 6, 4, 3, .1701968014240265, .4960052967071533, .1476442962884903, 0, 3, 13, 14, 6, 6, -1, 16, 14, 3, 3, 2, 13, 17, 3, 3, 2, -.003261447884142399, .5603063702583313, .4826056063175201, 0, 2, 0, 2, 1, 6, -1, 0, 4, 1, 2, 3, .0005576927796937525, .5205562114715576, .4129633009433746, 0, 2, 5, 0, 15, 20, -1, 5, 10, 15, 10, 2, .3625833988189697, .5221652984619141, .3768612146377564, 0, 3, 1, 14, 6, 6, -1, 1, 14, 3, 3, 2, 4, 17, 3, 3, 2, -.0116151301190257, .6022682785987854, .4637489914894104, 0, 3, 8, 14, 4, 6, -1, 10, 14, 2, 3, 2, 8, 17, 2, 3, 2, -.004079519771039486, .4070447087287903, .5337479114532471, 0, 2, 7, 11, 2, 1, -1, 8, 11, 1, 1, 2, .0005720430053770542, .4601835012435913, .5900393128395081, 0, 2, 9, 17, 3, 2, -1, 10, 17, 1, 2, 3, .000675433489959687, .5398252010345459, .4345428943634033, 0, 2, 8, 17, 3, 2, -1, 9, 17, 1, 2, 3, .0006329569732770324, .5201563239097595, .4051358997821808, 0, 3, 12, 14, 4, 6, -1, 14, 14, 2, 3, 2, 12, 17, 2, 3, 2, .00124353205319494, .4642387926578522, .5547441244125366, 0, 3, 4, 14, 4, 6, -1, 4, 14, 2, 3, 2, 6, 17, 2, 3, 2, -.004736385773867369, .6198567152023315, .4672552049160004, 0, 3, 13, 14, 2, 6, -1, 14, 14, 1, 3, 2, 13, 17, 1, 3, 2, -.006465846206992865, .6837332844734192, .5019000768661499, 0, 3, 5, 14, 2, 6, -1, 5, 14, 1, 3, 2, 6, 17, 1, 3, 2, .000350173213519156, .4344803094863892, .5363622903823853, 0, 2, 7, 0, 6, 12, -1, 7, 4, 6, 4, 3, .00015754920605104417, .4760079085826874, .5732020735740662, 0, 2, 0, 7, 12, 2, -1, 4, 7, 4, 2, 3, .009977436624467373, .5090985894203186, .3635039925575256, 0, 2, 10, 3, 3, 13, -1, 11, 3, 1, 13, 3, -.0004146452993154526, .5570064783096313, .4593802094459534, 0, 2, 7, 3, 3, 13, -1, 8, 3, 1, 13, 3, -.00035888899583369493, .5356845855712891, .4339134991168976, 0, 2, 10, 8, 6, 3, -1, 10, 9, 6, 1, 3, .0004046325047966093, .4439803063869476, .5436776876449585, 0, 2, 3, 11, 3, 2, -1, 4, 11, 1, 2, 3, -.0008218478760682046, .4042294919490814, .5176299214363098, 0, 3, 13, 12, 6, 8, -1, 16, 12, 3, 4, 2, 13, 16, 3, 4, 2, .005946741905063391, .4927651882171631, .5633779764175415, 0, 2, 7, 6, 6, 5, -1, 9, 6, 2, 5, 3, -.0217533893883228, .8006293773651123, .480084091424942, 0, 2, 17, 11, 2, 7, -1, 17, 11, 1, 7, 2, -.0145403798669577, .3946054875850678, .5182222723960876, 0, 2, 3, 13, 8, 2, -1, 7, 13, 4, 2, 2, -.0405107699334621, .0213249903172255, .4935792982578278, 0, 2, 6, 9, 8, 3, -1, 6, 10, 8, 1, 3, -.0005845826817676425, .4012795984745026, .5314025282859802, 0, 2, 4, 3, 4, 3, -1, 4, 4, 4, 1, 3, .005515180062502623, .4642418920993805, .5896260738372803, 0, 2, 11, 3, 4, 3, -1, 11, 4, 4, 1, 3, -.006062622182071209, .6502159237861633, .5016477704048157, 0, 2, 1, 4, 17, 12, -1, 1, 8, 17, 4, 3, .0945358425378799, .5264708995819092, .4126827120780945, 0, 2, 11, 3, 4, 3, -1, 11, 4, 4, 1, 3, .004731505177915096, .4879199862480164, .5892447829246521, 0, 2, 4, 8, 6, 3, -1, 4, 9, 6, 1, 3, -.0005257147131487727, .391728013753891, .5189412832260132, 0, 2, 12, 3, 5, 3, -1, 12, 4, 5, 1, 3, -.002546404954046011, .5837599039077759, .498570591211319, 0, 2, 1, 11, 2, 7, -1, 2, 11, 1, 7, 2, -.0260756891220808, .1261983960866928, .4955821931362152, 0, 3, 15, 12, 2, 8, -1, 16, 12, 1, 4, 2, 15, 16, 1, 4, 2, -.00547797093167901, .5722513794898987, .5010265707969666, 0, 2, 4, 8, 11, 3, -1, 4, 9, 11, 1, 3, .005133774131536484, .527326226234436, .4226376116275787, 0, 3, 9, 13, 6, 2, -1, 12, 13, 3, 1, 2, 9, 14, 3, 1, 2, .000479449809063226, .4450066983699799, .5819587111473083, 0, 2, 6, 13, 4, 3, -1, 6, 14, 4, 1, 3, -.0021114079281687737, .5757653117179871, .451171487569809, 0, 2, 9, 12, 3, 3, -1, 10, 12, 1, 3, 3, -.0131799904629588, .1884381026029587, .5160734057426453, 0, 2, 5, 3, 3, 3, -1, 5, 4, 3, 1, 3, -.004796809982508421, .6589789986610413, .4736118912696838, 0, 2, 9, 4, 2, 3, -1, 9, 5, 2, 1, 3, .0067483168095350266, .5259429812431335, .3356395065784454, 0, 2, 0, 2, 16, 3, -1, 0, 3, 16, 1, 3, .0014623369788751006, .5355271100997925, .4264092147350311, 0, 3, 15, 12, 2, 8, -1, 16, 12, 1, 4, 2, 15, 16, 1, 4, 2, .004764515906572342, .5034406781196594, .5786827802658081, 0, 3, 3, 12, 2, 8, -1, 3, 12, 1, 4, 2, 4, 16, 1, 4, 2, .0068066660314798355, .475660502910614, .6677829027175903, 0, 2, 14, 13, 3, 6, -1, 14, 15, 3, 2, 3, .0036608621012419462, .5369611978530884, .4311546981334686, 0, 2, 3, 13, 3, 6, -1, 3, 15, 3, 2, 3, .0214496403932571, .4968641996383667, .1888816058635712, 0, 3, 6, 5, 10, 2, -1, 11, 5, 5, 1, 2, 6, 6, 5, 1, 2, .004167890176177025, .4930733144283295, .5815368890762329, 0, 2, 2, 14, 14, 6, -1, 2, 17, 14, 3, 2, .008646756410598755, .5205205082893372, .4132595062255859, 0, 2, 10, 14, 1, 3, -1, 10, 15, 1, 1, 3, -.0003611407882999629, .5483555197715759, .4800927937030792, 0, 3, 4, 16, 2, 2, -1, 4, 16, 1, 1, 2, 5, 17, 1, 1, 2, .0010808729566633701, .4689902067184448, .6041421294212341, 0, 2, 10, 6, 2, 3, -1, 10, 7, 2, 1, 3, .005771995987743139, .5171142220497131, .3053277134895325, 0, 3, 0, 17, 20, 2, -1, 0, 17, 10, 1, 2, 10, 18, 10, 1, 2, .001572077046148479, .5219978094100952, .4178803861141205, 0, 2, 13, 6, 1, 3, -1, 13, 7, 1, 1, 3, -.0019307859474793077, .5860369801521301, .4812920093536377, 0, 2, 8, 13, 3, 2, -1, 9, 13, 1, 2, 3, -.007892627269029617, .1749276965856552, .497173398733139, 0, 2, 12, 2, 3, 3, -1, 13, 2, 1, 3, 3, -.002222467912361026, .434258908033371, .521284818649292, 0, 3, 3, 18, 2, 2, -1, 3, 18, 1, 1, 2, 4, 19, 1, 1, 2, .0019011989934369922, .4765186905860901, .689205527305603, 0, 2, 9, 16, 3, 4, -1, 10, 16, 1, 4, 3, .0027576119173318148, .5262191295623779, .4337486028671265, 0, 2, 6, 6, 1, 3, -1, 6, 7, 1, 1, 3, .005178744904696941, .4804069101810455, .7843729257583618, 0, 2, 13, 1, 5, 2, -1, 13, 2, 5, 1, 2, -.0009027334162965417, .412084698677063, .5353423953056335, 0, 3, 7, 14, 6, 2, -1, 7, 14, 3, 1, 2, 10, 15, 3, 1, 2, .005179795902222395, .4740372896194458, .6425960063934326, 0, 2, 11, 3, 3, 4, -1, 12, 3, 1, 4, 3, -.0101140001788735, .2468792051076889, .5175017714500427, 0, 2, 1, 13, 12, 6, -1, 5, 13, 4, 6, 3, -.0186170600354671, .5756294131278992, .4628978967666626, 0, 2, 14, 11, 5, 2, -1, 14, 12, 5, 1, 2, .0059225959703326225, .5169625878334045, .3214271068572998, 0, 3, 2, 15, 14, 4, -1, 2, 15, 7, 2, 2, 9, 17, 7, 2, 2, -.006294507998973131, .3872014880180359, .5141636729240417, 0, 3, 3, 7, 14, 2, -1, 10, 7, 7, 1, 2, 3, 8, 7, 1, 2, .0065353019163012505, .4853048920631409, .6310489773750305, 0, 2, 1, 11, 4, 2, -1, 1, 12, 4, 1, 2, .0010878399480134249, .5117315053939819, .3723258972167969, 0, 2, 14, 0, 6, 14, -1, 16, 0, 2, 14, 3, -.0225422400981188, .5692740082740784, .4887112975120544, 0, 2, 4, 11, 1, 3, -1, 4, 12, 1, 1, 3, -.003006566083058715, .2556012868881226, .5003992915153503, 0, 2, 14, 0, 6, 14, -1, 16, 0, 2, 14, 3, .007474127225577831, .4810872972011566, .5675926804542542, 0, 2, 1, 10, 3, 7, -1, 2, 10, 1, 7, 3, .0261623207479715, .4971194863319397, .1777237057685852, 0, 2, 8, 12, 9, 2, -1, 8, 13, 9, 1, 2, .0009435273823328316, .4940010905265808, .549125075340271, 0, 2, 0, 6, 20, 1, -1, 10, 6, 10, 1, 2, .0333632417023182, .5007612109184265, .2790724039077759, 0, 2, 8, 4, 4, 4, -1, 8, 4, 2, 4, 2, -.0151186501607299, .7059578895568848, .4973031878471375, 0, 2, 0, 0, 2, 2, -1, 0, 1, 2, 1, 2, .0009864894673228264, .5128620266914368, .3776761889457703, 105.76110076904297, 213, 0, 2, 5, 3, 10, 9, -1, 5, 6, 10, 3, 3, -.0951507985591888, .6470757126808167, .4017286896705627, 0, 2, 15, 2, 4, 10, -1, 15, 2, 2, 10, 2, .006270234007388353, .399982213973999, .574644923210144, 0, 2, 8, 2, 2, 7, -1, 9, 2, 1, 7, 2, .000300180894555524, .355877012014389, .5538809895515442, 0, 2, 7, 4, 12, 1, -1, 11, 4, 4, 1, 3, .0011757409665733576, .425653487443924, .5382617712020874, 0, 2, 3, 4, 9, 1, -1, 6, 4, 3, 1, 3, 4423526843311265e-20, .3682908117771149, .5589926838874817, 0, 2, 15, 10, 1, 4, -1, 15, 12, 1, 2, 2, -29936920327600092e-21, .5452470183372498, .4020367860794067, 0, 2, 4, 10, 6, 4, -1, 7, 10, 3, 4, 2, .003007319988682866, .5239058136940002, .3317843973636627, 0, 2, 15, 9, 1, 6, -1, 15, 12, 1, 3, 2, -.0105138896033168, .4320689141750336, .5307983756065369, 0, 2, 7, 17, 6, 3, -1, 7, 18, 6, 1, 3, .008347682654857635, .4504637122154236, .6453298926353455, 0, 3, 14, 3, 2, 16, -1, 15, 3, 1, 8, 2, 14, 11, 1, 8, 2, -.0031492270063608885, .4313425123691559, .5370525121688843, 0, 2, 4, 9, 1, 6, -1, 4, 12, 1, 3, 2, -1443564997316571e-20, .5326603055000305, .381797194480896, 0, 2, 12, 1, 5, 2, -1, 12, 2, 5, 1, 2, -.00042855090578086674, .430516391992569, .5382009744644165, 0, 3, 6, 18, 4, 2, -1, 6, 18, 2, 1, 2, 8, 19, 2, 1, 2, .00015062429883982986, .4235970973968506, .5544965267181396, 0, 3, 2, 4, 16, 10, -1, 10, 4, 8, 5, 2, 2, 9, 8, 5, 2, .0715598315000534, .5303059816360474, .2678802907466888, 0, 2, 6, 5, 1, 10, -1, 6, 10, 1, 5, 2, .0008409518050029874, .3557108938694, .5205433964729309, 0, 2, 4, 8, 15, 2, -1, 9, 8, 5, 2, 3, .0629865005612373, .5225362777709961, .2861376106739044, 0, 2, 1, 8, 15, 2, -1, 6, 8, 5, 2, 3, -.0033798629883676767, .3624185919761658, .5201697945594788, 0, 2, 9, 5, 3, 6, -1, 9, 7, 3, 2, 3, -.00011810739670181647, .547447681427002, .3959893882274628, 0, 2, 5, 7, 8, 2, -1, 9, 7, 4, 2, 2, -.0005450560129247606, .3740422129631043, .5215715765953064, 0, 2, 9, 11, 2, 3, -1, 9, 12, 2, 1, 3, -.0018454910023137927, .5893052220344543, .4584448933601379, 0, 2, 1, 0, 16, 3, -1, 1, 1, 16, 1, 3, -.0004383237101137638, .4084582030773163, .5385351181030273, 0, 2, 11, 2, 7, 2, -1, 11, 3, 7, 1, 2, -.002400083001703024, .377745509147644, .5293580293655396, 0, 2, 5, 1, 10, 18, -1, 5, 7, 10, 6, 3, -.0987957417964935, .2963612079620361, .5070089101791382, 0, 2, 17, 4, 3, 2, -1, 18, 4, 1, 2, 3, .0031798239797353745, .4877632856369019, .6726443767547607, 0, 2, 8, 13, 1, 3, -1, 8, 14, 1, 1, 3, .00032406419632025063, .4366911053657532, .5561109781265259, 0, 2, 3, 14, 14, 6, -1, 3, 16, 14, 2, 3, -.0325472503900528, .31281578540802, .5308616161346436, 0, 2, 0, 2, 3, 4, -1, 1, 2, 1, 4, 3, -.007756113074719906, .6560224890708923, .4639872014522553, 0, 2, 12, 1, 5, 2, -1, 12, 2, 5, 1, 2, .0160272493958473, .5172680020332336, .3141897916793823, 0, 2, 3, 1, 5, 2, -1, 3, 2, 5, 1, 2, 710023505234858e-20, .4084446132183075, .5336294770240784, 0, 2, 10, 13, 2, 3, -1, 10, 14, 2, 1, 3, .007342280820012093, .4966922104358673, .660346508026123, 0, 2, 8, 13, 2, 3, -1, 8, 14, 2, 1, 3, -.0016970280557870865, .5908237099647522, .4500182867050171, 0, 2, 14, 12, 2, 3, -1, 14, 13, 2, 1, 3, .0024118260480463505, .5315160751342773, .3599720895290375, 0, 2, 7, 2, 2, 3, -1, 7, 3, 2, 1, 3, -.005530093796551228, .2334040999412537, .4996814131736755, 0, 3, 5, 6, 10, 4, -1, 10, 6, 5, 2, 2, 5, 8, 5, 2, 2, -.0026478730142116547, .5880935788154602, .4684734046459198, 0, 2, 9, 13, 1, 6, -1, 9, 16, 1, 3, 2, .0112956296652555, .4983777105808258, .1884590983390808, 0, 3, 10, 12, 2, 2, -1, 11, 12, 1, 1, 2, 10, 13, 1, 1, 2, -.000669528788421303, .5872138142585754, .4799019992351532, 0, 2, 4, 12, 2, 3, -1, 4, 13, 2, 1, 3, .0014410680159926414, .5131189227104187, .350101113319397, 0, 2, 14, 4, 6, 6, -1, 14, 6, 6, 2, 3, .0024637870956212282, .5339372158050537, .4117639064788818, 0, 2, 8, 17, 2, 3, -1, 8, 18, 2, 1, 3, .0003311451873742044, .4313383102416992, .5398246049880981, 0, 2, 16, 4, 4, 6, -1, 16, 6, 4, 2, 3, -.0335572697222233, .26753368973732, .5179154872894287, 0, 2, 0, 4, 4, 6, -1, 0, 6, 4, 2, 3, .0185394193977118, .4973869919776917, .2317177057266235, 0, 2, 14, 6, 2, 3, -1, 14, 6, 1, 3, 2, -.00029698139405809343, .552970826625824, .4643664062023163, 0, 2, 4, 9, 8, 1, -1, 8, 9, 4, 1, 2, -.0004557725915219635, .5629584193229675, .4469191133975983, 0, 2, 8, 12, 4, 3, -1, 8, 13, 4, 1, 3, -.0101589802652597, .6706212759017944, .4925918877124786, 0, 2, 5, 12, 10, 6, -1, 5, 14, 10, 2, 3, -22413829356082715e-21, .5239421725273132, .3912901878356934, 0, 2, 11, 12, 1, 2, -1, 11, 13, 1, 1, 2, 7203496352303773e-20, .4799438118934631, .5501788854598999, 0, 2, 8, 15, 4, 2, -1, 8, 16, 4, 1, 2, -.006926720961928368, .6930009722709656, .4698084890842438, 0, 3, 6, 9, 8, 8, -1, 10, 9, 4, 4, 2, 6, 13, 4, 4, 2, -.007699783891439438, .409962385892868, .5480883121490479, 0, 3, 7, 12, 4, 6, -1, 7, 12, 2, 3, 2, 9, 15, 2, 3, 2, -.007313054986298084, .3283475935459137, .5057886242866516, 0, 2, 10, 11, 3, 1, -1, 11, 11, 1, 1, 3, .0019650589674711227, .4978047013282776, .6398249864578247, 0, 3, 9, 7, 2, 10, -1, 9, 7, 1, 5, 2, 10, 12, 1, 5, 2, .007164760027080774, .4661160111427307, .6222137212753296, 0, 2, 8, 0, 6, 6, -1, 10, 0, 2, 6, 3, -.0240786392241716, .2334644943475723, .5222162008285522, 0, 2, 3, 11, 2, 6, -1, 3, 13, 2, 2, 3, -.0210279691964388, .1183653995394707, .4938226044178009, 0, 2, 16, 12, 1, 2, -1, 16, 13, 1, 1, 2, .00036017020465806127, .5325019955635071, .4116711020469666, 0, 3, 1, 14, 6, 6, -1, 1, 14, 3, 3, 2, 4, 17, 3, 3, 2, -.0172197297215462, .6278762221336365, .4664269089698792, 0, 2, 13, 1, 3, 6, -1, 14, 1, 1, 6, 3, -.007867214269936085, .3403415083885193, .5249736905097961, 0, 2, 8, 8, 2, 2, -1, 8, 9, 2, 1, 2, -.000447773898486048, .3610411882400513, .5086259245872498, 0, 2, 9, 9, 3, 3, -1, 10, 9, 1, 3, 3, .005548601038753986, .4884265959262848, .6203498244285583, 0, 2, 8, 7, 3, 3, -1, 8, 8, 3, 1, 3, -.00694611482322216, .262593001127243, .5011097192764282, 0, 2, 14, 0, 2, 3, -1, 14, 0, 1, 3, 2, .00013569870498031378, .4340794980525971, .5628312230110168, 0, 2, 1, 0, 18, 9, -1, 7, 0, 6, 9, 3, -.0458802506327629, .6507998704910278, .4696274995803833, 0, 2, 11, 5, 4, 15, -1, 11, 5, 2, 15, 2, -.0215825606137514, .3826502859592438, .5287616848945618, 0, 2, 5, 5, 4, 15, -1, 7, 5, 2, 15, 2, -.0202095396816731, .3233368098735809, .5074477195739746, 0, 2, 14, 0, 2, 3, -1, 14, 0, 1, 3, 2, .005849671084433794, .5177603960037231, .4489670991897583, 0, 2, 4, 0, 2, 3, -1, 5, 0, 1, 3, 2, -5747637987951748e-20, .4020850956439972, .5246363878250122, 0, 3, 11, 12, 2, 2, -1, 12, 12, 1, 1, 2, 11, 13, 1, 1, 2, -.001151310047134757, .6315072178840637, .490515410900116, 0, 3, 7, 12, 2, 2, -1, 7, 12, 1, 1, 2, 8, 13, 1, 1, 2, .0019862831104546785, .4702459871768951, .6497151255607605, 0, 2, 12, 0, 3, 4, -1, 13, 0, 1, 4, 3, -.005271951202303171, .3650383949279785, .5227652788162231, 0, 2, 4, 11, 3, 3, -1, 4, 12, 3, 1, 3, .0012662699446082115, .5166100859642029, .387761801481247, 0, 2, 12, 7, 4, 2, -1, 12, 8, 4, 1, 2, -.006291944067925215, .737589418888092, .5023847818374634, 0, 2, 8, 10, 3, 2, -1, 9, 10, 1, 2, 3, .000673601112794131, .4423226118087769, .5495585799217224, 0, 2, 9, 9, 3, 2, -1, 10, 9, 1, 2, 3, -.0010523450328037143, .5976396203041077, .4859583079814911, 0, 2, 8, 9, 3, 2, -1, 9, 9, 1, 2, 3, -.00044216238893568516, .5955939292907715, .4398930966854096, 0, 2, 12, 0, 3, 4, -1, 13, 0, 1, 4, 3, .0011747940443456173, .5349888205528259, .4605058133602142, 0, 2, 5, 0, 3, 4, -1, 6, 0, 1, 4, 3, .005245743785053492, .5049191117286682, .2941577136516571, 0, 3, 4, 14, 12, 4, -1, 10, 14, 6, 2, 2, 4, 16, 6, 2, 2, -.0245397202670574, .2550177872180939, .5218586921691895, 0, 2, 8, 13, 2, 3, -1, 8, 14, 2, 1, 3, .0007379304151982069, .4424861073493958, .5490816235542297, 0, 2, 10, 10, 3, 8, -1, 10, 14, 3, 4, 2, .0014233799884095788, .5319514274597168, .4081355929374695, 0, 3, 8, 10, 4, 8, -1, 8, 10, 2, 4, 2, 10, 14, 2, 4, 2, -.0024149110540747643, .4087659120559692, .5238950252532959, 0, 2, 10, 8, 3, 1, -1, 11, 8, 1, 1, 3, -.0012165299849584699, .567457914352417, .4908052980899811, 0, 2, 9, 12, 1, 6, -1, 9, 15, 1, 3, 2, -.0012438809499144554, .4129425883293152, .5256118178367615, 0, 2, 10, 8, 3, 1, -1, 11, 8, 1, 1, 3, .006194273941218853, .5060194134712219, .7313653230667114, 0, 2, 7, 8, 3, 1, -1, 8, 8, 1, 1, 3, -.0016607169527560472, .5979632139205933, .4596369862556458, 0, 2, 5, 2, 15, 14, -1, 5, 9, 15, 7, 2, -.0273162592202425, .4174365103244782, .5308842062950134, 0, 3, 2, 1, 2, 10, -1, 2, 1, 1, 5, 2, 3, 6, 1, 5, 2, -.00158455700147897, .56158047914505, .4519486129283905, 0, 2, 14, 14, 2, 3, -1, 14, 15, 2, 1, 3, -.0015514739789068699, .4076187014579773, .5360785126686096, 0, 2, 2, 7, 3, 3, -1, 3, 7, 1, 3, 3, .0003844655875582248, .4347293972969055, .5430442094802856, 0, 2, 17, 4, 3, 3, -1, 17, 5, 3, 1, 3, -.0146722598001361, .1659304946660996, .5146093964576721, 0, 2, 0, 4, 3, 3, -1, 0, 5, 3, 1, 3, .008160888217389584, .4961819052696228, .1884745955467224, 0, 3, 13, 5, 6, 2, -1, 16, 5, 3, 1, 2, 13, 6, 3, 1, 2, .0011121659772470593, .4868263900279999, .6093816161155701, 0, 2, 4, 19, 12, 1, -1, 8, 19, 4, 1, 3, -.007260377053171396, .6284325122833252, .4690375924110413, 0, 2, 12, 12, 2, 4, -1, 12, 14, 2, 2, 2, -.00024046430189628154, .5575000047683716, .4046044051647186, 0, 2, 3, 15, 1, 3, -1, 3, 16, 1, 1, 3, -.00023348190006799996, .4115762114524841, .5252848267555237, 0, 2, 11, 16, 6, 4, -1, 11, 16, 3, 4, 2, .005573648028075695, .4730072915554047, .5690100789070129, 0, 2, 2, 10, 3, 10, -1, 3, 10, 1, 10, 3, .0306237693876028, .4971886873245239, .1740095019340515, 0, 2, 12, 8, 2, 4, -1, 12, 8, 1, 4, 2, .0009207479888573289, .5372117757797241, .4354872107505798, 0, 2, 6, 8, 2, 4, -1, 7, 8, 1, 4, 2, -4355073906481266e-20, .5366883873939514, .4347316920757294, 0, 2, 10, 14, 2, 3, -1, 10, 14, 1, 3, 2, -.006645271088927984, .3435518145561218, .516053318977356, 0, 2, 5, 1, 10, 3, -1, 10, 1, 5, 3, 2, .0432219989597797, .4766792058944702, .7293652892112732, 0, 2, 10, 7, 3, 2, -1, 11, 7, 1, 2, 3, .0022331769578158855, .5029315948486328, .5633171200752258, 0, 2, 5, 6, 9, 2, -1, 8, 6, 3, 2, 3, .0031829739455133677, .4016092121601105, .5192136764526367, 0, 2, 9, 8, 2, 2, -1, 9, 9, 2, 1, 2, -.00018027749320026487, .4088315963745117, .5417919754981995, 0, 3, 2, 11, 16, 6, -1, 2, 11, 8, 3, 2, 10, 14, 8, 3, 2, -.0052934689447283745, .407567709684372, .5243561863899231, 0, 3, 12, 7, 2, 2, -1, 13, 7, 1, 1, 2, 12, 8, 1, 1, 2, .0012750959722325206, .4913282990455627, .6387010812759399, 0, 2, 9, 5, 2, 3, -1, 9, 6, 2, 1, 3, .004338532220572233, .5031672120094299, .2947346866130829, 0, 2, 9, 7, 3, 2, -1, 10, 7, 1, 2, 3, .00852507445961237, .4949789047241211, .6308869123458862, 0, 2, 5, 1, 8, 12, -1, 5, 7, 8, 6, 2, -.0009426635224372149, .5328366756439209, .4285649955272675, 0, 2, 13, 5, 2, 2, -1, 13, 6, 2, 1, 2, .0013609660090878606, .4991525113582611, .5941501259803772, 0, 2, 5, 5, 2, 2, -1, 5, 6, 2, 1, 2, .0004478250921238214, .4573504030704498, .5854480862617493, 0, 2, 12, 4, 3, 3, -1, 12, 5, 3, 1, 3, .001336005050688982, .4604358971118927, .584905207157135, 0, 2, 4, 14, 2, 3, -1, 4, 15, 2, 1, 3, -.0006096754805184901, .3969388902187347, .522942304611206, 0, 2, 12, 4, 3, 3, -1, 12, 5, 3, 1, 3, -.002365678083151579, .5808320045471191, .4898357093334198, 0, 2, 5, 4, 3, 3, -1, 5, 5, 3, 1, 3, .001073434017598629, .435121089220047, .5470039248466492, 0, 3, 9, 14, 2, 6, -1, 10, 14, 1, 3, 2, 9, 17, 1, 3, 2, .0021923359017819166, .535506010055542, .3842903971672058, 0, 2, 8, 14, 3, 2, -1, 9, 14, 1, 2, 3, .005496861878782511, .5018138885498047, .2827191948890686, 0, 2, 9, 5, 6, 6, -1, 11, 5, 2, 6, 3, -.0753688216209412, .1225076019763947, .5148826837539673, 0, 2, 5, 5, 6, 6, -1, 7, 5, 2, 6, 3, .0251344703137875, .4731766879558563, .702544629573822, 0, 2, 13, 13, 1, 2, -1, 13, 14, 1, 1, 2, -2935859993158374e-20, .5430532097816467, .465608686208725, 0, 2, 0, 2, 10, 2, -1, 0, 3, 10, 1, 2, -.0005835591000504792, .4031040072441101, .5190119743347168, 0, 2, 13, 13, 1, 2, -1, 13, 14, 1, 1, 2, -.0026639450807124376, .4308126866817474, .5161771178245544, 0, 3, 5, 7, 2, 2, -1, 5, 7, 1, 1, 2, 6, 8, 1, 1, 2, -.0013804089976474643, .621982991695404, .4695515930652618, 0, 2, 13, 5, 2, 7, -1, 13, 5, 1, 7, 2, .0012313219485804439, .5379363894462585, .4425831139087677, 0, 2, 6, 13, 1, 2, -1, 6, 14, 1, 1, 2, -14644179827882908e-21, .5281640291213989, .4222503006458283, 0, 2, 11, 0, 3, 7, -1, 12, 0, 1, 7, 3, -.0128188095986843, .2582092881202698, .5179932713508606, 0, 3, 0, 3, 2, 16, -1, 0, 3, 1, 8, 2, 1, 11, 1, 8, 2, .0228521898388863, .4778693020343781, .7609264254570007, 0, 2, 11, 0, 3, 7, -1, 12, 0, 1, 7, 3, .0008230597013607621, .5340992212295532, .4671724140644074, 0, 2, 6, 0, 3, 7, -1, 7, 0, 1, 7, 3, .0127701200544834, .4965761005878449, .1472366005182266, 0, 2, 11, 16, 8, 4, -1, 11, 16, 4, 4, 2, -.0500515103340149, .641499400138855, .5016592144966125, 0, 2, 1, 16, 8, 4, -1, 5, 16, 4, 4, 2, .0157752707600594, .4522320032119751, .5685362219810486, 0, 2, 13, 5, 2, 7, -1, 13, 5, 1, 7, 2, -.0185016207396984, .2764748930931091, .5137959122657776, 0, 2, 5, 5, 2, 7, -1, 6, 5, 1, 7, 2, .0024626250378787518, .5141941905021667, .3795408010482788, 0, 2, 18, 6, 2, 14, -1, 18, 13, 2, 7, 2, .0629161670804024, .5060648918151855, .658043384552002, 0, 2, 6, 10, 3, 4, -1, 6, 12, 3, 2, 2, -21648500478477217e-21, .5195388197898865, .401988685131073, 0, 2, 14, 7, 1, 2, -1, 14, 8, 1, 1, 2, .0021180990152060986, .4962365031242371, .5954458713531494, 0, 3, 0, 1, 18, 6, -1, 0, 1, 9, 3, 2, 9, 4, 9, 3, 2, -.0166348908096552, .3757933080196381, .517544686794281, 0, 2, 14, 7, 1, 2, -1, 14, 8, 1, 1, 2, -.002889947034418583, .6624013781547546, .5057178735733032, 0, 2, 0, 6, 2, 14, -1, 0, 13, 2, 7, 2, .076783262193203, .4795796871185303, .8047714829444885, 0, 2, 17, 0, 3, 12, -1, 18, 0, 1, 12, 3, .003917067777365446, .4937882125377655, .5719941854476929, 0, 2, 0, 6, 18, 3, -1, 0, 7, 18, 1, 3, -.0726706013083458, .0538945607841015, .4943903982639313, 0, 2, 6, 0, 14, 16, -1, 6, 8, 14, 8, 2, .5403950214385986, .5129774212837219, .1143338978290558, 0, 2, 0, 0, 3, 12, -1, 1, 0, 1, 12, 3, .0029510019812732935, .4528343975543976, .5698574185371399, 0, 2, 13, 0, 3, 7, -1, 14, 0, 1, 7, 3, .0034508369863033295, .5357726812362671, .4218730926513672, 0, 2, 5, 7, 1, 2, -1, 5, 8, 1, 1, 2, -.0004207793972454965, .5916172862052917, .4637925922870636, 0, 2, 14, 4, 6, 6, -1, 14, 6, 6, 2, 3, .0033051050268113613, .5273385047912598, .438204288482666, 0, 2, 5, 7, 7, 2, -1, 5, 8, 7, 1, 2, .0004773506079800427, .4046528041362763, .5181884765625, 0, 2, 8, 6, 6, 9, -1, 8, 9, 6, 3, 3, -.0259285103529692, .7452235817909241, .5089386105537415, 0, 2, 5, 4, 6, 1, -1, 7, 4, 2, 1, 3, -.002972979098558426, .3295435905456543, .5058795213699341, 0, 3, 13, 0, 6, 4, -1, 16, 0, 3, 2, 2, 13, 2, 3, 2, 2, .005850832909345627, .4857144057750702, .5793024897575378, 0, 2, 1, 2, 18, 12, -1, 1, 6, 18, 4, 3, -.0459675192832947, .4312731027603149, .5380653142929077, 0, 2, 3, 2, 17, 12, -1, 3, 6, 17, 4, 3, .1558596044778824, .5196170210838318, .1684713959693909, 0, 2, 5, 14, 7, 3, -1, 5, 15, 7, 1, 3, .0151648297905922, .4735757112503052, .6735026836395264, 0, 2, 10, 14, 1, 3, -1, 10, 15, 1, 1, 3, -.0010604249546304345, .5822926759719849, .4775702953338623, 0, 2, 3, 14, 3, 3, -1, 3, 15, 3, 1, 3, .006647629197686911, .4999198913574219, .231953501701355, 0, 2, 14, 4, 6, 6, -1, 14, 6, 6, 2, 3, -.0122311301529408, .4750893115997315, .5262982249259949, 0, 2, 0, 4, 6, 6, -1, 0, 6, 6, 2, 3, .005652888212352991, .5069767832756042, .3561818897724152, 0, 2, 12, 5, 4, 3, -1, 12, 6, 4, 1, 3, .0012977829901501536, .4875693917274475, .5619062781333923, 0, 2, 4, 5, 4, 3, -1, 4, 6, 4, 1, 3, .0107815898954868, .4750770032405853, .6782308220863342, 0, 2, 18, 0, 2, 6, -1, 18, 2, 2, 2, 3, .002865477930754423, .5305461883544922, .4290736019611359, 0, 2, 8, 1, 4, 9, -1, 10, 1, 2, 9, 2, .0028663428965955973, .4518479108810425, .5539351105690002, 0, 2, 6, 6, 8, 2, -1, 6, 6, 4, 2, 2, -.005198332015424967, .4149119853973389, .5434188842773438, 0, 3, 6, 5, 4, 2, -1, 6, 5, 2, 1, 2, 8, 6, 2, 1, 2, .005373999010771513, .471789687871933, .6507657170295715, 0, 2, 10, 5, 2, 3, -1, 10, 6, 2, 1, 3, -.0146415298804641, .2172164022922516, .5161777138710022, 0, 2, 9, 5, 1, 3, -1, 9, 6, 1, 1, 3, -15042580344015732e-21, .533738374710083, .4298836886882782, 0, 2, 9, 10, 2, 2, -1, 9, 11, 2, 1, 2, -.0001187566012958996, .4604594111442566, .5582447052001953, 0, 2, 0, 8, 4, 3, -1, 0, 9, 4, 1, 3, .0169955305755138, .4945895075798035, .0738800764083862, 0, 2, 6, 0, 8, 6, -1, 6, 3, 8, 3, 2, -.0350959412753582, .70055091381073, .4977591037750244, 0, 3, 1, 0, 6, 4, -1, 1, 0, 3, 2, 2, 4, 2, 3, 2, 2, .0024217350874096155, .4466265141963959, .5477694272994995, 0, 2, 13, 0, 3, 7, -1, 14, 0, 1, 7, 3, -.0009634033776819706, .4714098870754242, .5313338041305542, 0, 2, 9, 16, 2, 2, -1, 9, 17, 2, 1, 2, .00016391130338888615, .4331546127796173, .5342242121696472, 0, 2, 11, 4, 6, 10, -1, 11, 9, 6, 5, 2, -.0211414601653814, .2644700109958649, .5204498767852783, 0, 2, 0, 10, 19, 2, -1, 0, 11, 19, 1, 2, .0008777520270086825, .5208349823951721, .4152742922306061, 0, 2, 9, 5, 8, 9, -1, 9, 8, 8, 3, 3, -.0279439203441143, .6344125270843506, .5018811821937561, 0, 2, 4, 0, 3, 7, -1, 5, 0, 1, 7, 3, .006729737855494022, .5050438046455383, .3500863909721375, 0, 3, 8, 6, 4, 12, -1, 10, 6, 2, 6, 2, 8, 12, 2, 6, 2, .0232810396701097, .4966318011283875, .6968677043914795, 0, 2, 0, 2, 6, 4, -1, 0, 4, 6, 2, 2, -.0116449799388647, .3300260007381439, .5049629807472229, 0, 2, 8, 15, 4, 3, -1, 8, 16, 4, 1, 3, .0157643090933561, .4991598129272461, .7321153879165649, 0, 2, 8, 0, 3, 7, -1, 9, 0, 1, 7, 3, -.001361147966235876, .3911735117435455, .5160670876502991, 0, 2, 9, 5, 3, 4, -1, 10, 5, 1, 4, 3, -.0008152233785949647, .5628911256790161, .49497190117836, 0, 2, 8, 5, 3, 4, -1, 9, 5, 1, 4, 3, -.0006006627227179706, .585359513759613, .4550595879554749, 0, 2, 7, 6, 6, 1, -1, 9, 6, 2, 1, 3, .0004971551825292408, .4271470010280609, .5443599224090576, 0, 3, 7, 14, 4, 4, -1, 7, 14, 2, 2, 2, 9, 16, 2, 2, 2, .0023475370835512877, .5143110752105713, .3887656927108765, 0, 3, 13, 14, 4, 6, -1, 15, 14, 2, 3, 2, 13, 17, 2, 3, 2, -.008926156908273697, .6044502258300781, .497172087430954, 0, 2, 7, 8, 1, 8, -1, 7, 12, 1, 4, 2, -.013919910416007, .2583160996437073, .5000367760658264, 0, 3, 16, 0, 2, 8, -1, 17, 0, 1, 4, 2, 16, 4, 1, 4, 2, .0010209949687123299, .4857374131679535, .5560358166694641, 0, 3, 2, 0, 2, 8, -1, 2, 0, 1, 4, 2, 3, 4, 1, 4, 2, -.0027441629208624363, .5936884880065918, .464577704668045, 0, 2, 6, 1, 14, 3, -1, 6, 2, 14, 1, 3, -.0162001308053732, .3163014948368073, .5193495154380798, 0, 2, 7, 9, 3, 10, -1, 7, 14, 3, 5, 2, .004333198070526123, .5061224102973938, .3458878993988037, 0, 2, 9, 14, 2, 2, -1, 9, 15, 2, 1, 2, .0005849793087691069, .4779017865657806, .5870177745819092, 0, 2, 7, 7, 6, 8, -1, 7, 11, 6, 4, 2, -.0022466450463980436, .4297851026058197, .5374773144721985, 0, 2, 9, 7, 3, 6, -1, 9, 10, 3, 3, 2, .0023146099410951138, .5438671708106995, .4640969932079315, 0, 2, 7, 13, 3, 3, -1, 7, 14, 3, 1, 3, .008767912164330482, .472689300775528, .6771789789199829, 0, 2, 9, 9, 2, 2, -1, 9, 10, 2, 1, 2, -.00022448020172305405, .4229173064231873, .5428048968315125, 0, 2, 0, 1, 18, 2, -1, 6, 1, 6, 2, 3, -.007433602120727301, .6098880767822266, .4683673977851868, 0, 2, 7, 1, 6, 14, -1, 7, 8, 6, 7, 2, -.0023189240600913763, .5689436793327332, .4424242079257965, 0, 2, 1, 9, 18, 1, -1, 7, 9, 6, 1, 3, -.0021042178850620985, .3762221038341522, .5187087059020996, 0, 2, 9, 7, 2, 2, -1, 9, 7, 1, 2, 2, .000460348412161693, .4699405133724213, .5771207213401794, 0, 2, 9, 3, 2, 9, -1, 10, 3, 1, 9, 2, .0010547629790380597, .4465216994285584, .5601701736450195, 0, 2, 18, 14, 2, 3, -1, 18, 15, 2, 1, 3, .0008714881842024624, .544980525970459, .3914709091186523, 0, 2, 7, 11, 3, 1, -1, 8, 11, 1, 1, 3, .00033364820410497487, .4564009010791779, .5645738840103149, 0, 2, 10, 8, 3, 4, -1, 11, 8, 1, 4, 3, -.0014853250468149781, .5747377872467041, .4692778885364533, 0, 2, 7, 14, 3, 6, -1, 8, 14, 1, 6, 3, .0030251620337367058, .5166196823120117, .3762814104557037, 0, 2, 10, 8, 3, 4, -1, 11, 8, 1, 4, 3, .005028074141591787, .5002111792564392, .6151527166366577, 0, 2, 7, 8, 3, 4, -1, 8, 8, 1, 4, 3, -.0005816451157443225, .5394598245620728, .4390751123428345, 0, 2, 7, 9, 6, 9, -1, 7, 12, 6, 3, 3, .0451415292918682, .5188326835632324, .206303596496582, 0, 2, 0, 14, 2, 3, -1, 0, 15, 2, 1, 3, -.001079562003724277, .3904685080051422, .5137907266616821, 0, 2, 11, 12, 1, 2, -1, 11, 13, 1, 1, 2, .00015995999274309725, .4895322918891907, .5427504181861877, 0, 2, 4, 3, 8, 3, -1, 8, 3, 4, 3, 2, -.0193592701107264, .6975228786468506, .4773507118225098, 0, 2, 0, 4, 20, 6, -1, 0, 4, 10, 6, 2, .207255095243454, .5233635902404785, .3034991919994354, 0, 2, 9, 14, 1, 3, -1, 9, 15, 1, 1, 3, -.00041953290929086506, .5419396758079529, .4460186064243317, 0, 2, 8, 14, 4, 3, -1, 8, 15, 4, 1, 3, .0022582069505006075, .4815764129161835, .6027408838272095, 0, 2, 0, 15, 14, 4, -1, 0, 17, 14, 2, 2, -.0067811207845807076, .3980278968811035, .5183305740356445, 0, 2, 1, 14, 18, 6, -1, 1, 17, 18, 3, 2, .0111543098464608, .543123185634613, .4188759922981262, 0, 3, 0, 0, 10, 6, -1, 0, 0, 5, 3, 2, 5, 3, 5, 3, 2, .0431624315679073, .4738228023052216, .6522961258888245]);
(function() {
    var i = {};
    i.Promise = typeof Promise !== "undefined" ? Promise : function() {
        throw new Error("No native promises and smartcrop.Promise not set.")
    };
    i.DEFAULTS = {
        width: 0,
        height: 0,
        aspect: 0,
        cropWidth: 0,
        cropHeight: 0,
        detailWeight: 0.2,
        skinColor: [0.78, 0.57, 0.44],
        skinBias: 0.01,
        skinBrightnessMin: 0.2,
        skinBrightnessMax: 1,
        skinThreshold: 0.8,
        skinWeight: 1.8,
        saturationBrightnessMin: 0.05,
        saturationBrightnessMax: 0.9,
        saturationThreshold: 0.4,
        saturationBias: 0.2,
        saturationWeight: 0.3,
        scoreDownSample: 8,
        step: 8,
        scaleStep: 0.1,
        minScale: 1,
        maxScale: 1,
        edgeRadius: 0.4,
        edgeWeight: -20,
        outsideImportance: -0.5,
        boostWeight: 100,
        ruleOfThirds: true,
        prescale: true,
        imageOperations: null,
        canvasFactory: b,
        debug: false
    };
    i.crop = function(z, D, F) {
        var B = u({}, i.DEFAULTS, D);
        if (B.aspect) {
            B.width = B.aspect;
            B.height = 1
        }
        if (B.imageOperations === null) {
            B.imageOperations = w(B.canvasFactory)
        }
        var C = B.imageOperations;
        var E = 1;
        var A = 1;
        return C.open(z, B.input).then(function(G) {
            if (B.width && B.height) {
                E = o(G.width / B.width, G.height / B.height);
                B.cropWidth = ~~(B.width * E);
                B.cropHeight = ~~(B.height * E);
                B.minScale = o(B.maxScale, q(1 / E, B.minScale));
                if (B.prescale !== false) {
                    A = 1 / E / B.minScale;
                    if (A < 1) {
                        G = C.resample(G, G.width * A, G.height * A);
                        B.cropWidth = ~~(B.cropWidth * A);
                        B.cropHeight = ~~(B.cropHeight * A);
                        if (B.boost) {
                            B.boost = B.boost.map(function(H) {
                                return {
                                    x: ~~(H.x * A),
                                    y: ~~(H.y * A),
                                    width: ~~(H.width * A),
                                    height: ~~(H.height * A),
                                    weight: H.weight
                                }
                            })
                        }
                    } else {
                        A = 1
                    }
                }
            }
            return G
        }).then(function(G) {
            return C.getData(G).then(function(M) {
                var I = c(B, M);
                var K = I.crops || [I.topCrop];
                for (var J = 0, H = K.length; J < H; J++) {
                    var L = K[J];
                    L.x = ~~(L.x / A);
                    L.y = ~~(L.y / A);
                    L.width = ~~(L.width / A);
                    L.height = ~~(L.height / A)
                }
                if (F) {
                    F(I)
                }
                return I
            })
        })
    };
    i.isAvailable = function(z) {
        if (!i.Promise) {
            return false
        }
        var B = z ? z.canvasFactory : b;
        if (B === b) {
            var A = document.createElement("canvas");
            if (!A.getContext("2d")) {
                return false
            }
        }
        return true
    };

    function g(D, C) {
        var B = D.data;
        var z = C.data;
        var H = D.width;
        var E = D.height;
        for (var F = 0; F < E; F++) {
            for (var G = 0; G < H; G++) {
                var A = (F * H + G) * 4;
                var I;
                if (G === 0 || G >= H - 1 || F === 0 || F >= E - 1) {
                    I = s(B, A)
                } else {
                    I = s(B, A) * 4 - s(B, A - H * 4) - s(B, A - 4) - s(B, A + 4) - s(B, A + H * 4)
                }
                z[A + 1] = I
            }
        }
    }

    function n(M, F, C) {
        var B = F.data;
        var z = C.data;
        var J = F.width;
        var G = F.height;
        for (var H = 0; H < G; H++) {
            for (var I = 0; I < J; I++) {
                var A = (H * J + I) * 4;
                var K = j(B[A], B[A + 1], B[A + 2]) / 255;
                var L = x(M, B[A], B[A + 1], B[A + 2]);
                var E = L > M.skinThreshold;
                var D = K >= M.skinBrightnessMin && K <= M.skinBrightnessMax;
                if (E && D) {
                    z[A] = (L - M.skinThreshold) * (255 / (1 - M.skinThreshold))
                } else {
                    z[A] = 0
                }
            }
        }
    }

    function t(M, E, C) {
        var B = E.data;
        var z = C.data;
        var I = E.width;
        var F = E.height;
        for (var G = 0; G < F; G++) {
            for (var H = 0; H < I; H++) {
                var A = (G * I + H) * 4;
                var J = j(B[A], B[A + 1], B[A + 2]) / 255;
                var D = h(B[A], B[A + 1], B[A + 2]);
                var K = D > M.saturationThreshold;
                var L = J >= M.saturationBrightnessMin && J <= M.saturationBrightnessMax;
                if (L && L) {
                    z[A + 2] = (D - M.saturationThreshold) * (255 / (1 - M.saturationThreshold))
                } else {
                    z[A + 2] = 0
                }
            }
        }
    }

    function e(B, A) {
        if (!B.boost) {
            return
        }
        var z = A.data;
        for (var C = 0; C < A.width; C += 4) {
            z[C + 3] = 0
        }
        for (C = 0; C < B.boost.length; C++) {
            f(B.boost[C], B, A)
        }
    }

    function f(F, L, C) {
        var z = C.data;
        var K = C.width;
        var B = ~~F.x;
        var A = ~~(F.x + F.width);
        var J = ~~F.y;
        var I = ~~(F.y + F.height);
        var E = F.weight * 255;
        for (var G = J; G < I; G++) {
            for (var H = B; H < A; H++) {
                var D = (G * K + H) * 4;
                z[D + 3] += E
            }
        }
    }

    function d(I, z, H) {
        var B = [];
        var F = o(z, H);
        var E = I.cropWidth || F;
        var G = I.cropHeight || F;
        for (var A = I.maxScale; A >= I.minScale; A -= I.scaleStep) {
            for (var C = 0; C + G * A <= H; C += I.step) {
                for (var D = 0; D + E * A <= z; D += I.step) {
                    B.push({
                        x: D,
                        y: C,
                        width: E * A,
                        height: G * A
                    })
                }
            }
        }
        return B
    }

    function r(M, D, I) {
        var N = {
            detail: 0,
            saturation: 0,
            skin: 0,
            boost: 0,
            total: 0
        };
        var A = D.data;
        var G = M.scoreDownSample;
        var F = 1 / G;
        var C = D.height * G;
        var E = D.width * G;
        var z = D.width;
        for (var K = 0; K < C; K += G) {
            for (var L = 0; L < E; L += G) {
                var B = (~~(K * F) * z + ~~(L * F)) * 4;
                var H = m(M, I, L, K);
                var J = A[B + 1] / 255;
                N.skin += A[B] / 255 * (J + M.skinBias) * H;
                N.detail += J * H;
                N.saturation += A[B + 2] / 255 * (J + M.saturationBias) * H;
                N.boost += A[B + 3] / 255 * H
            }
        }
        N.total = (N.detail * M.detailWeight + N.skin * M.skinWeight + N.saturation * M.saturationWeight + N.boost * M.boostWeight) / (I.width * I.height);
        return N
    }

    function m(H, z, D, B) {
        if (z.x > D || D >= z.x + z.width || z.y > B || B >= z.y + z.height) {
            return H.outsideImportance
        }
        D = (D - z.x) / z.width;
        B = (B - z.y) / z.height;
        var E = l(0.5 - D) * 2;
        var C = l(0.5 - B) * 2;
        var I = Math.max(E - 1 + H.edgeRadius, 0);
        var F = Math.max(C - 1 + H.edgeRadius, 0);
        var A = (I * I + F * F) * H.edgeWeight;
        var G = 1.41 - y(E * E + C * C);
        if (H.ruleOfThirds) {
            G += (Math.max(0, G + A + 0.5) * 1.2) * (p(E) + p(C))
        }
        return G + A
    }
    i.importance = m;

    function x(H, z, B, E) {
        var A = y(z * z + B * B + E * E);
        var G = (z / A - H.skinColor[0]);
        var F = (B / A - H.skinColor[1]);
        var C = (E / A - H.skinColor[2]);
        var D = y(G * G + F * F + C * C);
        return 1 - D
    }

    function c(I, G) {
        var J = {};
        var B = new k(G.width, G.height);
        g(G, B);
        n(I, G, B);
        t(I, G, B);
        e(I, B);
        var C = v(B, I.scoreDownSample);
        var F = -Infinity;
        var z = null;
        var H = d(I, G.width, G.height);
        for (var D = 0, A = H.length; D < A; D++) {
            var E = H[D];
            E.score = r(I, C, E);
            if (E.score.total > F) {
                z = E;
                F = E.score.total
            }
        }
        J.topCrop = z;
        if (I.debug && z) {
            J.crops = H;
            J.debugOutput = B;
            J.debugOptions = I;
            J.debugTopCrop = u({}, J.topCrop)
        }
        return J
    }

    function k(A, z, B) {
        this.width = A;
        this.height = z;
        if (B) {
            this.data = new Uint8ClampedArray(B)
        } else {
            this.data = new Uint8ClampedArray(A * z * 4)
        }
    }
    i.ImgData = k;

    function v(F, K) {
        var P = F.data;
        var H = F.width;
        var L = Math.floor(F.width / K);
        var J = Math.floor(F.height / K);
        var B = new k(L, J);
        var U = B.data;
        var A = 1 / (K * K);
        for (var C = 0; C < J; C++) {
            for (var D = 0; D < L; D++) {
                var O = (C * L + D) * 4;
                var I = 0;
                var Q = 0;
                var S = 0;
                var T = 0;
                var M = 0;
                var R = 0;
                var z = 0;
                for (var E = 0; E < K; E++) {
                    for (var G = 0; G < K; G++) {
                        var N = ((C * K + E) * H + (D * K + G)) * 4;
                        I += P[N];
                        Q += P[N + 1];
                        S += P[N + 2];
                        T += P[N + 3];
                        M = Math.max(M, P[N]);
                        R = Math.max(R, P[N + 1]);
                        z = Math.max(z, P[N + 2])
                    }
                }
                U[O] = I * A * 0.5 + M * 0.5;
                U[O + 1] = Q * A * 0.7 + R * 0.3;
                U[O + 2] = S * A;
                U[O + 3] = T * A
            }
        }
        return B
    }
    i._downSample = v;

    function b(z, A) {
        var B = document.createElement("canvas");
        B.width = z;
        B.height = A;
        return B
    }

    function w(z) {
        return {
            open: function(D) {
                var B = D.naturalWidth || D.width;
                var C = D.naturalHeight || D.height;
                var E = z(B, C);
                var A = E.getContext("2d");
                if (D.naturalWidth && (D.naturalWidth != D.width || D.naturalHeight != D.height)) {
                    E.width = D.naturalWidth;
                    E.height = D.naturalHeight
                } else {
                    E.width = D.width;
                    E.height = D.height
                }
                A.drawImage(D, 0, 0);
                return i.Promise.resolve(E)
            },
            resample: function(C, B, A) {
                return Promise.resolve(C).then(function(E) {
                    var F = z(~~B, ~~A);
                    var D = F.getContext("2d");
                    D.drawImage(E, 0, 0, E.width, E.height, 0, 0, F.width, F.height);
                    return i.Promise.resolve(F)
                })
            },
            getData: function(A) {
                return Promise.resolve(A).then(function(D) {
                    var B = D.getContext("2d");
                    var C = B.getImageData(0, 0, D.width, D.height);
                    return new k(D.width, D.height, C.data)
                })
            }
        }
    }
    i._canvasImageOperations = w;
    var o = Math.min;
    var q = Math.max;
    var l = Math.abs;
    var a = Math.ceil;
    var y = Math.sqrt;

    function u(D) {
        for (var C = 1, A = arguments.length; C < A; C++) {
            var z = arguments[C];
            if (z) {
                for (var B in z) {
                    D[B] = z[B]
                }
            }
        }
        return D
    }

    function p(z) {
        z = ((z - (1 / 3) + 1) % 2 * 0.5 - 0.5) * 16;
        return Math.max(1 - z * z, 0)
    }

    function j(B, A, z) {
        return 0.5126 * z + 0.7152 * A + 0.0722 * B
    }

    function s(A, z) {
        return j(A[z], A[z + 1], A[z + 2])
    }

    function h(D, C, z) {
        var F = q(D / 255, C / 255, z / 255);
        var B = o(D / 255, C / 255, z / 255);
        if (F === B) {
            return 0
        }
        var A = (F + B) / 2;
        var E = F - B;
        return A > 0.5 ? E / (2 - F - B) : E / (F + B)
    }
    if (typeof define !== "undefined" && define.amd) {
        define(function() {
            return i
        })
    }
    if (typeof exports !== "undefined") {
        exports.smartcrop = i
    } else {
        if (typeof navigator !== "undefined") {
            window.SmartCrop = window.smartcrop = i
        }
    }
    if (typeof module !== "undefined") {
        module.exports = i
    }
})();
! function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.Cropper = e()
}(this, function() {
    "use strict";

    function t(t) {
        return ot.call(t).slice(8, -1).toLowerCase()
    }

    function e(t) {
        return "number" == typeof t && !isNaN(t)
    }

    function a(t) {
        return "undefined" == typeof t
    }

    function i(t) {
        return "object" === ("undefined" == typeof t ? "undefined" : $(t)) && null !== t
    }

    function o(t) {
        if (!i(t))
            return !1;
        try {
            var e = t.constructor,
                a = e.prototype;
            return e && a && nt.call(a, "isPrototypeOf")
        } catch (t) {
            return !1
        }
    }

    function n(e) {
        return "function" === t(e)
    }

    function r(e) {
        return Array.isArray ? Array.isArray(e) : "array" === t(e)
    }

    function h(t) {
        return "string" == typeof t && (t = t.trim ? t.trim() : t.replace(_, "$1")),
            t
    }

    function c(t, a) {
        if (t && n(a)) {
            var o = void 0;
            if (r(t) || e(t.length)) {
                var h = t.length;
                for (o = 0; o < h && a.call(t, t[o], o, t) !== !1; o++)
                ;
            } else
                i(t) && Object.keys(t).forEach(function(e) {
                    a.call(t, t[e], e, t)
                })
        }
        return t
    }

    function d() {
        for (var t = arguments.length, e = Array(t), a = 0; a < t; a++)
            e[a] = arguments[a];
        var o = e[0] === !0,
            n = o ? e[1] : e[0];
        return e.length > 1 && (e.shift(),
                e.forEach(function(t) {
                    i(t) && Object.keys(t).forEach(function(e) {
                        o && i(n[e]) ? d(!0, n[e], t[e]) : n[e] = t[e]
                    })
                })),
            n
    }

    function s(t, e) {
        for (var a = arguments.length, i = Array(a > 2 ? a - 2 : 0), o = 2; o < a; o++)
            i[o - 2] = arguments[o];
        return function() {
            for (var a = arguments.length, o = Array(a), n = 0; n < a; n++)
                o[n] = arguments[n];
            return t.apply(e, i.concat(o))
        }
    }

    function p(t, a) {
        var i = t.style;
        c(a, function(t, a) {
            Q.test(a) && e(t) && (t += "px"),
                i[a] = t
        })
    }

    function l(t, e) {
        return t.classList ? t.classList.contains(e) : t.className.indexOf(e) > -1
    }

    function u(t, a) {
        if (e(t.length))
            return void c(t, function(t) {
                u(t, a)
            });
        if (t.classList)
            return void t.classList.add(a);
        var i = h(t.className);
        i ? i.indexOf(a) < 0 && (t.className = i + " " + a) : t.className = a
    }

    function m(t, a) {
        return e(t.length) ? void c(t, function(t) {
            m(t, a)
        }) : t.classList ? void t.classList.remove(a) : void(t.className.indexOf(a) >= 0 && (t.className = t.className.replace(a, "")))
    }

    function g(t, a, i) {
        return e(t.length) ? void c(t, function(t) {
            g(t, a, i)
        }) : void(i ? u(t, a) : m(t, a))
    }

    function f(t) {
        return t.replace(F, "$1-$2").toLowerCase()
    }

    function v(t, e) {
        return i(t[e]) ? t[e] : t.dataset ? t.dataset[e] : t.getAttribute("data-" + f(e))
    }

    function w(t, e, a) {
        i(a) ? t[e] = a : t.dataset ? t.dataset[e] = a : t.setAttribute("data-" + f(e), a)
    }

    function b(t, e) {
        i(t[e]) ? delete t[e] : t.dataset ? delete t.dataset[e] : t.removeAttribute("data-" + f(e))
    }

    function x(t, e, a) {
        var i = h(e).split(J);
        return i.length > 1 ? void c(i, function(e) {
            x(t, e, a)
        }) : void(t.removeEventListener ? t.removeEventListener(e, a, !1) : t.detachEvent && t.detachEvent("on" + e, a))
    }

    function y(t, e, a, i) {
        var o = h(e).split(J),
            n = a;
        return o.length > 1 ? void c(o, function(e) {
            y(t, e, a)
        }) : (i && (a = function() {
                for (var i = arguments.length, o = Array(i), r = 0; r < i; r++)
                    o[r] = arguments[r];
                return x(t, e, a),
                    n.apply(t, o)
            }),
            void(t.addEventListener ? t.addEventListener(e, a, !1) : t.attachEvent && t.attachEvent("on" + e, a)))
    }

    function M(t, e, i) {
        if (t.dispatchEvent) {
            var o = void 0;
            return n(Event) && n(CustomEvent) ? o = a(i) ? new Event(e, {
                    bubbles: !0,
                    cancelable: !0
                }) : new CustomEvent(e, {
                    detail: i,
                    bubbles: !0,
                    cancelable: !0
                }) : a(i) ? (o = document.createEvent("Event"),
                    o.initEvent(e, !0, !0)) : (o = document.createEvent("CustomEvent"),
                    o.initCustomEvent(e, !0, !0, i)),
                t.dispatchEvent(o)
        }
        return !t.fireEvent || t.fireEvent("on" + e)
    }

    function C(t) {
        var a = t || window.event;
        if (a.target || (a.target = a.srcElement || document), !e(a.pageX) && e(a.clientX)) {
            var i = t.target.ownerDocument || document,
                o = i.documentElement,
                n = i.body;
            a.pageX = a.clientX + ((o && o.scrollLeft || n && n.scrollLeft || 0) - (o && o.clientLeft || n && n.clientLeft || 0)),
                a.pageY = a.clientY + ((o && o.scrollTop || n && n.scrollTop || 0) - (o && o.clientTop || n && n.clientTop || 0))
        }
        return a
    }

    function D(t) {
        var e = document.documentElement,
            a = t.getBoundingClientRect();
        return {
            left: a.left + ((window.scrollX || e && e.scrollLeft || 0) - (e && e.clientLeft || 0)),
            top: a.top + ((window.scrollY || e && e.scrollTop || 0) - (e && e.clientTop || 0))
        }
    }

    function B(t) {
        var e = t.length,
            a = 0,
            i = 0;
        return e && (c(t, function(t) {
                a += t.pageX,
                    i += t.pageY
            }),
            a /= e,
            i /= e), {
            pageX: a,
            pageY: i
        }
    }

    function k(t, e) {
        return t.getElementsByTagName(e)
    }

    function T(t, e) {
        return t.getElementsByClassName ? t.getElementsByClassName(e) : t.querySelectorAll("." + e)
    }

    function L(t) {
        return document.createElement(t)
    }

    function X(t, e) {
        t.appendChild(e)
    }

    function W(t) {
        t.parentNode && t.parentNode.removeChild(t)
    }

    function Y(t) {
        for (; t.firstChild;)
            t.removeChild(t.firstChild)
    }

    function E(t) {
        var e = t.match(G);
        return e && (e[1] !== location.protocol || e[2] !== location.hostname || e[3] !== location.port)
    }

    function H(t) {
        var e = "timestamp=" + (new Date).getTime();
        return t + (t.indexOf("?") === -1 ? "?" : "&") + e
    }

    function N(t, e) {
        if (t.naturalWidth && !at)
            return void e(t.naturalWidth, t.naturalHeight);
        var a = L("img");
        a.onload = function() {
                e(this.width, this.height)
            },
            a.src = t.src
    }

    function z(t) {
        var a = [],
            i = t.rotate,
            o = t.scaleX,
            n = t.scaleY;
        return e(i) && 0 !== i && a.push("rotate(" + i + "deg)"),
            e(o) && 1 !== o && a.push("scaleX(" + o + ")"),
            e(n) && 1 !== n && a.push("scaleY(" + n + ")"),
            a.length ? a.join(" ") : "none"
    }

    function O(t, e) {
        var a = Math.abs(t.degree) % 180,
            i = (a > 90 ? 180 - a : a) * Math.PI / 180,
            o = Math.sin(i),
            n = Math.cos(i),
            r = t.width,
            h = t.height,
            c = t.aspectRatio,
            d = void 0,
            s = void 0;
        return e ? (d = r / (n + o / c),
            s = d / c) : (d = r * n + h * o,
            s = r * o + h * n), {
            width: d,
            height: s
        }
    }

    function A(t, a) {
        var i = L("canvas"),
            o = i.getContext("2d"),
            n = 0,
            r = 0,
            h = a.naturalWidth,
            c = a.naturalHeight,
            d = a.rotate,
            s = a.scaleX,
            p = a.scaleY,
            l = e(s) && e(p) && (1 !== s || 1 !== p),
            u = e(d) && 0 !== d,
            m = u || l,
            g = h * Math.abs(s || 1),
            f = c * Math.abs(p || 1),
            v = void 0,
            w = void 0,
            b = void 0;
        return l && (v = g / 2,
                w = f / 2),
            u && (b = O({
                    width: g,
                    height: f,
                    degree: d
                }),
                g = b.width,
                f = b.height,
                v = g / 2,
                w = f / 2),
            i.width = g,
            i.height = f,
            m && (n = -h / 2,
                r = -c / 2,
                o.save(),
                o.translate(v, w)),
            u && o.rotate(d * Math.PI / 180),
            l && o.scale(s, p),
            o.drawImage(t, Math.floor(n), Math.floor(r), Math.floor(h), Math.floor(c)),
            m && o.restore(),
            i
    }

    function R(t, e, a) {
        var i = "",
            o = e;
        for (a += e; o < a; o++)
            i += rt(t.getUint8(o));
        return i
    }

    function S(t) {
        var e = new DataView(t),
            a = e.byteLength,
            i = void 0,
            o = void 0,
            n = void 0,
            r = void 0,
            h = void 0,
            c = void 0,
            d = void 0,
            s = void 0,
            p = void 0,
            l = void 0;
        if (255 === e.getUint8(0) && 216 === e.getUint8(1))
            for (p = 2; p < a;) {
                if (255 === e.getUint8(p) && 225 === e.getUint8(p + 1)) {
                    d = p;
                    break
                }
                p++
            }
        if (d && (o = d + 4,
                n = d + 10,
                "Exif" === R(e, o, 4) && (c = e.getUint16(n),
                    h = 18761 === c,
                    (h || 19789 === c) && 42 === e.getUint16(n + 2, h) && (r = e.getUint32(n + 4, h),
                        r >= 8 && (s = n + r)))),
            s)
            for (a = e.getUint16(s, h),
                l = 0; l < a; l++)
                if (p = s + 12 * l + 2,
                    274 === e.getUint16(p, h)) {
                    p += 8,
                        i = e.getUint16(p, h),
                        at && e.setUint16(p, 1, h);
                    break
                }
        return i
    }

    function I(t) {
        var e = t.replace(V, ""),
            a = atob(e),
            i = a.length,
            o = new ArrayBuffer(i),
            n = new Uint8Array(o),
            r = void 0;
        for (r = 0; r < i; r++)
            n[r] = a.charCodeAt(r);
        return o
    }

    function U(t) {
        var e = new Uint8Array(t),
            a = e.length,
            i = "",
            o = void 0;
        for (o = 0; o < a; o++)
            i += rt(e[o]);
        return "data:image/jpeg;base64," + btoa(i)
    }
    var P = {
            viewMode: 0,
            dragMode: "crop",
            aspectRatio: NaN,
            data: null,
            preview: "",
            responsive: !0,
            restore: !0,
            checkCrossOrigin: !0,
            checkOrientation: !0,
            modal: !0,
            guides: !0,
            center: !0,
            highlight: !0,
            background: !0,
            autoCrop: !0,
            autoCropArea: .8,
            movable: !0,
            rotatable: !0,
            scalable: !0,
            zoomable: !0,
            zoomOnTouch: !0,
            zoomOnWheel: !0,
            wheelZoomRatio: .1,
            cropBoxMovable: !0,
            cropBoxResizable: !0,
            toggleDragModeOnDblclick: !0,
            minCanvasWidth: 0,
            minCanvasHeight: 0,
            minCropBoxWidth: 0,
            minCropBoxHeight: 0,
            minContainerWidth: 200,
            minContainerHeight: 100,
            ready: null,
            cropstart: null,
            cropmove: null,
            cropend: null,
            crop: null,
            zoom: null
        },
        j = '<div class="cropper-container"><div class="cropper-wrap-box"><div class="cropper-canvas"></div></div><div class="cropper-drag-box"></div><div class="cropper-crop-box"><span class="cropper-view-box"></span><span class="cropper-dashed dashed-h"></span><span class="cropper-dashed dashed-v"></span><span class="cropper-center"></span><span class="cropper-face"></span><span class="cropper-line line-e" data-action="e"></span><span class="cropper-line line-n" data-action="n"></span><span class="cropper-line line-w" data-action="w"></span><span class="cropper-line line-s" data-action="s"></span><span class="cropper-point point-e" data-action="e"></span><span class="cropper-point point-n" data-action="n"></span><span class="cropper-point point-w" data-action="w"></span><span class="cropper-point point-s" data-action="s"></span><span class="cropper-point point-ne" data-action="ne"></span><span class="cropper-point point-nw" data-action="nw"></span><span class="cropper-point point-sw" data-action="sw"></span><span class="cropper-point point-se" data-action="se"></span></div></div>',
        $ = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        } :
        function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        },
        q = function(t, e) {
            if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function")
        },
        Z = function() {
            function t(t, e) {
                for (var a = 0; a < e.length; a++) {
                    var i = e[a];
                    i.enumerable = i.enumerable || !1,
                        i.configurable = !0,
                        "value" in i && (i.writable = !0),
                        Object.defineProperty(t, i.key, i)
                }
            }
            return function(e, a, i) {
                return a && t(e.prototype, a),
                    i && t(e, i),
                    e
            }
        }(),
        K = function(t) {
            if (Array.isArray(t)) {
                for (var e = 0, a = Array(t.length); e < t.length; e++)
                    a[e] = t[e];
                return a
            }
            return Array.from(t)
        },
        V = /^data:([^;]+);base64,/,
        F = /([a-z\d])([A-Z])/g,
        G = /^(https?:)\/\/([^:\/?#]+):?(\d*)/i,
        J = /\s+/,
        Q = /^(width|height|left|top|marginLeft|marginTop)$/,
        _ = /^\s+(.*)\s+$/,
        tt = /(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i,
        et = "undefined" != typeof window ? window.navigator : null,
        at = et && tt.test(et.userAgent),
        it = Object.prototype,
        ot = it.toString,
        nt = it.hasOwnProperty,
        rt = (Array.prototype.slice,
            String.fromCharCode),
        ht = {
            render: function() {
                var t = this;
                t.initContainer(),
                    t.initCanvas(),
                    t.initCropBox(),
                    t.renderCanvas(),
                    t.cropped && t.renderCropBox()
            },
            initContainer: function() {
                var t = this,
                    e = t.options,
                    a = t.element,
                    i = t.container,
                    o = t.cropper,
                    n = void 0;
                u(o, "cropper-hidden"),
                    m(a, "cropper-hidden"),
                    t.containerData = n = {
                        width: Math.max(i.offsetWidth, Number(e.minContainerWidth) || 200),
                        height: Math.max(i.offsetHeight, Number(e.minContainerHeight) || 100)
                    },
                    p(o, {
                        width: n.width,
                        height: n.height
                    }),
                    u(a, "cropper-hidden"),
                    m(o, "cropper-hidden")
            },
            initCanvas: function() {
                var t = this,
                    e = t.options.viewMode,
                    a = t.containerData,
                    i = t.imageData,
                    o = 90 === Math.abs(i.rotate),
                    n = o ? i.naturalHeight : i.naturalWidth,
                    r = o ? i.naturalWidth : i.naturalHeight,
                    h = n / r,
                    c = a.width,
                    s = a.height;
                a.height * h > a.width ? 3 === e ? c = a.height * h : s = a.width / h : 3 === e ? s = a.width / h : c = a.height * h;
                var p = {
                    naturalWidth: n,
                    naturalHeight: r,
                    aspectRatio: h,
                    width: c,
                    height: s
                };
                p.oldLeft = p.left = (a.width - c) / 2,
                    p.oldTop = p.top = (a.height - s) / 2,
                    t.canvasData = p,
                    t.limited = 1 === e || 2 === e,
                    t.limitCanvas(!0, !0),
                    t.initialImageData = d({}, i),
                    t.initialCanvasData = d({}, p)
            },
            limitCanvas: function(t, e) {
                var a = this,
                    i = a.options,
                    o = i.viewMode,
                    n = a.containerData,
                    r = a.canvasData,
                    h = r.aspectRatio,
                    c = a.cropBoxData,
                    d = a.cropped && c,
                    s = void 0,
                    p = void 0,
                    l = void 0,
                    u = void 0;
                t && (s = Number(i.minCanvasWidth) || 0,
                        p = Number(i.minCanvasHeight) || 0,
                        o > 1 ? (s = Math.max(s, n.width),
                            p = Math.max(p, n.height),
                            3 === o && (p * h > s ? s = p * h : p = s / h)) : o > 0 && (s ? s = Math.max(s, d ? c.width : 0) : p ? p = Math.max(p, d ? c.height : 0) : d && (s = c.width,
                            p = c.height,
                            p * h > s ? s = p * h : p = s / h)),
                        s && p ? p * h > s ? p = s / h : s = p * h : s ? p = s / h : p && (s = p * h),
                        r.minWidth = s,
                        r.minHeight = p,
                        r.maxWidth = 1 / 0,
                        r.maxHeight = 1 / 0),
                    e && (o ? (l = n.width - r.width,
                        u = n.height - r.height,
                        r.minLeft = Math.min(0, l),
                        r.minTop = Math.min(0, u),
                        r.maxLeft = Math.max(0, l),
                        r.maxTop = Math.max(0, u),
                        d && a.limited && (r.minLeft = Math.min(c.left, c.left + (c.width - r.width)),
                            r.minTop = Math.min(c.top, c.top + (c.height - r.height)),
                            r.maxLeft = c.left,
                            r.maxTop = c.top,
                            2 === o && (r.width >= n.width && (r.minLeft = Math.min(0, l),
                                    r.maxLeft = Math.max(0, l)),
                                r.height >= n.height && (r.minTop = Math.min(0, u),
                                    r.maxTop = Math.max(0, u))))) : (r.minLeft = -r.width,
                        r.minTop = -r.height,
                        r.maxLeft = n.width,
                        r.maxTop = n.height))
            },
            renderCanvas: function(t) {
                var e = this,
                    a = e.canvasData,
                    i = e.imageData,
                    o = i.rotate,
                    n = void 0,
                    r = void 0;
                e.rotated && (e.rotated = !1,
                        r = O({
                            width: i.width,
                            height: i.height,
                            degree: o
                        }),
                        n = r.width / r.height,
                        n !== a.aspectRatio && (a.left -= (r.width - a.width) / 2,
                            a.top -= (r.height - a.height) / 2,
                            a.width = r.width,
                            a.height = r.height,
                            a.aspectRatio = n,
                            a.naturalWidth = i.naturalWidth,
                            a.naturalHeight = i.naturalHeight,
                            o % 180 && (r = O({
                                    width: i.naturalWidth,
                                    height: i.naturalHeight,
                                    degree: o
                                }),
                                a.naturalWidth = r.width,
                                a.naturalHeight = r.height),
                            e.limitCanvas(!0, !1))),
                    (a.width > a.maxWidth || a.width < a.minWidth) && (a.left = a.oldLeft),
                    (a.height > a.maxHeight || a.height < a.minHeight) && (a.top = a.oldTop),
                    a.width = Math.min(Math.max(a.width, a.minWidth), a.maxWidth),
                    a.height = Math.min(Math.max(a.height, a.minHeight), a.maxHeight),
                    e.limitCanvas(!1, !0),
                    a.oldLeft = a.left = Math.min(Math.max(a.left, a.minLeft), a.maxLeft),
                    a.oldTop = a.top = Math.min(Math.max(a.top, a.minTop), a.maxTop),
                    p(e.canvas, {
                        width: a.width,
                        height: a.height,
                        left: a.left,
                        top: a.top
                    }),
                    e.renderImage(),
                    e.cropped && e.limited && e.limitCropBox(!0, !0),
                    t && e.output()
            },
            renderImage: function(t) {
                var e = this,
                    a = e.canvasData,
                    i = e.imageData,
                    o = void 0,
                    n = void 0,
                    r = void 0,
                    h = void 0;
                i.rotate && (n = O({
                            width: a.width,
                            height: a.height,
                            degree: i.rotate,
                            aspectRatio: i.aspectRatio
                        }, !0),
                        r = n.width,
                        h = n.height,
                        o = {
                            width: r,
                            height: h,
                            left: (a.width - r) / 2,
                            top: (a.height - h) / 2
                        }),
                    d(i, o || {
                        width: a.width,
                        height: a.height,
                        left: 0,
                        top: 0
                    });
                var c = z(i);
                p(e.image, {
                        width: i.width,
                        height: i.height,
                        marginLeft: i.left,
                        marginTop: i.top,
                        WebkitTransform: c,
                        msTransform: c,
                        transform: c
                    }),
                    t && e.output()
            },
            initCropBox: function() {
                var t = this,
                    e = t.options,
                    a = e.aspectRatio,
                    i = Number(e.autoCropArea) || .8,
                    o = t.canvasData,
                    n = {
                        width: o.width,
                        height: o.height
                    };
                a && (o.height * a > o.width ? n.height = n.width / a : n.width = n.height * a),
                    t.cropBoxData = n,
                    t.limitCropBox(!0, !0),
                    n.width = Math.min(Math.max(n.width, n.minWidth), n.maxWidth),
                    n.height = Math.min(Math.max(n.height, n.minHeight), n.maxHeight),
                    n.width = Math.max(n.minWidth, n.width * i),
                    n.height = Math.max(n.minHeight, n.height * i),
                    n.oldLeft = n.left = o.left + (o.width - n.width) / 2,
                    n.oldTop = n.top = o.top + (o.height - n.height) / 2,
                    t.initialCropBoxData = d({}, n)
            },
            limitCropBox: function(t, e) {
                var a = this,
                    i = a.options,
                    o = i.aspectRatio,
                    n = a.containerData,
                    r = a.canvasData,
                    h = a.cropBoxData,
                    c = a.limited,
                    d = void 0,
                    s = void 0,
                    p = void 0,
                    l = void 0;
                t && (d = Number(i.minCropBoxWidth) || 0,
                        s = Number(i.minCropBoxHeight) || 0,
                        d = Math.min(d, n.width),
                        s = Math.min(s, n.height),
                        p = Math.min(n.width, c ? r.width : n.width),
                        l = Math.min(n.height, c ? r.height : n.height),
                        o && (d && s ? s * o > d ? s = d / o : d = s * o : d ? s = d / o : s && (d = s * o),
                            l * o > p ? l = p / o : p = l * o),
                        h.minWidth = Math.min(d, p),
                        h.minHeight = Math.min(s, l),
                        h.maxWidth = p,
                        h.maxHeight = l),
                    e && (c ? (h.minLeft = Math.max(0, r.left),
                        h.minTop = Math.max(0, r.top),
                        h.maxLeft = Math.min(n.width, r.left + r.width) - h.width,
                        h.maxTop = Math.min(n.height, r.top + r.height) - h.height) : (h.minLeft = 0,
                        h.minTop = 0,
                        h.maxLeft = n.width - h.width,
                        h.maxTop = n.height - h.height))
            },
            renderCropBox: function() {
                var t = this,
                    e = t.options,
                    a = t.containerData,
                    i = t.cropBoxData;
                (i.width > i.maxWidth || i.width < i.minWidth) && (i.left = i.oldLeft),
                (i.height > i.maxHeight || i.height < i.minHeight) && (i.top = i.oldTop),
                i.width = Math.min(Math.max(i.width, i.minWidth), i.maxWidth),
                    i.height = Math.min(Math.max(i.height, i.minHeight), i.maxHeight),
                    t.limitCropBox(!1, !0),
                    i.oldLeft = i.left = Math.min(Math.max(i.left, i.minLeft), i.maxLeft),
                    i.oldTop = i.top = Math.min(Math.max(i.top, i.minTop), i.maxTop),
                    e.movable && e.cropBoxMovable && w(t.face, "action", i.width === a.width && i.height === a.height ? "move" : "all"),
                    p(t.cropBox, {
                        width: i.width,
                        height: i.height,
                        left: i.left,
                        top: i.top
                    }),
                    t.cropped && t.limited && t.limitCanvas(!0, !0),
                    t.disabled || t.output()
            },
            output: function() {
                var t = this;
                t.preview(),
                    t.complete && M(t.element, "crop", t.getData())
            }
        },
        ct = "preview",
        dt = {
            initPreview: function() {
                var t = this,
                    e = t.options.preview,
                    a = L("img"),
                    i = t.crossOrigin,
                    o = i ? t.crossOriginUrl : t.url;
                if (i && (a.crossOrigin = i),
                    a.src = o,
                    X(t.viewBox, a),
                    t.image2 = a,
                    e) {
                    var n = document.querySelectorAll(e);
                    t.previews = n,
                        c(n, function(t) {
                            var e = L("img");
                            w(t, ct, {
                                    width: t.offsetWidth,
                                    height: t.offsetHeight,
                                    html: t.innerHTML
                                }),
                                i && (e.crossOrigin = i),
                                e.src = o,
                                e.style.cssText = 'display:block;width:100%;height:auto;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;image-orientation:0deg!important;"',
                                Y(t),
                                X(t, e)
                        })
                }
            },
            resetPreview: function() {
                c(this.previews, function(t) {
                    var e = v(t, ct);
                    p(t, {
                            width: e.width,
                            height: e.height
                        }),
                        t.innerHTML = e.html,
                        b(t, ct)
                })
            },
            preview: function() {
                var t = this,
                    e = t.imageData,
                    a = t.canvasData,
                    i = t.cropBoxData,
                    o = i.width,
                    n = i.height,
                    r = e.width,
                    h = e.height,
                    s = i.left - a.left - e.left,
                    l = i.top - a.top - e.top,
                    u = z(e),
                    m = {
                        WebkitTransform: u,
                        msTransform: u,
                        transform: u
                    };
                t.cropped && !t.disabled && (p(t.image2, d({
                        width: r,
                        height: h,
                        marginLeft: -s,
                        marginTop: -l
                    }, m)),
                    c(t.previews, function(t) {
                        var e = v(t, ct),
                            a = e.width,
                            i = e.height,
                            c = a,
                            u = i,
                            g = 1;
                        o && (g = a / o,
                                u = n * g),
                            n && u > i && (g = i / n,
                                c = o * g,
                                u = i),
                            p(t, {
                                width: c,
                                height: u
                            }),
                            p(k(t, "img")[0], d({
                                width: r * g,
                                height: h * g,
                                marginLeft: -s * g,
                                marginTop: -l * g
                            }, m))
                    }))
            }
        },
        st = "mousedown touchstart pointerdown MSPointerDown",
        pt = "mousemove touchmove pointermove MSPointerMove",
        lt = "mouseup touchend touchcancel pointerup pointercancel MSPointerUp MSPointerCancel",
        ut = "wheel mousewheel DOMMouseScroll",
        mt = "dblclick",
        gt = "resize",
        ft = "cropstart",
        vt = "cropmove",
        wt = "cropend",
        bt = "crop",
        xt = "zoom",
        yt = {
            bind: function() {
                var t = this,
                    e = t.options,
                    a = t.element,
                    i = t.cropper;
                n(e.cropstart) && y(a, ft, e.cropstart),
                    n(e.cropmove) && y(a, vt, e.cropmove),
                    n(e.cropend) && y(a, wt, e.cropend),
                    n(e.crop) && y(a, bt, e.crop),
                    n(e.zoom) && y(a, xt, e.zoom),
                    y(i, st, t.onCropStart = s(t.cropStart, t)),
                    e.zoomable && e.zoomOnWheel && y(i, ut, t.onWheel = s(t.wheel, t)),
                    e.toggleDragModeOnDblclick && y(i, mt, t.onDblclick = s(t.dblclick, t)),
                    y(document, pt, t.onCropMove = s(t.cropMove, t)),
                    y(document, lt, t.onCropEnd = s(t.cropEnd, t)),
                    e.responsive && y(window, gt, t.onResize = s(t.resize, t))
            },
            unbind: function() {
                var t = this,
                    e = t.options,
                    a = t.element,
                    i = t.cropper;
                n(e.cropstart) && x(a, ft, e.cropstart),
                    n(e.cropmove) && x(a, vt, e.cropmove),
                    n(e.cropend) && x(a, wt, e.cropend),
                    n(e.crop) && x(a, bt, e.crop),
                    n(e.zoom) && x(a, xt, e.zoom),
                    x(i, st, t.onCropStart),
                    e.zoomable && e.zoomOnWheel && x(i, ut, t.onWheel),
                    e.toggleDragModeOnDblclick && x(i, mt, t.onDblclick),
                    x(document, pt, t.onCropMove),
                    x(document, lt, t.onCropEnd),
                    e.responsive && x(window, gt, t.onResize)
            }
        },
        Mt = /^(e|w|s|n|se|sw|ne|nw|all|crop|move|zoom)$/,
        Ct = {
            resize: function() {
                var t = this,
                    e = t.options.restore,
                    a = t.container,
                    i = t.containerData;
                if (!t.disabled && i) {
                    var o = a.offsetWidth / i.width,
                        n = void 0,
                        r = void 0;
                    1 === o && a.offsetHeight === i.height || (e && (n = t.getCanvasData(),
                            r = t.getCropBoxData()),
                        t.render(),
                        e && (t.setCanvasData(c(n, function(t, e) {
                                n[e] = t * o
                            })),
                            t.setCropBoxData(c(r, function(t, e) {
                                r[e] = t * o
                            }))))
                }
            },
            dblclick: function() {
                var t = this;
                t.disabled || t.setDragMode(l(t.dragBox, "cropper-crop") ? "move" : "crop")
            },
            wheel: function(t) {
                var e = this,
                    a = C(t),
                    i = Number(e.options.wheelZoomRatio) || .1,
                    o = 1;
                e.disabled || (a.preventDefault(),
                    e.wheeling || (e.wheeling = !0,
                        setTimeout(function() {
                            e.wheeling = !1
                        }, 50),
                        a.deltaY ? o = a.deltaY > 0 ? 1 : -1 : a.wheelDelta ? o = -a.wheelDelta / 120 : a.detail && (o = a.detail > 0 ? 1 : -1),
                        e.zoom(-o * i, a)))
            },
            cropStart: function(t) {
                var e = this,
                    a = e.options,
                    i = C(t),
                    o = i.touches,
                    n = void 0,
                    r = void 0,
                    h = void 0;
                if (!e.disabled) {
                    if (o) {
                        if (n = o.length,
                            n > 1) {
                            if (!a.zoomable || !a.zoomOnTouch || 2 !== n)
                                return;
                            r = o[1],
                                e.startX2 = r.pageX,
                                e.startY2 = r.pageY,
                                h = "zoom"
                        }
                        r = o[0]
                    }
                    if (h = h || v(i.target, "action"),
                        Mt.test(h)) {
                        if (M(e.element, "cropstart", {
                                originalEvent: i,
                                action: h
                            }) === !1)
                            return;
                        i.preventDefault(),
                            e.action = h,
                            e.cropping = !1,
                            e.startX = r ? r.pageX : i.pageX,
                            e.startY = r ? r.pageY : i.pageY,
                            "crop" === h && (e.cropping = !0,
                                u(e.dragBox, "cropper-modal"))
                    }
                }
            },
            cropMove: function(t) {
                var e = this,
                    a = e.options,
                    i = C(t),
                    o = i.touches,
                    n = e.action,
                    r = void 0,
                    h = void 0;
                if (!e.disabled) {
                    if (o) {
                        if (r = o.length,
                            r > 1) {
                            if (!a.zoomable || !a.zoomOnTouch || 2 !== r)
                                return;
                            h = o[1],
                                e.endX2 = h.pageX,
                                e.endY2 = h.pageY
                        }
                        h = o[0]
                    }
                    if (n) {
                        if (M(e.element, "cropmove", {
                                originalEvent: i,
                                action: n
                            }) === !1)
                            return;
                        i.preventDefault(),
                            e.endX = h ? h.pageX : i.pageX,
                            e.endY = h ? h.pageY : i.pageY,
                            e.change(i.shiftKey, "zoom" === n ? i : null)
                    }
                }
            },
            cropEnd: function(t) {
                var e = this,
                    a = e.options,
                    i = C(t),
                    o = e.action;
                e.disabled || o && (i.preventDefault(),
                    e.cropping && (e.cropping = !1,
                        g(e.dragBox, "cropper-modal", e.cropped && a.modal)),
                    e.action = "",
                    M(e.element, "cropend", {
                        originalEvent: i,
                        action: o
                    }))
            }
        },
        Dt = "e",
        Bt = "w",
        kt = "s",
        Tt = "n",
        Lt = "se",
        Xt = "sw",
        Wt = "ne",
        Yt = "nw",
        Et = {
            change: function(t, e) {
                var a = this,
                    i = a.options,
                    o = a.containerData,
                    n = a.canvasData,
                    r = a.cropBoxData,
                    h = i.aspectRatio,
                    c = a.action,
                    d = r.width,
                    s = r.height,
                    p = r.left,
                    l = r.top,
                    u = p + d,
                    g = l + s,
                    f = 0,
                    v = 0,
                    w = o.width,
                    b = o.height,
                    x = !0,
                    y = void 0;
                !h && t && (h = d && s ? d / s : 1),
                    a.limited && (f = r.minLeft,
                        v = r.minTop,
                        w = f + Math.min(o.width, n.width, n.left + n.width),
                        b = v + Math.min(o.height, n.height, n.top + n.height));
                var M = {
                    x: a.endX - a.startX,
                    y: a.endY - a.startY
                };
                switch (h && (M.X = M.y * h,
                        M.Y = M.x / h),
                    c) {
                    case "all":
                        p += M.x,
                            l += M.y;
                        break;
                    case Dt:
                        if (M.x >= 0 && (u >= w || h && (l <= v || g >= b))) {
                            x = !1;
                            break
                        }
                        d += M.x,
                            h && (s = d / h,
                                l -= M.Y / 2),
                            d < 0 && (c = Bt,
                                d = 0);
                        break;
                    case Tt:
                        if (M.y <= 0 && (l <= v || h && (p <= f || u >= w))) {
                            x = !1;
                            break
                        }
                        s -= M.y,
                            l += M.y,
                            h && (d = s * h,
                                p += M.X / 2),
                            s < 0 && (c = kt,
                                s = 0);
                        break;
                    case Bt:
                        if (M.x <= 0 && (p <= f || h && (l <= v || g >= b))) {
                            x = !1;
                            break
                        }
                        d -= M.x,
                            p += M.x,
                            h && (s = d / h,
                                l += M.Y / 2),
                            d < 0 && (c = Dt,
                                d = 0);
                        break;
                    case kt:
                        if (M.y >= 0 && (g >= b || h && (p <= f || u >= w))) {
                            x = !1;
                            break
                        }
                        s += M.y,
                            h && (d = s * h,
                                p -= M.X / 2),
                            s < 0 && (c = Tt,
                                s = 0);
                        break;
                    case Wt:
                        if (h) {
                            if (M.y <= 0 && (l <= v || u >= w)) {
                                x = !1;
                                break
                            }
                            s -= M.y,
                                l += M.y,
                                d = s * h
                        } else
                            M.x >= 0 ? u < w ? d += M.x : M.y <= 0 && l <= v && (x = !1) : d += M.x,
                            M.y <= 0 ? l > v && (s -= M.y,
                                l += M.y) : (s -= M.y,
                                l += M.y);
                        d < 0 && s < 0 ? (c = Xt,
                            s = 0,
                            d = 0) : d < 0 ? (c = Yt,
                            d = 0) : s < 0 && (c = Lt,
                            s = 0);
                        break;
                    case Yt:
                        if (h) {
                            if (M.y <= 0 && (l <= v || p <= f)) {
                                x = !1;
                                break
                            }
                            s -= M.y,
                                l += M.y,
                                d = s * h,
                                p += M.X
                        } else
                            M.x <= 0 ? p > f ? (d -= M.x,
                                p += M.x) : M.y <= 0 && l <= v && (x = !1) : (d -= M.x,
                                p += M.x),
                            M.y <= 0 ? l > v && (s -= M.y,
                                l += M.y) : (s -= M.y,
                                l += M.y);
                        d < 0 && s < 0 ? (c = Lt,
                            s = 0,
                            d = 0) : d < 0 ? (c = Wt,
                            d = 0) : s < 0 && (c = Xt,
                            s = 0);
                        break;
                    case Xt:
                        if (h) {
                            if (M.x <= 0 && (p <= f || g >= b)) {
                                x = !1;
                                break
                            }
                            d -= M.x,
                                p += M.x,
                                s = d / h
                        } else
                            M.x <= 0 ? p > f ? (d -= M.x,
                                p += M.x) : M.y >= 0 && g >= b && (x = !1) : (d -= M.x,
                                p += M.x),
                            M.y >= 0 ? g < b && (s += M.y) : s += M.y;
                        d < 0 && s < 0 ? (c = Wt,
                            s = 0,
                            d = 0) : d < 0 ? (c = Lt,
                            d = 0) : s < 0 && (c = Yt,
                            s = 0);
                        break;
                    case Lt:
                        if (h) {
                            if (M.x >= 0 && (u >= w || g >= b)) {
                                x = !1;
                                break
                            }
                            d += M.x,
                                s = d / h
                        } else
                            M.x >= 0 ? u < w ? d += M.x : M.y >= 0 && g >= b && (x = !1) : d += M.x,
                            M.y >= 0 ? g < b && (s += M.y) : s += M.y;
                        d < 0 && s < 0 ? (c = Yt,
                            s = 0,
                            d = 0) : d < 0 ? (c = Xt,
                            d = 0) : s < 0 && (c = Wt,
                            s = 0);
                        break;
                    case "move":
                        a.move(M.x, M.y),
                            x = !1;
                        break;
                    case "zoom":
                        a.zoom(function(t, e, a, i) {
                                var o = Math.sqrt(t * t + e * e),
                                    n = Math.sqrt(a * a + i * i);
                                return (n - o) / o
                            }(Math.abs(a.startX - a.startX2), Math.abs(a.startY - a.startY2), Math.abs(a.endX - a.endX2), Math.abs(a.endY - a.endY2)), e),
                            a.startX2 = a.endX2,
                            a.startY2 = a.endY2,
                            x = !1;
                        break;
                    case "crop":
                        if (!M.x || !M.y) {
                            x = !1;
                            break
                        }
                        y = D(a.cropper),
                            p = a.startX - y.left,
                            l = a.startY - y.top,
                            d = r.minWidth,
                            s = r.minHeight,
                            M.x > 0 ? c = M.y > 0 ? Lt : Wt : M.x < 0 && (p -= d,
                                c = M.y > 0 ? Xt : Yt),
                            M.y < 0 && (l -= s),
                            a.cropped || (m(a.cropBox, "cropper-hidden"),
                                a.cropped = !0,
                                a.limited && a.limitCropBox(!0, !0))
                }
                x && (r.width = d,
                        r.height = s,
                        r.left = p,
                        r.top = l,
                        a.action = c,
                        a.renderCropBox()),
                    a.startX = a.endX,
                    a.startY = a.endY
            }
        },
        Ht = {
            crop: function() {
                var t = this;
                return t.ready && !t.disabled && (t.cropped || (t.cropped = !0,
                            t.limitCropBox(!0, !0),
                            t.options.modal && u(t.dragBox, "cropper-modal"),
                            m(t.cropBox, "cropper-hidden")),
                        t.setCropBoxData(t.initialCropBoxData)),
                    t
            },
            reset: function() {
                var t = this;
                return t.ready && !t.disabled && (t.imageData = d({}, t.initialImageData),
                        t.canvasData = d({}, t.initialCanvasData),
                        t.cropBoxData = d({}, t.initialCropBoxData),
                        t.renderCanvas(),
                        t.cropped && t.renderCropBox()),
                    t
            },
            clear: function() {
                var t = this;
                return t.cropped && !t.disabled && (d(t.cropBoxData, {
                            left: 0,
                            top: 0,
                            width: 0,
                            height: 0
                        }),
                        t.cropped = !1,
                        t.renderCropBox(),
                        t.limitCanvas(),
                        t.renderCanvas(),
                        m(t.dragBox, "cropper-modal"),
                        u(t.cropBox, "cropper-hidden")),
                    t
            },
            replace: function(t, e) {
                var a = this;
                return !a.disabled && t && (a.isImg && (a.element.src = t),
                        e ? (a.url = t,
                            a.image.src = t,
                            a.ready && (a.image2.src = t,
                                c(a.previews, function(e) {
                                    k(e, "img")[0].src = t
                                }))) : (a.isImg && (a.replaced = !0),
                            a.options.data = null,
                            a.load(t))),
                    a
            },
            enable: function() {
                var t = this;
                return t.ready && (t.disabled = !1,
                        m(t.cropper, "cropper-disabled")),
                    t
            },
            disable: function() {
                var t = this;
                return t.ready && (t.disabled = !0,
                        u(t.cropper, "cropper-disabled")),
                    t
            },
            destroy: function() {
                var t = this,
                    e = t.element,
                    a = t.image;
                return t.loaded ? (t.isImg && t.replaced && (e.src = t.originalUrl),
                        t.unbuild(),
                        m(e, "cropper-hidden")) : t.isImg ? x(e, "load", t.start) : a && W(a),
                    b(e, "cropper"),
                    t
            },
            move: function(t, e) {
                var i = this,
                    o = i.canvasData;
                return i.moveTo(a(t) ? t : o.left + Number(t), a(e) ? e : o.top + Number(e))
            },
            moveTo: function(t, i) {
                var o = this,
                    n = o.canvasData,
                    r = !1;
                return a(i) && (i = t),
                    t = Number(t),
                    i = Number(i),
                    o.ready && !o.disabled && o.options.movable && (e(t) && (n.left = t,
                            r = !0),
                        e(i) && (n.top = i,
                            r = !0),
                        r && o.renderCanvas(!0)),
                    o
            },
            zoom: function(t, e) {
                var a = this,
                    i = a.canvasData;
                return t = Number(t),
                    t = t < 0 ? 1 / (1 - t) : 1 + t,
                    a.zoomTo(i.width * t / i.naturalWidth, e)
            },
            zoomTo: function(t, e) {
                var a = this,
                    i = a.options,
                    o = a.canvasData,
                    n = o.width,
                    r = o.height,
                    h = o.naturalWidth,
                    c = o.naturalHeight,
                    d = void 0,
                    s = void 0,
                    p = void 0,
                    l = void 0;
                if (t = Number(t),
                    t >= 0 && a.ready && !a.disabled && i.zoomable) {
                    if (d = h * t,
                        s = c * t,
                        M(a.element, "zoom", {
                            originalEvent: e,
                            oldRatio: n / h,
                            ratio: d / h
                        }) === !1)
                        return a;
                    e ? (p = D(a.cropper),
                            l = e.touches ? B(e.touches) : {
                                pageX: e.pageX,
                                pageY: e.pageY
                            },
                            o.left -= (d - n) * ((l.pageX - p.left - o.left) / n),
                            o.top -= (s - r) * ((l.pageY - p.top - o.top) / r)) : (o.left -= (d - n) / 2,
                            o.top -= (s - r) / 2),
                        o.width = d,
                        o.height = s,
                        a.renderCanvas(!0)
                }
                return a
            },
            rotate: function(t) {
                var e = this;
                return e.rotateTo((e.imageData.rotate || 0) + Number(t))
            },
            rotateTo: function(t) {
                var a = this;
                return t = Number(t),
                    e(t) && a.ready && !a.disabled && a.options.rotatable && (a.imageData.rotate = t % 360,
                        a.rotated = !0,
                        a.renderCanvas(!0)),
                    a
            },
            scale: function(t, i) {
                var o = this,
                    n = o.imageData,
                    r = !1;
                return a(i) && (i = t),
                    t = Number(t),
                    i = Number(i),
                    o.ready && !o.disabled && o.options.scalable && (e(t) && (n.scaleX = t,
                            r = !0),
                        e(i) && (n.scaleY = i,
                            r = !0),
                        r && o.renderImage(!0)),
                    o
            },
            scaleX: function(t) {
                var a = this,
                    i = a.imageData.scaleY;
                return a.scale(t, e(i) ? i : 1)
            },
            scaleY: function(t) {
                var a = this,
                    i = a.imageData.scaleX;
                return a.scale(e(i) ? i : 1, t)
            },
            getData: function(t) {
                var e = this,
                    a = e.options,
                    i = e.imageData,
                    o = e.canvasData,
                    n = e.cropBoxData,
                    r = void 0,
                    h = void 0;
                return e.ready && e.cropped ? (h = {
                            x: n.left - o.left,
                            y: n.top - o.top,
                            width: n.width,
                            height: n.height
                        },
                        r = i.width / i.naturalWidth,
                        c(h, function(e, a) {
                            e /= r,
                                h[a] = t ? Math.round(e) : e
                        })) : h = {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0
                    },
                    a.rotatable && (h.rotate = i.rotate || 0),
                    a.scalable && (h.scaleX = i.scaleX || 1,
                        h.scaleY = i.scaleY || 1),
                    h
            },
            setData: function(t) {
                var a = this,
                    i = a.options,
                    r = a.imageData,
                    h = a.canvasData,
                    c = {},
                    d = void 0,
                    s = void 0,
                    p = void 0;
                return n(t) && (t = t.call(a.element)),
                    a.ready && !a.disabled && o(t) && (i.rotatable && e(t.rotate) && t.rotate !== r.rotate && (r.rotate = t.rotate,
                            a.rotated = d = !0),
                        i.scalable && (e(t.scaleX) && t.scaleX !== r.scaleX && (r.scaleX = t.scaleX,
                                s = !0),
                            e(t.scaleY) && t.scaleY !== r.scaleY && (r.scaleY = t.scaleY,
                                s = !0)),
                        d ? a.renderCanvas() : s && a.renderImage(),
                        p = r.width / r.naturalWidth,
                        e(t.x) && (c.left = t.x * p + h.left),
                        e(t.y) && (c.top = t.y * p + h.top),
                        e(t.width) && (c.width = t.width * p),
                        e(t.height) && (c.height = t.height * p),
                        a.setCropBoxData(c)),
                    a
            },
            getContainerData: function() {
                var t = this;
                return t.ready ? t.containerData : {}
            },
            getImageData: function() {
                var t = this;
                return t.loaded ? t.imageData : {}
            },
            getCanvasData: function() {
                var t = this,
                    e = t.canvasData,
                    a = {};
                return t.ready && c(["left", "top", "width", "height", "naturalWidth", "naturalHeight"], function(t) {
                        a[t] = e[t]
                    }),
                    a
            },
            setCanvasData: function(t) {
                var a = this,
                    i = a.canvasData,
                    r = i.aspectRatio;
                return n(t) && (t = t.call(a.element)),
                    a.ready && !a.disabled && o(t) && (e(t.left) && (i.left = t.left),
                        e(t.top) && (i.top = t.top),
                        e(t.width) ? (i.width = t.width,
                            i.height = t.width / r) : e(t.height) && (i.height = t.height,
                            i.width = t.height * r),
                        a.renderCanvas(!0)),
                    a
            },
            getCropBoxData: function() {
                var t = this,
                    e = t.cropBoxData,
                    a = void 0;
                return t.ready && t.cropped && (a = {
                        left: e.left,
                        top: e.top,
                        width: e.width,
                        height: e.height
                    }),
                    a || {}
            },
            setCropBoxData: function(t) {
                var a = this,
                    i = a.cropBoxData,
                    r = a.options.aspectRatio,
                    h = void 0,
                    c = void 0;
                return n(t) && (t = t.call(a.element)),
                    a.ready && a.cropped && !a.disabled && o(t) && (e(t.left) && (i.left = t.left),
                        e(t.top) && (i.top = t.top),
                        e(t.width) && (h = !0,
                            i.width = t.width),
                        e(t.height) && (c = !0,
                            i.height = t.height),
                        r && (h ? i.height = i.width / r : c && (i.width = i.height * r)),
                        a.renderCropBox()),
                    a
            },
            getCroppedCanvas: function(t) {
                var e = this;
                if (!e.ready || !window.HTMLCanvasElement)
                    return null;
                if (!e.cropped)
                    return A(e.image, e.imageData);
                o(t) || (t = {});
                var a = e.getData(),
                    i = a.width,
                    n = a.height,
                    r = i / n,
                    h = void 0,
                    c = void 0,
                    d = void 0;
                o(t) && (h = t.width,
                    c = t.height,
                    h ? (c = h / r,
                        d = h / i) : c && (h = c * r,
                        d = c / n));
                var s = Math.floor(h || i),
                    p = Math.floor(c || n),
                    l = L("canvas"),
                    u = l.getContext("2d");
                l.width = s,
                    l.height = p,
                    t.fillColor && (u.fillStyle = t.fillColor,
                        u.fillRect(0, 0, s, p));
                var m = function() {
                    var t = A(e.image, e.imageData),
                        o = t.width,
                        r = t.height,
                        h = e.canvasData,
                        c = [t],
                        s = a.x + h.naturalWidth * (Math.abs(a.scaleX || 1) - 1) / 2,
                        p = a.y + h.naturalHeight * (Math.abs(a.scaleY || 1) - 1) / 2,
                        l = void 0,
                        u = void 0,
                        m = void 0,
                        g = void 0,
                        f = void 0,
                        v = void 0;
                    return s <= -i || s > o ? s = l = m = f = 0 : s <= 0 ? (m = -s,
                            s = 0,
                            l = f = Math.min(o, i + s)) : s <= o && (m = 0,
                            l = f = Math.min(i, o - s)),
                        l <= 0 || p <= -n || p > r ? p = u = g = v = 0 : p <= 0 ? (g = -p,
                            p = 0,
                            u = v = Math.min(r, n + p)) : p <= r && (g = 0,
                            u = v = Math.min(n, r - p)),
                        c.push(Math.floor(s), Math.floor(p), Math.floor(l), Math.floor(u)),
                        d && (m *= d,
                            g *= d,
                            f *= d,
                            v *= d),
                        f > 0 && v > 0 && c.push(Math.floor(m), Math.floor(g), Math.floor(f), Math.floor(v)),
                        c
                }();
                return u.drawImage.apply(u, K(m)),
                    l
            },
            setAspectRatio: function(t) {
                var e = this,
                    i = e.options;
                return e.disabled || a(t) || (i.aspectRatio = Math.max(0, t) || NaN,
                        e.ready && (e.initCropBox(),
                            e.cropped && e.renderCropBox())),
                    e
            },
            setDragMode: function(t) {
                var e = this,
                    a = e.options,
                    i = e.dragBox,
                    o = e.face,
                    n = void 0,
                    r = void 0;
                return e.loaded && !e.disabled && (n = "crop" === t,
                        r = a.movable && "move" === t,
                        t = n || r ? t : "none",
                        w(i, "action", t),
                        g(i, "cropper-crop", n),
                        g(i, "cropper-move", r),
                        a.cropBoxMovable || (w(o, "action", t),
                            g(o, "cropper-crop", n),
                            g(o, "cropper-move", r))),
                    e
            }
        },
        Nt = "cropper",
        zt = Nt + "-hidden",
        Ot = "error",
        At = "load",
        Rt = "ready",
        St = "crop",
        It = /^data:/,
        Ut = /^data:image\/jpeg.*;base64,/,
        Pt = void 0,
        jt = function() {
            function t(e, a) {
                q(this, t);
                var i = this;
                i.element = e,
                    i.options = d({}, P, o(a) && a),
                    i.loaded = !1,
                    i.ready = !1,
                    i.complete = !1,
                    i.rotated = !1,
                    i.cropped = !1,
                    i.disabled = !1,
                    i.replaced = !1,
                    i.limited = !1,
                    i.wheeling = !1,
                    i.isImg = !1,
                    i.originalUrl = "",
                    i.canvasData = null,
                    i.cropBoxData = null,
                    i.previews = null,
                    i.init()
            }
            return Z(t, [{
                    key: "init",
                    value: function() {
                        var t = this,
                            e = t.element,
                            a = e.tagName.toLowerCase(),
                            i = void 0;
                        if (!v(e, Nt)) {
                            if (w(e, Nt, t),
                                "img" === a) {
                                if (t.isImg = !0,
                                    t.originalUrl = i = e.getAttribute("src"), !i)
                                    return;
                                i = e.src
                            } else
                                "canvas" === a && window.HTMLCanvasElement && (i = e.toDataURL());
                            t.load(i)
                        }
                    }
                }, {
                    key: "load",
                    value: function(t) {
                        var e = this,
                            a = e.options,
                            i = e.element;
                        if (t) {
                            if (e.url = t,
                                e.imageData = {}, !a.checkOrientation || !window.ArrayBuffer)
                                return void e.clone();
                            if (It.test(t))
                                return void(Ut ? e.read(I(t)) : e.clone());
                            var o = new XMLHttpRequest;
                            o.onerror = o.onabort = function() {
                                    e.clone()
                                },
                                o.onload = function() {
                                    e.read(o.response)
                                },
                                a.checkCrossOrigin && E(t) && i.crossOrigin && (t = H(t)),
                                o.open("get", t),
                                o.responseType = "arraybuffer",
                                o.send()
                        }
                    }
                }, {
                    key: "read",
                    value: function(t) {
                        var e = this,
                            a = e.options,
                            i = S(t),
                            o = e.imageData,
                            n = 0,
                            r = 1,
                            h = 1;
                        if (i > 1)
                            switch (e.url = U(t),
                                i) {
                                case 2:
                                    r = -1;
                                    break;
                                case 3:
                                    n = -180;
                                    break;
                                case 4:
                                    h = -1;
                                    break;
                                case 5:
                                    n = 90,
                                        h = -1;
                                    break;
                                case 6:
                                    n = 90;
                                    break;
                                case 7:
                                    n = 90,
                                        r = -1;
                                    break;
                                case 8:
                                    n = -90
                            }
                        a.rotatable && (o.rotate = n),
                            a.scalable && (o.scaleX = r,
                                o.scaleY = h),
                            e.clone()
                    }
                }, {
                    key: "clone",
                    value: function() {
                        var t = this,
                            e = t.element,
                            a = t.url,
                            i = void 0,
                            o = void 0,
                            n = void 0,
                            r = void 0;
                        t.options.checkCrossOrigin && E(a) && (i = e.crossOrigin,
                                i ? o = a : (i = "anonymous",
                                    o = H(a))),
                            t.crossOrigin = i,
                            t.crossOriginUrl = o;
                        var h = L("img");
                        i && (h.crossOrigin = i),
                            h.src = o || a,
                            t.image = h,
                            t.onStart = n = s(t.start, t),
                            t.onStop = r = s(t.stop, t),
                            t.isImg ? e.complete ? t.start() : y(e, At, n) : (y(h, At, n),
                                y(h, Ot, r),
                                u(h, "cropper-hide"),
                                e.parentNode.insertBefore(h, e.nextSibling))
                    }
                }, {
                    key: "start",
                    value: function(t) {
                        var e = this,
                            a = e.isImg ? e.element : e.image;
                        t && (x(a, At, e.onStart),
                                x(a, Ot, e.onStop)),
                            N(a, function(t, a) {
                                d(e.imageData, {
                                        naturalWidth: t,
                                        naturalHeight: a,
                                        aspectRatio: t / a
                                    }),
                                    e.loaded = !0,
                                    e.build()
                            })
                    }
                }, {
                    key: "stop",
                    value: function() {
                        var t = this,
                            e = t.image;
                        x(e, At, t.onStart),
                            x(e, Ot, t.onStop),
                            W(e),
                            t.image = null
                    }
                }, {
                    key: "build",
                    value: function() {
                        var t = this,
                            e = t.options,
                            a = t.element,
                            i = t.image,
                            o = void 0,
                            r = void 0,
                            h = void 0,
                            c = void 0,
                            d = void 0,
                            s = void 0;
                        if (t.loaded) {
                            t.ready && t.unbuild();
                            var p = L("div");
                            p.innerHTML = j,
                                t.container = o = a.parentNode,
                                t.cropper = r = T(p, "cropper-container")[0],
                                t.canvas = h = T(r, "cropper-canvas")[0],
                                t.dragBox = c = T(r, "cropper-drag-box")[0],
                                t.cropBox = d = T(r, "cropper-crop-box")[0],
                                t.viewBox = T(r, "cropper-view-box")[0],
                                t.face = s = T(d, "cropper-face")[0],
                                X(h, i),
                                u(a, zt),
                                o.insertBefore(r, a.nextSibling),
                                t.isImg || m(i, "cropper-hide"),
                                t.initPreview(),
                                t.bind(),
                                e.aspectRatio = Math.max(0, e.aspectRatio) || NaN,
                                e.viewMode = Math.max(0, Math.min(3, Math.round(e.viewMode))) || 0,
                                t.cropped = e.autoCrop,
                                e.autoCrop ? e.modal && u(c, "cropper-modal") : u(d, zt),
                                e.guides || u(T(d, "cropper-dashed"), zt),
                                e.center || u(T(d, "cropper-center"), zt),
                                e.background && u(r, "cropper-bg"),
                                e.highlight || u(s, "cropper-invisible"),
                                e.cropBoxMovable && (u(s, "cropper-move"),
                                    w(s, "action", "all")),
                                e.cropBoxResizable || (u(T(d, "cropper-line"), zt),
                                    u(T(d, "cropper-point"), zt)),
                                t.setDragMode(e.dragMode),
                                t.render(),
                                t.ready = !0,
                                t.setData(e.data),
                                t.completing = setTimeout(function() {
                                    n(e.ready) && y(a, Rt, e.ready, !0),
                                        M(a, Rt),
                                        M(a, St, t.getData()),
                                        t.complete = !0
                                }, 0)
                        }
                    }
                }, {
                    key: "unbuild",
                    value: function() {
                        var t = this;
                        t.ready && (t.complete || clearTimeout(t.completing),
                            t.ready = !1,
                            t.complete = !1,
                            t.initialImageData = null,
                            t.initialCanvasData = null,
                            t.initialCropBoxData = null,
                            t.containerData = null,
                            t.canvasData = null,
                            t.cropBoxData = null,
                            t.unbind(),
                            t.resetPreview(),
                            t.previews = null,
                            t.viewBox = null,
                            t.cropBox = null,
                            t.dragBox = null,
                            t.canvas = null,
                            t.container = null,
                            W(t.cropper),
                            t.cropper = null)
                    }
                }], [{
                    key: "noConflict",
                    value: function() {
                        return window.Cropper = Pt,
                            t
                    }
                }, {
                    key: "setDefaults",
                    value: function(t) {
                        d(P, o(t) && t)
                    }
                }]),
                t
        }();
    return d(jt.prototype, ht),
        d(jt.prototype, dt),
        d(jt.prototype, yt),
        d(jt.prototype, Ct),
        d(jt.prototype, Et),
        d(jt.prototype, Ht),
        "undefined" != typeof window && (Pt = window.Cropper,
            window.Cropper = jt),
        jt
});

//TODO start
var a = true;

function gid(b) {
    return document.getElementById(b)
}

function show_alert() {
    gid("wrapper").classList.add("tada");
    setTimeout(function() {
        gid("wrapper").classList.remove("tada")
    }, 1000)
}

function resample_single(l, b, e, F) {
    var P = l.width;
    var E = l.height;
    b = Math.round(b);
    e = Math.round(e);
    var B = P / b;
    var I = E / e;
    var f = Math.ceil(B / 2);
    var v = Math.ceil(I / 2);
    var z = l.getContext("2d");
    var m = z.getImageData(0, 0, P, E);
    var u = z.createImageData(b, e);
    var O = m.data;
    var K = u.data;
    for (var M = 0; M < e; M++) {
        for (var N = 0; N < b; N++) {
            var s = (N + M * b) * 4;
            var J = 0;
            var L = 0;
            var D = 0;
            var n = 0;
            var r = 0;
            var x = 0;
            var y = 0;
            var c = (M + 0.5) * I;
            var q = Math.floor(M * I);
            var k = Math.ceil((M + 1) * I);
            for (var p = q; p < k; p++) {
                var g = Math.abs(c - (p + 0.5)) / v;
                var d = (N + 0.5) * B;
                var G = g * g;
                var o = Math.floor(N * B);
                var C = Math.ceil((N + 1) * B);
                for (var A = o; A < C; A++) {
                    var h = Math.abs(d - (A + 0.5)) / f;
                    var H = Math.sqrt(G + h * h);
                    if (H >= 1) {
                        continue
                    }
                    J = 2 * H * H * H - 3 * H * H + 1;
                    var t = 4 * (A + p * P);
                    y += J * O[t + 3];
                    D += J;
                    if (O[t + 3] < 255) {
                        J = J * O[t + 3] / 250
                    }
                    n += J * O[t];
                    r += J * O[t + 1];
                    x += J * O[t + 2];
                    L += J
                }
            }
            K[s] = n / L;
            K[s + 1] = r / L;
            K[s + 2] = x / L;
            K[s + 3] = y / D
        }
    }
    if (F === true) {
        l.width = b;
        l.height = e
    } else {
        z.clearRect(0, 0, P, E)
    }
    z.putImageData(u, 0, 0)
}
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "")
};
var nav = document.getElementById("tab").children;
var con = document.getElementById("wrapper").children;
var tab = 0;
for (i = 0; i < nav.length; i++) {
    nav[i].index = i;
    nav[i].onclick = function() {
        for (var b = 0; b < con.length; b++) {
            con[b].style.display = "none";
            nav[b].className = "";
            if (this.index > 1) {
                document.getElementById("method").style.display = "none";
                document.getElementById("human_face").style.display = "none"
            } else {
                document.getElementById("method").style.display = "block";
                document.getElementById("human_face").style.display = "block"
            }
        }
        tab = this.index;
        con[this.index].style.display = "block";
        nav[this.index].className = "cur_tab"
    }
}
var progressValue = document.querySelector(".progress__value");
var RADIUS = 54;
var CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function progress(c) {
    gid("loader").classList.contains("heart") && gid("loader").classList.remove("heart");
    gid("process").innerHTML = Math.round(c * 100) + "%";
    var b = CIRCUMFERENCE * (1 - c);
    progressValue.style.strokeDashoffset = b
}
progressValue.style.strokeDasharray = CIRCUMFERENCE;
progress(0);
var file_quantity = 0;
var files;
var format = ["jpg", "png", "gif", "bmp"];
var img = gid("img");
var canvas = gid("canvas");
var single_cvs;
var single_name;
gid("q_value").addEventListener("input", function() {
    gid("quality").innerHTML = this.value + "%"
});
gid("cropper_value").addEventListener("input", function() {
    gid("cropper_quality").innerHTML = this.value + "%"
});
gid("multi").addEventListener("change", function(b) {
    files = b.target.files;
    file_quantity = files.length;
    gid("upload_bg").classList.add("upload_bg_remove");
    gid("loader").classList.remove("none");
    gid("loader").classList.add("heart");
    gid("waiting").innerHTML = file_quantity + " images waiting to be resized";
    gid("resize_btn").classList.remove("white_btn", "not_allowed");
    gid("resize_btn").classList.remove("not_allowed");
    gid("resize_btn").classList.add("orange_btn");
    gid("btn_outer").style.marginTop = "660px"
}, false);
gid("center").addEventListener("change", function() {
    gid("human_face").style.display = "none"
});
gid("scrop").addEventListener("change", function() {
    gid("human_face").style.display = "block"
});
var zip = new JSZip();
var imgfolder = zip.folder("smartResize");
var format_arr = ["image/jpeg", "image/png", "image/webp"];
var ext_arr = ["jpg", "png", "webp"];

function crop(r, b) {
    var e = [img.naturalWidth, img.naturalHeight];
    var g = e[0] / e[1];
    var h = r.width;
    var l = r.height;
    var d = h / l;
    var q = canvas.getContext("2d");
    var n = parseInt(document.forms[0].output_format.value);
    var o = gid("q_value").value / 100;
    var p = gid("suffix").value.trim();
    var c = b.split(".");
    c.pop();
    var f = c.join(".") + p + "." + ext_arr[n];
    if (d == g) {
        canvas.height = e[1];
        canvas.width = e[0];
        q.drawImage(img, 0, 0, e[0], e[1], 0, 0, e[0], e[1]);
        if (tab == 0) {
            resample_single(canvas, h, l, true)
        }
        var k = canvas.toDataURL(format_arr[n], o).replace("data:" + format_arr[n] + ";base64,", "");
        if (file_quantity > 1) {
            imgfolder.file(f, k, {
                base64: true
            })
        } else {
            single_name = f;
            single_cvs = k
        }
        progress_bar()
    } else {
        if (d < g) {
            var m = h * e[1] / l;
            canvas.width = m;
            canvas.height = e[1];
            SmartCrop.crop(img, r, function(s) {
                q.drawImage(img, s.topCrop.x, s.topCrop.y, m, e[1], 0, 0, m, e[1]);
                if (tab == 0) {
                    resample_single(canvas, h, l, true)
                }
                var t = canvas.toDataURL(format_arr[n], o).replace("data:" + format_arr[n] + ";base64,", "");
                if (file_quantity > 1) {
                    imgfolder.file(f, t, {
                        base64: true
                    })
                } else {
                    single_name = f;
                    single_cvs = t
                }
                progress_bar()
            })
        } else {
            var j = l * e[0] / h;
            canvas.height = j;
            canvas.width = e[0];
            SmartCrop.crop(img, r, function(s) {
                q.drawImage(img, s.topCrop.x, s.topCrop.y, e[0], j, 0, 0, e[0], j);
                if (tab == 0) {
                    resample_single(canvas, h, l, true)
                }
                var t = canvas.toDataURL(format_arr[n], o).replace("data:" + format_arr[n] + ";base64,", "");
                if (file_quantity > 1) {
                    imgfolder.file(f, t, {
                        base64: true
                    })
                } else {
                    single_name = f;
                    single_cvs = t
                }
                progress_bar()
            })
        }
    }
}

function crop_from_center(h, l, b) {
    var e = [img.naturalWidth, img.naturalHeight];
    var g = e[0] / e[1];
    var d = h / l;
    var q = canvas.getContext("2d");
    var n = parseInt(document.forms[0].output_format.value);
    var o = gid("q_value").value / 100;
    var p = gid("suffix").value.trim();
    var c = b.split(".");
    c.pop();
    var f = c.join(".") + p + "." + ext_arr[n];
    if (d == g) {
        canvas.height = e[1];
        canvas.width = e[0];
        q.drawImage(img, 0, 0, e[0], e[1], 0, 0, e[0], e[1]);
        resample_single(canvas, h, l, true);
        var k = canvas.toDataURL(format_arr[n], o).replace("data:" + format_arr[n] + ";base64,", "");
        if (file_quantity > 1) {
            imgfolder.file(f, k, {
                base64: true
            })
        } else {
            single_cvs = k
        }
        progress_bar()
    } else {
        if (d > g) {
            var j = l * e[0] / h;
            canvas.height = j;
            canvas.width = e[0];
            q.drawImage(img, 0, (e[1] - j) / 2, e[0], j, 0, 0, e[0], j);
            if (tab == 0) {
                resample_single(canvas, h, l, true)
            }
            var k = canvas.toDataURL(format_arr[n], o).replace("data:" + format_arr[n] + ";base64,", "");
            if (file_quantity > 1) {
                imgfolder.file(f, k, {
                    base64: true
                })
            } else {
                single_name = f;
                single_cvs = k
            }
            progress_bar()
        } else {
            var m = h * e[1] / l;
            canvas.width = m;
            canvas.height = e[1];
            q.drawImage(img, (e[0] - m) / 2, 0, m, e[1], 0, 0, m, e[1]);
            if (tab == 0) {
                resample_single(canvas, h, l, true)
            }
            var k = canvas.toDataURL(format_arr[n], o).replace("data:" + format_arr[n] + ";base64,", "");
            if (file_quantity > 1) {
                imgfolder.file(f, k, {
                    base64: true
                })
            } else {
                single_name = f;
                single_cvs = k
            }
            progress_bar()
        }
    }
}
var start_time;
var resize_index = 0;

function progress_bar() {
    progress((resize_index + 1) / file_quantity);
    resize_index++;
    resize_loop();
    gid("waiting").innerHTML = "Resizing " + resize_index + " of " + file_quantity + " images";
    if (resize_index == file_quantity) {
        var b = (new Date().getTime() - start_time) / 1000;
        gid("result").innerHTML = "Resized " + file_quantity + " images in " + b + " seconds";
        gid("cover").classList.add("white");
        gid("cover_inner").classList.remove("none");
        gid("opt").classList.add("blur")
    }
}

function resize_loop() {
    if (resize_index < file_quantity && a) {
        if (!gid("resize_btn").classList.contains("not_allowed")) {
            var c = files[resize_index];
            if (c.type.match("image")) {
                var b = c.name;
                var d = new FileReader();
                d.addEventListener("load", function(f) {
                    var e = f.target;
                    img.src = e.result;
                    img.onload = function() {
                        var m = parseInt(document.forms[0].elements.crop_method.value);
                        if (tab < 2) {
                            if (tab == 0) {
                                var q = parseInt(gid("w1").value);
                                var s = parseInt(gid("h1").value)
                            } else {
                                var q = parseInt(gid("ratio_width").value);
                                var s = parseInt(gid("ratio_height").value)
                            }
                            if (q > 0 && s > 0) {
                                if (typeof start_time == "undefined") {
                                    start_time = new Date().getTime();
                                    gid("cover").classList.remove("none")
                                }
                                if (m == 0) {
                                    var y = {
                                        width: q,
                                        height: s,
                                        minScale: 1,
                                        ruleOfThirds: true
                                    };
                                    if (document.forms[0].face_detect.checked) {
                                        var u = new tracking.ObjectTracker("face");
                                        tracking.track(img, u);
                                        u.on("track", function(n) {
                                            y.boost = n.data.map(function(z) {
                                                return {
                                                    x: z.x,
                                                    y: z.y,
                                                    width: z.width,
                                                    height: z.height,
                                                    weight: 1
                                                }
                                            });
                                            crop(y, b)
                                        })
                                    } else {
                                        crop(y, b)
                                    }
                                } else {
                                    crop_from_center(q, s, b)
                                }
                            } else {
                                show_alert()
                            }
                        } else {
                            var k = [img.naturalWidth, img.naturalHeight];
                            var p = k[0] / k[1];
                            var h = q / s;
                            var x = canvas.getContext("2d");
                            var t = parseInt(document.forms[0].output_format.value);
                            var v = gid("q_value").value / 100;
                            var w = gid("suffix").value.trim();
                            var g = b.split(".");
                            g.pop();
                            var o = g.join(".") + w + "." + ext_arr[t];
                            var l = 1;
                            var j = false;
                            switch (tab) {
                                case 2:
                                    if (gid("scale").value > 0) {
                                        l = gid("scale").value;
                                        j = false
                                    } else {
                                        j = true
                                    }
                                    break;
                                case 3:
                                    if (gid("max_width").value > 0) {
                                        if (gid("max_width").value < k[0]) {
                                            l = gid("max_width").value / k[0]
                                        }
                                        j = false
                                    } else {
                                        j = true
                                    }
                                    break;
                                case 4:
                                    if (gid("max_height").value > 0) {
                                        if (gid("max_height").value < k[1]) {
                                            l = gid("max_height").value / k[1]
                                        }
                                        j = false
                                    } else {
                                        j = true
                                    }
                                    break;
                                case 5:
                                    if (gid("thumb_height").value > 0 && gid("thumb_width").value > 0) {
                                        if (gid("thumb_height").value < k[1] || gid("thumb_width").value < k[0]) {
                                            l = Math.min(gid("thumb_height").value / k[1], gid("thumb_width").value / k[0])
                                        }
                                        j = false
                                    } else {
                                        j = true
                                    }
                                    break
                            }
                            if (!j) {
                                if (typeof start_time == "undefined") {
                                    start_time = new Date().getTime();
                                    gid("cover").classList.remove("none")
                                }
                                canvas.height = k[1];
                                canvas.width = k[0];
                                x.drawImage(img, 0, 0, k[0], k[1], 0, 0, k[0], k[1]);
                                resample_single(canvas, k[0] * l, k[1] * l, true);
                                var r = canvas.toDataURL(format_arr[t], v).replace("data:" + format_arr[t] + ";base64,", "");
                                if (file_quantity > 1) {
                                    imgfolder.file(o, r, {
                                        base64: true
                                    })
                                } else {
                                    single_name = o;
                                    single_cvs = r
                                }
                                progress_bar()
                            } else {
                                show_alert()
                            }
                        }
                    }
                });
                d.readAsDataURL(c)
            }
        }
    }
}
document.getElementById("download_zip").addEventListener("click", function() {
    if (file_quantity > 1) {
        zip.generateAsync({
            type: "blob"
        }).then(function(c) {
            saveAs(c, "smartresize" + Date.now() + ".zip")
        })
    } else {
        var b = format_arr[parseInt(document.forms[0].output_format.value)];
        canvas.toBlob(function(c) {
            saveAs(c, single_name, b)
        }, b, gid("q_value").value / 100)
    }
});
var cropper, filename, type;
gid("single_file").addEventListener("change", function(d) {
    var c = d.target.files;
    var b = c[0];
    if (b.type.match("image") && a) {
        filename = b.name;
        type = b.type;
        var e = new FileReader();
        e.addEventListener("load", function(g) {
            var f = g.target;
            gid("single_img").src = f.result;
            gid("single_img").onload = function() {
                var h = [gid("single_img").naturalWidth, gid("single_img").naturalHeight];
                var j = gid("single_img").naturalWidth / gid("single_img").naturalHeight;
                if (j > 1.777778) {
                    gid("single_img").width = 800
                } else {
                    gid("single_img").height = 450
                }
                gid("single").classList.add("single_show");
                cropper = new Cropper(document.getElementById("single_img"), {
                    dragMode: "move",
                    crop: function(k) {
                        document.querySelector(".point-s").innerHTML = "<a>" + Math.ceil(k.detail.width) + "px</a>";
                        document.querySelector(".point-e").innerHTML = "<a>" + Math.ceil(k.detail.height) + "px</a>"
                    }
                })
            }
        });
        e.readAsDataURL(b)
    }
});
gid("download_cropper").addEventListener("click", function() {
    var b = filename.split(".");
    var d = b.pop();
    var c = b.join(".") + "-cropped." + d;
    cropper.getCroppedCanvas().toBlob(function(e) {
        saveAs(e, c, type)
    }, type, gid("cropper_value").value / 100)
});
var fixed_ratio = false;
document.forms[1].fixed_ratio.addEventListener("change", function() {
    if (this.checked) {
        gid("rw").disabled = false;
        gid("rh").disabled = false;
        fixed_ratio = true;
        if (gid("rw").value > 0 && gid("rh").value > 0) {
            cropper.setAspectRatio(gid("rw").value / gid("rh").value)
        }
    } else {
        fixed_ratio = false;
        gid("rw").disabled = true;
        gid("rh").disabled = true;
        cropper.setAspectRatio(NaN)
    }
});
gid("rw").addEventListener("input", function() {
    if (gid("rw").value > 0 && gid("rh").value > 0 && fixed_ratio) {
        cropper.setAspectRatio(gid("rw").value / gid("rh").value)
    } else {
        cropper.setAspectRatio(NaN)
    }
});
gid("rh").addEventListener("input", function() {
    if (gid("rw").value > 0 && gid("rh").value > 0 && fixed_ratio) {
        cropper.setAspectRatio(gid("rw").value / gid("rh").value)
    } else {
        cropper.setAspectRatio(NaN)
    }
});