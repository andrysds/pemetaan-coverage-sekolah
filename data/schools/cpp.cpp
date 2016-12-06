#include <bits/stdc++.h>

int main() {
	int a, b;
	FILE * input;
	FILE * output;

	input = fopen("random.txt", "r");
	output = fopen("jawa.json", "w");

	fprintf(output, "[\n");

	for (int i = 1; i < 201; i++) {
		fscanf(input, "%d %d", &a, &b);

		fprintf(output, "{\n");
		fprintf(output, "\"name\": \"Sekolah %d\",\n", i);
		fprintf(output, "\"longitude\": %d,\n", a);
		fprintf(output, "\"latitude\": %d\n", b);
		fprintf(output, "},\n");
	}

	fprintf(output, "]\n");

	fclose(input);
	fclose(output);
}