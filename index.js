/**
 * tools File
 */
"use strict";

const File = require('./lib/File.js');
const Pool = require('./lib/Pool.js');
const Msg = require('./lib/Msg.js');
const mimetype = require('./lib/mimetype.js');

module.exports = {
	File: File,
	Pool: Pool,
	Msg:Msg,
	mimetype:mimetype
};
