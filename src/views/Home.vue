<script setup>
import { ref } from "vue";
// STATIC DATA
import { typeQuiz } from "~/staticData";
// COMPONENTS
import Quiz from "~/components/Quiz";
import QuizCard from "~/components/Quiz/QuizCard.vue";

const quizSelected = ref("");
const options = Object.values(typeQuiz);

const updateQuizSelected = (value) => (quizSelected.value = value);
</script>

<template>
	<transition name="fade">
		<button
			v-if="quizSelected"
			type="button"
			class="btn btn-icon btn-purple"
			title="Go home"
			@click="updateQuizSelected('')"
		>
			<i class="material-icons">reply</i>
		</button>
	</transition>

	<QuizCard
		v-if="!quizSelected"
		title="Country quiz"
		:question="'Select a quiz type'"
		:options="options"
		:on-confirm="updateQuizSelected"
		list-style-type="disc"
	/>

	<Quiz v-else :type-quiz="quizSelected" />
</template>

<style lang="css" scoped>
.btn {
	align-self: flex-start;
	position: absolute;
	right: 100%;
	top: 50%;
	transform: translate(-50%, -50%);
}

@media screen and (max-width: 700px) {
	.btn {
		left: 35px;
		top: 2px;
	}
}
</style>
