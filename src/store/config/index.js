/**
 * Store State
 */
import * as utility from "../../scripts/Utility";
import packageJson from "../../../package.json";

const defaultConfig = {
  provider: "",
  gitUrl: "https://github.com/datamintsGmbH/datamints_locallang_builder",
  documentationUrl: "https://github.com/datamintsGmbH/datamints_locallang_builder",
  version: packageJson.version,
  excludedExtensions: "",
  languageSvgTemplate: ""
};

const resolveConfig = () => {
  const rawConfig = utility.metaAttribute("config");

  if (!rawConfig) {
    console.warn("No TYPO3 runtime config was found. Falling back to standalone defaults.");
    return {...defaultConfig};
  }

  try {
    const parsedConfig = JSON.parse(rawConfig);

    if (parsedConfig && typeof parsedConfig === "object") {
      return {
        ...defaultConfig,
        languageSvgTemplate:
          utility.metaAttribute("language-svg-template") || defaultConfig.languageSvgTemplate,
        ...parsedConfig
      };
    }
  } catch (error) {
    console.warn("Could not parse TYPO3 runtime config. Falling back to standalone defaults.", error);
  }

  return {
    ...defaultConfig,
    languageSvgTemplate:
      utility.metaAttribute("language-svg-template") || defaultConfig.languageSvgTemplate
  };
};

const state = {
  config: resolveConfig()
};

/**
 * Store Mutations
 */
const mutations = {}

/**
 * Store Actions
 */
const actions = {}

/**
 * Store Getters
 */
const getters = {
  config: state => state.config,
  provider: state => state.config.provider,
}

/**
 * Combined Object for vuex
 */
const configModule = {
  state,
  mutations,
  actions,
  getters
}


export default configModule;
