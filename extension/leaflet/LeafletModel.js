define(function (require) {

    function v2Equal(a, b) {
        return a && b && a[0] === b[0] && a[1] === b[1];
    }

    return require('echarts').extendComponentModel({
        type: 'leaflet',

        getMap: function () {
            // __map is injected when creating LeafletCoordSys
            return this.__map;
        },

        getOffset: function() {
            if (this.coordinateSystem) {
                return this.coordinateSystem._mapOffset;
            }

            return [0, 0];
        },

        setCenterAndZoom: function (center, zoom) {
            this.option.center = center;
            this.option.zoom = zoom;
        },

        centerOrZoomChanged: function (center, zoom) {
            var option = this.option;
            return !(v2Equal(center, option.center) && zoom === option.zoom);
        },

        defaultOption: {

            center: [104.114129, 37.550339],

            zoom: 4
        }
    });
});
