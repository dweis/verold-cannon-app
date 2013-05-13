define([ 'mesh', 'cannon' ], function(Mesh, CANNON) {
  if (typeof window.VAPI === 'undefined' || typeof window.VAPI.VeroldApp === 'undefined') {
    throw new Error('VAPI.VeroldApp does not exist!');
  }

  var _ = require('underscore'),
      $ = require('jquery');

  function BoxMesh(world, model, material, opts) {
    Mesh.call(this, world, model, material, opts);
  }

  BoxMesh.prototype = _.extend({}, {
    create: function() {
      var shape, body;

      console.log('Creating box mesh...');

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

      body.preStep = $.proxy(this.preStep, this);
      body.postStep = $.proxy(this.postStep, this);

      this.world.add(body);

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

  return BoxMesh;
});
