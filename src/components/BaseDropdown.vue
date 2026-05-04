<template>
  <component
    :is="tag"
    :class="['base-dropdown', dropdownClass, { show: isOpen }]"
    v-click-outside="closeDropDown"
    @keydown.esc.stop.prevent="closeDropDown"
  >
    <slot
      name="title-container"
      :is-open="isOpen"
      :toggle-dropdown="toggleDropDown"
      :close-dropdown="closeDropDown"
    >
      <component
        :is="titleTag"
        class="base-dropdown__toggle btn-rotate"
        :class="[{'dropdown-toggle': hasToggle}, titleClasses]"
        :aria-expanded="isOpen"
        aria-haspopup="true"
        :type="titleTag === 'button' ? 'button' : null"
        @click.stop="toggleDropDown"
      >
        <slot name="title" :is-open="isOpen">
          <i :class="icon"></i> {{ title }}
        </slot>
      </component>
    </slot>
    <ul
      class="base-dropdown__menu dropdown-menu"
      :class="[
        { show: isOpen },
        { 'dropdown-menu-right': menuOnRight },
        menuClasses
      ]" 
      @click.stop
    >
      <slot></slot>
    </ul>
  </component>
</template>
<script>
export default {
  name: 'base-dropdown',
  props: {
    tag: {
      type: String,
      default: 'div',
      description: 'Dropdown html tag (e.g div, ul etc)'
    },
    titleTag: {
      type: String,
      default: 'button',
      description: 'Dropdown title (toggle) html tag'
    },
    title: {
      type: String,
      description: 'Dropdown title'
    },
    direction: {
      type: String,
      default: 'down', // up | down
      description: 'Dropdown menu direction (up|down|left|right)'
    },
    icon: {
      type: String,
      description: 'Dropdown icon'
    },
    titleClasses: {
      type: [String, Object, Array],
      description: 'Title css classes'
    },
    menuClasses: {
      type: [String, Object],
      description: 'Menu css classes'
    },
    menuOnRight: {
      type: Boolean,
      description: 'Whether menu should appear on the right'
    },
    hasToggle: {
      type: Boolean,
      description: 'Whether dropdown has arrow icon shown',
      default: true
    }
  },
  data() {
    return {
      isOpen: false
    };
  },
  computed: {
    dropdownClass() {
      if (this.direction === 'up') {
        return 'dropup';
      }
      if (this.direction === 'left') {
        return 'dropleft';
      }
      if (this.direction === 'right') {
        return 'dropright';
      }
      return 'dropdown';
    }
  },
  methods: {
    toggleDropDown(event) {
      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      this.isOpen = !this.isOpen;
      this.$emit('change', this.isOpen);
    },
    closeDropDown() {
      if (!this.isOpen) {
        return;
      }
      this.isOpen = false;
      this.$emit('change', false);
    }
  }
};
</script>
<style lang="scss">
.base-dropdown {
  display: inline-block;
  position: relative;
  user-select: none;
}

.base-dropdown__toggle {
  align-items: center;
  display: inline-flex;
  justify-content: center;
}

.base-dropdown__toggle.dropdown-toggle::after {
  border-left: 0.3em solid transparent;
  border-right: 0.3em solid transparent;
  border-top: 0.3em solid currentColor;
  content: "";
  display: inline-block;
  margin-left: 0.35rem;
  transition: transform 0.2s ease;
  vertical-align: middle;
}

.base-dropdown.dropup .base-dropdown__toggle.dropdown-toggle::after,
.base-dropdown.show > .base-dropdown__toggle.dropdown-toggle::after {
  transform: rotate(180deg);
}

.base-dropdown__menu {
  background: var(--module-bg, #fff);
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  display: none;
  left: 0;
  list-style: none;
  margin: 0.125rem 0 0;
  min-width: 10rem;
  padding: 0.5rem 0;
  position: absolute;
  top: 100%;
  z-index: 1050;
}

.base-dropdown__menu.show {
  display: block;
}

.base-dropdown.dropup .base-dropdown__menu {
  bottom: 100%;
  margin: 0 0 0.125rem;
  top: auto;
}

.base-dropdown.dropright .base-dropdown__menu {
  left: 100%;
  margin: 0 0 0 0.125rem;
  top: 0;
}

.base-dropdown.dropleft .base-dropdown__menu {
  left: auto;
  margin: 0 0.125rem 0 0;
  right: 100%;
  top: 0;
}

.base-dropdown__menu.dropdown-menu-right {
  left: auto;
  right: 0;
}

.base-dropdown__menu .dropdown-item {
  background-color: transparent;
  border: 0;
  clear: both;
  color: var(--typo3-text-color-base, #212529);
  cursor: pointer;
  display: block;
  font-weight: 400;
  padding: 0.25rem 1rem;
  text-align: inherit;
  text-decoration: none;
  white-space: nowrap;
  width: 100%;
}

.base-dropdown__menu .dropdown-item:hover,
.base-dropdown__menu .dropdown-item:focus {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--typo3-text-color-base, #212529);
  outline: 0;
}

.base-dropdown__menu .dropdown-divider {
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  margin: 0.5rem 0;
}

.base-dropdown__menu .dropdown-header {
  color: #6c757d;
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0;
  padding: 0.5rem 1rem;
}
</style>
