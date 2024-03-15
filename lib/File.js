//
"use strict";

const ts = require('tools-ts')('tools:File');
const pjson = require('../package.json');
const mimetype = require('./mimetype.js');
const Pack = require('tools-pack');
const $pack = new Pack(1048576 * 32); // 32MB limit

class File
{
	constructor(name='', body='', type=null, zip=false)
	{
		this._name = String(name);
// FIXME: remove desc,tags,words,logo
		this.desc = '';
		this.logo = null;
		this.tags = [];
		this.words = [];
		this._size = 0;
		this._type = '';
		this._time = ts.now;
		this.bin = false;
		this.body = body;
		this.$ = null; // custom props
		this.zip = zip;
		this.aes = null;
		this.sign = null;
		this.__type__ = type;
	}

	get name() { return this._name; }

	get body(){ return this._body; }
	
	set body(v)
	{
		if (!(ts.is(v,Buffer) || ts.is(v,String) || ts.is(v,ArrayBuffer))){
			ts.error(38,'type?');
			this._body = null;
			return;
		}
		
		this._type = mimetype(this._name, v);
		this.bin = this._type.includes('charset=utf-8') ? false : true;

		this._body = this.bin ? v : v.toString(); 
		this._size = Buffer.byteLength(this._body);
	}

	get size() { return this._size; }		

	set size(v) 
	{ 
		if (ts.isPositive(v)) this._size = v; 
	}

	get time() { return this._time; }		

	set time(v) 
	{ 
		if (ts.isPositive(v)) this._time = v; 
	}

	get type() { return this.__type__ || this._type; }

	set type(v) { this.__type__ = v; }

	clone()
	{
		const f = new File();
		Object.keys(this).forEach((key,index) => { 
			f[key] = this[key]; 
		});
		return f;
	}
	
	slice(start, end, contentType) 
	{
		return this._body;
	}

    msg(cmd, to, src='', dst='')
    {
		if (!ts.is(to,String)) to = '';
		this.c = cmd;
		this.f = null; // from
		this.t = to;
		this.s = src;
		this.d = dst;
		this.m = null; // queue
		this.e = null; // error
	}

	pack()
	{// TODO: big file
		const r = {
			v: pjson.version,
			n: this.name,
			j: this.desc,
			g: this.tags,
			w: this.words,
			h: this.time,
			x: this.bin,
			b: this.body,
			z: this.zip,
			a: this.aes,
			y: this.sign
		};
// FIXME: this.$
		if (this.c) r.c = this.c;
		if (this.f) r.f = this.f;
		if (this.t) r.t = this.t;
		if (this.s) r.s = this.s;
		if (this.d) r.d = this.d;
		if (this.m) r.m = this.m;
		if (this.e) r.e = this.e;

		if (this.logo && this.logo.name && this.logo.body){
			r.i = [this.logo.name];
			r.i0 = this.logo.body;
		}
		
		if (this.zip){
			// TODO: zip body
		}

		return $pack.encode(r);
	}
	
	unpack(buf)
	{
		const r = $pack.decode(buf);
		if (!r) throw new Error('Invalid toolsFile');

		if (r.y) this.sign = r.y;
		if (r.a) this.aes = r.a;
		if (r.n) this._name = r.n;
		if (r.j) this.desc = r.j;
		if (r.g) this.tags = r.g;
		if (r.w) this.words = r.w;
		if (r.h) this.time = r.h;
		if (r.b) this.body = r.b;
		if (r.i && r.i[0] && r.i0){
			this.logo = {name: r.i[0], body: r.i0};
		}
		if (r.c) this.c = r.c;
		if (r.f) this.f = r.f;
		if (r.t) this.t = r.t;
		if (r.s) this.s = r.s;
		if (r.d) this.d = r.d;
		if (r.m) this.m = r.m;
		if (r.e) this.e = r.e;
		return this;
	}

	get webkitRelativePath() { return ''; }

	get lastModified() { return this.time; }

	get lastModifiedDate() { return new Date(this.time).toUTCString(); }  

}

module.exports = File;
