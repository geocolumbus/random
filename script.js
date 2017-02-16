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
                horizontalScale = plotWidth / (max - min + 1),
                verticalScale,
                maxCount=0;


            $.each(bin, function (i, item){
                maxCount = item.count > maxCount ? item.count: maxCount;
            });
            verticalScale = plotHeight/maxCount;

            $.each(bin, function (i, item) {
                var x = Math.floor((item.index - min) * horizontalScale),
                    w = Math.floor(horizontalScale - 1),
                    y = plotHeight - item.count * verticalScale,
                    h = item.count * verticalScale;

                ctx.fillRect(x, y, w, h);
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

    options.w && $can.attr('width',options.w);
    options.w && $can.attr('height',options.h);

    $can.css({
        'border': '1px solid lightgray'
    });
}

var node = $('#mycan'),
    bin = distro({
        size: 5,
        count: 50000
    });

init({
    node: node,
    w: 500,
    h: 200
});

bin.draw(node);