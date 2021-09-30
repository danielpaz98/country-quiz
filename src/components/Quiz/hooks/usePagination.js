import { ref, computed, watch } from "vue";

export function usePagination({ items }) {
	const currentPage = ref(0);
	const data = computed(() => items.value && items.value.slice(currentPage.value, currentPage.value + 1));

	watch(items, () => (currentPage.value = 0));

	const nextPage = () => (currentPage.value = currentPage.value + 1);

	return { data, nextPage };
}
