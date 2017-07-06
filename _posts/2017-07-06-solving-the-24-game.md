---
title: Solving the 24 game
excerpt: Listen to me ramble about how I wrote an algorithm to solve the 24 game for an arbitrary number of numbers. 
---

The [24 game](https://en.wikipedia.org/wiki/24_Game) is a game I've always liked playing. The problem is this: given four cards, one has to try to make 24 using the four basic operations and using each number once and only once. 

Recently, I decided to write a program to check if there is a solution to a given a set of numbers, and if there exists a solution, print the solution. This is something I've been wanting to do for quite some time. 

## The instinctive approach

My first instinct was to construct all possible expressions that are possible with the four numbers and check whether any of them equal 24, or any other number you choose. It is easy to permute the numbers and operations, but the difficulty lies in the placement of brackets. 

For four numbers, the possible positions of brackets are still iterable, though just barely, and makes the code look very ugly. For example, there is a [solution](https://rosettacode.org/wiki/24_game/Solve#Python) on Rosetta Code that uses this principle; it specifies all the possible bracket insertion indices in an arithmetic expression string using the following code snippet:

```python
brackets = ( [()] + [(x,y)
                     for x in range(0, exprlen, 2)
                     for y in range(x+4, exprlen+2, 2)
                     if (x,y) != (0,exprlen+1)]
             + [(0, 3+1, 4+2, 7+3)] ) # double brackets case
```

The empty tuple is the case with no brackets, the list comprehension after that generates all possible combinations of open brackets (variable `x`) and close brackets (variable `y`), and the third list is the indices of the brackets in the double bracket case, as in `(5 + 3) * (1 + 2)`.

This is an interesting and comprehensive solution, but unfortunately it only works for four numbers. I couldn't think of a way to systematically generate brackets for an arbitrary number of numbers. We would have to take into account double double brackets, nested brackets, and many more. 

## A recursive approach 

I realized that to make it work for more numbers than four, I would have to take a different approach. I thought back to the strategy I use when playing the game with my sister--I don't try to construct each all possible expressions that can be formed and check if they evaluate to 24. Instead, I try to combine numbers and reduce them such that there are two numbers remaining, and check if they can combine to get 24. For example, if we started with 1, 2, 3, and 4:

`1 2 3 4 --> 1 6 4 --> 1 24 --> 24`

As such, it becomes apparent that this is a recursive solution; solving for n numbers is the same as choosing to combine 2 numbers and solving for n-1 numbers. 

Once there was this realization, writing the algorithm was not difficult. For a given list of numbers, I iterate through all possible pairs that can be generate from the list. For each pair, I go through the possible values that can be produced from the pair by using the 4 operators. For each value, I generate a list with one less element than the previous, and call the function again. 

This contains two nested for loops, and might blow up for a large input array. However, the 24 game is usually played with 4 numbers, and the algorithm seems to be doing well with a list of similar order of magnitude. 

I made a page so that you can play around with the game [here](https://theconfused.me/get24), and the source code can be found [here](https://github.com/lingxz/get24). Feel free to play with it. 

 



