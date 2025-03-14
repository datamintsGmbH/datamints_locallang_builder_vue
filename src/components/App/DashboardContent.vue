<template>
    <div>
        <locallang v-if="locallang" :key="locallang.uid" :locallang="locallang"/>
        <div v-else>
            <b-container class="pb-6">
                <div class="d-flex justify-content-lg-center px-3 my-2 align-items-center">
                    <div class="callout callout-info"><div class="callout-icon"><span class="icon-emphasized"><span class="t3js-icon icon icon-size-small icon-state-default icon-actions-info" data-identifier="actions-info" aria-hidden="true">
	<span class="icon-markup">
<svg class="icon-color"><use xlink:href="/_assets/1ee1d3e909b58d32e30dcea666dd3224/Icons/T3Icons/sprites/actions.svg#actions-info"></use></svg>
	</span>

</span></span></div><div class="callout-content"><div class="callout-title"></div><div class="callout-body">Please first select a locallang file in the sidebar in order to be able to edit the translations.</div></div></div>

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
                        <ExcludedExtensions/>
                    </b-col>
                    <b-col md="6">

                    </b-col>
                    <!--                    <b-col md="6" xl="3">-->
                    <!--                        <stats-card icon="ni ni-money-coins"-->
                    <!--                                    sub-title="N/A"-->
                    <!--                                    title="Export-Count"-->
                    <!--                                    type="gradient-green">-->
                    <!--                        </stats-card>-->

                    <!--                    </b-col>-->
                    <!--                    <b-col md="6" xl="3">-->
                    <!--                        <stats-card icon="ni ni-chart-bar-32"-->
                    <!--                                    sub-title="N/A"-->
                    <!--                                    title="Auto-Translations"-->
                    <!--                                    type="gradient-info">-->
                    <!--                        </stats-card>-->
                    <!--                    </b-col>-->
                </b-row>
            </b-container>
        </div>
    </div>
</template>

<script>
import Locallang from "./Locallang/Locallang";
import ExcludedExtensions from "./ExcludedExtensions";

export default {
    props: ["locallang"],
    components: {
        Locallang,
        ExcludedExtensions,
    },
    computed: {
        getProviderName: function () {
            return this.$store.getters.config.provider;
        },
    }
};
</script>

<style>
</style>
