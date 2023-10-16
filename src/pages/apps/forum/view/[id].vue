<script setup>
import avatar8 from '@images/avatars/avatar-8.png'
import axios from 'axios';
import { useStore } from "vuex";
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'

const moreList = [
    {
        title: 'View All',
        value: 'View All',
    },
]

const store = useStore()

const post = ref({})
const route = useRoute()
const isPost = ref(0)
const isAllComments = ref(1)



const commentsToggle = () => {
    if(isAllComments.value == 0){
        isAllComments.value = 1
    }else{
        isAllComments.value = 0
    }
}


const fetcPost = () => {
    axios.get(`${store.state.apiUrl}/forum/posts?post_id=${route.params.id}`).then(({ data }) => {
        post.value = data.data
        console.log(data.data)
        isPost.value = 1
    }).catch(err => {
        console.log(err)
    })
}




watchEffect(fetcPost);


const solidCardData = [
    {
        cardBg: '#007BB6',
        title: 'Linkedin Card',
        icon: 'tabler-brand-linkedin',
        text: 'With the Internet spreading like wildfire and reaching every part of our daily life, more and more traffic is directed.',
        avatarImg: avatar8,
        avatarName: 'Anne Burke1',
        likes: '1.2k',
        share: '80',
    },
]
</script>

<template>
    <VRow v-if="isPost">
        <VCol :key="'tabler-ad-2'" cols="12" md="12">
            <VCard :color="'#007BB6'">
                <VCardItem>
                    <template #prepend>
                        <VIcon size="1.9rem" color="white" :icon="'tabler-ad-2'" />
                    </template>
                    <VCardTitle class="text-white">
                        {{ post.title }}
                    </VCardTitle>
                </VCardItem>

                <VCardText>
                    <p class="clamp-text text-white mb-0">
                        {{ post.description }}
                    </p>
                </VCardText>

                <VCardText class="d-flex justify-space-between align-center flex-wrap">
                    <div class="text-no-wrap">
                        <VAvatar size="34" :image="post.user.image" />
                        <span class="text-white ms-2">{{ post.user.name }}</span>
                    </div>

                    <div class="d-flex align-center">
                        <IconBtn icon="tabler-message-circle" color="white" class="me-1" />
                        <span class="text-subtitle-2 text-white me-4">{{ post.total_comments }}</span>
                    </div>
                </VCardText>
            </VCard>
        </VCol>
        <VCol>
            <VCard :title="isAllComments ? 'Comments' : 'Recent Comments'">
                <!-- <template #append>
                    <div class="me-n2">
                        <VBtn v-if="!isAllComments" @click="commentsToggle" variant="outlined" color="warning">
                            Show All Comments
                        </VBtn>
                        <VBtn v-else @click="commentsToggle" variant="outlined" color="info">
                            Show Recent Comments
                        </VBtn>
                    </div>
                </template> -->

                <VCardText>
                    <VTimeline side="end" align="start" truncate-line="both" density="compact"
                        class="v-timeline-density-compact">
                        <VTimelineItem v-for="comment in post.comments" dot-color="primary" size="x-small">
                            <!-- 👉 Header -->
                            <div class="d-flex justify-space-between align-center flex-wrap mb-1">
                                <span class="app-timeline-title">
                                    {{comment.description}}
                                </span>
                            </div>

                            <div class="d-flex align-center">
                                <VAvatar :image="comment.user.image" class="me-3" />
                                <div>
                                    <p class="text-high-emphasis mb-n1">
                                        {{ comment.user.name }}
                                    </p>
                                </div>
                            </div>
                        </VTimelineItem>
                    </VTimeline>
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
</template>
