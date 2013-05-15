/*
Copyright (c) 2013 Verold Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

define([ 'underscore' ], function(_) {
  if (typeof window.VAPI === 'undefined' || typeof window.VAPI.VeroldApp === 'undefined') {
    throw new Error('VAPI.VeroldApp does not exist!');
  }

  function Mesh(world, model, material, opts) {
    opts = opts || {};

    this.world = world;
    this.model = model;
    this.material = material;

    this.mass = opts.mass || this.mass || 10;
    this.dimensions = opts.dimensions || this.dimensions || { x: 0.25, y: 0.25, z: 0.25 };
    this.linearDamping = opts.linearDamping || this.linearDamping || 0.3;
    this.angularDamping = opts.angularDamping || this.angularDamping || 0.3;

    this.create();
  }

  _.extend(Mesh.prototype, {
    create: function() {
      throw new Error('Not implemented');
    },

    update: function() {
      this.model.cannonData.position.copy(this.model.threeData.position);
      this.model.cannonData.quaternion.copy(this.model.threeData.quaternion);
    },

    created: function() {}
  });

  return Mesh;
});
