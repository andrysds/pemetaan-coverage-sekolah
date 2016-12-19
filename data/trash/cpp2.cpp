#include <bits/stdc++.h>

int main() {
	float a, b;
	FILE * input;
	FILE * output;

	input = fopen("random.txt", "r");
	output = fopen("random2.txt", "w");

	for (int i = 1; i < 201; i++) {
		fscanf(input, "%f %f", &a, &b);
		fprintf(output, "%f %f\n", (a / 1200.2) + 105.0, -5 - (b / 1200.2));
	}

	fclose(input);
	fclose(output);
}