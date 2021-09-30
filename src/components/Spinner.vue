<script>
export default {
	name: "Spinner",
};
</script>

<template>
	<div class="donut multi" />
</template>

<style scoped>
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.donut {
	width: 5rem;
	height: 5rem;
	border-radius: 50%;
	border: 0.3rem solid rgba(151, 159, 208, 0.3);
	border-top-color: #979fd0;
	animation: 1.5s spin infinite linear;
}
.donut.multi {
	border-bottom-color: #979fd0;
}
</style>
