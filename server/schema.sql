GRANT ALL ON *.* TO 'ubuntu'@'localhost'; /*local access*/
GRANT ALL ON *.* TO 'ubuntu'@'%'; /*remote access*/

CREATE TABLE Games (
	gameID BIGINT NOT NULL AUTO_INCREMENT,
	gameName VARCHAR(100),
	gameType VARCHAR(100),
	maxPlayers BIGINT,
	PRIMARY KEY(gameID)
);

CREATE TABLE Users (
	userID BIGINT NOT NULL AUTO_INCREMENT,
	isOnline BOOLEAN,
	userName VARCHAR(100),
	avatarURL VARCHAR(100),
	PRIMARY KEY(userID)
);

CREATE TABLE Friends (
	userID BIGINT NOT NULL,
	friendID BIGINT NOT NULL,
	FOREIGN KEY(userID) REFERENCES Users(userID),
	FOREIGN KEY(friendID) REFERENCES Users(userID),
	PRIMARY KEY(userID, friendID)
);

CREATE TABLE Matches (
	instanceID BIGINT NOT NULL AUTO_INCREMENT,
	userID BIGINT NOT NULL,
	gameID BIGINT NOT NULL,
	FOREIGN KEY(userID) REFERENCES Users(userID),
	FOREIGN KEY(gameID) REFERENCES Games(gameID),
	PRIMARY KEY(instanceID)
);

CREATE INDEX Matches_UserID
ON Matches (userID);

CREATE INDEX Matches_GameID
ON Matches (gameID);

CREATE INDEX Users_IsOnline
ON Users (isOnline);
