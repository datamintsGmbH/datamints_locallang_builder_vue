<template>
    <div>


        <!-- Header -->
        <div class="header bg-primary pt-1">
            <b-container>
                <div class="header-body text-center my-2">
                    <b-row class="justify-content-center">
                        <b-col class="px-5" lg="8" md="10" xl="7">
                            <div class="d-flex align-items-end">
                                <span class="h1 mr-4"><translation-icon height="86px" width="86px"></translation-icon></span><span class="h1 text-white"> datamints_locallang_builder</span>

                            </div>
                        </b-col>
                        <b-col cols="8">
                            <p class="text-lead text-white pb-5">Modify language files!</p>
                        </b-col>
                    </b-row>
                </div>
            </b-container>
            <div class="separator separator-bottom separator-skew zindex-100">
                <svg preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" xmlns="http://www.w3.org/2000/svg"
                     y="0">
                    <polygon class="fill-white" points="2560 0 2560 100 0 100"></polygon>
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SplashScreen",
};
</script>
