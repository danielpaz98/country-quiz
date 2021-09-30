<script setup>
import { reactive, computed } from "vue";

// PROPS
const props = defineProps({
	title: {
		type: String,
	},
	question: {
		type: String,
	},
	options: {
		type: Array,
		default: () => [],
	},
	answer: {
		type: String,
	},
	totalQuestions: {
		type: Number,
	},
	onNextPage: {
		type: Function,
	},
	onConfirm: {
		type: Function,
	},
	onTryAgain: {
		type: Function,
	},
	listStyleType: {
		type: String,
		default: "upper-alpha",
	},
});

// DATA
const initialState = { optionSelected: "", finalOption: "", correctAnswers: 0, showResults: false };
const state = reactive(initialState);

// COMPUTED
const isCorrectAnswer = computed(() => state.finalOption === props.answer);
const totalCorrectAnswers = computed(() => `${state.correctAnswers}/${props.totalQuestions}`);
const wonQuiz = computed(() => state.correctAnswers === props.totalQuestions);

// METHODS
const resetSelectedOptions = () => Object.assign(state, { ...state, optionSelected: "", finalOption: "" });
const resetState = () => Object.assign(state, initialState);
const showResults = ({ delay = 0 }) => setTimeout(() => (state.showResults = true), delay);

const handleConfirm = () => {
	state.finalOption = state.optionSelected;

	if (props.answer) {
		state.correctAnswers = isCorrectAnswer.value ? state.correctAnswers + 1 : state.correctAnswers;

		if (!isCorrectAnswer.value || wonQuiz.value) showResults({ delay: 1000 });
	}

	if (props.onConfirm) {
		props.onConfirm(state.finalOption);
	}
};

const handleNextPage = () => {
	if (isCorrectAnswer.value) {
		resetSelectedOptions();

		if (props.onNextPage) {
			props.onNextPage();
		}
	}
};

const handleAgain = () => {
	resetState();

	if (props.onTryAgain) {
		props.onTryAgain();
	}
};
</script>

<template>
	<div class="quiz-card-container">
		<h1 class="quiz-title">{{ title }}</h1>

		<div class="quiz-card">
			<div class="quiz-card-logo">
				<img v-if="!state.showResults" src="/src/assets/img/logo.svg" alt="Logo Quiz Country" />
			</div>

			<div v-if="!state.showResults" class="quiz-card-question">
				<!-- eslint-disable -->
				<div class="quiz-card-question-title" v-html="question" />

				<ul class="quiz-card-question-list">
					<li
						v-for="(option, index) of options"
						:key="index"
						list-style-type="upper-roman"
						class="quiz-card-question-option"
						:class="{
							'option-selected': state.optionSelected === option,
							'correct-answer': answer && state.finalOption && answer === option,
							'incorrect-answer':
								answer && state.finalOption === option && state.finalOption && state.finalOption !== answer,
						}"
						@click="state.optionSelected = option"
					>
						<p class="quiz-card-question-option-text">{{ option }}</p>
					</li>
				</ul>
			</div>

			<div v-else class="quiz-card-results">
				<div class="quiz-card-results-img">
					<img src="/src/assets/img/winners.svg" alt="Winners Image" />
				</div>

				<h1 v-if="wonQuiz" class="quiz-card-results-title won">You Won! 😀</h1>
				<h1 v-else class="quiz-card-results-title lost">You Lost 😔</h1>
				<h1 class="quiz-card-results-title">Results</h1>

				<div class="quiz-card-results-answers">
					<p>You got</p>
					<span>{{ totalCorrectAnswers }}</span>
					<p>correct answers</p>
				</div>

				<button type="button" class="btn btn-outline btn-large" @click="handleAgain">
					{{ wonQuiz ? "Play" : "Try" }} again
				</button>
			</div>

			<button
				v-if="state.optionSelected && !state.finalOption"
				type="button"
				class="btn btn-yellow"
				@click="handleConfirm"
			>
				Confirm
			</button>

			<button v-if="isCorrectAnswer && !wonQuiz" type="button" class="btn btn-yellow" @click="handleNextPage">
				Next
			</button>
		</div>
	</div>
</template>

<style lang="css" src="~/assets/css/quiz-card.css" />

<style lang="css" scoped>
.quiz-card-question .quiz-card-question-title :deep(img) {
	width: 84px;
	height: 54px;
}

.quiz-card-question-list .quiz-card-question-option::before {
	font-weight: 600;
	content: counter(option, v-bind(listStyleType)) " ";
	counter-increment: option;
}
</style>
