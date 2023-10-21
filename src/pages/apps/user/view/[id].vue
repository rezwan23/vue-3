<script setup>
import axios from 'axios';
import { useStore } from "vuex";


const store = useStore()

const post = ref({})
const route = useRoute()
const isPost = ref(0)



onMounted(() => {
  fetchPost()
})

const fetchPost = () => {
    axios.get(`${store.state.apiUrl}/forum/posts?post_id=${route.params.id}`).then(({ data }) => {
        post.value = data.data
        isPost.value = 1
    }).catch(err => {
        console.log(err)
    })
}


</script>

<template>
    <VRow v-if="isPost">
        <VCol :key="'tabler-ad-2'" cols="12" md="12">
            <VCard :color="'#007BB6'">

                <VCardText class="d-flex justify-space-between align-center flex-wrap mt-2">
                    <div class="text-no-wrap d-flex justify-start">
                        <VAvatar size="34" :image="post.user.image" />
                        <h3 class="text-white ms-2">{{ post.user.name }}</h3>
                    </div>
                  <div class="d-flex align-center">
                    <IconBtn icon="tabler-message-circle" color="white" class="me-1" />
                    <span class="text-subtitle-2 text-white me-4">{{ post.total_comments }}</span>
                  </div>
                </VCardText>
                <div class="ml-4">
                  <VCardTitle class="text-white my-n1">
                    {{ post.title }}
                  </VCardTitle>
                  <VCardText>
                    <p class="clamp-text text-white mb-6">
                      {{ post.description }}
                    </p>
                  </VCardText>
                </div>
            </VCard>
        </VCol>
        <VCol>
            <VCard :title=" 'Comments'">
                <VCardText>
                    <VTimeline side="end" align="start" truncate-line="both" density="compact"
                        class="v-timeline-density-compact">
                        <VTimelineItem v-for="comment in post.comments" dot-color="primary" size="x-small">
                          <div class="d-flex align-center">
                            <VAvatar :image="comment.user.image" class="me-3" />
                            <div>
                              <p class="text-high-emphasis mb-n1">
                                {{ comment.user.name }}
                              </p>
                            </div>
                          </div>
                            <div class="d-flex justify-space-between align-center flex-wrap mb-1">
                                <span class="app-timeline-title ml-5 pl-5">
                                    {{comment.description}}
                                </span>
                            </div>

                        </VTimelineItem>
                    </VTimeline>
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
</template>
