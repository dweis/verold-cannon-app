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

// global MeshObject, SkinnedMeshObject
define([ 'mesh', 'cannon' ], function(Mesh, CANNON) {
  if (typeof window.VAPI === 'undefined' || typeof window.VAPI.VeroldApp === 'undefined') {
    throw new Error('VAPI.VeroldApp does not exist!');
  }

  var _ = require('underscore'),
      $ = require('jquery');

  function CompoundMesh(world, model, material, opts) {
    Mesh.call(this, world, model, material, opts);
  }

  CompoundMesh.prototype = _.extend({}, {
    create: function() {
      var that = this,
          body;

      var compoundShape = new CANNON.Compound();

      this.position = this.model.threeData.position.clone();

      this.model.traverse(function(obj) {
        var shape, dimensions, position;

        if (obj instanceof MeshObject || obj instanceof SkinnedMeshObject) {
          obj.threeData.geometry.computeBoundingBox();

          dimensions = obj.threeData.geometry.boundingBox.max.clone();
          dimensions.sub(obj.threeData.geometry.boundingBox.min);
          dimensions.multiplyScalar(0.5);
          dimensions.multiplyVectors(dimensions, that.model.threeData.scale);

          position = obj.threeData.geometry.boundingBox.min.clone();
          position.add(dimensions);

          position.multiplyVectors(position, that.model.threeData.scale);

          shape = new CANNON.Box(new CANNON.Vec3(dimensions.x, dimensions.y, dimensions.z));

          compoundShape.addChild(shape,
              new CANNON.Vec3(position.x, position.y, position.z),
              new CANNON.Quaternion(obj.threeData.quaternion.x,
                                    obj.threeData.quaternion.y,
                                    obj.threeData.quaternion.z,
                                    obj.threeData.quaternion.w));
        }
      });

      body = new CANNON.RigidBody(this.mass, compoundShape, this.material);

      body.position.set(this.position.x, this.position.y, this.position.z);

      body.quaternion.set(this.model.threeData.quaternion.x,
                          this.model.threeData.quaternion.y,
                          this.model.threeData.quaternion.z,
                          this.model.threeData.quaternion.w);

      body.linearDamping = this.linearDamping;
      body.angularDamping = this.angularDamping;

      body.preStep = $.proxy(this.preStep, this);
      body.postStep = $.proxy(this.postStep, this);

      this.world.add(body);

      this.body = body;

      this.created();
    },

    update: function() {
      this.body.position.copy(this.model.threeData.position);
      this.body.quaternion.copy(this.model.threeData.quaternion);
    },

    created: function() {
    }
  });

  return CompoundMesh;
});