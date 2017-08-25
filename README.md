# mf_pewpew.js

I have made mf_pewpew.js to be single one stop micro framework solution for throwing together a simple space shooter game. The framework makes use of hacked over source code from [mf_shots.js](https://github.com/dustinpfister/mf_shots), and [mf_sections.js](https://github.com/dustinpfister/mf_sections) frameworks to produce a single cohesive framework. As such pewpew handles camera, section, and display object values.

## Sections

pewpew borrows code from my mf_secions framework which breaks down a large space into many smaller parts called sections. Each section can contain zero or more units that are to be loaded into a small load array, from a very large sections array that contains all units in the map. This allows a game to have a vast amount of units in a map as only the units in the currently loaded sections are updated, and displayed.

## Units

pewpew borrows code from my mf_shots framework in which I worked out a decent solution for managing display objects. All display objects inherit from a Base unit class, and is a basic example of prototype bases inheritance in action.

## Weapons

One of pewpew's features that is not borrowed from a previous work is it's weapon class. pewpew comes with a single built in weapon, and the development of additional weapons is quite straight forward.

## Player Vessel

The Player object is a single instance of the Vessel class that responds to user input.

## Enemy Vessels

A collection of Vessel Class instances that are not so nice to the player.

## AI

Pewpew adds some AI scripts that govern the actions of Enemy Vessels.