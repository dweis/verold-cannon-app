/* global THREE */
define([ 'cannon' ], function(CANNON) {
  var _ = require('underscore'),
      $ = require('jquery');

  function BoxMesh(world, model, material, opts) {
    opts = opts || {};

    this.world = world;
    this.model = model;
    this.material = material;

    this.position = opts.position || { x: 0, y: 0, z: 0 };
    this.mass = opts.mass || 10;
    this.dimensions = opts.dimensions || { x: 0.25, y: 0.25, z: 0.25 };
    this.linearDamping = opts.linearDamping || 0.3;
    this.angularDamping = opts.angularDamping || 0.3;
  }

  BoxMesh.prototype = _.extend({}, {
    create: function() {
      var shape = new CANNON.Box(new CANNON.Vec3(this.dimensions.x, this.dimensions.y, this.dimensions.z)),
          body = new CANNON.RigidBody(this.mass, shape, this.material);

      body.linearDamping = this.linearDamping;
      body.angularDamping = this.angularDamping;

      body.position.set(this.position.x, this.position.y, this.position.z);

      body.linearDamping = 0.10;
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

    preStep: function() {},

    postStep: function() {},

    update: function(delta) {
      this.body.position.copy(this.model.threeData.position);
      this.body.quaternion.copy(this.model.threeData.quaternion);
    },

    created: function() {
    }
  });

  return BoxMesh;
});
