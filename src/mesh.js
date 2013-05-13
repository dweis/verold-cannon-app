define([], function() {
  if (typeof window.VAPI === 'undefined' || typeof window.VAPI.VeroldApp === 'undefined') {
    throw new Error('VAPI.VeroldApp does not exist!');
  }

  var _ = require('underscore');

  function Mesh(world, model, material, opts) {
    opts = opts || {};

    this.world = world;
    this.model = model;
    this.material = material;

    this.position = opts.position || this.position || { x: 0, y: 0, z: 0 };
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
    created: function() {},
    preStep: function() {},
    postStep: function() {}
  });

  return Mesh;
});
