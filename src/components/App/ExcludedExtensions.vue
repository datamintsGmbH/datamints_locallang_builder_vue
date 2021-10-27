<template>
    <div>
        <stats-card icon="ni ni-active-40"
                    type="gradient-red">
            <h5 v-b-tooltip.hover class="card-title text-uppercase text-muted" title="A list of extensions that should not be displayed can be maintained in typoscript">Excluded extensions</h5>
            <span class="font-weight-bold">
                <ul>
                    <li v-for="excludedExtension in getExcludedExtensions" :key="excludedExtension">
                        {{ excludedExtension }}
                    </li>
                </ul>
            </span>
        </stats-card>
    </div>
</template>

<script>

export default {
    props: [],
    components: {},
    computed: {
        getExcludedExtensions: function () {
            return this.$store.getters.config.excludedExtensions.split(/[,;]/);
        },
    }
};
</script>

<style>
</style>
