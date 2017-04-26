define(function (require) {

    var echarts = require('echarts');

    function LeafletCoordSys(map, api) {
        this._map = map;
        this.dimensions = ['lat', 'lng'];
        this._mapOffset = [0, 0];

        this._api = api;

        //this._projection = new BMap.MercatorProjection();
    }

    LeafletCoordSys.prototype.dimensions = ['lat', 'lng'];

    LeafletCoordSys.prototype.setZoom = function (zoom) {
        this._zoom = zoom;
    };

    LeafletCoordSys.prototype.setCenter = function (center) {
        // this._center = this._projection.lngLatToPoint(new BMap.Point(center[0], center[1]));
        var ll = new L.latLng(center[1], center[0]);
        this._center = this._map.latLngToContainerPoint(ll);
    };

    LeafletCoordSys.prototype.setMapOffset = function (mapOffset) {
        this._mapOffset = mapOffset;
        console.log(mapOffset);
    };

    LeafletCoordSys.prototype.getMap = function () {
        return this._map;
    };

    LeafletCoordSys.prototype.dataToPoint = function (data) {
        var point = new L.latLng(data[1], data[0]);
        // TODO mercator projection is toooooooo slow
        // var mercatorPoint = this._projection.lngLatToPoint(point);

        // var width = this._api.getZr().getWidth();
        // var height = this._api.getZr().getHeight();
        // var divider = Math.pow(2, 18 - 10);
        // return [
        //     Math.round((mercatorPoint.x - this._center.x) / divider + width / 2),
        //     Math.round((this._center.y - mercatorPoint.y) / divider + height / 2)
        // ];
        var px = this._map.latLngToContainerPoint(point);
        var mapOffset = [0, 0]; //this._mapOffset;
        return [px.x - mapOffset[0], px.y - mapOffset[1]];
    };

    LeafletCoordSys.prototype.pointToData = function (pt) {
        var mapOffset = this._mapOffset;
        var pt = this._map.overlayPixelToPoint({
            x: pt[0] - mapOffset[0],
            y: pt[1] - mapOffset[1]
        });
        return [pt.lng, pt.lat];
    };

    LeafletCoordSys.prototype.getViewRect = function () {
        var api = this._api;
        return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
    };

    LeafletCoordSys.prototype.getRoamTransform = function () {
        return echarts.matrix.create();
    };

    // For deciding which dimensions to use when creating list data
    LeafletCoordSys.dimensions = LeafletCoordSys.prototype.dimensions;

    LeafletCoordSys.create = function (ecModel, api) {
        var coordSys;
        var root = api.getDom();

        // TODO Dispose
        ecModel.eachComponent('leaflet', function (mapModel) {
            var viewportRoot = api.getZr().painter.getViewportRoot();

            api.getZr().painter.getRenderedCanvas().style.border = "2px solid red";

            if (typeof L === 'undefined') {
                throw new Error('L api is not loaded');
            }
            //Overlay = Overlay || createOverlayCtor();
            if (coordSys) {
                throw new Error('Only one leaflet component can exist');
            }
            if (!mapModel.__map) {
                // Not support IE8
                var mapRoot = root.querySelector('.ec-extension-leaflet');
                if (mapRoot) {
                    // Reset viewport left and top, which will be changed
                    // in moving handler in BMapView
                    viewportRoot.style.left = '0px';
                    viewportRoot.style.top = '0px';
                    root.removeChild(mapRoot);
                }
                mapRoot = document.createElement('div');
                mapRoot.style.cssText = 'width:100%;height:100%';
                // Not support IE8
                mapRoot.classList.add('ec-extension-leaflet');
                root.appendChild(mapRoot);
                var map = mapModel.__map = new L.map(mapRoot, { attributionControl: false, zoomControl: false });

                var url = mapModel.get('tile.url');
                var subdomains = mapModel.get('tile.subdomains');

                if (url && subdomains) {
                    L.tileLayer(url, { subdomains: subdomains }).addTo(map);
                }

                viewportRoot.style.zIndex = 400;
                map.getPanes().overlayPane.appendChild(viewportRoot);
            }
            var map = mapModel.__map;

            // Set bmap options
            // centerAndZoom before layout and render
            var center = mapModel.get('center');
            var zoom = mapModel.get('zoom');
            if (center && zoom) {
                var pt = new L.latLng(center[1], center[0]);

                map.setView(pt, zoom);
            }

            coordSys = new LeafletCoordSys(map, api);
            coordSys.setMapOffset(mapModel.__mapOffset || [0, 0]);
            coordSys.setZoom(zoom);
            coordSys.setCenter(center);

            mapModel.coordinateSystem = coordSys;
        });

        ecModel.eachSeries(function (seriesModel) {
            if (seriesModel.get('coordinateSystem') === 'leaflet') {
                seriesModel.coordinateSystem = coordSys;
            }
        });
    };

    return LeafletCoordSys;
});
