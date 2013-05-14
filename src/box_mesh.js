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

define([ 'underscore', 'mesh', 'cannon' ], function(_, Mesh, CANNON) {
  if (typeof window.VAPI === 'undefined' || typeof window.VAPI.VeroldApp === 'undefined') {
    throw new Error('VAPI.VeroldApp does not exist!');
  }

  function BoxMesh(world, model, material, opts) {
    Mesh.call(this, world, model, material, opts);
  }

  BoxMesh.prototype = _.extend({}, Mesh.prototype, {
    create: function() {
      var that = this, shape, body;

      this.model.threeData.bBox.geometry.computeBoundingBox();
      this.position = this.model.threeData.position.clone();

      this.dimensions = this.model.threeData.bBox.geometry.boundingBox.max.clone();
      this.dimensions.sub(this.model.threeData.bBox.geometry.boundingBox.min);
      this.dimensions.multiplyVectors(this.dimensions, this.model.threeData.scale);
      this.dimensions.multiplyScalar(0.5);

      shape = new CANNON.Box(new CANNON.Vec3(this.dimensions.x, this.dimensions.y, this.dimensions.z));
      body = new CANNON.RigidBody(this.mass, shape, this.material);

      body.linearDamping = this.linearDamping;
      body.angularDamping = this.angularDamping;

      body.position.set(this.position.x, this.position.y, this.position.z);

      body.preStep = function() {
        that.preStep();
      };

      body.postStep = function() {
        that.postStep();
      };

      this.world.add(body);

      body.quaternion.set(this.model.threeData.quaternion.x,
                          this.model.threeData.quaternion.y,
                          this.model.threeData.quaternion.z,
                          this.model.threeData.quaternion.w);

      this.model.cannonData = body;

      this.created();
    }
  });

  return BoxMesh;
});
