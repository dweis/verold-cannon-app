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

define([ 'box_mesh' ], function(BoxMesh) {
  if (typeof window.VAPI === 'undefined' || typeof window.VAPI.VeroldApp === 'undefined') {
    throw new Error('VAPI.VeroldApp does not exist!');
  }

  var VAPI = window.VAPI;

  var CannonApp = VAPI.VeroldApp.extend({
    hengineReady: function() {
      var that = this;

      this.loadScene(this.defaultSceneID, {
        success_hierarchy: function(scene) {
          that.initializeCannon();
          that.defaultSceneLoaded(scene);

          that.defaultScene = scene;

          that.on('update', that.update, that);
          that.on('fixedUpdate', that.fixedUpdate, that);
        },

        progress: function(sceneObj) {
          that.defaultSceneProgress(sceneObj);
        }
      });
    },

    initializeCannon: function() {

    },

    fixedUpdate: function(/*delta*/) {

    },

    update: function(/*delta*/) {

    }
  });

  return CannonApp;
});
