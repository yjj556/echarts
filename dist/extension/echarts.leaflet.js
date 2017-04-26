(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("echarts"));
	else if(typeof define === 'function' && define.amd)
		define(["echarts"], factory);
	else if(typeof exports === 'object')
		exports["echarts.leaflet"] = factory(require("echarts"));
	else
		root["echarts"] = root["echarts"] || {}, root["echarts"]["echarts.leaflet"] = factory(root["echarts"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Leaflet component extension
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    __webpack_require__(1).registerCoordinateSystem(
	        'leaflet', __webpack_require__(8)
	    );
	    __webpack_require__(9);
	    __webpack_require__(10);

	    // Action
	    __webpack_require__(1).registerAction({
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
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var echarts = __webpack_require__(1);

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
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    function v2Equal(a, b) {
	        return a && b && a[0] === b[0] && a[1] === b[1];
	    }

	    return __webpack_require__(1).extendComponentModel({
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
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    return __webpack_require__(1).extendComponentView({
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
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ])
});
;