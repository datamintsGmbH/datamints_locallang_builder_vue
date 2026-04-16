import Sidebar from './SideBar.vue';
import SidebarItem from './SidebarItem.vue';

const SidebarStore = {
  showSidebar: true,
  sidebarLinks: [],
  isMinimized: false,
  breakpoint: 1200,
  hovered: false,
  expandSidebar() {
    this.isMinimized = false;
    this.showSidebar = true;
    let docClasses = document.body.classList;
    docClasses.add('g-sidenav-pinned');
    docClasses.add('g-sidenav-show');
    docClasses.remove('g-sidenav-hidden');
    docClasses.remove('g-sidenav-hide');
  },
  displaySidebar() {
    this.expandSidebar();
  },
  toggleMinimize() {
    this.expandSidebar();
  },
  onMouseEnter() {
    this.hovered = true;
  },
  onMouseLeave() {
    this.hovered = false;
  }
};

const SidebarPlugin = {
  install(Vue, options) {
    if (options && options.sidebarLinks) {
      SidebarStore.sidebarLinks = options.sidebarLinks;
    }
    let app = new Vue({
      data: {
        sidebarStore: SidebarStore
      }
    });
    Vue.prototype.$sidebar = app.sidebarStore;
    Vue.component('side-bar', Sidebar);
    Vue.component('sidebar-item', SidebarItem);
  }
};

export default SidebarPlugin;
