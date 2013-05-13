define([ 'mesh', 'cannon' ], function(Mesh, CANNON) {
  if (typeof window.VAPI === 'undefined' || typeof window.VAPI.VeroldApp === 'undefined') {
    throw new Error('VAPI.VeroldApp does not exist!');
  }

  var _ = require('underscore'),
      $ = require('jquery');

  function CompoundMesh(world, model, material, opts) {
    Mesh.call(this, world, model, material, opts);
  }

  // global console, MeshObject, SkinnedMeshObject
  CompoundMesh.prototype = _.extend({}, {
    create: function() {
      var that = this,
          body;

      console.log('Creating compound mesh...');

      var compoundShape = new CANNON.Compound();

      this.position = this.model.threeData.position.clone();

      this.model.traverse(function(obj) {
        var shape, dimensions, position;

        if (obj instanceof MeshObject || obj instanceof SkinnedMeshObject) {
          obj.threeData.geometry.computeBoundingBox();
          position = obj.threeData.position.clone();

          dimensions = obj.threeData.geometry.boundingBox.max.clone();
          dimensions.sub(obj.threeData.geometry.boundingBox.min);
          dimensions.multiplyVectors(dimensions, that.model.threeData.scale);
          dimensions.multiplyScalar(0.5);
          console.log(dimensions, position, obj.threeData.quaternion);

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

      body.linearDamping = this.linearDamping;
      body.angularDamping = this.angularDamping;

      body.preStep = $.proxy(this.preStep, this);
      body.postStep = $.proxy(this.postStep, this);

      this.world.add(body);

      body.position.set(this.position.x, this.position.y, this.position.z);

      body.quaternion.set(this.model.threeData.quaternion.x,
                          this.model.threeData.quaternion.y,
                          this.model.threeData.quaternion.z,
                          this.model.threeData.quaternion.w);

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
