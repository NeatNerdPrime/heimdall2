<template>
  <v-app-bar
    v-resize="onResize"
    :clipped-left="$vuetify.breakpoint.lgAndUp"
    app
    color="bar"
    dense
  >
    <!-- The title and nav bar -->
    <v-toolbar-title id="toolbar_title" class="pr-2">
      <v-app-bar-nav-icon
        v-if="!minimalTopbar"
        data-cy="openSidebar"
        @click.stop="$emit('toggle-drawer')"
      >
        <v-icon color="bar-visible">mdi-menu</v-icon>
      </v-app-bar-nav-icon>
      <span class="hidden-sm-and-down bar-visible--text">{{
        elipsisTitle
      }}</span>
    </v-toolbar-title>
    <v-spacer />

    <slot name="content" />

    <TopbarDropdown />
  </v-app-bar>
</template>

<script lang="ts">
import TopbarDropdown from '@/components/global/TopbarDropdown.vue';
import ServerMixin from '@/mixins/ServerMixin';
import {HeightsModule} from '@/store/heights';
import Component, {mixins} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

@Component({
  components: {
    TopbarDropdown
  }
})
export default class Topbar extends mixins(ServerMixin) {
  @Prop({type: String, required: true}) readonly title!: string;
  @Prop({default: false}) readonly minimalTopbar!: boolean;

  mounted() {
    this.onResize();
  }

  onResize() {
    this.$nextTick(() => {
      // Allow the page to settle before checking the topbar height
      // (this is what $nextTick is supposed to do but it's firing too quickly)
      setTimeout(() => {
        HeightsModule.setTopbarHeight(this.$el.clientHeight);
      }, 2000);
    });
  }

  /** Submits an event to clear all filters */
  clear(): void {
    this.$emit('clear');
  }

  get elipsisTitle() {
    return this.title.length > 50
      ? `${this.title.substring(0, 50)}...`
      : this.title;
  }
}
</script>
