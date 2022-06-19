const basePath = process.cwd();
const fs = require("fs");
const { createCanvas, loadImage } = require(`${basePath}/node_modules/canvas`);
const buildDir = `${basePath}/build`;
const layersDir = `${basePath}/assets/layers`;
const {
  format,
  description,
  uniqueDnaTorrance,
  layerConfig,
  rarityDelimiter,
  debugLogs,
  extraMetadata,
  namePrefix,
} = require(`${basePath}/scripts/config.js`);
const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = format.smoothing;
var metadataList = [];
var preRevealMetadataList = [];
var attributesList = [];
var dnaList = new Set();
const DNA_DELIMITER = "-";
const PLACEHOLDER_URI = "PLACEHOLDER_URL";
let baseURI = "PLACEHOLDER_URL";

/*
 * Read IPFS URI from text file
 */
const readPreRevealURI = async () => {
  try {
    if (!fs.existsSync("assets/URI/preRevealImgURL.txt")) return;
    const data = await fs.readFileSync("build/URI/preRevealImgURI.txt", "utf8");
    baseURI = data;
  } catch (err) {
    throw err;
  }
};

/*
 * Save image by unique id
 */
const saveImage = (tokenId) => {
  fs.writeFileSync(
    `${buildDir}/images/${tokenId}.png`,
    canvas.toBuffer("image/png")
  );
};

/*
 * Remove existing build folder, create new
 */
const setup = () => {
  if (!fs.existsSync(`${buildDir}/images`)) {
    fs.mkdirSync(`${buildDir}`);
    fs.mkdirSync(`${buildDir}/images`);
  }
  if (fs.existsSync(`${buildDir}/images`)) {
    fs.rmdirSync(`${buildDir}/images`, { recursive: true });
  }
  fs.mkdirSync(`${buildDir}/images`);

  if (fs.existsSync(`${buildDir}/json`)) {
    fs.rmdirSync(`${buildDir}/json`, { recursive: true });
  }
  fs.mkdirSync(`${buildDir}/json`);

  if (fs.existsSync(`${buildDir}/preRevealJson`)) {
    fs.rmdirSync(`${buildDir}/preRevealJson`, { recursive: true });
  }
  fs.mkdirSync(`${buildDir}/preRevealJson`);
};

/*
 * Clean DNA string by removing optional query params
 */
const cleanDNA = (dna) => {
  const tempDNA = dna.replace(/(\?.*$)/, "");
  const cleanedDNA = Number(tempDNA.split(":").shift());
  return cleanedDNA;
};

/*
 * Load layer image
 */
const loadLayerImg = async (_layer) => {
  try {
    return new Promise(async (resolve) => {
      const image = await loadImage(`${_layer.selectedElement.path}`);
      resolve({ layer: _layer, loadedImage: image });
    });
  } catch (error) {
    console.error("Error loading image:", error);
  }
};

/**
 * In some cases a DNA string may contain optional query parameters for options
 * such as bypassing the DNA isUnique check, this function filters out those
 * items without modifying the stored DNA.
 *
 * @param {String} _dna New DNA string
 * @returns new DNA string with any items that should be filtered, removed.
 */
const filterDNAOptions = (_dna) => {
  const dnaItems = _dna.split(DNA_DELIMITER);
  const filteredDNA = dnaItems.filter((element) => {
    const query = /(\?.*$)/;
    const querystring = query.exec(element);
    if (!querystring) {
      return true;
    }
    const options = querystring[1].split("&").reduce((r, setting) => {
      const keyPairs = setting.split("=");
      return { ...r, [keyPairs[0]]: keyPairs[1] };
    }, []);

    return options.bypassDNA;
  });

  return filteredDNA.join(DNA_DELIMITER);
};

/*
 * Create Layer to DNA mapping
 */
const createLayerToDNA = (_dna = "", _layers = []) => {
  let mappedDnaToLayers = _layers.map((layer, index) => {
    let selectedElement = layer.elements.find(
      (e) => e.id == cleanDNA(_dna.split(DNA_DELIMITER)[index])
    );
    return {
      name: layer.name,
      selectedElement: selectedElement,
    };
  });
  return mappedDnaToLayers;
};

/*
 * Return rarity weight from layer filename
 */
const getRarityWeight = (layerName) => {
  const extension = layerName.slice(-3);
  if (extension !== "png" && extension !== "svg") {
    throw new Error("Layer file type must be either png or svg");
  }
  const filename = layerName.slice(0, -4);
  const weight = Number(filename.split(rarityDelimiter).pop());
  return isNaN(weight) ? 1 : weight;
};

/*
 * Check if DNA is unique in given list
 */
const isDnaUnique = (_DnaList = new Set(), _dna = "") => {
  const _filteredDNA = filterDNAOptions(_dna);
  return !_DnaList.has(_filteredDNA);
};

/*
 * Create new DNA
 */
const createDna = (_layers) => {
  let randNum = [];
  _layers.forEach((layer) => {
    var totalWeight = 0;
    layer.elements.forEach((element) => {
      totalWeight += element.weight;
    });
    // number between 0 - totalWeight
    let random = Math.floor(Math.random() * totalWeight);
    for (var i = 0; i < layer.elements.length; i++) {
      // subtract the current weight from the random weight until we reach a sub zero value.
      random -= layer.elements[i].weight;
      if (random < 0) {
        return randNum.push(
          `${layer.elements[i].id}:${layer.elements[i].filename}${
            layer.bypassDNA ? "?bypassDNA=true" : ""
          }`
        );
      }
    }
  });
  return randNum.join(DNA_DELIMITER);
};

/*
 * Add metadata to list
 */
const addMetadata = async (_dna, tokenId) => {
  let preRevealMetadata = {
    name: `${namePrefix} #${tokenId}`,
    description: description,
    image_url: `${baseURI}`,
    tokenId: tokenId,
    ...extraMetadata,
    attributes: [
      {
        trait_type: "Status",
        value: "Pre-Reveal",
      },
    ],
  };
  preRevealMetadataList.push(preRevealMetadata);

  let metadata = {
    name: `${namePrefix} #${tokenId}`,
    description: description,
    image_url: `${PLACEHOLDER_URI}`,
    tokenId: tokenId,
    ...extraMetadata,
    attributes: attributesList,
  };
  attributesList = [];
  metadataList.push(metadata);
};

/*
 * Add attributes to list
 */
const addAttributes = (_element) => {
  let selectedElement = _element.layer.selectedElement;
  attributesList.push({
    trait_type: _element.layer.name,
    value: selectedElement.name,
  });
};

/*
 * Create single metadata file
 */
const saveMetaDataSingleFile = (tokenId) => {
  let metadata = metadataList.find((meta) => meta.tokenId == tokenId);
  debugLogs
    ? console.log(
        `Writing pre-reveal metadata for ${tokenId}: ${JSON.stringify(
          metadata
        )}`
      )
    : null;
  fs.writeFileSync(
    `${buildDir}/json/${tokenId}.json`,
    JSON.stringify(metadata, null, 2)
  );

  let preRevealMetadata = preRevealMetadataList.find(
    (meta) => meta.tokenId == tokenId
  );
  debugLogs
    ? console.log(
        `Writing pre-reveal metadata for ${tokenId}: ${JSON.stringify(
          preRevealMetadata
        )}`
      )
    : null;
  fs.writeFileSync(
    `${buildDir}/preRevealJson/${tokenId}.json`,
    JSON.stringify(preRevealMetadata, null, 2)
  );
};

/*
 * Given layer filename, only return name of layer
 */
const cleanName = (filename) => {
  let filenameWithoutExtension = filename.slice(0, -4);
  const layerName = filenameWithoutExtension.split(rarityDelimiter).shift();
  return layerName;
};

/*
 * Return layer characteristics from asset files as array of objects
 */
const getElements = (path) => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((layerName, index) => {
      if (layerName.includes("-")) {
        throw new Error(
          `layer name can not contain dashes, please fix: ${layerName}`
        );
      }
      return {
        id: index,
        name: cleanName(layerName),
        filename: layerName,
        path: `${path}${layerName}`,
        weight: getRarityWeight(layerName),
      };
    });
};

/*
 * Return layers as objects with options
 */
const layersSetup = (layersOrder) => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    elements: getElements(`${layersDir}/${layerObj.name}/`),
    name:
      layerObj.options?.["displayName"] != undefined
        ? layerObj.options?.["displayName"]
        : layerObj.name,
    bypassDNA:
      layerObj.options?.["bypassDNA"] !== undefined
        ? layerObj.options?.["bypassDNA"]
        : false,
  }));
  return layers;
};

/*
 * Draw image with canvas
 */
const drawElement = (_renderObject, _index, _layersLen) => {
  ctx.globalAlpha = _renderObject.layer.opacity;
  ctx.globalCompositeOperation = _renderObject.layer.blend;
  ctx.drawImage(_renderObject.loadedImage, 0, 0, format.width, format.height);
};

/*
 * Generate images and metadata files without image URL
 */
const initializeMetadata = async () => {
  let failedCount = 0;
  let tokenIndices = [];

  for (let i = 1; i <= layerConfig[layerConfig.length - 1].totalTokens; i++) {
    tokenIndices.push(i);
  }

  // loop through layer config items
  for (let i = 0; i < layerConfig.length; i++) {
    const layers = layersSetup(layerConfig[i].layersOrder);
    // loop through each tokenId
    for (let tokenId = 1; tokenId <= layerConfig[i].totalTokens; tokenId++) {
      let newDna = createDna(layers);
      if (isDnaUnique(dnaList, newDna)) {
        let results = createLayerToDNA(newDna, layers);
        let loadedElements = [];

        results.forEach((layer) => {
          loadedElements.push(loadLayerImg(layer));
        });

        await Promise.all(loadedElements).then((renderObjectArray) => {
          debugLogs ? console.log("Clearing canvas") : null;

          ctx.clearRect(0, 0, format.width, format.height);
          renderObjectArray.forEach((renderObject, index) => {
            drawElement(renderObject, index, layerConfig[i].layersOrder.length);
            addAttributes(renderObject);
          });

          debugLogs
            ? console.log("Tokens left to create: ", tokenIndices)
            : null;

          saveImage(tokenIndices[0]);
          addMetadata(newDna, tokenIndices[0]);
          saveMetaDataSingleFile(tokenIndices[0]);

          console.log(`Created metadata for token: ${tokenIndices[0]}`);
        });

        dnaList.add(filterDNAOptions(newDna));
        tokenIndices.shift();
      } else {
        console.log("DNA exists!");
        failedCount++;
        if (failedCount >= uniqueDnaTorrance) {
          console.log(
            `You need more layers or elements to grow your edition to ${layerConfig[i].totalTokens} artworks!`
          );
          process.exit();
        }
      }
    }
  }
};

setup();
readPreRevealURI();
initializeMetadata();
