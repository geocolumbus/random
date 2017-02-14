function distro(options) {

    // initialize
    var i,
        bin = [],
        binIndex = 0,
        max = -1e6 * options.size,
        min = 1e6 * options.size;

    for (i = 0; i < options.count; i++) {
        var r = Math.floor(randn_bm() * options.size);

        var found = false;
        $.each(bin, function (i, item) {
            if (item.index == r) {
                found = i;
                return false;
            }
        });

        if (found !== false) {
            bin[found].count++;
        } else {
            bin[binIndex++] = {
                index: r,
                count: 1
            };
        }
    }

    // Sort the bin
    bin.sort(function (a, b) {
        if (a.index > b.index) return 1;
        if (a.index < b.index) return -1;
        return 0;
    });

    // Set the max and min values
    $.each(bin, function (i, item) {
        max = item.index > max ? item.index : max;
        min = item.index < min ? item.index : min;
    });

    return {
        draw: function ($node) {
            var plotWidth = $node.width(),
                plotHeight = $node.height(),
                ctx = $node.get(0).getContext('2d'),
                horizontalScale = plotWidth / (max - min + 1);

            console.log('w', plotWidth, 'h', plotHeight);

            $.each(bin, function (i, item) {
                var x = Math.floor((item.index - min) * horizontalScale),
                    w = Math.floor(horizontalScale - 1),
                    y = plotHeight - item.count * 10,
                    h = item.count * 10;

                console.log(x, y, w, h);
                if (x<100) {
                    ctx.fillStyle="red";
                } else {
                    ctx.fillStyle="black";
                }
                //ctx.fillRect(x, y, w, h);
            });
        }
    };
}

// Standard Normal variate using Box-Muller transform.
function randn_bm() {
    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Initialize the canvas element
function init(options) {
    var $can = options.node;

    options.w && $can.width(options.w);
    options.h && $can.height(options.h);
    $can.css({
        'border': '1px solid lightgray'
    });

    console.log(options);
    var ctx = $can.get(0).getContext('2d');
    ctx.fillStyle="blue";
    ctx.fillRect(0,options.h-10,100,10);
}

var node = $('#mycan'),
    bin = distro({
        size: 5,
        count: 5
    });

init({
    node: node,
    w: 500,
    h: 200
});

bin.draw(node);