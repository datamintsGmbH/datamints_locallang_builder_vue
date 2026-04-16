<template>
    <div>
        <stats-card icon="ni ni-active-40"
                    type="gradient-red">
            <h5 v-b-tooltip.hover class="card-title text-uppercase text-muted" title="A list of extensions that should not be displayed can be maintained in typoscript">Excluded extensions</h5>
            <div class="font-weight-bold">
                <ul>
                    <li v-for="excludedExtension in getExcludedExtensions" :key="excludedExtension">
                        {{ excludedExtension }}
                    </li>
                </ul>
                <p>
                    You can modify the list in the extension-settings
                </p>
            </div>
        </stats-card>
    </div>
</template>

<script>

export default {
    props: [],
    components: {},
    computed: {
        getExcludedExtensions: function () {
            return this.$store.getters.config.excludedExtensions
                .split(/[,;]/)
                .map((extension) => extension.trim())
                .filter((extension) => extension.length > 0);
        },
    }
};
</script>

<style>
</style>
