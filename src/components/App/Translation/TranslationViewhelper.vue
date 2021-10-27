<template>
    <span class="pr-1">

        <!-- After clicking on the button, a popover with a form appears -->
        <base-button :id="addButtonId" v-b-tooltip.hover size="sm" title="Display Viewhelpers" type="success">
            <code-icon class="text-white" height="11px" width="11px"></code-icon>
        </base-button>
        <b-popover :target="addButtonId" triggers="focus">
            <template #title>Viewhelpers</template>
            <b-tabs align="center" content-class="mt-4" fill justified pills vertical>
                <b-tab active lazy>
                  <template v-slot:title>
                    <i class="ni ni-favourite-28 mr-2"></i> Fluid (normal)
                  </template>
                  <b-card header="Fluid" header-bg-variant="success" header-class="font-weight-bold" header-text-variant="white">
                    <base-input input-classes="form-control-sm" label="Copy">
                          <textarea v-model="fluid"
                                    v-b-tooltip.hover
                                    v-clipboard:copy="fluid"
                                    v-clipboard:error="onError"
                                    v-clipboard:success="onCopy"
                                    class="form-control form-control-muted copy-textarea"
                                    rows="5" title="Click to copy the content to your clipboard"></textarea>
                        </base-input>
                  </b-card>
                </b-tab>

                <b-tab lazy>
                  <template v-slot:title>
                    <i class="ni ni-scissors mr-2"></i> Fluid (inline)
                  </template>
                  <b-card header="Fluid inline" header-bg-variant="warning" header-class="font-weight-bold" header-text-variant="white">
                    <base-input input-classes="form-control-sm" label="Copy">
                          <textarea v-model="fluidInline"
                                    v-b-tooltip.hover
                                    v-clipboard:copy="fluidInline"
                                    v-clipboard:error="onError"
                                    v-clipboard:success="onCopy"
                                    class="form-control form-control-muted copy-textarea"
                                    rows="5" title="Click to copy the content to your clipboard"></textarea>
                        </base-input>
                  </b-card>
                </b-tab>

                <b-tab lazy>
                  <template v-slot:title>
                    <i class="ni ni-like-2 mr-2"></i> Extbase (php)
                  </template>
                  <b-card header="Extbase" header-bg-variant="danger" header-class="font-weight-bold" header-text-variant="white">
                        <base-input input-classes="form-control-sm" label="Copy">
                          <textarea v-model="extbase"
                                    v-b-tooltip.hover
                                    v-clipboard:copy="extbase"
                                    v-clipboard:error="onError"
                                    v-clipboard:success="onCopy"
                                    class="form-control form-control-muted copy-textarea"
                                    rows="5" title="Click to copy the content to your clipboard"></textarea>
                        </base-input>

                    </b-card>
                </b-tab>
              </b-tabs>


            <b-alert show variant="info">
                Choose your format and click on a textarea to copy the snippet into your clipboard
            </b-alert>
        </b-popover>

    </span>
</template>

<script>

export default {
    name: "TranslationViewhelper",
    props: ["translation", "locallangPath"],
    data() {
        return {
            modalActive: false,
            showOverlay: false,
        };
    },
    computed: {
        fluid() {
            return "<f:translate key=\"LLL:EXT:" + this.croppedLocallangPath + ":" + this.translation.translationKey + "\" />";
        },
        fluidInline() {
            return "{f:translate(key:\"LLL:EXT:" + this.croppedLocallangPath + ":" + this.translation.translationKey + "\")}";
        },
        extbase() {
            return "LocalizationUtility::translate('LLL:EXT:" + this.croppedLocallangPath + ":" + this.translation.translationKey + "', '" + this.croppedExtensionname + "');"
        },
        croppedLocallangPath() {
            return this.locallangPath.replace("typo3conf/ext/", "");
        },
        croppedExtensionname() {
            // a little bit dirty, but its to much expenditure to pass the extension-values to this point, so we're cropping the extension name from its path
            return this.locallangPath.split('typo3conf/ext/').pop().split('/Resources/')[0];
        },
        addButtonId() {
            return "button-viewhelper-" + this.translation.uid;
        },
    },
    methods: {
        onClickViewhelper() {
            this.modalActive = true;
        },
        onCopy: function () {
            this.$notify({
                verticalAlign: "top",
                horizontalAlign: "right",
                type: "success",
                message: 'You just copied the text to your clipboard',
                timeout: 5000,
            });
        },
        onError: function () {
            this.$notify({
                verticalAlign: "top",
                horizontalAlign: "right",
                type: "danger",
                message: "Failed to copy the text to the clipboard",
                timeout: 5000,
            });
        }
    }
};
</script>
<style lang="scss">
.copy-textarea {
    cursor: pointer;

    &:hover {
        background-color: var(--green);
        color: white;
    }
}
</style>

