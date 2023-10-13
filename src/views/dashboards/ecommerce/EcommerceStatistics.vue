<template>
  <VCard title="Statistics">
    <template #append>
      <span class="text-sm text-disabled">Updated 1 month ago</span>
    </template>

    <VCardText class="pt-6">
      <VRow>
        <VCol v-for="item in statistics" :key="item.title" cols="6" md="4">
          <div class="d-flex align-center gap-4">
            <VAvatar :color="item.color" variant="tonal" size="42">
              <VIcon :icon="item.icon" />
            </VAvatar>

            <div class="d-flex flex-column">
              <span class="text-h5 font-weight-medium">{{ item.stats }}</span>
              <span class="text-sm">
                {{ item.title }}
              </span>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      statistics: [],
    };
  },
  computed: {
    apiUrl() {
      return this.$store.state.apiUrl;
    },
  },
  mounted() {
    console.log("mounted!");
    this.getDashboardData();
  },
  methods: {
    getDashboardData() {
      axios
        .get(`${this.apiUrl}/dashboard/statistics`)
        .then((res) => {
          this.statistics = res.data.data.statistics;
        })
        .catch((err) => {
          if (err.response.status == 401) {
            this.$store.commit('removeSession')
          }
        });
    },
  },
};
</script>
