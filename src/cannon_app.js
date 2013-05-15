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

/* global ModelObject */
define([ 'underscore', 'box_mesh', 'compound_mesh', 'cannon' ],
      function(_, BoxMesh, CompoundMesh, CANNON) {
  if (typeof window.VAPI === 'undefined' || typeof window.VAPI.VeroldApp === 'undefined') {
    throw new Error('VAPI.VeroldApp does not exist!');
  }

  var CannonApp = window.VAPI.CannonApp = window.VAPI.VeroldApp.extend({
    constructor: function() {
      window.VAPI.VeroldApp.prototype.constructor.apply(this, arguments);

      this.bodies = [];
    },

    engineReady: function() {
      var that = this;

      this.loadScene(this.defaultSceneID, {
        success_hierarchy: function(scene) {
          that.defaultScene = scene;

          that.initializeCannon();
          that.defaultSceneLoaded(scene);

          that.veroldEngine.on('update', that.update, that);
          that.veroldEngine.on('fixedUpdate', that.fixedUpdate, that);
        },

        progress: function(sceneObj) {
          that.defaultSceneProgress(sceneObj);
        }
      });
    },

    initializeCannon: function() {
      var that = this,
          groundBody,
          groundShape;

      // TODO: make this stuff configurable
      this.world = new CANNON.World();
      this.world.gravity.set(0, -9.82, 0);
      this.world.broadphase = new CANNON.NaiveBroadphase();
      this.world.solver.iterations = 7;
      this.world.solver.tolerance = 0.1;
      this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
      this.world.defaultContactMaterial.contactEquationRegularizationTime = 4;

      this.defaultMaterial = new CANNON.Material('default');
      this.defaultContactMaterial = new CANNON.ContactMaterial(this.defaultMaterial, this.defaultMaterial, 0.1, 0.1);
      this.world.addContactMaterial(this.defaultContactMaterial);

      groundShape = new CANNON.Plane();
      groundBody = new CANNON.RigidBody(0, groundShape, this.defaultMaterial);
      groundBody.position.set(0, 0, 0);
      groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), 0.5 * Math.PI);

      this.world.add(groundBody);

      this.defaultScene.traverse(function(obj) {
        var meshes = 0;
        if (obj instanceof ModelObject) {
          obj.traverse(function(innerObj) {
            if (innerObj.entityModel.get('type') === 'mesh') {
              meshes += 1;
            }
          });
          if (meshes > 1) {
            that.bodies.push(new CompoundMesh(that.world, obj, that.defaultMaterial));
          } else {
            that.bodies.push(new BoxMesh(that.world, obj, that.defaultMaterial));
          }
        }
      });
    },

    fixedUpdate: function(delta) {
      this.world.step(delta);

      _.each(this.bodies, function(body) {
        body.update(delta);
      }, this);
    },

    update: function(/*delta*/) {

    }
  });

  return CannonApp;
});
