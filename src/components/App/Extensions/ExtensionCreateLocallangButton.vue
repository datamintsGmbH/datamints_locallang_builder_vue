<template>
    <li class="nav-item nav-item-create">
        <button class="nav-link text-break create-locallang-button" type="button" @click="showPrompt">
            <b-icon icon="plus-circle" class="me-2 flex-shrink-0"></b-icon>
            <span class="nav-link-text overflow-prevent">New file</span>
        </button>
    </li>
</template>

<script>
import swal from "sweetalert2";

export default {
    name: "extension-create-locallang-button",
    props: {
        extension: {
            type: Object,
            required: true,
        },
    },
    methods: {
        async showPrompt() {
            const result = await swal.fire({
                title: `Create file in ${this.extension.name}`,
                text: "Creates a new empty default-language XLF file in Resources/Private/Language/.",
                input: "text",
                inputLabel: "Filename",
                inputPlaceholder: "locallang_custom.xlf",
                inputValue: "locallang_custom.xlf",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
                cancelButtonClass: "btn btn-secondary",
                inputAttributes: {
                    autocapitalize: "off",
                    autocorrect: "off",
                    spellcheck: "false",
                },
                allowOutsideClick: () => !swal.isLoading(),
                preConfirm: async (filename) => {
                    const response = await this.$store.dispatch("createLocallang", {
                        uid: this.extension.uid,
                        filename,
                    });

                    if (!response || response.status !== "success" || !response.data) {
                        swal.showValidationMessage(
                            response && response.message ? response.message : "Could not create the file."
                        );
                        return false;
                    }

                    return response.data;
                },
            });

            if (result.value && result.value.uid) {
                this.$emit("locallang", result.value.uid);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.overflow-prevent {
    overflow-x: hidden;
    text-overflow: ellipsis;
}

.nav-item-create {
    margin-top: 2px;
}

.create-locallang-button {
    width: 100%;
    border: 0;
    background: transparent;
    border-radius: 4px;
    display: flex;
    align-items: center;
    color: inherit;

    &:hover {
        background-color: var(--tree-node-hover-bg);
        color: var(--tree-node-hover-color);
        outline: 1px solid;
        border-color: var(--tree-node-hover-border-color);
    }
}
</style>
