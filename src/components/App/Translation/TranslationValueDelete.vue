<template>
    <b-dropdown-item-button id="buttonId" href="#" variant="danger" @click="onClickDelete">
        <delete-forever-icon height="16px" width="16px"/>
        Delete only the translation "{{ translationValue.ident }}"
        <b-modal
            v-model="modalActive"
            :hide-footer="showOverlay"
            title="Are you sure?"
            @ok="handleOk"
        >
            <b-overlay :show="showOverlay" rounded="sm">
                <b-alert show variant="warning">
                    All your data for the Translation <br><strong>{{ translationValue.ident }}</strong> <br>with the value <br><strong>{{ translationValue.value }}</strong> <br>will be lost. It's possible to recover your deleted data from database if you wish.
                </b-alert>
            </b-overlay>
        </b-modal>
    </b-dropdown-item-button>
</template>

<script>
export default {
    name: "TranslationValueDelete",
    props: ["translationValue", "rerender"],
    data() {
        return {
            modalActive: false,
            showOverlay: false,
        };
    },
    computed: {
        buttonId() {
            return "delete-" + this.translationValue.uid;
        },
    },
    methods: {
        onClickDelete() {
            this.modalActive = true;
        },
        handleOk(bvModalEvt) {
            bvModalEvt.preventDefault();
            this.showOverlay = true;
            this.$store
                .dispatch("deleteTranslationValue", {
                    uid: this.translationValue.uid,
                })
                .then(() => {
                    this.modalActive = false;
                    this.showOverlay = false;
                    this.rerender();
                });
        },
    },
};
</script>
