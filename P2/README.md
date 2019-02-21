# ECV - Assignment 2
Sergi Olives - 193196

Óscar Subirats - 183850

## Chat application with canvas 2d implementation

In this application, nodeJS have been used for the server side while HTML+CSS+JS have been used in the server side. This is a continuation of the practice 1 of ECV adding a 2D canvas to implement a virtual representation of users in chat rooms. The app consists in two pages, a login page and the main application with a chat and canvas. 

In order to execute the server the main.js has to be called.

### Features:
* Users can select their user name
* Users can select which room they want to join from 3 possible ones (General, Gaming and Offtopic)
* Users can select the skin of their avatars from a pool of 4 characters
* Users in the same room can send messages and emojis to all the other connected users
* When a user is connected, will have the full history of messages ever sent to the server
* All users will be notified if a new user connects or if one of the existing users disconnects
* All users will be represented in the Canvas 2D with all the names and skins selected by the diferent users
* Users can move freely inside the canvas using point&click with the mouse and the movement will be seen in real-time for all the users connected
* Whenever a user sents a message or an emoji, a red exclamation sign will be shown in top of his head during a few seconds
* In the down-right corner of the canvas, the room name will be shown

