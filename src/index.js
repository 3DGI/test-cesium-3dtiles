import {
    Viewer, Cesium3DTileset, Cesium3DTileStyle, createWorldTerrain, Cartesian3, Math,
    viewerCesium3DTilesInspectorMixin, HeadingPitchRange, Credit,
    Color, Entity, ScreenSpaceEventType, PostProcessStageLibrary, defined, defaultValue,
    ScreenSpaceEventHandler, Cesium3DTileFeature
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "../src/css/main.css"
import Logo3dgi  from "../src/img/logo-3dgi.png"

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Viewer('cesiumContainer', {
    // terrainProvider: createWorldTerrain(),
    shadows: false,
    timeline: false,
    animation: false,
    baseLayerPicker: false,
    sceneModePicker: false,
    selectionIndicator: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    scene3DOnly: true,
    // navigationHelpButton: false,
    // https://cesium.com/blog/2018/01/24/cesium-scene-rendering-performance/#enabling-request-render-mode
    requestRenderMode: true,
});

var credit = new Credit('3D Tiles generated by <a href="https://3dgi.nl/" target="_blank">3DGI</a> for <a href="https://www.kadaster.nl/">the Dutch Kadaster</a>.');
viewer.scene.frameState.creditDisplay.addDefaultCredit(credit)

// viewer.scene.globe.depthTestAgainstTerrain = true;

viewer.extend(viewerCesium3DTilesInspectorMixin);
const inspectorViewModel = viewer.cesium3DTilesInspector.viewModel;

const tileset_buildings = viewer.scene.primitives.add(new Cesium3DTileset({
    url: 'http://localhost:8003/3dtiles/tileset.json',
    // url: 'https://data.3dgi.xyz/3dtiles-test-data/tilesets/buildings/tileset.json',
    enableDebugWireframe: false,
    debugShowBoundingVolume: false,
    debugShowContentBoundingVolume: false,
}));

// const tileset_terrain = viewer.scene.primitives.add(new Cesium3DTileset({
//     url: 'http://localhost:8004/3dtiles/tileset.json',
//     // url: 'https://data.3dgi.xyz/3dtiles-test-data/tilesets/terrain/tileset.json',
//     enableDebugWireframe: false,
//     debugShowBoundingVolume: false,
//     debugShowContentBoundingVolume: false,
// }));

// Set the camera view to Den Haag.
viewer.camera.setView({
    destination : Cartesian3.fromDegrees(4.267588, 52.062515, 1000),
    orientation: {
        heading : Math.toRadians(0.0), // east, default value is 0.0 (north)
        pitch : Math.toRadians(-36),    // default value (looking down)
        roll : 0.0                             // default value
    }
});

// Create an HTML element that will serve as the
// tooltip that displays the feature information
function createTooltip() {
  const tooltip = document.createElement("div");
  viewer.container.appendChild(tooltip);
  tooltip.style.backgroundColor = "black";
  tooltip.style.color = "white";
  tooltip.style.position = "absolute";
  tooltip.style.left = "0";
  tooltip.style.top = "0";
  tooltip.style.padding = "14px";
  tooltip.style["pointer-events"] = "none";
  tooltip.style["block-size"] = "fit-content";
  return tooltip;
}
const tooltip = createTooltip();

// Show the given HTML content in the tooltip
// at the given screen position
function showTooltip(screenX, screenY, htmlContent) {
  tooltip.style.display = "block";
  tooltip.style.left = `${screenX}px`;
  tooltip.style.top = `${screenY}px`;
  tooltip.innerHTML = htmlContent;
}

// Create an HTML string that contains information
// about the given feature, under the given title
function createFeatureHtml(title, feature) {
  if (!defined(feature)) {
    return `(No ${title})<br>`;
  }
  const propertyKeys = feature.getPropertyIds();
  if (!defined(propertyKeys)) {
    return `(No properties for ${title})<br>`;
  }
  let html = `<b>${title}:</b><br>`;
  for (let i = 0; i < propertyKeys.length; i++) {
    const propertyKey = propertyKeys[i];
    const propertyValue = feature.getProperty(propertyKey);
    html += `&nbsp;&nbsp;${propertyKey} : ${propertyValue}<br>`;
  }
  return html;
}

// Given an object that was obtained via Scene#pick: If it is
// a Cesium3DTileFeature, then it is returned.
// Otherwise, 'undefined' is returned.
function obtainFeature(picked) {
  if (!defined(picked)) {
    return undefined;
  }
  const isFeature = picked instanceof Cesium3DTileFeature;
  if (!isFeature) {
    return undefined;
  }
  return picked;
}



// Install the handler that will perform picking when the
// mouse is moved, and update the label entity when the
// mouse is over a Cesium3DTileFeature
const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (movement) {
  let tooltipText = "";
  const picked = viewer.scene.pick(movement.endPosition);

  const feature = obtainFeature(picked);
  tooltipText += createFeatureHtml("Feature", feature);

  const screenX = movement.endPosition.x;
  const screenY = movement.endPosition.y;
  showTooltip(screenX, screenY, tooltipText);
}, ScreenSpaceEventType.MOUSE_MOVE);

tileset_buildings.readyPromise.then(function () {
    viewer.zoomTo(
        tileset_buildings,
        new HeadingPitchRange(
            0.0,
            -0.5,
            400
            // tileset.boundingSphere.radius / 4.0
        )
    );
});