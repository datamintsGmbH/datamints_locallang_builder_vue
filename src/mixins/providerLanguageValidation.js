export default {
  data() {
    return {
      validTags: [],
      invalidTags: [],
      duplicateTags: [],
      tagValidationReasons: {}
    };
  },
  computed: {
    providerStatus() {
      return this.$store.getters.providerStatus;
    },
    providerDisplayName() {
      if (this.providerStatus && this.providerStatus.provider) {
        return this.providerStatus.provider;
      }

      return this.$store.getters.config.provider;
    },
    providerSupportedTargetLanguages() {
      return this.$store.getters.providerSupportedTargetLanguages;
    },
    hasProviderLanguageRestrictions() {
      return this.isAllowedProvider && this.providerSupportedTargetLanguages.length > 0;
    },
    normalizedLanguageKeys() {
      return this.languages.map((language) => this.normalizeLanguageCode(language.key));
    },
    selectedLanguagesAreValid() {
      if (!Array.isArray(this.newObjectLanguages)) {
        return true;
      }

      return this.newObjectLanguages.every(
        (languageCode) => this.getTagValidationReason(languageCode) === null
      );
    },
    providerInvalidTagText() {
      const invalidReasonTypes = this.invalidTags
        .map((tag) => this.tagValidationReasons[this.normalizeLanguageCode(tag)])
        .filter(Boolean);

      if (
        invalidReasonTypes.length > 0 &&
        invalidReasonTypes.every((reason) => reason === "provider-unsupported") &&
        this.providerDisplayName
      ) {
        return `Your provider ${this.providerDisplayName} does not support this language`;
      }

      if (
        invalidReasonTypes.includes("provider-unsupported") &&
        this.providerDisplayName
      ) {
        return `One or more language codes are invalid or not supported by ${this.providerDisplayName}`;
      }

      return "The entered language code was not found";
    }
  },
  methods: {
    normalizeLanguageCode(languageCode) {
      return String(languageCode || "").trim().toLowerCase();
    },
    isKnownLanguageCode(languageCode) {
      return this.normalizedLanguageKeys.includes(this.normalizeLanguageCode(languageCode));
    },
    isProviderSupportedLanguageCode(languageCode) {
      if (!this.hasProviderLanguageRestrictions) {
        return true;
      }

      return this.providerSupportedTargetLanguages.includes(
        this.normalizeLanguageCode(languageCode)
      );
    },
    getTagValidationReason(tag) {
      const normalizedTag = this.normalizeLanguageCode(tag);

      if (!this.isKnownLanguageCode(normalizedTag)) {
        return "unknown";
      }

      if (!this.isProviderSupportedLanguageCode(normalizedTag)) {
        return "provider-unsupported";
      }

      return null;
    },
    tagValidator(tag) {
      const normalizedTag = this.normalizeLanguageCode(tag);
      const validationReason = this.getTagValidationReason(normalizedTag);

      if (validationReason !== null) {
        this.$set(this.tagValidationReasons, normalizedTag, validationReason);
        return false;
      }

      this.$delete(this.tagValidationReasons, normalizedTag);
      return true;
    },
    onProviderTagState(valid, invalid, duplicate) {
      this.validTags = valid;
      this.invalidTags = invalid;
      this.duplicateTags = duplicate;

      const normalizedInvalidTags = invalid.map((tag) => this.normalizeLanguageCode(tag));
      Object.keys(this.tagValidationReasons).forEach((tag) => {
        if (!normalizedInvalidTags.includes(tag)) {
          this.$delete(this.tagValidationReasons, tag);
        }
      });
    }
  }
};
