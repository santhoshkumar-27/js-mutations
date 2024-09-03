(function (win) {
    'use strict';

    var listeners = [],
        doc = win.document,
        MutationObserver = win.MutationObserver || win.WebKitMutationObserver,
        observer;

    function ready(selector, fn) {
        // Store the selector and callback to be monitored
        listeners.push({
            selector: selector,
            fn: fn
        });
        if (!observer) {
            // Watch for changes in the document
            observer = new MutationObserver(check);
            observer.observe(doc.documentElement, {
                childList: true,
                subtree: true
            });
        }
        // Check if the element is currently in the DOM
        check();
    }

    function check() {
        // Check the DOM for elements matching a stored selector
        for (var i = 0, len = listeners.length, listener, elements; i < len; i++) {
            listener = listeners[i];
            // Query for elements matching the specified selector
            elements = doc.querySelectorAll(listener.selector);
            for (var j = 0, jLen = elements.length, element; j < jLen; j++) {
                element = elements[j];
                if (!element.ready) {
                    element.ready = [];
                }
                // Make sure the callback isn't invoked with the
                // same listener more than once
                // due to other mutations
                if (!element.ready[i]) {
                    element.ready[i] = true;
                    // Invoke the callback with the element
                    listener.fn.call(element, element);
                }
            }
        }
    }

    // Expose 'ready'
    win.wrapperForMutationObservor = ready;

})(this);


window.wrapperForMutationObservor('.selector', function (ele) {
    callback(ele);
});

// wait until functions
function waitUntil(predicate, success, error) {
    var int = setInterval(function () {
        if (predicate()) {
            clearInterval(int);
            int = null;
            success();
        }
    }, 50);

    setTimeout(function () {
        if (int !== null) {
            clearInterval(int);
            if (typeof (error) === 'function') {
                error();
            }
        }
    }, 20000);
}



waitUntil(() => {
    return typeof window.Jquery === 'function'
}, () => {
    console.log('data is ready')
}, () => {
    console.log('data is failure')
})


// wait until functions now return as promise
function waitUntil(predicate) {
    return new Promise((resolve, reject) => {
        var int = setInterval(function () {
            if (predicate()) {
                clearInterval(int);
                int = null;
                resolve();
            }
        }, 50);

        setTimeout(function () {
            if (int !== null) {
                clearInterval(int);
                reject();
            }
        }, 20000);
    })

}
