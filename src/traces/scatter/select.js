/**
* Copyright 2012-2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/


'use strict';

var subtypes = require('./subtypes');

// function selectPoints(searchInfo, polygon, retainOtherSelectModesState) {
//     var cd = searchInfo.cd,
//         xa = searchInfo.xaxis,
//         ya = searchInfo.yaxis,
//         selection = [],
//         trace = cd[0].trace,
//         i,
//         di,
//         x,
//         y;
//
//     var hasOnlyLines = (!subtypes.hasMarkers(trace) && !subtypes.hasText(trace));
//     if(hasOnlyLines) return [];
//
//     if(polygon === false) { // clear selection
//         _clearSelection(cd);
//     }
//     else {
//         for(i = 0; i < cd.length; i++) {
//             di = cd[i];
//             x = xa.c2p(di.x);
//             y = ya.c2p(di.y);
//
//             if(polygon.contains([x, y])) {
//                 selection.push(_newSelectionItem(i, xa.c2d(di.x), ya.c2d(di.y)));
//                 di.selected = 1;
//                 di.selectedByPolygon = true;
//             } else {
//                 if(retainOtherSelectModesState && !di.selectedByPolygon && di.selected === 1) {
//                     continue;
//                 }
//                 di.selected = 0;
//                 delete di.selectedByPolygon;
//             }
//         }
//     }
//
//     return selection;
// }

// function selectPoint(calcData, hoverDataItem, retain) {
//     return _togglePointSelectedState(calcData, hoverDataItem, true, retain);
// }
//
// function deselectPoint(calcData, hoverDataItem, retain) {
//     return _togglePointSelectedState(calcData, hoverDataItem, false, retain);
// }

// function _togglePointSelectedState(calcData, hoverDataItem, selected, retain) {
//     var selection = [];
//     var selectedPointNumber = hoverDataItem.pointNumber;
//     var cdItem = calcData[selectedPointNumber];
//
//     if(!retain) _clearSelection(calcData);
//
//     if(selected) {
//         cdItem.selected = 1;
//     } else {
//         cdItem.selected = 0;
//     }
//
//     for(var i = 0; i < calcData.length; i++) {
//         cdItem = calcData[i];
//         if(cdItem.selected === 1) {
//             selection.push(_newSelectionItem(
//               i,
//               hoverDataItem.xaxis.c2d(cdItem.x),
//               hoverDataItem.yaxis.c2d(cdItem.y)));
//         }
//     }
//
//     return selection;
// }
function _togglePointSelectedState(searchInfo, pointIds, selected) {
    var selection = [];

    var calcData = searchInfo.cd,
        xAxis = searchInfo.xaxis,
        yAxis = searchInfo.yaxis;

    // TODO use foreach?!
    // Mutate state
    for(var j = 0; j < pointIds.length; j++) {
        var pointId = pointIds[j];
        calcData[pointId].selected = selected ? 1 : 0;
    }

    // Compute selection array from internal state
    for(var i = 0; i < calcData.length; i++) {
        if(calcData[i].selected === 1) {
            selection.push(_newSelectionItem(
              i,
              xAxis.c2d(calcData[i].x),
              yAxis.c2d(calcData[i].y)));
        }
    }

    return selection;
}

function _clearSelection(calcData) {
    for(var i = 0; i < calcData.length; i++) {
        calcData[i].selected = 0;
    }
}

// TODO May be needed in other trace types as well, so may centralize somewhere
function _newSelectionItem(pointNumber, xInData, yInData) {
    return {
        pointNumber: pointNumber,
        x: xInData,
        y: yInData
    };
}

function getPointsIn(searchInfo, polygon) {
    var pointsIn = [];

    var calcData = searchInfo.cd,
        xAxis = searchInfo.xaxis,
        yAxis = searchInfo.yaxis,
        i,
        x, y;

    for(i = 0; i < calcData.length; i++) {
        x = xAxis.c2p(calcData[i].x);
        y = yAxis.c2p(calcData[i].y);

        if(polygon.contains([x, y])) {
            pointsIn.push(i);
        }
    }

    return pointsIn;
}

function selectPoints(searchInfo, pointIds) {
    return _togglePointSelectedState(searchInfo, pointIds, true);
}

function deselectPoints(searchInfo, pointIds) {
    return _togglePointSelectedState(searchInfo, pointIds, false);
}

function clearSelection(searchInfo) {
    _clearSelection(searchInfo.cd);
}

module.exports = {
    // selectPoints: selectPoints,
    // selectPoint: selectPoint,
    // deselectPoint: deselectPoint,

    getPointsIn: getPointsIn,
    selectPoints: selectPoints,
    deselectPoints: deselectPoints,
    clearSelection: clearSelection
};
