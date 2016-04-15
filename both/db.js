/***** MongoDB Database File **************************************************/
/* Set up access to databases */

/* Create a mongoDB collections if they doesn't exist, otherwise load the 
 * existing one into the variable */
Classes = new Mongo.Collection("classes");
Lectures = new Mongo.Collection("lectures");
Questions = new Mongo.Collection("questions");