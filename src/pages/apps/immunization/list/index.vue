<script setup>
import { VDataTableServer } from "vuetify/labs/VDataTable";
import { paginationMeta } from "@/@fake-db/utils";
import axios from "axios";
import { useStore } from "vuex";
import moment from 'moment';
import { toastMessage } from '@/swal';


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


const calculateAge = (dob) => {
   return moment().diff(dob, 'years', true).toFixed(1)
}


const formatDate = (dateStr, format = 'LLL') => {
  return moment(dateStr).format(format)
}

const headers = [
  {
    title: "ID",
    key: "id",
  },
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Immunization Name",
    key: "immName",
  },
  {
    title: "Date",
    key: "immDate",
  },
  {
    title: "Booth Location",
    key: "location",
  },
  {
    title : "Physician",
    key: "physician",
  },
  {
    title: "Remark",
    key: "remark",
  },
  {
    title: "Child",
    key: "child",
  }
];

// 👉 Fetching posts
const fetchUsers = () => {
  axios
    .get(`${store.state.apiUrl}/immunization-record?page=${options.value.page}`)
    .then(({ data }) => {
      users.value = data.data.records;
      totalUsers.value = data.data.total_items;
      options.value.page = data.data.current_page;
      options.value.itemsPerPage = data.data.per_page;
    })
    .catch((err) => {
      toastMessage(err.response.data.message, 'error')
    });
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
        <template #item.child="{ item }">
          <div class="d-flex align-center" v-if="item.raw.child && Object.keys(item.raw.child)">
            <VAvatar
              :image="item.raw.child.image"
              size="38"
              :variant="!item.raw.avatar ? 'tonal' : undefined"
              :color="undefined"
              class="me-3"
            >
              <VImg v-if="item.raw.child.image" :src="item.raw.user.image" />
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-body-1 font-weight-medium">
                
                  {{ item.raw.child.name }}
               
              </h6>
              <span class="text-sm text-disabled">Age : {{ calculateAge(item.raw.child.dob) }} Years</span>
            </div>
          </div>
        </template>

        <template #item.id="{ item }">
          <span class="text-capitalize font-weight-medium">{{
              item.raw.id
            }}</span>
        </template>


        <template #item.name="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            item.raw.first_name + ' ' + item.raw.last_name
          }}</span>
        </template>

        <!-- Plan -->
        <template #item.immName="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            item.raw.immunization_name
          }}</span>
        </template>

        <template #item.immDate="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            formatDate(item.raw.immunization_date)
          }}</span>
        </template>

        <template #item.location="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            item.raw.booth_location
          }}</span>
        </template>

        <template #item.remark="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            item.raw.remark
          }}</span>
        </template>

        <template #item.physician="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            item.raw.associated_physician
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
