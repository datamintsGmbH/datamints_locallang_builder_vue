/**
 * Store State
 */
import axios from "axios";
import * as utility from "../../scripts/Utility";
import * as proxy from "../../scripts/Proxy";
import packageJson from "../../../package.json";

const defaultConfig = {
  provider: "",
  gitUrl: "https://github.com/datamintsGmbH/datamints_locallang_builder",
  documentationUrl: "https://github.com/datamintsGmbH/datamints_locallang_builder",
  version: packageJson.version,
  allowedExtensions: "",
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
  config: resolveConfig(),
  providerStatus: null,
  providerStatusLoading: false
};

/**
 * Store Mutations
 */
const mutations = {
  SET_PROVIDER_STATUS_LOADING(state, isLoading) {
    state.providerStatusLoading = isLoading;
  },
  SET_PROVIDER_STATUS(state, providerStatus) {
    state.providerStatus = providerStatus;
  }
}

/**
 * Store Actions
 */
const actions = {
  async fetchProviderStatus({ commit, state }) {
    if (!state.config.provider) {
      commit("SET_PROVIDER_STATUS", null);
      return;
    }

    commit("SET_PROVIDER_STATUS_LOADING", true);

    try {
      const response = await axios.get(proxy.apiPath("api-provider-status"));
      commit("SET_PROVIDER_STATUS", response && response.data ? response.data.data : null);
    } catch (error) {
      commit("SET_PROVIDER_STATUS", {
        provider: state.config.provider,
        valid: null,
        quotaAvailable: false,
        supportedTargetLanguages: [],
        message: error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "The provider status could not be loaded.",
        quotaMessage: ""
      });
    } finally {
      commit("SET_PROVIDER_STATUS_LOADING", false);
    }
  }
}

/**
 * Store Getters
 */
const getters = {
  config: state => state.config,
  provider: state => state.config.provider,
  providerStatus: state => state.providerStatus,
  providerStatusLoading: state => state.providerStatusLoading,
  providerSupportedTargetLanguages: state =>
    state.providerStatus && Array.isArray(state.providerStatus.supportedTargetLanguages)
      ? state.providerStatus.supportedTargetLanguages
      : [],
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
