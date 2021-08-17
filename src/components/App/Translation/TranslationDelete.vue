<template>
    <base-button v-b-tooltip.hover
                 size="sm"
                 title="Delete key"
                 type="danger"
                 @click="onClickDelete"
    >
        <delete-forever-icon height="11px" width="11px"/>
        <b-modal
            v-model="modalActive"
            :hide-footer="showOverlay"
            title="Are you sure?"
            @ok="handleOk"
        >
            <b-overlay :show="showOverlay" rounded="sm">
                <b-alert show variant="danger">
                    The complete entry for the key "{{ translation.translationKey }}" including all translations will be deleted. Are you sure you wanna do this?
                </b-alert>
            </b-overlay>
        </b-modal>
    </base-button>

</template>

<script>

export default {
    name: "TranslationDelete",
    props: ["translation", "rerendert"],
    data() {
        return {
            modalActive: false,
            showOverlay: false,
        };
    },
    methods: {
        onClickDelete() {
            this.modalActive = true;
        },
        handleOk(bvModalEvt) {
            bvModalEvt.preventDefault();
            this.showOverlay = true;
            this.$store
                .dispatch("deleteTranslation", {
                    uid: this.translation.uid,
                })
                .then(() => {
                    this.modalActive = false;
                    this.showOverlay = false;
                    this.rerender();
                });
        },
    }
};
</script>
