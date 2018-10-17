<img src="http://res.cloudinary.com/cloudinary4yopping/image/upload/v1458266051/logos/futurecommerce.png" alt="Futurecommerce" align="right" width="250" height="103"/>

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)
Banorte Payworks for Node.js
================================

[![Build Status](https://travis-ci.org/4yopping/banorte-payworks.svg?branch=master)](https://travis-ci.org/4yopping/banorte-payworks)

![Dependencies](https://david-dm.org/4yopping/node-odoo.svg)

[![GitHub forks](https://img.shields.io/github/forks/Naereen/StrapDown.js.svg?style=social&label=Fork&maxAge=2592000)](https://GitHub.com/Naereen/StrapDown.js/network/)

[![GitHub contributors](https://img.shields.io/github/contributors/Naereen/StrapDown.js.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/contributors/)

[![Open Source Love svg2](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

## Install

```bash
$ npm install banorte-payworks --save
```

## Usage

```js
const Payworks = require('banorte-payworks')
const payworks = new Payworks({
  username: 'b4113901',
  password: 'b4113901',
  merchant: '8641401',
  terminal: '08641401'
})
```
The mode of the call is made is passed with the mode variable. This can be passed
in the instancing call, in every method call in which case this is prefered. Also you can
pass the environment variable BPW_MODE to set the mode, this is the variable prefered over others.
The default mode used when no one is passed is RND = random.

### Using events

```js
payworks.on('auth.approved', function (body) {
  // saving to database or something else
}).on('auth.declined', function (err) {
  // send a notification or something else
})

// Create a preauthorization
payworks.auth({
  mount: 130.12,
  entry_mode: 'MANUAL',
  card_number: '4111111111111111',
  card_exp: '1220',
  security_code: '123'
})
```

### Using callbacks

```js
// Create a preauthorization
payworks.preAuth({
  mount: 130.12,
  entry_mode: 'MANUAL',
  card_number: '4111111111111111',
  card_exp: '1220',
  security_code: '123'
}, function (err, body, res) {
  if (err) {
    // send a notification or something else
  } else {
    // saving to database or something else
  }
})
```

### Using promises

```js
// Create a preauthorization
payworks.preAuth({
  mount: 130.12,
  entry_mode: 'MANUAL',
  card_number: '4111111111111111',
  card_exp: '1220',
  security_code: '123'
})
.then(function (body) {
  // saving to database or something else
})
.catch(function (err) {
  // send a notification or something else
})
```

## API Documentation

Please read this [extended documentation](http://4yopping.github.io/banorte-payworks).

### Payworks

#### Transactions

##### Payworks#auth(\<object\> params, [\<object\> options,] \<function\> callback)
##### Payworks#forceAuth(\<object\> params, [\<object\> options,] \<function\> callback)
##### Payworks#preAuth(\<object\> params, [\<object\> options,] \<function\> callback)
##### Payworks#postAuth(\<object\> params, [\<object\> options,] \<function\> callback)
##### Payworks#reAuth(\<object\> params, [\<object\> options,] \<function\> callback)
##### Payworks#refund(\<object\> params, [\<object\> options,] \<function\> callback)
##### Payworks#cancel(\<object\> params, [\<object\> options,] \<function\> callback)
##### Payworks#reverse(\<object\> params, [\<object\> options,] \<function\> callback)

#### Commands

##### Payworks#close(\<object\> params, [\<object\> options,] \<function\> callback)
##### Payworks#closeGroup(\<object\> params, [\<object\> options,] \<function\> callback)
##### Payworks#postAuth(\<object\> params, [\<object\> options,] \<function\> callback)
##### Payworks#verify(\<object\> params, [\<object\> options,] \<function\> callback)
##### Payworks#suspend(\<object\> params, [\<object\> options,] \<function\> callback)
##### Payworks#reactivate(\<object\> params, [\<object\> options,] \<function\> callback)

### Events

##### payworks.on(\<string\> eventName)

The payworks instance has a method to listen general events when a request has been finished.

`[methodName].approved`

When a transaction or command has been approved.

`[methodName].declined`

When a transaction has been declined. This event will be only emitted by transaction calls (`auth`, `forceAuth`, `preAuth`, `postAuth`, `reAuth`).

`[methodName].rejected`

When a transaction or command has been rejected by Payworks.

`[methodName].notAnswer`

When a transaction or command without response from Payworks.


## License

The MIT License (MIT)

Copyright (c) 2016 *Futurecommerce* and all related trademarks.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
