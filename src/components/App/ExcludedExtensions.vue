<template>
    <div>
        <stats-card icon="ni ni-active-40"
                    type="gradient-red">
            <h5 v-b-tooltip.hover class="card-title text-uppercase text-muted" :title="cardTooltip">{{ cardTitle }}</h5>
            <div class="font-weight-bold">
                <ul>
                    <li v-for="extension in activeExtensions" :key="extension">
                        {{ extension }}
                    </li>
                </ul>
                <p>
                    {{ cardDescription }}
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
        usesAllowedExtensions: function () {
            return this.$store.getters.config.allowedExtensions.trim().length > 0;
        },
        activeExtensions: function () {
            const configuredExtensions = this.usesAllowedExtensions
                ? this.$store.getters.config.allowedExtensions
                : this.$store.getters.config.excludedExtensions;

            return configuredExtensions
                .split(/[,;/]/)
                .map((extension) => extension.trim())
                .filter((extension) => extension.length > 0);
        },
        cardTitle: function () {
            return this.usesAllowedExtensions ? "Allowed extensions" : "Excluded extensions";
        },
        cardTooltip: function () {
            return this.usesAllowedExtensions
                ? "If allowed extensions are configured in TypoScript, only these extensions are displayed"
                : "A list of extensions that should not be displayed can be maintained in TypoScript";
        },
        cardDescription: function () {
            return this.usesAllowedExtensions
                ? "The allow list is active. Excluded extensions are ignored until the allow list is empty."
                : "You can modify the list in the extension settings.";
        }
    }
};
</script>

<style>
</style>
