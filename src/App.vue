<template>
    <div id="app">
        <notifications></notifications>
        <main class="main">
            <extension-list @locallang="onLocallangSelect"></extension-list>

            <div class="main-content">
                <b-alert v-if="error" show variant="danger">
                    <h4 class="alert-heading">Critical error</h4>
                    <p>A fatal error has occurred. Please reload this browser tab and submit a new issue: <a href="https://github.com/datamintsGmbH/datamints_locallang_builder/issues" target="_blank">here</a>.</p>
                </b-alert>
                <dashboard-content
                    :locallang="selectedLocallang"
                    :recent-locallangs="recentLocallangs"
                    @locallang="onLocallangSelect"
                ></dashboard-content>
            </div>
            <footer class="footer bg-primary p-2">
                <b-row>
                    <b-col>
                        <small class="float-end">
                            <a v-b-tooltip.hover :href="getGitUrl" class="text-white mx-2" target="_blank" title="Open Github">
                                <logo-github-icon class="mr-4" height="16px" width="16px"></logo-github-icon>
                            </a>
                            © Mark Weisgerber - version {{ version }}
                        </small>
                    </b-col>
                </b-row>
            </footer>
        </main>
    </div>
</template>

<script>
import Vue from "vue";
import {BVToastPlugin} from "bootstrap-vue";

import ExtensionList from "./components/App/Extensions/ExtensionList.vue";
import DashboardContent from "./components/App/DashboardContent.vue";

Vue.config.devtools = true;
Vue.use(BVToastPlugin);

const RECENT_LOCALLANGS_STORAGE_KEY = "datamints_locallang_builder_recent_locallangs";
const RECENT_LOCALLANGS_LIMIT = 5;

const loadRecentLocallangEntries = () => {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const recentLocallangs = window.localStorage.getItem(
            RECENT_LOCALLANGS_STORAGE_KEY
        );

        if (!recentLocallangs) {
            return [];
        }

        const parsedRecentLocallangs = JSON.parse(recentLocallangs);

        return Array.isArray(parsedRecentLocallangs) ? parsedRecentLocallangs : [];
    } catch (error) {
        console.warn("Could not load recently opened locallang files.", error);
        return [];
    }
};

const saveRecentLocallangEntries = (recentLocallangs) => {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.setItem(
        RECENT_LOCALLANGS_STORAGE_KEY,
        JSON.stringify(recentLocallangs)
    );
};

export default {
    name: "App",
    components: {
        DashboardContent,
        ExtensionList,
    },
    data() {
        return {
            error: false,
            selectedLocallangUid: null,
            recentLocallangEntries: loadRecentLocallangEntries(),
        };
    },
    methods: {
        onLocallangSelect(locallangUid) {
            this.selectedLocallangUid = locallangUid;
            this.rememberLocallang(locallangUid);
        },
        rememberLocallang(locallangUid) {
            if (locallangUid === null) {
                return;
            }

            const locallangMeta = this.findLocallangMeta(locallangUid);

            if (!locallangMeta) {
                return;
            }

            const recentLocallangs = [
                locallangMeta,
                ...this.recentLocallangEntries.filter(
                    (entry) => entry.path !== locallangMeta.path
                ),
            ].slice(0, RECENT_LOCALLANGS_LIMIT);

            this.recentLocallangEntries = recentLocallangs;
            saveRecentLocallangEntries(recentLocallangs);
        },
        findLocallangMeta(locallangUid) {
            for (const extension of this.$store.getters.extensions) {
                for (const locallang of Object.values(extension.locallangs)) {
                    if (locallang.uid === parseInt(locallangUid)) {
                        return {
                            uid: locallang.uid,
                            path: locallang.path,
                            filename: locallang.filename,
                            extensionName: extension.name,
                        };
                    }
                }
            }

            return null;
        },
        resolveRecentLocallang(entry) {
            for (const extension of this.$store.getters.extensions) {
                for (const locallang of Object.values(extension.locallangs)) {
                    if (locallang.path === entry.path || locallang.uid === entry.uid) {
                        return {
                            uid: locallang.uid,
                            path: locallang.path,
                            filename: locallang.filename,
                            extensionName: extension.name,
                        };
                    }
                }
            }

            return null;
        },
    },
    computed: {
        selectedLocallang() {
            return this.$store.getters.locallang(this.selectedLocallangUid);
        },
        getGitUrl() {
            return this.$store.getters.config.gitUrl;
        },
        version() {
            return this.$store.getters.config.version;
        },
        recentLocallangs() {
            return this.recentLocallangEntries
                .map((entry) => this.resolveRecentLocallang(entry))
                .filter(Boolean);
        },
    },
    mounted() {
        if (this.$store.getters.config.provider) {
            this.$store.dispatch("fetchProviderStatus");
        }
        this.$store.watch(
            (state) => state.extension.toastMessages,
            (toastMessages) => {
                const toast = toastMessages.slice(-1)[0];
                console.log("%cNOTIFY " + toast.text, "color:orange");
                this.$notify({
                    verticalAlign: "top",
                    horizontalAlign: "right",
                    type: toast.variant,
                    message: toast.text,
                    timeout: 5000,
                });
            }
        );
        window.addEventListener("CRITICAL_ERROR", (e) => {
            console.error("CRITICAL ERROR");
            console.log(e);
            this.error = true;
        });
    },
};
</script>

<style lang="scss">

</style>
<style lang="scss">
/* Otherwise theres no scrolling allowed in the iframe, because we're not using the be:container-viewhelper */
.main {
    display:flex;
}

.main-content {
    width: 100%;
}

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
}

.form-row {
    gap: 0;
    align-items: start;
}

.form-select {
    min-width: auto;
}

.b-form-tag-remove {
    background: var(--typo3-state-yellow-focus-bg);
}

// Disable annoying text-selection on mouse move
.tooltip {
    pointer-events: none;
}

.input-group-prepend {
    >.input-group-text {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        height: 100%;
    }
}

</style>
