<script setup>
import { VDataTableServer } from "vuetify/labs/VDataTable";
import { paginationMeta } from "@/@fake-db/utils";
import AddNewUserDrawer from "@/views/apps/user/list/AddNewUserDrawer.vue";
import { useUserListStore } from "@/views/apps/user/useUserListStore";
import { avatarText } from "@core/utils/formatters";
import axios from "axios";
import { useStore } from "vuex";

const store = useStore();
const userListStore = useUserListStore();
const searchQuery = ref("");
const selectedRole = ref();
const selectedPlan = ref();
const selectedStatus = ref();
const totalUsers = ref(0);
const users = ref([]);

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
});

const headers = [
  {
    title: "ID",
    key: "id",
  },
  {
    title: "Posted By",
    key: "user",
  },
  {
    title: "Title",
    key: "title",
  },
  {
    title: "Description",
    key: "description",
  },
  {
    title: "Total Comments",
    key: "comments",
  },
  {
    title: "Actions",
    key: "actions",
    sortable: false,
  },
];

// 👉 Fetching posts
const fetchUsers = () => {
  axios
    .get(`${store.state.apiUrl}/forum/posts/all?page=1&topic_type_id=1}`)
    .then(({ data }) => {
      console.log(data.data);
      users.value = data.data.posts;
      totalUsers.value = data.data.total_items;
      options.value.page = data.data.current_page;
      options.value.itemsPerPage = data.data.per_page;
    })
    .catch((err) => console.log(err));
  // userListStore.fetchUsers({
  //   q: searchQuery.value,
  //   status: selectedStatus.value,
  //   plan: selectedPlan.value,
  //   role: selectedRole.value,
  //   options: options.value,
  // }).then(response => {
  //   users.value = response.data.users
  //   totalUsers.value = response.data.totalUsers
  //   options.value.page = response.data.page
  // }).catch(error => {
  //   console.error(error)
  // })
};

watchEffect(fetchUsers);

// 👉 search filters
const roles = [
  {
    title: "Admin",
    value: "admin",
  },
  {
    title: "Author",
    value: "author",
  },
  {
    title: "Editor",
    value: "editor",
  },
  {
    title: "Maintainer",
    value: "maintainer",
  },
  {
    title: "Subscriber",
    value: "subscriber",
  },
];

const getWordStr = (str) => {
    return str.split(/\s+/).slice(0, 6).join(" ");
}

const resolveUserStatusVariant = (stat) => {
  const statLowerCase = stat.toLowerCase();
  if (statLowerCase === "pending") return "warning";
  if (statLowerCase === "active") return "success";
  if (statLowerCase === "inactive") return "secondary";

  return "primary";
};

const isAddNewUserDrawerVisible = ref(false);

const addNewUser = (userData) => {
  userListStore.addUser(userData);

  // refetch User
  fetchUsers();
};

const deleteUser = (id) => {
  userListStore.deleteUser(id);

  // refetch User
  fetchUsers();
};
</script>

<template>
  <section>
    <VCard>
      <VCardText class="d-flex flex-wrap gap-4">
        <!-- <AppSelect
          :model-value="options.itemsPerPage"
          :items="[
            { value: 10, title: '10' },
            { value: 25, title: '25' },
            { value: 50, title: '50' },
            { value: 100, title: '100' },
            { value: -1, title: 'All' },
          ]"
          style="width: 5rem"
          @update:model-value="options.itemsPerPage = parseInt($event, 10)"
        /> -->

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
        <!--  👉 Search  -->
          <AppTextField
            v-model="searchQuery"
            placeholder="Search"
            density="compact"
            style="width: 12.5rem"
          />

        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION datatable -->
      <VDataTableServer
        v-model:items-per-page="options.itemsPerPage"
        v-model:page="options.page"
        :items="users"
        :items-length="totalUsers"
        :headers="headers"
        class="text-no-wrap"
        @update:options="options = $event"
      >
        <!-- User -->
        <template #item.user="{ item }">
          <div class="d-flex align-center">
            <VAvatar
              :image="item.raw.user.image"
              size="38"
              :variant="!item.raw.avatar ? 'tonal' : undefined"
              :color="undefined"
              class="me-3"
            >
              <VImg v-if="item.raw.user.image" :src="item.raw.user.image" />
            </VAvatar>
            <span>{{ item.raw.user.name }}</span>
            <div class="d-flex flex-column">
              <h6 class="text-body-1 font-weight-medium">
                <RouterLink
                  :to="{
                    name: 'apps-user-view-id',
                    params: { id: item.raw.id },
                  }"
                  class="user-list-name"
                >
                  {{ item.raw.fullName }}
                </RouterLink>
              </h6>
              <span class="text-sm text-disabled">{{ item.raw.email }}</span>
            </div>
          </div>
        </template>

        <template #item.id="{ item }">
          <span class="text-capitalize font-weight-medium">{{
              item.raw.id
            }}</span>
        </template>


        <template #item.title="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            item.raw.title
          }}</span>
        </template>

        <!-- Plan -->
        <template #item.description="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            getWordStr(item.raw.description) + '...'
          }}</span>
        </template>
        <template #item.comments="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            item.raw.total_comments
          }}</span>
        </template>


        <template #bottom>
          <VDivider />

          <div
            class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3"
          >
            <p class="text-sm text-disabled mb-0">
              {{ paginationMeta(options, totalUsers) }}
            </p>

            <VPagination
              v-model="options.page"
              :length="Math.ceil(totalUsers / options.itemsPerPage)"
              :total-visible="
                $vuetify.display.xs
                  ? 1
                  : Math.ceil(totalUsers / options.itemsPerPage)
              "
            >
              <template #prev="slotProps">
                <VBtn
                  variant="tonal"
                  color="default"
                  v-bind="slotProps"
                  :icon="false"
                >
                  Previous
                </VBtn>
              </template>

              <template #next="slotProps">
                <VBtn
                  variant="tonal"
                  color="default"
                  v-bind="slotProps"
                  :icon="false"
                >
                  Next
                </VBtn>
              </template>
            </VPagination>
          </div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">

          <IconBtn :to="{ name: 'apps-invoice-preview-id', params: { id: item.raw.id } }">
            <VIcon icon="tabler-eye" />
          </IconBtn>
        </template>
      </VDataTableServer>

      <!-- SECTION -->
    </VCard>

    <!-- 👉 Add New User -->
    <AddNewUserDrawer
      v-model:isDrawerOpen="isAddNewUserDrawerVisible"
      @user-data="addNewUser"
    />
  </section>
</template>

<style lang="scss">
.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
}
</style>
