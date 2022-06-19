const namePrefix = "Non-Fungible Coinbaes";
const description = "Adorable Non-Fungible Coinbae";
const baseUri = "PLACEHOLDER_URI";

const layerConfig = [
  {
    totalTokens: 10,
    layersOrder: [
      { name: "Background", options: { bypassDNA: true } },
      { name: "Body" },
      { name: "Head" },
      { name: "Face" },
    ],
  },
];

const shuffleLayerConfigurations = false;

const debugLogs = false;

const format = {
  width: 512,
  height: 512,
  smoothing: false,
};

const extraMetadata = {};

const rarityDelimiter = "#";

const uniqueDnaTorrance = 10000;

module.exports = {
  format,
  baseUri,
  description,
  uniqueDnaTorrance,
  layerConfig,
  rarityDelimiter,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  namePrefix,
};
