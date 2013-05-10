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

define([ 'src/box_mesh', 'cannon' ], function(BoxMesh, CANNON) {
  if (typeof window.VAPI === 'undefined' || typeof window.VAPI.VeroldApp === 'undefined') {
    throw new Error('VAPI.VeroldApp does not exist!');
  }

  var VAPI = window.VAPI;

  var _ = require('underscore');

  var CannonApp = VAPI.VeroldApp.extend({
    constructor: function() {
      VAPI.VeroldApp.prototype.constructor.apply(this, arguments);

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
          groundShape,
          q;

      this.world = new CANNON.World();
      this.world.gravity.set(0, -9.82, 0);
      this.world.broadphase = new CANNON.NaiveBroadphase();
      this.world.solver.iterations = 10;
      this.world.defaultContactMaterial.contactEquationStiffness = 1e6;
      this.world.defaultContactMaterial.contactEquationRegularizationTime = 4;

      this.defaultMaterial = new CANNON.Material('default');
      this.defaultContactMaterial = new CANNON.ContactMaterial(this.defaultMaterial, this.defaultMaterial, 0.5, 0.7);
      this.world.addContactMaterial(this.defaultContactMaterial);

      groundShape = new CANNON.Plane();
      groundBody = new CANNON.RigidBody(0, groundShape, this.defaultMaterial);
      groundBody.position.set(0, 0, 0);
      q = new CANNON.Quaternion();
      q.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), 0.5 * Math.PI);
      groundBody.quaternion.set(q.x, q.y, q.z, q.w);
      this.world.add(groundBody);
      this.groundBody = groundBody;

      // global console, ModelObject
      console.log(this.world, this.groundBody);

      this.defaultScene.traverse(function(obj) {
        if (obj instanceof ModelObject) {
          obj.threeData.bBox.geometry.computeBoundingBox();

          var v =  obj.threeData.bBox.geometry.boundingBox.max.clone();
          v.sub(obj.threeData.bBox.geometry.boundingBox.min);
          v.multiplyVectors(v, obj.threeData.scale);

          console.log('Size: ', v);

          var position = new CANNON.Vec3(),
              dimensions = new CANNON.Vec3();
          position.set(obj.threeData.position.x, obj.threeData.position.y, obj.threeData.position.z);
          dimensions.set(v.x, v.y, v.z);

          var boxMesh = new BoxMesh(that.world, obj, that.defaultMaterial, {
            position: position,
            dimensions: dimensions
          });

          boxMesh.create();

          that.bodies.push(boxMesh);
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
