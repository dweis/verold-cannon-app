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

    this.position = opts.position || { x: 0, y: 0, z: 0 };
    this.mass = opts.mass || 10;
    this.dimensions = opts.dimensions || { x: 0.25, y: 0.25, z: 0.25 };
    this.linearDamping = opts.linearDamping || 0.3;
    this.angularDamping = opts.angularDamping || 0.3;
  }

  _.extend(Mesh.prototype, {
    create: function() {
      throw new Error('Not implemented');
    },
    created: function() {},
    preStep: function() {},
    postStep: function() {}
  });

  return Mesh;
});
