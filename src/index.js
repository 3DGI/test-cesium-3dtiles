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
    selectionIndicator: true,
    geocoder: false,
    homeButton: false,
    infoBox: true,
    scene3DOnly: true,
    // navigationHelpButton: false,
    // https://cesium.com/blog/2018/01/24/cesium-scene-rendering-performance/#enabling-request-render-mode
    requestRenderMode: true,
});

var credit = new Credit('3D Tiles generated by <a href="https://3dgi.nl/" target="_blank">3DGI</a> for <a href="https://www.kadaster.nl/">the Dutch Kadaster</a>.');
viewer.scene.frameState.creditDisplay.addDefaultCredit(credit)

// viewer.scene.globe.depthTestAgainstTerrain = true;

// viewer.extend(viewerCesium3DTilesInspectorMixin);
// const inspectorViewModel = viewer.cesium3DTilesInspector.viewModel;

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

// --- Picking ---
// copied from: https://sandcastle.cesium.com/#c=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

let enablePicking = true;
const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

let tableHtmlScratch;
let materialsScratch;
let weightsScratch;
let i;

const highlighted = {
  feature: undefined,
  originalColor: new Color(),
};

const selected = {
  feature: undefined,
  originalColor: new Color(),
};

handler.setInputAction(function (movement) {
  if (enablePicking) {
    // If a feature was previously highlighted, undo the highlight
    if (defined(highlighted.feature)) {
      highlighted.feature.color = highlighted.originalColor;
      highlighted.feature = undefined;
    }

    const feature = viewer.scene.pick(movement.endPosition);
    const featurePicked = feature instanceof Cesium3DTileFeature;

    // const isTerrainFeature =
    //   featurePicked && feature.hasProperty("substrates");
    const isBuildingFeature =
      featurePicked && feature.hasProperty("bagpandid");

    if (isBuildingFeature) {
      // Highlight the feature if it's not already selected.
      if (feature !== selected.feature) {
        highlighted.feature = feature;
        Color.clone(feature.color, highlighted.originalColor);
        feature.color = Color.MAGENTA;
      }
    }
  }
}, ScreenSpaceEventType.MOUSE_MOVE);

handler.setInputAction(function (movement) {
  // If a feature was previously selected, undo the highlight
  if (defined(selected.feature)) {
    selected.feature.color = selected.originalColor;
    selected.feature = undefined;
  }

  const feature = viewer.scene.pick(movement.position);
  const featurePicked = feature instanceof Cesium3DTileFeature;
  const isBuildingFeature = featurePicked && feature.hasProperty("bagpandid");

  if (isBuildingFeature) {
    // Select the feature if it's not already selected
    if (selected.feature === feature) {
      return;
    }
    selected.feature = feature;

    // Save the selected feature's original color
    if (feature === highlighted.feature) {
      Color.clone(
        highlighted.originalColor,
        selected.originalColor
      );
      highlighted.feature = undefined;
    } else {
      Color.clone(feature.color, selected.originalColor);
    }
    feature.color = Color.LIME;

    tableHtmlScratch = "<table class='cesium-infoBox-defaultTable'>";
    tableHtmlScratch +=
      "<tr><th>Property Name</th><th>ID</th><th>Type</th><th>Value</th></tr><tbody>";
    const metadataClass =
      feature.content.batchTable._propertyTable.class;
    const propertyIds = feature.getPropertyIds();
    const length = propertyIds.length;
    for (let i = 0; i < length; ++i) {
      const propertyId = propertyIds[i];

      // Skip these properties, since they are always empty.
      if (
        propertyId === "APID" ||
        propertyId === "FACC" ||
        propertyId === "RWID"
      ) {
        continue;
      }

      const propertyValue = feature.getProperty(propertyId);
      const property = metadataClass.properties[propertyId];

      const propertyType = defaultValue(
        property.componentType,
        property.type
      );
      tableHtmlScratch += `<tr style='font-family: monospace;' title='${property.description}'><th>${property.name}</th><th><b>${property.id}</b></th><td>${propertyType}</td><td>${propertyValue}</td></tr>`;
    }
    tableHtmlScratch +=
      "<tr><th colspan='4'><i style='font-size:10px'>Hover on a row for description</i></th></tr></tbody></table>";
    viewer.selectedEntity.description = tableHtmlScratch;
  }
}, ScreenSpaceEventType.LEFT_CLICK);
