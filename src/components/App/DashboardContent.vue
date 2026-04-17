<template>
    <div>
        <locallang v-if="locallang" :key="locallang.uid" :locallang="locallang"/>
        <div v-else>
            <b-container class="pb-6">
                <div class="d-flex justify-content-lg-center px-3 my-2 align-items-center">
                    <div class="callout callout-info">
                        <div class="callout-content">
                            <div class="callout-title"></div>
                            <div class="callout-body">
                                Please first select a locallang file in the sidebar in order to be able to edit the translations.
                            </div>
                        </div>
                    </div>
                </div>
                <b-row>
                    <b-col>
                        <b-alert v-if="getProviderName" show variant="default">
                            <i class="ni ni-check-bold"></i> Selected Auto-Translate-Provider: {{ getProviderName }}
                        </b-alert>
                        <b-alert v-else show variant="danger">
                            No active configuration for the translation feature was found. Please define one in Typoscript so that this feature can be used.
                        </b-alert>
                    </b-col>
                </b-row>
                <!-- Card stats -->

                <b-row>
                    <b-col md="6">
                        <b-card v-if="shouldShowProviderStatusCard" no-body>
                            <b-card-header class="d-flex justify-content-between align-items-center">
                                <strong>Provider status</strong>
                                <b-spinner v-if="providerStatusLoading" small label="Loading"/>
                            </b-card-header>
                            <b-card-body>
                                <div class="mb-3">
                                    <div class="text-uppercase text-muted small font-weight-bold">Configured provider</div>
                                    <div class="h4 mb-0">{{ providerStatusDisplayName }}</div>
                                </div>
                                <b-alert :show="true" :variant="providerStatusVariant" class="mb-3">
                                    <i :class="providerStatusIconClass"></i>
                                    {{ providerStatusMessage }}
                                </b-alert>
                                <div v-if="hasQuotaDetails">
                                    <div class="text-uppercase text-muted small font-weight-bold">Remaining quota</div>
                                    <div class="h4 mb-0">{{ formattedQuotaRemaining }} / {{ formattedQuotaLimit }} {{ providerStatus.quotaUnit }}</div>
                                    <small class="text-muted d-block">Used: {{ formattedQuotaUsed }} {{ providerStatus.quotaUnit }}</small>
                                </div>
                                <small
                                    v-if="providerStatus && providerStatus.quotaMessage"
                                    :class="{'mt-3': hasQuotaDetails}"
                                    class="text-muted d-block"
                                >
                                    {{ providerStatus.quotaMessage }}
                                </small>
                            </b-card-body>
                        </b-card>
                    </b-col>
                    <b-col md="6" v-if="hasRecentLocallangs">
                        <b-card no-body>
                            <b-card-header>
                                <strong>Recently opened files</strong>
                            </b-card-header>
                            <b-list-group flush>
                                <b-list-group-item
                                    v-for="recentLocallang in recentLocallangs"
                                    :key="recentLocallang.path"
                                    button
                                    class="d-flex justify-content-between align-items-center"
                                    @click="$emit('locallang', recentLocallang.uid)"
                                >
                                    <span class="d-flex align-items-center">
                                        <file-xml-icon height="16px" width="16px"/>
                                        <span class="ml-2">{{ recentLocallang.filename }}</span>
                                    </span>
                                    <small class="text-muted">{{ recentLocallang.extensionName }}</small>
                                </b-list-group-item>
                            </b-list-group>
                        </b-card>
                    </b-col>

                    <b-col md="6">
                        <ExcludedExtensions/>
                    </b-col>
                </b-row>



            </b-container>
        </div>
    </div>
</template>

<script>
import Locallang from "./Locallang/Locallang";
import ExcludedExtensions from "./ExcludedExtensions";
import axios from "axios";
import * as proxy from "../../scripts/Proxy";

export default {
    props: ["locallang", "recentLocallangs"],
    components: {
        Locallang,
        ExcludedExtensions,
    },
    data: function () {
        return {
            providerStatus: null,
            providerStatusLoading: false,
        };
    },
    mounted: function () {
        if (this.getProviderName) {
            this.fetchProviderStatus();
        }
    },
    computed: {
        getProviderName: function () {
            return this.$store.getters.config.provider;
        },
        hasRecentLocallangs: function () {
            return this.recentLocallangs.length > 0;
        },
        shouldShowProviderStatusCard: function () {
            return !!this.getProviderName;
        },
        providerStatusDisplayName: function () {
            if (this.providerStatus && this.providerStatus.provider) {
                return this.providerStatus.provider;
            }

            return this.getProviderName;
        },
        providerStatusMessage: function () {
            if (this.providerStatusLoading) {
                return "Checking the configured provider...";
            }

            if (this.providerStatus && this.providerStatus.message) {
                return this.providerStatus.message;
            }

            return "No provider status is available yet.";
        },
        providerStatusVariant: function () {
            if (this.providerStatusLoading) {
                return "secondary";
            }

            if (!this.providerStatus) {
                return "secondary";
            }

            if (this.providerStatus.valid === true) {
                return "success";
            }

            if (this.providerStatus.valid === false) {
                return "danger";
            }

            return "warning";
        },
        providerStatusIconClass: function () {
            if (this.providerStatusLoading) {
                return "ni ni-settings-gear-65";
            }

            if (this.providerStatus && this.providerStatus.valid === true) {
                return "ni ni-check-bold";
            }

            if (this.providerStatus && this.providerStatus.valid === false) {
                return "ni ni-fat-remove";
            }

            return "ni ni-notification-70";
        },
        hasQuotaDetails: function () {
            return !!(
                this.providerStatus &&
                this.providerStatus.quotaAvailable &&
                typeof this.providerStatus.quotaRemaining === "number" &&
                typeof this.providerStatus.quotaLimit === "number"
            );
        },
        formattedQuotaRemaining: function () {
            return this.formatNumber(this.providerStatus && this.providerStatus.quotaRemaining);
        },
        formattedQuotaUsed: function () {
            return this.formatNumber(this.providerStatus && this.providerStatus.quotaUsed);
        },
        formattedQuotaLimit: function () {
            return this.formatNumber(this.providerStatus && this.providerStatus.quotaLimit);
        },
    },
    methods: {
        fetchProviderStatus: async function () {
            this.providerStatusLoading = true;

            try {
                const response = await axios.get(proxy.apiPath("api-provider-status"));
                this.providerStatus = response && response.data ? response.data.data : null;
            } catch (error) {
                this.providerStatus = {
                    provider: this.getProviderName,
                    valid: null,
                    quotaAvailable: false,
                    message: error.response && error.response.data && error.response.data.message
                        ? error.response.data.message
                        : "The provider status could not be loaded.",
                    quotaMessage: "",
                };
            } finally {
                this.providerStatusLoading = false;
            }
        },
        formatNumber: function (value) {
            if (typeof value !== "number") {
                return "n/a";
            }

            return value.toLocaleString();
        },
    },
};
</script>

<style>
</style>
