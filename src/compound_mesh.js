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

/* global MeshObject, SkinnedMeshObject, THREE */
define([ 'underscore', 'mesh', 'cannon' ], function(_, Mesh, CANNON) {
  if (typeof window.VAPI === 'undefined' || typeof window.VAPI.VeroldApp === 'undefined') {
    throw new Error('VAPI.VeroldApp does not exist!');
  }

  function computeScale(obj, scale) {
    if (!scale) {
      scale = new THREE.Vector3(1, 1, 1);
    }

    if (obj.parent) {
      scale = computeScale(obj.parent, scale);
    }

    scale.multiply(obj.scale);

    return scale;
  }

  function CompoundMesh(world, model, opts) {
    Mesh.call(this, world, model, opts);
  }

  CompoundMesh.prototype = _.extend({}, Mesh.prototype, {
    create: function() {
      var body, compoundShape = new CANNON.Compound();

      this.model.traverse(function(obj) {
        var shape, halfExtents, position, scale;

        if (obj instanceof MeshObject || obj instanceof SkinnedMeshObject) {
          scale = computeScale(obj.threeData);

          obj.threeData.geometry.computeBoundingBox();

          halfExtents = obj.threeData.geometry.boundingBox.max.clone();
          halfExtents.sub(obj.threeData.geometry.boundingBox.min);
          halfExtents.multiplyScalar(0.5);

          position = new THREE.Vector3();

          if (obj.threeData.parent) {
            position.add(obj.threeData.parent.position.clone().multiply(obj.threeData.parent.scale));
          }

          position.add(obj.threeData.position.clone().multiply(obj.threeData.scale));
          position.add(obj.threeData.geometry.boundingBox.min);
          position.add(halfExtents);

          position.multiply(scale);
          halfExtents.multiply(scale);

          shape = new CANNON.Box(new CANNON.Vec3(halfExtents.x, halfExtents.y, halfExtents.z));

          compoundShape.addChild(shape,
            new CANNON.Vec3(position.x, position.y, position.z),
            new CANNON.Quaternion(obj.threeData.quaternion.x,
                                  obj.threeData.quaternion.y,
                                  obj.threeData.quaternion.z,
                                  obj.threeData.quaternion.w));
        }
      });

      body = new CANNON.RigidBody(this.mass, compoundShape);

      body.position.set(this.model.threeData.position.x,
                        this.model.threeData.position.y,
                        this.model.threeData.position.z);

      body.quaternion.set(this.model.threeData.quaternion.x,
                          this.model.threeData.quaternion.y,
                          this.model.threeData.quaternion.z,
                          this.model.threeData.quaternion.w);

      body.linearDamping = this.linearDamping;
      body.angularDamping = this.angularDamping;

      this.world.add(body);

      this.model.cannonData = body;
      this.model.cannonAppData = this;

      this.created();
    }
  });

  return CompoundMesh;
});
