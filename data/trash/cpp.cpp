#include <bits/stdc++.h>

int main() {
	float a, b;
	FILE * input;
	FILE * output;

	input = fopen("random2.txt", "r");
	output = fopen("jawa.json", "w");

	fprintf(output, "[\n");

	for (int i = 1; i < 201; i++) {
		fscanf(input, "%f %f", &a, &b);

		fprintf(output, "{\n");
		fprintf(output, "\"name\": \"Sekolah %d\",\n", i);
		fprintf(output, "\"longitude\": %f,\n", a);
		fprintf(output, "\"latitude\": %f\n", b);
		fprintf(output, "},\n");
	}

	fprintf(output, "]\n");

	fclose(input);
	fclose(output);
}