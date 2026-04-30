<template>
    <div :id="id" class="dm-modal-root">
        <template v-if="isVisible">
            <div class="dm-modal-backdrop" @click="handleBackdropClick"></div>

            <div
                :class="shellClasses"
                role="dialog"
                aria-modal="true"
                :aria-hidden="!isVisible"
                tabindex="-1"
            >
                <div :class="dialogClasses" role="document">
                    <div :class="contentClasses">
                        <div v-if="!hideHeader" :class="headerClassesNormalized">
                            <slot name="header">
                                <h5 class="modal-title">
                                    <b>{{ title }}</b>
                                </h5>
                            </slot>

                            <slot name="close-button">
                                <button
                                    v-if="showClose"
                                    type="button"
                                    class="btn btn-default t3js-contextual-close"
                                    aria-label="Close"
                                    @click="handleCancel"
                                >
                                    <span class="t3js-icon icon icon-size-small icon-state-default icon-actions-close" data-identifier="actions-close" aria-hidden="true">
	<span class="icon-markup">
<svg class="icon-color"><use xlink:href="/_assets/1ee1d3e909b58d32e30dcea666dd3224/Icons/T3Icons/sprites/actions.svg?1774941789#actions-close"></use></svg>
	</span>

</span>
                                    <span class="contextual-record-edit-button-label">Schließen</span>
                                </button>
                            </slot>
                        </div>

                        <div :class="bodyClassesNormalized">
                            <slot/>
                        </div>

                        <div v-if="!hideFooter" :class="footerClassesNormalized">
                            <slot name="footer">
                                <b-button :variant="cancelVariant" @click="handleCancel">
                                    {{ cancelTitle }}
                                </b-button>
                                <b-button :variant="okVariant" @click="handleConfirm">
                                    {{ okTitle }}
                                </b-button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: "modal",
    props: {
        id: {
            type: String,
            default: null
        },
        value: {
            type: Boolean,
            default: null
        },
        show: {
            type: Boolean,
            default: null
        },
        lazy: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ""
        },
        size: {
            type: String,
            default: "",
            validator(value) {
                return ["", "sm", "lg", "xl"].includes(value);
            }
        },
        centered: {
            type: Boolean,
            default: true
        },
        hideHeader: {
            type: Boolean,
            default: false
        },
        hideFooter: {
            type: Boolean,
            default: false
        },
        showClose: {
            type: Boolean,
            default: true
        },
        noCloseOnBackdrop: {
            type: Boolean,
            default: false
        },
        noCloseOnEsc: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: ""
        },
        modalClasses: {
            type: [Array, Object, String],
            default: () => []
        },
        modalContentClasses: {
            type: [Array, Object, String],
            default: () => []
        },
        headerClasses: {
            type: [Array, Object, String],
            default: () => []
        },
        bodyClasses: {
            type: [Array, Object, String],
            default: () => []
        },
        footerClasses: {
            type: [Array, Object, String],
            default: () => []
        },
        gradient: {
            type: String,
            default: ""
        },
        cancelVariant: {
            type: String,
            default: "secondary"
        },
        okVariant: {
            type: String,
            default: "primary"
        },
        cancelTitle: {
            type: String,
            default: "Cancel"
        },
        okTitle: {
            type: String,
            default: "OK"
        }
    },
    computed: {
        isVisible() {
            if (this.value !== null) {
                return this.value;
            }

            return this.show === true;
        },
        dialogClasses() {
            return [
                "modal-dialog",
                `dm-modal-dialog--${this.size || "md"}`,
                {
                    "modal-mini": this.type === "mini"
                },
                this.modalClasses
            ];
        },
        shellClasses() {
            return [
                "dm-modal-shell",
                {
                    "dm-modal-shell--centered": this.centered,
                    "dm-modal-shell--top": !this.centered
                }
            ];
        },
        contentClasses() {
            return [
                "modal-content",
                this.gradient ? `bg-gradient-${this.gradient}` : "",
                this.modalContentClasses
            ];
        },
        headerClassesNormalized() {
            return [
                "modal-header",
                this.headerClasses
            ];
        },
        bodyClassesNormalized() {
            return [
                "modal-body",
                this.bodyClasses
            ];
        },
        footerClassesNormalized() {
            return [
                "modal-footer",
                this.footerClasses
            ];
        }
    },
    watch: {
        isVisible: {
            immediate: true,
            handler() {
                this.updateBodyState();
            }
        }
    },
    mounted() {
        document.body.appendChild(this.$el);
        document.addEventListener("keydown", this.handleDocumentKeydown);
        this.updateBodyState();
    },
    beforeDestroy() {
        document.removeEventListener("keydown", this.handleDocumentKeydown);
        this.$el.remove();
        this.updateBodyState();
    },
    methods: {
        emitVisibility(value) {
            this.$emit("input", value);
            this.$emit("update:show", value);
        },
        updateBodyState() {
            this.$nextTick(() => {
                const hasOpenModal = document.querySelector(".dm-modal-shell") !== null;
                document.body.classList.toggle("dm-modal-open", hasOpenModal);
                document.documentElement.classList.toggle("dm-modal-open", hasOpenModal);
            });
        },
        createConfirmEvent() {
            return {
                defaultPrevented: false,
                preventDefault() {
                    this.defaultPrevented = true;
                }
            };
        },
        handleConfirm() {
            const modalEvent = this.createConfirmEvent();
            this.$emit("ok", modalEvent);

            if (!modalEvent.defaultPrevented) {
                this.closeModal();
            }
        },
        handleCancel() {
            this.$emit("cancel");
            this.closeModal();
        },
        handleBackdropClick() {
            if (this.noCloseOnBackdrop) {
                return;
            }

            this.handleCancel();
        },
        handleDocumentKeydown(event) {
            if (!this.isVisible || this.noCloseOnEsc || event.key !== "Escape") {
                return;
            }

            this.handleCancel();
        },
        closeModal() {
            if (!this.isVisible) {
                return;
            }

            this.emitVisibility(false);
            this.$emit("close");
            this.$emit("hide");
        }
    }
};
</script>

<style lang="scss">
html.dm-modal-open,
body.dm-modal-open {
    overflow: hidden;
}

.dm-modal-root {
    inset: 0;
    pointer-events: none;
    position: fixed;
    z-index: 2000;

    .dm-modal-backdrop {
        background-color: rgba(15, 23, 42, 0.55);
        inset: 0;
        pointer-events: auto;
        position: absolute;
    }

    .dm-modal-shell {
        align-items: center;
        display: flex;
        inset: 0;
        justify-content: center;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 1rem;
        pointer-events: none;
        position: absolute;
    }

    .dm-modal-shell--top {
        align-items: flex-start;
        padding-top: 2rem;
    }

    .modal-dialog {
        margin: 0 auto;
        pointer-events: none;
        width: 100%;
    }

    .dm-modal-dialog--sm {
        max-width: 320px;
    }

    .dm-modal-dialog--md {
        max-width: 500px;
    }

    .dm-modal-dialog--lg {
        max-width: 800px;
    }

    .dm-modal-dialog--xl {
        max-width: 1140px;
    }

    .modal-header {
        align-items: center;
        background: var(--typo3-surface-base);
        border-bottom: 1px solid color-mix(in srgb, var(--contextual-record-edit-bg), var(--typo3-text-color-base) 15%);
        display: flex;
        gap: .75rem;
        overflow: hidden;
        padding: .5rem 1rem;
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        z-index: 10;
    }

    .modal-content {
        display: flex;
        flex-direction: column;
        max-height: calc(100vh - 2rem);
        overflow: hidden;
        pointer-events: auto;
        box-shadow: 0 1rem 3rem rgba(15, 23, 42, 0.35);
        width: 100%;
        background: var(--module-bg);
    }

    .modal-footer {
        gap: .75rem;
        overflow: hidden;
        padding: .5rem 1rem;
    }

    .modal-body {
        overflow-y: auto;
        padding: .5rem 1rem;
    }

    .btn-close {
        background: transparent;
        border: 0;
        color: inherit;
        cursor: pointer;
        font-size: 1.5rem;
        line-height: 1;
        opacity: 0.6;
        padding: 0;
    }

    .btn-close::before {
        content: "\00d7";
    }

    .btn-close:hover {
        opacity: 1;
    }
}
</style>
