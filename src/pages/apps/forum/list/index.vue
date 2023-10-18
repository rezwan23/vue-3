<script setup>
import { VDataTableServer } from "vuetify/labs/VDataTable"
import { paginationMeta } from "@/@fake-db/utils"
import axios from "axios"
import { useStore } from "vuex"
import _ from 'lodash'
import { toastMessage } from '../../../../swal'
import Loader from '../../../../Loader.vue'


const store = useStore()
const searchQuery = ref("")
const search = ref("")
const totalPosts = ref(0)
const posts = ref([])
const typeId = ref(1)
const forumTypes = ref([])
const types = ref([])

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
});

const setSearchQuery = () => {
  searchQuery.value = search.value
}


const debounceSearchQuery = _.debounce(setSearchQuery, 500)

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


onMounted(() => {
  getTypes()
})

const getTypes = () => {
  axios.get(`${store.state.apiUrl}/forum/topic-types`)
    .then(({ data }) => {
      forumTypes.value = data.data

      let arr = []
      let ind = 0;
      data.data.forEach(function (item) {
        if (ind == 0) {
          typeId.value = item.id
          ind++
        }
        arr.push({ value: item.id, title: item.name })
      })
      types.value = arr
    })
    .catch((err) => console.log(err));
}

// 👉 Fetching posts
const fetchPosts = () => {
  store.commit('requestStarted')
  axios
    .get(`${store.state.apiUrl}/forum/posts/all?page=${options.value.page}&topic_type_id=${typeId.value}&keywords=${searchQuery.value}`)
    .then(({ data }) => {
      store.commit('requestDone')
      posts.value = data.data.posts
      totalPosts.value = data.data.total_items
      options.value.page = data.data.current_page
      options.value.itemsPerPage = data.data.per_page
    })
    .catch((err) => {
      if (err.response.status == 404) {
        toastMessage(err.response.data.message, 'error')
      }
      store.commit('requestDone')

    })
};

watchEffect(fetchPosts)


const getWordStr = (str) => {
  return str.split(/\s+/).slice(0, 6).join(" ")
}


</script>

<template>
  <section>
    <Loader />
    <VCard>
      <VCardText class="d-flex flex-wrap gap-4">
        <AppSelect v-if="types.length" :model-value="typeId" :items="types" style="width: 10rem"
          @update:model-value="typeId = parseInt($event, 10)" />

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
          <!--  👉 Search  -->
          <AppTextField v-model="search" @input="debounceSearchQuery" placeholder="Search" density="compact"
            style="width: 12.5rem" />
        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION datatable -->
      <VDataTableServer v-model:items-per-page="options.itemsPerPage" v-model:page="options.page" :items="posts"
        :items-length="totalPosts" :headers="headers" class="text-no-wrap" @update:options="options = $event">
        <!-- User -->
        <template #item.user="{ item }">
          <div class="d-flex align-center">
            <VAvatar :image="item.raw.user.image" size="38" :variant="!item.raw.avatar ? 'tonal' : undefined"
              :color="undefined" class="me-3">
              <VImg v-if="item.raw.user.image" :src="item.raw.user.image" />
            </VAvatar>
            <span>{{ item.raw.user.name }}</span>
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
            getWordStr(item.raw.description) + "..."
          }}</span>
        </template>
        <template #item.comments="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            item.raw.total_comments
          }}</span>
        </template>

        <template #bottom>
          <VDivider />

          <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
            <p class="text-sm text-disabled mb-0">
              {{ paginationMeta(options, totalPosts) }}
            </p>

            <VPagination v-model="options.page" :length="Math.ceil(totalPosts / options.itemsPerPage)" :total-visible="$vuetify.display.xs
                ? 1
                : Math.ceil(totalPosts / options.itemsPerPage)
              ">
              <template #prev="slotProps">
                <VBtn variant="tonal" color="default" v-bind="slotProps" :icon="false">
                  Previous
                </VBtn>
              </template>

              <template #next="slotProps">
                <VBtn variant="tonal" color="default" v-bind="slotProps" :icon="false">
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
