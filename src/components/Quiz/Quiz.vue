<script setup>
import { computed } from "vue";
// COMPONENTS
import QuizCard from "~/components/Quiz/QuizCard.vue";
import Spinner from "~/components/Spinner.vue";
// CUSTOM HOOKS
import { usePagination } from "./hooks";
// SERVICES
import { getCountryQuiz } from "~/services";

const props = defineProps({
	typeQuiz: {
		type: String,
		required: true,
	},
	numberQuestions: {
		type: Number,
		default: 10,
	},
});

const {
	data: items,
	isFetching,
	execute,
} = getCountryQuiz({ typeQuiz: computed(() => props.typeQuiz), numberQuestions: props.numberQuestions });

const { data, nextPage } = usePagination({ items });
</script>

<template>
	<Spinner v-if="isFetching" />

	<template v-else>
		<div v-for="({ question, options, answer }, index) of data" :key="index">
			<QuizCard
				title="Country quiz"
				:question="question"
				:options="options"
				:answer="answer"
				:total-questions="items.length"
				:on-next-page="nextPage"
				:on-try-again="execute"
			/>
		</div>
	</template>
</template>
