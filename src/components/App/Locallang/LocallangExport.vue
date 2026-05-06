<template>
    <base-button v-b-tooltip.hover size="sm" title="Export (opens modal view)" type="success" @click="showModal">
        <floppy-disk-icon height="15px" width="15px"></floppy-disk-icon>
        Export
        <!-- Modal -->
        <modal :id="modalId" v-model="modalActive" :hide-footer="showOverlay" cancel-variant="light" lazy size="lg" title="Export" @ok="handleOk">
            <b-overlay :show="showOverlay" rounded="sm">
                <b-row>
                    <b-col>
                        <p>Hover over the key to get further option information</p>
                        <hr/>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-card header="Configuration">
                            <form ref="form">
                                <!-- Filetype -->
                                <b-form-group label-class="form-label t3js-formengine-label pt-0" content-cols-lg="7" content-cols-sm label-cols-lg="4" label-cols-sm="4">
                                    <template #label>
                                        <b-link v-b-tooltip.hover class="text-dark" href="#disabled" title="Choose your preferred output format">Filetype</b-link>
                                    </template>
                                    <b-form-radio-group
                                        id="filetype"
                                        v-model="selectedFiletype"
                                        :options="filetypeOptions"
                                        name="export-radio-filetype">
                                    </b-form-radio-group>
                                </b-form-group>
                                <b-form-group
                                    v-if="xlfFiletypeChosen"
                                    label-class="form-label t3js-formengine-label pt-0"
                                    content-cols-lg="7"
                                    content-cols-sm
                                    label-cols-lg="4"
                                    label-cols-sm="4"
                                >
                                    <template #label>
                                        <b-link
                                            v-b-tooltip.hover
                                            class="text-dark"
                                            href="#disabled"
                                            title="Choose the XLIFF schema version for the exported .xlf files"
                                        >
                                            XLIFF version
                                        </b-link>
                                    </template>
                                    <b-form-radio-group
                                        id="xliff-version"
                                        v-model="selectedXliffVersion"
                                        :options="xliffVersionOptions"
                                        name="export-radio-xliff-version"
                                    >
                                    </b-form-radio-group>
                                </b-form-group>
                                <!-- Target -->
                                <b-form-group label-class="form-label t3js-formengine-label pt-0" content-cols-lg="7" content-cols-sm label-cols-lg="4" label-cols-sm="4">
                                    <template #label>
                                        <b-link v-b-tooltip.hover class="text-dark" href="#disabled"
                                                title="Select the output target. You can write the export into the extension language folder or into fileadmin/locallang-builder/.">
                                            Target
                                        </b-link>
                                    </template>
                                    <b-form-radio-group
                                        id="target"
                                        v-model="selectedTarget"
                                        :options="targetOptions"
                                        name="export-radio-target">
                                    </b-form-radio-group>
                                </b-form-group>
                                <!-- Create Backup -->
                                <b-form-group label-class="form-label t3js-formengine-label pt-0" v-if="overwriteChosen" content-cols-lg="7" content-cols-sm
                                               label-cols-lg="4" label-cols-sm="4">
                                    <template #label>
                                        <b-link v-b-tooltip.hover class="text-dark" href="#disabled"
                                                title="Creates backup of the old file, when selected. The file gets copied to /fileadmin/locallang-builder/">
                                            Create backup
                                        </b-link>
                                    </template>
                                    <p>
                                        <base-switch v-model="triggerBackup"/>
                                    </p>
                                </b-form-group>

                            </form>
                        </b-card>
                    </b-col>
                    <b-col>
                        <b-alert :show="overwriteChosen" variant="warning">
                            {{ overwriteHintText }}
                        </b-alert>
                        <b-alert :show="backupChosen" variant="success">
                            Your previous locallang-files will be copied to the backup-folder,
                            so you can restore the backup if something bad happens.
                        </b-alert>
                        <b-alert :show="nonXlfFiletypeChosen" variant="info">
                            {{ nonXlfHintText }}
                        </b-alert>
                    </b-col>
                </b-row>
            </b-overlay>
        </modal>
    </base-button>
</template>
<script>
export default {
    name: "LocallangExport",
    props: ["locallang"],
    data() {
        return {
            modalId: "modal-" + this.locallang.uid,
            modalActive: false,
            showOverlay: false,
            filetypeOptions: [
                {
                    text: "XML (.xlf)",
                    value: "xml-xlf",
                },
                {
                    text: "JSON (.json)",
                    value: "json",
                },
                {
                    text: "YAML (.yaml)",
                    value: "yaml",
                },
            ],
            xliffVersionOptions: [
                {
                    text: "1.2",
                    value: "1.2",
                },
                {
                    text: "2.0",
                    value: "2.0",
                },
            ],
            selectedFiletype: "xml-xlf",
            selectedXliffVersion: "1.2",
            targetOptions: [
                {
                    text: "Overwrite",
                    value: "overwrite",
                },
                {
                    text: "Custom path",
                    value: "fileadmin",
                },
            ],
            selectedTarget: "overwrite",
            triggerBackup: false,
            triggerCache: true,
        };
    },
    computed: {
        overwriteChosen() {
            return this.selectedTarget == "overwrite";
        },
        xlfFiletypeChosen() {
            return this.selectedFiletype === "xml-xlf";
        },
        backupChosen() {
            return this.triggerBackup === true && this.selectedTarget == "overwrite";
        },
        nonXlfFiletypeChosen() {
            return this.selectedFiletype === "json" || this.selectedFiletype === "yaml";
        },
        overwriteHintText() {
            if (this.nonXlfFiletypeChosen) {
                return "The selected export format will be written into the extension language folder next to the existing locallang files.";
            }

            return 'The file-content will be overwritten with the values from "locallang-builder". Its not recommended to edit the file manually after this process. If you have to edit something manually, please reimport the file from the actions-menu to reset everything and fetch the latest file-content.';
        },
        nonXlfHintText() {
            if (this.selectedFiletype === "yaml") {
                return "YAML export writes flat key/value translations for TYPO3 locallang YAML loaders. XLF-specific metadata like comments, approval state, and xml:space is not stored in YAML.";
            }

            return "JSON export writes flat key/value translations for TYPO3 locallang JSON loaders. XLF-specific metadata like comments, approval state, and xml:space is not stored in JSON.";
        },
    },
    methods: {
        showModal() {
            this.modalActive = true;
        },
        handleOk(bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault();
            // Trigger submit handler
            this.handleSubmit();
        },
        handleSubmit() {
            this.$nextTick(() => {
                this.showOverlay = true;
            });
            this.$store
                .dispatch("exportLocallang", {
                    uid: this.locallang.uid,
                    data: JSON.stringify({
                        triggerBackup: this.triggerBackup,
                        selectedFiletype: this.selectedFiletype,
                        selectedXliffVersion: this.selectedXliffVersion,
                        triggerCache: this.triggerCache,
                        selectedTarget: this.selectedTarget,
                    }),
                })
                .then(() => {
                    this.showOverlay = false;
                    this.modalActive = false;
                });
        },
    },
    components: {},
};
</script>
<style lang="scss" scoped>
</style>
