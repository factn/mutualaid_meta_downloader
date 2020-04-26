"use strict";
exports.__esModule = true;
var theme_1 = require("./theme");
exports.SERVICES = {
    food: {
        color: theme_1.COLORS.red
    },
    medicine: {
        color: theme_1.COLORS.blue
    },
    /**
     * Non food-or-medicine supplies
     */
    supplies: {
        color: theme_1.COLORS.green
    },
    mobility: {
        color: theme_1.COLORS.purple
    },
    manufacturing: {
        color: theme_1.COLORS.orange
    },
    financial: {
        color: theme_1.COLORS.orange
    },
    information: {
        color: theme_1.COLORS.orange
    },
    shelter: {
        color: theme_1.COLORS.orange
    },
    /**
     * Other types of support Support,
     * e.g. support tailored for specific groups like vulnerable people, people at
     * risk from domestic abuse etc...
     */
    support: {
        color: theme_1.COLORS.yellow
    },
    /**
     * Providing resources for networking (e.g. betwen mutual aid organizations)
     */
    network: {
        color: theme_1.COLORS.yellow
    }
};
exports.MARKER_TYPES = {
    'mutual-aid-group': {
        color: theme_1.COLORS.red
    },
    org: {
        color: theme_1.COLORS.blue
    },
    financial: {
        color: theme_1.COLORS.green
    },
    information: {
        color: theme_1.COLORS.purple
    },
    other: {
        color: theme_1.COLORS.orange
    }
};
exports.isMarkerType = function (type) {
    return type in exports.MARKER_TYPES;
};
exports.MARKER_TYPE_STRINGS = Object.keys(exports.MARKER_TYPES);
