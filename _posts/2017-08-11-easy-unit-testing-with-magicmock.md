---
title: Easy unit testing with MagicMock
excerpt: MagicMock is incredibly useful for python unit testing in many ways. This is one simple use case where it is particularly convenient.
---

At my internship, after writing unit tests for every tiny thing and a code review from my supervisor, I finally felt the usefulness of MagicMock.

According to the documentation, [`MagicMock`](http://www.voidspace.org.uk/python/mock/magicmock.html#mock.MagicMock) is a subclass of `Mock` with default implementations of most of the magic methods. 

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