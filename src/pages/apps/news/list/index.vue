<script setup>
import { VDataTableServer } from "vuetify/labs/VDataTable"
import { paginationMeta } from "@/@fake-db/utils"
import axios from "axios"
import { useStore } from "vuex"
import moment from 'moment'
import { areYouSure, toastMessage } from '../../../../swal'
import _ from 'lodash'


const store = useStore()
const searchQuery = ref("")
const totalNews = ref(0)
const news = ref([])
const search = ref("")
const isDialogVisible = ref(false)
const title = ref('')
const description = ref('')
const id = ref(0)

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

const formatDate = (dateStr, format = 'LLL') => {
  return moment(dateStr).format(format)
}

const getUpdateForm = ({ raw }) => {
  isDialogVisible.value = true
  console.log(raw)
  title.value = raw.title
  description.value = raw.description
  id.value = raw.id
}

const deleteNews = (id) => {
  areYouSure(() => {
    axios.delete(`${store.state.apiUrl}/news/delete`, { data: { id: id } })
      .then(res => {
        fetchNews()
      }).catch(err => {
        console.log(err)
      })
  }, () => {
    console.log('no')

  })

}

const headers = [
  {
    title: "ID",
    key: "id",
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
    title: "Actions",
    key: "actions",
    sortable: false,
  },
];

const errors = ref({
  title: undefined,
  description: undefined,
})



const updateNews = () => {
  axios
    .put(`${store.state.apiUrl}/news/update`, {
      id: id.value,
      title: title.value,
      description: description.value
    })
    .then(({ data }) => {
      toastMessage(data.message, 'success')
      fetchNews()
      isDialogVisible.value = false
    })
    .catch((e) => {
      toastMessage(e.response.data.message, 'error')
      const { errors: formErrors } = e.response.data
      errors.value = formErrors
      toastMessage(e.response.data.message, 'error')
    });
}

// 👉 Fetching News
const fetchNews = () => {
  axios
    .get(`${store.state.apiUrl}/news?page=${options.value.page}&keywords=${searchQuery.value}`)
    .then(({ data }) => {
      news.value = data.data.news;
      totalNews.value = data.data.total_items;
      options.value.page = data.data.current_page;
      options.value.itemsPerPage = data.data.per_page;
    })
    .catch((err) => {
      if (err.response.status == 404) {
        toastMessage(err.response.data.message, 'error')
      }
    });
};

watchEffect(fetchNews);


const getWordStr = (str) => {
  return str.split(/\s+/).slice(0, 6).join(" ") + '...';
}


</script>

<template>
  <section>
    <VDialog v-model="isDialogVisible" max-width="600">

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

      <!-- Dialog Content -->
      <VCard title="User Profile">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <AppTextField :error-messages="errors.title" v-model="title" label="Title" placeholder="Title" />
            </VCol>

            <VCol cols="12">
              <AppTextarea :error-messages="errors.description" v-model="description" label="Description" rows="3" />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn variant="tonal" color="secondary" @click="isDialogVisible = false">
            Close
          </VBtn>
          <VBtn @click="updateNews()">
            Save
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <VCard>
      <VCardText class="d-flex flex-wrap gap-4">

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
          <!--  👉 Search  -->
          <AppTextField v-model="search" placeholder="Search" density="compact" style="width: 12.5rem"
            @input="debounceSearchQuery" />

        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION datatable -->
      <VDataTableServer v-model:items-per-page="options.itemsPerPage" v-model:page="options.page" :items="news"
        :items-length="totalNews" :headers="headers" class="text-no-wrap" @update:options="options = $event">


        <template #item.description="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            getWordStr(item.raw.description)
          }}</span>
        </template>



        <template #bottom>
          <VDivider />

          <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
            <p class="text-sm text-disabled mb-0">
              {{ paginationMeta(options, totalNews) }}
            </p>

            <VPagination v-model="options.page" :length="Math.ceil(totalNews / options.itemsPerPage)" :total-visible="$vuetify.display.xs
              ? 1
              : Math.ceil(totalNews / options.itemsPerPage)
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

          <IconBtn @click="getUpdateForm(item)">
            <VIcon icon="tabler-edit" />
          </IconBtn>

          <IconBtn @click="deleteNews(item.raw.id)">
            <VIcon icon="tabler-trash" />
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
