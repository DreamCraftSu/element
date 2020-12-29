import Vue from 'vue';
let isDragging = false;

export default function(element, options) {
  if (Vue.prototype.$isServer) return;

  // Touch
  element.addEventListener('touchstart', function(e) {
    if (isDragging) return;
    document.onselectstart = function() { return false; };
    document.ondragstart = function() { return false; };

    document.addEventListener('touchmove', touchMove);
    document.addEventListener('touchend', fouchUpFn);
    isDragging = true;

    if (options.start) {
      options.start(getMouseGenerated(e, 'mousedown'));
    }
  });

  const getMouseGenerated = (e, type) => {
    const touch = type === 'mouseup' ? e.changedTouches[0] : e.touches[0];

    return new MouseEvent(type, {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
  };

  const fouchUpFn = (e) => {
    document.removeEventListener('touchmove', touchMove);
    document.removeEventListener('touchend', fouchUpFn);

    isDragging = false;

    if (options.end) {
      options.end(getMouseGenerated(e, 'mouseup'));
    }
  };

  const touchMove = (e) => {
    if (options.drag) {
      options.drag(getMouseGenerated(e, 'mousemove'));
    }
  };

  // Mouse
  element.addEventListener('mousedown', function(event) {
    if (isDragging) return;
    document.onselectstart = function() { return false; };
    document.ondragstart = function() { return false; };

    document.addEventListener('mousemove', moveFn);
    document.addEventListener('mouseup', upFn);
    isDragging = true;

    if (options.start) {
      options.start(event);
    }
  });

  const moveFn = function(event) {
    if (options.drag) {
      options.drag(event);
    }
  };

  const upFn = function(event) {
    document.removeEventListener('mousemove', moveFn);
    document.removeEventListener('mouseup', upFn);
    document.onselectstart = null;
    document.ondragstart = null;

    isDragging = false;

    if (options.end) {
      options.end(event);
    }
  };
}
