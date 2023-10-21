<script setup>
import { onMounted } from 'vue';
import moment from 'moment';


const calculateAge = (dob) => {
   return moment().diff(dob, 'years', true).toFixed(1)
}

const props = defineProps({
    children: Array
})

const { children } = toRefs(props)
</script>

<template>
    <VCard title="Children">
        <VTable class="text-no-wrap">
            <thead>
                <tr>
                    <th class="text-uppercase">
                        Image
                    </th>
                    <th class="text-uppercase text-center">
                        Name
                    </th>
                    <th class="text-uppercase text-center">
                        Age
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="item in children" :key="item.dessert">
                    <td>
                        <VAvatar :image="item.raw.image" size="38" :variant="!item.raw.avatar ? 'tonal' : undefined"
                            :color="undefined" class="me-3">
                            <VImg v-if="item.raw.image" :src="item.raw.image" />
                        </VAvatar>
                    </td>
                    <td class="text-center">
                        {{ item.raw.f_name + ' ' + item.raw.l_name }}
                    </td>
                    <td class="text-center">
                        {{ calculateAge(item.raw.dob) + ' Years' }}
                    </td>
                </tr>
            </tbody>
        </VTable>
    </VCard>
</template>
