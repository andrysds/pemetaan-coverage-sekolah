#include <bits/stdc++.h>

#define VERTEX_COUNT 500

int main()
{
	srand(time(NULL));

	int width = rand() % 2001 + 500;
	int height = rand() % 2001 + 500;

	for(int i = 0; i < VERTEX_COUNT; i++)
	{
		int x = rand() % width + 1;
		int y = rand() % height + 1;
		printf("%d %d\n", x, y);
	}
	
	printf("%d %d\n", width, height);
	return 0;
}