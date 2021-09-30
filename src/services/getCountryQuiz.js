import { computed } from "vue";
// PLUGINS
import { useFetch } from "@vueuse/core";
import shuffle from "just-shuffle";
import random from "just-random";
// STATIC DATA
import { typeQuiz } from "~/staticData";
const { CAPITALS, FLAGS } = typeQuiz;

function generatorQuiz({ typeQuiz, numberQuestions, data } = {}) {
	const questions = {
		[CAPITALS]: ({ capital = {} } = {}) => ({
			question: `${capital} is the capital of?`,
		}),
		[FLAGS]: ({ flags = {} } = {}) => ({
			question: `<img src="${flags.svg}" alt="Flag Country"> Which country does this flag belong to?`,
		}),
	};

	const shuffledData = shuffle(data, { shuffleAll: true }).slice(0, numberQuestions);
	const mappedData = shuffledData.map((shuffleItem) => {
		// CREATE THE ANSWER OPTIONS (ONLY 4)
		const options = [...Array(4)].map((_, index) => {
			const randomOption = random(data.filter((random) => random.name.common !== shuffleItem.name.common));
			return index === 0 ? shuffleItem.name.common : randomOption.name.common;
		});

		const { question } = questions[typeQuiz](shuffleItem);
		const shuffledOptions = shuffle(options, { shuffleAll: true });
		const result = { question, options: shuffledOptions, answer: shuffleItem.name.common };

		return result;
	});

	return mappedData;
}

export function getCountryQuiz({ typeQuiz, numberQuestions } = {}) {
	const url = computed(
		() =>
			(typeQuiz.value === CAPITALS && "https://restcountries.com/v3.1/region/europe") ||
			(typeQuiz.value === FLAGS && "https://restcountries.com/v3.1/subregion/south")
	);

	const { isFetching, error, data, execute } = useFetch(url, {
		refetch: true,
		afterFetch(ctx) {
			const parsedData = JSON.parse(ctx.data);
			const data = generatorQuiz({ typeQuiz: typeQuiz.value, numberQuestions, data: parsedData });

			ctx.data = data;

			return ctx;
		},
	});

	return {
		isFetching,
		error,
		data,
		execute,
	};
}
