/**
 * Leaflet component extension
 */
define(function (require) {

    require('echarts').registerCoordinateSystem(
        'leaflet', require('./LeafletCoordSys')
    );
    require('./LeafletModel');
    require('./LeafletView');

    // Action
    require('echarts').registerAction({
        type: 'leafletRoam',
        event: 'leafletRoam',
        update: 'updateLayout'
    }, function (payload, ecModel) {
        // ecModel.eachComponent('leaflet', function (mapModel) {
        //     var map = mapModel.getMap();
        //     var center = map.getCenter();
        //     mapModel.setCenterAndZoom([center.lng, center.lat], map.getZoom());
        // });
    });

    return {
        version: '1.0.0'
    };
});
