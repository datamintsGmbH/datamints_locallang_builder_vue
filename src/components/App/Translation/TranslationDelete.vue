<template>
    <base-button class="d-none"
                 size="sm"
                 type="danger"
                 @click="onClickDelete"
    >
        <delete-forever-icon height="16px" width="16px"/>
        Delete key
        <b-modal
            v-model="modalActive"
            :hide-footer="showOverlay"
            title="Are you sure?"
            @ok="handleOk"
        >
            <b-overlay :show="showOverlay" rounded="sm">
                asdf
            </b-overlay>
        </b-modal>
    </base-button>

</template>

<script>

export default {
    name: "TranslationDelete",
    props: ["translation"],
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
