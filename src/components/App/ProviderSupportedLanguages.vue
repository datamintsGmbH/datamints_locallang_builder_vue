<template>
    <div v-if="providerName" class="provider-supported-languages mt-3">
        <details v-if="languages.length > 0" class="provider-supported-languages__details">
            <summary class="provider-supported-languages__summary">
                {{ providerName }} supports {{ languages.length }} target language codes
            </summary>

            <div class="table-responsive mt-2">
                <table class="table table-sm mb-0">
                    <thead>
                    <tr>
                        <th scope="col">Code</th>
                        <th scope="col">Language</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="language in languages" :key="language.code">
                        <td>
                            <code>{{ language.code }}</code>
                        </td>
                        <td>{{ language.name }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </details>

        <small v-else class="text-muted d-block">
            The supported target languages for {{ providerName }} are currently unavailable.
        </small>
    </div>
</template>

<script>
export default {
    name: "ProviderSupportedLanguages",
    props: {
        providerName: {
            type: String,
            default: "",
        },
        languages: {
            type: Array,
            default: () => [],
        },
    },
};
</script>

<style scoped>
.provider-supported-languages__details {
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 0.375rem;
    background-color: #fff;
}

.provider-supported-languages__summary {
    cursor: pointer;
    padding: 0.75rem 1rem;
    font-weight: 600;
    list-style: none;
}

.provider-supported-languages__summary::-webkit-details-marker {
    display: none;
}

.provider-supported-languages__summary::before {
    content: ">";
    display: inline-block;
    margin-right: 0.5rem;
    transition: transform 0.2s ease;
}

.provider-supported-languages__details[open] .provider-supported-languages__summary::before {
    transform: rotate(90deg);
}
</style>
