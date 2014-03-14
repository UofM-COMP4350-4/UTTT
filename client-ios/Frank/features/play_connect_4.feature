Feature:
	As a user I want to click on the Play Connect 4 button
	and go to a game screen

Scenario: 
	Playing a game of Connect 4
Given I launch the app
Then I should be on the Main screen

When I click “Play Connect 4”
Then I should be on the Game screen