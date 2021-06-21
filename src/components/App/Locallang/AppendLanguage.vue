<template>
  <base-button
    title="Add a new language for all entries"
    type="danger"
    size="sm"
    @click="showModal"
    v-b-tooltip.hover
  >
    <b-icon icon="flag" aria-hidden="true"></b-icon> Add language
    <b-modal lazy :id="modalId" title="Append new language" v-model="modalActive" @ok="handleOk" size="xl" cancel-variant="light" :hide-footer="true">
      <b-card body-class="p-0" header-class="border-0">
        <template v-slot:header>
            <h3 class="mb-0">Overview</h3>
        </template>
        <b-card>
          <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group label="Enter language code">
              <b-input-group label="Enter language code">
                <b-input-group-prepend is-text>
                  <flag-icon width="15px" height="15px" class="text-dark"></flag-icon>
                </b-input-group-prepend>

                <b-form-input
                  id="input-add" 
                  type="search"
                  v-model="newObjectLanguage"
                  class="text-uppercase"
                  :state="languageState"

                ></b-form-input>

                <template #append>
                  <b-button  variant="success" :disabled="!languageState" @click="addLanguage">
                    <file-add-icon width="14px" height="14px"></file-add-icon> Add
                  </b-button>
                </template>
              </b-input-group>
            </b-form-group>
          </form>
        </b-card>
        <el-table class="table-responsive table-flush"
                header-row-class-name="thead-light"
                :data="locallang.translationsArray">
          <el-table-column label="Key"
                            min-width="310px"
                            prop="object.translationKey"
                            sortable>
              <template v-slot="{row}">
                  <b-media no-body class="align-items-center">
                      <key-icon class="text-primary" width="16px" height="16px"></key-icon>
                      
                      <b-media-body>
                          <span class="font-weight-600 name ml-2 mb-0 text-sm">{{row.object.translationKey}}</span>
                      </b-media-body>
                  </b-media>
              </template>
          </el-table-column>

          <el-table-column label="Status"
                            min-width="170px"
                            prop="status"
                            sortable>
              <template v-slot="{row}">
                  <badge class="badge-dot mr-4" type="">
                      <i :class="`bg-${row.statusType}`"></i>
                      <span class="status">{{row.status}}</span>
                  </badge>
              </template>
          </el-table-column>

          <el-table-column label="Completion"
                            prop="completion"
                            min-width="240px"
                            sortable>
              <template v-slot="{row}">
                  <div class="d-flex align-items-center">
                      <span class="completion mr-2">{{row.completion}}%</span>
                      <div>
                          <base-progress :type="row.statusType" :value="row.completion"/>
                      </div>
                  </div>
              </template>
          </el-table-column>
            
        </el-table>
      </b-card>
    </b-modal>
  </base-button>
    
</template>
<script>
import {
  Table,
  TableColumn,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "element-ui";
export default {
  name: "append-language",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
  },
  props: {
    locallang: {
      type: Object,
    },
    itemLimit: {
      type: Number,
      default: 9,
    },
  },
  data() {
    return {
      modalActive: false,
      modalId: "modal-append-" + this.locallang.uid,
      currentPage: 1,
      newObjectLanguage: "",
    };
  },
  computed: {
    languages() {
      return this.$store.getters.languages;
    },
    languageState() {
      return (
        this.languages.filter(
          (language) => language.key === this.newObjectLanguage
        ).length > 0
      );
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
};
</script>
