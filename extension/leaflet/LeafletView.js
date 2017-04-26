define(function (require) {

    return require('echarts').extendComponentView({
        type: 'leaflet',

        render: function (mapModel, ecModel, api) {
            var rendering = true;

            var map = mapModel.getMap();
            var viewportRoot = api.getZr().painter.getViewportRoot();
            var coordSys = mapModel.coordinateSystem;
            var moveHandler = function (type, target) {
                if (rendering) {
                    return;
                }

                var e = map._getMapPanePos();

                var mapOffset = [
                    -parseInt(e.x) || 0,
                    -parseInt(e.y) || 0
                ];
                viewportRoot.style.left = mapOffset[0] + 'px';
                viewportRoot.style.top = mapOffset[1] + 'px';

                coordSys.setMapOffset(mapOffset);
                mapModel.__mapOffset = mapOffset;

                api.dispatchAction({
                    type: 'leafletRoam'
                });
            };

            function zoomEndHandler() {
                if (rendering) {
                    return;
                }
                api.dispatchAction({
                    type: 'leafletRoam'
                });
            }

            map.removeEventListener('move', this._oldMoveHandler);
            map.removeEventListener('zoomend', this._oldZoomEndHandler);

            map.addEventListener('move', moveHandler);
            map.addEventListener('zoomend', zoomEndHandler);

            this._oldMoveHandler = moveHandler;
            this._oldZoomEndHandler = zoomEndHandler;

            rendering = false;
        }
    });
});
