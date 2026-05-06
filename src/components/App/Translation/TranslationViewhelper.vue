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
                    <i class="ni ni-favourite-28 me-2"></i> Fluid (normal)
                  </template>
                  <b-card header="Fluid" header-bg-variant="success" header-class="font-weight-bold" header-text-variant="white">
                    <base-input input-classes="form-control-sm" label="Copy (classic LLL)">
                        <textarea v-model="fluid"
                                  v-b-tooltip.hover
                                  v-clipboard:copy="fluid"
                                    v-clipboard:error="onError"
                                    v-clipboard:success="onCopy"
                                     class="form-control form-control-muted copy-textarea"
                                     rows="5" title="Click to copy the content to your clipboard"></textarea>
                    </base-input>
                    <base-input input-classes="form-control-sm" label="Copy (TYPO3 14 domain)">
                        <textarea v-model="fluidDomain"
                                  v-b-tooltip.hover
                                  v-clipboard:copy="fluidDomain"
                                  v-clipboard:error="onError"
                                  v-clipboard:success="onCopy"
                                  class="form-control form-control-muted copy-textarea"
                                  rows="5" title="Click to copy the content to your clipboard"></textarea>
                    </base-input>
                  </b-card>
                </b-tab>

                <b-tab lazy>
                  <template v-slot:title>
                    <i class="ni ni-scissors me-2"></i> Fluid (inline)
                  </template>
                  <b-card header="Fluid inline" header-bg-variant="warning" header-class="font-weight-bold" header-text-variant="white">
                    <base-input input-classes="form-control-sm" label="Copy (classic LLL)">
                          <textarea v-model="fluidInline"
                                    v-b-tooltip.hover
                                    v-clipboard:copy="fluidInline"
                                    v-clipboard:error="onError"
                                    v-clipboard:success="onCopy"
                                     class="form-control form-control-muted copy-textarea"
                                     rows="5" title="Click to copy the content to your clipboard"></textarea>
                    </base-input>
                    <base-input input-classes="form-control-sm" label="Copy (TYPO3 14 domain)">
                        <textarea v-model="fluidInlineDomain"
                                  v-b-tooltip.hover
                                  v-clipboard:copy="fluidInlineDomain"
                                  v-clipboard:error="onError"
                                  v-clipboard:success="onCopy"
                                  class="form-control form-control-muted copy-textarea"
                                  rows="5" title="Click to copy the content to your clipboard"></textarea>
                    </base-input>
                  </b-card>
                </b-tab>

                <b-tab lazy>
                  <template v-slot:title>
                    <i class="ni ni-like-2 me-2"></i> Extbase (php)
                  </template>
                  <b-card header="Extbase" header-bg-variant="danger" header-class="font-weight-bold" header-text-variant="white">
                        <base-input input-classes="form-control-sm" label="Copy (classic LLL)">
                          <textarea v-model="extbase"
                                    v-b-tooltip.hover
                                    v-clipboard:copy="extbase"
                                    v-clipboard:error="onError"
                                    v-clipboard:success="onCopy"
                                     class="form-control form-control-muted copy-textarea"
                                     rows="5" title="Click to copy the content to your clipboard"></textarea>
                        </base-input>
                        <base-input input-classes="form-control-sm" label="Copy (TYPO3 14 domain)">
                          <textarea v-model="extbaseDomain"
                                    v-b-tooltip.hover
                                    v-clipboard:copy="extbaseDomain"
                                    v-clipboard:error="onError"
                                    v-clipboard:success="onCopy"
                                    class="form-control form-control-muted copy-textarea"
                                    rows="5" title="Click to copy the content to your clipboard"></textarea>
                        </base-input>

                    </b-card>
                </b-tab>
                <b-tab lazy>
                  <template v-slot:title>
                    <i class="ni ni-like-2 me-2"></i> Plain
                  </template>
                  <b-card header="Plain" header-bg-variant="primary" header-class="font-weight-bold" header-text-variant="white">
                        <base-input input-classes="form-control-sm" label="Copy (classic LLL)">
                          <textarea v-model="plain"
                                    v-b-tooltip.hover
                                    v-clipboard:copy="plain"
                                    v-clipboard:error="onError"
                                    v-clipboard:success="onCopy"
                                     class="form-control form-control-muted copy-textarea"
                                     rows="5" title="Click to copy the content to your clipboard"></textarea>
                        </base-input>
                        <base-input input-classes="form-control-sm" label="Copy (TYPO3 14 domain)">
                          <textarea v-model="plainDomain"
                                    v-b-tooltip.hover
                                    v-clipboard:copy="plainDomain"
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
            return "<f:translate key=\"" + this.fileReference + "\" />";
        },
        fluidInline() {
            return "{f:translate(key:'" + this.fileReference + "')}";
        },
        fluidDomain() {
            return "<f:translate key=\"" + this.domainReference + "\" />";
        },
        fluidInlineDomain() {
            return "{f:translate(key:'" + this.domainReference + "')}";
        },
        extbase() {
            return "LocalizationUtility::translate('" + this.fileReference + "', '" + this.extensionKey + "');";
        },
        extbaseDomain() {
            return "LocalizationUtility::translate('" + this.translation.translationKey + "', '" + this.extensionKey + "', [], null, '" + this.translationDomainResource + "');";
        },
        plain() {
            return this.fileReference;
        },
        plainDomain() {
            return this.domainReference;
        },
        domainReference() {
            return this.translationDomain + ":" + this.translation.translationKey;
        },
        fileReference() {
            return "LLL:EXT:" + this.extensionKey + "/Resources/Private/Language/" + this.languageFileRelativePath + ":" + this.translation.translationKey;
        },
        normalizedLocallangPath() {
            return this.locallangPath.replace(/\\/g, "/");
        },
        languageFileRelativePath() {
            const pathParts = this.normalizedLocallangPath.split("/Resources/Private/Language/");
            if (pathParts.length < 2) {
                return this.normalizedLocallangPath.split("/").slice(-1)[0];
            }

            return pathParts[1];
        },
        extensionKey() {
            const pathBeforeLanguageFolder = this.normalizedLocallangPath.split("/Resources/Private/Language/")[0];
            const extMatch = pathBeforeLanguageFolder.match(/EXT:([^/]+)$/);
            if (extMatch) {
                return extMatch[1];
            }

            const pathSegments = pathBeforeLanguageFolder.split("/").filter(Boolean);
            return pathSegments[pathSegments.length - 1] || "my_extension";
        },
        translationDomain() {
            return this.extensionKey + "." + this.translationDomainResource;
        },
        translationDomainResource() {
            const relativePath = this.languageFileRelativePath;
            const pathSegments = relativePath.split("/").filter(Boolean);
            const fileName = pathSegments.pop() || "locallang.xlf";
            const fileNameWithoutExtension = fileName.replace(/\.[^.]+$/, "");
            const fileNameParts = fileNameWithoutExtension.split(".");
            const localePrefix = fileNameParts[0];
            const fileNameWithoutLocale = fileNameParts.length > 1 && this.isLocaleSegment(localePrefix)
                ? fileNameParts.slice(1).join(".")
                : fileNameWithoutExtension;

            const normalizedDirectorySegments = pathSegments.map((segment) => this.normalizeDomainSegment(segment));
            let resourceName = fileNameWithoutLocale;

            if (resourceName === "locallang") {
                resourceName = "messages";
            } else if (resourceName.indexOf("locallang_") === 0) {
                resourceName = resourceName.substring("locallang_".length);
            }

            const normalizedResourceName = this.normalizeDomainSegment(resourceName);
            const domainSegments = normalizedDirectorySegments.filter(Boolean);

            if (normalizedResourceName.length > 0) {
                domainSegments.push(normalizedResourceName);
            }

            return domainSegments.length > 0 ? domainSegments.join(".") : "messages";
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
        },
        normalizeDomainSegment(segment) {
            return String(segment || "")
                .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
                .replace(/[-\s]+/g, "_")
                .replace(/^locallang_/, "")
                .toLowerCase();
        },
        isLocaleSegment(segment) {
            return /^[a-z]{2,3}(?:[-_][a-z0-9]+)*$/i.test(segment);
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
