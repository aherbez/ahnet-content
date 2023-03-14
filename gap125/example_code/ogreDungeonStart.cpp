#include <iostream>
#include <string>
#include <ctime>

using namespace std;

const int LEVEL_WIDTH = 60;
const int LEVEL_HEIGHT = 15;
const int NUM_ITEMS = 5;

const int ITEM_FOOD = 1;
const int ITEM_GOLD = 2;
const int ITEM_TRAP = 3;

const int START_HEALTH = 100;
const int START_FOOD = 20;
const int START_GOLD = 0;

int LevelData[LEVEL_WIDTH][LEVEL_HEIGHT];

int charPos[] = {0,0};
int charStatus[3];

int itemsLocations[NUM_ITEMS][3];

bool IsPlaying;

void PrintPlayerStatus()
{
	cout << "\n1: move left, 2: move up, 3: move down, 4: move right, 5: wait, 6: quit\n";
	cout << "Current status: ";
	cout << "Health: " << charStatus[0];
	cout << " Food: " << charStatus[1];
	cout << " Gold: " << charStatus[2];
	cout << "\n";
}

void PrintLevel()
{
	for (int i = 0; i < LEVEL_HEIGHT; i++)
	{
		for (int j = 0; j < LEVEL_WIDTH; j++)
		{
			if (j == charPos[0] && i == charPos[1])
			{
				cout << "@";
			}
			else
			{

				switch (LevelData[j][i])
				{
				case 1:
					cout << "*";
					break;
				case 3:
					cout << "%";
					break;
				default:
					cout << ".";
				}
			}

		}
		cout << endl;
	}

}

void InitLevel()
{
	srand(time(NULL));

	charPos[0] = 1; // LEVEL_WIDTH / 2;
	charPos[1] = 4; // LEVEL_HEIGHT / 2;

	charStatus[0] = START_HEALTH;
	charStatus[1] = START_FOOD;
	charStatus[2] = START_GOLD;

	IsPlaying = true;

	for (int i = 0; i < LEVEL_HEIGHT; i++)
	{
		for (int j = 0; j < LEVEL_WIDTH; j++)
		{
			LevelData[j][i] = 0;
			if (j == 0 || j == (LEVEL_WIDTH - 1) || i == 0 || i == (LEVEL_HEIGHT - 1))
			{
				LevelData[j][i] = 1;
			}
		}
		cout << endl;
	}

}


void ProcessInput(int i)
{
	
	
	switch (i)
	{
		case 1:
			charPos[0] -= 1;
			if (charPos[0] < 1) charPos[0] = 1;
			break;
		case 4:
			charPos[0] += 1;
			if (charPos[0] > LEVEL_WIDTH-2) charPos[0] = LEVEL_WIDTH - 2;
			break;
		case 3:
			charPos[1] += 1;
			if (charPos[1] > LEVEL_HEIGHT-2) charPos[1] = LEVEL_HEIGHT-2;
			break;
		case 2:
			charPos[1] -= 1;
			if (charPos[1] < 1) charPos[1] = 1;
			break;
		case 5:
			break;
		case 6:
			IsPlaying = false;
			break;

	}

}

int main()
{
	int input;
	InitLevel();
	
	while (IsPlaying)
	{
		PrintPlayerStatus();
		PrintLevel();
		cin >> input;
		ProcessInput(input);
	}

	return 0;
}