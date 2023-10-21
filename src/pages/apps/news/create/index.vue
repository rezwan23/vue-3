<script setup>
const title = ref('')
const description = ref('')
import axios from 'axios'
import { useStore } from 'vuex'
import { toastMessage } from '../../../../swal'

const router = useRouter()
const store = useStore()

const createNewPost = () => {
    axios.post(`${store.state.apiUrl}/news/create`, {
        title: title.value,
        description: description.value,
    }).then(r => {
        toastMessage(r.data.message, 'success')
        router.push('/apps/news/list')
    }).catch(e => {
        const { errors: formErrors } = e.response.data
        errors.value = formErrors
        toastMessage(e.response.data.message, 'error')
    })
}

const errors = ref({
    title: undefined,
    description: undefined,
})

</script>

<template>
    <div>
        <VRow>
            <VCol cols="12" md="12">
                <VCard title="Add New">
                    <VCardText>
                        <VForm @submit.prevent="createNewPost">
                            <VRow>
                                <VCol cols="12">
                                    <AppTextField :error-messages="errors.title" v-model="title" label="Title"
                                        placeholder="Title" />
                                </VCol>

                                <VCol cols="12">
                                    <AppTextarea :error-messages="errors.description" v-model="description"
                                        label="Description" rows="3" />
                                </VCol>

                                <VCol cols="12" class="d-flex gap-4">
                                    <VBtn type="submit">
                                        Submit
                                    </VBtn>

                                    <VBtn type="reset" color="secondary" variant="tonal">
                                        Reset
                                    </VBtn>
                                </VCol>
                            </VRow>
                        </VForm>
                    </VCardText>

                </VCard>
            </VCol>
        </VRow>
    </div>
</template>
