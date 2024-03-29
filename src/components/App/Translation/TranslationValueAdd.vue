<template>
    <span class="pr-1">

        <!-- After clicking on the button, a popover with a form appears -->
        <base-button :id="addButtonId" v-b-tooltip.hover size="sm" title="Add language-entry" variant="dark">
            <flag-icon class="text-white" height="11px" width="11px"></flag-icon>
        </base-button>
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

            <b-alert show variant="info">
                Find a list of available codes
                <a href="https://docs.microsoft.com/en-us/azure/cognitive-services/translator/language-support" target="_blank">here</a>
            </b-alert>
            <b-alert :show="selectionAlreadyExists" variant="danger">
                The entered language already exists
            </b-alert>
        </b-popover>

    </span>
</template>

<script>
export default {
    name: "TranslationValueAdd",
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
            return (
                this.languages.filter((language) => language.key === this.languageToAdd).length > 0 && this.identList.indexOf(this.languageToAdd) === -1
            );
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
            return this.identList.indexOf(this.languageToAdd) > -1;
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
                this.languageToAdd = this.languageToAdd.toLowerCase();
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
