<!--    This is the "base view" that we just modify with slots.
        Saves us the trouble of messing around with sidebar functionality
        in every view. "Subclass" by utilizing the slots. -->
<template>
  <div>
    <!-- Top appbar. The center content of it is configured via the topbar-content slot -->
    <Topbar
      v-if="showTopbar"
      :title="title"
      :style="{'z-index': topbarZIndex}"
      :minimal-topbar="minimalTopbar"
      @toggle-drawer="drawer = !drawer"
    >
      <template #content>
        <SearchBar v-if="showSearch" />
        <slot name="topbar-content" />
      </template>
    </Topbar>

    <!-- Sidebar to navigate between different views -->
    <Sidebar v-model="drawer" @changed-files="$emit('changed-files')" />

    <!-- The actual content. Slotted by our "descendants" -->
    <v-main>
      <UpdateNotification />
      <slot name="main-content" />
    </v-main>

    <slot>
      <!-- The default slot -->
    </slot>
  </div>
</template>

<script lang="ts">
import SearchBar from '@/components/global/SearchBar.vue';
import SearchHelpModal from '@/components/global/SearchHelpModal.vue';
import Sidebar from '@/components/global/Sidebar.vue';
import Topbar from '@/components/global/Topbar.vue';
import UpdateNotification from '@/components/global/UpdateNotification.vue';
import {SidebarModule} from '@/store/sidebar_state';
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

@Component({
  components: {
    SearchBar,
    SearchHelpModal,
    Sidebar,
    Topbar,
    UpdateNotification
  }
})
export default class Base extends Vue {
  @Prop({default: 'Heimdall'}) readonly title!: string;
  @Prop({default: 11}) readonly topbarZIndex!: number;
  @Prop({default: false}) readonly minimalTopbar!: boolean;
  @Prop({default: true}) readonly showTopbar!: boolean;
  @Prop({default: false}) readonly showSearch!: boolean;

  /** Models if the drawer is open */
  get drawer(): boolean {
    return SidebarModule.active;
  }

  set drawer(state: boolean) {
    SidebarModule.UpdateActive(state);
  }
}
</script>
