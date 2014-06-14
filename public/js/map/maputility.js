// JavaScript inheritance helper function
function extend(B, A) {
    function I() {}
    I.prototype = A.prototype;
    B.prototype = new I();
    B.prototype.constructor = B;
}

var COLOR = "#2dcff185"