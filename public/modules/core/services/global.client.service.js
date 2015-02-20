'use strict';

angular.module('core').service('Global', function () {
    this.Data = {
        showCarousel: 'false'
    };
    this.getAll = function () {
        return this.Data;
    };
    this.setShowCarousel = function (val) {
        this.Data.showCarousel = val;
    };
});