<template>
    <b-card class="" footer-tag="footer" header-tag="header" no-body>
        <b-card-body v-if="locallang.translationsArray">
            <!-- Search-Function -->
            <b-row class="mb-2">
                <b-col>
                    <b-input-group class="mb-2" size="sm">
                        <b-input-group-prepend is-text>
                            <b-icon icon="search"></b-icon>
                        </b-input-group-prepend>
                        <b-form-input
                            v-model="searchValue"
                            placeholder="Search by key, value or comment"
                            type="search"
                        >
                        </b-form-input>
                    </b-input-group>
                </b-col>
                <b-col>
                    <b-form-group label-class="form-label t3js-formengine-label"
                        class="mb-0"
                        label="Sort"
                        label-align-sm="right"
                        label-cols-sm="3"
                        label-for="sort-by-select"
                        label-size="sm"
                    >
                        <b-input-group size="sm">
                            <b-form-select
                                id="sort-by-select"
                                v-model="sortBy"
                                :options="sortOptions"
                                class="w-75 form-select"

                            >
                                <template #first>
                                    <option value="">-- none --</option>
                                </template>
                            </b-form-select>

                            <b-form-select
                                v-model="sortDesc"
                                :disabled="!sortBy"
                                class="w-25 form-select"
                                size="sm"
                            >
                                <option :value="false">ASC</option>
                                <option :value="true">DESC</option>
                            </b-form-select>
                        </b-input-group>
                    </b-form-group>
                </b-col>
            </b-row>
            <!-- Translation-Components with Table and Pagination -->
            <b-row>
                <b-col md>
                    <b-pagination
                        v-model="currentPage"
                        :limit="paginationLimit"
                        :per-page="perPage"
                        :total-rows="rows"
                        aria-controls="my-table"
                    ></b-pagination>
                </b-col>
                <b-col md>
                    <b-form-group label-class="form-label t3js-formengine-label"
                        class="mb-0"
                        label="Per page"
                        label-align-sm="right"
                        label-cols-lg="3"
                        label-cols-md="4"
                        label-cols-sm="6"
                        label-for="per-page-select"
                        label-size="sm"
                    >
                        <b-form-select
                            class="form-select"
                            id="per-page-select"
                            v-model="perPage"
                            :options="pageOptions"
                            size="sm"
                        ></b-form-select>
                    </b-form-group>
                </b-col>
            </b-row>

            <div class="recordlist">
                <div class="recordlist-heading multi-record-selection-panel">
                    Translations
                </div>
                <div class="">
                    <table :id="tableId" data-table="locallang" class="table table-striped table-hover">
                        <tbody>
                        <tr
                            v-for="translation in paginatedTranslations"
                            :key="translation.object.uid"
                            :data-uid="translation.object.uid"
                        >
                            <td>
                                <Translation :locallang="locallang" :rerender="render" :translation="translation.object"/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="alert alert-warning" v-if="filteredTranslations.length === 0">
                There are currently no entries in this file. Create the first entry by clicking “New key” at the top.
            </div>
            <b-row>
                <b-col>
                    <b-pagination
                        v-model="currentPage"
                        :limit="paginationLimit"
                        :per-page="perPage"
                        :total-rows="rows"
                        aria-controls="fake-table"
                    ></b-pagination>
                </b-col>
            </b-row>
        </b-card-body>
        <!-- Header -->
        <template #header>
            <div class="d-flex justify-content-between align-items-center">
        <span>
          <file-xml-icon height="18px" width="18px"/>
          <strong class="text-muted ms-2">File: </strong>
          <u>{{ locallang.filename }}</u>
        </span>
                <!-- Actions-Menu -->
                <LocallangActions
                    :isLoaded="loaded"
                    :languagesInUse="getLanguagesInUse"
                    :locallang="locallang"
                    :rerender="render"
                />
            </div>
        </template>
        <!-- Footer -->
        <template #footer>
            <b-skeleton-wrapper :loading="loading">
                <template #loading>
                    <b-card>
                        <b-skeleton-table
                            :columns="1"
                            :rows="20"
                            :table-props="{ striped: true }"
                        ></b-skeleton-table>
                    </b-card>
                </template>
            </b-skeleton-wrapper>


        </template>
    </b-card>
</template>

<script>
import Translation from "../Translation/Translation";
import LocallangActions from "./LocallangActions";

export default {
    name: "Locallang",
    props: ["locallang"],
    data() {
        return {
            paginationLimit: 10,
            showOverlay: false,
            loaded: Boolean(this.locallang && this.locallang.translationsArray),
            loading: false,
            searchValue: "",
            perPage: 10,
            currentPage: 1,
            pageOptions: [5, 10, 20, 30],
            sortOptions: [{text: "Name", value: "key"}],
            sortBy: "",
            sortDesc: false,
            sortDirection: "asc",
        };
    },
    computed: {
        tableId() {
            return "table-locallang-" + this.locallang.uid;
        },
        rows() {
            return this.filteredTranslations.length;
        },
        filteredTranslations() {
            const searchNeedle = this.searchValue.trim().toLowerCase();
            if (!searchNeedle) {
                return this.locallang.translationsArray;
            }

            return this.locallang.translationsArray.filter((translation) => {
                const translationObject = translation.object || {};
                const haystacks = [
                    translation.key,
                    ...Object.values(translationObject.translationValues || {}).map((value) => value.value || ""),
                    ...Object.values(translationObject.translationValues || {}).map((value) => value.comment || ""),
                ];

                return haystacks.some((value) =>
                    String(value).toLowerCase().includes(searchNeedle)
                );
            });
        },
        sortedTranslations() {
            const translations = [...this.filteredTranslations];
            if (this.sortBy !== "key") {
                return translations;
            }

            translations.sort((left, right) => {
                const leftValue = String(left.key || "").toLowerCase();
                const rightValue = String(right.key || "").toLowerCase();

                if (leftValue === rightValue) {
                    return 0;
                }

                const result = leftValue < rightValue ? -1 : 1;
                return this.sortDesc ? result * -1 : result;
            });

            return translations;
        },
        paginatedTranslations() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.sortedTranslations.slice(start, start + this.perPage);
        },
    },
    watch: {
        rows() {
            const maxPage = Math.max(1, Math.ceil(this.rows / this.perPage));
            if (this.currentPage > maxPage) {
                this.currentPage = maxPage;
            }
        },
        perPage() {
            const maxPage = Math.max(1, Math.ceil(this.rows / this.perPage));
            if (this.currentPage > maxPage) {
                this.currentPage = maxPage;
            }
        },
        searchValue() {
            this.currentPage = 1;
        },
    },
    methods: {
        render() {
            this.$forceUpdate();
        },

        addLanguage() {
        },
        loadData() {
            this.showOverlay = true;
            this.loading = true;
            this.$store
                .dispatch("getLocallangByUid", {
                    uid: this.locallang.uid,
                })
                .then(() => {
                    this.showOverlay = false;
                    this.loaded = true;
                    this.loading = false;
                });

            return true;
        },
        getLanguagesInUse() {
            const list = [];
            for (let translationKey in this.locallang.translationsArray) {
                for (let translationValueKey in this.locallang.translationsArray[
                    translationKey
                    ].object.translationValues) {
                    const languageCode = this.locallang.translationsArray[translationKey]
                        .object.translationValues[translationValueKey].ident;
                    if (list.indexOf(languageCode) === -1 && languageCode != "en") {
                        list.push(languageCode);
                    }
                }
            }
            return list;
        },
    },
    mounted() {
        if (this.locallang.translationsArray) {
            this.loaded = true;
            return;
        }

        // When we didn't fetch the data yet, we'll load it from backend
        if (!this.loading) {
            this.loadData();
        }
    },
    components: {
        Translation,
        LocallangActions,
    },
};
</script>
