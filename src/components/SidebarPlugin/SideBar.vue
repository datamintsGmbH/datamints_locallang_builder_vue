<template>
  <!-- Left div because b-navbar does not trigger on mouseenter / mouseleave events -->
  <div class="sidenav navbar navbar-vertical fixed-left navbar-expand-xs navbar-primary tree"
       @mouseenter="$sidebar.onMouseEnter()"
       @mouseleave="$sidebar.onMouseLeave()"
       :data="backgroundColor">
    <div class="scrollbar-inner" ref="sidebarScrollArea">
      <div class="tree-toolbar">
        <div class="ml-auto">
          <!-- Sidenav toggler -->
          <div class="sidenav-toggler"
               :class="{'active': !$sidebar.isMinimized }"
               @click="minimizeSidebar">
            <div class="sidenav-toggler-inner">
              <i class="sidenav-toggler-line"></i>
              <i class="sidenav-toggler-line"></i>
              <i class="sidenav-toggler-line"></i>
            </div>
          </div>
        </div>
      </div>
      <slot></slot>
      <div class="nodes-container">
          <div class="nodes-root">
              <div class="nodes-list" style="height:100%;">
                <b-navbar-nav>
                  <slot name="links">
                    <sidebar-item
                      v-for="(link, index) in sidebarLinks"
                      :key="link.name + index"
                      :link="link"
                    >
                      <sidebar-item
                        v-for="(subLink, index) in link.children"
                        :key="subLink.name + index"
                        :link="subLink"
                      >
                      </sidebar-item>
                    </sidebar-item>
                  </slot>
                </b-navbar-nav>
            </div>
          </div>
        <slot name="links-after"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "sidebar",
  props: {
    title: {
      type: String,
      default: "Creative Tim",
      description: "Sidebar title",
    },
    shortTitle: {
      type: String,
      default: "CT",
      description: "Sidebar short title",
    },
    backgroundColor: {
      type: String,
      default: "vue",
      validator: (value) => {
        let acceptedValues = [
          "",
          "vue",
          "blue",
          "green",
          "orange",
          "red",
          "primary",
        ];
        return acceptedValues.indexOf(value) !== -1;
      },
      description:
        "Sidebar background color (vue|blue|green|orange|red|primary)",
    },
    sidebarLinks: {
      type: Array,
      default: () => [],
      description:
        "List of sidebar links as an array if you don't want to use components for these.",
    },
    autoClose: {
      type: Boolean,
      default: true,
      description:
        "Whether sidebar should autoclose on mobile when clicking an item",
    },
  },
  provide() {
    return {
      autoClose: this.autoClose,
    };
  },
  methods: {
    minimizeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.toggleMinimize();
      }
    },
  },
  mounted() {
    this.$sidebar.isMinimized = this.$sidebar.breakpoint < window.innerWidth;
    this.minimizeSidebar();
  },
  beforeDestroy() {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false;
    }
  },
};
</script>
