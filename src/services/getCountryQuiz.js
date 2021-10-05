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

	// THE DATA ARE SHUFFLED
	const shuffledData = shuffle(data, { shuffleAll: true }).slice(0, numberQuestions);
	const mappedData = shuffledData.map((shuffleItem) => {
		// THE FIRST OPTION OF THE QUIZ IS CREATED (WHICH IS THE ANSWER)
		let options = [shuffleItem.name.common];

		// THE OTHER OPTIONS ARE PUSHED (OF WHICH THERE WILL ONLY BE 3), FOR A TOTAL OF 4 UNIQUE OPTIONS
		while (options.some((option) => option !== random(data).name.common) && options.length < 4) {
			options = [...options, random(data).name.common];
		}

		const { question } = questions[typeQuiz](shuffleItem);
		// THE OPTIONS ARE SHUFFLED SO THAT THE ANSWER IS NOT IN THE FIRST PLACE
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
