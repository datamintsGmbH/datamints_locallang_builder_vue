<template>

    <!-- After clicking on the button, a popover with a form appears -->
    <base-button class="" :id="addButtonId" v-b-tooltip.hover title="Add language-entry" variant="none">
        <flag-icon class="text-white" height="11px" width="11px"></flag-icon>
        <b-popover :target="addButtonId" triggers="focus">
            <template #title>Enter translation code</template>
            <b-input-group class="shadow">
                <b-input-group-prepend is-text>
                    <flag-icon class="text-dark" height="15px" width="15px"></flag-icon>
                </b-input-group-prepend>

                <b-form-input
                    id="input-add"
                    v-model="languageToAdd"
                    :state="state"
                    class="text-uppercase"
                    type="search"/>

                <template #append>
                    <b-button :disabled="!state" variant="success" @click="addLanguage">
                        <file-add-icon height="14px" width="14px"></file-add-icon>
                        Add
                    </b-button>
                </template>
            </b-input-group>
            <div class="py-3">
                <b-row>
                    <b-col cols="6">Auto-Translate</b-col>
                    <b-col cols="6">
                        <div class="text-right">
                            <base-switch v-if="isAllowedProvider" v-model="autoTranslate" name="autotranslate"/>
                            <div v-else class="text-danger">No translation provider defined</div>
                        </div>
                    </b-col>
                </b-row>
            </div>

            <provider-supported-languages
                :languages="providerSupportedLanguageRows"
                :provider-name="providerDisplayName"
            />
            <b-alert :show="selectionUnknownLanguage" variant="danger">
                The entered language code was not found
            </b-alert>
            <b-alert :show="selectionUnsupportedByProvider" variant="danger">
                Your provider {{ providerDisplayName }} does not support the language "{{ languageToAdd }}"
            </b-alert>
            <b-alert :show="selectionAlreadyExists" variant="danger">
                The entered language already exists
            </b-alert>
        </b-popover>
    </base-button>
</template>

<script>
import ProviderSupportedLanguages from "../ProviderSupportedLanguages.vue";
import providerLanguageValidation from "../../../mixins/providerLanguageValidation";

export default {
    name: "TranslationValueAdd",
    mixins: [providerLanguageValidation],
    components: {
        ProviderSupportedLanguages,
    },
    props: ["translation", "rerender", "identList", "defaultValue"],
    mounted() {
        // switch the flag to false, when there is no auto-translate provider configured
        if (!this.isAllowedProvider) {
            this.autoTranslate = false;
        }
    },
    computed: {
        /**
         * State for Validation if the value is found in language-store and its not already existing for this translation
         * @returns {string}
         */
        state() {
            if (this.languageToAdd.length === 0) return null;
            return this.languageValidationReason === null;
        },
        /**
         * Button-ID to avoid conflicts with other forms in the background
         * @returns {string}
         */
        addButtonId() {
            return "button-add-" + this.translation.uid;
        },
        /**
         * Path to an replacement-svg when the country-flag was not found
         * @returns {string}
         */
        errorPath() {
            return "/assets/svg/NA.svg";
        },
        /**
         * Checks if the selection already exists e.g. when "de" was found
         * @returns {boolean}
         */
        selectionAlreadyExists() {
            return this.languageValidationReason === "duplicate";
        },
        selectionUnknownLanguage() {
            return this.languageValidationReason === "unknown";
        },
        selectionUnsupportedByProvider() {
            return this.languageValidationReason === "provider-unsupported";
        },
        /**
         * Register of all valid languages
         * @returns {*}
         */
        languages() {
            return this.$store.getters.languages;
        },
        isAllowedProvider: function () {
            return this.$store.getters.config.provider.length > 0;
        },
        languageValidationReason() {
            const normalizedLanguageCode = this.normalizeLanguageCode(this.languageToAdd);
            if (normalizedLanguageCode.length === 0) {
                return null;
            }

            if (!this.isKnownLanguageCode(normalizedLanguageCode)) {
                return "unknown";
            }

            if (this.identListNormalized.includes(normalizedLanguageCode)) {
                return "duplicate";
            }

            if (!this.isProviderSupportedLanguageCode(normalizedLanguageCode)) {
                return "provider-unsupported";
            }

            return null;
        },
        identListNormalized() {
            return this.identList.map((ident) => this.normalizeLanguageCode(ident));
        },
    },
    data() {
        return {
            /**
             * current input of needed language key
             * @returns {string}
             */
            languageToAdd: "",
            /**
             * Flag, if the user wants to autotranslate
             * @returns {boolean}
             */
            autoTranslate: true,
        };
    },
    watch: {
        /**
         * modifies the input to lowercase
         * @param string newValue
         * @param string oldValue
         */
        languageToAdd(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.languageToAdd = this.normalizeLanguageCode(this.languageToAdd);
            }
        },
    },
    methods: {
        /**
         * Triggers API Call to add a translation-value
         */
        addLanguage() {
            this.$store
                .dispatch("addTranslationValue", {
                    uid: this.translation.uid,
                    data: JSON.stringify({
                        value: [this.languageToAdd],
                        autoTranslate: this.autoTranslate,
                        textToTranslate: this.defaultValue.value,
                    }),
                })
                .then(() => {
                    this.languageToAdd = "";
                    this.rerender(); // ugly: we have to rerender the translation component otherwise its not detecting the state-change. Don't know why :/
                });
        },
    },
};
</script>
