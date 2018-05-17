---
title: Solving the 24 game
tags: [python]
toc: false
---

The [24 game](https://en.wikipedia.org/wiki/24_Game) is a game I've always liked playing. The problem is this: given four numbers, one has to try to make 24 using the four basic operations and using each number once and only once. 

For example, given a list of numbers `[4,8,3,6]`, we can get 24 by doing `4*8*(6/3)` or `4*3*(8-6)`. What you cannot do is take, say, `4*6` and discard the rest.  

Sometimes, there are also 4-number combinations that can never make 24. One example is `[3,9,4,10]`. What usually happens in a game when we encounter such combinations is that we would stare at the cards in silence for a long period of  time, before at some point we both agree that this is an impossible combination. But this is incredibly arbitrary; we might very well pass over combinations that are actually possible but neither of us could see. 

One very commonly missed one was `[1,5,5,5]`. You can have a try if you want to play along, but don't spend too long. 

So I wanted to write a program to check if there is a solution to a given a set of numbers, and print the solution if it exists. I've tried this a few years back when I first started coding, but somehow just couldn't cover all the edge cases. Armed with slightly more programming knowledge and experience, I decided to give it another go. 

## The instinctive approach

My first instinct was to construct all possible expressions that are possible with the four numbers and check whether any of them equal 24, or any other number you choose. It is easy to permute the numbers and operations, but the main difficulty lies in the placement of brackets. 

For four numbers, the possible positions of brackets are still iterable, though just barely, and makes the code look very ugly. For example, there is a [solution](https://rosettacode.org/wiki/24_game/Solve#Python) on Rosetta Code that uses this principle; it specifies all the possible bracket insertion indices in an arithmetic expression string using the following code snippet:

```python
brackets = ( [()] + [(x,y)
                     for x in range(0, exprlen, 2)
                     for y in range(x+4, exprlen+2, 2)
                     if (x,y) != (0,exprlen+1)]
             + [(0, 3+1, 4+2, 7+3)] ) # double brackets case
```

The empty tuple is the case with no brackets, the list comprehension after that generates all possible combinations of open brackets (variable `x`) and close brackets (variable `y`), and the third list is the indices of the brackets in the double bracket case, as in `(5 + 3) * (1 + 2)`.

The major limitation of this solution is that it only works for four numbers, where it is easy to reason about the bracket placements. To make it work for more than 4 numbers, one would have to take into account double and triple brackets, nested brackets, and many more. In retrospect it might be possible to algorithmically generate possible bracket placements, possibly with some kind of recursive algorithm, but at that point it just felt paralyzingly messy. 

## A recursive approach 

I realized that to make it work for more numbers than four, I would have to take a different approach. I am pretty good at the game, so I thought about the strategy I use when playing the game and realized my first approach was wholly mechanical and unnatural. 

I don't think about bracket placement when I play the game, neither do I try to construct all possible expressions from the four numbers and evaluate them one-by-one to see if they give the desired answer. Instead, given four numbers, what I would do mentally is this: I would try to combine pairs of numbers and reduce them, until there are two numbers remaining, and then check if there is any way these two numbers evaluate to 24. 

For example, if we started with `[1,2,3,4]`, this is roughly the thought process that occurs:

```
[1,2,3,4] --> [1,6,4] --> [1,24] --> 24 --> success!
```

As such, it becomes apparent that this is a recursive solution: solving for n numbers is the same as choosing to combine 2 numbers and solving for the remaining n-1 numbers. 

Once I got this realization, writing the algorithm was not difficult. For a given list of numbers, I iterate through all possible pairs that can be generated from the list. For each pair, I go through the possible values that can be produced from the pair by using the 4 operators. For each value, I generate a list with one less element than the previous, and call the function again. 

This contains two nested for loops, and might blow up for a large input array. But practically the 24 game is usually played with 4 numbers, and the algorithm does reasonably well with a list of similar order of magnitude. 

The resulting python code looks like this, with the main solver logic in `solve()`:

```python
import itertools

def solve(numbers, goal=24, expr=[]):
    if expr == []:
        expr = [str(n) for n in numbers]
    if len(numbers) == 1:
        if numbers[0] == goal:
            return numbers[0]
        else:
            return False
    if len(numbers) == 2:
        answers, answer_exps = combinetwo(numbers[0], numbers[1])
        for i,answer in enumerate(answers):
            if answer == goal:
                return convert_expr_to_string(expr[0], expr[1], answer_exps[i])
        return False

    pairs = set(itertools.combinations(numbers, 2))
    for pair in pairs:
        possible_values, possible_expr = combinetwo(*pair)
        for counter, value in enumerate(possible_values):
            expression = possible_expr[counter]
            a_index = numbers.index(pair[0])
            b_index = numbers.index(pair[1])
            if a_index == b_index:
                b_index = numbers.index(pair[1], a_index + 1);

            expr_string = convert_expr_to_string(expr[a_index], expr[b_index], expression)
            newlist = numbers[:]
            newexpr = expr[:]
            
            # replace the two numbers with the combined result
            a_index = newlist.index(pair[0])
            newlist.pop(a_index)
            b_index = newlist.index(pair[1])
            newlist.pop(b_index)
            newlist.append(value)

            # order matters
            newexpr.pop(a_index)
            newexpr.pop(b_index)
            newexpr.append(expr_string)
            result = solve(newlist, goal, newexpr)
            if result:
                return remove_redundant_brackets(result)
            else:
                continue

def convert_expr_to_string(a, b, expr):
    temp = [a, b]
    result = '(' + str(temp[expr[0]]) + ')' + str(expr[1]) + '(' + str(temp[expr[2]]) + ')'
    return result

def combinetwo(a, b):
    result = [a + b, a * b]
    expr = [(0, '+', 1), (0, '*', 1)]
    if b > a:
        result.append(b-a)
        expr.append((1, '-', 0))
    else:
        result.append(a-b)
        expr.append((0, '-', 1))
    if b != 0:
        result.append(a / b)
        expr.append((0, '/', 1))
    if a != 0:
        result.append(b / a)
        expr.append((1, '/', 0))
    return result, expr

def remove_redundant_brackets(expr):
    stack = []
    # indices to be deleted
    indices = []
    for i, ch in enumerate(expr):
        if ch == '(':
            stack.append(i)
        if ch == ')':
            last_bracket_index = stack.pop()
            enclosed = expr[last_bracket_index + 1:i]
            if enclosed.isdigit():
                indices.append(i)
                indices.append(last_bracket_index)
    return "".join([char for idx, char in enumerate(expr) if idx not in indices])
```

An example usage looks like this:

```python
>>> solve([1, 5, 5, 5], goal=24)
'5*(5-(1/5))'
```

Of course you can pass in any goal and a list of arbitrary length. Currently, it should return nothing if there is no solution. 

I also converted the python code above to javascript, and made a [page](https://theconfused.me/get24) so that people can play around with the game. 
