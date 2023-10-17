<script setup>
import { VDataTableServer } from "vuetify/labs/VDataTable";
import { paginationMeta } from "@/@fake-db/utils";
import axios from "axios";
import { useStore } from "vuex";
import moment from 'moment';


const store = useStore();
const searchQuery = ref("");
const totalUsers = ref(0);
const users = ref([]);

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
});


const formatDate = (dateStr, format = 'LLL') => {
  return moment(dateStr).format(format)
}

const headers = [
  {
    title: "ID",
    key: "id",
  },
  {
    title: "Image",
    key: "image",
  },
  {
    title: "Role",
    key: "role",
  },
  {
    title: "Phone",
    key: "phone",
  },
  {
    title : "Gender",
    key: "gender",
  },
  {
    title: "Children",
    key: "children",
  }
];

// 👉 Fetching posts
const fetchUsers = () => {
  axios
    .get(`${store.state.apiUrl}/users?page=${options.value.page}`)
    .then(({ data }) => {
      console.log(data.data);
      users.value = data.data.users;
      totalUsers.value = data.data.total_items;
      options.value.page = data.data.current_page;
      options.value.itemsPerPage = data.data.per_page;
    })
    .catch((err) => console.log(err));
};

watchEffect(fetchUsers);


const getWordStr = (str) => {
    return str.split(/\s+/).slice(0, 6).join(" ");
}


</script>

<template>
  <section>
    <VCard>
      <VCardText class="d-flex flex-wrap gap-4">

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
        <template #item.image="{ item }">
          <div class="d-flex align-center">
            <VAvatar
              :image="item.raw.image"
              size="38"
              :variant="!item.raw.avatar ? 'tonal' : undefined"
              :color="undefined"
              class="me-3"
            >
              <VImg v-if="item.raw.image" :src="item.raw.image" />
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-body-1 font-weight-medium">
                
                  {{ item.raw.f_name + ' ' + item.raw.l_name }}
               
              </h6>
            </div>
          </div>
        </template>

        <template #item.id="{ item }">
          <span class="text-capitalize font-weight-medium">{{
              item.raw.id
            }}</span>
        </template>


        <!-- Plan -->
        <template #item.role="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            item.raw.role
          }}</span>
        </template>

        <template #item.phone="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            item.raw.phone_code + item.raw.phone
          }}</span>
        </template>

        <template #item.children="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            item.raw.children.length
          }}</span>
        </template>


        <template #item.gender="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            item.raw.gender
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

          <IconBtn :to="{ name: 'apps-forum-view-id', params: { id: item.raw.id } }">
            <VIcon icon="tabler-eye" />
          </IconBtn>
        </template>
      </VDataTableServer>

      <!-- SECTION -->
    </VCard>
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
