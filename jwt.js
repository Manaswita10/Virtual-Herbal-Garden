// Run this in a Node.js environment
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
console.log(secret);