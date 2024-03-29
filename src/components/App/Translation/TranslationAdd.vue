<template>
    <base-button size="sm"
                 type="secondary"
                 @click="showModal"
    >
        <b-icon aria-hidden="true" icon="plus"></b-icon>
        New key
        <b-modal
            :id="modalId"
            v-model="modalActive"
            :hide-footer="showOverlay"
            cancel-variant="light"
            size="xl"
            title="Add new key"
            @ok="handleOk"
        >
            <b-overlay :show="showOverlay" rounded="sm">
                <b-row>
                    <b-col>
                        <p>
                            Append another key to the file
                            <strong>{{ locallang.filename }}</strong>
                        </p>
                        <hr/>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col lg="8">
                        <b-card header="Required fields" header-class="font-weight-bold" header-text-variant="primary">
                            <b-form ref="form" :validated="formIsValid" novalidate @submit.stop.prevent="handleSubmit">
                                <!-- Input: Key name -->
                                <b-form-group label="Enter key name">
                                    <b-form-input
                                        v-model="newObjectKey"
                                        :state="keyIsValid"
                                        placeholder="Enter something..."
                                        required
                                        trim
                                    ></b-form-input>
                                    <b-form-invalid-feedback id="input-live-feedback">
                                        The entered key is not valid or already existing
                                    </b-form-invalid-feedback>
                                </b-form-group>
                                <!-- Input: Default Translation -->
                                <b-form-group label="Enter default value for language 'EN'">
                                    <b-form-textarea
                                        v-model="newObjectValue"
                                        :state="valueIsValid"
                                        max-rows="10"
                                        placeholder="Enter something..."
                                        required
                                        rows="3"
                                        spellcheck="false"
                                    ></b-form-textarea>
                                    <b-form-invalid-feedback>
                                        No value given
                                    </b-form-invalid-feedback>
                                </b-form-group>


                            </b-form>
                        </b-card>
                        <b-card>
                            <template #header>
                                <translation-symbols-icon class="pr-2" height="18px" width="18px"></translation-symbols-icon>
                                <span class="text-primary font-weight-bold">Other languages</span>
                            </template>
                            <b-row>
                                <b-col>
                                    <b-input-group class="pb-4" prepend="Languages to add">

                                        <b-form-tags
                                            v-model="newObjectLanguages"
                                            :state="tagsAreValid"
                                            :tag-validator="tagValidator"
                                            input-id="tags-separators"
                                            invalidTagText="The entered language code was not found"
                                            placeholder="Separate by space, comma or semicolon (e.g. de,es,ru)"
                                            remove-on-delete
                                            separator=" ,;"
                                            tag-variant="primary"
                                            @tag-state="onTagState"
                                        >
                                        </b-form-tags>
                                        <!-- Quick Select -->
                                        <b-input-group-append v-if="hasAtLeastOneLanguageInUse">
                                            <b-button
                                                :id="addCurrentLanguagesButtonId"
                                                variant="outline-primary"
                                            >
                                                <b-icon icon="plus"></b-icon
                                                >
                                            </b-button>
                                            <b-popover
                                                :target="addCurrentLanguagesButtonId"
                                                triggers="focus"
                                            >
                                                <template #title>
                                                    <a
                                                        v-b-tooltip.hover
                                                        href="#"
                                                        title="List of current active languages in this locallang-file"
                                                    >
                                                        Quick-Select:
                                                    </a>
                                                </template>
                                                <!-- Country-List for Quick-Select -->
                                                <b-list-group>
                                                    <!-- Append all languages -->
                                                    <b-list-group-item
                                                        class="p-1 w-100 text-left"
                                                        href="#"
                                                        @click="appendLanguage()"
                                                    >
                                                        <b-button class="m-2 w-100 text-left" size="sm" variant="primary"
                                                        >All
                                                        </b-button>
                                                        <span></span>
                                                    </b-list-group-item>
                                                    <!-- List of all appendable languages -->
                                                    <b-list-group-item
                                                        v-for="(language, key) in languagesInUse()"
                                                        :key="key"
                                                        class="p-1"
                                                        href="#"
                                                        @click="appendLanguage(language)"
                                                    >
                                                        <b-button class="m-2 w-100 text-left" size="sm" variant="primary"
                                                        ><img
                                                            :src="getLanguageIcon(language)"
                                                            class="flag-svg"
                                                        /> {{ getLanguageNameByKey(language) }}
                                                        </b-button>


                                                    </b-list-group-item>
                                                </b-list-group>
                                            </b-popover>
                                        </b-input-group-append>
                                    </b-input-group>
                                    <b-alert class="p-2" show size="sm" variant="info">
                                        <span class="alert-icon pl-2"><translation-symbols-icon height="18px" width="18px"></translation-symbols-icon></span>

                                        Find a list of available codes
                                        <a href="https://docs.microsoft.com/en-us/azure/cognitive-services/translator/language-support" target="_blank">here</a>.


                                    </b-alert>
                                    <b-alert class="p-2" show size="sm" variant="warning">
                                        <span class="alert-icon pl-2"><translation-symbols-icon height="18px" width="18px"></translation-symbols-icon></span>
                                        The English data record is created automatically and cannot be taken into account.
                                    </b-alert>
                                </b-col>
                            </b-row>
                        </b-card>
                    </b-col>
                    <b-col lg="4">
                        <b-card>
                            <template #header>
                                <settings-gear-icon class="pr-2" height="23px" width="23px"></settings-gear-icon>
                                <span class="text-primary font-weight-bold">Options</span>
                            </template>
                            <b-row>
                                <b-col cols="6">
                                    <b-form-group label="Auto-Translate">
                                        <base-switch v-if="isAllowedProvider" v-model="newObjectAutoTranslate" name="autotranslate"/>
                                        <div v-else class="text-danger">No translation provider defined</div>

                                    </b-form-group>
                                </b-col>
                                <b-col cols="6">
                                    <b-form-group label="Is approved">
                                        <base-switch v-model="newObjectIsApproved" name="isapproved"/>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="6">
                                    <b-form-group label="XML-Space">
                                        <b-form-select v-model="newObjectXmlSpace" :options="xmlSpaceOptions" size="sm"></b-form-select>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </b-card>
                    </b-col>
                </b-row>
            </b-overlay>
        </b-modal>
    </base-button>
    <!-- Modal -->

</template>

<script>
import * as utility from "../../../scripts/Utility";

export default {
    name: "TranslationAdd",
    props: ["locallang", "languagesInUse", "rerender"],
    mounted() {
        // switch the flag to false, when there is no auto-translate provider configured
        if (!this.isAllowedProvider) {
            this.newObjectAutoTranslate = false;
        }
    },
    computed: {
        languages() {
            return this.$store.getters.languages;
        },
        customLanguagesAmount() {
            return this.newObjectLanguages.length;
        },
        isAllowedProvider: function () {
            return this.$store.getters.config.provider.length > 0;
        },
        /**
         * For form-validation display
         */
        keyIsValid() {
            if (!this.showFormValidation) return null;
            if (this.newObjectKey.length === 0) {
                return false;
            }
            return (
                this.locallang.translationsArray.filter(
                    (translation) => translation.key === this.newObjectKey
                ).length === 0
            );
        },
        /**
         * For form-validation display
         */
        valueIsValid() {
            if (!this.showFormValidation) return null;
            return this.newObjectValue.length > 0
        },
        /**
         * For form-validation display
         */
        tagsAreValid() {
            if (!this.showFormValidation) return null;
            return true;
        },
        hasAtLeastOneLanguageInUse() {
            return this.languagesInUse().length > 0;
        },
    },
    data() {
        return {
            validTags: [],
            invalidTags: [],
            duplicateTags: [],
            newObjectAutoTranslate: true,
            newObjectIsApproved: true,
            newObjectLanguages: this.languagesInUse(),
            newObjectKey: "",
            newObjectValue: "",
            newObjectXmlSpace: "",
            translationToAdd: "",
            autoTranslate: true,
            modalActive: false,
            formIsValid: false,
            showFormValidation: false,
            showOverlay: false,
            modalId: "modal-add-" + this.locallang.uid,
            addCurrentLanguagesButtonId:
                "show-current-languages-btn" + this.locallang.uid,
            xmlSpaceOptions: [
                {value: "", text: "None"},
                {value: "preserve", text: "Preserve"},
            ],
        };
    },
    watch: {
        /**
         * Watches the var to lowercase it on change
         */
        translationToAdd(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.translationToAdd = this.translationToAdd.toLowerCase();
            }
        },
    },
    methods: {
        /**
         * Gets an icon for the given languageCode
         */
        getLanguageIcon(languageCode) {
            return utility.getLanguageSvg(languageCode);
        },
        /**
         * Sets the states for the different tags
         * @param valid
         * @param invalid
         * @param duplicate
         */
        onTagState(valid, invalid, duplicate) {
            this.validTags = valid;
            this.invalidTags = invalid;
            this.duplicateTags = duplicate;
        },
        /**
         * Validates a tag on the fly while entering. Otherwise its not possible to add a tag
         */
        tagValidator(tag) {
            return (
                this.languages.filter((language) => language.key === tag).length > 0
            );
        },
        getLanguageNameByKey(key) {
            let matches = this.languages.filter(
                (language) => language.key === key.toLowerCase()
            );
            if (matches.length > 0) {
                return matches[0].trans;
            }
            return "Unknown";
        },
        /**
         * Gets called from the modal component when clicked on "OK". The default behaviour gets prevented and additional validation gets triggered. The window closes when the api-call is completed.
         * The cancel-action is not affected by this logic
         */
        showModal() {
            this.modalActive = true;
            const languagesInUse = this.languagesInUse();
            for (let i = 0; i < languagesInUse.length; i++) {
                this.newObjectLanguages.push(languagesInUse[i]);
            }
        },
        handleOk(bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault();
            // Trigger submit handler
            this.handleSubmit();
        },
        /**
         * Adds language after click on the "existing language" button
         */
        appendLanguage(language) {
            if (language === undefined) {
                // In this case we add all found languages. Dont know why but filter or array concat didnt work...
                const languagesInUse = this.languagesInUse();
                for (let i = 0; i < languagesInUse.length; i++) {
                    this.newObjectLanguages.push(languagesInUse[i]);
                }
            } else {
                this.newObjectLanguages.push(language);
            }
        },
        /**
         * Called before executing the submit action and triggers the form-validation. Additionally we check, if the tags are valid
         */
        checkFormValidity() {
            const valid = (this.$refs.form.checkValidity()); // dont know why the form does not contain validation for the tag-component. Its displayed but not mentioned here
            this.showFormValidation = true;
            this.formIsValid = valid;
            return (valid);
        },
        /**
         * Executes submit action. The form is getting validated and shows errors if something isnt correct. Otherwise the API gets called. After the call, the window disappears.
         */
        handleSubmit() {
            // Exit when the form isn't valid
            if (!this.checkFormValidity()) {
                return;
            }
            this.$nextTick(() => {
                this.showOverlay = true;
            });
            this.$store
                .dispatch("addTranslation", {
                    uid: this.locallang.uid,
                    data: JSON.stringify({
                        newObjectAutoTranslate: this.newObjectAutoTranslate,
                        newObjectApproved: this.newObjectIsApproved,
                        newObjectXmlSpace: this.newObjectXmlSpace,
                        newObjectLanguages: this.newObjectLanguages,
                        newObjectKey: this.newObjectKey,
                        newObjectValue: this.newObjectValue,
                    }),
                })
                .then(() => {
                    this.showOverlay = false;
                    this.modalActive = false;
                    this.rerender();
                });
        },
    },
};
</script>
