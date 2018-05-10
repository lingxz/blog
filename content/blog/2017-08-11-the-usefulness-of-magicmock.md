---
title: The usefulness of MagicMock
tags: [python, testing]
---

At my internship, I volunteered to fix a harmless looking bug on the Jira while the bulk of my internship project code was under code review. The fix itself was indeed as simple as it looks, but everything else wasn't. <!--more-->

As is the standard procedure, after figuring out the fix I went to look at the unit tests for this particular function, except there weren't any. In fact, there were no tests for this module at all, which contains multiple classes and functions.

I was pretty sure my fix was correct, but it didn't feel right to push things without any tests and I told my manager as much. She took a look at it and said, "Ah, why don't you write unit tests for this whole module then."

Should have seen that coming.

So I started digging into the code and began writing tests--but there were many complicated dependencies amongst the classes, and I kept adding things to be mocked. When I was finally done I sent it to my manager for code review, and she asked me, "Did you know about MagicMock? That'll probably make it easier and you don't have to mock so many things." 

And it was like somebody suddenly shone a light. I had heard about [MagicMock](http://www.voidspace.org.uk/python/mock/magicmock.html#mock.MagicMock) before, but I have never used it personally and while caught up in writing code it just didn't occur to me that MagicMock would be useful for what I wanted to do. I guess it just goes to show the importance of taking a step back and thinking about the problem before diving into code. 

---

Let's say we have a function `dosomething` whose argument is an instance of class A. That class A has an attribute which is an instance of class B, and B has an attribute containing a list of objects of class C. So the function looks something like this:

```python
def dosomething(objA):
    alist = objA.objB.some_attribute
    for objC in alist:
        print objC.name
        print objC.value
```

To test this function, we would have to mock class A. Without MagicMock, we would need to create a mock for multiple classes, like so:

```python
class C:
    def __init__(self, name=None, value=None):
        self.name = name
        self.value = value

class B:
    def __init__(self):
        self.some_attribute = [] # this will be a list of instances of class C

class A:
    def __init__(self):
        self.objB = B()

```

Then to use this in your unit test:

```python
import unittest

class RandomTests(unittest.TestCase):

    def test_dosomething(self):
        a = A()
        a.objB.some_attribute = [C('somename', 'somevalue')]
        dosomething(a)
        # then assert one output
```

All these just to pass the correction argument into the function `dosomething` so that it doesn't complain about attribute errors. 

But with magic mock, we don't need to manually mock all our classes, and it just becomes:

```python
import unittest
from mock import MagicMock

class RandomTests(unittest.TestCase):

    def test_dosomething(self):
        a = MagicMock()
        a.objB.some_attribute = [MagicMock(name='somename', value='somevalue')]
        dosomething(a)
        # then assert on output
```

It's just like magic!