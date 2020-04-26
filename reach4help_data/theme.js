"use strict";
exports.__esModule = true;
var BRAND_COLORS = {
    background: '#FFFFFF',
    backgroundDark: '#f6e6f5',
    primary: '#a12596',
    primaryLight: '#d957cd',
    primaryDark: '#811e78',
    secondary: '#ffa32a',
    secondaryLight: '#ffcb52',
    secondaryDark: '#ff7b02'
};
exports.COLORS = {
    brand: BRAND_COLORS,
    grayDark: '#333',
    gray: '#666',
    grayLight: '#888',
    grayLight1: '#cf7dc9',
    grayLight2: '#da9ad6',
    grayLight3: '#edceeb',
    grayLight4: '#f6e6f5',
    grayLight5: '#fbf4fa',
    red: '#ea4335',
    orange: BRAND_COLORS.secondary,
    blue: '#4285f4',
    blueDark: '#2b63c1',
    purple: BRAND_COLORS.primary,
    purpleDark: BRAND_COLORS.primaryDark,
    purpleLight: BRAND_COLORS.primaryLight,
    green: '#0F9D58',
    yellow: '#F4B400'
};
exports.THEME = {
    spacingPx: 15,
    bg: exports.COLORS.grayLight4,
    borderLight: "1px solid " + exports.COLORS.grayLight3,
    textColor: exports.COLORS.brand.primaryDark,
    textColorLight: exports.COLORS.brand.primaryLight,
    secondaryTextColor: exports.COLORS.brand.secondaryDark,
    secondaryTextColorLight: exports.COLORS.brand.secondary,
    textLinkColor: exports.COLORS.purpleLight,
    textLinkHoverColor: exports.COLORS.purple,
    colors: exports.COLORS
};
