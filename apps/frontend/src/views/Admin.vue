<template>
  <Base title="Heimdall - Admin Panel">
    <template #main-content>
      <v-tabs v-model="activeTab" fixed-tabs dark>
        <v-tab key="users"> User Management </v-tab>
        <v-tab key="statistics"> Statistics </v-tab>
      </v-tabs>
      <v-container>
        <v-row>
          <v-col>
            <v-card>
              <v-tabs-items v-model="activeTab">
                <v-tab-item key="users">
                  <UserManagement />
                </v-tab-item>
                <v-tab-item key="statistics">
                  <statistics />
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </Base>
</template>

<script lang="ts">
import Statistics from '@/components/global/admin/Statistics.vue';
import UserManagement from '@/components/global/admin/UserManagement.vue';
import Base from '@/views/Base.vue';
import Vue from 'vue';
import {Component} from 'vue-property-decorator';

@Component({
  components: {
    Base,
    UserManagement,
    Statistics
  }
})
export default class Admin extends Vue {
  activeTab = 'users';
}
</script>
